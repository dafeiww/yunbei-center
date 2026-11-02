function isAdmin(){return state.role==='admin';}
let adminView='recharge';
let adminShopCover='';
let pendingAdminPublish=null;

function confirmAdminPublish(kind,id){
 if(!isAdmin())return;
 closeProductUnitMenu();
 const product=kind==='product',item=(product?state.config.catalog:state.config.rechargePlans).find(row=>row.id===id);if(!item)return;
 const quote=product?null:rechargeQuote(id);
 const content=product?`<div class="detail-line"><span>商品名称</span><strong>${esc(item.name)}</strong></div><div class="detail-line"><span>兑换单位</span><strong>${esc(item.unit)}</strong></div><div class="detail-line"><span>所需云贝</span><strong>${fmt(item.price)} 云贝</strong></div>`:`<div class="detail-line"><span>充值原价</span><strong>${money(quote.faceCents)}</strong></div><div class="detail-line"><span>实付金额</span><strong>${money(quote.paidCents)}</strong></div><div class="detail-line"><span>到账云贝</span><strong>${fmt(quote.total)} 云贝</strong></div>`;
 openModal(product?'确认上架商品':'确认启用充值档位',`<p class="modal-intro">${product?'上架后，用户可以在兑换商城看到并兑换该商品。':'启用后，用户可以在充值页面选择并购买该档位。'}</p>${content}<div class="modal-actions"><button type="button" class="btn" data-action="close">取消</button><button type="button" class="btn primary" id="confirm-admin-publish">${product?'确认上架':'确认启用'}</button></div>`);
 pendingAdminPublish={kind,id};
}
const PRODUCT_UNIT_GROUPS=[
 {name:'常用单位',units:['份','个','件','项','套','组','批','张','枚','本','台','款']},
 {name:'次数与活动',units:['次','场','轮','节','课时','门','期','趟']},
 {name:'人员与席位',units:['人','位','人次','席位','账号','团队']},
 {name:'时长',units:['分钟','小时','天','周','月','季度','年']},
 {name:'存储容量',units:['KB','MB','GB','TB','PB']},
 {name:'科研与分析',units:['样本','例','细胞','基因','数据集','项目','任务','报告','图表','文件','页','核时','GPU 时','万 reads','百万 reads']},
 {name:'实物商品',units:['包','盒','袋','瓶','支','册','箱','杯','条','块','卷','米','克','千克','毫升','升']}
];
let unitActiveIndex=-1;

function closeProductUnitMenu(){
 const input=$('#product-unit'),menu=$('#product-unit-options');
 if(menu)menu.hidden=true;
 if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}
 unitActiveIndex=-1;
}
function renderProductUnitOptions(query=''){
 const menu=$('#product-unit-options'),input=$('#product-unit');if(!menu||!input)return;
 const known=new Set(PRODUCT_UNIT_GROUPS.flatMap(g=>g.units));
 const custom=[...new Set(state.config.catalog.map(p=>p.unit).filter(u=>u&&!known.has(u)))];
 const groups=[...(custom.length?[{name:'已使用单位',units:custom}]:[]),...PRODUCT_UNIT_GROUPS];
 const keyword=query.trim().toLowerCase();let index=0;
 menu.innerHTML=groups.map(group=>{
  const units=group.units.filter(unit=>!keyword||unit.toLowerCase().includes(keyword)||group.name.includes(keyword));
  return units.length?`<div class="unit-option-group" role="group" aria-label="${esc(group.name)}"><div class="unit-group-label" role="presentation">${esc(group.name)}</div><div class="unit-group-items">${units.map(unit=>`<button type="button" class="unit-option" id="product-unit-option-${index++}" role="option" tabindex="-1" aria-selected="${unit===input.value.trim()}" data-product-unit="${esc(unit)}">${esc(unit)}</button>`).join('')}</div></div>`:'';
 }).join('');
 if(keyword&&!groups.some(g=>g.units.some(u=>u.toLowerCase()===keyword)))menu.innerHTML+=`<button type="button" class="unit-option unit-custom-option" id="product-unit-option-${index}" role="option" tabindex="-1" aria-selected="false" data-product-unit="${esc(query.trim())}">使用“${esc(query.trim())}”作为自定义单位</button>`;
 unitActiveIndex=-1;input.removeAttribute('aria-activedescendant');
 menu.hidden=false;input.setAttribute('aria-expanded','true');
}
function selectProductUnit(unit){
 const input=$('#product-unit');input.value=unit;input.focus();closeProductUnitMenu();
}

