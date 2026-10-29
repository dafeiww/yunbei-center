const downloadingInvoices=new Set();

function toast(message) { clearTimeout(toastTimer); $('#toast-text').textContent=message; $('#toast').hidden=false; toastTimer=setTimeout(()=>$('#toast').hidden=true,3600); }

function visual(id) {
      const bg = {charts:'#eef3ea',storage:'#edf2f5',ai:'#f0edf5',export:'#f6f0e6',compute:'#eaf2ed',team:'#f5eeea'}[id];
      let art='';
      if(id==='charts') art=`<g transform="translate(62 18)"><rect x="0" y="9" width="142" height="93" rx="6" fill="#fff" stroke="#dbe4d4"/><path d="M15 31h112M15 51h112M15 71h112" stroke="#edf1e8"/><path d="M15 19v65h113" stroke="#dae3d2" fill="none"/><rect x="25" y="58" width="13" height="25" rx="2" fill="#c9d7b5"/><rect x="48" y="45" width="13" height="38" rx="2" fill="#aabf8f"/><rect x="71" y="30" width="13" height="53" rx="2" fill="#7e9f6c"/><rect x="94" y="41" width="13" height="42" rx="2" fill="#a6bd90"/><path d="m26 46 30-14 25 4 25-20" stroke="#c7aa6f" fill="none" stroke-width="1.8"/><circle cx="56" cy="32" r="2.4" fill="#c7aa6f"/><circle cx="81" cy="36" r="2.4" fill="#c7aa6f"/></g><g transform="translate(190 39)"><rect width="64" height="66" rx="6" fill="#fff" stroke="#e1e8d9"/><circle cx="32" cy="30" r="19" fill="none" stroke="#e8eee0" stroke-width="9"/><circle cx="32" cy="30" r="19" fill="none" stroke="#83a375" stroke-width="9" stroke-dasharray="73 120" transform="rotate(-90 32 30)"/><circle cx="32" cy="30" r="19" fill="none" stroke="#cbb47d" stroke-width="9" stroke-dasharray="22 120" stroke-dashoffset="-76" transform="rotate(-90 32 30)"/><rect x="19" y="57" width="26" height="2" rx="1" fill="#dbe4d3"/></g>`;
      if(id==='storage') art=`<ellipse cx="163" cy="104" rx="68" ry="8" fill="#dce5e9"/><g transform="translate(97 20)"><path d="m0 32 62 22 65-23-64-22-63 23Z" fill="#e3ebee" stroke="#c3d2d9"/><path d="M0 32v19l62 23V54L0 32Z" fill="#c2d2da"/><path d="m62 54 65-23v20L62 74V54Z" fill="#93b0bc"/><path d="M0 56v18l62 23V78L0 56Z" fill="#d1dee4"/><path d="m62 78 65-23v19L62 97V78Z" fill="#a7c0cb"/><path d="m0 56 13-5 49 18 52-18 13 4-65 23L0 56Z" fill="#edf3f5"/><path d="M15 49v5m8-2v5m-8 17v5m8-2v5" stroke="#f2f6f8" stroke-width="2"/><circle cx="110" cy="47" r="2" fill="#e4eff0"/><circle cx="110" cy="70" r="2" fill="#e4eff0"/></g><g transform="translate(156 15)"><path d="M0 21c-5-9 2-18 11-17 5-14 27-13 32 0 19-1 21 25 2 26H4c-7 0-10-6-4-9Z" fill="#fff" stroke="#c8d8df"/><path d="M21 9v13m-5-5 5 5 5-5" fill="none" stroke="#90afbb" stroke-width="1.7"/></g>`;
      if(id==='ai') art=`<g transform="translate(88 18)"><rect width="117" height="94" rx="6" fill="#fff" stroke="#ded8e9"/><rect x="13" y="13" width="42" height="3" rx="1.5" fill="#c4b4d7"/><rect x="13" y="23" width="77" height="2" rx="1" fill="#e9e3ef"/><path d="M14 72h86M14 40h86M14 56h86" stroke="#f0ecf4"/><path d="m16 68 16-10 14 4 16-19 17 6 18-18" fill="none" stroke="#aa93c3" stroke-width="2"/><path d="m16 68 16-10 14 4 16-19 17 6 18-18v47H16Z" fill="#c4b1d5" opacity=".14"/><rect x="14" y="84" width="64" height="2" rx="1" fill="#e6dfed"/></g><g transform="translate(184 51)"><rect width="62" height="50" rx="9" fill="#f8f5fb" stroke="#d9cfe4"/><path d="m31 10 4.5 11.5L47 26l-11.5 4.5L31 42l-4.5-11.5L15 26l11.5-4.5L31 10Z" fill="#b09ac6"/><path d="M49 6v8M45 10h8" stroke="#c0add2" stroke-width="1.3"/></g><path d="m78 56-10 3m15 23-8 5" stroke="#d2c7df" stroke-width="1.5"/>`;
      if(id==='export') art=`<g transform="translate(94 19) rotate(-7 47 44)"><rect width="96" height="89" rx="5" fill="#f5ecdb" stroke="#e5d5ba"/></g><g transform="translate(110 15)"><rect width="100" height="95" rx="5" fill="#fffdfa" stroke="#e6d9c2"/><path d="M13 66h72M13 25v41" stroke="#e9decd" fill="none"/><path d="m17 52 15-10 16 6 16-19 18 5" stroke="#bda370" stroke-width="1.8" fill="none"/><rect x="15" y="78" width="39" height="3" rx="1.5" fill="#d8c8ac"/><rect x="15" y="85" width="57" height="2" rx="1" fill="#ece3d4"/></g><g transform="translate(189 71)"><rect width="53" height="27" rx="5" fill="#e9d8b5" stroke="#dbc398"/><text x="26.5" y="18" text-anchor="middle" fill="#a38751" font-size="11" font-family="system-ui,sans-serif" font-weight="600">HD</text></g><path d="M235 32v16m-6-6 6 6 6-6M228 53h14" fill="none" stroke="#bfa97f" stroke-width="1.5"/>`;
      if(id==='compute') art=`<g transform="translate(118 24)"><path d="M6 8h69v68H6Z" fill="#d4e4d7" stroke="#a6c2ad"/><rect x="15" y="17" width="51" height="50" rx="5" fill="#eef5ec" stroke="#b5cdb9"/><path d="M2 19h-9m9 13h-9m9 13h-9m9 13h-9M80 19h9m-9 13h9m-9 13h9m-9 13h9M18 3v-9m14 9v-9m14 9v-9m14 9v-9M18 81v9m14-9v9m14-9v9m14-9v9" stroke="#b2cab7" stroke-width="3"/><path d="m44 25-20 24h15l-2 15 20-27H43l1-12Z" fill="#84a78d"/></g><circle cx="221" cy="83" r="18" fill="#f8fbf6" stroke="#d1e2d0"/><path d="M221 72v11l7 4" stroke="#9ab69b" stroke-width="1.5" fill="none"/><path d="M83 50h14m-10 8h10m-7 8h7" stroke="#bed1be" stroke-width="2" stroke-linecap="round"/>`;
      if(id==='team') art=`<g transform="translate(105 22)"><rect x="0" y="0" width="114" height="83" rx="6" fill="#fffcf9" stroke="#e5d8cc"/><path d="M0 18h114" stroke="#eee5da"/><circle cx="10" cy="9" r="2" fill="#d9b9a3"/><circle cx="18" cy="9" r="2" fill="#d9c6ae"/><circle cx="26" cy="9" r="2" fill="#c5c8ad"/><rect x="12" y="29" width="22" height="38" rx="3" fill="#edddce"/><rect x="40" y="29" width="61" height="3" rx="1.5" fill="#dfc8b8"/><rect x="40" y="40" width="44" height="3" rx="1.5" fill="#eadbce"/><rect x="40" y="51" width="50" height="3" rx="1.5" fill="#eadbce"/><rect x="40" y="62" width="36" height="3" rx="1.5" fill="#eadbce"/></g><g transform="translate(89 75)"><circle cx="0" cy="0" r="18" fill="#f9f2e9" stroke="#e7dac8"/><circle cx="0" cy="-4" r="5" fill="#c4a18a"/><path d="M-9 10a9 9 0 0 1 18 0" fill="#c4a18a"/></g><g transform="translate(227 72)"><circle cx="0" cy="0" r="17" fill="#eef2e8" stroke="#d7dfca"/><circle cx="0" cy="-4" r="5" fill="#a8b794"/><path d="M-9 10a9 9 0 0 1 18 0" fill="#a8b794"/></g>`;
      return `<svg viewBox="0 0 320 128" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="320" height="128" fill="${bg}"/>${art}</svg>`;
    }

