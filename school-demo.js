(() => {
  'use strict';
  // Reveal the school demo content gently as it enters the viewport.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.school-hero-copy, .school-illustration, .school-hero-bottom-inner, .school-section-heading, .school-value-card, .facility-card, .campus-tile, .school-notice-list .notice-item, .school-enquiry-form, .school-contact-band-inner, .school-footer-inner');
    revealTargets.forEach((item, index) => {
      item.setAttribute('data-school-reveal', '');
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });
    document.documentElement.classList.add('school-motion-ready');
    const schoolRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('school-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealTargets.forEach(item => schoolRevealObserver.observe(item));
  }

  const menuButton = document.querySelector('.school-menu-toggle');
  const nav = document.querySelector('.school-nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close school demo menu' : 'Open school demo menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('[data-form-status]');
      if (status) status.textContent = 'Demo only — your sample enquiry has not been sent or stored. A real school website would connect this form to an approved, secure enquiry workflow.';
      form.reset();
    });
  });
})();