function renderRole(){
 const label=$('#role-switch-label'),nav=$('#tab-admin');
 if(label)label.textContent=isAdmin()?'管理员':'普通用户';
 if(nav)nav.hidden=!isAdmin();
 const operationsNav=$('#tab-operations');if(operationsNav)operationsNav.hidden=!isAdmin();
 document.body.classList.toggle('is-admin',isAdmin());
}

function formatZhe(value){const n=Math.round(Number(value)*10)/10;return `${Number.isInteger(n)?n:n.toFixed(1)}折`;}

function syncAdminView(){
 $$('[data-admin-view]').forEach(b=>b.classList.toggle('active',b.dataset.adminView===adminView));
 const recharge=$('#admin-recharge-panel'),shop=$('#admin-shop-panel');
 if(recharge)recharge.hidden=adminView!=='recharge';
 if(shop)shop.hidden=adminView!=='shop';
}

function openAdminCategoryModal(){
 const modal=$('#admin-category-modal'),input=$('#admin-category-name');
 if(!modal)return;
 if(input)input.value='';
 showAdminAlert('admin-category-alert','');
 closeProductUnitMenu();modal.hidden=false;document.body.classList.add('admin-modal-open');
 input?.focus();
}
function closeAdminCategoryModal(){
 const modal=$('#admin-category-modal');if(!modal)return;
 modal.hidden=true;document.body.classList.remove('admin-modal-open');$('#admin-category-add')?.focus();
}
function renderAdmin(){
 renderRole();
 renderAdminLists();
 syncAdminView();
}

function renderAdminLists(){
 const plans=$('#admin-plan-list'),shop=$('#admin-shop-list');
 if(!plans||!shop)return;
 const planCount=$('#admin-plan-count'),productCount=$('#admin-product-count');
 if(planCount)planCount.textContent=`${state.config.rechargePlans.length} 条`;
 if(productCount)productCount.textContent=`${state.config.catalog.length} 条`;

 const planHeader=`<div class="admin-list-header recharge-header"><span>充值金额(原价)</span><span>云贝</span><span>赠送云贝</span><span>折扣</span><span>实付金额</span><span>获得云贝</span><span>状态 / 操作</span></div>`;
 plans.innerHTML=planHeader+(state.config.rechargePlans.map(p=>{
  const quote=rechargeQuote(p.id),enabled=p.enabled!==false;
  return `
  <article class="admin-item-row plan-row ${enabled?'':'disabled'}">
    <div class="admin-list-cell primary"><strong>¥${p.yuan}</strong></div>
    <div class="admin-list-cell"><b>${fmt(quote.principal)}</b></div>
    <div class="admin-list-cell"><b>${fmt(quote.bonus)}</b></div>
    <div class="admin-list-cell"><b>${formatZhe(quote.discountZhe)}</b></div>
    <div class="admin-list-cell"><b>${money(quote.paidCents)}</b></div>
    <div class="admin-list-cell total"><b class="num">${fmt(quote.total)}</b></div>
    <div class="admin-row-actions">
      <label class="admin-switch" aria-label="${enabled?'关闭充值档位':'启用充值档位'}"><input type="checkbox" data-admin-plan-enabled="${esc(p.id)}" ${enabled?'checked':''}><span class="switch-track"><i></i></span><em>${enabled?'启用':'关闭'}</em></label>
      <button type="button" class="table-action danger" data-admin-delete-plan="${esc(p.id)}">删除</button>
    </div>
  </article>`;
 }).join('')||'<div class="admin-empty">暂无充值档位，请在上方添加。</div>');

 shop.innerHTML=`<table class="admin-shop-table" aria-label="商城商品列表"><thead><tr><th scope="col">封面</th><th scope="col">商品名称</th><th scope="col">权益分类</th><th scope="col">兑换单位</th><th scope="col">所需云贝</th><th scope="col">上架状态</th><th scope="col">操作</th></tr></thead><tbody>${state.config.catalog.map(p=>{
  const enabled=p.enabled!==false;
  return `<tr data-product-row="${esc(p.id)}" class="${enabled?'':'product-offline'}">
   <td><div class="admin-table-cover">${p.cover?`<img src="${esc(p.cover)}" alt="${esc(p.name)} 封面">`:`${icon(p.icon||'gift')}<span>默认封面</span>`}</div></td>
   <td class="admin-product-name">${esc(p.name)}</td>
   <td>${esc(p.category)}</td><td>${esc(p.unit||'份')}</td>
   <td class="num admin-product-price">${fmt(p.price)}<small>云贝</small></td>
   <td><label class="admin-switch"><input type="checkbox" aria-label="${enabled?'下架':'上架'} ${esc(p.name)}" data-admin-product-enabled="${esc(p.id)}" ${enabled?'checked':''}><span class="switch-track"><i></i></span><em>${enabled?'上架':'下架'}</em></label></td>
   <td><button type="button" class="table-action danger" data-admin-delete-product="${esc(p.id)}" aria-label="删除 ${esc(p.name)}">删除</button></td>
  </tr>`;
 }).join('')||'<tr><td colspan="7" class="admin-table-empty">暂无商品，请在上方添加。</td></tr>'}</tbody></table>`;
}

