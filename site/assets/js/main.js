/* =========================================================
   NOA × One Tribe — MVP scripts
   Vanilla JS, no dependencies.
   ========================================================= */

(function () {
  'use strict';

  // --- 1. Mobile nav drawer ---------------------------------
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      drawer.classList.toggle('is-open');
      const isOpen = drawer.classList.contains('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 2. FAQ accordion -------------------------------------
  document.querySelectorAll('[data-faq] .faq__item').forEach(function (item) {
    const btn = item.querySelector('.faq__btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');
      // close all siblings
      item.parentElement.querySelectorAll('.faq__item.is-open').forEach(function (sib) {
        sib.classList.remove('is-open');
      });
      if (!isOpen) item.classList.add('is-open');
    });
  });

  // --- 3. Capture UTM params + ref in hidden form fields ----
  const params = new URLSearchParams(window.location.search);
  const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'];
  trackedKeys.forEach(function (key) {
    const value = params.get(key);
    if (!value) return;
    document.querySelectorAll('input[name="' + key + '"]').forEach(function (input) {
      input.value = value;
    });
    // Persist to localStorage so it survives multi-page navigation
    try { localStorage.setItem('noa_' + key, value); } catch (e) { /* noop */ }
  });
  // Rehydrate from localStorage if no URL param
  trackedKeys.forEach(function (key) {
    if (params.get(key)) return;
    let stored = null;
    try { stored = localStorage.getItem('noa_' + key); } catch (e) { /* noop */ }
    if (!stored) return;
    document.querySelectorAll('input[name="' + key + '"]').forEach(function (input) {
      input.value = stored;
    });
  });

  // --- 4. Form submit (graceful when endpoint missing) -------
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const action = form.getAttribute('action') || '';
      const submitBtn = form.querySelector('button[type="submit"]');

      // If no real endpoint configured, prevent submit + show notice
      if (!action || action === '#' || action.includes('YOUR_FORMSPREE_ID')) {
        e.preventDefault();
        alert(
          'Form non ancora configurato.\n\n' +
          'Per attivarlo:\n' +
          '1. Vai su https://formspree.io e crea un account gratuito\n' +
          '2. Crea un nuovo form e copia l\'endpoint (es: https://formspree.io/f/abcdwxyz)\n' +
          '3. Sostituisci YOUR_FORMSPREE_ID nel codice HTML di questa pagina\n\n' +
          'In alternativa: collega Systeme.io o Web3Forms.'
        );
        return;
      }
      // Disable button to prevent double submit
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || '';
        submitBtn.textContent = 'Invio in corso...';
      }
    });
  });

  // --- 5. Smooth-scroll for internal anchors -----------------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // --- 6. Reveal-on-scroll (light, no library) ---------------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      io.observe(el);
    });
  }
})();
