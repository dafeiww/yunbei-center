(() => {
 const A=window.YunbeiSupply;if(!A)return;
 const labels={checkin:'签到配置',recharge:'首充配置'};
 const drafts={checkin:A.clone(A.config().checkin),recharge:A.clone(A.config().recharge)};
 const adminModules=[['supply-checkin','签到配置'],['recharge','充值配置'],['tasks','任务配置'],['shop','商城配置']];
 const defs=A.definitions;
 const options=value=>Object.entries(defs).map(([id,d])=>`<option value="${id}" ${id===value?'selected':''}>${d.name}</option>`).join('');
 const input=(name,value,min=0,max=10000)=>`<input name="${name}" type="number" min="${min}" max="${max}" step="1" value="${value}" required>`;
 const text=(name,value,max=80)=>`<input name="${name}" type="text" maxlength="${max}" value="${A.escape(value)}" required>`;
 const switchField=(key,enabled,text)=>`<label class="growth-activity-switch"><input type="checkbox" name="enabled" ${enabled?'checked':''}><span class="growth-toggle"></span><strong>${text}</strong><small>${enabled?'已开启':'已暂停'}</small></label>`;
 const formHeader=(title,description)=>`<div class="growth-form-heading"><div><h3>${title}</h3><p>${description}</p></div><span class="growth-scope-label">管理员配置</span></div>`;
 const saveFooter=key=>`<div class="growth-form-footer"><span id="growth-dirty-${key}">配置已保存</span><button class="btn primary" type="submit">保存并生效</button></div>`;
 const saveTimers=new WeakMap();
 const saveFeedback={};
 const clearSaveFeedback=form=>{clearTimeout(saveFeedback[form.dataset.growthForm||form.id]);delete saveFeedback[form.dataset.growthForm||form.id];};
 const setSaveFeedback=(form,state)=>{const button=form.querySelector('button[type="submit"]');const status=form.id==='supply-discount-form'?form.querySelector('.growth-form-footer span'):$('#growth-dirty-'+form.dataset.growthForm);if(!button)return;if(state==='error'){button.disabled=false;button.classList.remove('save-success');button.classList.add('save-error');button.textContent='保存失败';if(status){status.textContent='请检查填写内容后重试';status.classList.remove('is-saved');status.classList.add('is-dirty');}}else{button.disabled=false;button.classList.remove('save-error');button.classList.add('save-success');button.textContent='已保存 ✓';if(status){status.textContent='保存成功，已立即生效';status.classList.remove('is-dirty');status.classList.add('is-saved');}}const id=form.dataset.growthForm||form.id;clearTimeout(saveFeedback[id]);saveFeedback[id]=setTimeout(()=>{button.classList.remove('save-success','save-error');button.textContent='保存并生效';if(status&&status.classList.contains('is-saved')){status.textContent='配置已保存';status.classList.remove('is-saved');}},1800);};
 const preview=key=>`<aside class="growth-preview"><div class="growth-preview-heading"><span>用户端实时预览</span><small>根据左侧草稿变化</small></div><div id="growth-preview-${key}"></div><div class="growth-preview-note">${key==='checkin'?'新规则用于尚未开始的签到周；本周已有签到的用户沿用本周规则。':key==='recharge'?'保存后新发生的首充使用新规则；已开启的三周补给保持原有权益。':'保存后创建的新邀请使用新规则；已注册的受邀好友按原规则完成。'}</div></aside>`;
 $('.admin-hero h2').textContent='云贝配置';
 $('.admin-hero p').textContent='按模块管理充值、签到和商城配置；保存后按页面说明的范围生效。';
 const adminTabs=$('.admin-tabs');
 adminTabs.innerHTML=adminModules.map(([id,name])=>`<button type="button" data-admin-view="${id}">${name}</button>`).join('');
 adminTabs.hidden=false;
 $('.admin-hero').insertAdjacentHTML('beforeend','<div class="growth-header-actions"><button class="btn" type="button" <button class="btn" type="button" data-growth-action="rules">查看生效规则</button></div>');
 const c=drafts.checkin,p=drafts.recharge,i=drafts.invite;
 $('#panel-admin').insertAdjacentHTML('beforeend',`
 <section id="admin-supply-checkin" class="growth-section" hidden><div class="growth-editor-layout"><form class="growth-form surface" data-growth-form="checkin">
 ${formHeader('签到配置页面','一周任选 5 天，第 1–5 次奖励可分别设置')}${switchField('checkin',c.enabled,'开启每周签到奖励')}
 <div class="growth-info-line"><span>统计周期</span><strong>北京时间 · 周一至周日</strong><span>任选 5 天，不要求连续</span></div>
 <div class="growth-block-heading"><h4>5 次签到奖励</h4><span>按本周第 1–5 次分别设置</span></div>
 <div class="growth-day-inputs">${c.rewards.slice(0,5).map((v,n)=>`<label><span>第 ${n+1} 次</span>${input('reward-'+n,Number(v||0))}<small>云贝</small></label>`).join('')}</div>
 <div class="growth-budget"><span>每人每周最多获得</span><strong id="growth-week-total">5 <small>云贝</small></strong></div>
${saveFooter('checkin')}</form></div></section>
 <section id="admin-supply-recharge" class="growth-section" hidden><div class="growth-editor-layout"><form class="growth-form surface" data-growth-form="recharge">
 ${formHeader('首充配置页面','')}${switchField('recharge',p.enabled,'开启首充三周奖励')}
 <div class="growth-info-line"><span>参与资格</span><strong>每位用户首次成功充值</strong><span>每人仅 1 次</span></div>
 <div class="growth-block-heading"><h4>3 周进阶权益</h4><span>名称、说明、跳转链接、次数可编辑</span></div>
 <div class="growth-week-editor">${p.weeks.map((v,n)=>`<div class="growth-week-card"><div><span class="growth-week-number">${n+1}</span><strong>第 ${n+1} 周</strong><small>充值后第 ${n*7+1}—${n*7+7} 天</small></div><div class="growth-week-fields"><label><span>权益内容</span>${text('week-name-'+n,v.name,40)}</label><label><span>权益说明</span>${text('week-desc-'+n,v.desc,80)}</label><label><span>可用次数</span>${input('week-uses-'+n,v.uses,1,99)}<small>领取后可使用</small></label><label class="growth-week-link"><span>图表跳转链接</span><input name="week-link-${n}" type="url" maxlength="500" value="${A.escape(v.link||'')}" placeholder="https://www.genescloud.cn/..."><small>图表权益建议填写；留空则使用演示体验</small></label></div></div>`).join('')}</div>
${saveFooter('recharge')}</form></div></section>
 <section id="admin-recharge-activity" class="growth-section" hidden><article class="surface admin-config-card"><div class="surface-heading admin-config-heading"><div><h3>充值活动管理</h3><p>创建活动后设置名称、折扣和档位；启用后自动同步用户端。</p></div><button class="btn primary" type="button" data-supply-activity-action="create"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>创建充值活动</button></div><div class="supply-activity-list" id="supply-activity-list"></div></article></section>`);

 function readDraft(key){const form=document.querySelector(`[data-growth-form="${key}"]`);const d=new FormData(form);const enabled=d.has('enabled');if(key==='checkin')return {enabled,rewards:[0,1,2,3,4].map(n=>Math.max(0,Math.round(Number(d.get('reward-'+n))||0))),unlockAt:A.config().checkin.unlockAt,perk:A.config().checkin.perk};if(key==='recharge')return {enabled,weeks:[0,1,2].map(n=>({name:String(d.get('week-name-'+n)||'').trim(),desc:String(d.get('week-desc-'+n)||'').trim(),uses:Math.round(Number(d.get('week-uses-'+n))),kind:(A.config().recharge.weeks[n]?.kind)||'volcano',link:String(d.get('week-link-'+n)||'').trim()}))};return {enabled,inviter:[0,1,2].map(n=>Number(d.get('inviter-'+n))),friend:[0,1,2].map(n=>Number(d.get('friend-'+n))),returnDays:Number(d.get('returnDays')),monthlyCap:Number(d.get('monthlyCap'))};}
 function renderPreview(key){
  const d=drafts[key],target=$('#growth-preview-'+key);let html='';
  if(key==='checkin'){const total=d.rewards.reduce((a,b)=>a+Number(b||0),0);if($('#growth-week-total'))$('#growth-week-total').innerHTML=total+' <small>云贝</small>';html=`<div class="growth-phone-tag">签到得云贝</div><h3>任选 5 天，<br>领对应奖励。</h3><p>第 1–5 次奖励分别为 ${d.rewards.join('、')} 云贝。</p><div class="growth-mini-days">${d.rewards.map((v,n)=>`<div><b>+${v}</b><small>第 ${n+1} 次</small></div>`).join('')}</div><div class="growth-preview-award">本周累计 ${total} 云贝（任选 5 天）</div><button type="button" class="btn primary" disabled>签到领云贝</button>`;}
  if(key==='recharge')html=`<div class="growth-phone-tag">首充三周补给</div><h3>首充一次，<br>三周都有期待。</h3><p>首充折扣按档位配置；云贝与原有赠送即时到账。</p>${d.weeks.map((v,n)=>`<div class="growth-mini-pass"><small>第 ${n+1} 周</small><strong>${esc(v.name)}</strong><span>可用 ${v.uses} 次</span></div>`).join('')}`;
  if(target)target.innerHTML=d.enabled?html:'<div class="growth-paused-preview">活动已暂停<br><small>已获得的奖励保留</small></div>';
  const dirty=JSON.stringify(d)!==JSON.stringify(A.config()[key]);const indicator=$('#growth-dirty-'+key);if(indicator){indicator.textContent=dirty?'有未保存的修改':'配置已保存';indicator.classList.toggle('is-dirty',dirty);}
  const control=document.querySelector(`[data-growth-form="${key}"] .growth-activity-switch small`);if(control)control.textContent=d.enabled?'已开启':'已暂停';
 }
function activityZheAmount(yuan,z){const cents=Math.round(Number(yuan)*Number(z)*10);return '¥'+(cents/100).toString();}
let activityEditingId="";
function defaultRechargeActivity(){return {id:'act-default',name:'科研云贝充值活动',enabled:true,discount:8,tiers:[]};}
function rechargeActivities(){if(!Array.isArray(state.config.rechargeActivities)||!state.config.rechargeActivities.length)state.config.rechargeActivities=[defaultRechargeActivity()];state.config.rechargeActivities.forEach(a=>{if(Array.isArray(a.tiers))a.tiers=a.tiers.filter(t=>Number(t.yuan)>=0);});return state.config.rechargeActivities;}
function activeRechargeActivity(){return rechargeActivities().find(a=>a.enabled)||null;}
function tierPaid(yuan,z){return Math.round(Number(yuan)*100*Number(z)/10);}
function activityDiscount(a){const d=Number(a.discount);if(Number.isFinite(d)&&d>=1&&d<=10)return d;const legacy=a.discounts||{};return Math.min(10,Math.max(1,Number(legacy.first)||8));}
function applyRechargeActivity(a){
 if(!a){state.config.rechargeDiscounts={first:8,second:8,later:8};state.config.rechargePlans=defaultRechargePlans();delete state.config.rechargeActivityName;applyConfig();return;}
 const z=activityDiscount(a);
 state.config.rechargeDiscounts={first:z,second:z,later:z};
 const tiers=Array.isArray(a.tiers)?a.tiers.filter(t=>t.enabled&&Number(t.yuan)>=0):[];
 const hasCustom=tiers.some(t=>Number(t.yuan)===0);
 const plans=tiers.filter(t=>Number(t.yuan)>0).map((t,i)=>({id:`${a.id}-t${i}`,yuan:Math.max(0,Math.round(Number(t.yuan)||0)),principal:Math.round(Math.max(0,Number(t.yuan)||0)*10),bonus:0,discountZhe:state.config.rechargeDiscounts.first,paidCents:tierPaid(t.yuan,state.config.rechargeDiscounts.first),enabled:true}));
 if(hasCustom)plans.push({id:'custom',yuan:0,principal:0,bonus:0,discountZhe:state.config.rechargeDiscounts.first,paidCents:0,enabled:true});
 state.config.rechargeActivityName=a.name;state.config.rechargePlans=plans;applyConfig();selectedPlan=RECHARGE_PLANS.some(p=>p.id===selectedPlan)?selectedPlan:RECHARGE_PLANS[0]?.id||'custom';
}
function tierChip(t){return Number(t.yuan)===0?`<span class="activity-tier-chip on">自定义金额</span>`:`<span class="activity-tier-chip on">¥${fmt(t.yuan)}</span>`;}
function activityForm(a){const MAX=8;const canAdd=a.tiers.length<MAX;
 return `<form class="activity-editor" data-activity-form="${esc(a.id)}"><div class="activity-grid"><label><span>活动名称</span><input name="name" maxlength="40" value="${esc(a.name)}" required></label><label><span>充值折扣</span><input name="discount" type="number" min="1" max="10" step="0.1" value="${activityDiscount(a)}" required></label></div><div class="activity-tier-list"><div class="activity-tier-head"><span>充值档位（${a.tiers.length}/${MAX}）</span><small>按 ¥1 = 10 云贝换算</small></div>${a.tiers.map((t,i)=>`<div class="activity-tier-row"><div class="tier-input-wrap"><span class="tier-yuan">¥</span><input name="yuan-${i}" type="number" min="0" max="100000" step="1" value="${t.yuan}" required><span class="tier-unit">元</span></div><span class="tier-coins">${Number(t.yuan)===0?'自定义金额 · 默认 0 云贝':`到账 ${fmt(t.yuan*10)} 云贝 · 实付 ${activityZheAmount(t.yuan,activityDiscount(a))}`}</span><button class="table-action danger" type="button" data-activity-action="del-tier" data-index="${i}">删除</button></div>`).join('')||'<div class="admin-empty">暂无档位，请在下方添加。</div>'}</div><div class="activity-tier-add"><span class="add-label">新增档位</span><div class="add-input-wrap"><span class="add-yuan">¥</span><input name="newTierYuan" type="number" min="0" max="100000" step="1" placeholder="输入金额（0 为自定义）" ${canAdd?'':'disabled'}></div><button class="btn primary" type="button" data-activity-action="add-tier" ${canAdd?'':'disabled'}>添加档位</button><small class="add-hint">${canAdd?'按 ¥1 = 10 云贝换算':`已达上限 ${MAX} 个档位`}</small></div><div class="activity-actions"><button class="btn primary" type="submit">保存并生效</button><button class="btn" type="button" data-activity-action="cancel">取消</button></div></form>`;}
function renderRechargeActivities(){
 const box=$('#supply-activity-list');if(!box)return;
 const list=rechargeActivities();
 box.innerHTML=list.map(a=>{if(activityEditingId===a.id)return `<article class="supply-activity-card is-editing">${activityForm(a)}</article>`;return `<article class="supply-activity-card ${a.enabled?'active':''}"><div class="activity-card-head"><div><span class="activity-status">${a.enabled?'已生效':'未生效'}</span><h4>${esc(a.name)}</h4><p class="activity-discount-badge">充值折扣 <strong>${formatZhe(activityDiscount(a))}</strong></p></div><div class="activity-buttons"><button class="table-action activity-edit" type="button" data-activity-action="edit" data-id="${esc(a.id)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M14.1 4.1l5.8 5.8M4 20l1-5.8L16.5 2.7a2.2 2.2 0 0 1 3.1 3.1L8.1 17.3z"></path></svg>编辑</button><label class="admin-switch"><input type="checkbox" data-activity-enable="${esc(a.id)}" ${a.enabled?'checked':''}><span class="switch-track"><i></i></span><em>${a.enabled?'生效中':'已停用'}</em></label><button class="table-action danger" type="button" data-activity-action="delete" data-id="${esc(a.id)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>删除</button></div></div><div class="activity-tiers">${a.tiers.map(tierChip).join('')}</div></article>`;}).join('')||'<div class="admin-empty">暂无充值活动，点击上方创建活动。</div>';
}
 const nativeSync=syncAdminView;syncAdminView=function(){nativeSync();if(adminView==='supply-recharge')adminView='recharge';document.body.classList.toggle('admin-recharge-active',activeTab==='admin'&&isAdmin()&&adminView==='recharge');document.body.classList.toggle('admin-invoice-active',activeTab==='admin'&&isAdmin()&&adminView==='invoices');const configVisible=activeTab==='admin'&&isAdmin(),moduleFor={'admin-supply-checkin':'supply-checkin','admin-supply-recharge':'supply-recharge','admin-recharge-activity':'recharge','admin-supply-tasks':'tasks','admin-invoices':'invoices',};$('#admin-recharge-panel').hidden=true;$('#admin-shop-panel').hidden=!configVisible||adminView!=='shop';$$('.growth-section').forEach(el=>el.hidden=!configVisible||moduleFor[el.id]!==adminView);};
 const nativeLists=renderAdminLists;
 renderAdminLists=function(){renderRechargeActivities();renderTaskAdmin();const quote=rechargeQuote;try{rechargeQuote=function(id=selectedPlan){const q=quote(id),p=state.config.rechargePlans.find(x=>x.id===id);if(!q||!p)return q;const z=Number(p.discountZhe)||8;return {...q,first:true,discountZhe:z,paidCents:Number.isFinite(Number(p.paidCents))?Number(p.paidCents):Math.round(p.yuan*100*z/10)};};nativeLists();const h=$('#admin-plan-list .admin-list-header');if(h){h.children[3].textContent='折扣';h.children[4].textContent='实付';}}finally{rechargeQuote=quote;}};
 const headerActions=$('.growth-header-actions');headerActions.id='growth-main-actions';headerActions.hidden=true;$('.page-head-actions').append(headerActions);
 
 const nativeSetTab=setTab;setTab=function(...args){nativeSetTab(...args);headerActions.hidden=activeTab!=='admin'||!isAdmin();};

 const discountLabel=$('#plan-discount')?.closest('label');if(discountLabel){discountLabel.querySelector('.admin-line-label').textContent='折扣';discountLabel.querySelector('small').textContent='1–10 折，全档位生效';}
 document.addEventListener('input',e=>{const form=e.target.closest('[data-growth-form]');if(!form)return;const key=form.dataset.growthForm;drafts[key]=readDraft(key);renderPreview(key);});
 document.addEventListener('change',e=>{const form=e.target.closest('[data-growth-form]');if(form){const key=form.dataset.growthForm;drafts[key]=readDraft(key);renderPreview(key);}});
 document.addEventListener('click',e=>{
 const create=e.target.closest('[data-supply-activity-action="create"]');
 if(create){if(!isAdmin())return;const n=rechargeActivities().length+1;const a={...defaultRechargeActivity(),id:uid('ACT'),name:`充值活动 ${n}`,enabled:false};rechargeActivities().unshift(a);activityEditingId=a.id;persist();renderAdminLists();toast('活动已创建，配置后启用即可同步用户端。');return;}
 const action=e.target.closest('[data-activity-action]');
 if(action){if(!isAdmin())return;const id=action.dataset.id,type=action.dataset.activityAction;
  if(type==='add-tier'){const form=action.closest('[data-activity-form]');if(!form)return;const fid=form.dataset.activityForm;const a=rechargeActivities().find(x=>x.id===fid);if(!a)return;const name=String(form.querySelector('[name=name]')?.value||a.name||'').trim();const discount=Math.max(1,Math.min(10,Math.round(Number(form.querySelector('[name=discount]')?.value||activityDiscount(a))*10)/10));form.querySelectorAll('.activity-tier-row').forEach((row,i)=>{const inp=row.querySelector('input[name^=yuan-]');if(inp&&a.tiers[i])a.tiers[i].yuan=Math.max(0,Math.round(Number(inp.value)||0));});const input=form.querySelector('[name=newTierYuan]');const raw=input?.value;const yuan=Math.round(Number(raw));if(raw===''||raw==null||!Number.isFinite(yuan)||yuan<0){toast('请输入 0 或更大的金额。');return;}if(yuan===0&&a.tiers.some(t=>Number(t.yuan)===0)){toast('自定义金额档位已存在。');return;}if(a.tiers.length>=8){toast('最多 8 个充值档位。');return;}if(a.tiers.some(t=>Number(t.yuan)===yuan)){toast('该金额档位已存在。');return;}Object.assign(a,{name,discount});a.tiers.push({label:yuan===0?'自定义金额':`${yuan}元档`,yuan,enabled:true});persist();renderAdminLists();toast(yuan===0?'已添加自定义金额档位，保存并生效后同步用户端。':`已添加 ¥${yuan} 档位，保存并生效后同步用户端。`);return;}
  if(type==='del-tier'){const form=action.closest('[data-activity-form]');if(!form)return;const fid=form.dataset.activityForm;const a=rechargeActivities().find(x=>x.id===fid);if(!a)return;const idx=Number(action.dataset.index);if(!Number.isInteger(idx)||idx<0||idx>=a.tiers.length)return;const name=String(form.querySelector('[name=name]')?.value||a.name||'').trim();const discount=Math.max(1,Math.min(10,Math.round(Number(form.querySelector('[name=discount]')?.value||activityDiscount(a))*10)/10));form.querySelectorAll('.activity-tier-row').forEach((row,i)=>{const inp=row.querySelector('input[name^=yuan-]');if(inp&&a.tiers[i])a.tiers[i].yuan=Math.max(0,Math.round(Number(inp.value)||0));});Object.assign(a,{name,discount});a.tiers.splice(idx,1);persist();renderAdminLists();toast('档位已删除，保存并生效后同步用户端。');return;}
  if(type==='edit'){activityEditingId=id;}
  else if(type==='cancel'){activityEditingId='';}
  else if(type==='delete'){const list=rechargeActivities(),a=list.find(x=>x.id===id);if(!a)return;state.config.rechargeActivities=list.filter(x=>x.id!==id);activityEditingId='';if(a.enabled)applyRechargeActivity(activeRechargeActivity());persist();renderAdminLists();renderAll();toast('充值活动已删除。');return;}
  renderAdminLists();return;}
 const enable=e.target.closest('[data-activity-enable]');
 if(enable){if(!isAdmin())return;const a=rechargeActivities().find(x=>x.id===enable.dataset.activityEnable);if(!a)return;if(enable.checked){rechargeActivities().forEach(x=>x.enabled=x.id===a.id);applyRechargeActivity(a);}else{a.enabled=false;applyRechargeActivity(activeRechargeActivity());}persist();renderAdminLists();renderAll();toast(a.enabled?'充值活动已生效，用户端已同步。':'充值活动已停用。');}
});
document.addEventListener('input',e=>{const form=e.target.closest('[data-activity-form]');if(!form)return;const z=Math.max(1,Math.min(10,Number(form.querySelector('[name=discount]')?.value)||8));form.querySelectorAll('.activity-tier-row').forEach(row=>{const inp=row.querySelector('input[name^=yuan-]');const y=Math.max(0,Number(inp?.value)||0);const coin=row.querySelector('.tier-coins');if(coin)coin.textContent=y===0?'自定义金额 · 默认 0 云贝':`到账 ${fmt(y*10)} 云贝 · 实付 ${activityZheAmount(y,z)}`;});});
document.addEventListener('submit',e=>{
 if(e.target.matches('[data-activity-form]')){e.preventDefault();if(!isAdmin())return;if(!e.target.reportValidity())return;const id=e.target.dataset.activityForm,a=rechargeActivities().find(x=>x.id===id);if(!a)return;const d=new FormData(e.target);const read=n=>Math.round(Number(d.get(n))*10)/10;const name=String(d.get('name')||'').trim();const discount=Math.round(Number(d.get('discount'))*10)/10;const tiers=a.tiers.map((t,i)=>({...t,yuan:Math.max(0,Math.round(Number(d.get(`yuan-${i}`))||0)),enabled:true}));if(!Number.isFinite(discount)||discount<1||discount>10){setSaveFeedback(e.target,'error');toast('折扣需填写 1–10，可保留一位小数。');return;}if(!name){setSaveFeedback(e.target,'error');toast('请填写活动名称。');return;}if(tiers.length>8){setSaveFeedback(e.target,'error');toast('最多 8 个充值档位。');return;}Object.assign(a,{name,discount,tiers});activityEditingId='';applyRechargeActivity(a);persist();renderAdminLists();renderAll();toast('充值活动已保存并同步用户端。');return;}

  if(e.target.id==='supply-discount-form'){e.preventDefault();if(!isAdmin()){toast('请使用管理员账号保存。');return;}if(!e.target.reportValidity()){return;}setSaveFeedback(e.target,'saved');const d=new FormData(e.target),read=n=>Math.round(Number(d.get(n))*10)/10,values={first:read('first'),second:read('second'),later:read('later')};if(Object.values(values).some(v=>!Number.isFinite(v)||v<1||v>10)){setSaveFeedback(e.target,'error');toast('折扣需填写 1–10，可保留一位小数。');return;}state.config.rechargeDiscounts=values;try{persist();renderAdminLists();renderAll();if(typeof updateAdminPlanForm==='function')updateAdminPlanForm('paid');setSaveFeedback(e.target,'saved');toast('充值折扣已保存。');}catch(err){setSaveFeedback(e.target,'error');throw err;}return;}
  const form=e.target.closest('[data-growth-form]');if(!form)return;e.preventDefault();if(!isAdmin()){toast('请使用管理员账号保存。');return;}if(!form.reportValidity())return;setSaveFeedback(form,'saved');const key=form.dataset.growthForm,next=readDraft(key);const ints=key==='checkin'?next.rewards:key==='recharge'?next.weeks.map(v=>v.uses):[];if(ints.some(n=>!Number.isSafeInteger(n)||n<0)){setSaveFeedback(form,'error');toast('奖励数量需填写非负整数。');return;}const published=A.clone(A.config());published[key]=next;published.version++;published.updatedAt=new Date().toISOString();state.config.supplyRules=published;if(key==='checkin'){A.data.weekRules[weekStart(A.day())]=A.clone(next);if(!state.config.yunbeiTasks)state.config.yunbeiTasks={};state.config.yunbeiTasks.checkin={...(state.config.yunbeiTasks.checkin||{}),reward:Number(next.rewards[0]||0)};}if(key==='recharge'&&A.data.pass){next.weeks.forEach((v,n)=>{if(A.data.pass.weeks[n])A.data.pass.weeks[n].link=v.link;});}drafts[key]=A.clone(next);const summary=key==='checkin'?'第 1–5 次奖励 '+next.rewards.join('/')+' 云贝，每周任选 5 天':key==='recharge'?next.weeks.map(v=>`${v.name} × ${v.uses}${v.link?' · 已配置跳转':''}`).join(' → '):'邀请人 '+next.inviter.join('/')+'；好友 '+next.friend.join('/')+' 云贝';A.data.configHistory.unshift({key,version:published.version,time:displayDate(published.updatedAt,true),summary:(next.enabled?'开启 · ':'暂停 · ')+summary});try{persist();A.refresh();renderPreview(key);setSaveFeedback(form,'saved');toast(labels[key]+'配置已保存，按页面说明的范围生效。');}catch(err){setSaveFeedback(form,'error');throw err;}});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-growth-action]');if(!b||!isAdmin())return;const action=b.dataset.growthAction;if(action==='preview'){state.role='user';persist();renderAll();setTab('recharge');return;}if(action==='rules'){A.showRules();return;}if(action==='export')exportCsv('科研补给奖励记录.csv',[['日期','用户','来源','奖励','数量','状态'],...filteredEvents().map(x=>[x.day,x.who,x.source,x.kind,x.amount,x.source==='权益使用'?'已使用':'已到账'])]);});
 renderTaskAdmin();
rechargeActivities();applyRechargeActivity(activeRechargeActivity());renderRechargeActivities();renderTaskAdmin();
Object.keys(drafts).forEach(renderPreview);syncAdminView();renderAdminLists();if(location.pathname.endsWith('admin.html')||location.pathname.includes('云贝科研补给-管理员原型.html'))activeTab='admin';setTab(activeTab,false);renderAll();
function taskCfg(){
 const d={activityName:'科研云贝任务活动',enabled:true,tasks:{
  invite:{name:'邀请好友得云贝',desc:'只有未注册基因云的新账号有效，双方注册成功即得云贝。',link:'https://www.genescloud.cn/home',daily:3,inviter:10,friend:10},
  profile:{name:'完善个人中心',desc:'补充职称、单位和研究方向。',reward:3},
  checkin:{name:'签到得云贝',desc:'本周任选 5 天，领取对应次数奖励。',reward:1},
  wechat:{name:'绑定微信',desc:'绑定后可同步消息和快捷登录。',reward:3},
  avatar:{name:'上传个人图像',desc:'上传头像，让协作更亲切。',reward:1}
 }};
 if(!state.config.yunbeiTasks)state.config.yunbeiTasks={...d,tasks:{...d.tasks}};
 const c=state.config.yunbeiTasks;
 if(!c.tasks)c.tasks={...d.tasks};
 const deleted=new Set(Array.isArray(c.deletedTasks)?c.deletedTasks:[]);
 const legacy={invite:c.invite,profile:c.profile,checkin:c.checkin,wechat:c.wechat,avatar:c.avatar};
 Object.keys(d.tasks).forEach(id=>{if(deleted.has(id))return;if(!c.tasks[id])c.tasks[id]={...d.tasks[id],...(legacy[id]||{})};});
 const tasks={};Object.keys(d.tasks).forEach(id=>{if(deleted.has(id))return;tasks[id]={...d.tasks[id],...(c.tasks[id]||{})};if(id==='profile'&&tasks[id].desc==='补充昵称、研究方向和所在单位。')tasks[id].desc='补充职称、单位和研究方向。';});
 Object.keys(c.tasks||{}).forEach(id=>{if(!tasks[id])tasks[id]={...(c.tasks[id]||{}),custom:true};});
 return {...d,...c,tasks};
}
function defaultRechargeActivity(){return {id:'act-default',name:'科研云贝充值活动',enabled:true,discount:8,tiers:[]};}
$('#panel-admin').insertAdjacentHTML('beforeend',`<section id="admin-supply-tasks" class="growth-section" hidden><article class="surface growth-form" id="supply-task-config">${formHeader('云贝任务配置','每个任务独立配置名称和奖励，保存后同步用户端。')}<div class="growth-info-line"><span>任务状态</span><strong>任务中心</strong><span>邀请好友页面已合并到云贝任务</span></div><div class="task-admin-toolbar"><div><strong>任务列表</strong><span>任务均可删除，保存后同步用户端</span></div><button class="btn primary" type="button" data-task-create>添加云贝任务</button></div><div class="task-admin-grid" id="task-admin-cards"></div></article></section>`);
renderTaskAdmin();
function taskIcon(id){return {invite:'users',profile:'user',checkin:'gift',wechat:'wechat',avatar:'image'}[id]||'gift';}
function taskAdminCard(id,c){
 const isNew=id==='__new__';
 const task=isNew?{name:'',desc:'',reward:1,icon:window.__newTaskIcon||''}:c.tasks[id];
 const savedIcon=task?.icon||'';
 const icon=`<span class="task-admin-icon ${id==='wechat'?'wechat':''} ${savedIcon?'has-icon':'no-icon'}" aria-hidden="true">${savedIcon?`<img class="task-icon-img" src="${A.escape(savedIcon)}" alt="">`:`<svg class="icon"><use href="#i-${taskIcon(id)}"></use></svg>`}</span><input class="task-icon-file" data-task-icon-file="${A.escape(id)}" type="file" accept="image/*" hidden><div class="task-icon-actions"><button class="table-action" type="button" data-task-icon-upload="${A.escape(id)}">${savedIcon?'更换图标':'上传图标'}</button></div>`;
 const footer=(id,save)=>`<div class="growth-form-footer"><span id="growth-dirty-task-${id}">配置已保存</span><button class="btn primary" type="submit">${save}</button></div>`;
 const field=(name,label,value,small='',attrs='')=>`<label><span>${label}</span><input name="${name}" type="text" maxlength="80" value="${A.escape(value||'')}" required ${attrs}><small>${small}</small></label>`;
 const linkField=(name,label,value,small='')=>`<label class="task-admin-link-field"><span>${label}</span><input name="${name}" type="url" maxlength="300" value="${A.escape(value||'')}" required placeholder="https://www.genescloud.cn/home"><small>${small}</small></label>`;
 const number=(name,label,value,small='',attrs='')=>`<label><span>${label}</span><input name="${name}" type="number" min="0" max="100000" step="1" value="${Number(value||0)}" required ${attrs}><small>${small}</small></label>`;
 const actions=isNew?'':`<div class="task-card-actions"><button class="table-action danger" type="button" data-task-delete="${A.escape(id)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>删除任务</button></div>`;
 if(id==='invite')return `<form class="task-admin-card" data-task-form="invite"><div class="task-admin-head">${icon}<h4>${A.escape(task.name)}</h4><span class="task-admin-kind">每日任务</span>${actions}</div><div class="task-admin-fields">${field('name','任务名称',task.name,'用户端卡片标题')}${field('desc','任务备注',task.desc,'用户端卡片说明')}${linkField('link','专属邀请链接基础地址',task.link,'系统自动追加 inviteCode')}${number('daily','每日邀请人数',task.daily,'0 表示不限')}${number('inviter','邀请人奖励',task.inviter,'云贝')}${number('friend','被邀请人奖励',task.friend,'云贝')}</div>${footer('invite','保存邀请任务')}</form>`;
 if(id==='checkin')return `<form class="task-admin-card" data-task-form="checkin"><div class="task-admin-head">${icon}<h4>${A.escape(task.name)}</h4><span class="task-admin-kind">每日任务</span>${actions}</div><div class="task-admin-fields">${field('name','任务名称',task.name,'用户端卡片标题')}${field('desc','任务备注',task.desc,'用户端卡片说明')}${[0,1,2,3,4].map(n=>number(`reward-${n}`,`第 ${n+1} 次`,state.config.supplyRules?.checkin?.rewards?.[n]??1,'云贝')).join('')}</div>${footer('checkin','保存签到任务')}</form>`;
 const meta=isNew?'自定义任务':(task.custom?'自定义任务':({profile:'成长任务',wechat:'成长任务',avatar:'成长任务'}[id]||'成长任务'));
 return `<form class="task-admin-card ${isNew?'is-creating':''}" data-task-form="${A.escape(id)}" ${isNew?'hidden':''}><div class="task-admin-head">${icon}<h4>${A.escape(task.name||'新建云贝任务')}</h4><span class="task-admin-kind">${meta}</span>${actions}</div><div class="task-admin-fields">${field('name','任务名称',task.name,'用户端卡片标题')}${field('desc','任务备注',task.desc,'用户端卡片说明')}${number('reward','获得云贝',task.reward,'云贝')}</div>${footer(id,isNew?'保存任务':'保存任务')}</form>`;
}
function renderTaskAdmin(){
 const box=$('#task-admin-cards'),c=taskCfg(),form=$('#supply-task-config');if(!box||!form)return;
 const ids=Object.keys(c.tasks||{});
 box.innerHTML=ids.map(id=>taskAdminCard(id,c)).join('');
 if(!box.querySelector('[data-task-form="__new__"]'))box.insertAdjacentHTML('afterbegin',taskAdminCard('__new__',c));
 box.querySelector('[data-task-form="__new__"]').hidden=window.__newTaskOpen!==true;
}
function hideTaskCreateForm(){
 window.__newTaskOpen=false;window.__newTaskIcon='';
 const form=document.querySelector('[data-task-form="__new__"]');
 if(form){form.reset();form.hidden=true;}
 renderTaskAdmin();
}


document.addEventListener('click',e=>{
 const createBtn=e.target.closest('[data-task-create]');
 if(createBtn){if(!isAdmin())return;window.__newTaskOpen=true;renderTaskAdmin();document.querySelector('[data-task-form="__new__"] [name=name]')?.focus();return;}
 const delTask=e.target.closest('[data-task-delete]');
 if(delTask){if(!isAdmin())return;const id=delTask.dataset.taskDelete,t=state.config.yunbeiTasks?.tasks?.[id];if(!t)return;const name=t.name||'云贝任务';delete state.config.yunbeiTasks.tasks[id];if(['invite','profile','checkin','wechat','avatar'].includes(id)){if(!Array.isArray(state.config.yunbeiTasks.deletedTasks))state.config.yunbeiTasks.deletedTasks=[];if(!state.config.yunbeiTasks.deletedTasks.includes(id))state.config.yunbeiTasks.deletedTasks.push(id);}persist();renderTaskAdmin();renderAll();toast(name+'已删除。');return;}
 const up=e.target.closest('[data-task-icon-upload]');
 if(up){const input=up.closest('.task-admin-card')?.querySelector('.task-icon-file');if(input){input.value='';input.click();}return;}
 const del=e.target.closest('[data-task-icon-remove]');
 if(del){const id=del.dataset.taskIconRemove;if(state.config.yunbeiTasks?.tasks?.[id])state.config.yunbeiTasks.tasks[id].icon='';persist();renderTaskAdmin();renderAll();toast('任务图标已删除。');return;}
});
document.addEventListener('change',e=>{
 const input=e.target.closest('[data-task-icon-file]');if(!input||!input.files?.[0])return;
 const id=input.dataset.taskIconFile,file=input.files[0];
 if(file.size>1024*300){toast('图标请选择 300KB 以内的图片。');input.value='';return;}
 const reader=new FileReader();
 reader.onload=()=>{const dataUrl=String(reader.result||'');if(id==='__new__'){window.__newTaskIcon=dataUrl;renderTaskAdmin();input.value='';return;}if(!state.config.yunbeiTasks?.tasks?.[id])state.config.yunbeiTasks.tasks[id]={};state.config.yunbeiTasks.tasks[id].icon=dataUrl;try{persist();renderTaskAdmin();renderAll();toast('任务图标已更新。');}catch(err){toast('图标过大，保存失败，请换一张小图。');input.value='';}};
 reader.readAsDataURL(file);
});
document.addEventListener('submit',e=>{
 if(e.target.matches('[data-task-form]')){e.preventDefault();if(!isAdmin())return;if(!e.target.reportValidity())return;setSaveFeedback(e.target,'saved');const form=e.target,id=form.dataset.taskForm,d=new FormData(form),num=n=>Math.max(0,Math.round(Number(d.get(n))||0));const name=String(d.get('name')||'').trim()||'云贝任务';const desc=String(d.get('desc')||'').trim()||'完成任务获得云贝。';if(!state.config.yunbeiTasks.tasks)state.config.yunbeiTasks.tasks={};if(id==='__new__'){const newId=uid('TASK');state.config.yunbeiTasks.tasks[newId]={name,desc,reward:Number(d.get('reward'))||0,icon:window.__newTaskIcon||'',custom:true};try{persist();renderTaskAdmin();renderAll();setSaveFeedback(form,'saved');hideTaskCreateForm();toast(name+'已添加并同步用户端。');}catch(err){setSaveFeedback(form,'error');throw err;}return;}state.config.yunbeiTasks.tasks[id]={...(state.config.yunbeiTasks.tasks[id]||{}),name,desc};if(id==='invite')state.config.yunbeiTasks.tasks[id]={...state.config.yunbeiTasks.tasks[id],link:String(d.get('link')||'https://www.genescloud.cn/home').trim()||'https://www.genescloud.cn/home'};if(id==='invite'){state.config.yunbeiTasks.tasks[id]={...state.config.yunbeiTasks.tasks[id],daily:num('daily'),inviter:num('inviter'),friend:num('friend')};}else if(id==='checkin'){const rewards=[0,1,2,3,4].map(n=>num('reward-'+n));state.config.yunbeiTasks.tasks[id]={...state.config.yunbeiTasks.tasks[id],rewards};if(!state.config.supplyRules?.checkin)state.config.supplyRules.checkin={enabled:true,rewards,unlockAt:5,perk:'volcano'};state.config.supplyRules.checkin.rewards=rewards;A.data.weekRules[weekStart(A.day())]={...(A.data.weekRules[weekStart(A.day())]||{enabled:state.config.supplyRules.checkin.enabled??true,perk:'volcano',unlockAt:5}),rewards};}else{state.config.yunbeiTasks.tasks[id]={...state.config.yunbeiTasks.tasks[id],reward:num('reward')};}
 try{persist();renderTaskAdmin();renderAll();setSaveFeedback(form,'saved');toast(name+'已保存并同步用户端。');}catch(err){setSaveFeedback(form,'error');throw err;}return;}
});
window.addEventListener('storage',()=>{applyConfig();applyRechargeActivity(activeRechargeActivity());renderAll();});

$('#panel-admin').insertAdjacentHTML('beforeend',`<section id="admin-invoices" class="growth-section" hidden><article class="surface admin-config-card"><div class="surface-heading"><div><h3>发票申请管理</h3><p>查看用户提交的单笔和合并开票申请</p></div><span class="growth-scope-label">管理员视图</span></div><div class="admin-list-heading"><h4 id="admin-invoice-heading">全部发票申请</h4><span id="admin-invoice-count">0 条</span></div><div class="invoice-status-tabs" role="tablist" aria-label="发票申请状态筛选"><button type="button" class="active" data-admin-invoice-filter="all">全部</button><button type="button" data-admin-invoice-filter="pending">开票中</button><button type="button" data-admin-invoice-filter="issued">已开票</button></div><div class="table-wrap"><table><thead><tr><th>申请编号</th><th>申请人</th><th>抬头类型</th><th>发票抬头</th><th>订单数量</th><th>开票金额</th><th>状态</th><th>操作</th></tr></thead><tbody id="admin-invoice-rows"></tbody></table></div></article></section>`);
function adminInvoiceRecords(){const groups=new Map();rechargeOrders().filter(o=>o.invoice).forEach(o=>{const i=o.invoice;if(!groups.has(i.id))groups.set(i.id,{...i,orderIds:[...new Set(i.orderIds||[o.id])]});else{const g=groups.get(i.id);g.orderIds=[...new Set([...g.orderIds,...(i.orderIds||[o.id])])];g.totalCents=g.orderIds.reduce((sum,id)=>sum+(rechargeOrders().find(x=>x.id===id)?.invoiceCents||0),0);}});return [...groups.values()].sort((a,b)=>Date.parse(b.created)-Date.parse(a.created));}
let adminInvoiceFilter='all';
document.addEventListener('click',e=>{const b=e.target.closest('[data-admin-invoice-filter]');if(!b)return;adminInvoiceFilter=b.dataset.adminInvoiceFilter;renderAdminInvoices();});
function renderAdminInvoices(){const all=adminInvoiceRecords(),rows=adminInvoiceFilter==='all'?all:all.filter(i=>i.status===adminInvoiceFilter),body=$('#admin-invoice-rows');if(!body)return;const counts={all:all.length,pending:all.filter(i=>i.status==='pending').length,issued:all.filter(i=>i.status==='issued').length};$$('[data-admin-invoice-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.adminInvoiceFilter===adminInvoiceFilter);b.textContent=(b.dataset.adminInvoiceFilter==='all'?'全部':b.dataset.adminInvoiceFilter==='pending'?'开票中':'已开票')+' '+counts[b.dataset.adminInvoiceFilter];});const heading=$('#admin-invoice-heading');if(heading)heading.textContent=adminInvoiceFilter==='all'?'全部发票申请':adminInvoiceFilter==='pending'?'开票中申请':'已开票申请';const count=$('#admin-invoice-count');if(count)count.textContent=rows.length+' 条';body.innerHTML=rows.map(i=>`<tr><td class="record-title"><div class="order-name">${esc(i.id)}</div><div class="order-id"><span class="tag ${(i.orderIds?.length||1)>1?'merge':'single'}">${(i.orderIds?.length||1)>1?'合并申请':'单笔申请'}</span>${fmt(i.orderIds?.length||1)} 张充值订单</div></td><td>${esc(i.applicant||'当前用户')}</td><td>${i.type==='company'?'企业':'个人'}</td><td>${esc(i.title)}</td><td class="num">${fmt(i.orderIds?.length||1)}</td><td class="num">${money(i.totalCents)}</td><td><span class="tag ${i.status==='issued'?'success':i.status==='pending'?'pending':''}">${{available:'待开票',pending:'开票中',issued:'已开票'}[i.status]||'待开票'}</span></td><td><button class="table-action" data-admin-invoice-detail="${esc(i.orderIds?.[0]||'')}">查看详情</button></td></tr>`).join('')||'<tr><td colspan="8" style="text-align:center;padding:36px">暂无发票申请。</td></tr>';}
document.addEventListener('click',e=>{const b=e.target.closest('[data-admin-invoice-detail]');if(b)invoiceDetails(b.dataset.adminInvoiceDetail);});
const beforeAdminInvoices=renderAdminLists;renderAdminLists=function(){beforeAdminInvoices();renderAdminInvoices();};

})();
