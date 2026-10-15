/* =========================================================
   Hazem Elsalanty — Portfolio scripts
   Navbar state, scroll spy, reveal on scroll, back to top,
   front-end contact form validation.
   ========================================================= */

(() => {
  'use strict';

  const nav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('.site-nav .nav-link')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const toTop = document.getElementById('toTop');

  /* ---------- navbar background + back-to-top visibility ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    toTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- active section in the navbar ---------- */
  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const spy = new IntersectionObserver(entries => {
    entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      .slice(0, 1)
      .forEach(entry => setActive(entry.target.id));
  }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] });

  sections.forEach(section => spy.observe(section));

  /* ---------- reveal elements as they enter the viewport ---------- */
  const revealables = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('visible'));
  } else {
    const revealer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(el => revealer.observe(el));
  }

  /* ---------- close the mobile menu after a link is tapped ---------- */
  const collapseEl = document.getElementById('navLinks');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!collapseEl.classList.contains('show')) return;
      bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
    });
  });

  /* ---------- contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  const fields = [
    { id: 'name',    test: v => v.length >= 2,      message: 'Enter your name.' },
    { id: 'email',   test: v => EMAIL_RE.test(v),   message: 'Enter a valid email address.' },
    { id: 'subject', test: v => v.length >= 3,      message: 'Add a short subject.' },
    { id: 'message', test: v => v.length >= 10,     message: 'Write at least 10 characters.' }
  ];

  const validateField = field => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(`${field.id}Error`);
    const ok = field.test(input.value.trim());

    error.textContent = ok ? '' : field.message;
    input.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  };

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const results = fields.map(validateField);
    if (results.includes(false)) {
      status.textContent = 'Check the highlighted fields and try again.';
      status.className = 'form-status bad';
      form.querySelector('.invalid')?.focus();
      return;
    }

    // No backend here: hand the message to the visitor's mail app instead.
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const body = `${message}\n\n—\n${name}\n${email}`;
    const mailto = `mailto:hazemelsallanty@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    status.textContent = 'Your email app is opening with the message ready to send.';
    status.className = 'form-status ok';
    form.reset();
  });

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
