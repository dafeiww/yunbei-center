
(() => {
 const initial={checks:[],perks:[],friends:[],usage:[],pass:null,offset:0};
 const s=state.supply=Object.assign(initial,state.supply||{});
 const day=()=>dateKey(new Date(Date.now()+s.offset*86400000));
 const start=()=>weekStart(day());
 const clone=v=>JSON.parse(JSON.stringify(v));
 const definitions={volcano:{name:'高级火山图体验',unit:'次'},palette:{name:'科研配色模板包',unit:'份'},export:{name:'矢量图导出体验',unit:'次'}};
 const defaults={version:1,updatedAt:'',checkin:{enabled:true,rewards:[5,5,10,10,40],unlockAt:3,perk:'volcano'},recharge:{enabled:true,weeks:['volcano','palette','export']},invite:{enabled:true,inviter:[10,20,20],friend:[10,20,20],returnDays:7,monthlyCap:20}};
 if(!state.config.supplyRules)state.config.supplyRules=clone(defaults);
 const cfg=()=>state.config.supplyRules;
 const inviteExamples=[['林同学',1,1],['陈同学',2,4],['周同学',3,9]].map(([name,stage,age],i)=>({id:'DEMO-SUPPLY-'+i,name,created:shiftedDay(day(),-age),stage,reward:defaults.invite.inviter.slice(0,stage).reduce((a,b)=>a+b,0),friendReward:defaults.invite.friend.slice(0,stage).reduce((a,b)=>a+b,0),rules:clone(defaults.invite),demo:true}));
 s.weekRules=s.weekRules||{};s.events=s.events||[];s.configHistory=s.configHistory||[];
 const rule=()=>s.weekRules[start()]||cfg().checkin;
 const log=(who,source,kind,amount,reference='')=>s.events.unshift({id:uid('AW'),day:day(),who,source,kind,amount,reference});
 const grant=(id,kind,source)=>{if(s.perks.some(p=>p.id===id))return;s.perks.push({id,kind,name:definitions[kind].name,used:false});log('当前用户',source,definitions[kind].name,1,id);};
 if(s.pass&&!s.pass.weeks)s.pass.weeks=clone(cfg().recharge.weeks);
 let activePerkId=null;

 const checks=()=>s.checks.filter(c=>c.day>=start()&&c.day<=shiftedDay(start(),6));
 const done=()=>checks().some(c=>c.day===day());
 const put=()=>persist();
 const button=(action,label,disabled=false)=>`<button type="button" class="btn primary" data-supply="${action}" ${disabled?'disabled':''}>${label}</button>`;
 function trialSvg(){let dots='';for(let i=0;i<84;i++){const x=61+(i*61%462),y=267-((i*43%190));const dx=(x-292)/90;const sig=y<184&&Math.abs(dx)>1;dots+=`<circle cx="${x}" cy="${y}" r="${sig?4.5:3.5}" fill="${sig?(dx>0?'#e79a5e':'#699bb8'):'#c2ccd3'}" opacity=".85"/>`;}return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 340"><rect width="580" height="340" fill="white"/><text x="290" y="30" text-anchor="middle" font-size="17" fill="#344454">Volcano plot · Example data</text><path d="M55 55V280H540" fill="none" stroke="#9eaab5"/><path d="M55 184H540M202 55V280M382 55V280" stroke="#dce3e8" stroke-dasharray="5 5"/>${dots}<text x="290" y="321" text-anchor="middle" font-size="13" fill="#71818e">log2 fold change</text><text x="18" y="170" transform="rotate(-90 18 170)" text-anchor="middle" font-size="12" fill="#71818e">−log10 adjusted P</text></svg>`;}
 function useTrial(perkId=null){
  const perk=perkId?s.perks.find(p=>p.id===perkId&&!p.used):null;
  if(perkId&&!perk){toast('这份权益已经使用。');return;}
  activePerkId=perk?.id||null;
  const palette=perk?.kind==='palette';
  const art=palette?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 270"><rect width="580" height="270" fill="white"/><text x="34" y="40" font-size="18" fill="#344454">Research color palette</text>${['#699bb8','#e79a5e','#92b29e','#ae9bc3','#d0ad6d'].map((c,i)=>`<rect x="${34+i*104}" y="72" width="90" height="118" rx="8" fill="${c}"/><text x="${79+i*104}" y="216" text-anchor="middle" font-size="13" fill="#53616f">${c}</text>`).join('')}</svg>`:trialSvg();
  openModal(perk?.name||'示例绘图体验',`<p class="supply-modal-note">${palette?'科研配色模板已准备好，可下载为可编辑 SVG。':'已载入火山图示例数据。完成一次生成与导出，记录本次绘图体验。'}</p><div class="supply-chart" id="supply-chart">${art}</div><p class="supply-modal-note">${perk?'本次将使用这份已领取权益。':'当前为免费示例，用于体验操作流程。'}</p><div class="modal-actions">${button('export',palette?'下载配色模板':'导出示例图，完成体验')}</div>`);
 }
 function exportTrial(){
  const art=$('#supply-chart svg');if(!art)return;
  const perk=activePerkId?s.perks.find(p=>p.id===activePerkId&&!p.used):null;
  const url=URL.createObjectURL(new Blob([art.outerHTML],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=(perk?.name||'基因云-示例火山图')+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  s.usage.push({day:day(),id:uid('USE')});if(perk){perk.used=true;log('当前用户','权益使用',perk.name,1,perk.id);}activePerkId=null;put();closeModal();renderAll();toast('文件已导出，本次体验已完成。');
 }
 function track(){
  const r=rule(),n=checks().length,total=r.rewards.reduce((a,b)=>a+b,0),earned=checks().reduce((a,c)=>a+c.reward,0);
  if(!cfg().checkin.enabled)return '<div class="supply-paused">签到补给暂未开放，已经获得的云贝和权益仍可使用。</div>';
  return `<div class="supply-track-head"><strong>本周补给进度 ${n}/5</strong><span>${earned}/${total} 云贝</span></div><div class="supply-days">${r.rewards.map((v,i)=>`<div class="supply-day ${i<n?'done':''} ${i+1===r.unlockAt||i===4?'milestone':''}"><b>${i<n?'✓':'+'+v}</b><span>第${i+1}次${i+1===r.unlockAt?' · 体验':i===4?' · 大礼包':''}</span></div>`).join('')}</div><div class="supply-track-bottom"><span>${n>=5?'本周补给已领满，下周继续。':n>=r.unlockAt?'绘图体验已解锁，再来 '+(5-n)+' 次领满云贝。':'再签到 '+(r.unlockAt-n)+' 次，解锁'+definitions[r.perk].name+'。'}</span>${button('check',n>=5?'本周已领满':done()?'今日已签到':'签到领补给',n>=5||done())}</div>`;
 }
 function sign(){
  if(!cfg().checkin.enabled){toast('签到补给暂未开放。');return;}
  const n=checks().length;if(done()||n>=5)return showCheck();
  if(!s.weekRules[start()])s.weekRules[start()]=clone(cfg().checkin);
  const r=rule(),reward=r.rewards[n];s.checks.push({day:day(),reward});addCredit(reward,'checkin','科研补给 · 本周第 '+(n+1)+' 次签到');log('当前用户','签到补给','云贝',reward,start());
  if(n+1===r.unlockAt)grant('check-'+start(),r.perk,'签到补给');put();renderAll();showCheck(reward);
 }
 function showCheck(reward=0){const r=rule(),total=r.rewards.reduce((a,b)=>a+b,0);openModal('每周科研补给',`${reward?`<div class="supply-award">签到成功，${reward} 云贝已到账。${checks().length===r.unlockAt?definitions[r.perk].name+'已解锁。':''}</div>`:''}${track()}<p class="supply-modal-note" style="margin-top:18px">每周任选 5 天参与，无需连续。第 ${r.unlockAt} 次额外解锁 ${definitions[r.perk].name}，第 5 次累计领满 ${total} 云贝。周一开启新一轮，已获得的云贝和体验权益保留。</p>${checks().length>=r.unlockAt?`<div class="modal-actions">${button('owned','查看我的补给')}</div>`:''}`);}
 const rechargePanel=$('#panel-recharge');
 rechargePanel.insertAdjacentHTML('afterbegin','<section class="supply-hero"><div><span class="supply-kicker">每周科研补给</span><h2>这周，免费解锁<br><em>你的下一张好图。</em></h2><p>来 3 天，拿绘图体验；来 5 天，领满 70 云贝。<br>无需连续签到，每一份收获都为你保留。</p></div><div id="supply-track"></div></section>');
 rechargePanel.insertAdjacentHTML('beforeend','<div class="supply-heading"><h3>首充一次，未来三周都有期待</h3><small>每周完成一次绘图或分析，领取当周进阶权益</small></div><div class="supply-perks" id="supply-pass"></div><article class="supply-trial-card"><h3>我的科研补给</h3><p id="supply-owned"></p><button class="btn" data-supply="trial">进入示例绘图体验</button><button class="btn" style="margin-left:8px" data-tab="invite">送同门一份绘图体验</button></article>');
 $('.checkout-summary .surface-heading').insertAdjacentHTML('afterend','<div class="supply-recharge-note" id="supply-payment-note">首充 8 折，再解锁 3 周进阶补给。<br>云贝与原有赠送即时到账。</div>');
 const nativeQuote=rechargeQuote;
 rechargeQuote=function(id=selectedPlan){const q=nativeQuote(id);if(!q)return q;const first=!state.recharges.some(o=>o.status==='paid');return {...q,first,discountZhe:first?q.discountZhe:10,paidCents:first?q.paidCents:q.faceCents};};
 const nativeComplete=completeRecharge;
 completeRecharge=function(q){const order=nativeComplete(q);if(order){if(order.bonus){state.wallet.paid-=order.bonus;state.wallet.reward+=order.bonus;const row=state.ledger.find(r=>r.orderId===order.id&&r.label==='充值赠送云贝');if(row)row.source='bonus';}if(order.first&&!s.pass&&cfg().recharge.enabled)s.pass={start:day(),usageStart:s.usage.length,claimed:[],weeks:clone(cfg().recharge.weeks)};put();}return order;};
 const nativeRecharge=renderRecharge;
 renderRecharge=function(){nativeRecharge();const q=rechargeQuote();if(!q)return;$('#plans-offer-title').textContent=q.first?'首充 '+formatZhe(q.discountZhe)+(cfg().recharge.enabled?' · 送3周补给':''):'常规充值';$('#checkout-first-tag').textContent=q.first?'首充 '+q.discountZhe+' 折':'常规充值';if(!q.first){$('.quote-discount').hidden=true;$('#checkout-first-tag').hidden=true;$$('.plan-rate').forEach(e=>e.hidden=true);}$('#supply-payment-note').textContent=q.first?(cfg().recharge.enabled?'首充享优惠，再解锁 3 周进阶补给。云贝与原有赠送即时到账。':'首充享档位优惠，云贝与原有赠送即时到账。补给活动暂未开放。'):'已享首充优惠；当前按原价充值，档位赠送照常到账。';};
 const nativePay=payRecharge;
 payRecharge=function(){
  const previousOrder=state.recharges[0]?.id,previousPass=s.pass;
  nativePay();
  const order=state.recharges[0];
  if(!order||order.id===previousOrder||order.status!=='paid')return;
  const passStarted=order.first&&s.pass&&s.pass!==previousPass;
  $('#modal-content').innerHTML=`<div class="supply-payment-success">
   <div class="supply-payment-result"><div class="success-icon">${icon('check')}</div><h3>${fmt(order.total)} <span>云贝已到账</span></h3><p>充值 ${fmt(order.principal)} 云贝${order.bonus?' + 赠送 '+fmt(order.bonus)+' 云贝':''}</p></div>
   <div class="supply-payment-summary"><div><span>本次实付</span><strong>${money(order.paidCents)}</strong></div><div><span>当前可用云贝</span><strong>${fmt(state.balance)} <small>云贝</small></strong></div></div>
   ${passStarted?`<div class="supply-payment-pass">${icon('gift')}<div><strong>三周进阶补给已开启</strong><p>每周完成一次绘图或分析，即可领取当周权益。</p><small>本周可领：${esc(definitions[s.pass.weeks[0]].name)}</small></div></div>`:''}
   <div class="supply-payment-receipt"><div class="supply-payment-order"><span>充值订单号</span><strong>${esc(order.id)}</strong></div><div class="supply-payment-invoice"><div><span>可开票金额 <b>${money(order.paidCents)}</b></span><small>赠送云贝不计入开票金额</small></div><button type="button" class="supply-payment-link" data-invoice-order="${esc(order.id)}">申请充值发票</button></div></div>
   <div class="supply-payment-links">${passStarted?'<button type="button" class="supply-payment-link" data-tab="shop">去兑换权益</button>':''}<button type="button" class="supply-payment-link" data-tab="ledger">云贝明细</button></div>
   <div class="modal-actions supply-payment-actions"><button type="button" class="btn" data-action="close">完成</button>${passStarted?button('trial','去完成本周绘图'):'<button type="button" class="btn primary" data-tab="shop">去兑换权益</button>'}</div>
  </div>`;
 };
 function passStatus(i){if(!s.pass)return 'unpaid';const from=shiftedDay(s.pass.start,i*7),to=shiftedDay(from,6);if(s.pass.claimed.includes(i))return 'claimed';if(day()<from)return 'future';if(day()>to)return 'expired';return s.usage.slice(s.pass.usageStart).some(u=>u.day>=from&&u.day<=to)?'ready':'task';}
 function claim(i){if(passStatus(i)!=='ready')return;s.pass.claimed.push(i);grant('pass-'+s.pass.start+'-'+i,s.pass.weeks[i],'首充补给');put();renderAll();toast('本周进阶补给已领取，可在“我的科研补给”查看。');}
 function friendAdd(){
  if(!cfg().invite.enabled){toast('邀请活动暂未开放。');return;}
  const month=day().slice(0,7);if(s.friends.filter(f=>f.created.startsWith(month)).length>=cfg().invite.monthlyCap){toast('已达到本月有效邀请名额。');return;}
  openModal('体验邀请同门',`<p class="supply-modal-note">模拟未注册的新好友通过你的链接注册。后续奖励按本次邀请创建时的规则执行。</p><form id="supply-invite-form"><div class="field"><label>好友昵称<input name="friend" maxlength="24" required placeholder="例如：小林同学"></label></div><div class="field"><label>模拟好友账号<input name="account" maxlength="60" pattern="[A-Za-z0-9@._-]{3,60}" required placeholder="例如：researcher01"></label></div><div class="modal-error" id="supply-friend-error" hidden></div><div class="modal-actions"><button class="btn primary" type="submit">模拟好友注册</button></div></form>`);
 }
 function friendAdvance(id){
  const f=s.friends.find(x=>x.id===id);if(!f||f.stage>=3)return;
  const r=f.rules||cfg().invite;
  if(f.stage===2&&day()<shiftedDay(f.created,r.returnDays)){toast('回访奖励尚未解锁：注册满 '+r.returnDays+' 天后再次使用可领取。');return;}
  const index=f.stage;f.stage++;f.reward+=r.inviter[index];f.friendReward+=r.friend[index];const label=f.stage===2?'首次完成绘图':'次周再次使用';
  addCredit(r.inviter[index],'invite','同门邀请 · '+label,f.id);log('当前用户','邀请奖励','云贝',r.inviter[index],f.id);log('受邀好友：'+f.name,'好友奖励','云贝',r.friend[index],f.id);put();renderAll();toast('奖励已发放：邀请人 +'+r.inviter[index]+'，好友 +'+r.friend[index]+' 云贝。');
 }
 function inviteTable(friends,r){
  const rows=friends.map(f=>{
   const fr=f.rules||r,stage=Math.min(3,Math.max(1,f.stage));
   const status={1:'等待完成首图',2:'等待次周回访',3:'全部解锁'}[stage];
   const reward=(amount,total)=>`<strong class="supply-invite-reward">${fmt(amount)}</strong><span class="supply-invite-limit"> / ${fmt(total)} 云贝</span>`;
   const action=f.demo?'<span class="supply-invite-action-note">—</span>':stage<3?button('friend-'+f.id,stage===1?'模拟好友完成首图':'模拟好友回访使用'):'<span class="supply-invite-action-note">已完成</span>';
   return `<tr class="supply-invite-row" data-supply-example="${f.demo?'true':'false'}">
    <td><div class="supply-invite-person"><strong title="${esc(f.name)}">${esc(f.name)}</strong>${f.demo?'<span class="supply-example-tag">示例</span>':''}</div></td>
    <td class="supply-invite-date">${esc(f.created.replaceAll('-','.'))}</td>
    <td><span class="supply-invite-progress stage-${stage}"><i aria-hidden="true"></i>${status}</span></td>
    <td>${reward(f.reward,fr.inviter.reduce((a,b)=>a+b,0))}</td>
    <td>${reward(f.friendReward,fr.friend.reduce((a,b)=>a+b,0))}</td>
    <td>${action}</td>
   </tr>`;
  }).join('');
  return `<article class="surface supply-invite-records">
   <div class="supply-heading"><div><h3>同门成长进度</h3><p class="supply-invite-count">共 ${friends.length} 位好友 · 含 3 条示例记录</p></div><button class="btn" data-supply="friend-add" ${r.enabled?'':'disabled'}>体验好友注册</button></div>
   <div class="supply-invite-table-wrap" tabindex="0" role="region" aria-label="邀请好友进度表，可横向滚动">
    <table class="supply-invite-table" aria-label="同门成长进度">
     <colgroup><col class="invite-col-person"><col class="invite-col-date"><col class="invite-col-progress"><col class="invite-col-reward"><col class="invite-col-reward"><col class="invite-col-action"></colgroup>
     <thead><tr><th scope="col">好友昵称</th><th scope="col">注册时间</th><th scope="col">成长进度</th><th scope="col">我获得奖励</th><th scope="col">好友获得奖励</th><th scope="col">操作</th></tr></thead>
     <tbody>${rows||'<tr><td colspan="6" class="supply-empty">还没有邀请记录，送同门一份绘图体验吧。</td></tr>'}</tbody>
    </table>
   </div><p class="supply-invite-scroll-hint">左右滑动，查看完整奖励与操作</p>
  </article>`;
 }
 function inviteView(){
  const r=cfg().invite,friends=[...s.friends,...inviteExamples],earned=friends.reduce((n,f)=>n+f.reward,0),max=r.inviter.reduce((a,b)=>a+b,0),friendMax=r.friend.reduce((a,b)=>a+b,0),link=new URL(location.href);if(['云贝科研补给-管理员原型.html','admin.html'].includes(decodeURIComponent(link.pathname).split('/').pop()))link.pathname=link.pathname.replace(/[^/]+$/,'云贝科研补给-交互原型.html');link.hash='invite';link.searchParams.set('gift','volcano');
  $('#panel-invite').innerHTML=`<section class="supply-invite-hero"><div><span class="supply-kicker">送同门一份科研见面礼</span><h2>这张图，<br>你也可以做。</h2><p>分享同款模板、示例数据和新人绘图体验。<br>一起做出第一张图，再一起解锁下一份补给。</p><div class="supply-badge" style="display:inline-block;margin-top:16px">${r.enabled?'每位有效新用户：邀请人最高 '+max+' 云贝，好友最高 '+friendMax+' 云贝':'邀请活动暂未开放，已有邀请按原规则继续'}</div></div><div class="supply-gift"><h3>你的科研见面礼</h3><span>火山图同款模板 + 示例数据</span><span>新人绘图体验 1 次</span><input readonly id="supply-link" aria-label="邀请体验链接" value="${esc(link.href)}">${button('copy','复制邀请体验链接',!r.enabled)}<small class="supply-status">已邀请 ${friends.length} 位 · 累计获得 ${earned} 云贝（含示例）</small></div></section><div class="supply-perks">${['好友完成注册','好友完成第一张图','好友回访再次使用'].map((name,i)=>`<article class="supply-invite-step"><b>+${r.inviter[i]} <small style="font-size:12px">云贝 / 邀请人</small></b><h3>${name}</h3><p>好友同步获得 ${r.friend[i]} 云贝${i===2?'；注册满 '+r.returnDays+' 天后再次使用。':'。'}</p></article>`).join('')}</div>${inviteTable(friends,r)}<p class="quiet-note" style="margin-top:12px">每位新用户仅参与一次；每位邀请人每月最多 ${r.monthlyCap} 位。列表含 3 条示例记录，示例奖励仅作展示，不计入余额或月度名额。好友账户与使用行为通过按钮模拟。</p>`;
 }
 renderInvites=inviteView;
 checkin=sign;earn=showCheck;actions.checkin=sign;actions.earn=()=>showCheck();
 actions.rules=()=>{const c=cfg(),r=rule();openModal('科研补给规则',`<div class="rule"><h3>每周签到</h3><p>每日一次，无需连续。累计 ${r.unlockAt} 天解锁 ${definitions[r.perk].name}，5 天累计 ${r.rewards.reduce((a,b)=>a+b,0)} 云贝。周一开启新一轮，已获奖励保留。</p></div><div class="rule"><h3>首充补给</h3><p>首充折扣按充值档位配置。额外补给${c.recharge.enabled?'已开启':'暂未开放'}；开启后以充值日为起点，每 7 天一个周期，共 3 周。每周期完成一次绘图或分析可领取一次权益，当期逾期未领不补发，已领取权益保留。</p></div><div class="rule"><h3>邀请奖励</h3><p>注册、首次绘图、回访三个阶段，邀请人分别得 ${c.invite.inviter.join('、')} 云贝，好友分别得 ${c.invite.friend.join('、')} 云贝。回访需注册满 ${c.invite.returnDays} 天后再次使用；每位邀请人每月最多 ${c.invite.monthlyCap} 位。已开始的邀请按原规则完成。</p></div><div class="rule"><h3>原型说明</h3><p>支付、好友行为和绘图均为演示，数据仅在当前浏览器保存。云贝即时到账，发票按充值实付金额计算。</p></div>`);};
 pageInfo.recharge[1]='签到解锁绘图体验，首充再享三周进阶补给。';pageInfo.invite[1]='送同门一份科研见面礼，一起使用，分阶段解锁奖励。';
 function update(){const n=checks().length;$('#supply-track').innerHTML=track();$('#wallet-checkin-label').textContent=done()?'已签到 · 查看补给':'签到领补给';$('#wallet-checkin-hint').textContent='本周 '+n+'/5 天 · 已获 '+checks().reduce((v,c)=>v+c.reward,0)+' 云贝';$('#wallet-checkin-bonus').hidden=done()||n>=5;$('#wallet-checkin-bonus').textContent='+'+(rule().rewards[n]||0);$('#wallet-checkin').setAttribute('aria-label','查看每周科研补给');$('#supply-pass').innerHTML=[0,1,2].map(i=>{const status=!s.pass&&!cfg().recharge.enabled?'paused':passStatus(i),text={paused:'补给活动暂未开放',unpaid:'首充后解锁',future:'尚未到领取周期',expired:'本期已结束',claimed:'已领取 · 权益保留',task:'本周完成一次绘图即可领',ready:'已完成任务，可以领取'}[status];return `<article class="supply-perk"><small>第 ${i+1} 周 ${s.pass?'· '+shiftedDay(s.pass.start,i*7).slice(5).replace('-','.')+'—'+shiftedDay(s.pass.start,i*7+6).slice(5).replace('-','.'):''}</small><h3>${definitions[(s.pass?.weeks||cfg().recharge.weeks)[i]].name}</h3><p>${text}</p>${status==='ready'?button('claim-'+i,'领取本周补给'):status==='task'?button('trial','去完成一次绘图'): '<span class="supply-badge">'+text+'</span>'}</article>`;}).join('');const passHeading=$('#supply-pass').previousElementSibling;passHeading.querySelector('h3').textContent=!s.pass&&!cfg().recharge.enabled?'首充补给暂未开放':'首充一次，未来三周都有期待';const owned=s.perks.filter(p=>!p.used);$('#supply-owned').textContent=owned.length?'已获得 '+owned.length+' 份可用补给：'+owned.map(p=>p.name).join('、'):'累计签到 3 天，解锁你的第一份高级绘图体验。你也可以先试用示例绘图。';const currentRule=rule();$('.supply-hero h2').innerHTML=cfg().checkin.enabled?'这周，免费解锁<br><em>你的下一份科研补给。</em>':'每一份科研收获，<br><em>都为你保留。</em>';$('.supply-hero p').textContent='来 '+currentRule.unlockAt+' 天，解锁'+definitions[currentRule.perk].name+'；来 5 天，累计领取 '+currentRule.rewards.reduce((a,b)=>a+b,0)+' 云贝。无需连续签到。';let wallet=$('#supply-reward-wallet');if(!wallet){wallet=document.createElement('div');wallet.id='supply-reward-wallet';wallet.className='supply-reward-wallet';$('.supply-trial-card').append(wallet);}wallet.innerHTML=s.perks.map(p=>'<article class="supply-reward-item"><strong>'+esc(p.name)+'</strong><small>'+(p.used?'已使用':'已领取 · 可使用')+'</small>'+button('perk-'+p.id,p.used?'已使用':'使用这份补给',p.used)+'</article>').join('');$('#supply-demo-date').textContent=(s.offset?'演示日期：':'当前日期：')+day();}
 const nativeAll=renderAll;renderAll=function(){nativeAll();update();};
 document.querySelector('.footer').insertAdjacentHTML('beforebegin','<div class="supply-demo"><strong>原型演示</strong><span id="supply-demo-date"></span><button data-supply="next-day">演示下一天</button><button data-supply="next-week">演示下一周</button><button data-supply="rules">查看玩法规则</button><span>支付和好友行为均为模拟</span></div>');
 document.addEventListener('click',async e=>{const b=e.target.closest('[data-supply]');if(!b||b.disabled)return;const a=b.dataset.supply;if(a==='check')sign();else if(a==='trial')useTrial();else if(a==='owned'){closeModal();setTab('recharge');}else if(a.startsWith('perk-'))useTrial(a.slice(5));else if(a==='export')exportTrial();else if(a==='friend-add')friendAdd();else if(a.startsWith('friend-'))friendAdvance(a.slice(7));else if(a.startsWith('claim-'))claim(Number(a.slice(6)));else if(a==='rules')actions.rules();else if(a==='next-day'||a==='next-week'){s.offset+=a==='next-day'?1:7;put();if(!$('#overlay').hidden)closeModal();renderAll();toast('演示已切换至 '+day());}else if(a==='copy'){const input=$('#supply-link');try{await navigator.clipboard.writeText(input.value);toast('邀请体验链接已复制。');}catch{input.focus();input.select();document.execCommand('copy');toast('邀请体验链接已复制。');}}});
 document.addEventListener('submit',e=>{
  if(e.target.id!=='supply-invite-form')return;e.preventDefault();if(!cfg().invite.enabled)return;
  const data=new FormData(e.target),name=data.get('friend').trim(),account=data.get('account').trim().toLowerCase();if(!name||!account)return;
  const fail=message=>{const el=$('#supply-friend-error');el.hidden=false;el.textContent=message;};
  if(s.friends.some(f=>f.account===account))return fail('该账号已参与过邀请，每位新用户仅参与一次。');
  if(s.friends.filter(f=>f.created.startsWith(day().slice(0,7))).length>=cfg().invite.monthlyCap)return fail('已达到本月有效邀请名额。');
  const r=clone(cfg().invite),id=uid('FR');s.friends.push({id,name,account,created:day(),stage:1,reward:r.inviter[0],friendReward:r.friend[0],rules:r});
  addCredit(r.inviter[0],'invite','邀请同门注册 · '+name,id);log('当前用户','邀请奖励','云贝',r.inviter[0],id);log('受邀好友：'+name,'好友奖励','云贝',r.friend[0],id);put();closeModal();renderAll();toast('注册奖励已分别记入邀请人和好友账户。');
 });
 window.YunbeiSupply={data:s,config:cfg,defaults,definitions,clone,day,refresh:()=>renderAll(),rule,showRules:()=>actions.rules()};
 put();renderAll();setTab(location.hash.slice(1)||'recharge',false);
 if(new URLSearchParams(location.search).get('gift')==='volcano')openModal('同门送你一份绘图体验','<div class="supply-award">火山图同款模板 + 示例数据 + 新人体验 1 次</div><p class="supply-modal-note">这张图，你也可以做。用示例数据完成第一次绘图与导出，体验基因云的科研工具。</p><div class="modal-actions">'+button('trial','打开同款绘图体验')+'</div>');
})();
