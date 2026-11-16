
(() => {
 const initial={checks:[],perks:[],friends:[],usage:[],pass:null,offset:0};
 const s=state.supply=Object.assign(initial,state.supply||{});
 const day=()=>dateKey(new Date(Date.now()+s.offset*86400000));
 const start=()=>weekStart(day());
 const clone=v=>JSON.parse(JSON.stringify(v));
 const definitions={volcano:{name:'高级火山图体验',unit:'次'},palette:{name:'科研配色模板包',unit:'份'},export:{name:'矢量图导出体验',unit:'次'}};
 const defaults={version:1,updatedAt:'',checkin:{enabled:true,rewards:[5,5,10,10,40],unlockAt:3,perk:'volcano'},recharge:{enabled:true,weeks:[{name:'高级火山图体验',desc:'火山图同款模板 + 示例数据',uses:1,kind:'volcano'},{name:'科研配色模板包',desc:'可下载的可编辑配色模板',uses:1,kind:'palette'},{name:'矢量图导出体验',desc:'完成一次矢量图导出',uses:1,kind:'export'}]},invite:{enabled:true,inviter:[10,20,20],friend:[10,20,20],returnDays:7,monthlyCap:0}};
 if(!state.config.supplyRules)state.config.supplyRules=clone(defaults);
 const cfg=()=>state.config.supplyRules;if(cfg().invite.monthlyCap===undefined||cfg().invite.monthlyCap>0)cfg().invite.monthlyCap=0;
 const rechargeDiscounts=()=>{const d=state.config.rechargeDiscounts||{},num=v=>Number.isFinite(Number(v))?Math.min(9,Math.max(1,Math.round(Number(v)*10)/10)):undefined;return {first:num(d.first)??8,second:num(d.second)??8.8,later:num(d.later)??9};};
 const normalizeWeek=v=>{const kind=typeof v==='string'?v:(v.kind||'volcano'),def=definitions[kind]||definitions.volcano,uses=Math.max(1,Math.round(Number(typeof v==='string'?1:v.uses)||1));return {name:String(typeof v==='string'?def.name:v.name||def.name),desc:String(typeof v==='string'?def.name:v.desc||def.name),uses,kind};};
 const rechargeStage=()=>{const count=(state.recharges||[]).filter(o=>o.status==='paid').length;return count===0?0:count===1?1:count===2?2:3;};
 const inviteExamples=[['林同学',1,1],['陈同学',2,4],['周同学',3,9]].map(([name,stage,age],i)=>({id:'DEMO-SUPPLY-'+i,name,created:shiftedDay(day(),-age),stage,reward:defaults.invite.inviter.slice(0,stage).reduce((a,b)=>a+b,0),friendReward:defaults.invite.friend.slice(0,stage).reduce((a,b)=>a+b,0),rules:clone(defaults.invite),demo:true}));
 s.weekRules=s.weekRules||{};s.events=s.events||[];s.configHistory=s.configHistory||[];
 const rule=()=>s.weekRules[start()]||cfg().checkin;
 const log=(who,source,kind,amount,reference='')=>s.events.unshift({id:uid('AW'),day:day(),who,source,kind,amount,reference});
 const grant=(id,perk,source)=>{if(s.perks.some(p=>p.id===id))return;const total=Math.max(1,Math.round(Number(perk.uses)||1));s.perks.push({id,kind:perk.kind||'volcano',name:perk.name,desc:perk.desc||'',totalUses:total,usedUses:0});log('当前用户',source,perk.name+' × '+total,1,id);};
 cfg().recharge.weeks=(Array.isArray(cfg().recharge.weeks)&&cfg().recharge.weeks.length===3?cfg().recharge.weeks:clone(defaults.recharge.weeks)).slice(0,3).map(normalizeWeek);
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
  activePerkId=perk?.id||null;
  const palette=perk?.kind==='palette';
  const art=palette?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 270"><rect width="580" height="270" fill="white"/><text x="34" y="40" font-size="18" fill="#344454">Research color palette</text>${['#699bb8','#e79a5e','#92b29e','#ae9bc3','#d0ad6d'].map((c,i)=>`<rect x="${34+i*104}" y="72" width="90" height="118" rx="8" fill="${c}"/><text x="${79+i*104}" y="216" text-anchor="middle" font-size="13" fill="#53616f">${c}</text>`).join('')}</svg>`:trialSvg();
  const remaining=perk?perkRemaining(perk):0;
  openModal(perk?.name||'示例绘图体验',`<p class="supply-modal-note">${esc(perk?.desc||'')}</p><div class="supply-chart" id="supply-chart">${art}</div><p class="supply-modal-note">${perk?`本次消耗 1 次使用额度 · 剩余 ${remaining}/${perk.totalUses} 次。`:'当前为免费示例，用于体验操作流程。'}</p><div class="modal-actions">${button('export',palette?'下载配色模板':'导出示例图，完成体验')}</div>`);
 }
 function exportTrial(){
  const art=$('#supply-chart svg');if(!art)return;
  const perk=activePerkId?s.perks.find(p=>p.id===activePerkId&&perkRemaining(p)>0):null;
  const url=URL.createObjectURL(new Blob([art.outerHTML],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=(perk?.name||'基因云-示例火山图')+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  s.usage.push({day:day(),id:uid('USE')});if(perk){perk.usedUses=(perk.usedUses||0)+1;perk.used=perkRemaining(perk)<1;log('当前用户','权益使用',perk.name+'（第'+perk.usedUses+'次）',1,perk.id);}activePerkId=null;put();closeModal();renderAll();toast(perk&&!perk.used?'使用成功，还剩 '+perkRemaining(perk)+' 次。':'文件已导出，本次体验已完成。');
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
  const nativeQuote=rechargeQuote;
 rechargeQuote=function(id=selectedPlan){const q=nativeQuote(id);if(!q)return q;const d=rechargeDiscounts(),stage=rechargeStage(),exhausted=stage>=3,zhe=stage===0?d.first:stage===1?d.second:stage===2?d.later:d.first;return {...q,first:stage===0,rechargeStage:stage,discountExhausted:exhausted,discountZhe:zhe,paidCents:Math.round(q.faceCents*zhe/10)};};
 const nativeComplete=completeRecharge;
 completeRecharge=function(q){const order=nativeComplete(q);if(order){if(order.bonus){state.wallet.paid-=order.bonus;state.wallet.reward+=order.bonus;const row=state.ledger.find(r=>r.orderId===order.id&&r.label==='充值赠送云贝');if(row)row.source='bonus';}if(order.first&&!s.pass&&cfg().recharge.enabled)s.pass={start:day(),usageStart:s.usage.length,claimed:[],weeks:clone(cfg().recharge.weeks).map(normalizeWeek)};put();}return order;};
 const nativeRecharge=renderRecharge;
 renderRecharge=function(){nativeRecharge();const heading=$('.recharge-plans-surface .surface-heading');let ladder=$('#supply-discount-ladder');if(heading&&!ladder){heading.insertAdjacentHTML('afterend','<div class="supply-discount-ladder" id="supply-discount-ladder"></div>');ladder=$('#supply-discount-ladder');}const q=rechargeQuote();if(!q)return;const d=rechargeDiscounts();let stages=[];if(q.rechargeStage===1)stages=[['第2次',d.second],['第3次起',d.later]];if(ladder){ladder.style.display=stages.length&&!q.discountExhausted?'':'none';ladder.innerHTML=stages.map(([name,zhe],i)=>`<span class="${(q.rechargeStage===1&&i===0)||(q.rechargeStage===2&&i===1)?'active':''}"><small>${name}</small><b>${formatZhe(zhe)}</b></span>`).join('');}$('#plans-offer-title').textContent=q.discountExhausted?'充值':(q.first?'首充 ':q.rechargeStage===1?'第2次 ':'复充 ')+formatZhe(q.discountZhe)+(q.first&&cfg().recharge.enabled?' · 送3周补给':'');$('#checkout-first-tag').textContent=(q.first?'首充 ':q.rechargeStage===1?'第2次 ':'复充 ')+q.discountZhe+' 折';$('.quote-discount').hidden=q.discountZhe>=10||q.discountExhausted;$('#checkout-first-tag').hidden=q.discountExhausted;$$('.plan-rate').forEach(e=>e.hidden=q.discountExhausted);};
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
   ${passStarted?`<div class="supply-payment-pass">${icon('gift')}<div><strong>三周进阶补给已开启</strong><p>每周完成一次绘图或分析，即可领取当周权益。</p><small>本周可领：${esc(s.pass.weeks[0].name)}（${s.pass.weeks[0].uses} 次）</small></div></div>`:''}
   <div class="supply-payment-receipt"><div class="supply-payment-order"><span>充值订单号</span><strong>${esc(order.id)}</strong></div><div class="supply-payment-invoice"><div><span>可开票金额 <b>${money(order.paidCents)}</b></span><small>赠送云贝不计入开票金额</small></div><button type="button" class="supply-payment-link" data-invoice-order="${esc(order.id)}">申请充值发票</button></div></div>
   <div class="supply-payment-links">${passStarted?'<button type="button" class="supply-payment-link" data-tab="shop">去兑换权益</button>':''}<button type="button" class="supply-payment-link" data-tab="ledger">云贝明细</button></div>
   <div class="modal-actions supply-payment-actions"><button type="button" class="btn" data-action="close">完成</button>${passStarted?button('trial','去完成本周绘图'):'<button type="button" class="btn primary" data-tab="shop">去兑换权益</button>'}</div>
  </div>`;
 };
 function passStatus(i){if(!s.pass)return 'unpaid';const from=shiftedDay(s.pass.start,i*7),to=shiftedDay(from,6);if(s.pass.claimed.includes(i))return 'claimed';if(day()<from)return 'future';if(day()>to)return 'expired';return s.usage.slice(s.pass.usageStart).some(u=>u.day>=from&&u.day<=to)?'ready':'task';}
 function claim(i){if(passStatus(i)!=='ready')return;s.pass.claimed.push(i);grant('pass-'+s.pass.start+'-'+i,s.pass.weeks[i],'首充补给');put();renderAll();toast('本周进阶补给已领取，可在“我的科研补给”查看。');}
 function friendAdd(){
  if(!cfg().invite.enabled){toast('邀请活动暂未开放。');return;}
  const month=day().slice(0,7);const cap=cfg().invite.monthlyCap;if(cap>0&&s.friends.filter(f=>f.created.startsWith(month)).length>=cap){toast('已达到本月有效邀请名额。');return;}
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
   <div class="supply-heading"><div><h3>同门成长进度</h3><p class="supply-invite-count">共 ${friends.length} 位好友 · 含 3 条示例记录</p></div></div>
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
  const r=cfg().invite,friends=[...s.friends,...inviteExamples],earned=friends.reduce((n,f)=>n+f.reward,0),max=r.inviter.reduce((a,b)=>a+b,0),friendMax=r.friend.reduce((a,b)=>a+b,0),link=new URL('https://www.genescloud.cn/home');link.searchParams.set('inviteCode',state.inviteCode||'');
  $('#panel-invite').innerHTML=`<section class="supply-invite-hero"><div><span class="supply-kicker">送同门一份科研见面礼</span><h2>这张图，<br>你也可以做。</h2><p>分享同款模板、示例数据和新人绘图体验。<br>一起做出第一张图，再一起解锁下一份补给。</p><div class="supply-badge" style="display:inline-block;margin-top:16px">${r.enabled?'每位有效新用户：邀请人最高 '+max+' 云贝，好友最高 '+friendMax+' 云贝':'邀请活动暂未开放，已有邀请按原规则继续'}</div></div><div class="supply-gift"><h3>你的科研见面礼</h3><span>火山图同款模板 + 示例数据</span><span>新人绘图体验 1 次</span><input readonly id="supply-link" aria-label="邀请体验链接" value="${esc(link.href)}">${button('copy','复制邀请体验链接',!r.enabled)}<small class="supply-status">已邀请 ${friends.length} 位 · 累计获得 ${earned} 云贝</small></div></section><div class="supply-perks">${['好友完成注册','好友完成第一张图','好友回访再次使用'].map((name,i)=>`<article class="supply-invite-step"><b>+${r.inviter[i]} <small style="font-size:12px">云贝 / 邀请人</small></b><h3>${name}</h3><p>好友同步获得 ${r.friend[i]} 云贝${i===2?'；注册满 '+r.returnDays+' 天后再次使用。':'。'}</p></article>`).join('')}</div>${inviteTable(friends,r)}`;
 }
 renderInvites=inviteView;
 checkin=sign;earn=showCheck;actions.checkin=sign;actions.earn=()=>showCheck();
 actions.rules=()=>{const c=cfg(),r=rule();openModal('科研补给规则',`<div class="rule"><h3>每周签到</h3><p>每日一次，无需连续。累计 ${r.unlockAt} 天解锁 ${definitions[r.perk].name}，5 天累计 ${r.rewards.reduce((a,b)=>a+b,0)} 云贝。周一开启新一轮，已获奖励保留。</p></div><div class="rule"><h3>首充补给</h3><p>首充享 ${state.config.rechargeDiscounts?.first??8} 折，后续优惠由系统自动匹配，不做公开阶梯展示。额外补给${c.recharge.enabled?'已开启':'暂未开放'}；开启后以充值日为起点，每 7 天一个周期，共 3 周。三周内容为 ${cfg().recharge.weeks.map(w=>`${w.name}（${w.uses} 次）`).join('、')}；每周期完成一次绘图或分析可领取当周权益，当期逾期未领不补发，已领取权益按配置次数使用。</p></div><div class="rule"><h3>邀请奖励</h3><p>注册、首次绘图、回访三个阶段，邀请人分别得 ${c.invite.inviter.join('、')} 云贝，好友分别得 ${c.invite.friend.join('、')} 云贝。回访需注册满 ${c.invite.returnDays} 天后再次使用；每位邀请人不限邀请人数。已开始的邀请按原规则完成。</p></div><div class="rule"><h3>原型说明</h3><p>支付、好友行为和绘图均为演示，数据仅在当前浏览器保存。云贝即时到账，发票按充值实付金额计算。</p></div>`);};
 pageInfo.recharge[1]='';pageInfo.invite[1]='送同门一份科研见面礼，一起使用，分阶段解锁奖励。';
 function update(){const n=checks().length,currentRule=rule(),enabled=cfg().checkin.enabled,checked=done()||n>=5;$('#wallet-checkin-label').textContent=!enabled?'签到暂未开放':n>=5?'本周已领满':done()?'已签到 · 查看进度':'签到领云贝';$('#wallet-checkin').disabled=enabled&&!checked;$('#wallet-checkin').classList.toggle('is-signed',checked);$('#wallet-checkin use').setAttribute('href',checked?'#i-check-circle':'#i-gift');$('#wallet-checkin-hint').textContent='本周 '+n+'/5 天 · 已获 '+checks().reduce((v,c)=>v+c.reward,0)+' 云贝';$('#wallet-checkin-bonus').hidden=!enabled||checked;$('#wallet-checkin-bonus').textContent='+'+(rule().rewards[n]||0);$('#wallet-checkin').setAttribute('aria-label',!enabled?'签到暂未开放':checked?'查看本周签到进度':'每日签到领取 '+(currentRule.rewards[n]||0)+' 云贝');$('.wallet-week-link').title='签到 '+currentRule.unlockAt+' 天解锁'+definitions[currentRule.perk].name+'；每周最多 '+currentRule.rewards.reduce((a,b)=>a+b,0)+' 云贝，无需连续';}
 const nativeAll=renderAll;renderAll=function(){nativeAll();update();};
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-supply]');if(!b||b.disabled)return;const a=b.dataset.supply;if(a==='check')sign();else if(a==='trial')useTrial();else if(a==='owned'){closeModal();setTab('recharge');}else if(a.startsWith('perk-'))useTrial(a.slice(5));else if(a==='export')exportTrial();else if(a==='friend-add')friendAdd();else if(a.startsWith('friend-'))friendAdvance(a.slice(7));else if(a.startsWith('claim-'))claim(Number(a.slice(6)));else if(a==='rules')actions.rules();else if(a==='next-day'||a==='next-week'){s.offset+=a==='next-day'?1:7;put();if(!$('#overlay').hidden)closeModal();renderAll();toast('演示已切换至 '+day());}else if(a==='copy'){const input=$('#supply-link');try{await navigator.clipboard.writeText(input.value);toast('邀请体验链接已复制。');}catch{input.focus();input.select();document.execCommand('copy');toast('邀请体验链接已复制。');}}});
 document.addEventListener('submit',e=>{
  if(e.target.id!=='supply-invite-form')return;e.preventDefault();if(!cfg().invite.enabled)return;
  const data=new FormData(e.target),name=data.get('friend').trim(),account=data.get('account').trim().toLowerCase();if(!name||!account)return;
  const fail=message=>{const el=$('#supply-friend-error');el.hidden=false;el.textContent=message;};
  if(s.friends.some(f=>f.account===account))return fail('该账号已参与过邀请，每位新用户仅参与一次。');
  const cap=cfg().invite.monthlyCap;if(cap>0&&s.friends.filter(f=>f.created.startsWith(day().slice(0,7))).length>=cap)return fail('已达到本月有效邀请名额。');
  const r=clone(cfg().invite),id=uid('FR');s.friends.push({id,name,account,created:day(),stage:1,reward:r.inviter[0],friendReward:r.friend[0],rules:r});
  addCredit(r.inviter[0],'invite','邀请同门注册 · '+name,id);log('当前用户','邀请奖励','云贝',r.inviter[0],id);log('受邀好友：'+name,'好友奖励','云贝',r.friend[0],id);put();closeModal();renderAll();toast('注册奖励已分别记入邀请人和好友账户。');
 });
 window.YunbeiSupply={data:s,config:cfg,defaults,definitions,clone,escape:esc,day,refresh:()=>renderAll(),rule,showRules:()=>actions.rules()};
 put();renderAll();setTab(location.hash.slice(1)||'recharge',false);
 if(new URLSearchParams(location.search).get('gift')==='volcano')openModal('同门送你一份绘图体验','<div class="supply-award">火山图同款模板 + 示例数据 + 新人体验 1 次</div><p class="supply-modal-note">这张图，你也可以做。用示例数据完成第一次绘图与导出，体验基因云的科研工具。</p><div class="modal-actions">'+button('trial','打开同款绘图体验')+'</div>');
})();
