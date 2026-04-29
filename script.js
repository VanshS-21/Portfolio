document.addEventListener('DOMContentLoaded', () => {

  // ─── PAGE LOADER ────────────────────────────────────────────────────────
  const loader  = document.getElementById('page-loader');
  const countEl = document.getElementById('loader-count');

  if (loader && countEl) {
    // Words animate via CSS (0.1s, 0.28s, 0.46s delays)
    // Counter runs for 1100ms then split fires
    const totalDuration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      countEl.textContent = Math.floor(eased * 100);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        countEl.textContent = '100';
        setTimeout(() => {
          loader.classList.add('is-done');
          setTimeout(() => { loader.style.display = 'none'; }, 800);
        }, 150);
      }
    };

    requestAnimationFrame(tick);
  }

  // ─── DYNAMIC NAV HEIGHT → scroll-margin-top ────────────────────────────
  const nav = document.querySelector('nav');
  const updateScrollMargin = () => {
    const h = nav ? nav.offsetHeight : 88;
    document.documentElement.style.setProperty('--nav-height', `${h}px`);
    const main = document.querySelector('main');
    if (main) main.style.paddingTop = `${h}px`;
  };
  updateScrollMargin();
  window.addEventListener('resize', updateScrollMargin);

  // ─── CUSTOM CURSOR ──────────────────────────────────────────────────────
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let cx = -100, cy = -100; // start off-screen
    let dx = -100, dy = -100;

    document.addEventListener('mousemove', (e) => {
      dx = e.clientX;
      dy = e.clientY;
      cursorDot.style.left = `${dx}px`;
      cursorDot.style.top  = `${dy}px`;
    });

    // Smooth cursor ring follows with lerp
    const lerp = (a, b, t) => a + (b - a) * t;
    const animateCursor = () => {
      cx = lerp(cx, dx, 0.12);
      cy = lerp(cy, dy, 0.12);
      cursor.style.left = `${cx}px`;
      cursor.style.top  = `${cy}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover state on interactive elements
    const interactives = document.querySelectorAll('a, button, [data-cursor]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-clicking'));
  }

  // ─── MAGNETIC BUTTONS ───────────────────────────────────────────────────
  document.querySelectorAll('.magnetic-wrap').forEach((wrap) => {
    const btn = wrap.querySelector('.btn-primary, .btn-ghost');
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });

    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });


  // ─── AI SCALE INTERACTION ────────────────────────────────────────────────
  const aiScale    = document.getElementById('ai-scale');
  const aiPanelUse  = document.getElementById('ai-panel-use');
  const aiPanelDont = document.getElementById('ai-panel-dont');

  if (aiScale && aiPanelUse && aiPanelDont) {
    aiPanelUse.addEventListener('mouseenter', () => {
      aiScale.classList.add('use-active');
      aiScale.classList.remove('dont-active');
    });
    aiPanelDont.addEventListener('mouseenter', () => {
      aiScale.classList.add('dont-active');
      aiScale.classList.remove('use-active');
    });
    aiScale.addEventListener('mouseleave', () => {
      aiScale.classList.remove('use-active', 'dont-active');
    });
  }

  // ─── HERO CODE TYPEWRITER ────────────────────────────────────────────────
  const codeEl = document.getElementById('hero-code-content');
  if (codeEl) {
    const lines = [
      { text: '<span style="color:#6366f1">const</span> <span style="color:#6ee7b7">vansh</span> = {', delay: 900 },
      { text: '  role:   <span style="color:#a5b4fc">"Full-Stack Developer"</span>,', delay: 1100 },
      { text: '  stack:  [<span style="color:#a5b4fc">"React"</span>, <span style="color:#a5b4fc">"Node"</span>, <span style="color:#a5b4fc">"Java"</span>],', delay: 1300 },
      { text: '  data:   [<span style="color:#a5b4fc">"MongoDB"</span>, <span style="color:#a5b4fc">"SQL"</span>],', delay: 1500 },
      { text: '  ai:     <span style="color:#a5b4fc">"exploring"</span>,', delay: 1700 },
      { text: '  status: <span style="color:#6ee7b7">"open to work"</span>,', delay: 1900 },
      { text: '  thinks: <span style="color:#a5b4fc">"with AI, not for it"</span>,', delay: 2100 },
      { text: '};', delay: 2300 },
      { text: '', delay: 2500 },
      { text: '<span style="color:#6366f1">export default</span> vansh;', delay: 2600 },
    ];

    lines.forEach(({ text, delay }) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.innerHTML = text || '&nbsp;';
        codeEl.appendChild(line);
      }, delay);
    });
  }

  // ─── BENTO COMMIT GRID ───────────────────────────────────────────────────
  const commitGrid = document.getElementById('commit-grid');
  if (commitGrid) {
    for (let i = 0; i < 60; i++) {
      const cell = document.createElement('div');
      cell.className = 'commit-cell';
      const r = Math.random();
      if (r > 0.75) cell.classList.add('active');
      else if (r > 0.45) cell.classList.add('mid');
      commitGrid.appendChild(cell);
    }
  }

  // ─── STICKY THINKING SCROLL ──────────────────────────────────────────────
  const thinkingOuter  = document.querySelector('.sticky-thinking-outer');
  const thinkingPanels = document.querySelectorAll('.thinking-panel');
  const thinkingProgress = document.getElementById('thinking-progress');
  const thinkingCounter  = document.getElementById('thinking-counter');
  const isMobile = () => window.innerWidth < 768;

  if (thinkingOuter && thinkingPanels.length && !isMobile()) {
    // Activate first panel immediately
    thinkingPanels[0].classList.add('is-active');

    const updateThinking = () => {
      if (isMobile()) return;
      const rect = thinkingOuter.getBoundingClientRect();
      const total = thinkingOuter.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      const panelCount = thinkingPanels.length;
      const activeIndex = Math.min(
        Math.floor(progress * panelCount),
        panelCount - 1
      );

      thinkingPanels.forEach((p, i) => {
        p.classList.toggle('is-active', i === activeIndex);
      });

      // Update progress bar
      if (thinkingProgress) {
        thinkingProgress.style.width = `${((activeIndex + 1) / panelCount) * 100}%`;
      }
      if (thinkingCounter) {
        thinkingCounter.textContent = `0${activeIndex + 1} / 0${panelCount}`;
      }
    };

    window.addEventListener('scroll', updateThinking, { passive: true });
    updateThinking();
  }

  // ─── TEXT SCRAMBLE ON NAV HOVER ─────────────────────────────────────────
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const scramble = (el) => {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let frame = 0;
    const totalFrames = 10;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < Math.floor((frame / totalFrames) * original.length)) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      frame++;
      if (frame > totalFrames) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 40);
  };

  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.addEventListener('mouseenter', () => scramble(el));
  });

  // ─── WORD-BY-WORD HERO SUBTEXT ───────────────────────────────────────────
  const heroSubtext = document.querySelector('#hero-content p.animate-in');
  if (heroSubtext) {
    const baseDelay = 520; // starts after headline
    // Only wrap the first text node (before the <span>)
    const firstChild = heroSubtext.firstChild;
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
      const words = firstChild.textContent.trim().split(' ');
      const wrapped = words
        .map((w, i) => `<span class="hero-word" style="--word-delay:${baseDelay + i * 35}ms">${w}</span> `)
        .join('');
      firstChild.replaceWith(document.createRange().createContextualFragment(wrapped));
    }
  }

  // ─── SPOTLIGHT ON STACK CARDS ────────────────────────────────────────────
  const stackGrid = document.getElementById('stack-grid');
  if (stackGrid) {
    stackGrid.addEventListener('mousemove', (e) => {
      const cards = stackGrid.querySelectorAll('.stack-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ─── ITEM 1: CURRENTLY LEARNING TICKER ──────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  // Edit this array to update what's shown in the ticker strip.
  // Keep entries short — they scroll automatically.
  const tickerItems = [
    { label: 'Currently learning', value: 'ML model evaluation & bias' },
    { label: 'Reading',            value: 'Clean Code — Robert C. Martin' },
    { label: 'Exploring',          value: 'React Server Components' },
    { label: 'Practicing',         value: 'SQL query optimisation' },
    { label: 'This week',          value: 'Understanding transformer architecture basics' },
  ];

  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    // Duplicate items for seamless loop
    const allItems = [...tickerItems, ...tickerItems];
    allItems.forEach(({ label, value }) => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.innerHTML = `<span class="ticker-dot"></span><span style="color:rgba(240,235,227,0.3);margin-right:0.4rem">${label}:</span>${value}`;
      tickerTrack.appendChild(el);
    });
  }


  // ─── DYNAMIC FOOTER YEAR ────────────────────────────────────────────────
  // Change STATUS to: 'available' | 'selective' | 'unavailable'
  const STATUS = 'available';

  // ─── ITEM 3: AVAILABILITY STATUS ────────────────────────────────────────
  const dot = document.getElementById('availability-dot');
  const bentoDot = document.querySelector('.bento-availability-dot');
  const bentoStatusText = document.querySelector('.bento-status-text');

  const statusMap = {
    available:   { cls: '',            title: 'Open to work & collaborations', label: 'Open to work',  color: null },
    selective:   { cls: 'busy',        title: 'Selectively open to opportunities', label: 'Selective', color: '#fbbf24' },
    unavailable: { cls: 'unavailable', title: 'Not available right now', label: 'Unavailable',         color: '#f87171' },
  };

  const s = statusMap[STATUS] || statusMap.available;

  if (dot) {
    if (s.cls) dot.classList.add(s.cls);
    dot.setAttribute('title', s.title);
    dot.setAttribute('aria-label', s.title);
  }

  if (bentoDot) {
    if (s.cls) bentoDot.classList.add(s.cls);
  }

  if (bentoStatusText) {
    bentoStatusText.textContent = s.label;
    if (s.color) bentoStatusText.style.color = s.color;
  }


  // ─── ITEM 3: AVAILABILITY STATUS ────────────────────────────────────────
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo || '1', 10);
        const duration = 900;
        const start = performance.now();

        el.classList.add('is-counting');

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = String(current).padStart(2, '0');
          if (progress < 1) requestAnimationFrame(tick);
          else el.classList.add('counted');
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter-num[data-count-to]').forEach((el) => {
    counterObserver.observe(el);
  });

  // ─── PARALLAX ORBS ──────────────────────────────────────────────────────
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orb1.style.transform = `translateY(${y * 0.08}px)`;
      orb2.style.transform = `translateY(${y * -0.05}px)`;
    }, { passive: true });
  }
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay;
          if (delay) entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
          entry.target.classList.add('is-visible');

          // Counter animation for decorative numbers
          if (entry.target.classList.contains('counter-num')) {
            entry.target.classList.add('counted');
          }

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

  // Staggered children reveal
  document.querySelectorAll('[data-reveal-stagger]').forEach((el) => revealObserver.observe(el));

  // Individual cap-item and log-entry-new observers
  document.querySelectorAll('.cap-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    revealObserver.observe(el);
  });

  document.querySelectorAll('.log-entry-new').forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    revealObserver.observe(el);
  });


  // ─── CINEMATIC SCROLL EFFECTS ───────────────────────────────────────────
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav deepens after 40px scroll
    if (nav) {
      nav.classList.toggle('is-scrolled', scrollY > 40);
    }

    // Hero scroll indicator fades out after 80px
    if (heroSection) {
      heroSection.classList.toggle('hero-scrolled', scrollY > 80);
    }
  }, { passive: true });


  // ─── ACTIVE NAV LINK ────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => sectionObserver.observe(s));


  // ─── MOBILE MENU ────────────────────────────────────────────────────────
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    const mobileMenuInner = mobileMenu.querySelector('.mobile-menu-inner');
    
    const toggleMenu = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      
      // Check scroll on open
      if (open && mobileMenuInner) {
        checkMenuScroll();
      }
    };
    
    // Check if menu content is scrollable
    const checkMenuScroll = () => {
      if (!mobileMenuInner) return;
      const hasScroll = mobileMenuInner.scrollHeight > mobileMenuInner.clientHeight;
      mobileMenuInner.classList.toggle('has-scroll', hasScroll);
    };
    
    // Update scroll indicator on scroll
    if (mobileMenuInner) {
      mobileMenuInner.addEventListener('scroll', checkMenuScroll);
      window.addEventListener('resize', checkMenuScroll);
    }

    menuBtn.addEventListener('click', () => {
      toggleMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') toggleMenu(false);
    });
  }


  // ─── ITEM 2: TERMINAL EASTER EGG ────────────────────────────────────────
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalOutput  = document.getElementById('terminal-output');
  const terminalInput   = document.getElementById('terminal-input');
  const terminalClose   = document.getElementById('terminal-close');
  
  let lastFocusedElement;

  // Terminal command definitions
  const COMMANDS = {
    help: () => [
      { type: 'response', text: 'Available commands:' },
      { type: 'response', text: '  <span class="terminal-highlight">whoami</span>       — who is Vansh?' },
      { type: 'response', text: '  <span class="terminal-highlight">skills</span>       — tech stack' },
      { type: 'response', text: '  <span class="terminal-highlight">status</span>       — availability' },
      { type: 'response', text: '  <span class="terminal-highlight">contact</span>      — get in touch' },
      { type: 'response', text: '  <span class="terminal-highlight">log</span>          — recent learning' },
      { type: 'response', text: '  <span class="terminal-highlight">clear</span>        — clear terminal' },
      { type: 'response', text: '  <span class="terminal-highlight">exit</span>         — close terminal' },
      { type: 'br' },
    ],
    whoami: () => [
      { type: 'response', text: 'Vansh. Full-stack developer. CS student.' },
      { type: 'response', text: 'Builds on both ends of the stack. Currently exploring AI/ML.' },
      { type: 'response', text: 'Believes the best developers in 2025 aren\'t the ones who write the most code — they\'re the ones who know exactly what to build and why.' },
      { type: 'br' },
    ],
    skills: () => [
      { type: 'response', text: '<span class="terminal-highlight">frontend</span>   HTML/CSS · JavaScript · React · Tailwind' },
      { type: 'response', text: '<span class="terminal-highlight">backend</span>    Node.js · Express · Java · REST APIs' },
      { type: 'response', text: '<span class="terminal-highlight">data</span>       MongoDB · SQL · Python · AI/ML (learning)' },
      { type: 'response', text: '<span class="terminal-highlight">systems</span>    Client-Server · Caching · Load Balancing · HLD basics' },
      { type: 'response', text: '<span class="terminal-highlight">tools</span>      Git · GitHub · VS Code' },
      { type: 'br' },
    ],
    status: () => {
      const statusText = {
        available:   '<span class="terminal-success">● open to work</span> — available for projects & collaborations.',
        selective:   '<span style="color:#fbbf24">● selective</span> — open to the right opportunities.',
        unavailable: '<span class="terminal-error">● unavailable</span> — not taking on new work right now.',
      };
      return [
        { type: 'response', text: statusText[STATUS] || statusText.available },
        { type: 'br' },
      ];
    },
    contact: () => [
      { type: 'response', text: '<span class="terminal-highlight">email</span>     vansh.connectme@gmail.com' },
      { type: 'response', text: '<span class="terminal-highlight">github</span>    github.com/VanshS-21' },
      { type: 'response', text: '<span class="terminal-highlight">linkedin</span>  linkedin.com/in/vanshsahu21' },
      { type: 'br' },
    ],
    log: () => [
      { type: 'response', text: '<span class="terminal-highlight">Apr 2025</span>  The gap between accurate and useful in ML.' },
      { type: 'response', text: '<span class="terminal-highlight">Mar 2025</span>  Why error handling is honest programming.' },
      { type: 'response', text: '<span class="terminal-highlight">Feb 2025</span>  CSS is a layout system, not a styling language.' },
      { type: 'response', text: '<span class="terminal-dim">→ See full log on the page.</span>' },
      { type: 'br' },
    ],
    clear: () => 'CLEAR',
    exit:  () => 'EXIT',
  };

  const WELCOME_LINES = () => {
    if (!terminalOutput) return;
    terminalOutput.innerHTML = '';
    printLines([
      { type: 'response', text: '<span class="terminal-highlight">vansh@portfolio</span><span class="terminal-separator">:</span><span class="terminal-path">~</span><span class="terminal-sym">$</span> <span class="terminal-cmd">welcome</span>' },
      { type: 'response', text: 'Hey. You found the terminal. Type <span class="terminal-highlight">help</span> to see what\'s available.' },
      { type: 'response', text: '<span class="terminal-dim">Press Escape or type \'exit\' to close.</span>' },
      { type: 'br' },
    ]);
  };

  const openTerminal = () => {
    if (!terminalOverlay) return;
    lastFocusedElement = document.activeElement;
    terminalOverlay.classList.add('is-open');
    terminalOverlay.removeAttribute('aria-hidden');
    if (terminalOutput && terminalOutput.children.length === 0) WELCOME_LINES();
    setTimeout(() => terminalInput && terminalInput.focus(), 200);
  };

  const closeTerminal = () => {
    if (!terminalOverlay) return;
    terminalOverlay.classList.remove('is-open');
    terminalOverlay.setAttribute('aria-hidden', 'true');
    
    // Blur the terminal input to ensure it's not focused
    if (terminalInput) terminalInput.blur();
    
    // Return focus to the element that was focused before opening
    if (lastFocusedElement && lastFocusedElement !== terminalInput) {
      lastFocusedElement.focus();
    }
  };

  const printLines = (lines) => {
    if (!terminalOutput) return;
    lines.forEach((line) => {
      if (line.type === 'br') {
        terminalOutput.appendChild(document.createElement('br'));
      } else {
        const p = document.createElement('p');
        p.className = 'terminal-response';
        p.innerHTML = line.text;
        terminalOutput.appendChild(p);
      }
    });
    // Scroll to bottom
    const body = document.getElementById('terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
  };

  const printCommand = (cmd) => {
    if (!terminalOutput) return;
    const line = document.createElement('p');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">vansh@portfolio</span><span class="terminal-separator">:</span><span class="terminal-path">~</span><span class="terminal-sym">$</span> <span class="terminal-cmd">${cmd}</span>`;
    terminalOutput.appendChild(line);
  };

  const handleCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    printCommand(cmd);

    if (cmd === 'exit') { closeTerminal(); return; }
    if (cmd === 'clear') {
      WELCOME_LINES();
      return;
    }

    const fn = COMMANDS[cmd];
    if (fn) {
      const result = fn();
      if (Array.isArray(result)) printLines(result);
    } else {
      printLines([
        { type: 'response', text: `<span class="terminal-error">command not found: ${cmd}</span>` },
        { type: 'response', text: 'Type <span class="terminal-highlight">help</span> for available commands.' },
        { type: 'br' },
      ]);
    }
  };

  // Keyboard trigger: press / or ` to open terminal
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const terminalIsOpen = terminalOverlay?.classList.contains('is-open');
    
    // Don't trigger if typing in form inputs (but allow if terminal is closed)
    const isTypingInForm = (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') 
                           && activeEl?.id !== 'terminal-input';

    // Open terminal: not already open, not typing in form, pressed trigger key
    if ((e.key === '/' || e.key === '`') && !terminalIsOpen && !isTypingInForm) {
      e.preventDefault();
      openTerminal();
    }
    
    // Close terminal: escape key pressed
    if (e.key === 'Escape' && terminalIsOpen) {
      closeTerminal();
    }
  });

  if (terminalClose) terminalClose.addEventListener('click', closeTerminal);

  // Click outside to close
  if (terminalOverlay) {
    terminalOverlay.addEventListener('click', (e) => {
      if (e.target === terminalOverlay) closeTerminal();
    });
  }

  // Handle input — with command history (↑/↓) and tab completion
  if (terminalInput) {
    const history = [];
    let historyIndex = -1;
    const commandNames = Object.keys(COMMANDS);

    terminalInput.addEventListener('keydown', (e) => {

      // Tab completion
      if (e.key === 'Tab') {
        e.preventDefault();
        const val = terminalInput.value.trim().toLowerCase();
        if (!val) return;
        const matches = commandNames.filter((c) => c.startsWith(val));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        } else if (matches.length > 1) {
          // Show available completions
          printCommand(terminalInput.value);
          printLines([
            { type: 'response', text: matches.map((m) => `<span class="terminal-highlight">${m}</span>`).join('  ') },
            { type: 'br' },
          ]);
        }
        return;
      }

      if (e.key === 'Enter') {
        const val = terminalInput.value;
        if (val.trim()) {
          history.unshift(val.trim());
          if (history.length > 50) history.pop();
        }
        historyIndex = -1;
        terminalInput.value = '';
        handleCommand(val);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        historyIndex = Math.min(historyIndex + 1, history.length - 1);
        terminalInput.value = history[historyIndex];
        setTimeout(() => terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length), 0);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex <= 0) { historyIndex = -1; terminalInput.value = ''; return; }
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    });
  }


  // ─── CONTACT FORM ────────────────────────────────────────────────────────
  // Set your Formspree form ID here to enable form submissions.
  // Get one free at https://formspree.io
  // Until then, the form falls back to a mailto: link gracefully.
  const FORMSPREE_ID = 'mqenzalq';

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;

      // If no Formspree ID is set, fall back to mailto
      if (!FORMSPREE_ID) {
        const name    = form.querySelector('[name="name"]')?.value || '';
        const message = form.querySelector('[name="message"]')?.value || '';
        const email   = form.querySelector('[name="email"]')?.value || '';
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body    = encodeURIComponent(`${message}\n\nReply to: ${email}`);
        window.location.href = `mailto:vansh.connectme@gmail.com?subject=${subject}&body=${body}`;
        return;
      }

      btn.innerHTML = '<span class="spinner"></span><span style="margin-left:0.5rem">Sending...</span>';
      btn.disabled = true;
      btn.classList.add('is-loading');

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          showFormSuccess(btn, originalText);
        } else {
          btn.innerHTML = 'Something went wrong — email me directly.';
          btn.style.color = '#e07070';
          btn.classList.remove('is-loading');
          setTimeout(() => { btn.innerHTML = originalText; btn.style.color = ''; btn.disabled = false; }, 4000);
        }
      } catch {
        btn.innerHTML = 'Network error — email me directly.';
        btn.classList.remove('is-loading');
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 4000);
      }
    });
  }

  function showFormSuccess(btn, originalText) {
    btn.innerHTML = "Sent — I'll be in touch.";
    btn.classList.add('success');
    btn.classList.remove('is-loading');
    setTimeout(() => {
      document.getElementById('contact-form')?.reset();
      btn.innerHTML = originalText;
      btn.classList.remove('success');
      btn.disabled = false;
    }, 5000);
  }

});
