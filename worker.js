import model from './private-runtime/model.json';
import {createEngine} from './private-runtime/engine.js';
let engine;
const routes=new Set(['/v1/design/predict','/v1/sensor/estimate','/v1/workflow/sweep']);
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {
 async fetch(request,env){
  const url=new URL(request.url), prefix='/api-studio';
  if(!url.pathname.startsWith(prefix+'/v1/'))return env.ASSETS.fetch(request);
  const path=url.pathname.slice(prefix.length);
  if(path==='/v1/health'&&request.method==='GET')return json({status:'ok',mode:'public_demo',model:model.id,version:model.version,solver_verification:false});
  if(!routes.has(path))return json({message:'接口未开放。完整求解器复核保留在本地完整版。'},404);
  if(request.method!=='POST')return json({message:'POST required'},405);
  if(request.headers.get('Authorization')!=='Bearer nt_demo_2026')return json({message:'Invalid demo API key'},401);
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return json({message:'Cross-origin requests not enabled'},403);
  // Demo credential is public. Bound input and compute cost independently of authentication.
  if(+(request.headers.get('Content-Length')||0)>100000)return json({message:'Request too large'},413);
  const text=await request.text();if(text.length>100000)return json({message:'Request too large'},413);
  let body;try{body=JSON.parse(text);}catch{return json({message:'Invalid JSON'},400);}
  if(!body||typeof body!=='object'||Array.isArray(body))return json({message:'JSON object required'},400);
  if(path==='/v1/sensor/estimate'){
   const series=body.series||{};for(const key of ['t_s','power_kw','flow_lpm','inlet_c','hotspot_share'])if(!Array.isArray(series[key])||!series[key].every(Number.isFinite))return json({message:'Finite numeric series required'},400);
  }
  if(path==='/v1/workflow/sweep'){
   const axes=Object.values(body.ranges||{});if(axes.length!==4||axes.some(a=>!Array.isArray(a)||a.length!==3||!a.every(Number.isFinite)||!Number.isInteger(a[2])||a[2]<1)||axes.reduce((n,a)=>n*a[2],1)>256)return json({message:'公开演示单次最多 256 个设计，请减少点数。'},422);
  }
  for(const value of [body.limit_c,body.hysteresis_k,...Object.values(body.constraints||{})])if(value!==undefined&&!Number.isFinite(value))return json({message:'Finite numeric constraints required'},400);
  engine ||= createEngine(model);
  try{const result=engine.call(path,body,'nt_demo_2026');result.body.request_id='req_'+crypto.randomUUID();return json(result.body,result.status);}
  catch{return json({message:'Invalid request structure'},400);}
 }
};
