const params=new URLSearchParams(location.search);
const language=params.get('lang')==='en'?'en':'zh';
const isEn=language==='en';
const items:Record<string,{zh:string;en:string;img:string;zhText:string;enText:string;zhPoints:string[];enPoints:string[]}>={
 'space-radiator':{zh:'太空散热实验室',en:'Space Radiator Lab',img:'tool-space-radiator',zhText:'多少算力，需要多大一块散热板？',enText:'How much radiator area does space computing need?',zhPoints:['调整功耗、板温与轨道环境','比较散热板和太阳翼面积','探索卫星布局与系统质量'],enPoints:['Adjust power, temperature and orbital environment','Compare radiator and solar-array areas','Explore satellite layout and system mass']},
 neurovis:{zh:'NeuroVis CNN 实验室',en:'NeuroVis CNN Lab',img:'tool-neurovis',zhText:'手写数字，直观看见神经网络逐层识别的过程。',enText:'Draw a digit and see how a neural network recognizes it, layer by layer.',zhPoints:['手写数字并查看识别结果','逐层探索特征图与预测概率','打开卷积详情，观察计算过程'],enPoints:['Draw digits and view predictions','Explore feature maps and prediction probabilities','Open convolution details to inspect the computation']},
 h100:{zh:'H100 液冷实验室',en:'H100 Liquid-Cooling Lab',img:'tool-h100',zhText:'改变功耗与冷却条件，直观看见芯片温度如何变化。',enText:'Explore how power and cooling conditions change chip temperatures.',zhPoints:['调整功耗、流量和进液温度','查看三维稳态温度分布','对比 AI 预测与物理求解'],enPoints:['Adjust power, flow and inlet temperature','Explore the 3D steady-state temperature field','Compare AI predictions with the physics solver']},
 heatsink:{zh:'Heatsink选型实验室',en:'Heatsink Selection Lab',img:'tool-heatsink',zhText:'从器件到散热器与风扇，快速比较风冷方案。',enText:'Compare air-cooling options across devices, heatsinks and fans.',zhPoints:['选择器件与散热器尺寸','调整风扇和散热条件','比较结温、热阻、压降与重量'],enPoints:['Select devices and heatsink dimensions','Adjust fans and cooling conditions','Compare temperature, resistance, pressure drop and weight']},
 'chip-thermal':{zh:'芯片温度实验室',en:'Chip Thermal Lab',img:'tool-chip-thermal',zhText:'探索 CPU 与 GPU 的功率分布和热点。',enText:'Explore power distribution and hotspots in CPUs and GPUs.',zhPoints:['选择不同 CPU 或 GPU','调整负载、功耗与冷却条件','观察模块功率与温度分布'],enPoints:['Choose a CPU or GPU','Adjust load, power and cooling','Explore module power and temperature maps']},
 'advanced-packaging':{zh:'先进封装实验室',en:'Advanced Packaging Lab',img:'tool-advanced-packaging-top',zhText:'从芯片到互连，交互探索先进封装的内部结构。',enText:'Explore advanced packages from chips to interconnects.',zhPoints:['查看 SoC 与 HBM 的布局','旋转、拆解封装层叠','切换互连与组件显示'],enPoints:['Explore SoC and HBM layouts','Rotate and explode the package stack','Toggle interconnects and components']}
};
const lab=Object.hasOwn(items,params.get('lab')||'')?params.get('lab')!:'h100',item=items[lab];
const el=(id:string)=>document.getElementById(id)!;
const put=(id:string,zh:string,en:string)=>el(id).textContent=isEn?en:zh;
document.documentElement.lang=isEn?'en':'zh-CN';document.title=(isEn?item.en:item.zh)+' · NeuralThermal';
put('eyebrow','交互式实验室 · 免费体验','INTERACTIVE LAB · FREE ACCESS');put('title',item.zh,item.en);put('intro',item.zhText,item.enText);put('learn','在这里，你可以','What you can explore');
const preview=el('preview') as HTMLImageElement;preview.src='/assets/img/'+item.img+'.jpg';preview.alt=isEn?item.en:item.zh;
el('benefits').innerHTML=(isEn?item.enPoints:item.zhPoints).map(s=>'<li>'+s+'</li>').join('');
put('form-title','填写资料，开始探索','Tell us about yourself');put('form-intro','提交后即可进入实验室，无需设置密码。','Get immediate lab access. No password required.');
put('name-label','姓名 *','Name *');put('company-label','公司 / 机构 *','Company / organization *');put('email-label','邮箱 *','Email *');put('interest-label','关注方向 *','Area of interest *');
const interests=[['封装与芯片','Packaging & chips'],['液冷','Liquid cooling'],['电驱与功率器件','Electric drives & power electronics'],['电机与机器人','Motors & robotics'],['其他','Other']];
const select=document.querySelector<HTMLSelectElement>('[name=interest]')!;
select.innerHTML='<option value="">'+(isEn?'Select an area':'请选择关注方向')+'</option>'+interests.map(([zh,en])=>'<option value="'+zh+'">'+(isEn?en:zh)+'</option>').join('');
el('consent-label').innerHTML=isEn?'I agree that NeuralThermal stores my submitted details and lab visit history to provide access and handle my requests. <a href="/access/privacy.html?lang=en" target="_blank" rel="noopener">Privacy details</a>':'我同意 NeuralThermal 保存所填资料及实验室访问记录，用于开通访问和处理我的需求。<a href="/access/privacy.html" target="_blank" rel="noopener">隐私说明</a>';
put('contact-label','我愿意就相关技术需求接受 NeuralThermal 联系（选填）。','NeuralThermal may contact me about relevant technical needs (optional).');
put('submit','进入实验室 →','Enter the lab →');put('note','本浏览器 30 天内免重复填写。支持 QQ、163 等常用邮箱。','Access lasts 30 days in this browser. Personal email addresses are welcome.');put('back','全部实验室','All labs');
el('lang').textContent=isEn?'中文':'EN';el('lang').onclick=()=>{params.set('lang',isEn?'zh':'en');location.search=params.toString();};
(el('back') as HTMLAnchorElement).href='/?lang='+language+'#/labs';
const form=el('access-form') as HTMLFormElement;
form.onsubmit=async event=>{event.preventDefault();if(!form.reportValidity())return;const button=el('submit') as HTMLButtonElement;button.disabled=true;put('status','正在开通访问…','Opening access…');
 const fields=Object.fromEntries(new FormData(form));
 try{const response=await fetch('/access/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,lab,lang:language,consent:fields.consent==='on',contactConsent:fields.contactConsent==='on'})});const result=await response.json();if(!response.ok)throw Error(result.error||'提交失败 / Submission failed');location.assign(result.url);}
 catch(e){el('status').textContent=e instanceof Error?e.message:(isEn?'Please retry.':'提交未完成，请重试。');button.disabled=false;}
};
