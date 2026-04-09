/* Checkitaly — main.js */

// ── NAV scroll effect ──────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Burger menu ────────────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Hero image loaded → start zoom-out ────────────
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  const activate = () => heroImg.classList.add('loaded');
  if (heroImg.complete) activate();
  else heroImg.addEventListener('load', activate);
}

// ── Reveal on scroll ──────────────────────────────
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// ── Problem cards touch support ───────────────────
document.querySelectorAll('.problem-card').forEach(card => {
  card.addEventListener('touchstart', () => {
    const isOpen = card.classList.contains('touched');
    document.querySelectorAll('.problem-card.touched').forEach(c => c.classList.remove('touched'));
    if (!isOpen) card.classList.add('touched');
  }, { passive: true });
});

// ── FAQ Accordion ─────────────────────────────────
document.querySelectorAll('.faq-accordion__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-accordion__item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-accordion__item.open').forEach(el => {
      el.classList.remove('open');
    });
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});
