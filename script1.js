'use strict';
/* =============================================================
   NIKHIL MAHAPURE PORTFOLIO — script.js v4 (Final)
   All systems: Cursor · Loader · Typewriter · Particles ·
   3D ID Card (HTML/CSS flip + cursor tilt + holographic sheen) ·
   Tilt Cards · Scroll Reveal · Nav · Mobile Menu · Magnetic ·
   Smooth Scroll · Form · Counter · Progress Bar
   ============================================================= */

const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ── CURSOR ─────────────────────────────────────────── */
const CursorCtrl = (() => {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return { init: () => {} };

  let mx = -200, my = -200, rx = -200, ry = -200;

  function loop() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }

  function init() {
    if (window.matchMedia('(hover:none)').matches) return;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    loop();

    const targets = $$('a,button,.magnetic,.skill-card,.project-item,.creative-card,.cert-item,.id-card');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));
  }

  return { init };
})();

/* ── LOADER ─────────────────────────────────────────── */
const LoaderCtrl = (() => {
  const loader = $('#loader');
  if (!loader) return { init: () => {} };

  function init() {
    document.body.classList.add('loading');
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero reveals after loader gone
      setTimeout(() => {
        $$('.hero .reveal-up, .hero .reveal-right').forEach(el => {
          const d = parseFloat(el.dataset.delay || 0) * 1000;
          setTimeout(() => el.classList.add('visible'), d + 100);
        });
      }, 350);
    }, 2500);
  }

  return { init };
})();

/* ── TYPEWRITER ─────────────────────────────────────── */
const TypeCtrl = (() => {
  const roles = [
    'Frontend Developer',
    'UI/UX Designer',
    'Content Creator',
    'Open Source Contributor',
    'CSE Student @ COET'
  ];
  let ri = 0, ci = 0, del = false;
  const el = $('#roleText');
  if (!el) return { init: () => {} };

  function tick() {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 68);
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 380); return; }
      setTimeout(tick, 36);
    }
  }

  return { init() { setTimeout(tick, 2900); } };
})();

/* ── PARTICLES ──────────────────────────────────────── */
const ParticleCtrl = (() => {
  const wrap = $('#heroParticles');
  if (!wrap) return { init: () => {} };

  const snips = [
    'const ui=design();','git commit -m "feat"','<div class="hero">',
    'figma.prototype()','npm run build','SELECT * FROM ideas',
    '.forEach(create)','fetch("/api/work")','import { vision }',
    'cursor:none;','{ design:true }','if(passion)build()',
    'rgba(213,0,50,.8)','@keyframes grow{}','flex:1 1 auto;',
    'border-radius:12px','transform:rotateY(180deg)'
  ];

  function spawn() {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = snips[Math.floor(Math.random() * snips.length)];
    const left  = 5 + Math.random() * 85;
    const dur   = 8 + Math.random() * 12;
    const delay = Math.random() * 5;
    const drift = (Math.random() - .5) * 60 + 'px';
    p.style.cssText = `left:${left}%;bottom:0;--dur:${dur}s;--delay:${delay}s;--drift:${drift}`;
    wrap.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000);
  }

  return {
    init() {
      for (let i = 0; i < 8; i++) setTimeout(spawn, i * 500);
      setInterval(spawn, 1600);
    }
  };
})();

/* ── 3D ID CARD ─────────────────────────────────────── */
const IDCardCtrl = (() => {
  const card     = $('#idCard');
  const scene    = $('#idCardScene');
  const holo     = $('#cardHolo');

  if (!card || !scene) return { init: () => {} };

  let isFlipped  = false;
  let tiltX      = 0, tiltY  = 0;
  let targetX    = 0, targetY = 0;
  let rafId;
  let isHovering = false;

  /* ── Click to flip */
  card.addEventListener('click', () => {
    isFlipped = !isFlipped;
    card.classList.toggle('is-flipped', isFlipped);
    const hint = scene.querySelector('.card-hint');
    if (hint) hint.textContent = isFlipped ? 'Click to flip back' : 'Move cursor over card · Click to flip';
  });

  /* ── Cursor tilt */
  scene.addEventListener('mouseenter', () => { isHovering = true; });
  scene.addEventListener('mouseleave', () => {
    isHovering = false;
    targetX = 0; targetY = 0;
  });

  scene.addEventListener('mousemove', e => {
    if (!isHovering || isFlipped) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const nx   = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
    const ny   = (e.clientY - cy) / (rect.height / 2);

    targetX = clamp(-ny * 18, -18, 18);   // rotateX: tilt up/down
    targetY = clamp( nx * 22, -22, 22);   // rotateY: tilt left/right

    /* holographic sheen follows mouse */
    if (holo) {
      const hx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const hy = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      holo.style.setProperty('--hx', hx);
      holo.style.setProperty('--hy', hy);
      holo.style.opacity = '1';
    }
  });

  scene.addEventListener('mouseleave', () => {
    if (holo) holo.style.opacity = '0';
  });

  /* ── Animation loop — smooth tilt */
  function loop() {
    tiltX = lerp(tiltX, targetX, 0.08);
    tiltY = lerp(tiltY, targetY, 0.08);

    if (!isFlipped) {
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      // Dynamic shadow
      const sx = -tiltY * 1.5;
      const sy =  tiltX * 1.5;
      card.style.boxShadow = `
        ${sx}px ${sy + 20}px 50px rgba(0,0,0,.6),
        ${sx * .5}px ${sy * .5 + 8}px 20px rgba(213,0,50,.25)
      `;
    } else {
      card.style.transform = '';
      card.style.boxShadow = '';
    }
    rafId = requestAnimationFrame(loop);
  }

  return {
    init() {
      loop();
      /* Touch support for mobile flip */
      card.addEventListener('touchend', e => {
        e.preventDefault();
        isFlipped = !isFlipped;
        card.classList.toggle('is-flipped', isFlipped);
      }, { passive: false });
    }
  };
})();

