/* =============================================
   TRANSAI — Landing Page JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // REGISTER MODAL
  // ==============================
  const registerModal = document.getElementById('register-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openRegister(email = '') {
    const emailInput = document.getElementById('reg-email');
    if (emailInput && email) emailInput.value = email;
    registerModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeRegister() {
    registerModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Register button & nav login button
  document.getElementById('nav-register-btn')?.addEventListener('click', e => {
    e.preventDefault();
    openRegister();
  });

  document.getElementById('nav-login-btn')?.addEventListener('click', e => {
    e.preventDefault();
    openRegister();
  });

  modalCloseBtn?.addEventListener('click', closeRegister);

  registerModal?.addEventListener('click', e => {
    if (e.target === registerModal) closeRegister();
  });

  // Hero form
  document.getElementById('hero-start-btn')?.addEventListener('click', () => {
    const email = document.getElementById('hero-email')?.value || '';
    openRegister(email);
  });

  document.getElementById('hero-email')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const email = e.target.value;
      openRegister(email);
    }
  });

  // CTA form
  document.getElementById('cta-btn')?.addEventListener('click', () => {
    const email = document.getElementById('cta-email')?.value || '';
    openRegister(email);
  });

  // Register submit
  document.getElementById('reg-submit-btn')?.addEventListener('click', () => {
    const email = document.getElementById('reg-email')?.value;
    const pwd = document.getElementById('reg-password')?.value;
    if (!email || !pwd) {
      alert('Please fill in all required fields.');
      return;
    }
    // Simulate success — redirect to dashboard
    const btn = document.getElementById('reg-submit-btn');
    btn.textContent = 'Creating account...';
    btn.disabled = true;
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  });

  // ==============================
  // TICKER LIVE UPDATES
  // ==============================
  const priceData = {
    'BTC/USDT': { price: 67234.50, change: 2.34 },
    'ETH/USDT': { price: 3847.20, change: 1.87 },
    'SOL/USDT': { price: 158.90, change: 4.12 },
    'BNB/USDT': { price: 512.30, change: -0.58 },
    'AVAX/USDT': { price: 38.72, change: 3.21 },
    'LINK/USDT': { price: 14.82, change: 5.67 },
    'DOT/USDT': { price: 7.14, change: -1.23 },
    'ADA/USDT': { price: 0.4821, change: 2.09 },
  };

  // Slightly update prices every 2.5s
  setInterval(() => {
    Object.values(priceData).forEach(d => {
      const delta = (Math.random() - 0.497) * 0.004 * d.price;
      d.price = Math.max(d.price + delta, 0.001);
    });
  }, 2500);

  // ==============================
  // STAT COUNTER ANIMATION
  // ==============================
  function animateCounter(el, target, prefix = '', suffix = '', decimals = 0) {
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      let display;
      if (target >= 1000000) {
        display = '$' + (value / 1000000).toFixed(0) + 'M+';
      } else if (decimals > 0) {
        display = prefix + value.toFixed(decimals) + suffix;
      } else {
        display = prefix + Math.round(value).toLocaleString() + suffix;
      }

      el.textContent = display;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(document.getElementById('stat-aum'), 284000000);
      animateCounter(document.getElementById('stat-return'), 84.2, '+', '%', 1);
      animateCounter(document.getElementById('stat-users'), 2847);
      animateCounter(document.getElementById('stat-win'), 91.3, '', '%', 1);
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });

  const statsEl = document.querySelector('.stats');
  if (statsEl) statsObserver.observe(statsEl);

  // ==============================
  // SCROLL ANIMATIONS
  // ==============================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .step, .ai-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ==============================
  // NAVBAR SCROLL
  // ==============================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar?.setAttribute('style', 'box-shadow: 0 2px 20px rgba(21,39,71,0.2)');
    } else {
      navbar?.setAttribute('style', '');
    }
  }, { passive: true });

});
