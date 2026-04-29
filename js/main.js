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

// Contact form moderation
const contactForm = document.querySelector('form[action*="formspree.io"]');
if (contactForm) {
  const moderatedFields = ['name', 'contact', 'region', 'message']
    .map(name => contactForm.elements[name])
    .filter(Boolean);

  const blockedPatterns = [
    /\u0445\u0443[йеёяюию]/i,
    /\u043d\u0430\u0445/i,
    /\u043f\u0438\u0437\u0434/i,
    /\u0431\u043b[я]+/i,
    /[её]\u0431[а-я]*/i,
    /\u0441\u0443\u043a[аиуы]?/i,
    /\u043c\u0440\u0430\u0437/i,
    /\u0434\u0435\u0431\u0438\u043b/i
  ];

  const normalizeForModeration = value => value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .replace(/[a@]/g, '\u0430')
    .replace(/[e3]/g, '\u0435')
    .replace(/[o0]/g, '\u043e')
    .replace(/[p]/g, '\u0440')
    .replace(/[c]/g, '\u0441')
    .replace(/[x]/g, '\u0445')
    .replace(/[y]/g, '\u0443');

  const hasBlockedContent = value => {
    const normalized = normalizeForModeration(value || '');
    return blockedPatterns.some(pattern => pattern.test(normalized));
  };

  const showModerationError = message => {
    let error = contactForm.querySelector('.form-moderation-error');
    if (!error) {
      error = document.createElement('p');
      error.className = 'form-note form-moderation-error';
      error.style.color = '#ffb4a8';
      error.style.marginTop = '14px';
      const submit = contactForm.querySelector('.form-submit');
      submit.insertAdjacentElement('afterend', error);
    }
    error.textContent = message;
  };

  contactForm.addEventListener('submit', event => {
    const badField = moderatedFields.find(field => hasBlockedContent(field.value));
    if (!badField) return;

    event.preventDefault();
    showModerationError('Пожалуйста, уберите грубую лексику из заявки. После этого форму можно будет отправить.');
    badField.focus();
  });
}
