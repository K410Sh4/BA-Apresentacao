(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  const progressBar = document.getElementById('reading-progress-bar');
  const yearNode = document.getElementById('current-year');

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // Mobile navigation: close after selection and keep ARIA state synchronized.
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      navigation.classList.toggle('is-open', !isOpen);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
  }

  // Reading progress is a real page-position indicator, not a system-performance metric.
  let scrollQueued = false;
  const updateScrollState = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (progressBar) progressBar.style.width = `${ratio * 100}%`;
      scrollQueued = false;
    });
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // Progressive reveal, with a no-IntersectionObserver fallback.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Current section indicator.
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24% 0px -60% 0px', threshold: [0, .1, .25, .5] });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Interactive architecture explorer. All descriptions are source-grounded and status-qualified.
  const moduleContent = {
    perception: {
      category: 'BA CORE', status: 'Integrado', statusKind: 'integrated', index: '01 / 04',
      title: 'Percepção do corpo',
      text: 'Body Awareness e Body Survey organizam observações somente de leitura, preservando estado, origem e proveniência dos provedores.',
      source: 'Body Awareness · Body Survey'
    },
    topology: {
      category: 'BA CORE', status: 'Integrado', statusKind: 'integrated', index: '02 / 04',
      title: 'Organização topológica',
      text: 'A topologia mantém identidades estáveis, resolução determinística e diagnóstico de conflitos. Relações ausentes não são inventadas.',
      source: 'Topology · World · Regions · Units'
    },
    regulation: {
      category: 'BA CORE', status: 'Integrado', statusKind: 'integrated', index: '03 / 04',
      title: 'Regulação local',
      text: 'Homeostase e alostase oferecem mecanismos locais, determinísticos e limitados. Ainda não formam, por si só, um ciclo global autônomo.',
      source: 'Homeostasis · Allostasis'
    },
    resources: {
      category: 'BA CORE', status: 'Integrado', statusKind: 'integrated', index: '04 / 04',
      title: 'Consciência de recursos',
      text: 'Telemetria tipada e modelos consultivos qualificam evidências de CPU, memória e cgroups. Não aplicam cotas nem reconfiguram o host.',
      source: 'Hardware Telemetry · Metabolic Model · Cgroup Budget'
    }
  };

  const moduleButtons = [...document.querySelectorAll('.module-button')];
  const detailFields = {
    category: document.getElementById('module-detail-category'),
    status: document.getElementById('module-detail-status'),
    title: document.getElementById('module-detail-title'),
    text: document.getElementById('module-detail-text'),
    source: document.getElementById('module-detail-source'),
    index: document.getElementById('module-detail-index')
  };
  const selectModule = button => {
    const data = moduleContent[button.dataset.module];
    if (!data) return;
    moduleButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    Object.entries(detailFields).forEach(([key, node]) => {
      if (node && key !== 'status') node.textContent = data[key];
    });
    if (detailFields.status) {
      detailFields.status.textContent = data.status;
      detailFields.status.className = `status-chip status-chip--${data.statusKind}`;
    }
  };
  moduleButtons.forEach(button => button.addEventListener('click', () => selectModule(button)));

  // FAQ accordion with one expanded item at a time.
  const faqButtons = [...document.querySelectorAll('.faq-question')];
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
      faqButtons.forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const answer = other.closest('.faq-item')?.querySelector('.faq-answer');
        if (answer) answer.hidden = true;
      });
      button.setAttribute('aria-expanded', String(shouldOpen));
      const answer = button.closest('.faq-item')?.querySelector('.faq-answer');
      if (answer) answer.hidden = !shouldOpen;
    });
  });

  // Small, restrained pointer response on the hero visual only.
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  if (hero && heroVisual && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroVisual.style.setProperty('--pointer-x', `${x * 8}px`);
      heroVisual.style.setProperty('--pointer-y', `${y * 7}px`);
      heroVisual.style.transform = `translate3d(${x * -7}px, ${y * -5}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => {
      heroVisual.style.transform = '';
      heroVisual.style.removeProperty('--pointer-x');
      heroVisual.style.removeProperty('--pointer-y');
    });
  }
})();