'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const icon=name=>`<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('en-US');
const money=cents=>`¥${(cents/100).toFixed(2)}`;
const STORE='gene-cloud-shell-exchange-v1';
const CHECKIN_REWARDS=[5,5,10,5,15,5,25];
const RECHARGE_PLANS=[
 {id:'p10',yuan:10,bonus:0}, {id:'p50',yuan:50,bonus:10},
 {id:'p100',yuan:100,bonus:50}, {id:'p300',yuan:300,bonus:240},
 {id:'p500',yuan:500,bonus:600}, {id:'p1000',yuan:1000,bonus:2000}
];
const skillBundleProduct=()=>({id:'bio-skill',name:'生信分析 SKILL 集合包',category:'生信分析',price:3000,unit:'套',kind:'generic',badge:'生信分析',icon:'layers',color:'blue',enabled:true,cover:''});
const catalog=[
 {id:'storage',name:'50 GB 云存储扩容包',category:'存储空间',price:400,desc:'给数据、图表和分析结果更多空间',duration:'365 天有效',kind:'storage',days:365,amount:50,unit:'GB',badge:'空间扩容',icon:'storage',color:'blue'},
 {id:'share',name:'项目分享 +5 人扩容包',category:'项目分享',price:500,desc:'为项目增加 5 个可邀请成员席位',duration:'365 天有效',kind:'share',days:365,amount:5,unit:'人',badge:'团队扩展',icon:'users',color:'peach',cover:''}
];
const productsById=Object.fromEntries(catalog.map(p=>[p.id,p]));
const defaultRechargePlans=()=>[{id:'p10',yuan:10,principal:100,bonus:0,discountZhe:8,enabled:true},{id:'p50',yuan:50,principal:500,bonus:10,discountZhe:8,enabled:true},{id:'p100',yuan:100,principal:1000,bonus:50,discountZhe:8,enabled:true},{id:'p300',yuan:300,principal:3000,bonus:240,discountZhe:8,enabled:true},{id:'p500',yuan:500,principal:5000,bonus:600,discountZhe:8,enabled:true},{id:'p1000',yuan:1000,principal:10000,bonus:2000,discountZhe:8,enabled:true}];
const defaultCatalog=()=>[{id:'storage',name:'50 GB 云存储扩容包',category:'存储空间',price:400,desc:'给数据、图表和分析结果更多空间',duration:'365 天有效',kind:'storage',days:365,amount:50,unit:'GB',badge:'空间扩容',icon:'storage',color:'blue',cover:''},{id:'share',name:'项目分享 +5 人扩容包',category:'项目分享',price:500,desc:'为项目增加 5 个可邀请成员席位',duration:'365 天有效',kind:'share',days:365,amount:5,unit:'人',badge:'团队扩展',icon:'users',color:'peach'},skillBundleProduct()];
let rechargeDiscountPercent=80;
function syncCatalog(){Object.keys(productsById).forEach(key=>{delete productsById[key];});Object.assign(productsById,Object.fromEntries(catalog.map(p=>[p.id,p])));}
function applyConfig(){const cfg=state.config||{};const rawPlans=Array.isArray(cfg.rechargePlans)&&cfg.rechargePlans.length?cfg.rechargePlans:defaultRechargePlans();const plans=rawPlans.map(p=>({...p,principal:Math.max(1,Math.round((Number(p.yuan)||0)*10)),bonus:Number.isFinite(Number(p.bonus))?Math.max(0,Math.round(Number(p.bonus))):Math.max(0,Math.round((Number(p.yuan)||0)*10*(Number(p.bonusPercent)||0)/100)),discountZhe:Number(p.discountZhe)!==undefined&&p.discountZhe!==''&&Number.isFinite(Number(p.discountZhe))?Math.min(9,Math.max(1,Number(p.discountZhe))):Number(p.discountPercent)!==undefined&&p.discountPercent!==''&&Number.isFinite(Number(p.discountPercent))?(Number(p.discountPercent)>9?Math.min(9,Math.max(1,Math.round(Number(p.discountPercent)/10))):Math.min(9,Math.max(1,Number(p.discountPercent)))):8,enabled:p.enabled!==false}));const shop=(Array.isArray(cfg.catalog)?cfg.catalog:defaultCatalog()).map(p=>({...p,unit:p.unit==='可叠加扩容'?'GB':p.unit==='+5 个分享席位'?'人':p.unit}));const customCategories=Array.isArray(cfg.customCategories)?cfg.customCategories.map(v=>String(v||'').trim()).filter(Boolean):[];state.config={...cfg,rechargePlans:plans,catalog:shop,customCategories};RECHARGE_PLANS.length=0;RECHARGE_PLANS.push(...plans);catalog.length=0;catalog.push(...shop);syncCatalog();}

