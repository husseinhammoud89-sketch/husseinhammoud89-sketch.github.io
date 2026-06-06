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

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.style.color = 'var(--text-primary)';
});
