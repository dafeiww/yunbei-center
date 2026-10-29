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
 {id:'p10',yuan:10,bonusPercent:0}, {id:'p50',yuan:50,bonusPercent:2},
 {id:'p100',yuan:100,bonusPercent:5}, {id:'p300',yuan:300,bonusPercent:8},
 {id:'p500',yuan:500,bonusPercent:12}, {id:'p1000',yuan:1000,bonusPercent:20}
];
const catalog=[
 {id:'charts',name:'高级图表通行证',category:'高级图表',price:600,desc:'解锁桑基图、弦图等 30+ 高级图表',duration:'30 天有效',kind:'duration',days:30,unit:'不限绘图次数',badge:'热门兑换',icon:'chart',color:'green'},
 {id:'storage',name:'50 GB 云存储扩容包',category:'存储空间',price:400,desc:'给数据、图表和分析结果更多空间',duration:'365 天有效',kind:'storage',days:365,amount:50,unit:'可叠加扩容',badge:'实用之选',icon:'storage',color:'blue'},
 {id:'ai',name:'AI 分析解读包',category:'分析工具',price:300,desc:'从图表到结论，让研究思路更清晰',duration:'90 天有效',kind:'credits',days:90,amount:20,unit:'20 次智能解读',badge:'新上线',icon:'spark',color:'purple'},
 {id:'export',name:'高清图表导出包',category:'效率权益',price:200,desc:'高清 PNG / PDF / SVG，多场景使用',duration:'90 天有效',kind:'credits',days:90,amount:30,unit:'30 次高清导出',badge:'轻量入门',icon:'export',color:'sand'},
 {id:'compute',name:'分析算力加速包',category:'分析工具',price:800,desc:'更充足的计算资源，减少分析等待',duration:'90 天有效',kind:'credits',days:90,amount:50,unit:'50 核时算力',badge:'效率升级',icon:'zap',color:'mint'},
 {id:'team',name:'项目协作体验包',category:'效率权益',price:1200,desc:'与同事共享项目，协同绘图与分析',duration:'30 天有效',kind:'duration',days:30,amount:3,unit:'3 个协作席位',badge:'团队推荐',icon:'users',color:'peach'}
];
const productsById=Object.fromEntries(catalog.map(p=>[p.id,p]));
const seed=()=>({version:1,balance:3000,earned:4000,spent:1000,lastCheckin:'',checkins:[],orders:[
 {id:'YB202610190002',kind:'exchange',productId:'storage',name:'50 GB 云存储扩容包',price:400,created:'2026-10-19T09:42:00+08:00',expires:'2027-10-19T09:42:00+08:00'},
 {id:'YB202610190001',kind:'exchange',productId:'charts',name:'高级图表通行证',price:600,created:'2026-10-19T09:30:00+08:00',expires:'2026-11-18T09:30:00+08:00'}
],ledger:[
 {id:'L003',label:'兑换 50 GB 云存储扩容包',delta:-400,balance:3000,created:'2026-10-19T09:42:00+08:00',orderId:'YB202610190002',source:'exchange',category:'存储空间'},
 {id:'L002',label:'兑换高级图表通行证',delta:-600,balance:3400,created:'2026-10-19T09:30:00+08:00',orderId:'YB202610190001',source:'exchange',category:'高级图表'},
 {id:'L001',label:'历史账户云贝入账',delta:4000,balance:4000,created:'2026-10-18T10:00:00+08:00',orderId:'—',source:'legacy'}
]});
let state;
try{const saved=JSON.parse(localStorage.getItem(STORE));state=saved?.version===1&&Array.isArray(saved.orders)&&Array.isArray(saved.ledger)&&Number.isFinite(saved.balance)&&saved.balance>=0?saved:seed();}catch{state=seed();}
let activeTab='dashboard',category='全部权益',sortMode=0,orderStatus='all',orderPage=1,ledgerFilter='all',ledgerSource='all',ledgerPage=1,invoiceFilter='all',invoicePage=1,rechargePage=1;
const INVOICE_PAGE_SIZE=10,ORDER_PAGE_SIZE=10,LEDGER_PAGE_SIZE=10;
let selectedInvoices=new Set(),activeExchange=null,invoiceTargets=[],invoiceType='company',previousFocus=null,toastTimer;
let invoiceDraft={type:'company',companyTitle:'',personalTitle:'',taxId:'',email:'',note:''};
let selectedPlan='p100',pendingRecharge=null,paymentMethod='wechat',dashboardPeriod='30',usageDetailPage=1,usageDetailDay='',usageDetailCategory='';
let dashboardCustomStart='',dashboardCustomEnd='',trendChart=null;
const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(state));return true;}catch{if(typeof toast==='function')toast('浏览器未能保存，请保持页面开启以继续体验。');return false;}};
const today=()=>dateKey(new Date());
const nowIso=()=>new Date().toISOString();
const dateKey=date=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const displayDate=(iso,time=false)=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',...(time?{hour:'2-digit',minute:'2-digit',hour12:false}:{})}).format(new Date(iso)).replaceAll('/','.');
const addDays=(date,days)=>new Date(new Date(date).getTime()+days*86400000).toISOString();
const shiftedDay=(day,days)=>addDays(day+'T00:00:00Z',days).slice(0,10);
const isActive=order=>new Date(order.expires)>new Date();
const getInvoiceState=order=>order.invoice?.status||'available';
const exchangeOrders=()=>[...state.orders,...(state.invoiceExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));
const isInvoiceEligible=order=>!!order&&order.kind==='recharge'&&order.status==='paid'&&Number.isSafeInteger(order.paidCents)&&order.paidCents>0;
const rechargeOrders=()=>[...(state.recharges||[]),...(state.rechargeExamples||[])].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));
const invoiceOrders=()=>rechargeOrders().filter(isInvoiceEligible);
const orderById=id=>[...exchangeOrders(),...rechargeOrders()].find(o=>o.id===id);
const firstRechargeAvailable=()=>!state.recharges.some(o=>o.status==='paid');
const sourceLabel=source=>({recharge:'充值到账',bonus:'充值赠送',checkin:'签到奖励',invite:'邀请奖励',exchange:'权益兑换',legacy:'历史入账'}[source]||'历史入账');
function weekStart(key=today()){const d=new Date(key+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
function uid(prefix){return prefix+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,7).toUpperCase();}
function rechargeQuote(planId=selectedPlan){
 const plan=RECHARGE_PLANS.find(p=>p.id===planId);if(!plan)return null;
 const first=firstRechargeAvailable(),faceCents=plan.yuan*100,paidCents=first?faceCents*80/100:faceCents;
 const principal=plan.yuan*10,bonus=principal*plan.bonusPercent/100;
 return {planId,first,faceCents,paidCents,principal,bonus,total:principal+bonus,bonusPercent:plan.bonusPercent};
}
function prepareState(){
 if(!Array.isArray(state.checkins)){state.checkins=[];for(const r of state.ledger){if(r.delta>0&&(r.id?.startsWith('CHECK')||r.label?.includes('签到奖励'))){const day=dateKey(new Date(r.created));if(!state.checkins.some(c=>c.day===day))state.checkins.push({day,reward:r.delta,legacy:true});}}}
 if(!Array.isArray(state.invoiceExamples)){
  state.invoiceExamples=[];
  for(let i=0;i<28;i++){const p=catalog[i%catalog.length],age=i%2===0?4+i%6:p.days+7+i,created=addDays(nowIso(),-age);state.invoiceExamples.push({id:'DEMOYB'+String(i+1).padStart(6,'0'),kind:'exchange',productId:p.id,name:p.name,price:p.price,created,expires:addDays(created,p.days),demo:true});}
  state.redemptionDemoVersion=1;
 }
 if(state.redemptionDemoVersion!==1){for(const [i,o] of state.invoiceExamples.entries()){const p=productsById[o.productId];if(!o.demo||!p)continue;const age=i%2===0?4+i%6:p.days+7+i;o.created=addDays(nowIso(),-age);o.expires=addDays(o.created,p.days);}state.redemptionDemoVersion=1;}
 if(state.walletVersion!==2||!state.wallet){state.wallet={paid:0,reward:state.balance};state.walletVersion=2;}
 if(!Array.isArray(state.recharges))state.recharges=[];
 if(!Array.isArray(state.invites))state.invites=[];
 if(!state.inviteCode){const bytes=crypto.getRandomValues(new Uint8Array(6));state.inviteCode='YB'+[...bytes].map(n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('');}
 for(const o of exchangeOrders())o.kind='exchange';
 for(const r of state.ledger){if(!r.source)r.source=r.delta<0?'exchange':r.label?.includes('签到')?'checkin':'legacy';if(r.delta<0&&!r.category)r.category=productsById[orderById(r.orderId)?.productId]?.category||'其他权益';}
 if(!Array.isArray(state.rechargeExamples)){
  state.rechargeExamples=[];
  for(let i=0;i<30;i++){
   const plan=RECHARGE_PLANS[i%6],created=addDays(nowIso(),-(5+i*2));
   const first=i===29,faceCents=plan.yuan*100,paidCents=first?faceCents*.8:faceCents;
   const o={id:'DEMOCZ'+String(i+1).padStart(6,'0'),kind:'recharge',status:'paid',name:`充值 ${plan.yuan} 元`,faceCents,paidCents,invoiceCents:paidCents,principal:plan.yuan*10,bonus:plan.yuan*10*plan.bonusPercent/100,first,created,demo:true,paymentMethod:i%2?'alipay':'wechat',invoice:null};
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
 addCredit(current.bonus,'bonus',`充值赠送 · ${current.bonusPercent}%`,id,created);
 persist();return order;
}
function registerInvitedFriend(friendKey,name){
 friendKey=friendKey.trim().toLowerCase();name=name.trim();
 if(!friendKey||!name)return {error:'请填写示例好友账号和昵称。'};
 if(state.invites.some(i=>i.friendKey===friendKey))return {error:'该好友已领取过注册奖励，请勿重复邀请。'};
 const month=today().slice(0,7),monthCount=state.invites.filter(i=>dateKey(new Date(i.created)).startsWith(month)).length;
 if(monthCount>=20)return {error:'本月 20 位好友的邀请奖励已领完，下月可继续邀请。'};
 const reward=state.invites.length===0?100:50,id=uid('INV'),created=nowIso();
 state.invites.unshift({id,friendKey,name,reward,created,status:'rewarded'});
 addCredit(reward,'invite',`${state.invites.length===1?'首次邀请':'邀请好友'}注册奖励 · ${name}`,id,created);
 persist();return {reward,id};
}
function dashboardRange(){
 const start=dashboardPeriod==='custom'?dashboardCustomStart:shiftedDay(today(),-(Number(dashboardPeriod)-1)),end=dashboardPeriod==='custom'?dashboardCustomEnd:today();
 const days=Math.round((Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000)+1;
 return {start,end,days,valid:!!start&&!!end&&days>0&&days<=366&&end<=today()};
}
function dashboardRows(){const range=dashboardRange();if(!range.valid)return [];return state.ledger.filter(r=>{const day=dateKey(new Date(r.created));return day>=range.start&&day<=range.end;});}
function usageRows(day=usageDetailDay,cat=usageDetailCategory){return dashboardRows().filter(r=>r.delta<0&&(!day||dateKey(new Date(r.created))===day)&&(!cat||r.category===cat));}
