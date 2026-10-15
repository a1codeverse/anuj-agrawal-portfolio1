(function () {
  'use strict';
  document.documentElement.classList.add('js-enabled');

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  const filterButtons = Array.from(document.querySelectorAll('[data-course-filter]'));
  const courseCards = Array.from(document.querySelectorAll('[data-course]'));
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.courseFilter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    courseCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.course === filter;
      card.classList.toggle('is-hidden', !show);
    });
  }));

  document.querySelectorAll('[data-enquiry-course]').forEach((link) => link.addEventListener('click', () => {
    const select = document.getElementById('studyGoal');
    const name = link.dataset.enquiryCourse || '';
    if (select) {
      const options = Array.from(select.options);
      const match = options.find((option) => option.text.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
      if (match && match.value) select.value = match.value;
      else if (/jee/i.test(name)) select.value = 'IIT-JEE';
      else if (/neet/i.test(name)) select.value = 'NEET-UG';
      else if (/board/i.test(name)) select.value = 'Board preparation';
      else if (/foundation/i.test(name)) select.value = 'Foundation';
      else if (/senior/i.test(name)) select.value = 'School academics';
    }
  }));

  document.querySelectorAll('.faq-question').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(willOpen));
    item.classList.toggle('is-open', willOpen);
    const icon = button.querySelector('i');
    if (icon) icon.textContent = willOpen ? '−' : '+';
  }));

  const form = document.getElementById('enquiryForm');
  const feedback = document.getElementById('formFeedback');
  if (form && feedback) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        feedback.textContent = 'Please complete the required fields with valid details.';
        feedback.style.color = '#b83d2a';
        return;
      }
      feedback.style.color = '#168365';
      feedback.textContent = 'Demo only: the form is working for preview, but no enquiry has been sent or stored. Connect the institute’s approved phone, WhatsApp or form service before launch.';
      form.reset();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const updateHeader = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }
})();