function renderProducts() {
      let items=catalog.filter(p=>(category==='全部权益'||p.category===category)&&(p.name+p.desc+p.category).toLowerCase().includes($('#product-search').value.trim().toLowerCase()));
      if(sortMode) items=[...items].sort((a,b)=>sortMode===1?a.price-b.price:b.price-a.price);
      $('#sort-select').value=String(sortMode);
      $('#product-count').textContent=category==='全部权益'&&!$('#product-search').value?'为你的绘图与分析提效':`共 ${items.length} 项可兑权益`;
      $('#products').innerHTML=items.map(p=>`<article class="product-card"><div class="product-art" style="--art-bg:${{charts:'#eef3ea',storage:'#edf2f5',ai:'#f0edf5',export:'#f6f0e6',compute:'#eaf2ed',team:'#f5eeea'}[p.id]};--art-color:${{charts:'#668451',storage:'#628492',ai:'#9377ad',export:'#a58850',compute:'#61866c',team:'#9f7b63'}[p.id]}"><div class="mobile-art">${icon(p.icon)}</div><span class="product-badge ${p.id==='charts'?'gold':''}">${p.badge}</span>${visual(p.id)}</div><div class="product-body"><h3>${p.name}${p.id==='ai'?'<small>AI</small>':''}</h3><p class="product-desc">${p.desc}</p><div class="product-meta">${icon('clock')}<span>${p.duration}</span><i></i><span>${p.unit}</span></div><div class="product-footer"><div class="price"><strong class="num">${fmt(p.price)}</strong><span>云贝</span></div><button class="exchange-btn ${state.balance<p.price?'needs-more':''}" data-exchange="${p.id}" aria-label="${p.name}，${state.balance<p.price?'还差 '+fmt(p.price-state.balance)+' 云贝，查看获取方式':'兑换需 '+fmt(p.price)+' 云贝'}">${state.balance<p.price?'还差 '+fmt(p.price-state.balance):'立即兑换'}</button></div></div></article>`).join('')||`<div class="no-results">${icon('search')}<div>暂未找到相关权益</div><p>换个关键词试试，或查看全部权益。</p><button class="table-action" data-action="clear-search">查看全部</button></div>`;
    }

