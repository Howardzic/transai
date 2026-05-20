/* =============================================
   TRANSAI — Admin Dashboard JavaScript
   Login, Toggle, Fund Management, VIP System
   ============================================= */

const PUBLIC_FUNDS = [
  { id: 'alpha',  risk: 'high',   annualReturn: 130, strategy: 'ETH/USDT 100x', cap: 500000,  raised: 287500, minInvest: 5000, lockDays: 30, investors: 34, type: 'public' },
  { id: 'beta',   risk: 'medium', annualReturn: 72,  strategy: 'ETH/USDT 50x',  cap: 300000,  raised: 198000, minInvest: 1000, lockDays: 14, investors: 28, type: 'public' },
  { id: 'stable', risk: 'low',    annualReturn: 28,  strategy: 'ETH/USDT 10x',  cap: 1000000, raised: 423000, minInvest: 100,  lockDays: 0,  investors: 87, type: 'public' },
];

function getAiToggle() { return localStorage.getItem('transai_ai_toggle') === 'true'; }
function setAiToggle(val) { localStorage.setItem('transai_ai_toggle', val ? 'true' : 'false'); }
function getVipFunds() { try { return JSON.parse(localStorage.getItem('transai_vip_funds') || '[]'); } catch { return []; } }
function saveVipFunds(arr) { localStorage.setItem('transai_vip_funds', JSON.stringify(arr)); }

function genToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let t = '';
  for (let i = 0; i < 6; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

function fmtUSD(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 }); }