function readAdminPlanForm(source='paid'){
 const yuan=Math.max(0,Number($('#plan-yuan')?.value)||0);
 const discountInput=Math.max(0,Number($('#plan-discount')?.value)||0);
 const paidInput=Math.max(0,Number($('#plan-paid')?.value)||0);
 const discountZhe=source==='discount'?Math.round(discountInput*10)/10:0;
 const paidCents=source==='discount'&&yuan>0?Math.round(yuan*100*discountZhe/10):Math.round(paidInput*100);
 const yuanCents=Math.round(yuan*100);
 const effectiveZhe=source==='discount'?discountZhe:yuanCents>0?Math.round((paidCents/yuanCents)*100)/10:0;
 const valid=yuan>=1&&paidCents>0&&effectiveZhe>=1&&effectiveZhe<=9;
 return {yuan,paid:paidCents/100,bonus:Math.max(0,Math.round(Number($('#plan-bonus')?.value)||0)),paidCents,discountZhe:effectiveZhe,valid};
}

function updateAdminPlanForm(source='paid'){
 const form=$('#admin-plan-form');
 if(!form)return;
 const data=readAdminPlanForm(source);
 const principal=$('#plan-principal'),discount=$('#plan-discount'),paid=$('#plan-paid'),alert=$('#admin-plan-alert'),button=form.querySelector('button[type=submit]');
 if(principal)principal.value=Math.round(data.yuan*10);
 if(source==='discount'&&paid)paid.value=(data.paidCents/100).toFixed(2);
 if(source!=='discount'&&discount)discount.value=data.discountZhe>0?String(data.discountZhe):'';
 if(alert){
  if(!data.valid&&data.yuan>0&&data.paidCents>0){
   alert.textContent='折扣需在 1–9 折之间，实付金额会按折扣自动更新。';
   alert.hidden=false;
  }else alert.hidden=true;
 }
 const preview=$('#admin-plan-preview');if(preview)preview.innerHTML=`<span>合计到账<strong class="num">${fmt(Math.round(data.yuan*10)+data.bonus)}</strong><small>云贝</small></span><span>实付<strong class="num">${money(data.paidCents)}</strong></span>`;
 if(button)button.disabled=!data.valid;
}

function resetAdminPlanForm(){
 const yuan=$('#plan-yuan'),paid=$('#plan-paid'),bonus=$('#plan-bonus'),discount=$('#plan-discount');
 if(yuan)yuan.value='10';
 if(paid)paid.value='8';
 if(bonus)bonus.value='0';
 if(discount)discount.value='8';
 updateAdminPlanForm('paid');
}

function refreshProductCategoryOptions(selected){
 const select=$('#product-category');
 if(!select)return;
 const names=[];
 for(const p of catalog){const name=(p.category||'').trim();if(name&&!names.includes(name))names.push(name);}
 for(const rawName of (state.config.customCategories||[])){const name=String(rawName||'').trim();if(name&&!names.includes(name))names.push(name);}
 for(const name of ['存储空间','项目分享'])if(!names.includes(name))names.push(name);
 select.innerHTML=names.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
 if(names.includes(selected))select.value=selected;else select.value=names[0]||'存储空间';
}

function readAdminProductForm(){
 const category=$('#product-category')?.value||'存储空间';
 return {
  name:$('#product-name')?.value.trim()||'',
  category,
  price:Number($('#product-price')?.value),
  unit:$('#product-unit')?.value.trim()||''
 };
}

function resetAdminProductForm(category='存储空间'){
 const set=(id,value)=>{const el=$('#'+id);if(el)el.value=value;};
 set('product-name','');set('product-price','');set('product-unit','份');closeProductUnitMenu();
 const select=$('#product-category');if(select&&[...select.options].some(o=>o.value===category))select.value=category;const categoryNew=$('#product-category-new');if(categoryNew){categoryNew.hidden=true;categoryNew.value='';}
 adminShopCover='';
 const preview=$('#admin-shop-cover-preview'),state=$('#admin-shop-cover-state');
 if(preview){preview.hidden=true;preview.src='';}
 if(state)state.textContent='未上传，使用默认封面；建议比例 320 × 128';
}

