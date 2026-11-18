/* Platform-wide demo records are separate from the current account's wallet. */
let operationsView='recharge',operationsStatus='all',operationsPage=1;
const OPERATIONS_DEMO_USERS=['小李','小明','林知远','陈可宁','赵书航','许亦然','顾清和','沈云舒'].map((name,index)=>({id:'U'+(1001+index),name,account:'user'+(1001+index)+'@example.com'}));
const operationsCurrentUser={id:'current-user',name:'科研探索者（当前账号）',account:'researcher@example.com'};

function operationsExamples(){
 if(state.operationsExamples?.version===2)return state.operationsExamples;
 const plans=defaultRechargePlans(),products=defaultCatalog();
 const rechargeStatus=index=>index%9===2?'pending':index%9===3?'failed':'paid';
 const exchangeStatus=index=>index%8===2?'failed':index%8===5?'pending':'success';
 const recharge=Array.from({length:24},(_,index)=>{
  const plan=plans[index%plans.length],user=OPERATIONS_DEMO_USERS[index%OPERATIONS_DEMO_USERS.length];
  return {id:'OPCZ'+String(index+1).padStart(6,'0'),user,created:addDays(nowIso(),-index*2),paidCents:Math.round(plan.yuan*100*0.8),total:plan.principal+plan.bonus,status:rechargeStatus(index)};
 });
 const exchange=Array.from({length:27},(_,index)=>{
  const product=products[index%products.length],user=OPERATIONS_DEMO_USERS[index%6];
  return {id:'OPYB'+String(index+1).padStart(6,'0'),user,created:addDays(nowIso(),-index),name:product.name,category:product.category,unit:product.unit,price:product.price,status:exchangeStatus(index)};
 });
 state.operationsExamples={version:2,recharge,exchange};persist();return state.operationsExamples;
}
function operationsRecords(){
 const examples=operationsExamples();
 const recharge=[...examples.recharge,...(state.recharges||[]).map(o=>({...o,status:o.status||'paid',user:operationsCurrentUser}))];
 const exchange=[...examples.exchange,...state.orders.map(o=>({...o,status:o.status||'success',user:operationsCurrentUser,category:o.category||productsById[o.productId]?.category||'商品兑换',unit:o.unit||productsById[o.productId]?.unit||'份'}))];
 const period=$('#operations-period')?.value||'30',cutoff=period==='all'?'':shiftedDay(today(),1-Number(period));
 const included=row=>!cutoff||dateKey(new Date(row.created))>=cutoff;
 return {recharge:recharge.filter(included).sort((a,b)=>Date.parse(b.created)-Date.parse(a.created)),exchange:exchange.filter(included).sort((a,b)=>Date.parse(b.created)-Date.parse(a.created))};
}
function operationsStatusDefinitions(){
 return operationsView==='recharge'?[
  {key:'all',label:'全部记录',fallback:'paid'},{key:'paid',label:'充值成功',fallback:'paid'},{key:'pending',label:'充值中',fallback:'pending'},{key:'failed',label:'充值失败',fallback:'failed'}
 ]:[
  {key:'all',label:'全部记录',fallback:'success'},{key:'success',label:'兑换成功',fallback:'success'},{key:'pending',label:'兑换中',fallback:'pending'},{key:'failed',label:'兑换失败',fallback:'failed'}
 ];
}
function operationsStatusMeta(row){
 if(operationsView==='recharge')return {label:{paid:'充值成功',pending:'充值中',failed:'充值失败'}[row.status||'paid']||'充值成功',className:{paid:'tag',pending:'tag pending',failed:'tag failed'}[row.status||'paid']||'tag'};
 return {label:{success:'兑换成功',pending:'兑换中',failed:'兑换失败'}[row.status||'success']||'兑换成功',className:{success:'tag',pending:'tag pending',failed:'tag failed'}[row.status||'success']||'tag'};
}
function renderOperations(){
 const panel=$('#panel-operations');if(!panel||!isAdmin())return;
 const records=operationsRecords(),recharge=records.recharge,exchange=records.exchange;
 const paidRecharge=recharge.filter(row=>(row.status||'paid')==='paid');
 const successExchange=exchange.filter(row=>(row.status||'success')==='success');
 const unique=rows=>new Set(rows.map(row=>row.user.id)).size;
 $('#operations-recharge-users').innerHTML=fmt(unique(paidRecharge))+'<small>人</small>';
 $('#operations-exchange-users').innerHTML=fmt(unique(successExchange))+'<small>人</small>';
 $('#operations-recharge-count').textContent='成功充值 '+fmt(paidRecharge.length)+' 笔';
 $('#operations-exchange-count').textContent='成功兑换 '+fmt(successExchange.length)+' 笔';
 $('#operations-revenue').textContent=money(paidRecharge.reduce((sum,row)=>sum+(row.status==='paid'?row.paidCents:0),0));
 $('#operations-spent').innerHTML=fmt(successExchange.reduce((sum,row)=>sum+row.price,0))+'<small>云贝</small>';
 $('#operations-recharge-tab-count').textContent=recharge.length;$('#operations-exchange-tab-count').textContent=exchange.length;
 $$('[data-operations-view]').forEach(button=>{const selected=button.dataset.operationsView===operationsView;button.classList.toggle('active',selected);button.setAttribute('aria-selected',String(selected));});
 const statusDefs=operationsStatusDefinitions();
 $('#operations-status-tabs').innerHTML=statusDefs.map(def=>{const count=def.key==='all'?records[operationsView].length:records[operationsView].filter(row=>(row.status||def.fallback)===def.key).length;const selected=operationsStatus===def.key;return `<button type="button" class="operations-status-tab${selected?' active':''}" role="tab" aria-selected="${selected}" data-operations-status="${def.key}">${def.label}<span>${fmt(count)}</span></button>`;}).join('');
 const query=$('#operations-search').value.trim().toLowerCase();
 const filtered=records[operationsView].filter(row=>operationsStatus==='all'||(row.status||operationsStatusDefinitions().find(def=>def.key===operationsStatus).fallback)===operationsStatus).filter(row=>[row.user.name,row.user.account,row.user.id,row.id,row.name||'',operationsStatusMeta(row).label].join(' ').toLowerCase().includes(query));
 const pages=Math.max(1,Math.ceil(filtered.length/10));operationsPage=Math.max(1,Math.min(operationsPage,pages));
 const headers=operationsView==='recharge'?['用户','充值订单','实付金额','到账云贝','充值时间','状态']:['用户','兑换商品','权益分类','兑换单位','消耗云贝','兑换时间','状态'];
 $('#operations-table-head').innerHTML='<tr>'+headers.map(label=>`<th scope="col">${label}</th>`).join('')+'</tr>';
 const userCell=row=>`<td><div class="operations-user"><span class="operations-avatar">${esc(row.user.name[0])}</span><div><strong>${esc(row.user.name)}</strong><small>${esc(row.user.account)}</small></div></div></td>`;
 $('#operations-table-body').innerHTML=filtered.slice((operationsPage-1)*10,operationsPage*10).map(row=>{const status=operationsStatusMeta(row);return `<tr>${userCell(row)}${operationsView==='recharge'?`<td class="operations-order-id">${esc(row.id)}</td><td class="num operations-money">${money(row.paidCents)}</td><td class="num">${row.status==='paid'?fmt(row.total):'0'}<small class="operations-inline-unit">云贝</small></td>`:`<td class="operations-product"><strong>${esc(row.name)}</strong><small>${esc(row.id)}</small></td><td>${esc(row.category)}</td><td>${esc(row.unit||'—')}</td><td class="num operations-money">${fmt(row.price)}<small class="operations-inline-unit">云贝</small></td>`}<td>${displayDate(row.created,true)}</td><td><span class="${status.className}">${status.label}</span></td></tr>`}).join('')||`<tr><td colspan="${headers.length}" class="operations-empty">${query?'未找到匹配的记录':'该时间范围内暂无记录'}</td></tr>`;
 $('#operations-total').textContent=pageCaption(filtered.length,operationsPage);
 $('#operations-pagination').innerHTML=pager(pages,operationsPage,'operations-page');
}
document.addEventListener('click',event=>{
 const view=event.target.closest('[data-operations-view]');
 if(view&&isAdmin()){operationsView=view.dataset.operationsView;operationsStatus='all';operationsPage=1;renderOperations();return;}
 const statusButton=event.target.closest('[data-operations-status]');
 if(statusButton&&isAdmin()){operationsStatus=statusButton.dataset.operationsStatus;operationsPage=1;renderOperations();return;}
 const page=event.target.closest('[data-operations-page]');
 if(page&&isAdmin()&&!page.disabled){operationsPage=Number(page.dataset.operationsPage);renderOperations();}
});
$('#operations-period')?.addEventListener('change',()=>{operationsPage=1;renderOperations();});
$('#operations-search')?.addEventListener('input',()=>{operationsPage=1;renderOperations();});