/* ── SCROLL REVEAL ──────────────────────────────────── */
const RevealCtrl = (() => ({
  init() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const d = parseFloat(e.target.dataset.delay || 0) * 1000;
        setTimeout(() => e.target.classList.add('visible'), d);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      if (!el.closest('.hero')) obs.observe(el);
    });
  }
}))();

/* ── 3D TILT CARDS ──────────────────────────────────── */
const TiltCtrl = (() => {
  function apply(el) {
    if (window.matchMedia('(hover:none)').matches) return;
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - .5;
      const ny = (e.clientY - r.top)  / r.height - .5;
      el.style.transform = `perspective(700px) rotateX(${-ny * 12}deg) rotateY(${nx * 12}deg) translateZ(8px)`;
      const shine = el.querySelector('.card-shine');
      if (shine) {
        shine.style.setProperty('--sx', `${(nx + .5) * 100}%`);
        shine.style.setProperty('--sy', `${(ny + .5) * 100}%`);
      }
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.1s linear'; });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 550);
    });
  }
  return { init() { $$('.tilt-card').forEach(apply); } };
})();

/* ── NAV ────────────────────────────────────────────── */
const NavCtrl = (() => {
  const nav = $('#nav');
  if (!nav) return { init: () => {} };

  return {
    init() {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      /* Active section highlight */
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          $$('.nav-link').forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + e.target.id ? '#fff' : '';
          });
        });
      }, { threshold: 0.35 });
      $$('section[id]').forEach(s => obs.observe(s));
    }
  };
})();

/* ── MOBILE MENU ────────────────────────────────────── */
const MenuCtrl = (() => {
  const btn  = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return { init: () => {} };

  let open = false;
  function toggle() {
    open = !open;
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  return {
    init() {
      btn.addEventListener('click', toggle);
      $$('.mobile-link', menu).forEach(l => l.addEventListener('click', () => { if (open) toggle(); }));
      document.addEventListener('click', e => {
        if (open && !menu.contains(e.target) && !btn.contains(e.target)) toggle();
      });
    }
  };
})();

/* ── MAGNETIC ───────────────────────────────────────── */
const MagCtrl = (() => {
  function apply(el) {
    if (window.matchMedia('(hover:none)').matches) return;
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * .28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * .28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.1s linear'; });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  }
  return { init() { $$('.magnetic').forEach(apply); } };
})();

/* ── SMOOTH SCROLL ──────────────────────────────────── */
const ScrollCtrl = (() => ({
  init() {
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }
}))();

/* ── CONTACT FORM ───────────────────────────────────── */
const FormCtrl = (() => {
  const form = $('#contactForm');
  if (!form) return { init: () => {} };

  return {
    init() {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = form.querySelector('.form-submit');
        const span = btn.querySelector('span');
        const orig = span.textContent;
        btn.disabled = true; span.textContent = 'Sending…'; btn.style.opacity = '.7';
        setTimeout(() => {
          span.textContent = '✓ Sent!'; btn.style.background = '#16a34a'; btn.style.opacity = '1';
          setTimeout(() => {
            span.textContent = orig; btn.style.background = ''; btn.style.opacity = ''; btn.disabled = false; form.reset();
          }, 3000);
        }, 1200);
      });
    }
  };
})();

/* ── STAT COUNTER ───────────────────────────────────── */
const CountCtrl = (() => ({
  init() {
    const targets = [{ sfx: '+', n: 3 }, { sfx: 'K+', n: 12 }, { sfx: '+', n: 4 }];
    const els = $$('.stat-num');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        els.forEach((el, i) => {
          if (!targets[i]) return;
          let v = 0;
          const { sfx, n } = targets[i];
          const step = n / 40;
          const tick = () => { v += step; if (v >= n) { el.textContent = n + sfx; return; } el.textContent = Math.floor(v) + sfx; requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        });
        obs.disconnect();
      });
    }, { threshold: .5 });
    const s = $('.hero-stats');
    if (s) obs.observe(s);
  }
}))();

/* ── SCROLL PROGRESS BAR ────────────────────────────── */
const ProgressCtrl = (() => ({
  init() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#D50032;z-index:9999;width:0%;box-shadow:0 0 8px rgba(213,0,50,.6);pointer-events:none;transition:width .1s linear;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const s = document.documentElement;
      bar.style.width = ((s.scrollTop / (s.scrollHeight - window.innerHeight)) * 100) + '%';
    }, { passive: true });
  }
}))();

/* ── BOOT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  CursorCtrl.init();
  LoaderCtrl.init();
  TypeCtrl.init();
  ParticleCtrl.init();
  IDCardCtrl.init();
  RevealCtrl.init();
  TiltCtrl.init();
  NavCtrl.init();
  MenuCtrl.init();
  MagCtrl.init();
  ScrollCtrl.init();
  FormCtrl.init();
  CountCtrl.init();
  ProgressCtrl.init();
});