const downloadingInvoices=new Set();

function toast(message) { clearTimeout(toastTimer); $('#toast-text').textContent=message; $('#toast').hidden=false; toastTimer=setTimeout(()=>$('#toast').hidden=true,3600); }

function visual(id) {
      const bg = {charts:'#eef3ea',storage:'#edf2f5',ai:'#f0edf5',export:'#f6f0e6',compute:'#eaf2ed',team:'#f5eeea','bio-skill':'#edf2f8'}[id]||'#f4f7f8';
      let art='';
      if(id==='charts') art=`<g transform="translate(62 18)"><rect x="0" y="9" width="142" height="93" rx="6" fill="#fff" stroke="#dbe4d4"/><path d="M15 31h112M15 51h112M15 71h112" stroke="#edf1e8"/><path d="M15 19v65h113" stroke="#dae3d2" fill="none"/><rect x="25" y="58" width="13" height="25" rx="2" fill="#c9d7b5"/><rect x="48" y="45" width="13" height="38" rx="2" fill="#aabf8f"/><rect x="71" y="30" width="13" height="53" rx="2" fill="#7e9f6c"/><rect x="94" y="41" width="13" height="42" rx="2" fill="#a6bd90"/><path d="m26 46 30-14 25 4 25-20" stroke="#c7aa6f" fill="none" stroke-width="1.8"/><circle cx="56" cy="32" r="2.4" fill="#c7aa6f"/><circle cx="81" cy="36" r="2.4" fill="#c7aa6f"/></g><g transform="translate(190 39)"><rect width="64" height="66" rx="6" fill="#fff" stroke="#e1e8d9"/><circle cx="32" cy="30" r="19" fill="none" stroke="#e8eee0" stroke-width="9"/><circle cx="32" cy="30" r="19" fill="none" stroke="#83a375" stroke-width="9" stroke-dasharray="73 120" transform="rotate(-90 32 30)"/><circle cx="32" cy="30" r="19" fill="none" stroke="#cbb47d" stroke-width="9" stroke-dasharray="22 120" stroke-dashoffset="-76" transform="rotate(-90 32 30)"/><rect x="19" y="57" width="26" height="2" rx="1" fill="#dbe4d3"/></g>`;
      if(id==='storage') art=`<ellipse cx="163" cy="104" rx="68" ry="8" fill="#dce5e9"/><g transform="translate(97 20)"><path d="m0 32 62 22 65-23-64-22-63 23Z" fill="#e3ebee" stroke="#c3d2d9"/><path d="M0 32v19l62 23V54L0 32Z" fill="#c2d2da"/><path d="m62 54 65-23v20L62 74V54Z" fill="#93b0bc"/><path d="M0 56v18l62 23V78L0 56Z" fill="#d1dee4"/><path d="m62 78 65-23v19L62 97V78Z" fill="#a7c0cb"/><path d="m0 56 13-5 49 18 52-18 13 4-65 23L0 56Z" fill="#edf3f5"/><path d="M15 49v5m8-2v5m-8 17v5m8-2v5" stroke="#f2f6f8" stroke-width="2"/><circle cx="110" cy="47" r="2" fill="#e4eff0"/><circle cx="110" cy="70" r="2" fill="#e4eff0"/></g><g transform="translate(156 15)"><path d="M0 21c-5-9 2-18 11-17 5-14 27-13 32 0 19-1 21 25 2 26H4c-7 0-10-6-4-9Z" fill="#fff" stroke="#c8d8df"/><path d="M21 9v13m-5-5 5 5 5-5" fill="none" stroke="#90afbb" stroke-width="1.7"/></g>`;
      if(id==='ai') art=`<g transform="translate(88 18)"><rect width="117" height="94" rx="6" fill="#fff" stroke="#ded8e9"/><rect x="13" y="13" width="42" height="3" rx="1.5" fill="#c4b4d7"/><rect x="13" y="23" width="77" height="2" rx="1" fill="#e9e3ef"/><path d="M14 72h86M14 40h86M14 56h86" stroke="#f0ecf4"/><path d="m16 68 16-10 14 4 16-19 17 6 18-18" fill="none" stroke="#aa93c3" stroke-width="2"/><path d="m16 68 16-10 14 4 16-19 17 6 18-18v47H16Z" fill="#c4b1d5" opacity=".14"/><rect x="14" y="84" width="64" height="2" rx="1" fill="#e6dfed"/></g><g transform="translate(184 51)"><rect width="62" height="50" rx="9" fill="#f8f5fb" stroke="#d9cfe4"/><path d="m31 10 4.5 11.5L47 26l-11.5 4.5L31 42l-4.5-11.5L15 26l11.5-4.5L31 10Z" fill="#b09ac6"/><path d="M49 6v8M45 10h8" stroke="#c0add2" stroke-width="1.3"/></g><path d="m78 56-10 3m15 23-8 5" stroke="#d2c7df" stroke-width="1.5"/>`;
      if(id==='export') art=`<g transform="translate(94 19) rotate(-7 47 44)"><rect width="96" height="89" rx="5" fill="#f5ecdb" stroke="#e5d5ba"/></g><g transform="translate(110 15)"><rect width="100" height="95" rx="5" fill="#fffdfa" stroke="#e6d9c2"/><path d="M13 66h72M13 25v41" stroke="#e9decd" fill="none"/><path d="m17 52 15-10 16 6 16-19 18 5" stroke="#bda370" stroke-width="1.8" fill="none"/><rect x="15" y="78" width="39" height="3" rx="1.5" fill="#d8c8ac"/><rect x="15" y="85" width="57" height="2" rx="1" fill="#ece3d4"/></g><g transform="translate(189 71)"><rect width="53" height="27" rx="5" fill="#e9d8b5" stroke="#dbc398"/><text x="26.5" y="18" text-anchor="middle" fill="#a38751" font-size="11" font-family="system-ui,sans-serif" font-weight="600">HD</text></g><path d="M235 32v16m-6-6 6 6 6-6M228 53h14" fill="none" stroke="#bfa97f" stroke-width="1.5"/>`;
      if(id==='compute') art=`<g transform="translate(118 24)"><path d="M6 8h69v68H6Z" fill="#d4e4d7" stroke="#a6c2ad"/><rect x="15" y="17" width="51" height="50" rx="5" fill="#eef5ec" stroke="#b5cdb9"/><path d="M2 19h-9m9 13h-9m9 13h-9m9 13h-9M80 19h9m-9 13h9m-9 13h9m-9 13h9M18 3v-9m14 9v-9m14 9v-9m14 9v-9M18 81v9m14-9v9m14-9v9m14-9v9" stroke="#b2cab7" stroke-width="3"/><path d="m44 25-20 24h15l-2 15 20-27H43l1-12Z" fill="#84a78d"/></g><circle cx="221" cy="83" r="18" fill="#f8fbf6" stroke="#d1e2d0"/><path d="M221 72v11l7 4" stroke="#9ab69b" stroke-width="1.5" fill="none"/><path d="M83 50h14m-10 8h10m-7 8h7" stroke="#bed1be" stroke-width="2" stroke-linecap="round"/>`;
      if(id==='team'||id==='share') art=`<g transform="translate(105 22)"><rect x="0" y="0" width="114" height="83" rx="6" fill="#fffcf9" stroke="#e5d8cc"/><path d="M0 18h114" stroke="#eee5da"/><circle cx="10" cy="9" r="2" fill="#d9b9a3"/><circle cx="18" cy="9" r="2" fill="#d9c6ae"/><circle cx="26" cy="9" r="2" fill="#c5c8ad"/><rect x="12" y="29" width="22" height="38" rx="3" fill="#edddce"/><rect x="40" y="29" width="61" height="3" rx="1.5" fill="#dfc8b8"/><rect x="40" y="40" width="44" height="3" rx="1.5" fill="#eadbce"/><rect x="40" y="51" width="50" height="3" rx="1.5" fill="#eadbce"/><rect x="40" y="62" width="36" height="3" rx="1.5" fill="#eadbce"/></g><g transform="translate(89 75)"><circle cx="0" cy="0" r="18" fill="#f9f2e9" stroke="#e7dac8"/><circle cx="0" cy="-4" r="5" fill="#c4a18a"/><path d="M-9 10a9 9 0 0 1 18 0" fill="#c4a18a"/></g><g transform="translate(227 72)"><circle cx="0" cy="0" r="17" fill="#eef2e8" stroke="#d7dfca"/><circle cx="0" cy="-4" r="5" fill="#a8b794"/><path d="M-9 10a9 9 0 0 1 18 0" fill="#a8b794"/></g>`;
      if(id==='bio-skill')art=`<rect x="83" y="28" width="161" height="82" rx="9" fill="#dce7f3"/><rect x="76" y="20" width="161" height="82" rx="9" fill="#fcfdff" stroke="#c8d7e9"/><path d="M76 40h161" stroke="#e4ebf4"/><circle cx="88" cy="30" r="2" fill="#c6d3e4"/><circle cx="96" cy="30" r="2" fill="#ccddda"/><circle cx="104" cy="30" r="2" fill="#dfd6c5"/><text x="96" y="68" fill="#718eae" font-family="system-ui,sans-serif" font-size="21" font-weight="650" letter-spacing="2">SKILL</text><path d="M96 81h82m-82 8h51" stroke="#dbe5f0" stroke-width="3" stroke-linecap="round"/><rect x="208" y="61" width="43" height="43" rx="10" fill="#edf5ef" stroke="#ccded2"/><path d="m220 72 6 6-6 6m13-12-6 6 6 6" stroke="#92ae9e" stroke-width="2" fill="none"/><path d="M65 57h-9m9 11H51m14 11h-9" stroke="#c9d6e7" stroke-width="2" stroke-linecap="round"/>`;
      if(!art)art='<use href="#i-gift" x="128" y="32" width="64" height="64" fill="none" stroke="#b2bdc9" stroke-width="1.25"></use>';
      return `<svg viewBox="0 0 320 128" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="320" height="128" fill="${bg}"/>${art}</svg>`;
    }

