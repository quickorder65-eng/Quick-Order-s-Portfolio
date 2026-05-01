'use strict';

const nav     = document.getElementById('nav');
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
const browser = document.getElementById('browser');

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 50);
  updateActiveLink();
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    burger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

function updateActiveLink() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
  });
}

const style = document.createElement('style');
style.textContent = `.nav-menu a.nav-active:not(.nav-btn){color:#f1f5f9}.nav-menu a.nav-active:not(.nav-btn)::after{width:100%}`;
document.head.appendChild(style);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseFloat(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('in'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

[
  '.srv-grid',
  '.why-grid',
  '.proj-grid',
  '.cred-grid',
  '.contact-grid',
  '.proc-track',
].forEach(sel => {
  const parent = document.querySelector(sel);
  if (!parent) return;
  [...parent.children].forEach((child, i) => {
    const el = child.classList.contains('reveal') ? child : child.querySelector('.reveal');
    if (el) el.dataset.delay = i * 85;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.to, 10);
  const dur    = 1600;
  const start  = performance.now();
  const tick   = t => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform =
      `perspective(720px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-8px) scale(1.015)`;

    const glow = card.querySelector('.pcard-glow');
    if (glow) {
      glow.style.background =
        `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, color-mix(in srgb, var(--ac) 16%, transparent), transparent 68%)`;
      glow.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.pcard-glow');
    if (glow) { glow.style.opacity = '0'; glow.style.background = ''; }
  });
});

document.querySelectorAll('.srv-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform =
      `perspective(720px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-7px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

let rafId = null;

document.addEventListener('mousemove', e => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (browser) {
      browser.style.transform =
        `perspective(1000px) rotateY(${-10 + dx * 6}deg) rotateX(${4 - dy * 3}deg)`;
    }

    document.querySelectorAll('.sh').forEach((s, i) => {
      const f = (i + 1) * 0.0065;
      s.style.transform = `translate(${dx * 28 * f}px, ${dy * 18 * f}px)`;
    });

    rafId = null;
  });
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - nav.offsetHeight - 20,
      behavior: 'smooth',
    });
  });
});

(function () {
  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (fired || !entries[0].isIntersecting) return;
    fired = true;
    statsEl.querySelectorAll('.cnt').forEach(animateCounter);
    obs.disconnect();
  }, { threshold: 0.55 });
  obs.observe(statsEl);
})();