function showAdminAlert(id,message){const el=$('#'+id);if(!el)return;el.textContent=message;el.hidden=!message;}

document.addEventListener('submit',event=>{
 if(event.target.id==='admin-category-form'){
  event.preventDefault();
  const name=$('#admin-category-name')?.value.trim()||'';
  if(!name){showAdminAlert('admin-category-alert','请输入分类名称。');return;}
  const all=[...(state.config.customCategories||[]),...catalog.map(p=>p.category),'存储空间','项目分享'];
  if(all.includes(name)){showAdminAlert('admin-category-alert','该分类已存在。');return;}
  state.config.customCategories=[...(state.config.customCategories||[]),name];
  persist();applyConfig();refreshProductCategoryOptions(name);renderAdmin();renderAll();closeAdminCategoryModal();toast('分类已新增。');
  return;
 }
 if(event.target.id==='admin-plan-form'){
  event.preventDefault();
  const data=readAdminPlanForm();
  if(!data.valid){updateAdminPlanForm('paid');showAdminAlert('admin-plan-alert','请检查充值金额和实付金额，折扣需在 1–9 折之间。');return;}
  if(state.config.rechargePlans.length>=6){toast('最多可添加 6 个充值档位。');return;}
  state.config.rechargePlans.push({id:uid('P'),yuan:data.yuan,principal:Math.round(data.yuan*10),bonus:data.bonus,discountZhe:data.discountZhe,paidCents:data.paidCents,enabled:false});
  persist();applyConfig();renderAdmin();renderAll();resetAdminPlanForm();toast('充值档位已保存，暂未启用。');
  return;
 }
 if(event.target.id==='admin-product-form'){
  event.preventDefault();
  const d=readAdminProductForm();
  if(!d.name){showAdminAlert('admin-product-alert','请填写权益名称。');return;}
  if(!Number.isSafeInteger(d.price)||d.price<1){showAdminAlert('admin-product-alert','所需云贝需填写大于 0 的整数。');return;}
  if(!d.unit){showAdminAlert('admin-product-alert','请选择或输入兑换单位。');return;}
  state.config.catalog.push({
   id:uid('P'),name:d.name,category:d.category,price:d.price,unit:d.unit,
   cover:adminShopCover,enabled:false,kind:'generic',icon:'gift',color:'peach',
   badge:d.category||'权益扩展'
  });
  persist();applyConfig();refreshProductCategoryOptions(d.category);refreshShopCategories();renderAdmin();renderAll();resetAdminProductForm(d.category);showAdminAlert('admin-product-alert','');toast('商品已保存，暂未上架。');
 }
});

document.addEventListener('click',event=>{
 if(event.target.closest('#confirm-admin-publish')){
  if(!isAdmin()||!pendingAdminPublish)return;
  const {kind,id}=pendingAdminPublish,item=(kind==='product'?state.config.catalog:state.config.rechargePlans).find(row=>row.id===id);
  if(!item){closeModal();toast('该记录已不存在，请刷新列表。');return;}
  item.enabled=true;pendingAdminPublish=null;closeModal();persist();applyConfig();renderAll();toast(kind==='product'?'商品已上架，用户现在可以兑换。':'充值档位已启用，用户现在可以充值。');return;
 }
 const viewBtn=event.target.closest('[data-admin-view]');
 if(viewBtn){closeProductUnitMenu();adminView=viewBtn.dataset.adminView;syncAdminView();return;}
 const unitOption=event.target.closest('[data-product-unit]');
 if(unitOption){selectProductUnit(unitOption.dataset.productUnit);return;}
 if(event.target.closest('.unit-toggle')){const open=!$('#product-unit-options').hidden;$('#product-unit').focus();if(open)closeProductUnitMenu();else renderProductUnitOptions();return;}
 if(!event.target.closest('#product-unit-select'))closeProductUnitMenu();
 if(event.target.closest('#admin-category-add')){openAdminCategoryModal();return;}
 if(event.target.closest('[data-admin-close-category-modal]')){closeAdminCategoryModal();return;}
 if(event.target.id==='admin-category-modal'){closeAdminCategoryModal();return;}
 if(event.target.closest('#admin-shop-cover-button')){$('#admin-shop-cover')?.click();return;}
 const deletePlan=event.target.closest('[data-admin-delete-plan]');
 if(deletePlan){
  const id=deletePlan.dataset.adminDeletePlan;
  state.config.rechargePlans=state.config.rechargePlans.filter(p=>p.id!==id);
  persist();applyConfig();renderAdmin();renderAll();toast('充值档位已删除。');return;
 }
 const deleteProduct=event.target.closest('[data-admin-delete-product]');
 if(deleteProduct){
  const id=deleteProduct.dataset.adminDeleteProduct;
  state.config.catalog=state.config.catalog.filter(p=>p.id!==id);
  persist();applyConfig();renderAdmin();renderAll();toast('商品已删除。');return;
 }
});