function refreshShopCategories(){
 const box=$('#categories');if(!box)return;
 const names=[];
 for(const p of catalog){if(p.enabled===false)continue;const name=(p.category||'').trim();if(name&&!names.includes(name))names.push(name);}
 if(!names.includes(category))category='全部权益';
 box.innerHTML=`<button class="category ${category==='全部权益'?'active':''}" data-category="全部权益" aria-pressed="${category==='全部权益'}">全部权益</button>`+names.map(name=>`<button class="category ${category===name?'active':''}" data-category="${esc(name)}" aria-pressed="${category===name}">${esc(name)}</button>`).join('');
}
function renderProducts() {
      let items=catalog.filter(p=>p.enabled!==false&&(category==='全部权益'||p.category===category)&&(p.name+(p.desc||'')+p.category).toLowerCase().includes($('#product-search').value.trim().toLowerCase()));
      if(sortMode) items=[...items].sort((a,b)=>sortMode===1?a.price-b.price:b.price-a.price);
      $('#sort-select').value=String(sortMode);
      $('#product-count').textContent=category==='全部权益'&&!$('#product-search').value?'按需兑换商品、权益与活动':`共 ${items.length} 项可兑换商品`;
      $('#products').innerHTML=items.map(p=>{
        const generic=p.kind==='generic';
        return `<article class="product-card"><div class="product-art" style="--art-bg:${({storage:'#edf2f5',share:'#f5eeea'})[p.kind]||'#f4f7f8'};--art-color:${({storage:'#628492',share:'#9f7b63'})[p.kind]||'#8296a2'}"><div class="mobile-art">${icon(p.icon||'gift')}</div><span class="product-badge ${p.id==='charts'?'gold':''}">${esc(p.badge||p.category)}</span>${p.cover?`<img class="product-cover" src="${esc(p.cover)}" alt="${esc(p.name)} 封面">`:visual(p.id)}</div><div class="product-body"><h3>${esc(p.name)}${p.id==='ai'?'<small>AI</small>':''}</h3>${p.desc?`<p class="product-desc">${esc(p.desc)}</p>`:''}<div class="product-meta">${generic?`${icon('gift')}<span>兑换单位：${esc(p.unit)}</span>`:`${icon('clock')}<span>${esc(p.duration||'')}</span><i></i><span>${esc([p.amount,p.unit].filter(Boolean).join(' '))}</span>`}</div><div class="product-footer"><div class="price"><strong class="num">${fmt(p.price)}</strong><span>云贝${generic?' / '+esc(p.unit):''}</span></div><button class="exchange-btn ${state.balance<p.price?'needs-more':''}" data-exchange="${esc(p.id)}" aria-label="${esc(p.name)}，${state.balance<p.price?'还差 '+fmt(p.price-state.balance)+' 云贝，查看获取方式':'兑换需 '+fmt(p.price)+' 云贝'}">${state.balance<p.price?'还差 '+fmt(p.price-state.balance):'立即兑换'}</button></div></div></article>`;
      }).join('')||`<div class="no-results">${icon('search')}<div>暂未找到相关商品</div><p>换个关键词试试，或查看全部商品。</p><button class="table-action" data-action="clear-search">查看全部</button></div>`;
    }