function currentOrders() { const q=$('#order-search').value.trim().toLowerCase(); return exchangeOrders().filter(o=>(orderStatus==='all'||(orderStatus==='active')===isActive(o))&&(o.name+o.id).toLowerCase().includes(q)); }

function renderOrders() {
      const all=exchangeOrders(),items=currentOrders(),pages=Math.max(1,Math.ceil(items.length/ORDER_PAGE_SIZE));
      orderPage=Math.max(1,Math.min(orderPage,pages));
      $('#all-order-count').textContent=all.length;$('#active-order-count').textContent=all.filter(isActive).length;$('#expired-order-count').textContent=all.filter(o=>!isActive(o)).length;
      $$('[data-order-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.orderStatus===orderStatus)));
      $('#orders-total').textContent=items.length?`共 ${items.length} 条兑换记录 · 第 ${(orderPage-1)*ORDER_PAGE_SIZE+1}–${Math.min(orderPage*ORDER_PAGE_SIZE,items.length)} 条`:'暂无记录';
      $('#order-rows').innerHTML=items.slice((orderPage-1)*ORDER_PAGE_SIZE,orderPage*ORDER_PAGE_SIZE).map(o=>`<tr><td class="record-title"><div class="order-cell"><div class="order-mini">${icon(productsById[o.productId]?.icon||'gift')}</div><div><div class="order-name">${esc(o.name)}</div><div class="order-id">${esc(o.id)}</div></div></div></td><td data-label="消耗云贝" class="num" style="color:#5b7588;font-size:15px">${fmt(o.price)}</td><td data-label="兑换时间">${displayDate(o.created,true)}<span class="subtext">${o.productId==='charts'||o.productId==='team'?'有效期至':'本包到期'} ${displayDate(o.expires)}</span></td><td data-label="权益状态"><span class="tag ${isActive(o)?'':'pending'}">${isActive(o)?'生效中':'已到期'}</span></td><td class="record-actions"><button class="table-action" data-order-detail="${o.id}">查看详情</button></td></tr>`).join('')||`<tr><td colspan="5" style="text-align:center;padding:48px">暂无符合条件的兑换记录<button class="table-action" style="display:block;margin:8px auto 0" data-action="reset-orders">清除筛选</button></td></tr>`;
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
      $('#balance').textContent=fmt(state.balance);$('#earned').textContent=fmt(state.earned);$('#spent').textContent=fmt(state.spent);$('#order-count').textContent=exchangeOrders().length;
      $('#wallet-paid').textContent=fmt(state.wallet.paid);$('#wallet-reward').textContent=fmt(state.wallet.reward);const week=checkinWeek(),checkedIn=week.checkedIn;$('#wallet-checkin').disabled=false;$('#wallet-checkin').classList.toggle('is-signed',checkedIn);$('#wallet-checkin-label').textContent=checkedIn?'已签到 · 查看进度':'签到领云贝';$('#wallet-checkin-bonus').hidden=checkedIn;$('#wallet-checkin-bonus').textContent='+'+week.nextReward;$('#wallet-checkin').setAttribute('aria-label',checkedIn?'今日已签到，查看本周累计':'每日签到领取 '+week.nextReward+' 云贝');$('#wallet-checkin use').setAttribute('href',checkedIn?'#i-check-circle':'#i-gift');$('#wallet-checkin-hint').textContent='本周 '+week.count+'/7 天 · 已获 '+week.earned+' 云贝';
      $('#ledger-balance').textContent=fmt(state.balance);$('#ledger-earned').textContent=fmt(state.earned);$('#ledger-spent').textContent=fmt(state.spent);
      const storage=20+state.orders.filter(o=>isActive(o)&&o.productId==='storage').length*50;
      const percent=(12.4/storage*100).toFixed(1);$('#storage-total').textContent=storage;$('#storage-progress').style.width=`${percent}%`;$('#storage-note').textContent=`已使用 ${percent}%，还有 ${(storage-12.4).toFixed(1)} GB 可用`;
      const charts=state.orders.filter(o=>o.productId==='charts'&&isActive(o)).sort((a,b)=>new Date(b.expires)-new Date(a.expires));$('#chart-expiry').textContent=charts.length?`有效期至 ${displayDate(charts[0].expires)}`:'兑换通行证，解锁更多图表';$('.rights-bottom .tag').textContent=charts.length?'已生效':'未开通';$('.rights-bottom .tag').classList.toggle('neutral',!charts.length);
    }

function openModal(title,html){
      saveInvoiceDraft();
      if($('#overlay').hidden)previousFocus=document.activeElement;
      $('#modal').classList.remove('checkin-modal','usage-detail-modal');$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;$('#overlay').hidden=false;document.body.classList.add('modal-body-open');$('.main').inert=true;$('.sidebar').inert=true;$('.topbar').inert=true;$('#modal').scrollTop=0;$('#modal').focus();
    }

function closeModal(){
      saveInvoiceDraft();$('#overlay').hidden=true;$('#modal').classList.remove('checkin-modal','usage-detail-modal');$('#modal-content').innerHTML='';document.body.classList.remove('modal-body-open');$('.main').inert=false;$('.sidebar').inert=false;$('.topbar').inert=false;activeExchange=null;invoiceTargets=[];pendingRecharge=null;
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
        else outcome=`本次新增 <b>${p.unit}</b>，有效期至 ${displayDate(addDays(nowIso(),p.days))}；多次兑换的额度独立计期`;
        return `<div class="exchange-preview">${icon(p.icon)}<div><h3>${p.name}</h3><p>${p.duration} · ${p.unit} · ${fmt(p.price)} 云贝</p><p class="scope">${p.desc}</p><p class="outcome">${outcome}</p></div></div>`;
      }).join('');
      openModal('确认兑换',`<p class="modal-intro">确认权益、有效期和所需云贝后再兑换。${items.length>1?'组合按单品合计支付。':''}</p>${previews}<div class="detail-line"><span>当前可用</span><strong class="num">${fmt(state.balance)} 云贝</strong></div><div class="detail-line"><span>兑换后余额</span><strong class="num">${insufficient?'—':fmt(state.balance-total)+' 云贝'}</strong></div><div class="detail-line total"><span>本次支付</span><strong class="price num">${fmt(total)} <small style="font-size:12px;font-weight:400">云贝</small></strong></div>${insufficient?`<div class="modal-note">${icon('info')}<span class="shortfall">还差 ${fmt(total-state.balance)} 云贝。可通过充值、签到或邀请好友注册获得云贝。</span></div>`:`<div class="modal-note">${icon('info')}<span>确认后扣减云贝，权益与订单同步到账。${items.some(p=>p.kind==='storage')?'扩容包到期后总容量会减少，请提前续期或整理空间。':'时长权益重复兑换将顺延有效期。'}优先扣减奖励云贝，再扣减充值云贝；只有充值订单可开票。</span></div>`}<div class="modal-error" id="modal-error" hidden></div><div class="modal-actions"><button class="btn" data-action="close">${insufficient?'暂不兑换':'取消'}</button>${insufficient?'<button class="btn primary" data-action="recharge">去充值云贝</button>':'<button class="btn primary" id="confirm-exchange">确认兑换</button>'}</div>`);
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

