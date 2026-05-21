/* ─── RevWeb script.js ─── */

// ── 1. NAV SCROLL EFFECT
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── 2. MOBILE MENU
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate burger → X
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ── 3. INTERSECTION OBSERVER — REVEAL ELEMENTS
const revealEls = document.querySelectorAll('.reveal, .reveal-stat');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-stat');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── 4. COUNTER ANIMATION
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = 16;
  const steps = Math.ceil(duration / step);
  let current = 0;
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    // Ease-out: faster at start, slower at end
    const progress = 1 - Math.pow(1 - frame / steps, 3);
    current = Math.round(progress * target);
    el.textContent = current;
    if (frame >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}

const statNums = document.querySelectorAll('.stat__num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ── 5. SMOOTH ACTIVE NAV LINK
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── 6. FORM SUBMIT
const form = document.getElementById('ctaForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate async submit
    setTimeout(() => {
      btn.textContent = '¡Listo! Te respondemos pronto';
      form.reset();
      showToast('✓', 'Mensaje enviado — te escribimos en 24 h.');
      setTimeout(() => {
        btn.textContent = 'Enviar mensaje →';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

function showToast(icon, message) {
  // Remove existing toast if any
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 600);
  }, 4000);
}

// ── 7. CURSOR GLOW (desktop only)
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,158,255,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0; transition: transform 0.1s linear;
    transform: translate(-150px, -150px); will-change: transform;
  `;
  document.body.appendChild(glow);

  let mx = -300, my = -300;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  let raf;
  const moveCursor = () => {
    glow.style.transform = `translate(${mx - 150}px, ${my - 150}px)`;
    raf = requestAnimationFrame(moveCursor);
  };
  moveCursor();
}

// ── 8. HERO PARALLAX (subtle)
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const orbs = document.querySelectorAll('.orb');
    const speed = window.scrollY * 0.25;
    orbs[0] && (orbs[0].style.transform = `translateY(${speed}px)`);
    orbs[1] && (orbs[1].style.transform = `translateY(${-speed * 0.5}px)`);
  }
}, { passive: true });
