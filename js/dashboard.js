/* =============================================
   TRANSAI — Dashboard JavaScript
   AI Bots Wallet: Table, Modals, Live Data
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // BOT DATA
  // ==============================
  let bots = [
    {
      id: 1,
      coin: '₿',
      coinColor: '#f7931a',
      name: 'BTC-PERP',
      strategy: 'Futures Grid',
      direction: 'Long',
      leverage: '100.00x',
      asset: 604.25,
      botMargin: 500.25,
      totalPnl: 104.25,
      roi: 184.22,
      initialMargin: 500.00,
      startTime: Date.now() - (2 * 3600 + 5 * 60) * 1000, // 0d-02h-05m ago
    },
    {
      id: 2,
      coin: 'Ξ',
      coinColor: '#627eea',
      name: 'ETH-PERP',
      strategy: 'Futures Grid',
      direction: 'Long',
      leverage: '50.00x',
      asset: 312.80,
      botMargin: 280.00,
      totalPnl: 32.80,
      roi: 58.4,
      initialMargin: 280.00,
      startTime: Date.now() - (1 * 3600 + 22 * 60) * 1000,
    },
    {
      id: 3,
      coin: '◎',
      coinColor: '#9945ff',
      name: 'SOL-PERP',
      strategy: 'Spot Grid',
      direction: 'Long',
      leverage: '10.00x',
      asset: 158.40,
      botMargin: 140.00,
      totalPnl: 18.40,
      roi: 42.1,
      initialMargin: 140.00,
      startTime: Date.now() - (0 * 3600 + 38 * 60) * 1000,
    },
  ];

  // ==============================
  // UTILITIES
  // ==============================
  function formatDuration(startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const days = Math.floor(elapsed / 86400);
    const hours = Math.floor((elapsed % 86400) / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    return `${days}d-${String(hours).padStart(2,'0')}h-${String(mins).padStart(2,'0')}m`;
  }

  function showToast(msg, type = 'default') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast${type !== 'default' ? ' ' + type : ''}`;
    toast.innerHTML = `${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==============================
  // RENDER BOTS TABLE
  // ==============================
  function renderBots() {
    const tbody = document.getElementById('bots-tbody');
    if (!tbody) return;

    if (bots.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8"><div class="table-empty">No active bots. Click <strong>Join AI Bots</strong> to get started.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = bots.map(bot => `
      <tr data-bot-id="${bot.id}">
        <td>
          <div class="bot-name-cell">
            <div class="bot-coin-icon" style="background:${bot.coinColor}20;color:${bot.coinColor};font-size:13px">${bot.coin}</div>
            <div>
              <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
                <span class="bot-name">${bot.name}</span>
                <span class="tag tag-${bot.direction === 'Long' ? 'long' : 'short'}">${bot.direction}</span>
                <span class="tag tag-lev">${bot.leverage}</span>
              </div>
              <div class="bot-strategy">${bot.strategy}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="num-mono">${bot.asset.toFixed(8)}</div>
          <div class="sub-text">USDT</div>
        </td>
        <td>
          <div class="num-mono">${bot.botMargin.toFixed(8)}</div>
          <div class="sub-text">USDT</div>
        </td>
        <td>
          <div class="num-mono pnl-pos">+${bot.totalPnl.toFixed(8)}</div>
          <div class="sub-text">USDT</div>
        </td>
        <td>
          <span class="roi-badge">+${bot.roi.toFixed(2)}%</span>
        </td>
        <td>
          <div class="num-mono">${bot.initialMargin.toFixed(8)}</div>
          <div class="sub-text">USDT</div>
        </td>
        <td>
          <div class="num-mono" id="duration-${bot.id}">${formatDuration(bot.startTime)}</div>
        </td>
        <td>
          <button class="btn-exit" data-bot-id="${bot.id}" onclick="window.openExitModal(${bot.id})">Exit</button>
        </td>
      </tr>
    `).join('');
  }

  renderBots();

  // Live duration timer
  setInterval(() => {
    bots.forEach(bot => {
      const el = document.getElementById(`duration-${bot.id}`);
      if (el) el.textContent = formatDuration(bot.startTime);
    });
  }, 30000);

  // Live P&L fluctuation
  setInterval(() => {
    bots.forEach(bot => {
      bot.totalPnl += (Math.random() - 0.45) * 2;
      bot.asset = bot.botMargin + bot.totalPnl;
      bot.roi = (bot.totalPnl / bot.initialMargin) * 100 * (bot.leverage ? parseFloat(bot.leverage) : 1);
    });
    renderBots();

    // Update balance
    const total = bots.reduce((s, b) => s + b.asset, 0) + 499750;
    const balEl = document.getElementById('live-balance');
    if (balEl) balEl.textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // P&L
    const totalPnl = bots.reduce((s, b) => s + b.totalPnl, 0);
    const pnlEl = document.getElementById('pnl-amount');
    if (pnlEl) pnlEl.textContent = (999.51 + totalPnl).toFixed(2);
  }, 4000);

  // ==============================
  // TABS: Active Bots / Assets
  // ==============================
  document.querySelectorAll('.card-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.card-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('tab-active-bots').style.display = target === 'active-bots' ? '' : 'none';
      document.getElementById('tab-assets-content').style.display = target === 'assets' ? '' : 'none';
    });
  });

  // ==============================
  // P&L TABS
  // ==============================
  const pnlValues = { '7d': 999.51, '30d': 4287.34 };
  document.getElementById('pnl-7d')?.addEventListener('click', function() {
    document.querySelectorAll('.pnl-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const el = document.getElementById('pnl-amount');
    if (el) el.textContent = pnlValues['7d'].toFixed(2);
  });
  document.getElementById('pnl-30d')?.addEventListener('click', function() {
    document.querySelectorAll('.pnl-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const el = document.getElementById('pnl-amount');
    if (el) el.textContent = pnlValues['30d'].toFixed(2);
  });

  // ==============================
  // MODAL HELPERS
  // ==============================
  function openModal(id) {
    document.getElementById(id)?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close buttons via data-close
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // Click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ==============================
  // MODAL 1: TRANSFER FUNDS
  // ==============================
  document.getElementById('btn-transfer')?.addEventListener('click', () => {
    openModal('modal-transfer');
  });

  // Swap direction
  let swapped = false;
  document.getElementById('swap-direction')?.addEventListener('click', () => {
    swapped = !swapped;
    const fromEl = document.getElementById('tf-from');
    const toEl = document.getElementById('tf-to');
    if (swapped) {
      fromEl.querySelector('span').textContent = 'AI Bots Wallet';
      toEl.querySelector('span').textContent = 'Spot Wallet';
    } else {
      fromEl.querySelector('span').textContent = 'Spot Wallet';
      toEl.querySelector('span').textContent = 'AI Bots Wallet';
    }
  });

  // MAX button
  document.getElementById('tf-max-btn')?.addEventListener('click', () => {
    document.getElementById('tf-amount-input').value = '123789123456.004';
  });

  // Confirm transfer
  document.getElementById('tf-confirm-btn')?.addEventListener('click', () => {
    const amount = document.getElementById('tf-amount-input')?.value;
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    closeModal('modal-transfer');
    showToast(`✅ Transfer of ${parseFloat(amount).toLocaleString()} USDT confirmed!`, 'success');
    document.getElementById('tf-amount-input').value = '';
  });

  // ==============================
  // MODAL 2: RISK ACKNOWLEDGEMENT (Join)
  // ==============================
  document.getElementById('btn-join')?.addEventListener('click', () => {
    // Reset checkbox
    const cb = document.getElementById('risk-checkbox');
    const confirmBtn = document.getElementById('risk-confirm-btn');
    if (cb) cb.checked = false;
    if (confirmBtn) confirmBtn.disabled = true;
    openModal('modal-risk');
  });

  // Enable confirm when checkbox checked
  document.getElementById('risk-checkbox')?.addEventListener('change', function() {
    const confirmBtn = document.getElementById('risk-confirm-btn');
    if (confirmBtn) confirmBtn.disabled = !this.checked;
  });

  // After risk confirm → open transfer modal
  document.getElementById('risk-confirm-btn')?.addEventListener('click', () => {
    closeModal('modal-risk');
    setTimeout(() => {
      openModal('modal-transfer');
    }, 200);
  });

  // ==============================
  // MODAL 3: EXIT BOT
  // ==============================
  window.openExitModal = function(botId) {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    document.getElementById('exit-bot-name').textContent = `${bot.name} · ${bot.strategy}`;
    document.getElementById('exit-asset').textContent = `${bot.asset.toFixed(8)} USDT`;
    document.getElementById('exit-pnl').textContent = `+${bot.totalPnl.toFixed(8)} USDT`;
    document.getElementById('exit-settlement').textContent = `~${bot.asset.toFixed(8)} USDT`;

    document.getElementById('exit-confirm-btn').dataset.botId = botId;
    openModal('modal-exit');
  };

  // Cancel exit
  document.getElementById('exit-cancel-btn')?.addEventListener('click', () => closeModal('modal-exit'));

  // Confirm exit
  document.getElementById('exit-confirm-btn')?.addEventListener('click', function() {
    const botId = parseInt(this.dataset.botId);
    const bot = bots.find(b => b.id === botId);
    bots = bots.filter(b => b.id !== botId);
    closeModal('modal-exit');
    renderBots();
    showToast(`${bot?.name || 'Bot'} position closed successfully`, 'success');
  });

  // Exit All Bots
  document.getElementById('btn-exit-all')?.addEventListener('click', () => {
    if (bots.length === 0) {
      showToast('No active bots to exit', 'error');
      return;
    }
    if (confirm(`Exit all ${bots.length} active bot(s)? This action cannot be undone.`)) {
      bots = [];
      renderBots();
      showToast('All bots exited successfully', 'success');
    }
  });

  // ==============================
  // HISTORY BUTTON
  // ==============================
  document.getElementById('btn-history')?.addEventListener('click', () => {
    showToast('Transaction history will be available soon');
  });

  // ==============================
  // SIDEBAR NAVIGATION
  // ==============================
  document.querySelectorAll('.sb-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const page = item.dataset.page;
      if (page !== 'ai-bots') {
        showToast(`${page.replace('-', ' ')} section coming soon`);
        // Switch back to ai-bots after a moment
        setTimeout(() => {
          document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
          document.getElementById('sb-ai-bots')?.classList.add('active');
        }, 1500);
      }
    });
  });

  // ==============================
  // SORT TABLE HEADERS
  // ==============================
  let sortKey = null;
  let sortAsc = true;

  document.querySelectorAll('#bots-table th[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) {
        sortAsc = !sortAsc;
      } else {
        sortKey = key;
        sortAsc = true;
      }
      bots.sort((a, b) => {
        const av = a[key], bv = b[key];
        return sortAsc ? av - bv : bv - av;
      });
      renderBots();
    });
  });

});