async function downloadInvoice(id){
      const order=orderById(id);if(!isInvoiceEligible(order)||getInvoiceState(order)!=='issued'){toast('已开票后可下载 PDF。');return;}
      if(downloadingInvoices.has(id))return;downloadingInvoices.add(id);
      const buttons=$$('[data-download-invoice]').filter(b=>b.dataset.downloadInvoice===id);buttons.forEach(b=>b.disabled=true);
      try{
        if(!window.PDFLib)throw new Error('PDF 组件加载失败，请保持 assets 文件夹与页面在同一目录。');
        await document.fonts.ready;
        const invoice=order.invoice,orders=invoice.orderIds.map(orderById).filter(Boolean);
        const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=2546;const ctx=canvas.getContext('2d');
        const font='"PingFang SC","Microsoft YaHei",Arial,sans-serif';
        const text=(value,x,y,size=30,color='#344d5c',weight=400)=>{ctx.font=weight+' '+size+'px '+font;ctx.fillStyle=color;ctx.fillText(String(value),x,y);};
        const wrap=(value,x,y,maxWidth,size=29,color='#344d5c')=>{ctx.font='400 '+size+'px '+font;let line='',row=0;for(const char of String(value)){if(ctx.measureText(line+char).width>maxWidth&&line){text(line,x,y+row*44,size,color);line='';row++;}line+=char;}text(line,x,y+row*44,size,color);return (row+1)*44;};
        ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1800,2546);
        const gradient=ctx.createLinearGradient(0,0,1800,0);gradient.addColorStop(0,'#ffe8c6');gradient.addColorStop(1,'#f4b584');ctx.fillStyle=gradient;ctx.fillRect(0,0,1800,22);
        text('云图汇  /  云贝中心',110,122,32,'#597580',600);
        text('电子发票（示例）',110,235,62,'#293d4c',600);
        text('充值订单 · 实付金额开票',114,298,29,'#6d808d');
        text('已开票',1500,236,33,'#287b58',600);
        ctx.save();ctx.translate(900,1510);ctx.rotate(-.4);ctx.globalAlpha=.045;text('示例文件',-520,0,230,'#8f541d',600);ctx.restore();
        let y=415;
        const field=(label,value)=>{text(label,114,y,28,'#718491');const height=wrap(value||'—',430,y,1240,29);y+=Math.max(68,height+20);};
        field('发票编号',invoice.number||invoice.id);field('申请编号',invoice.id);field('开票时间',displayDate(invoice.issuedAt||invoice.created,true));
        y+=24;ctx.fillStyle='#e6edf1';ctx.fillRect(112,y-48,1576,2);
        field('发票抬头',invoice.title);field('抬头类型',invoice.type==='company'?'企业 / 单位':'个人');if(invoice.type==='company')field('纳税人识别号',invoice.taxId);field('接收邮箱',invoice.email);
        y+=35;const tableY=y;ctx.fillStyle='#f2f6f8';ctx.fillRect(112,tableY-44,1576,80);text('充值订单',140,tableY+6,28,'#5f7686',600);text('充值云贝',1170,tableY+6,28,'#5f7686',600);text('金额（元）',1465,tableY+6,28,'#5f7686',600);y+=94;
        for(const item of orders){const height=wrap(item.name,140,y,950,29);text(fmt(item.principal),1190,y,29);text(money(item.invoiceCents),1470,y,29);text(item.id,140,y+height,23,'#7b8d99');y+=height+65;ctx.fillStyle='#e9eff3';ctx.fillRect(112,y-26,1576,1);}
        y+=35;text('合计金额',1170,y,29,'#6a7f8c');text(money(invoice.totalCents),1460,y,44,'#99501f',600);y+=85;
        text('按充值实付金额开票；优惠减免和赠送云贝不计入金额。',114,y,27,'#6a7f8c');
        if(invoice.note){y+=66;wrap('备注：'+invoice.note,114,y,1530,27,'#6a7f8c');}
        ctx.fillStyle='#fff3e3';ctx.fillRect(112,2260,1576,112);text('产品演示文件，不作为报销或税务凭证。',146,2329,29,'#9b622c');
        text('云图汇 · 云贝充值记录',114,2450,24,'#7c909c');text('1 / 1',1590,2450,24,'#7c909c');
        const pdf=await PDFLib.PDFDocument.create();pdf.setTitle('云贝电子发票（示例）');pdf.setSubject('示例开票记录');pdf.setProducer('云贝中心');
        const image=await pdf.embedJpg(canvas.toDataURL('image/jpeg',.96));const page=pdf.addPage([595.28,841.89]);page.drawImage(image,{x:0,y:0,width:595.28,height:841.89});
        const bytes=await pdf.save();const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download='电子发票示例-'+(invoice.number||invoice.id)+'.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('PDF 示例已生成，可在下载中查看。');
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
      openModal('签到得云贝',`<div class="checkin-intro"><p>每天签到，积累更多科研权益。</p><span class="checkin-period">本周 ${period}</span></div>${claimMessage}<div class="checkin-summary"><div class="checkin-stat reward"><span>本周累计获得</span><strong class="num" id="weekly-earned">${week.earned}<small>/ ${week.total} 云贝</small></strong></div><div class="checkin-stat"><span>本周已签到</span><strong class="num" id="weekly-days">${week.count}<small>/ 7 天</small></strong></div><div class="checkin-stat"><span>我的可用云贝</span><strong class="num" id="weekly-balance">${fmt(state.balance)}<small>云贝</small></strong></div></div><p class="checkin-next">${week.count>=7?'本周奖励已领完，<b>下周一重新累计</b>。':week.checkedIn?(today()===week.end?'本周今日已领取，<b>下周一从第 1 次开始</b>。':'下次签到可领 <b>+'+week.nextReward+' 云贝</b>，本周还有 '+Math.round((Date.parse(week.end)-Date.parse(today()))/86400000)+' 天可签到。'):'今天可领 <b>+'+week.nextReward+' 云贝</b>，按本周累计次数发放。'}</p><div class="checkin-track-head"><strong>一周签到奖励</strong><span>第 3、5、7 次奖励更多</span></div><div class="checkin-days" aria-label="七天累计签到奖励">${CHECKIN_REWARDS.map((reward,index)=>{const done=index<week.count,current=index===week.count&&!week.checkedIn;return `<div class="checkin-day ${done?'done':current?'current':''} ${[2,4,6].includes(index)?'milestone':''}" aria-label="${labels[index]}奖励 ${week.days[index]?.reward||reward} 云贝，${done?'已领取':current?'今日可领':'待解锁'}"><strong class="day-amount num">+${week.days[index]?.reward||reward}</strong><div class="day-coin">${icon(done?'check':'coin')}</div><span class="day-label">${labels[index]}</span><span class="day-state">${done?'已领取':current?'今日可领':'待解锁'}</span></div>`;}).join('')}</div><div class="checkin-bottom"><div class="checkin-progress"><div class="checkin-progress-label"><span>本周累计进度</span><strong>${week.count} / 7 天</strong></div><div class="progress"><div style="width:${week.count/7*100}%"></div></div></div><button class="btn primary" id="checkin" ${week.checkedIn||week.count>=7?'disabled':''}>${week.count>=7?'本周已全部领取':week.checkedIn?(today()===week.end?'今日已签到，下周再来':'今日已签到，明天再来'):'今日签到 · +'+week.nextReward+' 云贝'}</button></div><div class="checkin-rules">${icon('info')}<div><b>累计规则：</b>按北京时间周一至周日累计签到次数，每天限领一次；漏签不清零，周一重新累计；已获云贝保留。奖励对应签到次数，最多 70 云贝，剩余天数不足时无法领满 7 次。签到云贝可兑换高级图表、存储等权益。${week.days.some(c=>c.legacy)?'<br>原版本的签到奖励按实际入账值保留，不影响已有余额。':''}</div></div>`);
      $('#modal').classList.add('checkin-modal');
    }

