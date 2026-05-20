/* =============================================
   TRANSAI — Landing Page JavaScript
   Particles, Counters, Charts, Interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // NAVBAR SCROLL
  // ==============================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ==============================
  // HERO CANVAS PARTICLES
  // ==============================
  const heroCanvas = document.getElementById('hero-canvas');
  const ctx = heroCanvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#00d4ff' : '#f0b429';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > heroCanvas.width || this.y < 0 || this.y > heroCanvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00d4ff';
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==============================
  // LIVE CHART (Hero Card)
  // ==============================
  const liveCanvas = document.getElementById('live-chart-canvas');
  if (liveCanvas) {
    const lc = liveCanvas.getContext('2d');
    liveCanvas.width = liveCanvas.offsetWidth * window.devicePixelRatio || 400;
    liveCanvas.height = 120 * (window.devicePixelRatio || 1);
    liveCanvas.style.width = '100%';
    liveCanvas.style.height = '120px';
    lc.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    let liveData = [];
    for (let i = 0; i < 50; i++) {
      liveData.push(50 + Math.random() * 30 - 15 + i * 0.4);
    }

    function drawLiveChart() {
      const w = liveCanvas.width / (window.devicePixelRatio || 1);
      const h = 120;
      lc.clearRect(0, 0, w, h);

      const max = Math.max(...liveData);
      const min = Math.min(...liveData);
      const range = max - min || 1;

      const pts = liveData.map((v, i) => ({
        x: (i / (liveData.length - 1)) * w,
        y: h - ((v - min) / range) * (h - 20) - 10
      }));

      // Area fill
      const grad = lc.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');

      lc.beginPath();
      lc.moveTo(pts[0].x, h);
      pts.forEach(p => lc.lineTo(p.x, p.y));
      lc.lineTo(pts[pts.length - 1].x, h);
      lc.closePath();
      lc.fillStyle = grad;
      lc.fill();

      // Line
      lc.beginPath();
      pts.forEach((p, i) => i === 0 ? lc.moveTo(p.x, p.y) : lc.lineTo(p.x, p.y));
      lc.strokeStyle = '#00d4ff';
      lc.lineWidth = 2;
      lc.lineJoin = 'round';
      lc.stroke();

      // Dot at end
      const last = pts[pts.length - 1];
      lc.beginPath();
      lc.arc(last.x, last.y, 4, 0, Math.PI * 2);
      lc.fillStyle = '#00d4ff';
      lc.fill();
      lc.beginPath();
      lc.arc(last.x, last.y, 7, 0, Math.PI * 2);
      lc.fillStyle = 'rgba(0, 212, 255, 0.2)';
      lc.fill();
    }

    drawLiveChart();

    // Animate live data
    setInterval(() => {
      const last = liveData[liveData.length - 1];
      const next = last + (Math.random() - 0.45) * 3;
      liveData.push(Math.max(20, Math.min(100, next)));
      liveData.shift();
      drawLiveChart();
    }, 1200);
  }

  // ==============================
  // ANIMATED LIVE AMOUNT
  // ==============================
  let baseAmount = 1284937;
  const liveAmountEl = document.getElementById('live-amount');
  const livePctEl = document.getElementById('live-pct');

  setInterval(() => {
    baseAmount += Math.floor((Math.random() - 0.3) * 1200);
    if (liveAmountEl) liveAmountEl.textContent = baseAmount.toLocaleString();
    const pct = (18.4 + Math.random() * 0.2 - 0.1).toFixed(1);
    if (livePctEl) livePctEl.textContent = pct;
  }, 2000);

  // ==============================
  // LIVE TRADE FEED
  // ==============================
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'AVAX/USDT', 'LINK/USDT'];
  const tradeList = document.getElementById('trade-list');

  function addTrade() {
    if (!tradeList) return;
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const isBuy = Math.random() > 0.35;
    const profit = (Math.random() * 3000 + 200).toFixed(0);
    const isPos = isBuy || Math.random() > 0.3;

    const item = document.createElement('div');
    item.className = 'trade-item';
    item.style.opacity = '0';
    item.style.transform = 'translateX(10px)';
    item.innerHTML = `
      <span class="trade-pair">${pair}</span>
      <span class="trade-type ${isBuy ? 'buy' : 'sell'}">${isBuy ? 'BUY' : 'SELL'}</span>
      <span class="trade-profit ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : '-'}$${Number(profit).toLocaleString()}</span>
    `;

    tradeList.insertBefore(item, tradeList.firstChild);
    if (tradeList.children.length > 3) tradeList.removeChild(tradeList.lastChild);

    setTimeout(() => {
      item.style.transition = 'all 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 50);
  }

  setInterval(addTrade, 3000);

  // ==============================
  // STATS COUNTER ANIMATION
  // ==============================
  function animateCount(el, end, prefix = '', suffix = '', decimals = 0) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (end - start) * eased;

      if (decimals > 0) {
        el.textContent = prefix + value.toFixed(decimals) + suffix;
      } else if (end >= 1000000) {
        el.textContent = prefix + (value / 1000000).toFixed(1) + 'B' + suffix;
      } else {
        el.textContent = prefix + Math.round(value).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(document.getElementById('stat-aum'), 284700000, '$', '', 0);
        animateCount(document.getElementById('stat-return'), 84.2, '', '%', 1);
        animateCount(document.getElementById('stat-investors'), 2847, '', '', 0);
        animateCount(document.getElementById('stat-winrate'), 91.3, '', '%', 1);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsObserver.observe(statsBar);

  // ==============================
  // PERFORMANCE CHART
  // ==============================
  const perfCanvas = document.getElementById('perf-chart');
  if (perfCanvas) {
    const pc = perfCanvas.getContext('2d');

    function setupCanvas(canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr || 500;
      canvas.height = 250 * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '250px';
      pc.scale(dpr, dpr);
    }

    setupCanvas(perfCanvas);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const transaiData = [100, 108, 121, 118, 134, 147, 156, 162, 178, 192, 210, 231];
    const benchmarkData = [100, 102, 98, 105, 108, 104, 109, 112, 107, 115, 118, 120];

    function drawPerfChart() {
      const w = perfCanvas.width / (window.devicePixelRatio || 1);
      const h = 250;
      pc.clearRect(0, 0, w, h);

      const padding = { top: 20, right: 20, bottom: 40, left: 50 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      const allValues = [...transaiData, ...benchmarkData];
      const minV = Math.min(...allValues) - 5;
      const maxV = Math.max(...allValues) + 10;

      const toX = i => padding.left + (i / (months.length - 1)) * chartW;
      const toY = v => padding.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

      // Grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        pc.beginPath();
        pc.moveTo(padding.left, y);
        pc.lineTo(padding.left + chartW, y);
        pc.strokeStyle = 'rgba(255,255,255,0.05)';
        pc.lineWidth = 1;
        pc.stroke();

        const val = maxV - (i / 4) * (maxV - minV);
        pc.fillStyle = 'rgba(255,255,255,0.25)';
        pc.font = '10px Inter';
        pc.textAlign = 'right';
        pc.fillText(val.toFixed(0), padding.left - 6, y + 4);
      }

      // Month labels
      months.forEach((m, i) => {
        pc.fillStyle = 'rgba(255,255,255,0.25)';
        pc.font = '10px Inter';
        pc.textAlign = 'center';
        pc.fillText(m, toX(i), h - 10);
      });

      // Benchmark area
      pc.beginPath();
      benchmarkData.forEach((v, i) => {
        if (i === 0) pc.moveTo(toX(i), toY(v));
        else pc.lineTo(toX(i), toY(v));
      });
      pc.lineTo(toX(benchmarkData.length - 1), h - padding.bottom);
      pc.lineTo(toX(0), h - padding.bottom);
      pc.closePath();
      pc.fillStyle = 'rgba(255,255,255,0.03)';
      pc.fill();

      pc.beginPath();
      benchmarkData.forEach((v, i) => {
        if (i === 0) pc.moveTo(toX(i), toY(v));
        else pc.lineTo(toX(i), toY(v));
      });
      pc.strokeStyle = 'rgba(255,255,255,0.2)';
      pc.lineWidth = 1.5;
      pc.setLineDash([4, 4]);
      pc.stroke();
      pc.setLineDash([]);

      // TRANSAI gradient area
      const grad = pc.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      grad.addColorStop(0, 'rgba(240, 180, 41, 0.3)');
      grad.addColorStop(1, 'rgba(240, 180, 41, 0)');

      pc.beginPath();
      transaiData.forEach((v, i) => {
        if (i === 0) pc.moveTo(toX(i), toY(v));
        else pc.lineTo(toX(i), toY(v));
      });
      pc.lineTo(toX(transaiData.length - 1), h - padding.bottom);
      pc.lineTo(toX(0), h - padding.bottom);
      pc.closePath();
      pc.fillStyle = grad;
      pc.fill();

      // TRANSAI line
      pc.beginPath();
      transaiData.forEach((v, i) => {
        if (i === 0) pc.moveTo(toX(i), toY(v));
        else pc.lineTo(toX(i), toY(v));
      });
      pc.strokeStyle = '#f0b429';
      pc.lineWidth = 2.5;
      pc.lineJoin = 'round';
      pc.stroke();

      // Data points
      transaiData.forEach((v, i) => {
        pc.beginPath();
        pc.arc(toX(i), toY(v), 3.5, 0, Math.PI * 2);
        pc.fillStyle = '#f0b429';
        pc.fill();
        pc.strokeStyle = '#070b14';
        pc.lineWidth = 1.5;
        pc.stroke();
      });

      // Legend
      const legendY = padding.top + 4;
      pc.fillStyle = '#f0b429';
      pc.fillRect(padding.left, legendY, 20, 3);
      pc.fillStyle = 'rgba(255,255,255,0.6)';
      pc.font = '11px Inter';
      pc.textAlign = 'left';
      pc.fillText('TRANSAI NAV', padding.left + 26, legendY + 8);

      pc.strokeStyle = 'rgba(255,255,255,0.3)';
      pc.lineWidth = 1.5;
      pc.setLineDash([4, 4]);
      pc.beginPath();
      pc.moveTo(padding.left + 140, legendY + 1.5);
      pc.lineTo(padding.left + 160, legendY + 1.5);
      pc.stroke();
      pc.setLineDash([]);
      pc.fillStyle = 'rgba(255,255,255,0.3)';
      pc.fillText('大盤基準', padding.left + 166, legendY + 8);
    }

    const chartObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setupCanvas(perfCanvas);
        drawPerfChart();
        chartObserver.disconnect();
      }
    }, { threshold: 0.2 });

    chartObserver.observe(perfCanvas);
    window.addEventListener('resize', () => { setupCanvas(perfCanvas); drawPerfChart(); });
  }

  // ==============================
  // FAQ ACCORDION
  // ==============================
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ==============================
  // PLAN BUTTONS → SCROLL TO FORM
  // ==============================
  const planMap = { 'basic-plan-btn': 'basic', 'pro-plan-btn': 'pro', 'vip-plan-btn': 'vip' };
  Object.entries(planMap).forEach(([btnId, planValue]) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener('click', () => {
      document.getElementById('join').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const planSelect = document.getElementById('invest-plan');
        if (planSelect) planSelect.value = planValue;
      }, 600);
    });
  });

  // ==============================
  // JOIN FORM SUBMIT
  // ==============================
  const joinForm = document.getElementById('join-form');
  const formSuccess = document.getElementById('form-success');

  if (joinForm) {
    joinForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('join-submit-btn');
      btn.textContent = '⏳ 送出中...';
      btn.disabled = true;

      setTimeout(() => {
        joinForm.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 1500);
    });
  }

  // ==============================
  // INTERSECTION OBSERVER — SCROLL ANIMATIONS
  // ==============================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .kpi-card, .pricing-card, .perf-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
