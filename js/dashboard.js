/* =============================================
   TRANSAI — Dashboard JavaScript (v2)
   Fund Cards, AI Toggle, Investment Flow
   ============================================= */

/* ==============================
   PUBLIC FUND DATA
   ============================== */
const FUNDS = [
  {
    id: 'alpha', name: 'Alpha Fund 甲號', risk: 'high', riskLabel: '🔴 高風險',
    annualReturn: 130, strategy: 'ETH/USDT 100x 合約',
    cap: 500000, raised: 287500, minK: 5, lockDays: 30, investors: 34,
  },
  {
    id: 'beta', name: 'Beta Fund 乙號', risk: 'medium', riskLabel: '🟡 中風險',
    annualReturn: 72, strategy: 'ETH/USDT 50x 合約',
    cap: 300000, raised: 198000, minK: 1, lockDays: 14, investors: 28,
  },
  {
    id: 'stable', name: 'Stable Fund 丙號', risk: 'low', riskLabel: '🟢 低風險',
    annualReturn: 28, strategy: 'ETH/USDT 10x 合約',
    cap: 1000000, raised: 423000, minK: 0.1, lockDays: 0, investors: 87,
  },
];

let selectedFund = null;
let investAmountK = 0;

/* ==============================
   HELPERS
   ============================== */
function getAiToggle() { return localStorage.getItem('transai_ai_toggle') === 'true'; }

function openModal(id) { document.getElementById(id)?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }

function showToastMsg(msg, type = '') {
  const old = document.querySelector('.dash-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'dash-toast';
  t.style.cssText = `position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:5000;box-shadow:0 8px 32px rgba(0,0,0,0.2);color:#fff;background:${type==='success'?'#03c795':type==='error'?'#f6465d':'#152747'}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0';t.style.transition='opacity 0.3s ease';setTimeout(()=>t.remove(),300); }, 3000);
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
    return `
      <div class="fund-card${isFull ? ' full' : ''}" onclick="${isFull ? 'return' : `openInvestModal('${f.id}')`}">
        <div class="fund-card-top">
          <span class="fund-risk-badge ${f.risk}">${f.riskLabel}</span>
          ${isFull ? '<span class="fund-full-badge">已額滿</span>' : ''}
        </div>
        <div class="fund-name">${f.name}</div>
        <div class="fund-return">
          <span class="fund-return-num">+${f.annualReturn}%</span>
          <span class="fund-return-label">年化報酬</span>
        </div>
        <div class="fund-progress-wrap">
          <div class="fund-progress-label">
            <span>已募資 $${(f.raised/1000).toFixed(0)}K</span>
            <span>上限 $${(f.cap/1000).toFixed(0)}K</span>
          </div>
          <div class="fund-progress-bar">
            <div class="fund-progress-fill ${f.risk}" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="fund-meta">
          <div class="fund-meta-row">
            <span class="fund-meta-label">交易策略</span>
            <span class="fund-meta-val">${f.strategy}</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">最低投資</span>
            <span class="fund-meta-val">${f.minK}K USDT ($${(f.minK * 1000).toLocaleString()})</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">鎖倉期</span>
            <span class="fund-meta-val">${f.lockDays === 0 ? '無鎖倉' : f.lockDays + ' 天'}</span>
          </div>
          <div class="fund-meta-row">
            <span class="fund-meta-label">目前投資者</span>
            <span class="fund-meta-val">${f.investors} 人</span>
          </div>
        </div>
        <button class="btn-invest" ${isFull ? 'disabled' : ''} onclick="event.stopPropagation();${isFull ? '' : `openInvestModal('${f.id}')`}">
          ${isFull ? '已額滿' : '申請投資 →'}
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

  document.getElementById('invest-fund-name').textContent = selectedFund.name;
  document.getElementById('invest-fund-meta').textContent =
    `${selectedFund.riskLabel} · 年化 +${selectedFund.annualReturn}% · ${selectedFund.strategy}`;
  document.getElementById('invest-min-label').textContent =
    `${selectedFund.minK}K ($${(selectedFund.minK * 1000).toLocaleString()})`;

  const inp = document.getElementById('invest-amount-k');
  inp.min = selectedFund.minK;
  inp.value = '';
  document.getElementById('invest-amount-usd').textContent = '$0';

  openModal('modal-invest');
};

/* ==============================
   AMOUNT DISPLAY
   ============================== */
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('invest-amount-k')?.addEventListener('input', function() {
    const k = parseFloat(this.value) || 0;
    investAmountK = k;
    const usd = k * 1000;
    document.getElementById('invest-amount-usd').textContent = '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 0 });
  });

  document.getElementById('invest-proceed-btn')?.addEventListener('click', () => {
    if (!selectedFund) return;
    const k = parseFloat(document.getElementById('invest-amount-k').value) || 0;
    if (k < selectedFund.minK) {
      showToastMsg(`最低投資金額為 ${selectedFund.minK}K USDT ($${(selectedFund.minK*1000).toLocaleString()})`, 'error');
      return;
    }
    investAmountK = k;
    closeModal('modal-invest');
    // Reset risk checkbox
    const cb = document.getElementById('risk-checkbox');
    const btn = document.getElementById('risk-confirm-btn');
    if (cb) cb.checked = false;
    if (btn) btn.disabled = true;
    setTimeout(() => openModal('modal-risk'), 200);
  });

  // Risk checkbox
  document.getElementById('risk-checkbox')?.addEventListener('change', function() {
    document.getElementById('risk-confirm-btn').disabled = !this.checked;
  });

  // Risk confirm → success
  document.getElementById('risk-confirm-btn')?.addEventListener('click', () => {
    closeModal('modal-risk');
    setTimeout(() => {
      const usd = (investAmountK * 1000).toLocaleString();
      showToastMsg(`✅ 申請成功！$${usd} 投資申請已送出，我們將於 24 小時內確認`, 'success');
    }, 300);
  });

  // P&L tabs
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

  // Transfer modal
  document.getElementById('btn-transfer')?.addEventListener('click', () => openModal('modal-transfer'));
  document.getElementById('tf-max-btn')?.addEventListener('click', () => {
    document.getElementById('tf-amount-input').value = '123789123.004';
  });
  document.getElementById('tf-confirm-btn')?.addEventListener('click', () => {
    const amt = document.getElementById('tf-amount-input')?.value;
    if (!amt || parseFloat(amt) <= 0) { showToastMsg('請輸入有效金額', 'error'); return; }
    closeModal('modal-transfer');
    showToastMsg(`✅ Transfer of ${parseFloat(amt).toLocaleString()} USDT confirmed!`, 'success');
    document.getElementById('tf-amount-input').value = '';
  });

  // Join = go to fund selection
  document.getElementById('btn-join')?.addEventListener('click', () => {
    const onSection = document.getElementById('ai-on-section');
    if (onSection && onSection.style.display !== 'none') {
      document.getElementById('funds-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToastMsg('AI 投資功能尚未開放，請等候管理員通知');
    }
  });

  document.getElementById('btn-history')?.addEventListener('click', () => {
    showToastMsg('交易歷史功能即將推出');
  });

  // Modal close
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov.id); });
  });

  // Card tabs
  document.querySelectorAll('.card-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.card-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // INIT
  checkAiToggle();
  renderFundCards();

  // Re-check toggle every 3s (in case admin changes it in another tab)
  setInterval(checkAiToggle, 3000);
});