const seed=()=>({version:1,balance:3000,earned:4000,spent:1000,lastCheckin:'',checkins:[],orders:[
 {id:'YB202610190002',kind:'exchange',productId:'storage',name:'50 GB 云存储扩容包',price:400,created:'2026-10-19T09:42:00+08:00',expires:'2027-10-19T09:42:00+08:00'},
 {id:'YB202610190001',kind:'exchange',productId:'share',name:'项目分享 +5 人扩容包',price:500,created:'2026-10-19T09:30:00+08:00',expires:'2026-11-18T09:30:00+08:00'}
],ledger:[
 {id:'L003',label:'兑换 50 GB 云存储扩容包',delta:-400,balance:3000,created:'2026-10-19T09:42:00+08:00',orderId:'YB202610190002',source:'exchange',category:'存储空间'},
 {id:'L002',label:'兑换高级图表通行证',delta:-600,balance:3400,created:'2026-10-19T09:30:00+08:00',orderId:'YB202610190001',source:'exchange',category:'高级图表'},
 {id:'L001',label:'历史账户云贝入账',delta:4000,balance:4000,created:'2026-10-18T10:00:00+08:00',orderId:'—',source:'legacy'}
]});
const defaultConfig=()=>({discountZhe:8,rechargePlans:defaultRechargePlans(),catalog:defaultCatalog()});
let state;
try{const saved=JSON.parse(localStorage.getItem(STORE));state=saved?.version===1&&Array.isArray(saved.orders)&&Array.isArray(saved.ledger)&&Number.isFinite(saved.balance)&&saved.balance>=0?saved:seed();}catch{state=seed();}
let activeTab='recharge',category='全部权益',sortMode=0,orderStatus='all',orderPage=1,ledgerFilter='all',ledgerSource='all',ledgerPage=1,invoiceFilter='all',invoicePage=1,rechargePage=1;
const INVOICE_PAGE_SIZE=10,ORDER_PAGE_SIZE=10,LEDGER_PAGE_SIZE=10;
let selectedInvoices=new Set(),activeExchange=null,invoiceTargets=[],invoiceType='company',previousFocus=null,toastTimer;
let invoiceDraft={type:'company',companyTitle:'',personalTitle:'',taxId:'',email:'',note:''};
let selectedPlan='p100',pendingRecharge=null,paymentMethod='wechat_alipay',dashboardPeriod='30',usageDetailPage=1,usageDetailDay='',usageDetailCategory='';
let dashboardCustomStart='',dashboardCustomEnd='',trendChart=null;
const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(state));return true;}catch{if(typeof toast==='function')toast('浏览器未能保存，请保持页面开启以继续体验。');return false;}};
const today=()=>dateKey(new Date());
const nowIso=()=>new Date().toISOString();
const dateKey=date=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const displayDate=(iso,time=false)=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',...(time?{hour:'2-digit',minute:'2-digit',hour12:false}:{})}).format(new Date(iso)).replaceAll('/','.');
const addDays=(date,days)=>new Date(new Date(date).getTime()+days*86400000).toISOString();
const shiftedDay=(day,days)=>addDays(day+'T00:00:00Z',days).slice(0,10);
const isActive=order=>order.expires===null||new Date(order.expires)>new Date();
const getInvoiceState=order=>order.invoice?.status||'available';
const exchangeOrders=()=>[...state.orders,...(state.invoiceExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));
const isInvoiceEligible=order=>!!order&&order.kind==='recharge'&&order.status==='paid'&&Number.isSafeInteger(order.paidCents)&&order.paidCents>0;
const rechargeOrders=()=>[...(state.recharges||[]),...(state.rechargeExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));
const invoiceOrders=()=>rechargeOrders().filter(isInvoiceEligible);
const inviteRecords=()=>[...(state.invites||[]),...(state.inviteExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));
const orderById=id=>[...exchangeOrders(),...rechargeOrders()].find(o=>o.id===id);
const firstRechargeAvailable=()=>true;
const sourceLabel=source=>({recharge:'充值得云贝',checkin:'签到得云贝',invite:'邀请好友得云贝',drawing:'云贝绘图',exchange:'权益兑换',legacy:'历史入账'}[source]||'云贝变动');
function weekStart(key=today()){const d=new Date(key+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
function uid(prefix){return prefix+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,7).toUpperCase();}
function rechargeQuote(planId=selectedPlan){
 const plan=RECHARGE_PLANS.find(p=>p.id===planId);if(!plan)return null;
 const first=true,discountZhe=Number.isFinite(Number(plan.discountZhe))?Math.min(9,Math.max(1,Number(plan.discountZhe))):8,faceCents=plan.yuan*100,paidCents=Number.isFinite(Number(plan.paidCents))?Math.max(1,Math.round(Number(plan.paidCents))):Math.round(faceCents*discountZhe/10);
 const principal=Math.max(1,Math.round((Number(plan.yuan)||0)*10)),bonus=Math.max(0,Math.round(Number(plan.bonus)||0));
 return {planId,first,discountZhe,faceCents,paidCents,principal,bonus,total:principal+bonus};
}
function prepareState(){
 if(!state.config)state.config=defaultConfig();applyConfig();
 if(state.skillBundleVersion!==1){if(!state.config.catalog.some(p=>p.id==='bio-skill'))state.config.catalog.push(skillBundleProduct());state.skillBundleVersion=1;applyConfig();}
 const sampleCatalog=defaultCatalog().filter(p=>p.kind!=='generic');
 if(!['user','admin'].includes(state.role))state.role='user';
 if(state.catalogVersion!==3){state.catalogVersion=3;const allowed=new Set(catalog.map(p=>p.id));state.orders=state.orders.filter(o=>allowed.has(o.productId));state.invoiceExamples=[];for(let i=0;i<24;i++){const p=sampleCatalog[i%sampleCatalog.length],age=i<12?2+i%7:p.days+10+i%5,created=addDays(nowIso(),-age);state.invoiceExamples.push({id:'DEMOYB'+String(i+1).padStart(6,'0'),kind:'exchange',productId:p.id,name:p.name,price:p.price,created,expires:addDays(created,p.days),demo:true});}}
 if(state.ledgerVersion!==3){const rows=[
   {label:'历史账户云贝入账',delta:3470,created:'2026-09-01T10:00:00+08:00',orderId:'—',source:'legacy'},
   {label:'充值到账 · ¥120.00',delta:1200,created:'2026-09-05T14:12:00+08:00',orderId:'CZSEED01',source:'recharge'},
   {label:'签到奖励 · 本周第 1 天',delta:5,created:'2026-09-08T08:32:00+08:00',orderId:'—',source:'checkin'},
   {label:'签到奖励 · 本周第 2 天',delta:5,created:'2026-09-09T08:31:00+08:00',orderId:'—',source:'checkin'},
   {label:'邀请好友注册奖励 · 林知远',delta:10,created:'2026-09-10T10:20:00+08:00',orderId:'INVSEED01',source:'invite'},
   {label:'签到奖励 · 本周第 3 天',delta:10,created:'2026-09-10T08:30:00+08:00',orderId:'—',source:'checkin'},
   {label:'云贝绘图消耗 · 折线图',delta:-80,created:'2026-09-11T15:40:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'云贝绘图消耗 · 热力图',delta:-120,created:'2026-09-13T10:18:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'邀请好友注册奖励 · 陈可宁',delta:10,created:'2026-09-14T19:02:00+08:00',orderId:'INVSEED02',source:'invite'},
   {label:'兑换 50 GB 云存储扩容包',delta:-400,created:'2026-09-15T09:42:00+08:00',orderId:'YBSEED02',source:'exchange',category:'存储空间'},
   {label:'云贝绘图消耗 · 散点图',delta:-60,created:'2026-09-18T16:24:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'兑换 项目分享 +5 人扩容包',delta:-500,created:'2026-09-20T11:30:00+08:00',orderId:'YBSEED03',source:'exchange',category:'项目分享'},
   {label:'云贝绘图消耗 · 桑基图',delta:-150,created:'2026-09-22T20:10:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'邀请好友注册奖励 · 赵书航',delta:10,created:'2026-09-25T12:10:00+08:00',orderId:'INVSEED03',source:'invite'},
   {label:'兑换 50 GB 云存储扩容包',delta:-400,created:'2026-09-28T10:05:00+08:00',orderId:'YBSEED04',source:'exchange',category:'存储空间'},
   {label:'云贝绘图消耗 · 弦图',delta:-140,created:'2026-10-02T09:40:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'兑换 项目分享 +5 人扩容包',delta:-500,created:'2026-10-06T14:20:00+08:00',orderId:'YBSEED05',source:'exchange',category:'项目分享'},
   {label:'云贝绘图消耗 · 组合图',delta:-150,created:'2026-10-10T18:45:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'充值到账 · ¥300.00',delta:3000,created:'2026-10-18T15:20:00+08:00',orderId:'CZSEED02',source:'recharge'},
   {label:'云贝绘图消耗 · 分析图集',delta:-2400,created:'2026-10-22T11:00:00+08:00',orderId:'—',source:'drawing',category:'绘图消耗'},
   {label:'兑换 50 GB 云存储扩容包',delta:-400,created:'2026-10-24T09:42:00+08:00',orderId:'YBSEED06',source:'exchange',category:'存储空间'},
   {label:'兑换 项目分享 +5 人扩容包',delta:-500,created:'2026-10-26T10:30:00+08:00',orderId:'YBSEED07',source:'exchange',category:'项目分享'}
  ];let balance=3000;state.ledger=rows.map((row,index)=>({...row,id:'LEDSEED'+String(index+1).padStart(3,'0'),balance:balance-=row.delta})).reverse();state.earned=state.ledger.filter(r=>r.delta>0).reduce((s,r)=>s+r.delta,0);state.spent=-state.ledger.filter(r=>r.delta<0).reduce((s,r)=>s+r.delta,0);state.ledgerVersion=3;state.balance=3000;state.wallet={paid:state.wallet?.paid||0,reward:state.balance-(state.wallet?.paid||0)};state.walletVersion=2;}
 // Repair the original demonstration balances without resetting account activity.
 if(state.ledgerBalancesVersion!==1&&state.ledger.some(r=>r.id==='LEDSEED001')){
  const rows=[...state.ledger].sort((a,b)=>Date.parse(a.created)-Date.parse(b.created));
  const legacy=rows.find(r=>r.id==='LEDSEED001');
  const difference=state.balance-rows.reduce((sum,r)=>sum+r.delta,0);
  if(legacy.delta+difference>=0)legacy.delta+=difference;
  let running=state.balance-rows.reduce((sum,r)=>sum+r.delta,0);
  for(const row of rows){running+=row.delta;row.balance=running;}
  state.ledger=rows.reverse();
  state.earned=rows.reduce((sum,r)=>sum+Math.max(0,r.delta),0);
  state.spent=rows.reduce((sum,r)=>sum+Math.max(0,-r.delta),0);
  state.ledgerBalancesVersion=1;
 }
 if(!Array.isArray(state.checkins)){state.checkins=[];for(const r of state.ledger){if(r.delta>0&&(r.id?.startsWith('CHECK')||r.label?.includes('签到奖励'))){const day=dateKey(new Date(r.created));if(!state.checkins.some(c=>c.day===day))state.checkins.push({day,reward:r.delta,legacy:true});}}}
 if(!Array.isArray(state.invoiceExamples)){
  state.invoiceExamples=[];
  for(let i=0;i<28;i++){const p=sampleCatalog[i%sampleCatalog.length],age=i%2===0?4+i%6:p.days+7+i,created=addDays(nowIso(),-age);state.invoiceExamples.push({id:'DEMOYB'+String(i+1).padStart(6,'0'),kind:'exchange',productId:p.id,name:p.name,price:p.price,created,expires:addDays(created,p.days),demo:true});}
  state.redemptionDemoVersion=1;
 }
 if(state.redemptionDemoVersion!==1){for(const [i,o] of state.invoiceExamples.entries()){const p=productsById[o.productId];if(!o.demo||!p)continue;const age=i%2===0?4+i%6:p.days+7+i;o.created=addDays(nowIso(),-age);o.expires=addDays(o.created,p.days);}state.redemptionDemoVersion=1;}
 if(state.walletVersion!==2||!state.wallet){state.wallet={paid:0,reward:state.balance};state.walletVersion=2;}
 if(!Array.isArray(state.recharges))state.recharges=[];
 if(!Array.isArray(state.invites))state.invites=[];
 if(state.inviteRewardVersion!==2||!Array.isArray(state.inviteExamples)){
  const inviteSeed=[['林知远',21],['陈可宁',18],['赵书航',15],['许亦然',12],['顾清和',10],['沈云舒',8],['陆思齐',7],['苏晚晴',5],['姜叙白',4],['孟疏桐',3],['程知夏',2],['周念安',1]];
  state.inviteExamples=inviteSeed.map(([name,age],index)=>({id:'DEMOINV'+String(index+1).padStart(3,'0'),friendKey:'friend'+String(index+1).padStart(3,'0'),name,reward:10,friendReward:10,created:addDays(nowIso(),-age),status:'rewarded',demo:true}));
  state.inviteRewardVersion=2;
 }
 if(Array.isArray(state.invites))for(const i of state.invites){i.reward=10;i.friendReward=10;}

 if(!state.inviteCode){const bytes=crypto.getRandomValues(new Uint8Array(6));state.inviteCode='YB'+[...bytes].map(n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('');}
 for(const o of exchangeOrders())o.kind='exchange';
 for(const r of state.ledger){if(!r.source)r.source=r.delta<0?'exchange':r.label?.includes('签到')?'checkin':'legacy';if(r.delta<0&&!r.category)r.category=productsById[orderById(r.orderId)?.productId]?.category||'其他权益';}
 if(Array.isArray(state.rechargeExamples)){for(const o of state.rechargeExamples){if(o.demo&&o.status==='paid'&&Number.isFinite(o.faceCents)){o.first=true;o.paidCents=Math.round(o.faceCents*80/100);o.invoiceCents=o.paidCents;if(o.invoice?.status)o.invoice.totalCents=o.paidCents;}}}
 if(!Array.isArray(state.rechargeExamples)){
  state.rechargeExamples=[];
  for(let i=0;i<30;i++){
   const plan=RECHARGE_PLANS[i%6],created=addDays(nowIso(),-(5+i*2));
   const faceCents=plan.yuan*100,paidCents=faceCents*((Number(plan.discountZhe)||8)/10);
   const o={id:'DEMOCZ'+String(i+1).padStart(6,'0'),kind:'recharge',status:'paid',name:`充值 ${plan.yuan} 元`,faceCents,paidCents,invoiceCents:paidCents,principal:Number(plan.principal)||plan.yuan*10,bonus:Math.max(0,Math.round(Number(plan.bonus)||0)),first:true,created,demo:true,paymentMethod:i%2?'alipay':'wechat',invoice:null};
   const status=i<10?'available':i<20?'pending':'issued';
   if(status!=='available')o.invoice={id:'DEMOCZFP'+(i+1),type:i%3?'company':'personal',title:i%3?'云图科研实验室（示例）':'科研用户（示例）',taxId:'91310101DEMO00001A',email:'research@example.com',note:'充值历史示例',status,created:addDays(created,1),orderIds:[o.id],totalCents:paidCents,...(status==='issued'?{number:'DEMOCZ2026'+String(i+1).padStart(6,'0'),issuedAt:addDays(created,3)}:{})};
   state.rechargeExamples.push(o);
  }
 }
 state.rechargeRate=10;
 dashboardCustomStart=shiftedDay(today(),-29);dashboardCustomEnd=today();
 persist();
}
prepareState();
function checkinWeek(){const start=weekStart(),end=shiftedDay(start,6),days=[...new Map(state.checkins.filter(c=>c.day>=start&&c.day<=end).sort((a,b)=>a.day.localeCompare(b.day)).map(c=>[c.day,c])).values()].slice(0,7),count=days.length,earned=days.reduce((s,c)=>s+c.reward,0);return {start,end,days,count,earned,nextReward:CHECKIN_REWARDS[count]||0,total:earned+CHECKIN_REWARDS.slice(count).reduce((a,b)=>a+b,0),checkedIn:state.lastCheckin===today()||days.some(c=>c.day===today())};}
function addCredit(points,source,label,orderId='—',created=nowIso()){
 if(points<=0)return;
 state.wallet[source==='recharge'?'paid':'reward']+=points;state.balance+=points;state.earned+=points;
 state.ledger.unshift({id:uid('L'),label,delta:points,balance:state.balance,created,orderId,source});
}
function spendPoints(points){
 if(!Number.isSafeInteger(points)||points<=0||points>state.balance)return null;
 const reward=Math.min(state.wallet.reward,points),paid=points-reward;
 if(paid>state.wallet.paid)return null;
 state.wallet.reward-=reward;state.wallet.paid-=paid;state.balance-=points;state.spent+=points;
 return {reward,paid};
}
function completeRecharge(quote){
 const current=rechargeQuote(quote?.planId);
 if(!current||!quote||current.first!==quote.first||current.paidCents!==quote.paidCents)return null;
 const id=uid('CZ'),created=nowIso();
 const order={id,kind:'recharge',status:'paid',name:`充值 ${current.faceCents/100} 元`,...current,invoiceCents:current.paidCents,created,paymentMethod,invoice:null};
 state.recharges.unshift(order);
 addCredit(current.principal,'recharge',`充值到账 · ${money(current.paidCents)}`,id,created);
 addCredit(current.bonus,'recharge',`充值赠送云贝`,id,created);
 persist();return order;
}
function registerInvitedFriend(friendKey,name){
 friendKey=friendKey.trim().toLowerCase();name=name.trim();
 if(!friendKey||!name)return {error:'请填写示例好友账号和昵称。'};
 if(state.invites.some(i=>i.friendKey===friendKey))return {error:'该账号已在基因云注册过，只有新注册账号才能获得邀请奖励。'};
 const reward=10,friendReward=10,id=uid('INV'),created=nowIso();
 state.invites.unshift({id,friendKey,name,reward,friendReward,created,status:'rewarded'});
 addCredit(reward,'invite',`邀请好友注册奖励 · ${name}`,id,created);
 addCredit(friendReward,'invite',`新用户注册奖励 · ${name}`,id,created);
 persist();return {reward,id};
}
function dashboardRange(){
 const start=dashboardPeriod==='custom'?dashboardCustomStart:shiftedDay(today(),-(Number(dashboardPeriod)-1)),end=dashboardPeriod==='custom'?dashboardCustomEnd:today();
 const days=Math.round((Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000)+1;
 return {start,end,days,valid:!!start&&!!end&&days>0&&days<=366&&end<=today()};
}
function dashboardRows(){const range=dashboardRange();if(!range.valid)return [];return state.ledger.filter(r=>{const day=dateKey(new Date(r.created));return day>=range.start&&day<=range.end;});}
function usageRows(day=usageDetailDay,cat=usageDetailCategory){return dashboardRows().filter(r=>r.delta<0&&(!day||dateKey(new Date(r.created))===day)&&(!cat||r.category===cat));}
