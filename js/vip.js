/* =============================================
   TRANSAI — VIP Page JavaScript
   Reads token from URL, renders VIP fund page
   ============================================= */

(function() {

  // Read token from URL
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const container = document.getElementById('vip-content');

  // Look up VIP fund in localStorage
  function getVipFund(tok) {
    try {
      const funds = JSON.parse(localStorage.getItem('transai_vip_funds') || '[]');
      return funds.find(f => f.token === tok) || null;
    } catch { return null; }
  }

  function fmtUSD(n) { return '$' + Number(n).toLocaleString('en-US'); }

  // Risk labels
  const riskMap = { high: '高風險', medium: '中風險', low: '低風險' };

  // Simulated P&L (mock)
  function mockPnl(amount, annualRate) {
    const dailyRate = annualRate / 100 / 365;
    const days = 14;
    const pnl = amount * dailyRate * days;
    return pnl.toFixed(2);
  }

  // ==============================
  // RENDER ERROR PAGE
  // ==============================
  function renderError() {
    document.title = '連結無效 — TRANSAI';
    container.innerHTML = `
      <div class="error-page">
        <div class="error-card">
          <div class="error-icon">🔗</div>
          <h2 class="error-title">連結已失效或不存在</h2>
          <p class="error-desc">
            您訪問的 VIP 專屬連結無法找到對應的投資計劃。<br>
            可能原因：連結已過期、連結不完整，或尚未由管理員建立。<br><br>
            請聯繫您的理財顧問取得正確連結。
          </p>
          <a href="index.html" class="btn-back">← 返回 TRANSAI 首頁</a>
        </div>
      </div>
    `;
  }

  // ==============================
  // RENDER VIP PAGE
  // ==============================
  function renderVipPage(fund) {
    document.title = `${fund.clientName} 的專屬投資計劃 — TRANSAI`;

    const pnl = mockPnl(fund.amount, fund.annualRate);
    const currentValue = (Number(fund.amount) + Number(pnl)).toFixed(2);
    const riskLabel = riskMap[fund.risk] || '中風險';
    const riskClass = fund.risk || 'medium';
    const isNewUser = fund.isNewUser;
    const referralCode = fund.referralCode || 'TRANSAI2024';

    // Registration URL with referral
    const regUrl = `index.html?referral=${encodeURIComponent(referralCode)}&vip=${fund.token}`;

    container.innerHTML = `
      <div class="vip-main">

        <!-- HERO BANNER -->
        <div class="vip-hero">
          <div class="vip-hero-top">
            <span class="vip-crown-badge">👑 VIP 專屬計劃</span>
            <span class="vip-token">TOKEN: ${fund.token}</span>
          </div>
          <div class="vip-hero-greeting">您好，</div>
          <div class="vip-hero-name">${fund.clientName}</div>
          <div class="vip-hero-fund">${fund.fundName}</div>
          <div class="vip-hero-stats">
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">運用金額</div>
              <div class="vip-hero-stat-val gold">${fmtUSD(fund.amount)}</div>
            </div>
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">目標年化</div>
              <div class="vip-hero-stat-val green">+${fund.annualRate}%</div>
            </div>
            <div class="vip-hero-stat">
              <div class="vip-hero-stat-label">建立日期</div>
              <div class="vip-hero-stat-val" style="font-size:15px">${fund.createdDate}</div>
            </div>
          </div>
        </div>

        ${isNewUser ? renderNewUserSection(referralCode, regUrl, fund) : renderExistingUserSection(fund, pnl, currentValue)}

        <!-- FUND DETAILS -->
        <div class="vip-section-title" style="margin-top:24px">基金詳情</div>
        <div class="vip-info-grid">
          <div class="vip-info-item">
            <div class="vip-info-label">基金名稱</div>
            <div class="vip-info-val">${fund.fundName}</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">風險等級</div>
            <div class="vip-info-val"><span class="risk-badge ${riskClass}">${riskLabel}</span></div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">交易策略</div>
            <div class="vip-info-val" style="font-size:13px">ETH/USDT 永續合約</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">執行交易所</div>
            <div class="vip-info-val" style="font-size:13px">幣安 Binance</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">目標年化報酬</div>
            <div class="vip-info-val green">+${fund.annualRate}%</div>
          </div>
          <div class="vip-info-item">
            <div class="vip-info-label">退出機制</div>
            <div class="vip-info-val" style="font-size:13px">隨時可提申請</div>
          </div>
        </div>

        <!-- DISCLAIMER -->
        <div class="vip-disclaimer">
          ⚠️ 重要風險提示：本投資計劃不保證本金及利息，投資涉及風險。過往表現並不代表未來業績。本服務僅供受邀 VIP 客戶使用，不對外公開。如有疑問請聯繫您的理財顧問。
        </div>

      </div>
    `;
  }

  // ==============================
  // NEW USER SECTION
  // ==============================
  function renderNewUserSection(referralCode, regUrl, fund) {
    return `
      <div class="vip-section-title">開始您的投資之旅</div>
      <div class="vip-reg-card">
        <div class="vip-reg-icon">🎯</div>
        <h3 class="vip-reg-title">您的專屬投資計劃已準備就緒</h3>
        <p class="vip-reg-desc">
          您的 VIP 客製基金已由我們的團隊為您配置完成。<br>
          請先完成 TRANSAI 帳號申請，完成後即可啟用您的專屬 ${fmtUSD(fund.amount)} USDT 投資計劃。
        </p>
        <div class="referral-display">
          <span class="referral-label">您的推薦碼</span>
          <span class="referral-code">${referralCode}</span>
        </div>
        <br>
        <a href="${regUrl}" class="btn-register-vip">立即申請帳號 →</a>
        <p class="vip-reg-note">申請完成後，本頁面將自動顯示您的投資狀態<br>推薦碼已自動填入，讓您享有 VIP 開戶禮遇</p>
      </div>
    `;
  }

  // ==============================
  // EXISTING USER SECTION
  // ==============================
  function renderExistingUserSection(fund, pnl, currentValue) {
    return `
      <div class="vip-section-title">投資狀態</div>
      <div class="vip-status-card">
        <div class="vip-status-row">
          <span class="vip-status-label">帳戶狀態</span>
          <span class="vip-status-val" style="display:flex;align-items:center;gap:6px">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block"></span>
            運行中
          </span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">初始投入金額</span>
          <span class="vip-status-val">${fmtUSD(fund.amount)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">當前資產估值</span>
          <span class="vip-status-val">${fmtUSD(currentValue)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">本期未實現盈虧</span>
          <span class="vip-status-val green">+${fmtUSD(pnl)} USDT</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">資金所在位置</span>
          <span class="vip-status-val">幣安合約帳戶 (運行中)</span>
        </div>
        <div class="vip-status-row">
          <span class="vip-status-label">下次結算日</span>
          <span class="vip-status-val gold">每月 1 日</span>
        </div>
      </div>
      <div style="text-align:center;padding:8px 0">
        <a href="dashboard.html" style="font-size:13px;color:var(--navy);text-decoration:none;font-weight:600;border:1.5px solid var(--border);padding:9px 20px;border-radius:8px;display:inline-block;transition:all 0.2s" onmouseover="this.style.borderColor='#f0b429'" onmouseout="this.style.borderColor='#e2e8f4'">
          進入 AI Bots Wallet 查看詳細報告 →
        </a>
      </div>
    `;
  }

  // ==============================
  // MAIN: DECIDE WHAT TO RENDER
  // ==============================
  if (!token) {
    renderError();
  } else {
    const fund = getVipFund(token);
    if (!fund) {
      renderError();
    } else {
      renderVipPage(fund);
    }
  }

})();