function exportCsv(filename, rows){
      const safe=value=>{let v=String(value??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';};
      const csv='\ufeff'+rows.map(row=>row.map(safe).join(',')).join('\r\n');const a=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('记录已导出。');
    }

function showRights(){
      const active=state.orders.filter(isActive),storage=20+active.filter(o=>o.productId==='storage').length*50;
      openModal('我的权益',`<p class="modal-intro">查看当前有效的容量、时长与已兑换额度。</p><div class="exchange-preview">${icon('storage')}<div><h3>云存储 · ${storage} GB</h3><p>含基础 20 GB，扩容容量独立叠加。</p><p class="outcome">${active.filter(o=>o.productId==='storage').map(o=>'50 GB 至 '+displayDate(o.expires)).join('；')||'暂无扩容包'}</p></div></div>${catalog.filter(p=>p.id!=='storage'&&active.some(o=>o.productId===p.id)).map(p=>{const orders=active.filter(o=>o.productId===p.id);return `<div class="exchange-preview">${icon(p.icon)}<div><h3>${p.name}</h3><p>${p.kind==='duration'?p.unit:orders.length+' 份 · 每份 '+p.unit}</p><p class="outcome">有效期最晚至 ${displayDate(Math.max(...orders.map(o=>Date.parse(o.expires))))}</p>${p.kind==='credits'?'<p>额度按各笔订单独立计期；使用明细需连接服务后查询。</p>':''}</div></div>`;}).join('')}<p class="info-line">空间使用量为示例数据，权益可在兑换记录中逐笔核对。</p><div class="modal-actions"><button class="btn" data-action="close">关闭</button><button class="btn primary" data-action="view-orders">查看兑换记录</button></div>`);
    }
