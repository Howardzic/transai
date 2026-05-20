/* =============================================
   TRANSAI — Dashboard JavaScript (v2)
   Fund Cards, AI Toggle, Investment Flow
   ============================================= */

const FUNDS = [
  { id: 'alpha', risk: 'high', annualReturn: 130, cap: 500000, raised: 287500, minK: 5, lockDays: 30, investors: 34 },
  { id: 'beta',  risk: 'medium', annualReturn: 72,  cap: 300000, raised: 198000, minK: 1, lockDays: 14, investors: 28 },
  { id: 'stable',risk: 'low',  annualReturn: 28,  cap: 1000000,raised: 423000, minK: 0.1,lockDays: 0,  investors: 87 },
];

let selectedFund = null;
let investAmountK = 0;

function getAiToggle() { return localStorage.getItem('transai_ai_toggle') === 'true'; }
function openModal(id) { document.getElementById(id)?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }

function showToastMsg(msg, type = '') {
  const old = document.querySelector('.dash-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'dash-toast';
  el.style.cssText = `position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:5000;box-shadow:0 8px 32px rgba(0,0,0,0.2);color:#fff;background:${type==='success'?'#03c795':type==='error'?'#f6465d':'#152747'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity='0';el.style.transition='opacity 0.3s ease';setTimeout(()=>el.remove(),300); }, 3000);
}

/* ==============================
   RENDER FUND CARDS
   ============================== */
function renderFundCards() {
  const grid = document.getElementById('funds-grid');
  if (!grid) return;

  grid.innerHTML = FUNDS.map(f => {
    const pct = Math.min(((f.raised / f.cap) * 100), 100).toFixed(1);
    const isFull = parseFloat(pct) >= 100;
    const riskLabel = _t('risk_' + f.risk);
    const strategyLabel = _t('strategy_' + f.id);
    const fundName = _t('fund_name_' + f.id);
    const lockLabel = f.lockDays === 0 ? _t('fund_no_lock') : f.lockDays + _t('fund_days');
    const investorsLabel = f.investors + _t('fund_persons');
    return `
      <div class="fund-card${isFull ? ' full' : ''}" onclick="${isFull ? 'return' : `openInvestModal('${f.id}')`}">
        <div class="fund-card-top">
          <span class="fund-risk-badge ${f.risk}">${riskLabel}</span>
          ${isFull ? `<span class="fund-full-badge">${_t('fund_full')}</span>` : ''}
        </div>
        <div class="fund-name">${fundName}</div>
        <div class="fund-return">
          <span class="fund-return-num">+${f.annualReturn}%</span>
          <span class="fund-return-label">${_t('fund_annual_return')}</span>
        </div>
        <div class="fund-progress-wrap">
          <div class="fund-progress-label">
            <span>${_t('fund_raised')} $${(f.raised/1000).toFixed(0)}K</span>
            <span>${_t('fund_cap')} $${(f.cap/1000).toFixed(0)}K</span>
          </div>
          <div class="fund-progress-bar">
            <div class="fund-progress-fill ${f.risk}" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="fund-meta">
          <div class="fund-meta-row">
            <span class="fund-meta-label">${_t('fund_strategy')}</span>
            <span class="fund-meta-val">${strategyLabel}</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">${_t('fund_min_invest')}</span>
            <span class="fund-meta-val">${f.minK}K USDT ($${(f.minK * 1000).toLocaleString()})</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">${_t('fund_lock')}</span>
            <span class="fund-meta-val">${lockLabel}</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">${_t('fund_investors')}</span>
            <span class="fund-meta-val">${investorsLabel}</span>
          </div>
        </div>
        <button class="btn-invest" ${isFull ? 'disabled' : ''} onclick="event.stopPropagation();${isFull ? '' : `openInvestModal('${f.id}')`}">
          ${isFull ? _t('fund_full') : _t('fund_invest_btn')}
        </button>
      </div>
    `;
  }).join('');
}

/* ==============================
   AI TOGGLE AWARENESS
   ============================== */
function checkAiToggle() {
  const on = getAiToggle();
  const onSection = document.getElementById('ai-on-section');
  const offSection = document.getElementById('ai-off-section');
  if (onSection) onSection.style.display = on ? '' : 'none';
  if (offSection) offSection.style.display = on ? 'none' : '';
}

/* ==============================
   INVEST MODAL
   ============================== */
window.openInvestModal = function(fundId) {
  selectedFund = FUNDS.find(f => f.id === fundId);
  if (!selectedFund) return;

  document.getElementById('invest-fund-name').textContent = _t('fund_name_' + selectedFund.id);
  document.getElementById('invest-fund-meta').textContent =
    `${_t('risk_' + selectedFund.risk)} · ${_t('fund_annual_return')} +${selectedFund.annualReturn}% · ${_t('strategy_' + selectedFund.id)}`;
  document.getElementById('invest-min-label').textContent =
    `${selectedFund.minK}K ($${(selectedFund.minK * 1000).toLocaleString()})`;

  const inp = document.getElementById('invest-amount-k');
  inp.min = selectedFund.minK;
  inp.value = '';
  document.getElementById('invest-amount-usd').textContent = '$0';

  openModal('modal-invest');
};

/* ==============================
   DOM READY
   ============================== */
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('invest-amount-k')?.addEventListener('input', function() {
    const k = parseFloat(this.value) || 0;
    investAmountK = k;
    document.getElementById('invest-amount-usd').textContent = '$' + (k * 1000).toLocaleString('en-US', { minimumFractionDigits: 0 });
  });

  document.getElementById('invest-proceed-btn')?.addEventListener('click', () => {
    if (!selectedFund) return;
    const k = parseFloat(document.getElementById('invest-amount-k').value) || 0;
    if (k < selectedFund.minK) {
      showToastMsg(`${_t('toast_min_invest')} ${selectedFund.minK}K USDT ($${(selectedFund.minK*1000).toLocaleString()})`, 'error');
      return;
    }
    investAmountK = k;
    closeModal('modal-invest');
    const cb = document.getElementById('risk-checkbox');
    const btn = document.getElementById('risk-confirm-btn');
    if (cb) cb.checked = false;
    if (btn) btn.disabled = true;
    setTimeout(() => openModal('modal-risk'), 200);
  });

  document.getElementById('risk-checkbox')?.addEventListener('change', function() {
    document.getElementById('risk-confirm-btn').disabled = !this.checked;
  });

  document.getElementById('risk-confirm-btn')?.addEventListener('click', () => {
    closeModal('modal-risk');
    setTimeout(() => {
      const usd = (investAmountK * 1000).toLocaleString();
      showToastMsg(`${_t('toast_apply_success')} ($${usd})`, 'success');
    }, 300);
  });

  document.getElementById('pnl-7d')?.addEventListener('click', function() {
    document.querySelectorAll('.pnl-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('pnl-amount').textContent = '320.50';
  });
  document.getElementById('pnl-30d')?.addEventListener('click', function() {
    document.querySelectorAll('.pnl-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('pnl-amount').textContent = '1,287.34';
  });

  document.getElementById('btn-transfer')?.addEventListener('click', () => openModal('modal-transfer'));
  document.getElementById('tf-max-btn')?.addEventListener('click', () => {
    document.getElementById('tf-amount-input').value = '123789123.004';
  });
  document.getElementById('tf-confirm-btn')?.addEventListener('click', () => {
    const amt = document.getElementById('tf-amount-input')?.value;
    if (!amt || parseFloat(amt) <= 0) { showToastMsg(_t('toast_invalid_amount'), 'error'); return; }
    closeModal('modal-transfer');
    showToastMsg(`✅ Transfer of ${parseFloat(amt).toLocaleString()} USDT confirmed!`, 'success');
    document.getElementById('tf-amount-input').value = '';
  });

  document.getElementById('btn-join')?.addEventListener('click', () => {
    const onSection = document.getElementById('ai-on-section');
    if (onSection && onSection.style.display !== 'none') {
      document.getElementById('funds-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToastMsg(_t('toast_ai_not_open'));
    }
  });

  document.getElementById('btn-history')?.addEventListener('click', () => {
    showToastMsg(_t('toast_history_coming'));
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov.id); });
  });

  document.querySelectorAll('.card-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.card-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  checkAiToggle();
  renderFundCards();
  setInterval(checkAiToggle, 3000);
});

// Re-render on language change
window.addEventListener('langchange', () => {
  renderFundCards();
  // Refresh invest modal meta if a fund is selected
  if (selectedFund) {
    const nameEl = document.getElementById('invest-fund-name');
    const metaEl = document.getElementById('invest-fund-meta');
    if (nameEl) nameEl.textContent = _t('fund_name_' + selectedFund.id);
    if (metaEl) metaEl.textContent =
      `${_t('risk_' + selectedFund.risk)} · ${_t('fund_annual_return')} +${selectedFund.annualReturn}% · ${_t('strategy_' + selectedFund.id)}`;
  }
});
