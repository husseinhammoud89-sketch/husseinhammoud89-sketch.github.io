// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
})();

// Custom cursor (desktop only)
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.style.translate = '-200px -200px';
  document.body.appendChild(cursor);

  const explore = document.createElement('div');
  explore.className = 'cursor-explore';
  explore.textContent = 'Explore';
  document.body.appendChild(explore);

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.translate = `${mx}px ${my}px`;
    explore.style.transform = `translate(${mx}px, ${my}px)`;
  });

  // Scale on hover — separate from position so transition only affects scale
  document.addEventListener('mouseover', e => {
    const over = !!e.target.closest('a, button, [role="button"], label, select');
    cursor.style.scale = over ? '2' : '1';
  });

  document.addEventListener('mouseout', e => {
    const still = !!e.relatedTarget?.closest('a, button, [role="button"], label, select');
    cursor.style.scale = still ? '2' : '1';
  });

  // Explore cursor on project images
  document.querySelectorAll('.fw-item-img').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hidden');
      explore.classList.add('cursor-explore--visible');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hidden');
      explore.classList.remove('cursor-explore--visible');
    });
  });
})();

// Lightbox
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src || img.querySelector('img')?.src;
      lightbox.classList.add('open');
    });
  });
  document.querySelectorAll('.cs-ba-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      lbImg.src = wrap.querySelector('img').src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

// Hero scroll parallax
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const row1 = document.querySelector('.hero-row1');
  const row2 = document.querySelector('.hero-row2');
  const row3 = document.querySelector('.hero-row3');

  // Let enter animations finish (0.6s delay + 1s duration = 1.6s), then hand off to scroll
  const ANIM_DURATION = 1700;

  let scrollReady = false;
  setTimeout(() => { scrollReady = true; }, ANIM_DURATION);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!scrollReady) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const heroH = hero.offsetHeight;
      const p = Math.min(y / heroH, 1);

      // Remove CSS animation so our transform takes clean control
      if (row1.style.animation !== 'none') {
        row1.style.animation = 'none';
        row2.style.animation = 'none';
        row3.style.animation = 'none';
      }

      row1.style.transform = `perspective(1200px) translateX(${p * 120}px)`;
      row2.style.transform = `translateY(${p * -80}px)`;
      row3.style.transform = `perspective(1200px) translateX(${p * -120}px)`;

      ticking = false;
    });
  }, { passive: true });
})();

// Scroll reveal for all sections (not footer)
(function () {
  const targets = document.querySelectorAll(
    '.fw-item, .fw-header, .about-grid, .services-header, .services-layout, .service-item'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger siblings within the same parent
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.animationDelay = (siblings.indexOf(el) * 0.06) + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();

// Footer marquee parallax
(function () {
  if (window.matchMedia('(max-width: 1439px)').matches) return;
  const footer = document.querySelector('.site-footer');
  const marquee = document.querySelector('.footer-marquee');
  if (!footer || !marquee) return;

  let ticking = false;
  function update() {
    const rect = footer.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 = footer just entered view from bottom, 1 = footer top at viewport top
    const p = Math.max(0, Math.min(1, (vh - rect.top) / vh));
    marquee.style.transform = `translateY(${(1 - p) * 160}px)`;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });

  update();
})();

// Hide nav on scroll down, show on scroll up (not near bottom)
(function () {
  const nav = document.querySelector('.nav');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const atBottom = (window.innerHeight + y) >= document.body.scrollHeight - 80;
    if (atBottom) {
      nav.classList.add('nav--hidden');
    } else if (y < last || y <= 80) {
      nav.classList.remove('nav--hidden');
    } else if (y > last) {
      nav.classList.add('nav--hidden');
    }
    last = y;
  }, { passive: true });
})();

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.style.color = 'var(--text-primary)';
});