function showToast(msg, type = '') {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

function getVipLink(token) {
  return `${location.origin}${location.pathname.replace('admin.html', '')}vip.html?token=${token}`;
}

function setQrImg(imgEl, url) {
  imgEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=152747&bgcolor=FFFFFF&margin=12&data=${encodeURIComponent(url)}`;
}

function riskLabel(risk) {
  return _t('risk_' + risk + '_label');
}

/* ==============================
   LOGIN
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('transai_admin') === 'yes') showAdminPanel();

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  function doLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const errEl = document.getElementById('login-error');
    if (user === 'admin' && pass === 'admin') {
      errEl.classList.remove('show');
      sessionStorage.setItem('transai_admin', 'yes');
      showAdminPanel();
    } else {
      errEl.classList.add('show');
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
    }
  }

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('transai_admin');
    location.reload();
  });

  function showAdminPanel() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('admin-panel').style.display = '';
    initAdmin();
  }
});

/* ==============================
   INIT ADMIN PANEL
   ============================== */
function initAdmin() {
  const cb1 = document.getElementById('ai-toggle-checkbox');
  const cb2 = document.getElementById('ai-toggle-checkbox-2');

  function syncToggles(val) {
    cb1.checked = val;
    if (cb2) cb2.checked = val;
    updateToggleBanner(val);
  }

  syncToggles(getAiToggle());
  cb1.addEventListener('change', () => { setAiToggle(cb1.checked); syncToggles(cb1.checked); });
  if (cb2) cb2.addEventListener('change', () => { setAiToggle(cb2.checked); syncToggles(cb2.checked); });

  document.querySelectorAll('.sb-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sb-item[data-page]').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + page)?.classList.add('active');
      if (page === 'funds') renderAllFundsTable();
      if (page === 'vip') renderVipCards();
      if (page === 'overview') { renderOverviewFundTable(); updateKpis(); }
    });
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov.id); });
  });

  document.getElementById('create-vip-btn')?.addEventListener('click', () => openModal('modal-create-vip'));

  renderOverviewFundTable();
  updateKpis();

  document.getElementById('generate-vip-btn')?.addEventListener('click', generateVipFund);

  document.getElementById('copy-link-btn')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('vip-modal-link').textContent);
    const btn = document.getElementById('copy-link-btn');
    btn.textContent = _t('admin_copied_btn');
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = _t('admin_copy_btn'); btn.classList.remove('copied'); }, 2000);
  });

  document.getElementById('copy-view-link-btn')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('view-modal-link').textContent);
    const btn = document.getElementById('copy-view-link-btn');
    btn.textContent = _t('admin_copied_btn');
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = _t('admin_copy_btn'); btn.classList.remove('copied'); }, 2000);
  });

  document.getElementById('adjust-plus')?.addEventListener('click', () => {
    const inp = document.getElementById('adjust-delta');
    inp.value = Math.abs(Number(inp.value) || 0) + 1000;
    updateAdjustPreview();
  });
  document.getElementById('adjust-minus')?.addEventListener('click', () => {
    const inp = document.getElementById('adjust-delta');
    inp.value = -(Math.abs(Number(inp.value) || 0) + 1000);
    updateAdjustPreview();
  });
  document.getElementById('adjust-delta')?.addEventListener('input', updateAdjustPreview);
  document.getElementById('adjust-confirm-btn')?.addEventListener('click', confirmAdjust);
}

/* ==============================
   TOGGLE BANNER
   ============================== */
function updateToggleBanner(on) {
  const banner = document.getElementById('ai-toggle-banner');
  const statusText = document.getElementById('toggle-status-text');
  const label = document.getElementById('toggle-label');
  if (!banner) return;
  banner.className = 'ai-toggle-banner ' + (on ? 'on' : 'off');
  if (statusText) {
    statusText.className = 'ai-toggle-status ' + (on ? 'on' : 'off');
    statusText.textContent = _t(on ? 'admin_toggle_on_text' : 'admin_toggle_off_text');
  }
  if (label) label.textContent = _t(on ? 'admin_toggle_label_on' : 'admin_toggle_label_off');
}

/* ==============================
   KPI UPDATE
   ============================== */
function updateKpis() {
  const vipFunds = getVipFunds();
  const vipAum = vipFunds.reduce((s, f) => s + Number(f.amount), 0);
  const publicAum = 287500 + 198000 + 423000;
  document.getElementById('kpi-aum').textContent = fmtUSD(publicAum + vipAum);
  document.getElementById('kpi-vip').textContent = vipFunds.length;
  document.getElementById('kpi-investors').textContent = 149 + vipFunds.length;
}

/* ==============================
   OVERVIEW FUND TABLE
   ============================== */
function renderOverviewFundTable() {
  const tbody = document.getElementById('overview-fund-tbody');
  if (!tbody) return;
  tbody.innerHTML = PUBLIC_FUNDS.map(f => {
    const pct = ((f.raised / f.cap) * 100).toFixed(1);
    const isFull = parseFloat(pct) >= 100;
    return `<tr>
      <td><span style="font-weight:700;color:var(--text)">${_t('fund_name_' + f.id)}</span></td>
      <td><span class="risk-badge ${f.risk}">${riskLabel(f.risk)}</span></td>
      <td><span class="num green">+${f.annualReturn}%</span></td>
      <td><span class="num">${fmtUSD(f.raised)}</span></td>
      <td>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-text">${pct}% (${_t('admin_cap_label')} ${fmtUSD(f.cap)})</div>
        </div>
      </td>
      <td>${f.investors}${_t('admin_investors_unit')}</td>
      <td><span class="status-badge ${isFull ? 'full' : 'active'}">${_t(isFull ? 'admin_fund_full' : 'admin_fund_active')}</span></td>
    </tr>`;
  }).join('');
}

/* ==============================
   ALL FUNDS TABLE
   ============================== */
function renderAllFundsTable() {
  const tbody = document.getElementById('all-funds-tbody');
  if (!tbody) return;

  const vipFunds = getVipFunds();
  const allFunds = [
    ...PUBLIC_FUNDS.map(f => ({ ...f, type: 'public' })),
    ...vipFunds.map(f => ({
      id: f.token, name: f.fundName, risk: f.risk,
      annualReturn: f.annualRate, cap: f.amount, raised: f.amount,
      investors: 1, type: 'vip', clientName: f.clientName, token: f.token,
    })),
  ];

  tbody.innerHTML = allFunds.map(f => {
    const pct = Math.min(((f.raised / f.cap) * 100), 100).toFixed(1);
    const isVip = f.type === 'vip';
    const displayName = isVip ? f.name : _t('fund_name_' + f.id);
    return `<tr>
      <td>
        <div style="font-weight:700;color:var(--text)">${displayName}</div>
        ${isVip ? `<div style="font-size:11px;color:var(--text-3)">${_t('admin_client_label')}${f.clientName}</div>` : ''}
      </td>
      <td><span class="fund-type-badge ${f.type}">${isVip ? '👑 VIP' : _t('admin_type_public')}</span></td>
      <td><span class="risk-badge ${f.risk}">${riskLabel(f.risk)}</span></td>
      <td><span class="num green">+${f.annualReturn}%</span></td>
      <td><span class="num">${fmtUSD(f.raised)}</span></td>
      <td><span class="num">${fmtUSD(f.cap)}</span></td>
      <td>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-text">${pct}%</div>
        </div>
      </td>
      <td>${f.investors}${_t('admin_investors_unit')}</td>
      <td><span class="status-badge active">${_t('admin_fund_active')}</span></td>
      <td style="display:flex;gap:6px;align-items:center">
        ${isVip ? `
          <button class="tbl-btn gold" onclick="openViewLink('${f.token}')">${_t('admin_link_btn')}</button>
          <button class="tbl-btn" onclick="openAdjust('${f.token}')">${_t('admin_adjust_btn')}</button>
        ` : `<button class="tbl-btn" onclick="showToast(_t('admin_detail_coming'))">${_t('admin_detail_btn')}</button>`}
      </td>
    </tr>`;
  }).join('');
}

/* ==============================
   VIP CARDS
   ============================== */
function renderVipCards() {
  const vipFunds = getVipFunds();
  const container = document.getElementById('vip-cards-container');
  const empty = document.getElementById('vip-empty');
  if (!container) return;

  if (vipFunds.length === 0) {
    empty.style.display = ''; container.innerHTML = '';
  } else {
    empty.style.display = 'none';
    container.innerHTML = vipFunds.map(f => `
      <div class="vip-card">
        <div class="vip-card-header">
          <div>
            <div class="vip-client-name">${f.clientName}</div>
            <div class="vip-fund-name">${f.fundName}</div>
          </div>
          <span class="vip-crown">👑</span>
        </div>
        <div class="vip-stats">
          <div class="vip-stat">
            <div class="vip-stat-label">${_t('vip_stat_amount')}</div>
            <div class="vip-stat-val gold">${fmtUSD(f.amount)}</div>
          </div>
          <div class="vip-stat">
            <div class="vip-stat-label">${_t('vip_stat_annual')}</div>
            <div class="vip-stat-val green">+${f.annualRate}%</div>
          </div>
          <div class="vip-stat">
            <div class="vip-stat-label">${_t('vip_stat_referral')}</div>
            <div class="vip-stat-val" style="font-size:12px">${f.referralCode || '—'}</div>
          </div>
          <div class="vip-stat">
            <div class="vip-stat-label">${_t('vip_stat_created')}</div>
            <div class="vip-stat-val" style="font-size:12px">${f.createdDate}</div>
          </div>
        </div>
        <div class="vip-card-actions">
          <button class="tbl-btn gold" style="flex:1" onclick="openViewLink('${f.token}')">${_t('vip_card_view')}</button>
          <button class="tbl-btn" style="flex:1" onclick="openAdjust('${f.token}')">${_t('vip_card_adjust')}</button>
        </div>
      </div>
    `).join('');
  }
}

/* ==============================
   GENERATE VIP FUND
   ============================== */
function generateVipFund() {
  const clientName = document.getElementById('vip-client-name').value.trim();
  const fundName   = document.getElementById('vip-fund-name').value.trim();
  const annualRate = Number(document.getElementById('vip-annual-rate').value);
  const amount     = Number(document.getElementById('vip-amount').value);
  const referralCode = document.getElementById('vip-referral').value.trim();
  const isNewUser  = document.getElementById('vip-is-new-user').checked;
  const risk       = document.getElementById('vip-risk').value;

  if (!clientName || !fundName || !annualRate || !amount) {
    showToast(_t('admin_fill_required'), 'error'); return;
  }

  const token = genToken();
  const now = new Date();
  const createdDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const newFund = { token, clientName, fundName, annualRate, amount, referralCode, isNewUser, risk, createdDate };
  const vipFunds = getVipFunds();
  vipFunds.push(newFund);
  saveVipFunds(vipFunds);

  ['vip-client-name','vip-fund-name','vip-annual-rate','vip-amount','vip-referral'].forEach(id => {
    document.getElementById(id).value = '';
  });

  closeModal('modal-create-vip');
  showVipLinkModal(newFund, 'modal-vip-link', 'vip-modal-link', 'vip-qr-img', 'vip-modal-client-name', 'vip-modal-fund-info');
  renderVipCards();
  updateKpis();
  showToast(`✅ ${clientName} — ${_t('vip_stat_amount')} ${fmtUSD(amount)} USDT`, 'success');
}

function showVipLinkModal(fund, overlayId, linkElId, qrElId, nameElId, infoElId) {
  const link = getVipLink(fund.token);
  document.getElementById(linkElId).textContent = link;
  document.getElementById(nameElId).textContent = fund.clientName;
  document.getElementById(infoElId).textContent =
    `${fund.fundName} · ${_t('fund_annual_return')} +${fund.annualRate}% · ${fmtUSD(fund.amount)} USDT`;
  setQrImg(document.getElementById(qrElId), link);
  openModal(overlayId);
}

/* ==============================
   VIEW EXISTING VIP LINK
   ============================== */
window.openViewLink = function(token) {
  const fund = getVipFunds().find(f => f.token === token);
  if (!fund) return;
  const link = getVipLink(token);
  document.getElementById('view-modal-link').textContent = link;
  setQrImg(document.getElementById('view-qr-img'), link);
  openModal('modal-view-link');
};

/* ==============================
   ADJUST VIP AMOUNT
   ============================== */
let adjustingToken = null;

window.openAdjust = function(token) {
  const fund = getVipFunds().find(f => f.token === token);
  if (!fund) return;
  adjustingToken = token;
  document.getElementById('adjust-client-name').textContent = fund.clientName;
  document.getElementById('adjust-current').value = `$${Number(fund.amount).toLocaleString()} USDT`;
  document.getElementById('adjust-delta').value = '';
  document.getElementById('adjust-new').textContent = `$${Number(fund.amount).toLocaleString()}`;
  openModal('modal-adjust');
};

function updateAdjustPreview() {
  if (!adjustingToken) return;
  const fund = getVipFunds().find(f => f.token === adjustingToken);
  if (!fund) return;
  const delta = Number(document.getElementById('adjust-delta').value) || 0;
  const newAmt = Math.max(0, Number(fund.amount) + delta);
  document.getElementById('adjust-new').textContent = `$${newAmt.toLocaleString()} USDT`;
}

function confirmAdjust() {
  if (!adjustingToken) return;
  const vipFunds = getVipFunds();
  const idx = vipFunds.findIndex(f => f.token === adjustingToken);
  if (idx < 0) return;
  const delta = Number(document.getElementById('adjust-delta').value) || 0;
  const newAmt = Math.max(0, Number(vipFunds[idx].amount) + delta);
  vipFunds[idx].amount = newAmt;
  saveVipFunds(vipFunds);
  closeModal('modal-adjust');
  renderVipCards();
  renderAllFundsTable();
  updateKpis();
  showToast(`✅ ${vipFunds[idx].clientName} → $${newAmt.toLocaleString()} USDT`, 'success');
  adjustingToken = null;
}

/* ==============================
   MODAL HELPERS
   ============================== */
function openModal(id) { document.getElementById(id)?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
  }
}

// Re-render on language change
window.addEventListener('langchange', () => {
  updateToggleBanner(getAiToggle());
  renderOverviewFundTable();
  if (document.getElementById('page-funds')?.classList.contains('active')) renderAllFundsTable();
  if (document.getElementById('page-vip')?.classList.contains('active')) renderVipCards();
});
