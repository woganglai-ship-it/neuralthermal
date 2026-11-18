const labs:Record<string,string>={h100:'/tools/h100/index.html',heatsink:'/tools/heatsink/index.html','chip-thermal':'/tools/chip-thermal/index.html','advanced-packaging':'/labs/advanced-packaging/',neurovis:'/tools/neurovis/index.html','space-radiator':'/tools/space-radiator/index.html'};
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(v=>v.toString(16).padStart(2,'0')).join('');
const reply=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function labAccess(req:Request,env:any):Promise<Response|null>{
 const url=new URL(req.url),path=url.pathname;
 const lab=Object.keys(labs).find(id=>path.startsWith(labs[id].slice(0,labs[id].lastIndexOf('/')+1)));
 if(!lab&&!path.startsWith('/access/'))return null;
 const call=async(b:any)=>{const r=await env.LEADS.get(env.LEADS.idFromName('workspace')).fetch('https://store/',{method:'POST',body:JSON.stringify(b)});if(!r.ok)throw Error('Lead store unavailable');return r.json() as Promise<any>;};
 const token=req.headers.get('Cookie')?.match(/(?:^|;\s*)nt_lab=([^;]+)/)?.[1];
 const session=token?await call({action:'visitorCheck',token:await hash(token)}):null;
 if(path==='/access/register'){
  if(req.method!=='POST')return reply({error:'POST required'},405);
  if(req.headers.get('Origin')!==url.origin)return reply({error:'Invalid origin'},403);
  if(+(req.headers.get('Content-Length')||0)>4096)return reply({},413);
  const text=await req.text();if(text.length>4096)return reply({},413);
  let b:any;try{b=JSON.parse(text);}catch{return reply({error:'Invalid form'},400);}
  if(!b||typeof b!=='object'||!Object.hasOwn(labs,b.lab)||b.consent!==true||b.website)return reply({error:'请检查表单 / Please check the form'},400);
  for(const k of ['name','company','email','interest'])if(typeof b[k]!=='string'||!b[k].trim()||b[k].length>(k==='email'?254:100))return reply({error:'请填写完整资料 / Complete all required fields'},400);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))return reply({error:'邮箱格式不正确 / Invalid email'},400);
  const limit=await call({action:'visitorLimit',key:await hash((req.headers.get('CF-Connecting-IP')||'local')+new Date().toISOString().slice(0,10))});
  if(!limit.allowed)return reply({error:'提交过于频繁，请稍后再试 / Please try again later'},429);
  const raw=crypto.randomUUID()+crypto.randomUUID();
  await call({action:'visitorRegister',token:await hash(raw),profile:{name:b.name.trim(),company:b.company.trim(),email:b.email.trim().toLowerCase(),interest:b.interest.trim(),lab:b.lab,contactConsent:b.contactConsent===true,consentVersion:'2026-11-06',emailVerified:false}});
  const r=reply({ok:true,url:labs[b.lab]+'?lang='+(b.lang==='en'?'en':'zh')});
  r.headers.set('Set-Cookie',`nt_lab=${raw}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`);return r;
 }
 if(path==='/access/'||path==='/access/index.html'){
  const target=url.searchParams.get('lab')||'h100';
  // 2026-11-18：实验室全部公开，旧的登记链接直接转到对应实验室
  return new Response(null,{status:302,headers:{Location:(Object.hasOwn(labs,target)?labs[target]:'/')+'?lang='+(url.searchParams.get('lang')==='en'?'en':'zh'),'Cache-Control':'no-store'}});
 }
 if(!lab)return env.ASSETS.fetch(req);
 const asset=await env.ASSETS.fetch(req);const out=new Response(asset.body,asset);out.headers.set('Cache-Control','private, no-store');
 if(session&&req.method==='GET'&&out.headers.get('Content-Type')?.includes('text/html')&&out.ok)await call({action:'visitorVisit',id:session.id,lab});
 return out;
}
