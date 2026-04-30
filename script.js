/* ============================================================
   QuickOrder Studio — script.js
============================================================ */

const navbar    = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks  = document.getElementById('navLinks');
const mockupBrowser = document.getElementById('mockupBrowser');

/* ============================================================
   NAVBAR — scroll behavior + mobile toggle
============================================================ */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightActiveNav();
}, { passive: true });

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseFloat(entry.target.dataset.stagger || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger grid children for cascade effect
const staggerParents = [
  '.services-grid',
  '.features-grid',
  '.projects-grid',
  '.contact-grid',
  '.process-track',
];
staggerParents.forEach(sel => {
  const parent = document.querySelector(sel);
  if (!parent) return;
  [...parent.children].forEach((child, i) => {
    if (child.classList.contains('reveal') || child.querySelector('.reveal')) {
      const el = child.classList.contains('reveal') ? child : child.querySelector('.reveal');
      if (el) el.dataset.stagger = i * 90;
    }
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================================
   COUNTER ANIMATION
============================================================ */
function runCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur    = 1800;
  const start  = performance.now();
  const tick   = now => {
    const p   = Math.min((now - start) / dur, 1);
    const val = Math.round((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = val;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count').forEach(runCounter);
    statsObs.unobserve(entry.target);
  });
}, { threshold: 0.6 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

/* ============================================================
   3D TILT — project cards
============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-8px) scale(1.015)`;

    const glow = card.querySelector('.pc-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${(x + .5) * 100}% ${(y + .5) * 100}%, rgba(124,58,237,.18), transparent 68%)`;
      glow.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.pc-glow');
    if (glow) { glow.style.opacity = '0'; glow.style.background = ''; }
  });
});

/* ============================================================
   3D TILT — service cards
============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-7px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============================================================
   MOUSE PARALLAX — hero mockup
============================================================ */
let rafPending = false;

document.addEventListener('mousemove', e => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    // Hero browser
    if (mockupBrowser) {
      mockupBrowser.style.transform =
        `perspective(1000px) rotateY(${-10 + dx * 6}deg) rotateX(${4 - dy * 3}deg)`;
    }

    // Floating shapes parallax
    document.querySelectorAll('.shape').forEach((s, i) => {
      const f = (i + 1) * 0.007;
      s.style.transform = `translate(${dx * 30 * f}px, ${dy * 20 * f}px)`;
    });

    rafPending = false;
  });
}, { passive: true });

/* ============================================================
   SMOOTH ANCHOR SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 20;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ============================================================
   CSS ACTIVE NAV LINK STYLE
   (inject once, rule handled via JS class toggling above)
============================================================ */
(function injectNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `.nav-links a.nav-active:not(.nav-cta-link) { color: var(--text); }
    .nav-links a.nav-active:not(.nav-cta-link)::after { width: 100%; }`;
  document.head.appendChild(style);
})();