function currentOrders() { const q=$('#order-search').value.trim().toLowerCase(); return exchangeOrders().filter(o=>(orderStatus==='all'||(orderStatus==='active')===isActive(o))&&(o.name+o.id).toLowerCase().includes(q)); }

function renderOrders() {
      const all=exchangeOrders(),items=currentOrders(),pages=Math.max(1,Math.ceil(items.length/ORDER_PAGE_SIZE));
      orderPage=Math.max(1,Math.min(orderPage,pages));
      $('#all-order-count').textContent=all.length;$('#active-order-count').textContent=all.filter(isActive).length;$('#expired-order-count').textContent=all.filter(o=>!isActive(o)).length;
      $$('[data-order-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.orderStatus===orderStatus)));
      $('#orders-total').textContent=items.length?`共 ${items.length} 条兑换记录 · 第 ${(orderPage-1)*ORDER_PAGE_SIZE+1}–${Math.min(orderPage*ORDER_PAGE_SIZE,items.length)} 条`:'暂无记录';
      $('#order-rows').innerHTML=items.slice((orderPage-1)*ORDER_PAGE_SIZE,orderPage*ORDER_PAGE_SIZE).map(o=>`<tr><td class="record-title"><div class="order-cell"><div class="order-mini">${icon(productsById[o.productId]?.icon||'gift')}</div><div><div class="order-name">${esc(o.name)}</div><div class="order-id">${esc(o.id)}</div></div></div></td><td data-label="消耗云贝" class="num" style="color:#5b7588;font-size:15px">${fmt(o.price)}</td><td data-label="兑换时间">${displayDate(o.created,true)}<span class="subtext">${o.expires?(o.productId==='share'?'有效期至':'本包到期')+' '+displayDate(o.expires):'兑换单位：'+esc(o.unit||'份')}</span></td><td data-label="权益状态"><span class="tag ${isActive(o)?'':'pending'}">${!o.expires?'已兑换':isActive(o)?'生效中':'已到期'}</span></td><td class="record-actions"><button class="table-action" data-order-detail="${o.id}">查看详情</button></td></tr>`).join('')||`<tr><td colspan="5" style="text-align:center;padding:48px">暂无符合条件的兑换记录<button class="table-action" style="display:block;margin:8px auto 0" data-action="reset-orders">清除筛选</button></td></tr>`;
      $('#order-pagination').innerHTML=`<button class="invoice-page-btn" data-order-page="${orderPage-1}" ${orderPage===1?'disabled':''} aria-label="上一页">上一页</button>${Array.from({length:pages},(_,i)=>`<button class="invoice-page-btn ${i+1===orderPage?'current':''}" data-order-page="${i+1}" ${i+1===orderPage?'aria-current="page"':''}>${i+1}</button>`).join('')}<button class="invoice-page-btn" data-order-page="${orderPage+1}" ${orderPage===pages?'disabled':''} aria-label="下一页">下一页</button>`;
    }

function renderInvoices() {
      const all=invoiceOrders();$('#all-invoice-count').textContent=all.length;
      for(const status of ['available','pending','issued'])$('#'+status+'-invoice-count').textContent=all.filter(o=>getInvoiceState(o)===status).length;
      const items=invoiceItems(),pages=Math.max(1,Math.ceil(items.length/INVOICE_PAGE_SIZE));invoicePage=Math.max(1,Math.min(invoicePage,pages));selectedInvoices=new Set([...selectedInvoices].filter(id=>items.some(o=>o.id===id&&getInvoiceState(o)==='available')));
      $('#invoice-rows').innerHTML=invoicePageItems().map(o=>{ const status=getInvoiceState(o);return `<tr><td class="check-cell"><input type="checkbox" aria-label="选择 ${esc(o.name)} ${o.id}" data-invoice-check="${o.id}" ${status!=='available'?'disabled':''} ${selectedInvoices.has(o.id)?'checked':''}></td><td class="record-title"><div class="order-name">${esc(o.name)}</div><div class="order-id">${o.id}${o.demo?'<span class="table-demo">历史示例</span>':''}</div></td><td data-label="实付金额" class="num">${money(o.paidCents)}</td><td data-label="可开票金额" class="num" style="color:#5f7b91;font-size:14px">${money(o.invoiceCents)}</td><td data-label="开票状态"><span class="tag ${status==='pending'?'pending':status==='available'?'to-invoice':''}">${{available:'待开票',pending:'申请中',issued:'已开票'}[status]}</span></td><td class="record-actions"><button class="table-action ${status==='available'?'invoice-apply':''}" data-invoice-order="${o.id}">${status==='available'?'申请开票':'查看详情'}</button>${status==='issued'?`<button class="table-action invoice-download" data-download-invoice="${o.id}">${icon('download')}下载 PDF</button>`:''}</td></tr>`;}).join('')||'<tr><td colspan="6" style="text-align:center;padding:48px">暂无此类开票订单</td></tr>';
      $('#invoice-record-total').textContent=items.length?`共 ${items.length} 条 · 第 ${(invoicePage-1)*INVOICE_PAGE_SIZE+1}–${Math.min(invoicePage*INVOICE_PAGE_SIZE,items.length)} 条`:'暂无记录';
      $('#invoice-pagination').innerHTML=`<button class="invoice-page-btn" data-invoice-page="${invoicePage-1}" ${invoicePage===1?'disabled':''} aria-label="上一页">上一页</button>${Array.from({length:pages},(_,i)=>`<button class="invoice-page-btn ${i+1===invoicePage?'current':''}" data-invoice-page="${i+1}" ${i+1===invoicePage?'aria-current="page"':''}>${i+1}</button>`).join('')}<button class="invoice-page-btn" data-invoice-page="${invoicePage+1}" ${invoicePage===pages?'disabled':''} aria-label="下一页">下一页</button>`;
      updateInvoiceSelection();
    }

function updateInvoiceSelection(){
      const available=invoicePageItems().filter(o=>getInvoiceState(o)==='available');
      $('#invoice-selected').textContent=selectedInvoices.size; $('#invoice-total').textContent=money([...selectedInvoices].reduce((s,id)=>s+(orderById(id)?.invoiceCents||0),0)); $('#batch-invoice').disabled=selectedInvoices.size===0;
      $('#select-all-invoices').checked=available.length>0&&available.every(o=>selectedInvoices.has(o.id)); $('#select-all-invoices').indeterminate=available.some(o=>selectedInvoices.has(o.id))&&!$('#select-all-invoices').checked; $('#select-all-invoices').disabled=available.length===0;
      const mobile=$('#select-all-invoices-mobile');mobile.checked=$('#select-all-invoices').checked;mobile.indeterminate=$('#select-all-invoices').indeterminate;mobile.disabled=available.length===0;
    }

function renderOverview(){
      $('#balance').textContent=fmt(state.balance);$('#page-balance-value').textContent=fmt(state.balance);$('#earned').textContent=fmt(state.earned);$('#spent').textContent=fmt(state.spent);const orderCount=$('#order-count');if(orderCount)orderCount.textContent=exchangeOrders().length;
      $('#wallet-paid').textContent=fmt(state.wallet.paid);$('#wallet-reward').textContent=fmt(state.wallet.reward);const week=checkinWeek(),checkedIn=week.checkedIn;$('#wallet-checkin').disabled=false;$('#wallet-checkin').classList.toggle('is-signed',checkedIn);$('#wallet-checkin-label').textContent=checkedIn?'已签到 · 查看进度':'签到领云贝';$('#wallet-checkin-bonus').hidden=checkedIn;$('#wallet-checkin-bonus').textContent='+'+week.nextReward;$('#wallet-checkin').setAttribute('aria-label',checkedIn?'今日已签到，查看本周累计':'每日签到领取 '+week.nextReward+' 云贝');$('#wallet-checkin use').setAttribute('href',checkedIn?'#i-check-circle':'#i-gift');$('#wallet-checkin-hint').textContent='本周 '+week.count+'/7 天 · 已获 '+week.earned+' 云贝';
      $('#ledger-balance').textContent=fmt(state.balance);$('#ledger-earned').textContent=fmt(state.earned);$('#ledger-spent').textContent=fmt(state.spent);
    }

function openModal(title,html){
      saveInvoiceDraft();
      if($('#overlay').hidden)previousFocus=document.activeElement;
      $('#modal').classList.remove('checkin-modal','usage-detail-modal');$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;$('#overlay').hidden=false;document.body.classList.add('modal-body-open');$('.main').inert=true;$('.sidebar').inert=true;$('.topbar').inert=true;$('#modal').scrollTop=0;$('#modal').focus();
    }

function closeModal(){
      window.clearPaymentTimer?.();if(typeof pendingAdminPublish!=='undefined')pendingAdminPublish=null;saveInvoiceDraft();$('#overlay').hidden=true;$('#modal').classList.remove('checkin-modal','usage-detail-modal');$('#modal-content').innerHTML='';document.body.classList.remove('modal-body-open');$('.main').inert=false;$('.sidebar').inert=false;$('.topbar').inert=false;activeExchange=null;invoiceTargets=[];pendingRecharge=null;
      const target=previousFocus?.isConnected&&previousFocus.getClientRects().length?previousFocus:$('#tab-'+activeTab);target?.focus();
    }

function showError(message){let target=$('#modal-error');if(!target){target=document.createElement('div');target.id='modal-error';target.className='modal-error';$('#modal-content').append(target);}target.hidden=false;target.textContent=message;target.setAttribute('role','alert');}

function exchange(productIds){
      const items=productIds.map(id=>productsById[id]);if(items.some(p=>!p))return;
      const total=items.reduce((sum,p)=>sum+p.price,0),insufficient=state.balance<total;
      const previews=items.map(p=>{
        const existing=state.orders.filter(o=>o.productId===p.id&&isActive(o)).reduce((max,o)=>Math.max(max,new Date(o.expires).getTime()),Date.now());
        let outcome='';
        if(p.kind==='duration')outcome=existing>Date.now()?`当前有效期至 ${displayDate(existing)}，本次续期后至 <b>${displayDate(addDays(existing,p.days))}</b>`:`兑换后有效期至 <b>${displayDate(addDays(nowIso(),p.days))}</b>`;
        else if(p.kind==='storage'){const capacity=20+state.orders.filter(o=>o.productId==='storage'&&isActive(o)).length*50;outcome=`可用总容量 <b>${capacity} GB → ${capacity+p.amount} GB</b>，本扩容包有效至 ${displayDate(addDays(nowIso(),p.days))}`;}
        else if(p.kind==='share'){const seats=state.orders.filter(o=>o.productId==='share'&&isActive(o)).reduce((sum,o)=>sum+(productsById[o.productId]?.amount||0),0);outcome=`项目分享席位 <b>${seats} 人 → ${seats+p.amount} 人</b>，本扩容包有效至 ${displayDate(addDays(nowIso(),p.days))}`;}
        else if(p.kind==='generic')outcome=`本次兑换 <b>1 ${esc(p.unit)}</b>`;
        else outcome=`本次新增 <b>${esc(p.unit)}</b>，有效期至 ${displayDate(addDays(nowIso(),p.days))}；多次兑换的额度独立计期`;
        return `<div class="exchange-preview">${icon(p.icon||'gift')}<div><h3>${esc(p.name)}</h3><p>${p.duration?esc(p.duration)+' · ':''}${esc(p.unit)} · ${fmt(p.price)} 云贝</p>${p.desc?`<p class="scope">${esc(p.desc)}</p>`:''}<p class="outcome">${outcome}</p></div></div>`;
      }).join('');
      openModal('确认兑换',`<p class="modal-intro">确认商品、兑换单位和所需云贝后再兑换。${items.length>1?'组合按单品合计支付。':''}</p>${previews}<div class="detail-line"><span>当前可用</span><strong class="num">${fmt(state.balance)} 云贝</strong></div><div class="detail-line"><span>兑换后余额</span><strong class="num">${insufficient?'—':fmt(state.balance-total)+' 云贝'}</strong></div><div class="detail-line total"><span>本次支付</span><strong class="price num">${fmt(total)} <small style="font-size:12px;font-weight:400">云贝</small></strong></div>${insufficient?`<div class="modal-note">${icon('info')}<span class="shortfall">还差 ${fmt(total-state.balance)} 云贝。可通过充值、签到或邀请好友注册获得云贝。</span></div>`:`<div class="modal-note">${icon('info')}<span>确认后扣减云贝，权益与订单同步到账。${items.some(p=>p.kind==='storage')?'扩容包到期后总容量会减少，请提前续期或整理空间。':items.some(p=>p.kind==='duration')?'时长权益重复兑换将顺延有效期。':''}优先扣减奖励云贝，再扣减云贝；只有充值订单可开票。</span></div>`}<div class="modal-error" id="modal-error" hidden></div><div class="modal-actions"><button class="btn" data-action="close">${insufficient?'暂不兑换':'取消'}</button>${insufficient?'<button class="btn primary" data-action="recharge">去云贝</button>':'<button class="btn primary" id="confirm-exchange">确认兑换</button>'}</div>`);
      activeExchange=insufficient?null:{ids:productIds,total};
    }

function invoiceForm(ids){
      const orders=ids.map(orderById).filter(o=>isInvoiceEligible(o)&&getInvoiceState(o)==='available');if(!orders.length||orders.length!==ids.length){toast('仅支持已支付且待开票的充值订单。');return;}
      saveInvoiceDraft();invoiceType=invoiceDraft.type;
      openModal('申请电子发票',`<p class="modal-intro">已选 ${orders.length} 笔订单，申请金额 <strong>${money(orders.reduce((s,o)=>s+o.invoiceCents,0))}</strong>。<br>按充值订单实付金额开票，优惠减免和赠送云贝不计入金额。</p><form id="invoice-form" novalidate><div class="radio-group" role="group" aria-label="发票抬头类型"><button type="button" class="radio-btn" data-invoice-type="company" aria-pressed="false">企业 / 单位</button><button type="button" class="radio-btn" data-invoice-type="personal" aria-pressed="false">个人</button></div><div class="field"><label for="invoice-title">发票抬头 <span>*</span></label><input id="invoice-title" name="title" required maxlength="100" autocomplete="organization" aria-describedby="invoice-title-error"><span class="field-error" id="invoice-title-error" hidden></span></div><div class="field" id="tax-field"><label for="invoice-tax">纳税人识别号 <span>*</span></label><input id="invoice-tax" name="taxId" required maxlength="20" spellcheck="false" placeholder="请输入 15–20 位字母或数字" aria-describedby="tax-help invoice-tax-error"><small id="tax-help">请与单位开票资料保持一致。</small><span class="field-error" id="invoice-tax-error" hidden></span></div><div class="form-row"><div class="field"><label for="invoice-email">接收邮箱 <span>*</span></label><input id="invoice-email" name="email" type="email" required maxlength="120" autocomplete="email" placeholder="如 research@example.com" aria-describedby="invoice-email-error"><span class="field-error" id="invoice-email-error" hidden></span></div><div class="field"><label for="invoice-note">备注（选填）</label><input id="invoice-note" name="note" maxlength="120" placeholder="如：项目名称"></div></div><div class="modal-note">${icon('info')}<span>当前为申请流程演示。提交后可查询申请记录，不会产生真实发票或发送邮件；资料保存在当前浏览器。</span></div><p class="draft-hint">暂时关闭会保留本次草稿，刷新页面后清除。</p><div class="modal-error" id="modal-error" hidden></div><div class="modal-actions"><button type="button" class="btn" data-action="close">暂时关闭</button><button type="submit" class="btn primary">提交申请</button></div></form>`);
      invoiceTargets=orders.map(o=>o.id);applyInvoiceType();$('#invoice-title').value=invoiceDraft[invoiceType+'Title'];$('#invoice-tax').value=invoiceDraft.taxId;$('#invoice-email').value=invoiceDraft.email;$('#invoice-note').value=invoiceDraft.note;$('#invoice-title').focus();
    }

function saveInvoiceDraft(){
      if(!$('#invoice-form'))return;
      invoiceDraft={...invoiceDraft,type:invoiceType,[invoiceType+'Title']:$('#invoice-title').value,taxId:$('#invoice-tax').value,email:$('#invoice-email').value,note:$('#invoice-note').value};
    }

function applyInvoiceType(){
      $$('[data-invoice-type]').forEach(b=>{b.classList.toggle('selected',b.dataset.invoiceType===invoiceType);b.setAttribute('aria-pressed',String(b.dataset.invoiceType===invoiceType));});$('#tax-field').hidden=invoiceType==='personal';$('#invoice-tax').required=invoiceType==='company';$('#invoice-tax').disabled=invoiceType==='personal';$('#invoice-title').placeholder=invoiceType==='company'?'请输入完整单位名称':'请输入个人姓名';$('#invoice-title').autocomplete=invoiceType==='company'?'organization':'name';
    }

function fieldError(id,message){const input=$('#'+id),error=$('#'+id+'-error');input.setAttribute('aria-invalid',String(!!message));error.textContent=message;error.hidden=!message;}

function invoiceDetails(id){
      const o=orderById(id);if(!isInvoiceEligible(o)){toast('只有已支付的充值订单可以开票。');return;}if(!o.invoice){invoiceForm([id]);return;}const i=o.invoice,issued=i.status==='issued';
      openModal(issued?'电子发票详情':'发票申请详情',`<div class="exchange-preview">${icon('file')}<div><h3>${issued?'已开票 · 示例':'开票申请已提交'}</h3><p>申请编号 ${esc(i.id)}</p></div></div>${issued?`<div class="detail-line"><span>发票编号</span><strong class="num">${esc(i.number||'示例发票')}</strong></div><div class="detail-line"><span>开票时间</span><strong>${displayDate(i.issuedAt||i.created,true)}</strong></div>`:''}<div class="detail-line"><span>发票抬头</span><strong>${esc(i.title)}</strong></div>${i.type==='company'?`<div class="detail-line"><span>纳税人识别号</span><strong style="font-size:11px">${esc(i.taxId)}</strong></div>`:''}<div class="detail-line"><span>接收邮箱</span><strong>${esc(i.email)}</strong></div><div class="detail-line"><span>关联订单</span><strong>${i.orderIds.length} 笔充值订单</strong></div><div class="detail-line"><span>${issued?'开票金额':'申请金额'}</span><strong>${money(i.totalCents)}</strong></div><div class="detail-line"><span>提交时间</span><strong>${displayDate(i.created,true)}</strong></div>${i.note?`<div class="detail-line"><span>备注</span><strong>${esc(i.note)}</strong></div>`:''}<div class="modal-note">${icon('info')}<span>${issued?'这是已开票状态的历史示例，可用于查看发票信息；不代表真实税务发票。':'申请记录保存在当前浏览器。正式使用时连接开票服务后，由服务更新状态并发送电子发票。'}</span></div><div class="modal-actions"><button class="btn" data-action="close">关闭</button>${issued?`<button class="btn primary" data-download-invoice="${o.id}">${icon('download')}下载 PDF</button>`:''}</div>`);
    }

function amountToChineseCents(cents){
      cents=Math.max(0,Math.round(Number(cents)||0));
      const digits='零壹贰叁肆伍陆柒捌玖',units=['','拾','佰','仟'],groups=['','万','亿','万亿'];
      const section=value=>{let out='',zero=false;for(let i=3;i>=0;i--){const digit=Math.floor(value/10**i)%10;if(!digit){if(out)zero=true;}else{if(zero)out+='零';out+=digits[digit]+units[i];zero=false;}}return out;};
      const yuan=Math.floor(cents/100),jiao=Math.floor(cents%100/10),fen=cents%10;
      let text='',pendingZero=false;
      const chunks=[];for(let n=yuan;n;n=Math.floor(n/10000))chunks.push(n%10000);
      for(let i=chunks.length-1;i>=0;i--){const value=chunks[i];if(!value){pendingZero=!!text;continue;}if(text&&(pendingZero||value<1000))text+='零';text+=section(value)+groups[i];pendingZero=false;}
      text=(text||'零')+'元';
      if(jiao)text+=digits[jiao]+'角';
      if(fen){if(!jiao&&yuan)text+='零';text+=digits[fen]+'分';}
      if(!jiao&&!fen)text+='整';
      return text;
    }

async function downloadInvoice(id){
      const order=orderById(id);if(!isInvoiceEligible(order)||getInvoiceState(order)!=='issued'){toast('已开票后可下载 PDF。');return;}
      if(downloadingInvoices.has(id))return;downloadingInvoices.add(id);
      const buttons=$$('[data-download-invoice]').filter(b=>b.dataset.downloadInvoice===id);buttons.forEach(b=>b.disabled=true);
      try{
        if(!window.PDFLib)throw new Error('PDF 组件未加载，请重新打开完整的分享版页面。');
        await document.fonts.ready;
        const invoice=order.invoice,orders=invoice.orderIds.map(orderById).filter(Boolean),totalCents=Math.max(0,Math.round(invoice.totalCents));
        // Layout follows the ordinary electronic invoice sample in SAT Announcement 2024 No. 11.
        // Seller and 6% tax figures are illustrative; production must download the issued service PDF.
        const rate=.06;
        const grouped=orders.length>5||orders.reduce((sum,item)=>sum+item.invoiceCents,0)!==totalCents;
        const items=(grouped?[{invoiceCents:totalCents}]:orders).map(item=>{
          const gross=Math.round(item.invoiceCents),net=Math.round(gross/(1+rate));
          return {net,tax:gross-net};
        });
        const netTotal=items.reduce((sum,item)=>sum+item.net,0),taxTotal=totalCents-netTotal;
        const canvas=document.createElement('canvas');canvas.width=3600;canvas.height=2100;const ctx=canvas.getContext('2d');ctx.scale(2,2);
        const font='"Songti SC","STSong","SimSun","Noto Serif CJK SC","PingFang SC","Microsoft YaHei",serif';
        const red='#9d3d35',ink='#191919';
        const text=(value,x,y,size=22,color=ink,weight=400,align='left',maxWidth)=>{ctx.font=weight+' '+size+'px '+font;ctx.fillStyle=color;ctx.textAlign=align;if(maxWidth)ctx.fillText(String(value),x,y,maxWidth);else ctx.fillText(String(value),x,y);ctx.textAlign='left';};
        const line=(x1,y1,x2,y2,width=1.5)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=width;ctx.strokeStyle=red;ctx.stroke();};
        const vertical=(label,x,y,spacing=24)=>Array.from(label).forEach((ch,index)=>text(ch,x,y+index*spacing,20,red,400,'center'));
        const splitText=(value,maxWidth,size)=>{ctx.font='400 '+size+'px '+font;const lines=[];let current='';for(const char of String(value||'')){if(ctx.measureText(current+char).width>maxWidth&&current){lines.push(current);current=char;}else current+=char;}if(current)lines.push(current);return lines;};
        const wrap=(value,x,y,maxWidth,size=22,maxLines=2)=>{let lines=splitText(value,maxWidth,size);while(lines.length>maxLines&&size>14){size--;lines=splitText(value,maxWidth,size);}lines.slice(0,maxLines).forEach((row,index)=>text(row,x,y+index*(size+5),size,ink,400,'left',maxWidth));};
        const drawQr=(value,x,y,size)=>{const qr=new QRCode(-1,1);qr.addData(value);qr.make();const count=qr.getModuleCount(),cell=size/count;ctx.fillStyle=ink;for(let row=0;row<count;row++)for(let col=0;col<count;col++)if(qr.isDark(row,col))ctx.fillRect(x+col*cell,y+row*cell,cell,cell);};
        const decimal=value=>(value/100).toFixed(2),currency=value=>'¥'+decimal(value);
        ctx.fillStyle='#fff';ctx.fillRect(0,0,1800,1050);
        drawQr('DEMO-INVOICE|'+invoice.id+'|'+totalCents,65,49,124);
        text('演示二维码',127,193,15,'#777',400,'center');
        text('电子发票（普通发票）',890,107,48,red,600,'center');
        line(598,131,1182,131,2);line(598,138,1182,138,1);
        ctx.strokeStyle='#bc7268';ctx.lineWidth=1;ctx.strokeRect(225,82,91,36);text('演示样张',270.5,106,18,red,400,'center');
        text('发票号码：',1260,88,21,red);text(invoice.number||invoice.id,1390,88,21,ink,400,'left',345);
        const date=new Date(invoice.issuedAt||invoice.created),invoiceDate=date.getFullYear()+'年'+String(date.getMonth()+1).padStart(2,'0')+'月'+String(date.getDate()).padStart(2,'0')+'日';
        text('开票日期：',1260,137,21,red);text(invoiceDate,1390,137,21);
        // One enclosing frame, no spreadsheet-style row or column grid in the item section.
        const left=60,right=1740,top=210,infoBottom=365,totalTop=755,totalBottom=820,bottom=945;
        line(left,top,right,top);line(left,top,left,bottom);line(right,top,right,bottom);line(left,bottom,right,bottom);
        line(left,infoBottom,right,infoBottom);line(900,top,900,infoBottom);line(104,top,104,infoBottom);line(944,top,944,infoBottom);
        vertical('购买方信息',82,242,25);vertical('销售方信息',922,242,25);
        text('名称：',126,253,22,red);wrap(invoice.title||'个人',202,253,670,22,2);
        text('统一社会信用代码/纳税人识别号：',126,331,20,red);text(invoice.taxId||'—',470,331,21,ink,400,'left',405);
        text('名称：',966,253,22,red);text('基因云科技有限公司（演示）',1042,253,22,ink,400,'left',670);
        text('统一社会信用代码/纳税人识别号：',966,331,20,red);text('DEMOSELLER2026',1310,331,21,ink,400,'left',405);
        const columns=[80,490,640,725,850,1100,1325,1510,1720],headers=['项目名称','规格型号','单位','数 量','单 价','金 额','税率/征收率','税 额'];
        headers.forEach((label,index)=>text(label,(columns[index]+columns[index+1])/2,405,21,red,400,'center'));
        items.forEach((item,index)=>{const y=455+index*47;
          text('*信息技术服务*云平台服务费',80,y,21,ink,400,'left',395);
          text('云贝服务',565,y,20,ink,400,'center');text('项',682.5,y,21,ink,400,'center');
          text('1',831,y,21,ink,400,'right');text(decimal(item.net),1080,y,21,ink,400,'right');text(decimal(item.net),1305,y,21,ink,400,'right');
          text('6%',1417.5,y,21,ink,400,'center');text(decimal(item.tax),1715,y,21,ink,400,'right');
        });
        text('合    计',285,728,22,red,400,'center');text(currency(netTotal),1305,728,23,ink,400,'right');text(currency(taxTotal),1715,728,23,ink,400,'right');
        line(left,totalTop,right,totalTop);line(left,totalBottom,right,totalBottom);line(454,totalTop,454,totalBottom);
        text('价税合计（大写）',257,796,22,red,400,'center');text('⊗ '+amountToChineseCents(totalCents),480,796,25,ink,400,'left',825);
        text('（小写）',1355,796,22,red);text(currency(totalCents),1710,796,25,ink,400,'right');
        line(104,totalBottom,104,bottom);vertical('备注',82,866,31);
        const note=(invoice.note?invoice.note+'；':'')+'演示样张，销售方与 6% 税率均为演示数据，不作为报销或税务凭证。';
        wrap(note,126,859,1580,20,2);
        const related='关联充值订单：'+orders.map(item=>item.id).join('、');wrap(related,126,912,1580,18,1);
        text('开票人：',126,992,22,red);text('演示开票员',232,992,22);
        ctx.save();ctx.translate(910,586);ctx.rotate(-.25);ctx.globalAlpha=.055;text('演示样张',0,0,146,red,600,'center');ctx.restore();
        const pdf=await PDFLib.PDFDocument.create();pdf.setTitle('电子发票（普通发票）演示样张');pdf.setSubject('仅供云贝充值开票流程演示');pdf.setProducer('云贝中心');
        const image=await pdf.embedPng(canvas.toDataURL('image/png'));const page=pdf.addPage([680.315,396.85]);page.drawImage(image,{x:0,y:0,width:680.315,height:396.85});
        const bytes=await pdf.save();const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download='电子发票(普通发票)示例-'+(invoice.number||invoice.id)+'.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('电子发票示例 PDF 已生成。');
      }catch(error){toast(error.message||'下载失败，请重试。');}
      finally{downloadingInvoices.delete(id);buttons.forEach(b=>{if(b.isConnected)b.disabled=false;});}
    }

