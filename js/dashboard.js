/* =============================================
   TRANSAI — Dashboard JavaScript
   Mock Data, Charts, Table, Navigation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // DATE
  // ==============================
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ==============================
  // MOCK DATA
  // ==============================
  const investors = [
    { id: 1, name: '陳建志', email: 'ken.chen@email.com', plan: 'VIP 方案', amount: 350000, returnRate: 9.2, profit: 32200, date: '2024-01-15', status: 'active', emoji: '👨‍💼' },
    { id: 2, name: '林雅婷', email: 'yating.lin@email.com', plan: '專業方案', amount: 120000, returnRate: 8.7, profit: 10440, date: '2024-02-08', status: 'active', emoji: '👩‍💼' },
    { id: 3, name: 'Michael Wang', email: 'm.wang@email.com', plan: 'VIP 方案', amount: 500000, returnRate: 10.1, profit: 50500, date: '2023-11-20', status: 'active', emoji: '🧔' },
    { id: 4, name: '張美玲', email: 'meilin@email.com', plan: '基礎方案', amount: 25000, returnRate: 7.4, profit: 1850, date: '2024-03-12', status: 'active', emoji: '👩' },
    { id: 5, name: '黃志偉', email: 'hw8899@email.com', plan: '專業方案', amount: 80000, returnRate: 8.1, profit: 6480, date: '2024-01-30', status: 'active', emoji: '🧑' },
    { id: 6, name: 'Sarah Kim', email: 'sarah.k@email.com', plan: '基礎方案', amount: 15000, returnRate: 6.8, profit: 1020, date: '2024-04-05', status: 'pending', emoji: '👩‍🦰' },
    { id: 7, name: '吳家豪', email: 'jiahao.wu@email.com', plan: 'VIP 方案', amount: 280000, returnRate: 9.8, profit: 27440, date: '2023-12-01', status: 'active', emoji: '👨' },
    { id: 8, name: '劉淑芬', email: 'sf.liu@email.com', plan: '專業方案', amount: 65000, returnRate: 8.4, profit: 5460, date: '2024-02-25', status: 'active', emoji: '👩‍🦳' },
    { id: 9, name: 'James Lee', email: 'james.lee@email.com', plan: '基礎方案', amount: 12000, returnRate: 0, profit: 0, date: '2024-05-01', status: 'pending', emoji: '🧑‍💻' },
    { id: 10, name: '蔡明宏', email: 'mh.tsai@email.com', plan: '專業方案', amount: 95000, returnRate: 7.9, profit: 7505, date: '2024-01-10', status: 'active', emoji: '👨‍💻' },
    { id: 11, name: '許芷瑄', email: 'cc.hsu@email.com', plan: '基礎方案', amount: 18000, returnRate: 6.2, profit: 1116, date: '2024-03-28', status: 'inactive', emoji: '👧' },
    { id: 12, name: 'David Chen', email: 'david.c@email.com', plan: 'VIP 方案', amount: 420000, returnRate: 9.5, profit: 39900, date: '2023-10-15', status: 'active', emoji: '👨‍🦱' },
  ];

  const trades = [
    { time: '15:47:23', pair: 'BTC/USDT', type: 'BUY', entry: 67234.5, exit: 68891.2, qty: 2.5, pnl: 4141.75, status: '已完成' },
    { time: '15:32:11', pair: 'ETH/USDT', type: 'SELL', entry: 3847.2, exit: 3692.8, qty: 15, pnl: 2316.0, status: '已完成' },
    { time: '14:58:44', pair: 'SOL/USDT', type: 'BUY', entry: 142.8, exit: 156.4, qty: 200, pnl: 2720.0, status: '已完成' },
    { time: '14:23:09', pair: 'BNB/USDT', type: 'BUY', entry: 512.3, exit: 498.7, qty: 50, pnl: -680.0, status: '已完成' },
    { time: '13:47:55', pair: 'AVAX/USDT', type: 'SELL', entry: 38.72, exit: 36.14, qty: 800, pnl: 2064.0, status: '已完成' },
    { time: '13:12:30', pair: 'LINK/USDT', type: 'BUY', entry: 14.82, exit: 16.47, qty: 2000, pnl: 3300.0, status: '已完成' },
    { time: '12:38:17', pair: 'BTC/USDT', type: 'SELL', entry: 68245.0, exit: 67890.0, qty: 1.8, pnl: -639.0, status: '已完成' },
    { time: '11:55:42', pair: 'ETH/USDT', type: 'BUY', entry: 3712.4, exit: 3891.6, qty: 20, pnl: 3584.0, status: '已完成' },
    { time: '現在', pair: 'SOL/USDT', type: 'BUY', entry: 158.9, exit: '-', qty: 150, pnl: null, status: '持倉中' },
    { time: '現在', pair: 'BTC/USDT', type: 'BUY', entry: 68120.0, exit: '-', qty: 3.0, pnl: null, status: '持倉中' },
  ];

  const applications = [
    { name: 'Sarah Kim', email: 'sarah.k@email.com', plan: '基礎方案', amount: '$15,000 USDT', date: '2024-05-18' },
    { name: 'James Lee', email: 'james.lee@email.com', plan: '基礎方案', amount: '$12,000 USDT', date: '2024-05-19' },
    { name: '王大明', email: 'wdm@email.com', plan: '專業方案', amount: '$55,000 USDT', date: '2024-05-20' },
  ];

  // ==============================
  // SIDEBAR NAVIGATION
  // ==============================
  const pages = ['overview', 'investors', 'trades', 'reports', 'applications', 'settings'];
  const pageTitles = {
    overview: '總覽儀表板',
    investors: '投資者管理',
    trades: '交易記錄',
    reports: '績效報告',
    applications: '申請審核',
    settings: '系統設定'
  };

  function showPage(pageId) {
    pages.forEach(p => {
      document.getElementById(`page-${p}`)?.classList.remove('active');
      document.getElementById(`nav-${p}`)?.classList.remove('active');
    });
    document.getElementById(`page-${pageId}`)?.classList.add('active');
    document.getElementById(`nav-${pageId}`)?.classList.add('active');
    document.getElementById('page-title').textContent = pageTitles[pageId] || '';

    if (pageId === 'overview') renderOverviewCharts();
    if (pageId === 'trades') renderTradesTable();
    if (pageId === 'applications') renderApplications();
  }

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showPage(item.dataset.page);
    });
  });

  // Also handle the "查看全部" link in overview trades
  document.querySelectorAll('[data-page="trades"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showPage('trades');
    });
  });

  // ==============================
  // OVERVIEW CHARTS
  // ==============================
  function renderOverviewCharts() {
    // AUM Chart
    const aumCanvas = document.getElementById('overview-chart');
    if (!aumCanvas || aumCanvas.dataset.rendered) return;
    aumCanvas.dataset.rendered = '1';

    setTimeout(() => {
      const ctx = aumCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = aumCanvas.getBoundingClientRect();
      aumCanvas.width = rect.width * dpr;
      aumCanvas.height = 200 * dpr;
      aumCanvas.style.width = '100%';
      aumCanvas.style.height = '200px';
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = 200;
      const data = [154, 162, 171, 168, 183, 197, 208, 219, 234, 251, 268, 284.7];
      const labels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      const pad = { top: 20, right: 20, bottom: 36, left: 52 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top - pad.bottom;
      const min = 140, max = 300;

      const tx = i => pad.left + (i / (data.length - 1)) * cw;
      const ty = v => pad.top + ch - ((v - min) / (max - min)) * ch;

      // Grid
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (i / 4) * ch;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + cw, y);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = `10px Inter`;
        ctx.textAlign = 'right';
        ctx.fillText('$' + (max - (i / 4) * (max - min)).toFixed(0) + 'M', pad.left - 6, y + 4);
      }

      // Month labels
      labels.forEach((l, i) => {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(l, tx(i), h - 8);
      });

      // Area
      const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');

      ctx.beginPath();
      data.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.lineTo(tx(data.length - 1), h - pad.bottom);
      ctx.lineTo(tx(0), h - pad.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      data.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Bars
      data.forEach((v, i) => {
        const barW = cw / data.length * 0.5;
        ctx.fillStyle = 'rgba(0, 212, 255, 0.08)';
        ctx.fillRect(tx(i) - barW / 2, ty(v), barW, h - pad.bottom - ty(v));
      });

      // Dots
      data.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(tx(i), ty(v), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
        ctx.strokeStyle = '#06090f';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }, 100);

    // Allocation Donut
    const allocCanvas = document.getElementById('allocation-chart');
    if (!allocCanvas) return;
    setTimeout(() => {
      const ac = allocCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const s = 200;
      allocCanvas.width = s * dpr;
      allocCanvas.height = s * dpr;
      allocCanvas.style.width = s + 'px';
      allocCanvas.style.height = s + 'px';
      ac.scale(dpr, dpr);

      const data = [
        { label: 'BTC', pct: 35, color: '#f0b429' },
        { label: 'ETH', pct: 25, color: '#00d4ff' },
        { label: 'SOL', pct: 15, color: '#a855f7' },
        { label: 'BNB', pct: 12, color: '#00e676' },
        { label: 'Others', pct: 13, color: '#3b82f6' },
      ];

      const cx = s / 2, cy = s / 2, outerR = 80, innerR = 52;
      let start = -Math.PI / 2;

      data.forEach(d => {
        const angle = (d.pct / 100) * Math.PI * 2;
        ac.beginPath();
        ac.moveTo(cx, cy);
        ac.arc(cx, cy, outerR, start, start + angle);
        ac.arc(cx, cy, innerR, start + angle, start, true);
        ac.closePath();
        ac.fillStyle = d.color;
        ac.fill();
        ac.strokeStyle = '#06090f';
        ac.lineWidth = 2;
        ac.stroke();
        start += angle;
      });

      // Center text
      ac.fillStyle = 'rgba(255,255,255,0.9)';
      ac.font = `bold 18px Space Grotesk`;
      ac.textAlign = 'center';
      ac.fillText('5', cx, cy + 2);
      ac.font = '10px Inter';
      ac.fillStyle = 'rgba(255,255,255,0.4)';
      ac.fillText('資產', cx, cy + 16);

      // Legend
      const legend = document.getElementById('alloc-legend');
      if (legend) {
        legend.innerHTML = data.map(d => `
          <div class="legend-item">
            <span class="legend-label"><span class="legend-dot" style="background:${d.color}"></span>${d.label}</span>
            <span class="legend-value">${d.pct}%</span>
          </div>
        `).join('');
      }
    }, 150);

    // Recent trades in overview
    renderOverviewTrades();
    renderTopInvestors();
  }

  function renderOverviewTrades() {
    const el = document.getElementById('recent-trades-list');
    if (!el) return;
    const icons = { 'BTC': '₿', 'ETH': 'Ξ', 'SOL': '◎', 'BNB': 'B', 'AVAX': 'A', 'LINK': 'L' };
    el.innerHTML = trades.slice(0, 5).map(t => {
      const base = t.pair.split('/')[0];
      const icon = icons[base] || base[0];
      const pnlText = t.pnl === null ? '持倉中' : (t.pnl >= 0 ? '+$' + t.pnl.toLocaleString() : '-$' + Math.abs(t.pnl).toLocaleString());
      const isPos = t.pnl === null ? null : t.pnl >= 0;
      return `
        <div class="trade-row">
          <div class="trade-icon ${t.type.toLowerCase()}">${icon}</div>
          <div class="trade-info">
            <div class="trade-pair-name">${t.pair}</div>
            <div class="trade-meta">${t.type} · ${t.qty} · ${t.time}</div>
          </div>
          <div class="trade-amount">
            <div class="amount ${t.pnl === null ? '' : isPos ? 'pos' : 'neg'}" style="${t.pnl===null?'color:var(--orange)':''}">${pnlText}</div>
            <div class="time">${t.status}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTopInvestors() {
    const el = document.getElementById('top-investors-list');
    if (!el) return;
    const sorted = [...investors].filter(i => i.status === 'active').sort((a, b) => b.returnRate - a.returnRate).slice(0, 5);
    el.innerHTML = sorted.map((inv, idx) => `
      <div class="trade-row">
        <div class="investor-avatar" style="background: ${['rgba(240,180,41,0.15)','rgba(0,212,255,0.15)','rgba(168,85,247,0.15)','rgba(0,230,118,0.15)','rgba(59,130,246,0.15)'][idx]}">
          ${inv.emoji}
        </div>
        <div class="trade-info">
          <div class="trade-pair-name">${inv.name}</div>
          <div class="trade-meta">${inv.plan} · $${inv.amount.toLocaleString()} USDT</div>
        </div>
        <div class="trade-amount">
          <div class="amount pos">+${inv.returnRate}%</div>
          <div class="time">本月報酬</div>
        </div>
      </div>
    `).join('');
  }

  // ==============================
  // INVESTOR TABLE
  // ==============================
  let currentFilter = 'all';
  let currentPage = 1;
  const perPage = 8;
  let searchQuery = '';
  let filteredInvestors = [...investors];

  function renderInvestorTable() {
    const filtered = investors.filter(inv => {
      const matchFilter = currentFilter === 'all' || inv.status === currentFilter;
      const matchSearch = !searchQuery ||
        inv.name.toLowerCase().includes(searchQuery) ||
        inv.email.toLowerCase().includes(searchQuery) ||
        inv.plan.toLowerCase().includes(searchQuery);
      return matchFilter && matchSearch;
    });

    filteredInvestors = filtered;
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (currentPage - 1) * perPage;
    const pageData = filtered.slice(start, start + perPage);

    const statusMap = {
      active: '<span class="status-badge active"><span class="status-dot"></span>活躍</span>',
      pending: '<span class="status-badge pending"><span class="status-dot"></span>審核中</span>',
      inactive: '<span class="status-badge inactive"><span class="status-dot"></span>停用</span>'
    };

    const planColors = { 'VIP 方案': '#f0b429', '專業方案': '#00d4ff', '基礎方案': '#a855f7' };

    const tbody = document.getElementById('investor-tbody');
    tbody.innerHTML = pageData.map(inv => `
      <tr>
        <td>
          <div class="td-name">
            <div class="investor-avatar" style="background:rgba(255,255,255,0.06)">${inv.emoji}</div>
            <div>
              <div class="investor-name">${inv.name}</div>
              <div class="investor-email">${inv.email}</div>
            </div>
          </div>
        </td>
        <td style="color:${planColors[inv.plan] || 'var(--text-secondary)'}; font-weight:600">${inv.plan}</td>
        <td style="color:var(--text-primary); font-weight:600">$${inv.amount.toLocaleString()}</td>
        <td class="profit-cell ${inv.returnRate > 0 ? 'pos' : ''}">${inv.returnRate > 0 ? '+' : ''}${inv.returnRate}%</td>
        <td class="profit-cell ${inv.profit > 0 ? 'pos' : ''}">${inv.profit > 0 ? '+$' : '$'}${inv.profit.toLocaleString()}</td>
        <td>${inv.date}</td>
        <td>${statusMap[inv.status] || ''}</td>
        <td>
          <button class="action-btn" data-id="${inv.id}">詳情</button>
        </td>
      </tr>
    `).join('');

    // Info
    document.getElementById('table-info').textContent =
      `顯示 ${total === 0 ? 0 : start + 1}-${Math.min(start + perPage, total)} / 共 ${total} 位投資者`;

    // Pagination
    const pagEl = document.getElementById('pagination');
    pagEl.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => { currentPage = i; renderInvestorTable(); });
      pagEl.appendChild(btn);
    }
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      renderInvestorTable();
    });
  });

  // Search
  const searchInput = document.getElementById('investor-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase();
      currentPage = 1;
      renderInvestorTable();
    });
  }

  // ==============================
  // TRADES TABLE
  // ==============================
  function renderTradesTable() {
    const tbody = document.getElementById('trades-tbody');
    if (!tbody || tbody.dataset.rendered) return;
    tbody.dataset.rendered = '1';

    tbody.innerHTML = trades.map(t => {
      const pnlText = t.pnl === null ? '—' : (t.pnl >= 0 ? `+$${t.pnl.toLocaleString()}` : `-$${Math.abs(t.pnl).toLocaleString()}`);
      const pnlClass = t.pnl === null ? '' : t.pnl >= 0 ? 'pos' : 'neg';
      const typeClass = t.type === 'BUY' ? 'buy' : 'sell';
      const statusColor = t.status === '持倉中' ? 'var(--orange)' : 'var(--text-muted)';
      return `
        <tr>
          <td style="font-family:monospace; color:var(--text-muted)">${t.time}</td>
          <td style="color:var(--text-primary); font-weight:700">${t.pair}</td>
          <td><span class="trade-type ${typeClass}">${t.type}</span></td>
          <td>$${t.entry.toLocaleString()}</td>
          <td>${t.exit === '-' ? '<span style="color:var(--text-muted)">—</span>' : '$' + t.exit.toLocaleString()}</td>
          <td>${t.qty}</td>
          <td class="profit-cell ${pnlClass}">${pnlText}</td>
          <td style="color:${statusColor}; font-weight:600">${t.status}</td>
        </tr>
      `;
    }).join('');
  }

  // ==============================
  // APPLICATIONS TABLE
  // ==============================
  function renderApplications() {
    const tbody = document.getElementById('applications-tbody');
    if (!tbody || tbody.dataset.rendered) return;
    tbody.dataset.rendered = '1';

    tbody.innerHTML = applications.map((app, i) => `
      <tr>
        <td>
          <div class="td-name">
            <div class="investor-avatar" style="background:rgba(240,180,41,0.1); color:var(--gold)">📋</div>
            <div>
              <div class="investor-name">${app.name}</div>
              <div class="investor-email">${app.email}</div>
            </div>
          </div>
        </td>
        <td style="color:var(--cyan); font-weight:600">${app.plan}</td>
        <td style="color:var(--text-primary); font-weight:600">${app.amount}</td>
        <td style="color:var(--text-muted)">${app.date}</td>
        <td>
          <div style="display:flex; gap:8px">
            <button class="action-btn" onclick="alert('✅ 已核准 ${app.name} 的申請！')" style="color:var(--green); border-color:rgba(0,230,118,0.3)">✓ 核准</button>
            <button class="action-btn" onclick="alert('❌ 已拒絕 ${app.name} 的申請。')" style="color:var(--red); border-color:rgba(255,71,87,0.3)">✕ 拒絕</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ==============================
  // MODAL
  // ==============================
  const modalOverlay = document.getElementById('modal-overlay');
  const addBtn = document.getElementById('add-investor-btn');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');

  addBtn?.addEventListener('click', () => modalOverlay.classList.add('open'));
  closeBtn?.addEventListener('click', () => modalOverlay.classList.remove('open'));
  cancelBtn?.addEventListener('click', () => modalOverlay.classList.remove('open'));
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

  document.getElementById('add-investor-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('modal-name').value;
    const email = document.getElementById('modal-email').value;
    const plan = document.getElementById('modal-plan').value;
    const amount = parseInt(document.getElementById('modal-amount').value);

    investors.unshift({
      id: investors.length + 1,
      name, email, plan, amount,
      returnRate: 0, profit: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      emoji: '🆕'
    });

    modalOverlay.classList.remove('open');
    renderInvestorTable();
    e.target.reset();

    // Flash notification
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: rgba(0,230,118,0.15); border: 1px solid rgba(0,230,118,0.4);
      color: #00e676; padding: 14px 22px; border-radius: 12px;
      font-size: 14px; font-weight: 600; animation: fadeIn 0.3s ease;
    `;
    flash.textContent = `✅ 投資者 ${name} 已新增成功`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 3000);
  });

  // ==============================
  // LIVE KPI UPDATE
  // ==============================
  let aum = 284.7;
  setInterval(() => {
    aum += (Math.random() - 0.45) * 0.3;
    const aumEl = document.getElementById('kpi-aum');
    if (aumEl) aumEl.textContent = '$' + aum.toFixed(1) + 'M';
  }, 3000);

  // ==============================
  // INIT
  // ==============================
  renderOverviewCharts();
  renderInvestorTable();
  showPage('overview');

});