document.addEventListener('input',event=>{
 if(event.target.id==='plan-discount')updateAdminPlanForm('discount');
 else if(event.target.closest('#admin-plan-form'))updateAdminPlanForm(event.target.id==='plan-paid'?'paid':'discount');
 if(event.target.id==='product-unit')renderProductUnitOptions(event.target.value);
});

document.addEventListener('change',event=>{
 const planSwitch=event.target.closest('[data-admin-plan-enabled]');
 if(planSwitch){
  const plan=state.config.rechargePlans.find(p=>p.id===planSwitch.dataset.adminPlanEnabled);
  if(plan&&planSwitch.checked){planSwitch.checked=false;confirmAdminPublish('plan',plan.id);return;}
  if(plan){plan.enabled=planSwitch.checked;persist();applyConfig();renderAdminLists();renderAll();toast(plan.enabled?'充值档位已启用。':'充值档位已关闭。');}
  return;
 }
 const productSwitch=event.target.closest('[data-admin-product-enabled]');
 if(productSwitch){
  const product=state.config.catalog.find(p=>p.id===productSwitch.dataset.adminProductEnabled);
  if(product&&productSwitch.checked){productSwitch.checked=false;confirmAdminPublish('product',product.id);return;}
  if(product){product.enabled=productSwitch.checked;persist();applyConfig();renderAdminLists();renderAll();toast(product.enabled?'商品已上架。':'商品已下架。');}
  return;
 }
 const fileInput=event.target.closest('#admin-shop-cover');
 if(!fileInput||!fileInput.files?.[0])return;
 const file=fileInput.files[0];
 if(!file.type.startsWith('image/')){toast('请选择图片作为商品封面。');fileInput.value='';return;}
 if(file.size>600*1024){toast('封面图片请小于 600KB。');fileInput.value='';return;}
 const reader=new FileReader();
 reader.onload=()=>{
  adminShopCover=reader.result;
  const preview=$('#admin-shop-cover-preview'),state=$('#admin-shop-cover-state');
  if(preview){preview.src=adminShopCover;preview.hidden=false;}
  if(state)state.textContent='已上传封面';
 };
 reader.readAsDataURL(file);
});

$('#product-unit')?.addEventListener('focus',()=>renderProductUnitOptions());
$('#product-unit')?.addEventListener('keydown',event=>{
 const menu=$('#product-unit-options');
 if(event.key==='Tab'){closeProductUnitMenu();return;}
 if(event.key==='Escape'&&!menu.hidden){event.preventDefault();event.stopPropagation();closeProductUnitMenu();return;}
 if(['ArrowDown','ArrowUp'].includes(event.key)){
  event.preventDefault();if(menu.hidden)renderProductUnitOptions(event.target.value);
  const options=$$('[data-product-unit]',menu);if(!options.length)return;
  unitActiveIndex=(unitActiveIndex+(event.key==='ArrowDown'?1:unitActiveIndex<0?0:-1)+options.length)%options.length;
  options.forEach((option,index)=>option.classList.toggle('keyboard-active',index===unitActiveIndex));
  event.target.setAttribute('aria-activedescendant',options[unitActiveIndex].id);options[unitActiveIndex].scrollIntoView({block:'nearest'});
 }
 if(event.key==='Enter'&&!menu.hidden){event.preventDefault();const options=$$('[data-product-unit]',menu),chosen=options[unitActiveIndex]||options.find(o=>o.dataset.productUnit===event.target.value.trim())||options.at(-1);if(chosen)selectProductUnit(chosen.dataset.productUnit);}
});
$('#product-unit-options')?.addEventListener('mousedown',event=>event.preventDefault());
document.addEventListener('keydown',event=>{
 const overlay=$('#admin-category-modal');if(!overlay||overlay.hidden)return;
 if(event.key==='Escape'){event.preventDefault();closeAdminCategoryModal();return;}
 if(event.key==='Tab'){
  const focusable=$$('button:not(:disabled),input:not(:disabled)',overlay).filter(el=>el.getClientRects().length),first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
});

resetAdminPlanForm();
refreshProductCategoryOptions();resetAdminProductForm();