function submitInvoice(event){
      event.preventDefault();const title=$('#invoice-title').value.trim(),taxId=$('#invoice-tax').value.trim().toUpperCase(),email=$('#invoice-email').value.trim(),note=$('#invoice-note').value.trim();$('#invoice-email').value=email;
      fieldError('invoice-title',title?'':'请填写'+(invoiceType==='company'?'完整单位名称。':'个人姓名。'));
      fieldError('invoice-tax',invoiceType==='company'&&!/^[A-Z0-9]{15,20}$/.test(taxId)?'请填写 15–20 位字母或数字组成的纳税人识别号。':'');
      fieldError('invoice-email',!email?'请填写接收邮箱。':!$('#invoice-email').validity.valid?'邮箱格式有误，例如 research@example.com。':'');
      const invalid=$('[aria-invalid="true"]',$('#invoice-form'));if(invalid){invalid.focus();return;}
      const orders=invoiceTargets.map(orderById);if(!orders.length||orders.some(o=>!isInvoiceEligible(o)||getInvoiceState(o)!=='available')){showError('订单状态已变化，请关闭弹窗后重新选择。');return;}
      const invoice={id:`FP${Date.now()}`,type:invoiceType,title,taxId:invoiceType==='company'?taxId:'',email,note,status:'pending',created:nowIso(),orderIds:orders.map(o=>o.id),totalCents:orders.reduce((s,o)=>s+o.invoiceCents,0)};
      orders.forEach(o=>o.invoice={...invoice});selectedInvoices.clear();persist();renderAll();saveInvoiceDraft();closeModal();invoiceDraft={type:invoiceType,companyTitle:'',personalTitle:'',taxId:'',email:'',note:''};setTab('invoices');invoiceDetails(orders[0].id);toast('申请已提交，详情可随时查看。');
    }

