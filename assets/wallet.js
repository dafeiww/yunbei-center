function pager(pages,current,key){return `<button class="invoice-page-btn" data-${key}="${current-1}" ${current===1?'disabled':''} aria-label="上一页">上一页</button>${Array.from({length:pages},(_,i)=>`<button class="invoice-page-btn ${i+1===current?'current':''}" data-${key}="${i+1}" ${i+1===current?'aria-current="page"':''}>${i+1}</button>`).join('')}<button class="invoice-page-btn" data-${key}="${current+1}" ${current===pages?'disabled':''} aria-label="下一页">下一页</button>`;}
function pageCaption(count,page,size=10){return count?`共 ${count} 条 · 第 ${(page-1)*size+1}–${Math.min(page*size,count)} 条`:'暂无记录';}
function usageRow(r){return `<div class="usage-row"><div class="order-mini">${icon(productsById[orderById(r.orderId)?.productId]?.icon||'coin')}</div><div class="usage-row-copy"><strong>${esc(r.label)}</strong><small>${displayDate(r.created,true)} · ${esc(r.category||sourceLabel(r.source))}</small></div><strong class="usage-value num">${r.delta>0?'+':''}${fmt(r.delta)}</strong><button class="table-action" data-ledger-detail="${r.id}">详情</button></div>`;}
function renderDashboard(){
 const range=dashboardRange();if(!range.valid)return;
 const rows=dashboardRows(),spent=rows.filter(r=>r.delta<0),total=spent.reduce((s,r)=>s-r.delta,0),principal=rows.filter(r=>r.source==='recharge').reduce((s,r)=>s+r.delta,0),reward=rows.filter(r=>['bonus','checkin','invite'].includes(r.source)).reduce((s,r)=>s+r.delta,0);
 const paid=state.recharges.filter(o=>{const day=dateKey(new Date(o.created));return o.status==='paid'&&day>=range.start&&day<=range.end;}).reduce((s,o)=>s+o.paidCents,0);
 $('#dashboard-period-label').textContent=range.start.replaceAll('-','.')+' — '+range.end.replaceAll('-','.');
 $('#dash-spent').textContent=fmt(total);$('#dash-recharged').textContent=fmt(principal);$('#dash-reward').textContent=fmt(reward);$('#dash-count').textContent=spent.length;$('#dash-paid').textContent='充值实付 '+money(paid);$('#dash-average').textContent=spent.length?'平均每次 '+fmt(Math.round(total/spent.length))+' 云贝':'本期暂无消耗记录';
 $$('[data-period]').forEach(b=>{b.classList.toggle('active',b.dataset.period===dashboardPeriod);b.setAttribute('aria-pressed',String(b.dataset.period===dashboardPeriod));});
 $('#dashboard-custom-range').hidden=dashboardPeriod!=='custom';$('#dashboard-start').value=dashboardCustomStart;$('#dashboard-end').value=dashboardCustomEnd;$('#dashboard-start').max=today();$('#dashboard-end').max=today();
 const categories=new Map();for(const r of spent)categories.set(r.category||'其他权益',(categories.get(r.category||'其他权益')||0)-r.delta);
 const colors={'存储空间':'#78a3bc','项目分享':'#9f7b63','绘图消耗':'#e58b48','其他权益':'#b0bec7'};
 $('#usage-categories').innerHTML=[...categories].sort((a,b)=>b[1]-a[1]).map(([name,n])=>`<button class="category-usage" data-usage-category="${esc(name)}" style="--category-color:${colors[name]||'#b0bec7'}"><span>${esc(name)}<b class="num">${fmt(n)}<small>${(n/total*100).toFixed(0)}%</small></b></span><div class="category-track"><i style="width:${n/total*100}%"></i></div></button>`).join('')||'<div class="empty-state">该时段暂无使用记录</div>';
 $('#category-total').textContent=fmt(total);$('#dashboard-detail-caption').textContent=`本期共 ${spent.length} 笔使用记录 · 合计 ${fmt(total)} 云贝`;$('#dashboard-recent').innerHTML=spent.slice(0,5).map(usageRow).join('')||'<div class="empty-state">本期还没有使用云贝，兑换后可在这里查看。</div>';
 $('#trend-empty').hidden=spent.length>0;
 if(!$('#panel-dashboard').hidden&&window.echarts){
  if(!trendChart){trendChart=echarts.init($('#usage-trend'));trendChart.on('click',p=>{if(p.componentType==='series'&&p.value>0)openUsageDetails(p.name);});}
  const days=Array.from({length:range.days},(_,i)=>shiftedDay(range.start,i)),daily=new Map(days.map(d=>[d,0]));for(const r of spent){const d=dateKey(new Date(r.created));daily.set(d,(daily.get(d)||0)-r.delta);}
  trendChart.setOption({animation:false,color:['#e58b48'],textStyle:{fontFamily:'PingFang SC,Microsoft YaHei,sans-serif'},aria:{enabled:true},tooltip:{trigger:'axis',axisPointer:{type:'shadow'},formatter:items=>esc(items[0].axisValue)+'<br>消耗 '+fmt(items[0].value)+' 云贝'},grid:{top:24,left:50,right:18,bottom:35},xAxis:{type:'category',boundaryGap:true,data:days,axisLine:{lineStyle:{color:'#e2e8ed'}},axisTick:{show:false},axisLabel:{color:'#8a9aa5',fontSize:10,interval:Math.max(0,Math.floor(range.days/6)-1),formatter:v=>v.slice(5).replace('-','.')}},yAxis:{type:'value',min:0,minInterval:1,axisLabel:{color:'#8a9aa5',fontSize:10},splitLine:{lineStyle:{color:'#edf2f5',type:'dashed'}}},series:[{type:'bar',barMaxWidth:24,data:days.map(d=>daily.get(d))}]},true);trendChart.resize();
  $('#usage-trend').setAttribute('aria-label',`${range.start} 至 ${range.end}，合计消耗 ${total} 云贝。下方明细可查询全部记录。`);
 }
}
function openUsageDetails(day='',cat='',page=1){
 usageDetailDay=day;usageDetailCategory=cat;usageDetailPage=page;
 const rows=usageRows(),pages=Math.max(1,Math.ceil(rows.length/10));usageDetailPage=Math.max(1,Math.min(page,pages));
 openModal('云贝使用详情',`<p class="modal-intro">${day?day.replaceAll('-','.'):$('#dashboard-period-label').textContent}${cat?' · '+esc(cat):''}<br>共 ${rows.length} 笔，合计使用 <strong>${fmt(rows.reduce((s,r)=>s-r.delta,0))} 云贝</strong>。</p><div class="usage-dialog-list">${rows.slice((usageDetailPage-1)*10,usageDetailPage*10).map(usageRow).join('')||'<div class="empty-state">该范围内暂无使用记录</div>'}</div><div class="modal-list-pagination"><span>${pageCaption(rows.length,usageDetailPage)}</span><nav>${pager(pages,usageDetailPage,'usage-page')}</nav></div><div class="modal-actions"><button class="btn" data-action="close">关闭</button><button class="btn primary" data-action="export-usage">导出当前范围</button></div>`);$('#modal').classList.add('usage-detail-modal');
}
function ledgerItems(){return state.ledger.filter(r=>(ledgerFilter==='all'||(ledgerFilter==='income'?r.delta>0:r.delta<0))&&(ledgerSource==='all'||r.source===ledgerSource));}
function renderLedger(){
 const rows=ledgerItems(),pages=Math.max(1,Math.ceil(rows.length/10));ledgerPage=Math.max(1,Math.min(ledgerPage,pages));$('#ledger-total').textContent=pageCaption(rows.length,ledgerPage);
 $('#ledger-rows').innerHTML=rows.slice((ledgerPage-1)*10,ledgerPage*10).map(r=>`<tr><td class="record-title" data-label="变动说明"><div class="order-name">${esc(r.label)}</div></td><td data-label="云贝来源"><span class="source-pill">${sourceLabel(r.source)}</span></td><td data-label="发生时间">${displayDate(r.created,true)}</td><td data-label="云贝变动" class="num ${r.delta>0?'positive ledger-income':'negative ledger-expense'}">${r.delta>0?'+':''}${fmt(r.delta)}</td><td data-label="变动后余额" class="num">${fmt(r.balance)}</td><td data-label="关联单号"><button class="table-action" data-ledger-detail="${r.id}">${r.orderId==='—'?'查看详情':esc(r.orderId)}</button></td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:40px">暂无符合条件的明细</td></tr>';
 $('#ledger-pagination').innerHTML=pager(pages,ledgerPage,'ledger-page');
}
function ledgerDetails(id){const r=state.ledger.find(row=>row.id===id);if(!r)return;openModal('云贝变动详情',`<div class="exchange-preview">${icon(r.delta<0?'chart':'coin')}<div><h3>${esc(r.label)}</h3><p>${sourceLabel(r.source)}</p></div></div><div class="detail-line"><span>云贝变动</span><strong class="num ${r.delta>0?'positive':'negative'}">${r.delta>0?'+':''}${fmt(r.delta)} 云贝</strong></div><div class="detail-line"><span>发生时间</span><strong>${displayDate(r.created,true)}</strong></div><div class="detail-line"><span>变动后余额</span><strong>${fmt(r.balance)} 云贝</strong></div><div class="detail-line"><span>关联单号</span><strong style="font-size:11px">${esc(r.orderId)}</strong></div>${r.category?`<div class="detail-line"><span>使用去向</span><strong>${esc(r.category)}</strong></div>`:''}<div class="modal-actions"><button class="btn primary" data-action="close">了解了</button></div>`);}
function renderRecharge(){
 const visiblePlans=RECHARGE_PLANS.filter(p=>p.enabled!==false);if(!visiblePlans.some(p=>p.id===selectedPlan))selectedPlan=visiblePlans[0]?.id||'';const q=rechargeQuote(selectedPlan);if(!q){
  $('#recharge-plans').innerHTML='<div class="recharge-empty"><strong>暂无可用充值档位</strong><span>管理员启用档位后即可选择充值。</span></div>';
  const offer=$('#plans-offer-title');if(offer)offer.textContent='暂未开放';
  ['quote-face','quote-discount','quote-principal','quote-bonus','quote-total','quote-paid'].forEach(id=>$('#'+id).textContent='—');
  $('#checkout-first-tag').hidden=true;$('#simulate-pay').disabled=true;
  $('#payment-qr').innerHTML='<span class="qr-expired">暂无可用档位</span>';$('#payment-method-label').textContent='请选择可用档位后扫码支付';
  clearPaymentTimer();$('#payment-countdown').textContent='等待选择充值档位';pendingRecharge=null;return;
 }

 const offer=$('#plans-offer-title');if(offer)offer.textContent=(q.first?'首充 ':'充值 ')+formatZhe(Math.min(...visiblePlans.map(p=>rechargeQuote(p.id).discountZhe)));
 $('#recharge-plans').innerHTML=visiblePlans.map(p=>{const quote=rechargeQuote(p.id);return `<button class="recharge-plan ${p.id===selectedPlan?'selected':''}" data-plan="${p.id}" aria-pressed="${p.id===selectedPlan}" aria-label="${fmt(quote.principal)}云贝，赠送${fmt(quote.bonus)}云贝，${formatZhe(quote.discountZhe)}，实付${money(quote.paidCents)}"><span class="plan-rate">${formatZhe(quote.discountZhe)}</span><strong class="plan-points num">${fmt(quote.principal)}<small>云贝</small></strong><span class="plan-amount">原价 <del>${money(quote.faceCents)}</del></span><span class="plan-bonus ${quote.bonus?'':'empty'}">${quote.bonus?'额外赠送 '+fmt(quote.bonus)+' 云贝':'无额外赠送'}</span><span class="plan-note">实付 <b class="num">${money(quote.paidCents)}</b></span></button>`;}).join('');
 $('#quote-face').textContent=money(q.faceCents);updatePaymentQr(q);pendingRecharge=q;if($('#simulate-pay')){$('#simulate-pay').disabled=false;$('#simulate-pay').textContent='模拟支付完成';}startPaymentCountdown();$('#quote-discount').textContent='−'+money(q.faceCents-q.paidCents);$('.quote-discount span').textContent=q.discountZhe+'折优惠';$('#checkout-first-tag').textContent='充值 '+q.discountZhe+' 折';$('.quote-discount').hidden=false;$('#checkout-first-tag').hidden=false;$('#quote-principal').textContent=fmt(q.principal);$('#quote-bonus').textContent='+'+fmt(q.bonus);$('#quote-total').innerHTML=fmt(q.total)+'<small>云贝</small>';$('#quote-paid').textContent=money(q.paidCents);
}
function qrSvg(text,size=240){if(!window.QRCode)return '<div class="qr-fallback">二维码生成失败</div>';const qr=new QRCode(-1,1);qr.addData(text);qr.make();const n=qr.getModuleCount(),unit=size/n;let path='';for(let row=0;row<n;row++){for(let col=0;col<n;col++){if(qr.isDark(row,col))path+=`M${(col*unit).toFixed(2)} ${(row*unit).toFixed(2)}h${unit.toFixed(2)}v${unit.toFixed(2)}h-${unit.toFixed(2)}z`;}}return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="支付二维码"><rect width="${size}" height="${size}" fill="#fff"></rect><path d="${path}" fill="#111827"></path></svg>`;}
let paymentTimer=null,paymentDeadline=0;
function clearPaymentTimer(){clearInterval(paymentTimer);paymentTimer=null;}
function startPaymentCountdown(){clearPaymentTimer();paymentDeadline=Date.now()+5*60*1000;renderPaymentCountdown();paymentTimer=setInterval(renderPaymentCountdown,1000);}
function renderPaymentCountdown(){const el=$('#payment-countdown'),btn=$('#simulate-pay'),qr=$('#payment-qr');if(!el)return;const ms=Math.max(0,paymentDeadline-Date.now()),m=String(Math.floor(ms/60000)).padStart(2,'0'),sec=String(Math.floor(ms%60000/1000)).padStart(2,'0');if(ms<=0){clearPaymentTimer();el.textContent='二维码已过期';qr?.classList.add('expired');qr.innerHTML='<div class="qr-expired">二维码已过期<br><small>请重新选择充值档位</small></div>';if(btn){btn.disabled=true;btn.textContent='支付已超时';}return;}el.textContent=`支付倒计时 ${m}:${sec}`;}
function paymentQrData(q){return `https://pay.genescloud.cn/demo?amount=${(q.paidCents/100).toFixed(2)}&plan=${q.planId}&first=${q.first?1:0}`;}
function updatePaymentQr(q){const qr=$('#payment-qr'),label=$('#payment-method-label');if(!qr)return;qr.innerHTML=qrSvg(paymentQrData(q),180);qr.classList.remove('expired');label.textContent=`微信 / 支付宝均可扫码支付 ${money(q.paidCents)}`;}
function checkout(){}
function payRecharge(){const quote=pendingRecharge||rechargeQuote();if(!quote)return;pendingRecharge=quote;$('#simulate-pay').disabled=true;const order=completeRecharge(quote);if(!order){showError('充值优惠状态已变化，请刷新后重新确认订单。');return;}rechargePage=1;renderAll();openModal('充值成功',`<div class="success-icon">${icon('check')}</div><h3 class="success-title">${fmt(order.total)} 云贝已到账</h3><p class="success-desc">充值 ${fmt(order.principal)} 云贝${order.bonus?' + 赠送 '+fmt(order.bonus)+' 云贝':''}<br>本次实付 ${money(order.paidCents)}，当前可用 ${fmt(state.balance)} 云贝。</p><div class="detail-line"><span>充值订单号</span><strong style="font-size:11px">${order.id}</strong></div><div class="modal-note">${icon('file')}<span>此充值订单可申请 ${money(order.paidCents)} 发票，赠送云贝不额外开票。</span></div><div class="modal-links"><button class="btn primary" data-tab="shop">去兑换权益</button><button class="btn" data-tab="ledger">云贝明细</button><button class="btn primary" data-invoice-order="${order.id}">申请充值发票</button></div><div class="modal-actions"><button class="btn" data-action="close">完成</button></div>`);}
function rechargeDetails(id){const o=rechargeOrders().find(r=>r.id===id);if(!o)return;openModal('充值订单详情',`<div class="exchange-preview">${icon('coin')}<div><h3>${esc(o.name)} · 已支付</h3><p>${o.demo?'历史演示订单':'充值成功，云贝已到账'}</p></div></div><div class="detail-line"><span>充值订单号</span><strong style="font-size:11px">${o.id}</strong></div><div class="detail-line"><span>充值时间</span><strong>${displayDate(o.created,true)}</strong></div><div class="detail-line"><span>充值原价</span><strong>${money(o.faceCents)}</strong></div><div class="detail-line"><span>优惠减免</span><strong>${money(o.faceCents-o.paidCents)}</strong></div><div class="detail-line"><span>实付金额</span><strong>${money(o.paidCents)}</strong></div><div class="detail-line"><span>到账云贝</span><strong>${fmt(o.principal)} 充值 + ${fmt(o.bonus)} 赠送</strong></div><div class="detail-line total"><span>可开票金额</span><strong>${money(o.invoiceCents)}</strong></div><div class="modal-actions"><button class="btn" data-action="close">关闭</button><button class="btn primary" data-invoice-order="${id}">${getInvoiceState(o)==='available'?'申请开票':'查看发票'}</button></div>`);}
const INVITE_SHARE_URL='https://wx.genescloud.cn/inviteShare/d2FuZzEyMjE=';
let invitePage=1;
function renderInvites(){
 const invites=inviteRecords(),invitedCount=invites.length,earned=invites.reduce((sum,i)=>sum+(i.reward||10),0);
 const pages=Math.max(1,Math.ceil(invitedCount/10));invitePage=Math.max(1,Math.min(invitePage,pages));
 $('#invite-link').value=INVITE_SHARE_URL;
 $('#invite-count').textContent=invitedCount;$('#invite-earned').textContent=fmt(earned);$('#invite-month-caption').textContent=`成功邀请 ${invitedCount} 位好友，奖励均已记入云贝明细。`;
 $('#invite-records').innerHTML=invites.slice((invitePage-1)*10,invitePage*10).map(i=>`<tr><td class="record-title"><div class="invite-person"><span class="invite-person-avatar" aria-hidden="true">${esc(i.name.slice(0,1))}</span><div><strong>${esc(i.name)}</strong>${i.demo?'<span class="table-demo">历史示例</span>':''}</div></div></td><td data-label="注册时间">${displayDate(i.created,true)}</td><td data-label="我的奖励"><strong class="invite-reward-value num">+${i.reward||10}</strong> 云贝</td><td data-label="好友奖励">+${i.friendReward||10} 云贝</td><td data-label="状态"><span class="tag">已到账</span></td></tr>`).join('')||'<tr><td colspan="5" style="text-align:center;padding:40px">暂无邀请记录，复制链接邀请好友注册吧。</td></tr>';
 $('#invite-total').textContent=pageCaption(invitedCount,invitePage);$('#invite-pagination').innerHTML=pager(pages,invitePage,'invite-page');
}

async function copyInviteLink(){try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(INVITE_SHARE_URL);toast('邀请链接已复制。');}catch{const input=document.createElement('textarea');input.value=INVITE_SHARE_URL;document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();if(copied)toast('邀请链接已复制。');else openModal('邀请好友链接',`<p class="modal-intro">可选中下方链接复制，发给好友完成注册。</p><input style="width:100%;padding:12px;font-size:13px" readonly value="${INVITE_SHARE_URL}" aria-label="可复制的邀请链接"><div class="modal-actions"><button class="btn primary" data-action="close">关闭</button></div>`);}}
async function shareInviteLink(){try{if(navigator.share){await navigator.share({title:'云贝中心 · 邀请好友',text:'注册云贝中心，我们一起获得云贝奖励。',url:INVITE_SHARE_URL});return;}}catch{return;}await copyInviteLink();}

