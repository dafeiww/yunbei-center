
(() => {
 const initial={checks:[],perks:[],friends:[],usage:[],pass:null,offset:0};
 const s=state.supply=Object.assign(initial,state.supply||{});
 const day=()=>dateKey(new Date(Date.now()+s.offset*86400000));
 const start=()=>weekStart(day());
 const clone=v=>JSON.parse(JSON.stringify(v));
 const definitions={volcano:{name:'高级火山图体验',unit:'次'},palette:{name:'科研配色模板包',unit:'份'},export:{name:'矢量图导出体验',unit:'次'},ai:{name:'AI 分析报告体验',unit:'次'},consult:{name:'科研顾问 1 对 1',unit:'次'},report:{name:'结题报告导出包',unit:'次'}};
 const defaults={version:1,updatedAt:'',checkin:{enabled:true,rewards:[1,1,1,1,1],unlockAt:3,perk:'volcano'},recharge:{enabled:true,weeks:[{name:'高级科研图表体验',desc:'火山图、热图等高级图表模板 + 示例数据',uses:1,kind:'volcano',link:''},{name:'AI 分析报告体验',desc:'上传结果表，AI 生成 1 份图文解读报告',uses:1,kind:'ai'},{name:'结题报告导出包',desc:'把本项目图表、AI解读和结论整理成 1 份可交付报告',uses:1,kind:'report'}]},invite:{enabled:true,inviter:[10,20,20],friend:[10,20,20],returnDays:7,monthlyCap:0}};
 if(!state.config.supplyRules)state.config.supplyRules=clone(defaults);
 const cfg=()=>state.config.supplyRules;if(cfg().invite.monthlyCap===undefined||cfg().invite.monthlyCap>0)cfg().invite.monthlyCap=0;
 const rechargeDiscounts=()=>{const d=state.config.rechargeDiscounts||{},num=v=>Number.isFinite(Number(v))?Math.min(10,Math.max(1,Math.round(Number(v)*10)/10)):undefined;return {first:num(d.first)??8,second:num(d.second)??8.8,later:num(d.later)??9};};
 const normalizeWeek=v=>{const kind=typeof v==='string'?v:(v.kind||'volcano'),def=definitions[kind]||definitions.volcano,uses=Math.max(1,Math.round(Number(typeof v==='string'?1:v.uses)||1));return {name:String(typeof v==='string'?def.name:v.name||def.name),desc:String(typeof v==='string'?def.name:v.desc||def.name),uses,kind,link:String(typeof v==='string'?'':v.link||'').trim()};};
 const RECHARGE_STAGE_RESET='2026-11-17-first-discount';if(state.rechargeStageReset!==RECHARGE_STAGE_RESET){state.paidRechargeCount=0;state.rechargeStageReset=RECHARGE_STAGE_RESET;}state.paidRechargeCount=Math.max(0,Math.min(99,Math.round(Number(state.paidRechargeCount)||0)));
 const rechargeStage=()=>((Math.max(0,Math.round(Number(state.paidRechargeCount)||0)))%4);
 const inviteExamples=[['林同学',1,1],['陈同学',2,4],['周同学',3,9]].map(([name,stage,age],i)=>({id:'DEMO-SUPPLY-'+i,name,created:shiftedDay(day(),-age),stage,reward:defaults.invite.inviter.slice(0,stage).reduce((a,b)=>a+b,0),friendReward:defaults.invite.friend.slice(0,stage).reduce((a,b)=>a+b,0),rules:clone(defaults.invite),demo:true}));
 s.weekRules=s.weekRules||{};s.events=s.events||[];s.configHistory=s.configHistory||[];if(!state.config.yunbeiTasks)state.config.yunbeiTasks={activityName:'科研云贝任务活动',enabled:true,invite:{daily:3,inviter:10,friend:10},profile:{reward:3},checkin:{reward:1},wechat:{reward:3},avatar:{reward:1}};cfg().checkin.rewards=Array.isArray(cfg().checkin.rewards)?[0,1,2,3,4].map(n=>Math.max(0,Math.round(Number(cfg().checkin.rewards[n])||0))):[1,1,1,1,1];
 const rule=()=>cfg().checkin;
 const log=(who,source,kind,amount,reference='')=>s.events.unshift({id:uid('AW'),day:day(),who,source,kind,amount,reference});
 const grant=(id,perk,source)=>{if(s.perks.some(p=>p.id===id))return id;const total=Math.max(1,Math.round(Number(perk.uses)||1));s.perks.push({id,kind:perk.kind||'volcano',name:perk.name,desc:perk.desc||'',totalUses:total,usedUses:0});log('当前用户',source,perk.name+' × '+total,1,id);return id;};
 const legacyGifts=['科研配色模板包','矢量图导出体验','专家图表美化服务'];
cfg().recharge.weeks=(Array.isArray(cfg().recharge.weeks)&&cfg().recharge.weeks.length===3?cfg().recharge.weeks.map((week,i)=>legacyGifts.includes(week.name)||['expert','consult'].includes(week.kind)?clone(defaults.recharge.weeks[i]):week):clone(defaults.recharge.weeks)).slice(0,3).map(normalizeWeek);
 if(s.pass)s.pass.weeks=(Array.isArray(s.pass.weeks)&&s.pass.weeks.length===3?s.pass.weeks:clone(cfg().recharge.weeks)).slice(0,3).map(normalizeWeek);
 s.perks.forEach(p=>{if(!p.totalUses){p.totalUses=1;p.usedUses=p.used?1:0;}p.used=p.usedUses>=p.totalUses;});
 let activePerkId=null;

 const checks=()=>s.checks.filter(c=>c.day>=start()&&c.day<=shiftedDay(start(),6));
 const done=()=>checks().some(c=>c.day===day());
 const put=()=>persist();
 const button=(action,label,disabled=false)=>`<button type="button" class="btn primary" data-supply="${action}" ${disabled?'disabled':''}>${label}</button>`;
 function trialSvg(){let dots='';for(let i=0;i<84;i++){const x=61+(i*61%462),y=267-((i*43%190));const dx=(x-292)/90;const sig=y<184&&Math.abs(dx)>1;dots+=`<circle cx="${x}" cy="${y}" r="${sig?4.5:3.5}" fill="${sig?(dx>0?'#e79a5e':'#699bb8'):'#c2ccd3'}" opacity=".85"/>`;}return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 340"><rect width="580" height="340" fill="white"/><text x="290" y="30" text-anchor="middle" font-size="17" fill="#344454">Volcano plot · Example data</text><path d="M55 55V280H540" fill="none" stroke="#9eaab5"/><path d="M55 184H540M202 55V280M382 55V280" stroke="#dce3e8" stroke-dasharray="5 5"/>${dots}<text x="290" y="321" text-anchor="middle" font-size="13" fill="#71818e">log2 fold change</text><text x="18" y="170" transform="rotate(-90 18 170)" text-anchor="middle" font-size="12" fill="#71818e">−log10 adjusted P</text></svg>`;}
 function perkRemaining(p){return Math.max(0,(p.totalUses||1)-(p.usedUses||0));}
 function useTrial(perkId=null){
  const perk=perkId?s.perks.find(p=>p.id===perkId&&perkRemaining(p)>0):null;
  if(perkId&&!perk){toast('这份权益次数已用完。');return;}
  if(perk?.link){const win=window.open(perk.link,'_blank','noopener');if(win){toast('已打开'+perk.name+'对应页面。');return;}openModal('打开'+perk.name,`<p class="supply-modal-note">浏览器拦截了自动跳转，请点击下方链接。</p><div class="modal-actions"><a class="btn primary" href="${esc(perk.link)}" target="_blank" rel="noopener">去使用</a></div>`);return;}
  activePerkId=perk?.id||null;
  const palette=perk?.kind==='palette',ai=perk?.kind==='ai',consult=perk?.kind==='consult',report=perk?.kind==='report';
  const aiArt=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 300"><rect width="580" height="300" fill="white"/><text x="40" y="46" font-size="18" fill="#344454">AI Research Report</text><rect x="40" y="72" width="500" height="14" rx="7" fill="#dce3e8"/><rect x="40" y="100" width="360" height="14" rx="7" fill="#e9edf1"/><rect x="40" y="138" width="180" height="112" rx="10" fill="#fff3e4" stroke="#f0d8b6"/><rect x="240" y="138" width="140" height="112" rx="10" fill="#eef6ff" stroke="#d7e7f5"/><rect x="400" y="138" width="140" height="112" rx="10" fill="#f0f7f2" stroke="#d7e9dc"/><text x="130" y="202" text-anchor="middle" font-size="14" fill="#b17b40">Result</text><text x="310" y="202" text-anchor="middle" font-size="14" fill="#3f7cae">Insight</text><text x="470" y="202" text-anchor="middle" font-size="14" fill="#328365">Next</text></svg>`;
  const reportArt=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 300"><rect width="580" height="300" fill="white"/><text x="40" y="46" font-size="18" fill="#344454">Final Research Report</text><rect x="40" y="72" width="250" height="168" rx="10" fill="#f4f6f8" stroke="#dfe5eb"/><rect x="58" y="94" width="90" height="58" rx="8" fill="#e6eef4"/><rect x="158" y="94" width="90" height="58" rx="8" fill="#e6eef4"/><rect x="58" y="164" width="190" height="10" rx="5" fill="#dce3e8"/><rect x="58" y="184" width="150" height="10" rx="5" fill="#e9edf1"/><rect x="58" y="204" width="170" height="10" rx="5" fill="#eef1f4"/><rect x="310" y="72" width="230" height="168" rx="10" fill="#fff5e6" stroke="#f0d8b6"/><rect x="330" y="94" width="190" height="12" rx="6" fill="#f3dab8"/><rect x="330" y="118" width="160" height="10" rx="5" fill="#fae8ce"/><rect x="330" y="138" width="180" height="10" rx="5" fill="#fff0d8"/><rect x="330" y="158" width="140" height="10" rx="5" fill="#fae8ce"/><rect x="330" y="178" width="120" height="40" rx="8" fill="#ffedd2"/><text x="390" y="204" text-anchor="middle" font-size="12" fill="#b17b40">结论 &amp; 建议</text></svg>`;
  const consultArt=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 300"><rect width="580" height="300" fill="white"/><text x="40" y="46" font-size="18" fill="#344454">1-on-1 Research Review</text><rect x="40" y="78" width="230" height="150" rx="12" fill="#f4f6f8" stroke="#dfe5eb"/><rect x="60" y="102" width="190" height="10" rx="5" fill="#dce3e8"/><rect x="60" y="126" width="150" height="10" rx="5" fill="#e9edf1"/><rect x="60" y="150" width="120" height="44" rx="8" fill="#e6eef4"/><text x="120" y="178" text-anchor="middle" font-size="12" fill="#6f8492">你的图 / 思路</text><rect x="310" y="78" width="230" height="150" rx="12" fill="#fff5e6" stroke="#f0d8b6"/><rect x="330" y="102" width="190" height="10" rx="5" fill="#f3dab8"/><rect x="330" y="126" width="160" height="10" rx="5" fill="#fae8ce"/><rect x="330" y="150" width="120" height="44" rx="8" fill="#ffedd2"/><text x="390" y="178" text-anchor="middle" font-size="12" fill="#b17b40">顾问建议</text><path d="M272 153h34" stroke="#e79a5e" stroke-width="3"/><path d="M300 147l8 6-8 6" fill="none" stroke="#e79a5e" stroke-width="3"/></svg>`;
  const art=palette?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 270"><rect width="580" height="270" fill="white"/><text x="34" y="40" font-size="18" fill="#344454">Research color palette</text>${['#699bb8','#e79a5e','#92b29e','#ae9bc3','#d0ad6d'].map((c,i)=>`<rect x="${34+i*104}" y="72" width="90" height="118" rx="8" fill="${c}"/><text x="${79+i*104}" y="216" text-anchor="middle" font-size="13" fill="#53616f">${c}</text>`).join('')}</svg>`:ai?aiArt:report?reportArt:consult?consultArt:trialSvg();
  const remaining=perk?perkRemaining(perk):0;
  openModal(perk?.name||'示例绘图体验',`<p class="supply-modal-note">${esc(perk?.desc||'')}</p><div class="supply-chart" id="supply-chart">${art}</div><p class="supply-modal-note">${perk?`本次消耗 1 次使用额度 · 剩余 ${remaining}/${perk.totalUses} 次。`:'当前为免费示例，用于体验操作流程。'}</p><div class="modal-actions">${button('export',palette?'下载配色模板':ai?'导出分析报告，完成体验':report?'导出结题报告，完成体验':consult?'预约顾问咨询，完成体验':'导出示例图，完成体验')}</div>`);
 }
 function exportTrial(){
  const art=$('#supply-chart svg');if(!art)return;
  const perk=activePerkId?s.perks.find(p=>p.id===activePerkId&&perkRemaining(p)>0):null;
  const url=URL.createObjectURL(new Blob([art.outerHTML],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=(perk?.name||'基因云-示例火山图')+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  s.usage.push({day:day(),id:uid('USE')});if(perk){perk.usedUses=(perk.usedUses||0)+1;perk.used=perkRemaining(perk)<1;log('当前用户','权益使用',perk.name+'（第'+perk.usedUses+'次）',1,perk.id);}activePerkId=null;put();closeModal();renderAll();toast(perk&&!perk.used?'使用成功，还剩 '+perkRemaining(perk)+' 次。':'文件已导出，本次体验已完成。');
 }
 function track(){
  const r=rule(),rewards=[0,1,2,3,4].map(n=>Math.max(0,Number(r.rewards?.[n])||0)),n=Math.min(5,checks().length),total=rewards.reduce((a,b)=>a+b,0),earned=rewards.slice(0,n).reduce((a,b)=>a+b,0);
  if(!cfg().checkin.enabled)return '<div class="supply-paused">签到暂未开放，已获得的云贝保留。</div>';
  return `<div class="supply-track-head"><strong>本周签到进度 ${n}/5</strong><span>${earned}/${total} 云贝</span></div><div class="supply-days">${rewards.map((reward,i)=>`<div class="supply-day ${i<n?'done':''}"><b>${i<n?'✓':'+'+reward}</b><span>第${i+1}次</span></div>`).join('')}</div><div class="supply-track-bottom"><span>${n>=5?'本周已领满 '+total+' 云贝':'第 '+(n+1)+' 次可领 +'+rewards[n]+' 云贝 · 已累计 '+earned+' 云贝'}</span>${button('check',n>=5?'本周已领满':done()?'今日已签到':'签到领云贝',n>=5||done())}</div>`;
 }
 function sign(){
  if(!cfg().checkin.enabled){toast('签到暂未开放。');return;}
  const rewards=[0,1,2,3,4].map(n=>Math.max(0,Number(rule().rewards?.[n])||0));const n=checks().length;if(done()||n>=5)return showCheck();
  if(!s.weekRules[start()])s.weekRules[start()]=clone(cfg().checkin);
  const reward=rewards[n]||0;s.checks.push({day:day(),reward});addCredit(reward,'checkin','签到得云贝 · 本周第 '+(n+1)+' 次签到');log('当前用户','签到奖励','云贝',reward,start());put();renderAll();showCheck(reward);
 }
 function showCheck(reward=0){const rewards=[0,1,2,3,4].map(n=>Math.max(0,Number(rule().rewards?.[n])||0));openModal('签到得云贝',`${reward?`<div class="supply-award">签到成功，${reward} 云贝已到账。</div>`:''}${track()}<p class="supply-modal-note" style="margin-top:18px">一周任选 5 天签到，不要求连续；第 1–5 次奖励分别为 ${rewards.join('/')} 云贝。已获得的云贝保留。</p>`);}
 const rechargePanel=$('#panel-recharge');
  const nativeQuote=rechargeQuote;
 rechargeQuote=function(id=selectedPlan){const q=nativeQuote(id);if(!q)return q;if(state.config?.rechargeActivityName){return {...q,first:true,rechargeStage:0,discountExhausted:false,discountZhe:q.discountZhe,discountLabel:formatZhe(q.discountZhe),paidCents:q.paidCents};}const d=rechargeDiscounts(),stage=rechargeStage(),zhe=stage===0?d.first:stage===1?d.second:stage===2?d.later:10;const label=stage===0?'首充 '+formatZhe(d.first):stage===1?'第2次 '+formatZhe(d.second):stage===2?'第3次 '+formatZhe(d.later):'第4次 原价';return {...q,first:stage===0,rechargeStage:stage,discountExhausted:false,discountZhe:zhe,discountLabel:label,paidCents:Math.round(q.faceCents*zhe/10)};};
 const nativeComplete=completeRecharge;
 completeRecharge=function(q){const order=nativeComplete(q);if(order){state.paidRechargeCount=Math.min(99,(Number(state.paidRechargeCount)||0)+1);if(order.first&&!s.pass&&cfg().recharge.enabled)s.pass={start:day(),usageStart:s.usage.length,claimed:[],weeks:clone(cfg().recharge.weeks).map(normalizeWeek)};put();}return order;};
 const passLabels={unpaid:'首充后开启',future:'待开启',task:'完成使用后可领',ready:'可领取',claimed:'已领取',expired:'已过期'};
 function renderRechargePass(){
  const card=$('#supply-recharge-pass');if(!card)return;
  const enabled=cfg().recharge.enabled,weeks=s.pass?s.pass.weeks:cfg().recharge.weeks;
  card.hidden=!enabled;
  if(!enabled)return;
  const status=s.pass?passStatus(0):'unpaid';
  $('#supply-pass-state').textContent=!s.pass?'未开启':['claimed','expired'].every(v=>[0,1,2].some(i=>passStatus(i)===v))?'已完成':status==='expired'?'部分已过期':'进行中';
  $('#supply-pass-grid').innerHTML=weeks.map((week,i)=>{
   const st=passStatus(i);
   const action=st==='ready'?button('claim-open-'+i,'领取权益'):'';
   return `<article class="supply-pass-item status-${st}"><div class="supply-pass-week"><b>${i+1}</b><span>第 ${i+1} 周</span><small>充值后第 ${i*7+1}—${i*7+7} 天</small></div><strong>${esc(week.name)}</strong><p>${esc(week.desc||'')} · 可用 ${week.uses} 次</p><div class="supply-pass-foot"><em>${passLabels[st]}</em>${action}</div></article>`;
  }).join('');
 }
 const nativeRecharge=renderRecharge;
 renderRecharge=function(){nativeRecharge();const q=rechargeQuote();if(!q)return;const payBtn=$('#simulate-pay');if(payBtn)payBtn.textContent='确认明细';const nameTag=$('#plans-offer-title');const nameWrap=nameTag?.closest('.plans-offer-tag');const actName=String(state.config.rechargeActivityName||'').trim();if(nameTag){nameTag.textContent=actName;if(nameWrap)nameWrap.hidden=!actName;}$('#checkout-first-tag').textContent=q.discountLabel;$('.quote-discount span').textContent=q.discountLabel+'优惠';$('.quote-discount').hidden=q.discountZhe>=10;$('#checkout-first-tag').hidden=false;$$('.plan-rate').forEach(e=>e.hidden=false);renderRechargePass();};
 const nativePay=payRecharge;
 payRecharge=function(){
 const quote=pendingRecharge||rechargeQuote();if(!quote){toast('请先选择充值档位。');return;}
 openModal('支付确认明细',`<div class="exchange-preview">${icon('coin')}<div><h3>请核对支付信息</h3><p>确认后完成本次充值（演示环境不真实扣款）</p></div></div><div class="detail-line"><span>充值原价</span><strong>${money(quote.faceCents)}</strong></div><div class="detail-line"><span>折扣优惠</span><strong>−${money(quote.faceCents-quote.paidCents)}（${quote.discountZhe} 折）</strong></div><div class="detail-line"><span>到账云贝</span><strong>${fmt(quote.total)} 云贝</strong></div><div class="detail-line total"><span>实付金额</span><strong>${money(quote.paidCents)}</strong></div><div class="modal-note">${icon('file')}<span>充值订单可按实付金额申请发票。</span></div><div class="modal-actions"><button class="btn primary" data-action="confirm-pay">确认支付</button></div>`);
};
function confirmPayNow(){const quote=pendingRecharge||rechargeQuote();if(!quote)return;$('#simulate-pay').disabled=true;const order=completeRecharge(quote);if(!order){showError('充值优惠状态已变化，请刷新后重新确认订单。');return;}rechargePage=1;pendingRecharge=null;if(typeof clearPaymentTimer==='function')clearPaymentTimer();closeModal();renderAll();toast(`充值成功，${fmt(order.total)} 云贝已到账，实付 ${money(order.paidCents)}`);setTab('recharge-orders');}
function ybTaskCfg(){
 const d={activityName:'科研云贝任务活动',enabled:true,tasks:{
  invite:{name:'邀请好友得云贝',desc:'只有未注册基因云的新账号有效，双方注册成功即得云贝。',link:'https://www.genescloud.cn/home',daily:3,inviter:10,friend:10},
  profile:{name:'完善个人中心',desc:'补充职称、单位和研究方向。',reward:3},
  checkin:{name:'签到得云贝',desc:'每周任选 5 天，按后台配置奖励。',reward:1},
  wechat:{name:'绑定微信',desc:'绑定后可同步消息和快捷登录。',reward:3},
  avatar:{name:'上传个人图像',desc:'上传头像，让协作更亲切。',reward:1}
 }};
 if(!state.config.yunbeiTasks)state.config.yunbeiTasks=clone(d);
 const c=state.config.yunbeiTasks;
 if(!c.tasks)c.tasks=clone(d.tasks);
 const deleted=new Set(Array.isArray(c.deletedTasks)?c.deletedTasks:[]);
 const legacy={invite:c.invite,profile:c.profile,checkin:c.checkin,wechat:c.wechat,avatar:c.avatar};Object.keys(d.tasks).forEach(id=>{if(deleted.has(id))return;if(!c.tasks[id])c.tasks[id]={...d.tasks[id],...(legacy[id]||{})};});
 const tasks={};
 Object.keys(d.tasks).forEach(id=>{if(deleted.has(id))return;tasks[id]={...d.tasks[id],...(c.tasks[id]||{})};if(id==='profile'&&tasks[id].desc==='补充昵称、研究方向和所在单位。')tasks[id].desc='补充职称、单位和研究方向。'; if(!c.tasks[id])c.tasks[id]=tasks[id];});
 Object.keys(c.tasks||{}).forEach(id=>{if(!tasks[id])tasks[id]={...(c.tasks[id]||{}),custom:true};});
 return {...d,...c,tasks};
}
function ensureTaskData(){if(!state.taskData)state.taskData={completed:[],checkinDate:'',invite:{date:'',count:0}};if(!Array.isArray(state.taskData.completed))state.taskData.completed=[];if(state.taskData.invite?.date!==day())state.taskData.invite={date:day(),count:0};}
function taskCompleted(id){ensureTaskData();return state.taskData.completed.includes(id);}
function inviteDailyCount(){ensureTaskData();return state.taskData.invite.count;}
function inviteDailyLimit(){return Math.max(0,Number(ybTaskCfg().invite.daily)||0);}
function inviteAllRecords(){return [...(state.invites||[]),...(state.inviteExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));}
function taskIcon(id){return {invite:'users',profile:'user',checkin:'gift',wechat:'wechat',avatar:'image'}[id]||'gift';}
function taskCard(id,title,desc,reward,status,doneOverride){
 const done=id==='invite'?false:(doneOverride??taskCompleted(id));
 const unbind=id==='wechat'&&done;
 const label=id==='invite'?'去邀请':unbind?'去解绑':done?'已完成':'去完成';
 const rewardText=id==='invite'?esc(String(reward)):'+'+reward;
 const savedIcon=ybTaskCfg().tasks[id]?.icon||'';
 const iconMarkup=savedIcon?`<img class="task-icon-img" src="${esc(savedIcon)}" alt="">`:`<svg class="icon"><use href="#i-${taskIcon(id)}"></use></svg>`;
 return `<article class="yunbei-task-card task-${id} ${done?'done':''}"><div class="yunbei-task-main"><span class="yunbei-task-icon ${id==='wechat'?'wechat':''}" aria-hidden="true">${iconMarkup}</span><div class="yunbei-task-content"><span class="yunbei-task-kind">${(ybTaskCfg().tasks[id]||{}).custom?'自定义任务':(id==='invite'||id==='checkin'?'每日任务':'成长任务')}</span><h4>${esc(title)}</h4><p>${esc(desc)}</p><small>${esc(status)}</small></div></div><div class="yunbei-task-side"><b>${rewardText}</b><span>云贝</span><button class="btn ${unbind?'':'primary'}" type="button" data-supply-task="${unbind?'wechat-unbind':id}" ${done&&!unbind?'disabled':''}>${label}</button></div></article>`;
}
function renderTaskCenter(){
 const box=$('#panel-invite');if(!box)return;ensureTaskData();const c=ybTaskCfg(),limit=inviteDailyLimit(),count=inviteDailyCount(),records=inviteAllRecords(),link=inviteShareUrl();
 const canInvite=limit===0||count<limit;
 const cards=[];
 ['invite','profile','checkin','wechat','avatar',...Object.keys(c.tasks||{})].filter((id,i,arr)=>c.tasks[id]&&arr.indexOf(id)===i).forEach(id=>{
  const t=c.tasks[id];
  if(id==='invite')cards.push(taskCard('invite',t.name,t.desc,`${t.inviter}/${t.friend}`,`今日 ${limit===0?'不限':count+'/'+limit} 位 · 已成功 ${records.length} 位`));
  else if(id==='checkin')cards.push(taskCard('checkin',t.name,t.desc,rule().rewards[Math.min(checks().length,4)]||0,state.taskData.checkinDate===day()||done()?`今日已签到 · ${displayDate(nowIso(),true)}`:'今日未签到',state.taskData.checkinDate===day()||done()));
  else if(id==='profile')cards.push(taskCard('profile',t.name,t.desc,t.reward,taskCompleted('profile')?'资料已完善':'一次性奖励'));
  else if(id==='wechat')cards.push(taskCard('wechat',t.name,t.desc,t.reward,taskCompleted('wechat')?'微信已绑定':'一次性奖励'));
  else if(id==='avatar')cards.push(taskCard('avatar',t.name,t.desc,t.reward,taskCompleted('avatar')?'头像已上传':'一次性奖励'));
  else cards.push(taskCard(id,t.name,t.desc,t.reward||0,taskCompleted(id)?'已完成':'一次性奖励'));
 });
 const rows=records.slice(0,10).map(r=>`<tr><td class="record-title"><div class="invite-person"><span class="invite-person-avatar" aria-hidden="true">${esc(String(r.name).slice(0,1))}</span><div><strong>${esc(r.name)}</strong>${r.demo?'<span class="table-demo">历史示例</span>':''}</div></div></td><td data-label="邀请码"><b>${esc(state.inviteCode)}</b></td><td data-label="我的奖励">+${r.reward||c.tasks.invite?.inviter||10} 云贝</td><td data-label="好友奖励">+${r.friendReward||c.tasks.invite?.friend||10} 云贝</td><td data-label="状态"><span class="tag success">${r.status==='rewarded'?'邀请成功':'已完成'}</span></td></tr>`).join('');
 box.innerHTML=`<div class="yunbei-task-grid">${cards.join('')}</div>`;
}
function completeTask(id,reward,label){ensureTaskData();if(state.taskData.completed.includes(id))return;state.taskData.completed.push(id);addCredit(reward,'task',label);log('当前用户','任务奖励','云贝',reward);persist();renderAll();toast(label+'，'+reward+' 云贝已到账。');}
function taskCheckin(){ensureTaskData();if(state.taskData.checkinDate===day()||done())return toast('今天已完成签到任务。');state.taskData.checkinDate=day();sign();put();}
function openTaskModal(id){
 const c=ybTaskCfg();
 if(id==='invite'){const records=inviteAllRecords(),rows=records.slice(0,10).map(r=>`<tr><td><div class="invite-person"><span class="invite-person-avatar" aria-hidden="true">${esc(String(r.name).slice(0,1))}</span><div><strong>${esc(r.name)}</strong>${r.demo?'<span class="table-demo">示例</span>':''}</div></div></td><td>${displayDate(r.created)}</td><td class="num">+${r.reward||c.tasks.invite.inviter}</td><td class="num">+${r.friendReward||c.tasks.invite.friend}</td><td><span class="tag success">邀请成功</span></td></tr>`).join('');openModal('邀请好友得云贝',`<div class="invite-modal-top"><div class="invite-modal-field"><span>邀请链接（已包含邀请码）</span><input readonly value="${esc(inviteShareUrl())}" onclick="this.select()"></div><button class="btn primary" type="button" data-action="copy-invite-link">复制邀请链接</button></div><div class="invite-modal-summary"><span>今日已邀请 ${inviteDailyCount()}/${inviteDailyLimit()||'不限'} 位</span><span>累计邀请 ${records.length} 位</span><span>链接内邀请码自动识别 · 仅未注册新账号有效</span></div><div class="invite-modal-list"><table><thead><tr><th>好友昵称</th><th>邀请时间</th><th>我的奖励</th><th>好友奖励</th><th>状态</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty-state">还没有邀请记录，复制链接邀请好友吧。</td></tr>'}</tbody></table></div>`);return;}
 if(id==='profile'){openModal('完善个人中心',`<form id="task-profile-form"><div class="field"><label for="task-name">职称</label><input id="task-name" required maxlength="40" placeholder="暂未设置职位"></div><div class="field"><label for="task-org">单位</label><input id="task-org" required maxlength="60" placeholder="暂未设置单位"></div><div class="field"><label for="task-field">研究方向</label><input id="task-field" required maxlength="60" placeholder="暂未设置研究方向"></div><div class="modal-actions"><button class="btn" type="button" data-action="close">取消</button><button class="btn primary" type="submit">保存并领奖</button></div></form>`);return;}
 if(id==='wechat'){openModal('绑定微信',`<div class="wechat-bind-modal"><div class="wechat-bind-qr">${qrSvg('https://genescloud.cn/wechat-bind?code='+esc(state.inviteCode||'DEMO'),190)}</div><div class="wechat-bind-tip">请使用微信扫描二维码完成绑定</div><div class="modal-actions"><button class="btn" type="button" data-action="close">取消</button><button class="btn primary" type="button" data-action="wechat-bind-confirm">我已扫码绑定</button></div></div>`);return;}
 if(id==='avatar'){openModal('上传个人图像',`<form id="task-avatar-form"><div class="field"><label for="task-avatar">选择头像</label><input id="task-avatar" type="file" accept="image/*" required></div><div class="modal-actions"><button class="btn" type="button" data-action="close">取消</button><button class="btn primary" type="submit">上传并领奖</button></div></form>`);return;}
}
function taskInviteSubmit(){
 const name=$('#task-friend-name')?.value.trim(),account=$('#task-friend-key')?.value.trim().toLowerCase(),fail=message=>{const el=$('#modal-error');if(el){el.hidden=false;el.textContent=message;}};
 if(!name||!account)return fail('请填写好友昵称和账号。');const limit=inviteDailyLimit();if(limit>0&&inviteDailyCount()>=limit)return fail('今日邀请人数已达上限。');const c=ybTaskCfg();const exists=inviteAllRecords().some(r=>String(r.friendKey||'').toLowerCase()===account);if(exists)return fail('该账号已在基因云注册过，只有新注册账号才能获得邀请奖励。');
 const id=uid('INV');state.invites.unshift({id,friendKey:account,name,reward:c.tasks.invite.inviter,friendReward:c.tasks.invite.friend,created:nowIso(),status:'rewarded'});state.taskData.invite.count++;addCredit(c.tasks.invite.inviter,'invite','邀请好友注册 · '+name,id);log('受邀好友：'+name,'好友奖励','云贝',c.tasks.invite.friend,id);persist();closeModal();renderAll();toast('邀请成功，双方云贝已到账。');
}
document.addEventListener('click',e=>{const wb=e.target.closest('[data-action="wechat-bind-confirm"]');if(wb){closeModal();completeTask('wechat',ybTaskCfg().wechat.reward,'微信绑定成功');return;}const b=e.target.closest('[data-supply-task]');if(!b||b.disabled)return;e.preventDefault();const id=b.dataset.supplyTask;if(id==='wechat-unbind'){closeModal();actions.profile();toast('请在个人中心解绑微信。');return;}if(id==='checkin')return taskCheckin();openTaskModal(id);});
document.addEventListener('submit',e=>{
 if(e.target.id==='task-invite-form'){e.preventDefault();taskInviteSubmit();return;}
 if(e.target.id==='task-profile-form'){e.preventDefault();if(e.target.reportValidity()){closeModal();completeTask('profile',ybTaskCfg().profile.reward,'个人中心已完善');}return;}
 if(e.target.id==='task-wechat-form'){e.preventDefault();if(e.target.reportValidity()){closeModal();completeTask('wechat',ybTaskCfg().wechat.reward,'微信绑定成功');}return;}
 if(e.target.id==='task-avatar-form'){e.preventDefault();if(e.target.reportValidity()){closeModal();completeTask('avatar',ybTaskCfg().avatar.reward,'个人头像已上传');}return;}
});
renderInvites=function(){renderTaskCenter();};renderTaskCenter();
pageInfo.invite[0]='云贝任务';pageInfo.invite[1]='完成每日任务和成长任务，持续获得云贝。';


let rechargeOrderFilter='all',rechargeOrderPage=1,rechargeOrderKeyword='';
function rechargeOrderRecords(){if(!Array.isArray(state.rechargeFailures))state.rechargeFailures=[{id:'CZFAIL20261001',kind:'recharge',name:'充值 100 元',faceCents:10000,paidCents:0,principal:0,bonus:0,created:addDays(nowIso(),-5),paymentMethod:'wechat',status:'failed',failReason:'支付超时',demo:true},{id:'CZFAIL20261002',kind:'recharge',name:'充值 50 元',faceCents:5000,paidCents:0,principal:0,bonus:0,created:addDays(nowIso(),-2),paymentMethod:'alipay',status:'failed',failReason:'用户取消支付',demo:true}];return [...(state.recharges||[]),...(state.rechargeExamples||[]),...(state.rechargeFailures||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));}
const selectedRechargeOrders=new Set();
function rechargeOrderEligible(o){return o && o.kind==='recharge' && o.status==='paid' && (o.invoice?o.invoice.status==='available':true);}
function updateRechargeOrderMergeSummary(){const list=rechargeOrderRecords().filter(o=>selectedRechargeOrders.has(o.id)&&rechargeOrderEligible(o));const sum=list.reduce((a,o)=>a+(o.invoiceCents||o.paidCents||0),0);const el=$('#recharge-order-merge-summary');if(el)el.textContent=`已选 ${list.length} 笔 · 合计 ${money(sum)}`;}
function renderRechargeOrders(){
 const body=$('#recharge-order-rows');if(!body)return;
 const all=rechargeOrderRecords();const rows=all.filter(o=>{const ok=rechargeOrderFilter==='all'||o.status===rechargeOrderFilter;const kw=rechargeOrderKeyword.trim();return ok&&(!kw||o.id.toLowerCase().includes(kw.toLowerCase())||money(o.paidCents).includes(kw));});
 const pages=Math.max(1,Math.ceil(rows.length/10));rechargeOrderPage=Math.max(1,Math.min(rechargeOrderPage,pages));
 selectedRechargeOrders.forEach(id=>{const o=rechargeOrderRecords().find(x=>x.id===id);if(!o||!rechargeOrderEligible(o))selectedRechargeOrders.delete(id);});
 body.innerHTML=rows.slice((rechargeOrderPage-1)*10,rechargeOrderPage*10).map(o=>{const status=o.status||'paid';const eligible=rechargeOrderEligible(o);return `<tr class="${status==='failed'?'order-failed':''}"><td data-label="选择">${eligible?`<input type="checkbox" class="order-check" data-order-check="${esc(o.id)}" ${selectedRechargeOrders.has(o.id)?'checked':''} aria-label="选择订单 ${esc(o.id)}">`:''}</td><td class="record-title" data-label="充值订单"><div class="order-name">${esc(o.name)}</div><div class="order-id">${esc(o.id)}${o.demo?'<span class="table-demo">历史示例</span>':''}</div></td><td data-label="充值金额">${money(o.faceCents)}</td><td data-label="实付金额">${money(o.paidCents)}</td><td data-label="到账云贝">${status==='failed'?'0 云贝':fmt((o.principal||0)+(o.bonus||0))+' 云贝'}</td><td data-label="支付方式">${o.paymentMethod==='alipay'?'支付宝':'微信支付'}</td><td data-label="状态"><span class="tag ${status==='failed'?'failed':'success'}">${status==='failed'?(o.failReason||'充值失败'):'充值成功'}</span></td><td data-label="操作">${eligible?`<button class="table-action recharge-invoice-action" data-recharge-invoice="${esc(o.id)}">去开票</button>`:`<button class="table-action" data-recharge-order="${esc(o.id)}">查看详情</button>`}</td></tr>`;}).join('')||'<tr><td colspan="8" style="text-align:center;padding:40px">暂无符合条件的充值订单。</td></tr>';
 updateRechargeOrderMergeSummary();$('#recharge-order-total').textContent=pageCaption(rows.length,rechargeOrderPage);$('#recharge-order-pagination').innerHTML=pager(pages,rechargeOrderPage,'recharge-order-page');
}
function rechargeOrderDetail(id){const o=rechargeOrderRecords().find(x=>x.id===id);if(!o)return;const failed=o.status==='failed';openModal('充值订单详情',`<div class="exchange-preview">${icon(failed?'file':'coin')}<div><h3>${esc(o.name)} · ${failed?'充值失败':'已支付'}</h3><p>${failed?esc(o.failReason||'支付未完成'):'云贝已到账'}</p></div></div><div class="detail-line"><span>充值订单号</span><strong style="font-size:11px">${esc(o.id)}</strong></div><div class="detail-line"><span>充值时间</span><strong>${displayDate(o.created,true)}</strong></div><div class="detail-line"><span>充值原价</span><strong>${money(o.faceCents)}</strong></div>${failed?'<div class="detail-line"><span>实付金额</span><strong>¥0.00</strong></div><div class="detail-line"><span>到账云贝</span><strong>0 云贝</strong></div>':`<div class="detail-line"><span>实付金额</span><strong>${money(o.paidCents)}</strong></div><div class="detail-line"><span>到账云贝</span><strong>${fmt((o.principal||0)+(o.bonus||0))} 云贝</strong></div>`}<div class="detail-line"><span>支付方式</span><strong>${o.paymentMethod==='alipay'?'支付宝':'微信支付'}</strong></div>${failed?'<div class="modal-actions"><button class="btn" data-action="close">关闭</button><button class="btn primary" data-tab="recharge">重新充值</button></div>':`<div class="detail-line"><span>可开票金额</span><strong>${money(o.invoiceCents||o.paidCents)}</strong></div><div class="modal-actions"><button class="btn" data-action="close">关闭</button><button class="btn primary" data-invoice-order="${esc(o.id)}">申请开票</button></div>`}`);
}
document.addEventListener('change',e=>{const c=e.target.closest('[data-order-check]');if(c){if(c.checked)selectedRechargeOrders.add(c.dataset.orderCheck);else selectedRechargeOrders.delete(c.dataset.orderCheck);updateRechargeOrderMergeSummary();return;}if(e.target.id==='select-all-recharge-orders'){rechargeOrderRecords().slice((rechargeOrderPage-1)*10,rechargeOrderPage*10).forEach(o=>{if(rechargeOrderEligible(o)){if(e.target.checked)selectedRechargeOrders.add(o.id);else selectedRechargeOrders.delete(o.id);}});renderRechargeOrders();}});
document.addEventListener('click',e=>{const cp=e.target.closest('[data-action="confirm-pay"]');if(cp){confirmPayNow();return;}if(e.target.id==='recharge-order-merge-btn'){const ids=[...selectedRechargeOrders];if(!ids.length){toast('请先勾选可开票的充值订单。');return;}invoiceForm(ids);return;}const f=e.target.closest('[data-recharge-order-status]');if(f){rechargeOrderFilter=f.dataset.rechargeOrderStatus;rechargeOrderPage=1;selectedRechargeOrders.clear();$$('#recharge-order-filters .category').forEach(x=>x.classList.toggle('active',x===f));renderRechargeOrders();return;}const inv=e.target.closest('[data-recharge-invoice]');if(inv){invoiceForm([inv.dataset.rechargeInvoice]);return;}const d=e.target.closest('[data-recharge-order]');if(d){rechargeOrderDetail(d.dataset.rechargeOrder);}});
document.addEventListener('input',e=>{if(e.target.id==='recharge-order-search'){rechargeOrderKeyword=e.target.value;rechargeOrderPage=1;selectedRechargeOrders.clear();renderRechargeOrders();}});
document.addEventListener('click',e=>{const page=e.target.closest('[data-recharge-order-page]');if(page){rechargeOrderPage=Number(page.dataset.rechargeOrderPage);renderRechargeOrders();}});
const nativeAllOrders=renderAll;renderAll=function(){nativeAllOrders();renderRechargeOrders();};


function aiTokenBalance(){if(!Number.isFinite(state.tokenUsed))state.tokenUsed=0;return state.orders.reduce((sum,o)=>sum+(Number(o.tokenAmount)||0),0)-state.tokenUsed;}
const aiModels=[
 {id:'gpt-5.1',name:'GPT-5.1',factor:1.0,note:'通用主力'},
 {id:'gpt-5.1-mini',name:'GPT-5.1 Mini',factor:.6,note:'高性价比'},
 {id:'o4-mini',name:'o4 mini',factor:.8,note:'推理增强'},
 {id:'claude-sonnet-4.5',name:'Claude Sonnet 4.5',factor:1.2,note:'长文分析'},
 {id:'claude-haiku-4.5',name:'Claude Haiku 4.5',factor:.5,note:'快速回答'},
 {id:'gemini-3-pro',name:'Gemini 3 Pro',factor:1.3,note:'多模态'},
 {id:'gemini-2.5-flash',name:'Gemini 2.5 Flash',factor:.5,note:'高速响应'},
 {id:'deepseek-v4-flash',name:'DeepSeek V4 Flash',factor:.4,note:'科研总结'},
 {id:'kimi-k2',name:'Kimi K2',factor:.7,note:'长上下文'},
 {id:'qwen3-max',name:'Qwen3 Max',factor:.8,note:'中文增强'},
 {id:'doubao-1.6-pro',name:'豆包 1.6 Pro',factor:.7,note:'中文对话'},
 {id:'grok-4.1',name:'Grok 4.1',factor:1.2,note:'实时检索'},
 {id:'image-2',name:'Image-2',factor:1.4,note:'图表与图像'}
];
function aiModel(id){return aiModels.find(m=>m.id===id)||aiModels[0];}
function aiEstimateTokens(text,id){const m=aiModel(id);return Math.max(80,Math.round((String(text||'').length+45)*1.1*m.factor));}
function ensureAiChat(){if(!state.aiChat)state.aiChat={model:'deepseek-v4-flash',messages:[{role:'assistant',text:'你好，我已就绪。你可以直接提问，也可以让我帮你梳理研究问题、分析思路或输出结构化结论。',tokens:0}]};if(!Array.isArray(state.aiChat.messages))state.aiChat.messages=[];if(!aiModels.some(m=>m.id===state.aiChat.model))state.aiChat.model='deepseek-v4-flash';}
function aiChatCard(m){return `<div class="ai-message ${m.role}">${esc(m.text)}${m.tokens?`<small>消耗 ${fmt(m.tokens)} Token</small>`:''}</div>`;}
function renderAiChat(){
 const chat=$('#ai-chat-panel');if(!chat)return;const balance=aiTokenBalance();ensureAiChat();
 chat.innerHTML=`<div class="ai-chat"><aside class="ai-chat-side"><h4>模型与额度</h4><div class="meta">剩余 Token<br><strong>${fmt(balance)}</strong><br>已消耗 ${fmt(state.tokenUsed||0)} Token</div><div class="ai-model-list">${aiModels.map(m=>`<button type="button" class="ai-model ${state.aiChat.model===m.id?'active':''}" data-ai-model="${esc(m.id)}"><span>${esc(m.name)}</span><small>${m.factor}x · ${esc(m.note)}</small></button>`).join('')}</div></aside><div class="ai-chat-main"><div class="ai-messages" id="ai-messages">${state.aiChat.messages.map(aiChatCard).join('')}</div><form class="ai-input" id="ai-chat-form"><textarea id="ai-chat-input" placeholder="输入你的问题，Enter 发送，Shift + Enter 换行" required></textarea><div class="ai-input-footer"><small>主流模型通用，不同模型按倍率扣减。</small><button class="btn primary" type="submit">发送</button></div></form></div></div>`;
 requestAnimationFrame(()=>{const box=$('#ai-messages');if(box)box.scrollTop=box.scrollHeight;$('#ai-chat-input')?.focus();});
}
function openAiChat(){ensureAiChat();openModal('AI 对话','<div id="ai-chat-panel"></div>');renderAiChat();}
function sendAiMessage(){
 const input=$('#ai-chat-input');if(!input)return;const text=input.value.trim();if(!text)return;const cost=aiEstimateTokens(text,state.aiChat.model);if(aiTokenBalance()<cost){toast('Token 不足，请先兑换。');return;}
 state.aiChat.messages.push({role:'user',text,tokens:cost});state.tokenUsed=(state.tokenUsed||0)+cost;
 const model=aiModel(state.aiChat.model);const reply=text.length>40?`我已收到你的问题。基于 ${model.name}，我会先拆解关键信息，再给出可执行的分析建议。你可以继续补充数据背景、目标结论或输出格式。`:`我可以用 ${model.name} 帮你继续拆解「${text}」。你可以补充使用场景、数据类型和期望输出，我会给出更准确的建议。`;
 state.aiChat.messages.push({role:'assistant',text:reply,tokens:0});persist();renderAiChat();renderOverview();renderProducts();renderOrders();toast(`已消耗 ${fmt(cost)} Token。`);
}
document.addEventListener('click',e=>{if(e.target.closest('[data-action="ai-chat"]')){e.preventDefault();openAiChat();return;}const model=e.target.closest('[data-ai-model]');if(model){ensureAiChat();state.aiChat.model=model.dataset.aiModel;persist();renderAiChat();}});
document.addEventListener('submit',e=>{if(e.target.id==='ai-chat-form'){e.preventDefault();sendAiMessage();}});
document.addEventListener('keydown',e=>{if(e.target.id==='ai-chat-input'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAiMessage();}});


if(!state.config.catalog.some(p=>p.id==='token-100k')){state.config.catalog.unshift({id:'token-100k',name:'AI Token · 10万',category:'AI Token',price:100,desc:'可切换主流模型对话',unit:'10万 Token',kind:'aiToken',tokenAmount:100000,icon:'layers',color:'blue',badge:'AI Token',enabled:true,cover:''});applyConfig();}
if(!state.config.catalog.some(p=>p.id==='token-500k')){state.config.catalog.splice(1,0,{id:'token-500k',name:'AI Token · 50万',category:'AI Token',price:450,desc:'批量对话更划算',unit:'50万 Token',kind:'aiToken',tokenAmount:500000,icon:'layers',color:'blue',badge:'AI Token',enabled:true,cover:''});applyConfig();}
if(!Number.isFinite(state.tokenUsed))state.tokenUsed=0;

window.YunbeiSupply={data:s,config:cfg,defaults,definitions,clone,escape:(value)=>esc(value),day,refresh:()=>renderAll(),rule,showRules:()=>actions.rules()};

})();