function earn(rewardJustClaimed=0){
      const week=checkinWeek(),labels=['第1次','第2次','第3次','第4次','第5次','第6次','第7次'];
      const claimMessage=rewardJustClaimed?`<div class="checkin-success" role="status">${icon('check-circle')}<span>签到成功，<strong>+${rewardJustClaimed} 云贝</strong>已到账，已计入本周累计。</span></div>`:'';
      const period=week.start.slice(5).replace('-','.')+' — '+week.end.slice(5).replace('-','.');
      openModal('签到得云贝',`<div class="checkin-intro"><p>每天签到，积累更多科研权益。</p></div>${claimMessage}<div class="checkin-summary"><div class="checkin-stat reward"><span>本周累计获得</span><strong class="num" id="weekly-earned">${week.earned}<small>/ ${week.total} 云贝</small></strong></div><div class="checkin-stat"><span>本周已签到</span><strong class="num" id="weekly-days">${week.count}<small>/ 7 天</small></strong></div><div class="checkin-stat"><span>我的可用云贝</span><strong class="num" id="weekly-balance">${fmt(state.balance)}<small>云贝</small></strong></div></div><p class="checkin-next">${week.count>=7?'本周奖励已领完，<b>下周一重新累计</b>。':week.checkedIn?(today()===week.end?'本周今日已领取，<b>下周一从第 1 次开始</b>。':'下次签到可领 <b>+'+week.nextReward+' 云贝</b>，本周还有 '+Math.round((Date.parse(week.end)-Date.parse(today()))/86400000)+' 天可签到。'):'今天可领 <b>+'+week.nextReward+' 云贝</b>，按本周累计次数发放。'}</p><div class="checkin-track-head"><strong>一周签到奖励</strong><span>第 3、5、7 次奖励更多</span></div><div class="checkin-days" aria-label="七天累计签到奖励">${CHECKIN_REWARDS.map((reward,index)=>{const done=index<week.count,current=index===week.count&&!week.checkedIn;return `<div class="checkin-day ${done?'done':current?'current':''} ${[2,4,6].includes(index)?'milestone':''}" aria-label="${labels[index]}奖励 ${week.days[index]?.reward||reward} 云贝，${done?'已领取':current?'今日可领':'待解锁'}"><strong class="day-amount num">+${week.days[index]?.reward||reward}</strong><div class="day-coin">${icon(done?'check':'coin')}</div><span class="day-label">${labels[index]}</span><span class="day-state">${done?'已领取':current?'今日可领':'待解锁'}</span></div>`;}).join('')}</div><div class="checkin-bottom"><button class="btn primary" id="checkin" ${week.checkedIn||week.count>=7?'disabled':''}>${week.count>=7?'本周已全部领取':week.checkedIn?(today()===week.end?'今日已签到，下周再来':'今日已签到，明天再来'):'今日签到 · +'+week.nextReward+' 云贝'}</button></div><div class="checkin-rules">${icon('info')}<div><b>累计规则：</b>按北京时间周一至周日累计签到次数，每天限领一次；漏签不清零，周一重新累计；已获云贝保留。奖励对应签到次数，最多 70 云贝，剩余天数不足时无法领满 7 次。签到云贝可兑换高级图表、存储等权益。${week.days.some(c=>c.legacy)?'<br>原版本的签到奖励按实际入账值保留，不影响已有余额。':''}</div></div>`);
      $('#modal').classList.add('checkin-modal');
    }