async function copyInvite(){try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(state.inviteCode);toast('邀请码 '+state.inviteCode+' 已复制。');}catch{const input=document.createElement('textarea');input.value=state.inviteCode;document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();if(copied)toast('邀请码已复制。');else openModal('你的专属邀请码',`<p class="modal-intro">可选中下方邀请码复制，发给好友在注册时填写。</p><input style="width:100%;padding:14px;font-size:24px;text-align:center" readonly value="${state.inviteCode}" aria-label="可复制的邀请码"><div class="modal-actions"><button class="btn primary" data-action="close">关闭</button></div>`);}}
function inviteDemo(){openModal('体验好友注册奖励',`<p class="modal-intro">模拟一位新好友填写你的邀请码并完成注册，体验奖励到账。当前不创建真实账号。</p><div class="detail-line"><span>使用的邀请码</span><strong>${state.inviteCode}</strong></div><form id="invite-demo-form"><div class="field"><label for="invite-friend-key">示例好友账号</label><input id="invite-friend-key" required pattern="[A-Za-z0-9@._-]{3,60}" maxlength="60" placeholder="例如 friend001"></div><div class="field"><label for="invite-friend-name">好友昵称</label><input id="invite-friend-name" required maxlength="30" placeholder="例如 研究伙伴小林"></div><p class="modal-intro">本次邀请人可得 10 云贝，好友注册成功得 10 云贝。只有未注册过基因云的新账号可以领奖。</p><div class="modal-error" id="modal-error" hidden></div><div class="modal-actions"><button type="button" class="btn" data-action="close">取消</button><button type="submit" class="btn primary">模拟注册成功</button></div></form>`);}
function confirmExchange(){
 const purchase=activeExchange;if(!purchase)return;if(state.balance<purchase.total){showError('当前云贝不足，请先充值。');return;}$('#confirm-exchange').disabled=true;activeExchange=null;const created=nowIso(),newOrders=[];
 for(const id of purchase.ids){const p=productsById[id],latest=state.orders.filter(o=>o.productId===id&&isActive(o)&&p.kind==='duration').reduce((max,o)=>Math.max(max,Date.parse(o.expires)),Date.parse(created)),orderId=uid('YB'),funding=spendPoints(p.price);if(!funding){showError('余额状态已变化，请刷新后重试。');return;}const order={id:orderId,kind:'exchange',productId:id,name:p.name,price:p.price,created,expires:p.kind==='generic'?null:addDays(latest,p.days),unit:p.unit,category:p.category,productIcon:p.icon,funding};state.orders.unshift(order);state.ledger.unshift({id:uid('L'),label:'兑换'+p.name,delta:-p.price,balance:state.balance,created,orderId,source:'exchange',category:p.category,funding});newOrders.push(order);}
 orderStatus='all';orderPage=1;$('#order-search').value='';$$('[data-order-status]').forEach(b=>b.classList.toggle('active',b.dataset.orderStatus==='all'));persist();renderAll();openModal('兑换完成',`<div class="success-icon">${icon('check')}</div><h3 class="success-title">兑换成功，权益已到账</h3><p class="success-desc">${newOrders.map(o=>esc(o.name)).join(' + ')}<br>已使用 ${fmt(purchase.total)} 云贝，剩余 ${fmt(state.balance)} 云贝。</p><div class="modal-links"><button class="btn" data-action="continue-shopping">继续兑换</button><button class="btn" data-tab="recharge">去充值</button><button class="btn" data-tab="invite">邀请好友</button></div><p class="payment-demo">本次为云贝权益兑换，不产生可开票订单。需要发票请在“发票管理”选择充值订单。</p>`);
}
function orderDetails(id){
 const o=exchangeOrders().find(r=>r.id===id);if(!o)return;
 const p=productsById[o.productId]||{unit:o.unit||'份',icon:o.productIcon||'gift'};
 openModal('兑换详情',`<div class="exchange-preview">${icon(p.icon||'gift')}<div><h3>${esc(o.name)}</h3><p>${esc(p.unit)} · ${!o.expires?'已兑换':isActive(o)?'生效中':'已到期'}</p></div></div><div class="detail-line"><span>兑换订单</span><strong style="font-size:11px">${esc(o.id)}</strong></div><div class="detail-line"><span>兑换时间</span><strong>${displayDate(o.created,true)}</strong></div>${o.expires?`<div class="detail-line"><span>权益到期</span><strong>${displayDate(o.expires,true)}</strong></div>`:''}<div class="detail-line"><span>消耗云贝</span><strong>${fmt(o.price)} 云贝</strong></div>${o.funding?`<div class="detail-line"><span>扣减明细</span><strong>奖励 ${fmt(o.funding.reward)} + 充值 ${fmt(o.funding.paid)} 云贝</strong></div>`:''}<p class="payment-demo">权益兑换不重复开票。发票仅支持已支付充值订单，按充值实付金额申请。</p><div class="modal-actions"><button class="btn primary" data-action="close">关闭</button></div>`);
}
function checkin(){const week=checkinWeek();if(week.checkedIn||week.count>=7){earn();return;}const reward=week.nextReward;state.lastCheckin=today();state.checkins.push({day:today(),reward});addCredit(reward,'checkin',`本周第 ${week.count+1} 次签到奖励`);persist();renderAll();earn(reward);toast('签到成功，'+reward+' 云贝已到账。');}
function showRules(){openModal('云贝使用规则',`<div class="rule"><h3>如何获得云贝？</h3><p>充值按 ¥1 = 10 云贝到账；充值享八折，云贝仍按原价发放，可叠加档位赠送。签到每周最多 70 云贝。邀请好友注册不限人数，邀请人得 10 云贝，好友也得 10 云贝。</p></div><div class="rule"><h3>充值与奖励余额</h3><p>余额分为充值余额和奖励余额；签到、充值赠送与邀请所得计入奖励余额。使用时优先扣减奖励云贝，再扣减充值余额，已有历史余额保留在奖励余额中。</p></div><div class="rule"><h3>只有充值订单可以开票</h3><p>按充值实付金额开票。八折优惠减免与赠送云贝不计入金额；权益兑换、签到与邀请奖励均不支持开票，避免重复申请。</p></div><div class="rule"><h3>使用记录与演示</h3><p>可在“云贝明细”按时间筛选查看收入与支出明细。当前为前端体验，支付与好友注册为模拟操作，数据保存在当前浏览器，未接入真实支付、注册和开票服务。</p></div><div class="modal-actions"><button class="btn primary" data-action="close">了解了</button></div>`);}
function invoiceRules(){openModal('充值开票说明',`<div class="rule"><h3>哪些订单可以开票？</h3><p>仅限已支付的充值订单；可单笔申请或合并开票。权益兑换、签到奖励、邀请奖励和充值赠送均不可开票。</p></div><div class="rule"><h3>发票金额怎么算？</h3><p>发票金额等于订单实付金额。例如充值 ¥100，享八折实付 ¥80，即可申请 ¥80 发票；到账 1,000 云贝及 50 赠送云贝不改变开票金额。</p></div><div class="rule"><h3>如何查询和下载？</h3><p>待开票订单填写抬头和邮箱后提交；申请中不可重复提交，已开票可下载 PDF。当前为示例演示，不产生真实税务发票。</p></div><div class="modal-actions"><button class="btn primary" data-action="close">了解了</button></div>`);}
function renderAll(){refreshShopCategories();renderOverview();renderProducts();renderOrders();renderLedger();renderInvoices();renderRecharge();renderInvites();renderDashboard();renderAdmin();renderRole();renderOperations();}
const pageInfo={
 recharge:['云贝充值','选择充值档位，云贝与赠送奖励一次到账。'],
 ledger:['云贝明细','查询每一笔收入与支出，清楚掌握账户变动。'],
 dashboard:['云贝看板','按时间查看消耗、充值与奖励，了解绘图与分析投入。'],
 shop:['兑换商城','用云贝兑换商品、专属权益与精彩活动。'],
 orders:['我的兑换','查询商品、权益与活动的兑换记录。'],
 invite:['邀请好友','分享邀请链接，好友注册成功后双方获得云贝。'],
 invoices:['发票管理','管理充值订单发票，按实付金额申请与下载。'],
 admin:['管理配置','管理充值档位与商城商品，确认启用或上架后对用户展示。'],
 operations:['运营统计','查看平台用户的充值与兑换情况，掌握人数、订单与金额。']
};
const HIDDEN_PAGES=['dashboard','orders'];
function setTab(tab,updateHash=true){
 if(HIDDEN_PAGES.includes(tab)||!Object.hasOwn(pageInfo,tab)||['admin','operations'].includes(tab)&&!isAdmin())tab='recharge';
 const changed=activeTab!==tab;activeTab=tab;
 $$('.page-panel').forEach(el=>el.hidden=el.id!=='panel-'+tab);
 $$('.sidebar [data-tab]').forEach(el=>{const match=el.dataset.tab===tab;el.classList.toggle('active',match);if(match)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 $('#page-title').textContent=pageInfo[tab][0];$('#page-description').textContent=pageInfo[tab][1];
 $('#breadcrumb-current').textContent=pageInfo[tab][0];
 $('#breadcrumb-current').hidden=tab==='home';$('#breadcrumb-divider').hidden=tab==='home';
 $('#page-balance').hidden=['invoices','recharge','admin','operations'].includes(tab);document.title=pageInfo[tab][0]+' · 派森诺基因云';
 if(updateHash&&location.hash!=='#'+tab)history.pushState(null,'','#'+tab);
 if(changed){window.scrollTo(0,0);if(updateHash)$('#page-title').focus({preventScroll:true});}
 if(tab==='dashboard')requestAnimationFrame(renderDashboard);
}
const actions={
 close:closeModal,rules:showRules,help:showRules,earn:()=>earn(),checkin,rights:showRights,'role-switch':roleSwitch,'add-plan':addPlan,'add-product':addProduct,
 recharge:()=>{closeModal();setTab('recharge');},checkout,'copy-invite':copyInvite,'copy-invite-link':copyInviteLink,'share-invite':shareInviteLink,'invite-demo':inviteDemo,'usage-details':()=>openUsageDetails(),'invoice-rules':invoiceRules,
 'apply-period':()=>{dashboardCustomStart=$('#dashboard-start').value;dashboardCustomEnd=$('#dashboard-end').value;const valid=dashboardRange().valid;$('#dashboard-range-error').textContent=valid?'':'请选择不晚于今天、开始早于结束且最多 366 天的日期范围。';if(valid)renderDashboard();},
 'view-orders':()=>{closeModal();setTab('orders');},'continue-shopping':()=>{closeModal();setTab('shop');},
 'clear-search':()=>{category='全部权益';$('#product-search').value='';$$('[data-category]').forEach(b=>{b.classList.toggle('active',b.dataset.category===category);b.setAttribute('aria-pressed',String(b.dataset.category===category));});renderProducts();},
 'reset-orders':()=>{orderStatus='all';orderPage=1;$('#order-search').value='';$$('[data-order-status]').forEach(b=>b.classList.toggle('active',b.dataset.orderStatus==='all'));renderOrders();},
 'export-orders':()=>exportCsv('云贝兑换记录.csv',[['订单编号','兑换权益','支付云贝','兑换时间','权益到期时间','权益状态'],...currentOrders().map(o=>[o.id,o.name,o.price,displayDate(o.created,true),o.expires?displayDate(o.expires,true):'—',!o.expires?'已兑换':isActive(o)?'生效中':'已到期'])]),
 'export-ledger':()=>exportCsv('云贝收支明细.csv',[['变动说明','云贝来源','发生时间','云贝变动','变动后余额','关联单号'],...ledgerItems().map(r=>[r.label,sourceLabel(r.source),displayDate(r.created,true),r.delta,r.balance,r.orderId])]),
 'export-usage':()=>exportCsv('云贝使用明细.csv',[['变动说明','权益分类','发生时间','消耗云贝','关联单号'],...usageRows().map(r=>[r.label,r.category,displayDate(r.created,true),-r.delta,r.orderId])]),
 contact:()=>openModal('帮助与反馈',`<div class="rule"><h3>充值与云贝到账</h3><p>充值后在云贝充值中查看订单，云贝明细可核对充值、赠送和使用记录。</p></div><div class="rule"><h3>发票申请</h3><p>仅充值实付金额可开票，权益兑换与赠送云贝不可开票。当前为本地演示，可在此体验完整流程。</p></div><div class="modal-actions"><button class="btn primary" data-action="close">了解了</button></div>`),
 workspace:()=>openModal('科研工作台',`<div class="exchange-preview">${icon('chart')}<div><h3>为绘图与分析准备更多可能</h3><p>在云贝中心充值、积累奖励并兑换科研权益。</p></div></div><div class="modal-links"><button class="btn primary" data-tab="recharge">去云贝</button><button class="btn" data-tab="shop">去兑换权益</button><button class="btn" data-tab="invite">邀请好友</button><button class="btn" data-tab="ledger">云贝明细</button></div><div class="modal-actions"><button class="btn primary" data-action="close">返回云贝中心</button></div>`),
 profile:()=>openModal('个人中心',`<div class="exchange-preview">${icon('user')}<div><h3>科研探索者</h3><p>个人工作空间 · 体验账户</p></div></div><div class="detail-line"><span>当前云贝</span><strong>${fmt(state.balance)} 云贝</strong></div><div class="detail-line"><span>专属邀请码</span><strong>${state.inviteCode}</strong></div><div class="modal-actions"><button class="btn primary" data-action="close">关闭</button></div>`)
};
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.tab){if(!$('#overlay').hidden)closeModal();setTab(b.dataset.tab);return;}
 if(b.dataset.plan){selectedPlan=b.dataset.plan;renderRecharge();return;}
 if(b.dataset.payment){paymentMethod=b.dataset.payment;$$('[data-payment]').forEach(e=>e.classList.toggle('selected',e===b));if($('#payment-qr'))updatePaymentQr(rechargeQuote());return;}
 if(b.id==='simulate-pay'){payRecharge();return;}
 if(b.dataset.period){dashboardPeriod=b.dataset.period;$('#dashboard-range-error').textContent='';renderDashboard();return;}
 if(b.dataset.usageCategory){openUsageDetails('',b.dataset.usageCategory);return;}
 if(b.dataset.usagePage){openUsageDetails(usageDetailDay,usageDetailCategory,Number(b.dataset.usagePage));return;}
 if(b.dataset.ledgerDetail){ledgerDetails(b.dataset.ledgerDetail);return;}
 if(b.dataset.rechargeDetail){rechargeDetails(b.dataset.rechargeDetail);return;}
 if(b.dataset.removePlan){state.config.rechargePlans=state.config.rechargePlans.filter(p=>p.id!==b.dataset.removePlan);renderAdmin();return;}
 if(b.dataset.removeProduct){state.config.catalog=state.config.catalog.filter(p=>p.id!==b.dataset.removeProduct);renderAdmin();return;}
 if(b.dataset.invitePage){invitePage=Number(b.dataset.invitePage);renderInvites();return;}
 if(b.dataset.ledgerPage){ledgerPage=Number(b.dataset.ledgerPage);renderLedger();return;}
 if(b.dataset.exchange){exchange([b.dataset.exchange]);return;}
 if(b.dataset.category){category=b.dataset.category;$$('[data-category]').forEach(e=>{e.classList.toggle('active',e===b);e.setAttribute('aria-pressed',String(e===b));});renderProducts();return;}
 if(b.dataset.orderStatus){orderStatus=b.dataset.orderStatus;orderPage=1;$$('[data-order-status]').forEach(e=>e.classList.toggle('active',e===b));renderOrders();return;}
 if(b.dataset.orderPage){orderPage=Number(b.dataset.orderPage);renderOrders();return;}
 if(b.dataset.ledgerFilter){ledgerFilter=b.dataset.ledgerFilter;ledgerPage=1;$$('[data-ledger-filter]').forEach(e=>e.classList.toggle('active',e===b));renderLedger();return;}
 if(b.dataset.invoiceFilter){invoiceFilter=b.dataset.invoiceFilter;invoicePage=1;selectedInvoices.clear();$$('[data-invoice-filter]').forEach(e=>e.classList.toggle('active',e===b));renderInvoices();return;}
 if(b.dataset.invoicePage){invoicePage=Number(b.dataset.invoicePage);renderInvoices();return;}
 if(b.dataset.orderDetail){orderDetails(b.dataset.orderDetail);return;}
 if(b.dataset.downloadInvoice){downloadInvoice(b.dataset.downloadInvoice);return;}
 if(b.dataset.invoiceOrder){invoiceDetails(b.dataset.invoiceOrder);return;}
 if(b.dataset.invoiceType){saveInvoiceDraft();invoiceType=b.dataset.invoiceType;invoiceDraft.type=invoiceType;applyInvoiceType();$('#invoice-title').value=invoiceDraft[invoiceType+'Title'];fieldError('invoice-title','');fieldError('invoice-tax','');return;}
 if(b.id==='confirm-exchange'){confirmExchange();return;}if(b.id==='checkin'){checkin();return;}if(b.id==='batch-invoice'){invoiceForm([...selectedInvoices]);return;}
 if(b.dataset.action&&actions[b.dataset.action])actions[b.dataset.action]();
});
document.addEventListener('submit',event=>{
 if(event.target.id==='invoice-form')submitInvoice(event);
 if(event.target.id==='invite-demo-form'){event.preventDefault();const result=registerInvitedFriend($('#invite-friend-key').value,$('#invite-friend-name').value);if(result.error){showError(result.error);return;}closeModal();renderAll();toast('双方奖励已到账：邀请人 +10 云贝，好友 +10 云贝。');}
});
$('#product-search').addEventListener('input',renderProducts);$('#order-search').addEventListener('input',()=>{orderPage=1;renderOrders();});$('#sort-select').addEventListener('change',e=>{sortMode=Number(e.target.value);renderProducts();});$('#ledger-source-filter').addEventListener('change',e=>{ledgerSource=e.target.value;ledgerPage=1;renderLedger();});
document.addEventListener('input',event=>{if(event.target.closest('#invoice-form')&&event.target.id!=='invoice-note')fieldError(event.target.id,'');});
document.addEventListener('change',event=>{if(event.target.dataset.invoiceCheck){const id=event.target.dataset.invoiceCheck;if(event.target.checked)selectedInvoices.add(id);else selectedInvoices.delete(id);updateInvoiceSelection();}if(['select-all-invoices','select-all-invoices-mobile'].includes(event.target.id)){invoicePageItems().filter(o=>getInvoiceState(o)==='available').forEach(o=>{if(event.target.checked)selectedInvoices.add(o.id);else selectedInvoices.delete(o.id);});renderInvoices();}});
function invoiceItems(){return invoiceOrders().filter(o=>invoiceFilter==='all'||getInvoiceState(o)===invoiceFilter);}
function invoicePageItems(){return invoiceItems().slice((invoicePage-1)*10,invoicePage*10);}
$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeModal();});
document.addEventListener('keydown',event=>{if(!$('#overlay').hidden){if(event.key==='Escape'){closeModal();return;}if(event.key==='Tab'){const focusable=$$('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]',$('#modal')).filter(e=>e.getClientRects().length),first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('#modal'))){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===$('#modal'))){event.preventDefault();first?.focus();}}}else if(event.target.matches('.tabs .tab')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const tabs=$$('.tabs .tab'),i=tabs.indexOf(event.target),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[next].dataset.tab);tabs[next].focus();}});
window.addEventListener('hashchange',()=>setTab(location.hash.slice(1)||'recharge',false));window.addEventListener('popstate',()=>setTab(location.hash.slice(1)||'recharge',false));window.addEventListener('resize',()=>trendChart?.resize());
window.addEventListener('storage',e=>{if(e.key===STORE){try{const next=JSON.parse(e.newValue);if(next?.walletVersion===2&&Array.isArray(next.orders)&&Array.isArray(next.ledger)){state=next;renderAll();}}catch{}}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){renderOverview();if($('#modal').classList.contains('checkin-modal'))earn();}});
renderAll();setTab(location.hash.slice(1)||'recharge',false);

function roleSwitch(){
 openModal('切换角色',`<p class="modal-intro">普通用户使用充值和兑换功能；管理员可配置充值档位、赠送比例和商城权益。</p><div class="role-cards"><button class="role-card ${state.role==='user'?'current':''}" data-set-role="user"><strong>普通用户</strong><small>充值 · 兑换 · 明细 · 发票</small></button><button class="role-card ${state.role==='admin'?'current':''}" data-set-role="admin"><strong>管理员</strong><small>充值与商城配置</small></button></div><div class="modal-actions"><button class="btn" data-action="close">关闭</button></div>`);
}
function addPlan(){state.config.rechargePlans.push({id:uid('P'),yuan:100,bonusPercent:5,enabled:false});renderAdmin();}
function addProduct(){state.config.catalog.push({id:uid('P'),name:'新商品',category:'商品兑换',price:500,unit:'份',enabled:false,kind:'generic',icon:'gift',color:'peach',badge:'商品兑换'});renderAdmin();}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-set-role]');if(!b)return;
 state.role=b.dataset.setRole==='admin'?'admin':'user';persist();renderRole();renderAdmin();renderAll();closeModal();if(['admin','operations'].includes(activeTab)&&!isAdmin())setTab('recharge');
});
