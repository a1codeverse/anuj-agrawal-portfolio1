(() => {
  'use strict';

  document.documentElement.classList.add('reveal-enabled');

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Thin page-progress indicator and scroll-triggered motion.
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);
  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progressBar.style.transform = `scaleX(${progress})`;
      progressFrame = 0;
    });
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('menu-open');
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      document.body.classList.toggle('menu-open', isOpen);
    });
    $$('a', navLinks).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  // Respect reduced motion and reveal content as it enters the viewport.
  const revealItems = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  // Filter secondary project concepts.
  const filterButtons = $$('.filter-btn');
  const smallProjectCards = $$('.small-project');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    smallProjectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !show);
      if (show) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    });
  }));

  // Contact links: number is encoded in the direct WhatsApp URL, not rendered as page text.
  const whatsappEndpoint = 'https://wa.me/918319863652';
  const openWhatsApp = message => window.open(`${whatsappEndpoint}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');

  // Quote form prepares a message for the visitor to review and send in WhatsApp.
  const quoteForm = $('#quoteForm');
  const formStatus = $('#formStatus');
  if (quoteForm) {
    quoteForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!quoteForm.reportValidity()) return;
      const data = new FormData(quoteForm);
      const featureList = data.getAll('features');
      const lines = [
        'Hi Anuj, I would like to discuss a website project.',
        '',
        `Name: ${data.get('name') || 'Not provided'}`,
        `School / business: ${data.get('organisation') || 'Not provided'}`,
        `Email: ${data.get('email') || 'Not provided'}`,
        `My WhatsApp contact: ${data.get('contact') || 'Not provided'}`,
        `Website type: ${data.get('type') || 'Not decided'}`,
        `Features: ${featureList.length ? featureList.join(', ') : 'Not specified'}`,
        `Timeline: ${data.get('timeline') || "Let's discuss"}`,
        `Approx. budget: ${data.get('budget') || 'Not decided yet'}`,
        `Existing website: ${data.get('website') || 'Not provided'}`,
        `Additional details: ${data.get('details') || 'None yet'}`,
        '',
        'Please review my requirements and let me know the next steps.'
      ];
      if (formStatus) formStatus.textContent = 'Your WhatsApp draft is opening in a new tab. Review it there and press Send when ready.';
      openWhatsApp(lines.join('\n'));
    });
  }

  // Assistant preview: local FAQ matching in English and Hinglish; a live LLM needs a secure backend.
  const chatLauncher = $('#chatLauncher');
  const chatPanel = $('#chatPanel');
  const chatClose = $('#chatClose');
  const chatForm = $('#chatForm');
  const chatInput = $('#chatInput');
  const chatMessages = $('#chatMessages');
  const chatSuggestions = $('#chatSuggestions');
  const openChatButtons = $$('.open-chat');
  let chatOpenedOnce = false;

  const openChat = () => {
    if (!chatPanel || !chatLauncher) return;
    chatPanel.hidden = false;
    chatLauncher.setAttribute('aria-expanded', 'true');
    if (!chatOpenedOnce) {
      chatOpenedOnce = true;
      window.setTimeout(() => chatInput?.focus(), 80);
    }
  };
  const closeChat = () => {
    if (!chatPanel || !chatLauncher) return;
    chatPanel.hidden = true;
    chatLauncher.setAttribute('aria-expanded', 'false');
    chatLauncher.focus();
  };
  chatLauncher?.addEventListener('click', () => chatPanel?.hidden ? openChat() : closeChat());
  chatClose?.addEventListener('click', closeChat);
  openChatButtons.forEach(button => button.addEventListener('click', openChat));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && chatPanel && !chatPanel.hidden) closeChat(); });

  const containsHinglish = text => /[\u0900-\u097F]/.test(text) || /\b(kaise|kya|hai|hain|karna|chahiye|aap|mujhe|batao|banwa|banani|banaye|kitna|kitne|hoga|hogi|kaam|mein|mei|aur|kar sakte|karo|chahiye|lagta|padega|bataye|bataiye|mil sakta)\b/i.test(text);

  const answers = [
    {
      keys: ['school', 'cbse', 'icse', 'admission', 'preschool', 'play school', 'hindi medium', 'school website', 'विद्यालय', 'स्कूल'],
      en: 'Yes—we can discuss a school website for admissions enquiries, academics, facilities, notices, a gallery and contact details. The portfolio includes four Indian-school design concepts: CBSE-style, Hindi/state-board-style, preschool and premium private school. They are concepts, not deployed school websites.',
      hi: 'Haan, school website ke liye admissions enquiry, academics, facilities, notice board, gallery aur contact details plan kar sakte hain. Portfolio mein 4 Indian-school concepts hain: CBSE-style, Hindi/state-board, preschool aur premium private school. Ye abhi design concepts hain, live school websites nahi.'
    },
    {
      keys: ['price', 'pricing', 'cost', 'budget', 'quote', 'estimate', 'kitna', 'paise', 'charges', 'rate', 'quotation', 'कीमत', 'खर्च'],
      en: 'There are no fixed public packages. Cost depends on the pages, features, integrations and overall scope. Use “Get a Quote” to outline your needs; Anuj can then review them and discuss an estimate and timeline. This assistant does not invent prices.',
      hi: 'Fixed public price list nahi hai. Cost pages, features, integrations aur total scope par depend karegi. “Get a Quote” form mein apni requirements share karein; Anuj unhe review karke estimate aur timeline discuss kar sakte hain. Main price guess nahi karunga.'
    },
    {
      keys: ['service', 'services', 'what do you do', 'what can you build', 'website type', 'redesign', 'maintenance', 'coaching', 'business website', 'ecommerce', 'e-commerce', 'portal', 'kya bana', 'kya karte', 'kaun si website'],
      en: 'The planned focus is websites for schools, coaching institutes and local businesses, plus selected storefront and dashboard projects. Redesigns can also be discussed. Features such as payments, student login or databases need a separate scope and appropriate implementation.',
      hi: 'Main focus school, coaching institute aur local business websites par hai, saath hi selected e-commerce storefronts aur dashboards ke concepts bhi hain. Website redesign bhi discuss kar sakte hain. Online payments, student login ya database jaise features ke liye separate scope aur implementation chahiye.'
    },
    {
      keys: ['project process', 'process', 'timeline', 'how long', 'how does it work', 'start', 'shuru', 'kitna time', 'kaise kaam', 'kaise start', 'pehle kya'],
      en: 'The process is: understand the goal, agree the scope and pages, plan the design, build the approved features, test them and prepare handover. Timing depends on scope and content readiness, so a realistic timeline is discussed after reviewing the requirements.',
      hi: 'Process simple rakhenge: pehle goal samjhenge, phir pages aur features ka scope decide hoga, design plan hoga, approved features build honge, testing hogi aur handover. Time project ke scope aur content readiness par depend karta hai; requirements dekhkar timeline discuss hogi.'
    },
    {
      keys: ['skills', 'technology', 'tech stack', 'html', 'css', 'javascript', 'python', 'artificial intelligence', 'ai course', 'iit delhi', 'tcs ion', 'certificate', 'qualification'],
      en: 'The portfolio lists HTML, CSS, JavaScript, Python and Artificial Intelligence as learning/technical areas. Anuj’s learning credentials include the Artificial Intelligence Builder program through FITT, IIT Delhi (90 hours, 2025) and TCS iON Career Edge – Young Professional. The portfolio does not claim years of professional web-development experience.',
      hi: 'Portfolio mein HTML, CSS, JavaScript, Python aur Artificial Intelligence listed hain. Learning credentials mein FITT, IIT Delhi ka Artificial Intelligence Builder program (90 hours, 2025) aur TCS iON Career Edge – Young Professional course shamil hain. Website professional web-development experience ke unconfirmed years claim nahi karti.'
    },
    {
      keys: ['whatsapp', 'contact', 'email', 'linkedin', 'talk to anuj', 'anuj se', 'baat kar', 'message'],
      en: 'You can contact Anuj directly on WhatsApp, by email or through LinkedIn. Use the “Chat on WhatsApp” button or the contact section; the website’s WhatsApp button opens the chat link without showing the number as visible page text.',
      hi: 'Aap Anuj se directly WhatsApp, email ya LinkedIn par contact kar sakte hain. “Chat on WhatsApp” button ya contact section use karein. Website ka WhatsApp button chat link kholta hai; number page par visible text mein nahi dikhaya gaya hai.'
    },
    {
      keys: ['live', 'working', 'implemented', 'login', 'student portal', 'payment', 'backend', 'is it ready', 'ready hai', 'working hai', 'live hai'],
      en: 'The portfolio and project previews are a front-end implementation / concept showcase. A live production AI model, server-side enquiry storage, secure login, payments or a student database are not included by a static demo alone; those need proper backend integration and testing.',
      hi: 'Portfolio aur project previews front-end implementation / concept showcase hain. Live AI model, server-side enquiry storage, secure login, payments ya student database sirf static demo se nahi milte—inke liye proper backend integration aur testing chahiye.'
    }
  ];

  const fallback = {
    en: 'I don’t have confirmed information about that yet. You can ask about projects, services, certificates, the work process or estimates—or contact Anuj directly for a specific answer.',
    hi: 'Is sawal ke baare mein mere paas abhi confirmed information nahi hai. Aap projects, services, certificates, work process ya estimate ke baare mein pooch sakte hain, ya specific jawab ke liye directly Anuj se contact kar sakte hain.'
  };
  const getAnswer = text => {
    const hin = containsHinglish(text);
    const normalized = text.toLowerCase();
    const found = answers.find(item => item.keys.some(key => normalized.includes(key)));
    return found ? (hin ? found.hi : found.en) : (hin ? fallback.hi : fallback.en);
  };

  const appendMessage = (text, type) => {
    if (!chatMessages) return;
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${type === 'user' ? 'user-message' : 'assistant-message'}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    wrapper.appendChild(paragraph);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendChatMessage = text => {
    const trimmed = text.trim();
    if (!trimmed) return;
    appendMessage(trimmed, 'user');
    if (chatSuggestions) chatSuggestions.hidden = true;
    const response = getAnswer(trimmed);
    window.setTimeout(() => appendMessage(response, 'assistant'), 200);
  };
  chatForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!chatInput) return;
    sendChatMessage(chatInput.value);
    chatInput.value = '';
    chatInput.focus();
  });
  chatSuggestions?.addEventListener('click', event => {
    const button = event.target.closest('button[data-question]');
    if (button) sendChatMessage(button.dataset.question || '');
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