function exportCsv(filename, rows){
      const safe=value=>{let v=String(value??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';};
      const csv='\ufeff'+rows.map(row=>row.map(safe).join(',')).join('\r\n');const a=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('记录已导出。');
    }

function showRights(){
      const active=state.orders.filter(isActive),storage=20+active.filter(o=>o.productId==='storage').length*50;
      openModal('我的权益',`<p class="modal-intro">查看当前有效的容量、时长与已兑换额度。</p><div class="exchange-preview">${icon('storage')}<div><h3>云存储 · ${storage} GB</h3><p>含基础 20 GB，扩容容量独立叠加。</p><p class="outcome">${active.filter(o=>o.productId==='storage').map(o=>'50 GB 至 '+displayDate(o.expires)).join('；')||'暂无扩容包'}</p></div></div>${catalog.filter(p=>p.id!=='storage'&&active.some(o=>o.productId===p.id)).map(p=>{const orders=active.filter(o=>o.productId===p.id);return `<div class="exchange-preview">${icon(p.icon)}<div><h3>${esc(p.name)}</h3>${p.kind==='generic'?`<p>已兑换 ${orders.length} ${esc(p.unit)}</p>`:`<p>${p.kind==='duration'?esc(p.unit):orders.length+' 份 · 每份 '+esc(p.unit)}</p><p class="outcome">有效期最晚至 ${displayDate(Math.max(...orders.map(o=>Date.parse(o.expires))))}</p>`}${p.kind==='credits'?'<p>额度按各笔订单独立计期；使用明细需连接服务后查询。</p>':''}</div></div>`;}).join('')}<p class="info-line">空间使用量为示例数据，权益扣减可在云贝明细中逐笔核对。</p><div class="modal-actions"><button class="btn" data-action="close">关闭</button></div>`);
    }
