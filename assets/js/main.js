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

  // Cinematic network field: a decorative visualization, not live BA telemetry.
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  const networkCanvas = document.querySelector('.hero-field');
  let networkPointer = { x: 0, y: 0, active: false };

  if (hero && heroVisual && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(1, bounds.width) - .5;
      const y = (event.clientY - bounds.top) / Math.max(1, bounds.height) - .5;
      if (!reduceMotion) heroVisual.style.transform = `translate3d(${x * -7}px, ${y * -5}px, 0)`;

      if (networkCanvas) {
        const canvasBounds = networkCanvas.getBoundingClientRect();
        networkPointer = {
          x: event.clientX - canvasBounds.left,
          y: event.clientY - canvasBounds.top,
          active: true
        };
      }
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      heroVisual.style.transform = '';
      networkPointer.active = false;
    });
  }

  if (networkCanvas) {
    const context = networkCanvas.getContext('2d', { alpha: true, desynchronized: true });
    if (context) {
      let width = 0;
      let height = 0;
      let dpr = 1;
      let nodes = [];
      let frame = 0;
      let previousTime = 0;
      let elapsed = 0;
      let inViewport = true;
      let resizeObserver = null;
      let seed = 0xBA2026;

      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      const makeNodes = () => {
        const count = Math.max(42, Math.min(112, Math.round(width / 6.5)));
        const cx = width * .54;
        const cy = height * .49;
        nodes = Array.from({ length: count }, (_, index) => {
          const angle = random() * Math.PI * 2;
          const radius = Math.sqrt(random());
          const spreadX = width * .43;
          const spreadY = height * .38;
          return {
            x: cx + Math.cos(angle) * spreadX * radius,
            y: cy + Math.sin(angle) * spreadY * radius,
            vx: (random() - .5) * .12,
            vy: (random() - .5) * .12,
            phase: random() * Math.PI * 2,
            size: .75 + random() * 1.55,
            depth: .28 + random() * .72,
            id: index
          };
        });
      };

      const resize = () => {
        const rect = networkCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.6);
        networkCanvas.width = Math.round(width * dpr);
        networkCanvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        makeNodes();
        draw(elapsed);
      };

      const drawOrbit = (cx, cy, rx, ry, rotation, alpha, dash = []) => {
        context.save();
        context.translate(cx, cy);
        context.rotate(rotation);
        context.beginPath();
        context.setLineDash(dash);
        context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        context.strokeStyle = `rgba(75, 195, 220, ${alpha})`;
        context.lineWidth = .75;
        context.stroke();
        context.restore();
      };

      function draw(time) {
        if (!width || !height) return;
        context.clearRect(0, 0, width, height);
        const cx = width * .54;
        const cy = height * .49;
        const glow = context.createRadialGradient(cx, cy, 2, cx, cy, width * .48);
        glow.addColorStop(0, 'rgba(24, 151, 181, .16)');
        glow.addColorStop(.48, 'rgba(13, 90, 119, .075)');
        glow.addColorStop(1, 'rgba(5, 18, 29, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);

        drawOrbit(cx, cy, width * .44, height * .32, -.28 + Math.sin(time * .00008) * .025, .22);
        drawOrbit(cx, cy, width * .4, height * .26, .23 + Math.cos(time * .00006) * .02, .15, [3, 8]);
        drawOrbit(cx, cy, width * .31, height * .19, -.72, .09);

        const linkRange = Math.max(86, width * .205);
        let edgeIndex = 0;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.hypot(dx, dy);
            if (distance >= linkRange) continue;

            const proximity = 1 - distance / linkRange;
            const alpha = (.025 + proximity * .16) * Math.min(a.depth, b.depth);
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(83, 196, 221, ${alpha})`;
            context.lineWidth = .45 + proximity * .42;
            context.stroke();

            // Traveling signal particles follow a small subset of the connections.
            if ((i * 11 + j * 7) % 43 === 0) {
              const phase = ((time * .00011) + (i * .17 + j * .071)) % 1;
              const px = a.x + dx * phase;
              const py = a.y + dy * phase;
              context.beginPath();
              context.arc(px, py, 1.05 + proximity * .75, 0, Math.PI * 2);
              context.fillStyle = `rgba(174, 249, 255, ${.18 + proximity * .62})`;
              context.shadowColor = 'rgba(73, 218, 239, .9)';
              context.shadowBlur = 9;
              context.fill();
              context.shadowBlur = 0;
            }
            edgeIndex++;
          }
        }

        for (const node of nodes) {
          const breathe = .72 + Math.sin(time * .001 + node.phase) * .2;
          const radius = node.size * breathe;
          context.beginPath();
          context.arc(node.x, node.y, radius * 2.8, 0, Math.PI * 2);
          context.fillStyle = `rgba(72, 199, 222, ${.025 * node.depth})`;
          context.fill();
          context.beginPath();
          context.arc(node.x, node.y, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(194, 250, 255, ${.32 + .58 * node.depth})`;
          context.shadowColor = 'rgba(71, 210, 235, .85)';
          context.shadowBlur = 4 + node.depth * 5;
          context.fill();
          context.shadowBlur = 0;
        }

        // A restrained focus response makes the visual acknowledge the pointer.
        if (networkPointer.active && !reduceMotion) {
          const focus = context.createRadialGradient(networkPointer.x, networkPointer.y, 0, networkPointer.x, networkPointer.y, 130);
          focus.addColorStop(0, 'rgba(83, 224, 239, .12)');
          focus.addColorStop(1, 'rgba(83, 224, 239, 0)');
          context.fillStyle = focus;
          context.fillRect(networkPointer.x - 130, networkPointer.y - 130, 260, 260);
        }
      }

      const animate = time => {
        frame = 0;
        if (document.hidden || !inViewport || reduceMotion) return;
        const delta = previousTime ? Math.min(32, time - previousTime) : 16;
        previousTime = time;
        elapsed += delta;
        for (const node of nodes) {
          node.x += node.vx * delta;
          node.y += node.vy * delta;
          if (networkPointer.active) {
            const dx = node.x - networkPointer.x;
            const dy = node.y - networkPointer.y;
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq < 150 * 150 && distanceSq > 1) {
              const force = (1 - Math.sqrt(distanceSq) / 150) * .00042 * delta;
              node.vx += dx * force;
              node.vy += dy * force;
            }
          }
          node.vx *= .998;
          node.vy *= .998;
          const marginX = width * .035;
          const marginY = height * .055;
          if (node.x < marginX || node.x > width - marginX) node.vx *= -1;
          if (node.y < marginY || node.y > height - marginY) node.vy *= -1;
          node.x = Math.max(marginX, Math.min(width - marginX, node.x));
          node.y = Math.max(marginY, Math.min(height - marginY, node.y));
        }
        draw(time);
        frame = window.requestAnimationFrame(animate);
      };

      const start = () => {
        if (!reduceMotion && !document.hidden && inViewport && !frame) {
          previousTime = 0;
          frame = window.requestAnimationFrame(animate);
        }
      };
      const stop = () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      };

      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(networkCanvas);
      } else {
        window.addEventListener('resize', resize, { passive: true });
      }
      if ('IntersectionObserver' in window) {
        const canvasObserver = new IntersectionObserver(entries => {
          inViewport = entries.some(entry => entry.isIntersecting);
          if (inViewport) start(); else stop();
        }, { threshold: .05 });
        canvasObserver.observe(networkCanvas);
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
      });
      resize();
      if (reduceMotion) draw(0); else start();
    }
  }

  // Cursor-aware surface highlights; no layout work or animation loop is needed.
  document.querySelectorAll('.mechanism-card, .architecture-stage, .module-detail, .closing').forEach(surface => {
    surface.addEventListener('pointermove', event => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      surface.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    }, { passive: true });
    surface.addEventListener('pointerleave', () => {
      surface.style.removeProperty('--pointer-x');
      surface.style.removeProperty('--pointer-y');
    });
  });

  // Small tactile ripple feedback on primary interactive surfaces.
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('.button, .header-github, .module-button, .faq-question');
    if (!target || reduceMotion || event.button !== 0) return;
    const bounds = target.getBoundingClientRect();
    const diameter = Math.max(bounds.width, bounds.height) * 1.25;
    const ripple = document.createElement('span');
    ripple.className = 'interaction-ripple';
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - bounds.left - diameter / 2}px`;
    ripple.style.top = `${event.clientY - bounds.top - diameter / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }, { passive: true });

  // Sticky header gains a little more definition after the visitor starts scrolling.
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();