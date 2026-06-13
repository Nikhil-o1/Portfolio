/* ═══════════════════════════════════════════
   NIKHIL MAHAPURE  ·  script.js
   ═══════════════════════════════════════════ */

/* ════════ 1. LOADER — runs first ════════
   Drives the progress bar with JS so we have
   full control over when it disappears.        */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('loaderBar') ||
                  document.querySelector('.loader-bar-fill');

  if (!loader) return;

  let progress = 0;
  const TOTAL_MS   = 2200;   // total load animation time
  const TICK_MS    = 30;     // update every 30ms
  const INCREMENT  = 100 / (TOTAL_MS / TICK_MS);

  const interval = setInterval(() => {
    progress = Math.min(progress + INCREMENT + Math.random() * 0.8, 100);
    if (barFill) barFill.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      // small pause so user sees 100% before dismiss
      setTimeout(dismissLoader, 280);
    }
  }, TICK_MS);

  function dismissLoader() {
    loader.classList.add('done');   // triggers CSS opacity:0 + visibility:hidden
    // remove from DOM after transition ends (prevents any stacking issues)
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    }, { once: true });
  }

  // Safety net: force-dismiss after 4s in case something stalls
  setTimeout(() => {
    if (!loader.classList.contains('done')) dismissLoader();
  }, 4000);
})();


/* ════════ 2. STARFIELD CANVAS ════════ */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars   = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initStars(); });

  function initStars() {
    stars = [];
    const count = Math.min(180, Math.floor(window.innerWidth / 6));
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.5 + 0.2,
        a:       Math.random(),
        speed:   Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
        // 5:3:1:1 palette — mostly white, some cyan, some violet
        color:   Math.random() > 0.75
                   ? '#22d3ee'
                   : Math.random() > 0.55
                     ? '#7b2fff'
                     : '#ffffff'
      });
    }
  }
  initStars();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    stars.forEach(s => {
      const alpha = s.a * (0.4 + 0.6 * Math.sin(t * s.speed + s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle  = s.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      // soft glow for larger stars
      if (s.r > 1.1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        g.addColorStop(0, s.color + '44');
        g.addColorStop(1, s.color + '00');
        ctx.fillStyle = g;
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ════════ 3. CUSTOM CURSOR ════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring lags behind slightly
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover state
  document.querySelectorAll('a, button, .project-row, .skill-card, .stat-box, .metric-cell')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
})();


/* ════════ 4. MOBILE DRAWER ════════ */
(function initMobileNav() {
  const btn    = document.getElementById('mobMenuBtn');
  const drawer = document.getElementById('mob-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  // Close on link click
  drawer.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
})();


/* ════════ 5. SIDEBAR ACTIVE ON SCROLL ════════ */
(function initSidebarActive() {
  const items    = document.querySelectorAll('.sidebar-item[data-section]');
  const sections = document.querySelectorAll('section[id]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        items.forEach(a => {
          a.classList.toggle('active', a.dataset.section === e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
})();


/* ════════ 6. SCROLL REVEAL ════════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ════════ 7. PARALLAX ════════ */
(function initParallax() {
  const els = document.querySelectorAll('.parallax-el');
  if (!els.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        els.forEach(el => {
          const spd = parseFloat(el.dataset.speed) || 0.2;
          el.style.transform = `translateY(${sy * spd}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
})();


/* ════════ 8. COUNTER ANIMATION ════════ */
(function initCounters() {
  function animateCounter(el, target, suffix) {
    let v = 0;
    const step = target / 55;
    const t = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(t); }
      el.textContent = Math.floor(v) + suffix;
    }, 20);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const raw = e.target.textContent.trim();
      if (raw === '∞' || raw === '360°') return;
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const sfx = raw.replace(/[0-9.]/g, '');
      if (!isNaN(num)) animateCounter(e.target, num, sfx);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-num, .metric-num').forEach(el => obs.observe(el));
})();


/* ════════ 9. 3D TILT ON PROJECT ROWS ════════ */
(function initTilt() {
  document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('mousemove', e => {
      const r = row.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      row.style.transform =
        `perspective(900px) rotateX(${-y * 1.5}deg) rotateY(${x * 1.5}deg) translateY(-3px)`;
    });
    row.addEventListener('mouseleave', () => {
      row.style.transform = '';
    });
  });
})();


/* ════════ 10. VISIT TRACKER (localStorage) ════════ */
(function trackVisits() {
  try {
    const v = (parseInt(localStorage.getItem('nm_visits') || '0')) + 1;
    localStorage.setItem('nm_visits', v);
    console.log(
      `%c⚡ Nikhil Mahapure Portfolio`,
      'color:#22d3ee;font-size:16px;font-family:monospace;font-weight:bold;'
    );
    console.log(
      `%cVisit #${v} — nikhil.mahapure@email.com`,
      'color:#7b2fff;font-size:12px;font-family:monospace;'
    );
  } catch (_) {}
})();