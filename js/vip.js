/* =============================================
   TRANSAI — VIP Page JavaScript
   Reads token from URL, renders VIP fund page
   ============================================= */

(function() {

  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const container = document.getElementById('vip-content');

  let currentFund = null;

  function getVipFund(tok) {
    try {
      const funds = JSON.parse(localStorage.getItem('transai_vip_funds') || '[]');
      return funds.find(f => f.token === tok) || null;
    } catch { return null; }
  }

  function fmtUSD(n) { return '$' + Number(n).toLocaleString('en-US'); }

  function mockPnl(amount, annualRate) {
    const dailyRate = annualRate / 100 / 365;
    return (amount * dailyRate * 14).toFixed(2);
  }

  /* ==============================
     RENDER ERROR PAGE
     ============================== */
  function renderError() {
    document.title = _t('vip_invalid_title');
    container.innerHTML = `
      <div class="error-page">
        <div class="error-card">
          <div class="error-icon">🔗</div>
          <h2 class="error-title">${_t('vip_error_title')}</h2>
          <p class="error-desc">${_t('vip_error_desc')}</p>
          <a href="index.html" class="btn-back">${_t('vip_back_home')}</a>
        </div>
      </div>
    `;
  }

  /* ==============================
     RENDER VIP PAGE
     ============================== */
  function renderVipPage(fund) {
    document.title = `${fund.clientName}${_t('vip_page_title')}`;

    const pnl = mockPnl(fund.amount, fund.annualRate);
    const currentValue = (Number(fund.amount) + Number(pnl)).toFixed(2);
    const rClass = fund.risk || 'medium';
    const rLabel = _t('risk_' + rClass + '_label');
    const isNewUser = fund.isNewUser;
    const referralCode = fund.referralCode || 'TRANSAI2024';
    const regUrl = `index.html?referral=${encodeURIComponent(referralCode)}&vip=${fund.token}`;

    container.innerHTML = `
      <div class="vip-main">

        <!-- HERO BANNER -->
        <div class="vip-hero">
          <div class="vip-hero-top">
            <span class="vip-crown-badge">${_t('vip_crown')}</span>
            <span class="vip-token">TOKEN: ${fund.token}</span>
          </div>
          <div class="vip-hero-greeting">${_t('vip_greeting')}</div>
          <div class="vip-hero-name">${fund.clientName}</div>
          <div class="vip-hero-fund">${fund.fundName}</div>
          <div class="vip-hero-stats">
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">${_t('vip_amount_label')}</div>
              <div class="vip-hero-stat-val gold">${fmtUSD(fund.amount)}</div>
            </div>
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">${_t('vip_annual_label')}</div>
              <div class="vip-hero-stat-val green">+${fund.annualRate}%</div>
            </div>
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">${_t('vip_created_label')}</div>
              <div class="vip-hero-stat-val" style="font-size:15px">${fund.createdDate}</div>
            </div>
          </div>
        </div>

        ${isNewUser ? renderNewUserSection(referralCode, regUrl, fund) : renderExistingUserSection(fund, pnl, currentValue)}

        <!-- FUND DETAILS -->
        <div class="vip-section-title" style="margin-top:24px">${_t('vip_fund_details')}</div>
        <div class="vip-info-grid">
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_fund_name_label')}</div>
            <div class="vip-info-val">${fund.fundName}</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_risk_label')}</div>
            <div class="vip-info-val"><span class="risk-badge ${rClass}">${rLabel}</span></div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_strategy_label')}</div>
            <div class="vip-info-val" style="font-size:13px">${_t('vip_strategy_val')}</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_exchange_label')}</div>
            <div class="vip-info-val" style="font-size:13px">${_t('vip_exchange_val')}</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_annual_return_label')}</div>
            <div class="vip-info-val green">+${fund.annualRate}%</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">${_t('vip_exit_label')}</div>
            <div class="vip-info-val" style="font-size:13px">${_t('vip_exit_val')}</div>
          </div>
        </div>

        <!-- DISCLAIMER -->
        <div class="vip-disclaimer">${_t('vip_disclaimer')}</div>

      </div>
    `;
  }

  /* ==============================
     NEW USER SECTION
     ============================== */
  function renderNewUserSection(referralCode, regUrl, fund) {
    const descLines = _t('vip_reg_desc')
      .replace('{amount}', fmtUSD(fund.amount))
      .split('\n');
    return `
      <div class="vip-section-title">${_t('vip_new_user_section')}</div>
      <div class="vip-reg-card">
        <div class="vip-reg-icon">🎯</div>
        <h3 class="vip-reg-title">${_t('vip_reg_title')}</h3>
        <p class="vip-reg-desc">${descLines.join('<br>')}</p>
        <div class="referral-display">
          <span class="referral-label">${_t('vip_referral_label')}</span>
          <span class="referral-code">${referralCode}</span>
        </div>
        <br>
        <a href="${regUrl}" class="btn-register-vip">${_t('vip_register_btn')}</a>
        <p class="vip-reg-note">${_t('vip_reg_note_1')}<br>${_t('vip_reg_note_2')}</p>
      </div>
    `;
  }

  /* ==============================
     EXISTING USER SECTION
     ============================== */
  function renderExistingUserSection(fund, pnl, currentValue) {
    return `
      <div class="vip-section-title">${_t('vip_status_title')}</div>
      <div class="vip-status-card">
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_account_status')}</span>
          <span class="vip-status-val" style="display:flex;align-items:center;gap:6px">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block"></span>
            ${_t('vip_running')}
          </span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_initial_amount')}</span>
          <span class="vip-status-val">${fmtUSD(fund.amount)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_current_value')}</span>
          <span class="vip-status-val">${fmtUSD(currentValue)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_period_pnl')}</span>
          <span class="vip-status-val green">+${fmtUSD(pnl)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_funds_location')}</span>
          <span class="vip-status-val">${_t('vip_binance_account')}</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">${_t('vip_next_settle')}</span>
          <span class="vip-status-val gold">${_t('vip_settle_day')}</span>
        </div>
      </div>
      <div style="text-align:center;padding:8px 0">
        <a href="dashboard.html" style="font-size:13px;color:var(--navy);text-decoration:none;font-weight:600;border:1.5px solid var(--border);padding:9px 20px;border-radius:8px;display:inline-block;transition:all 0.2s" onmouseover="this.style.borderColor='#f0b429'" onmouseout="this.style.borderColor='#e2e8f4'">
          ${_t('vip_view_dashboard')}
        </a>
      </div>
    `;
  }

  /* ==============================
     MAIN
     ============================== */
  function init() {
    if (!token) { renderError(); return; }
    currentFund = getVipFund(token);
    if (!currentFund) { renderError(); return; }
    renderVipPage(currentFund);
  }

  // Wait for i18n to be ready, then render
  if (typeof _t === 'function') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // Re-render on language change
  window.addEventListener('langchange', () => {
    if (currentFund) renderVipPage(currentFund);
    else if (!token) renderError();
  });

})();
