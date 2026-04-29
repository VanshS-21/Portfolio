// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const lerp = (start, end, factor) => start + (end - start) * factor;

const easeOutQuad = (t) => 1 - Math.pow(1 - t, 2);

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══════════════════════════════════════════════════════════════════════════
// PAGE LOADER MODULE
// ═══════════════════════════════════════════════════════════════════════════

const PageLoader = {
  init() {
    const loader = $('#page-loader');
    const countEl = $('#loader-count');
    
    if (!loader || !countEl) return;

    const DURATION = 1100;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutQuad(progress);
      
      countEl.textContent = Math.floor(eased * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.complete(loader);
      }
    };

    requestAnimationFrame(animate);
  },

  complete(loader) {
    loader.classList.add('is-done');
    setTimeout(() => {
      loader.style.display = 'none';
      loader.remove(); // Clean up DOM
    }, 800);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  
  PageLoader.init();

  // ─── DYNAMIC NAV HEIGHT → scroll-margin-top ────────────────────────────
  const NavHeight = {
    nav: $('nav'),
    main: $('main'),
    
    update() {
      if (!this.nav) return;
      const height = this.nav.offsetHeight;
      document.documentElement.style.setProperty('--nav-height', `${height}px`);
      if (this.main) this.main.style.paddingTop = `${height}px`;
    },

    init() {
      this.update();
      window.addEventListener('resize', debounce(() => this.update(), 150));
    }
  };
  
  NavHeight.init();

  // ─── CUSTOM CURSOR ──────────────────────────────────────────────────────
  const CustomCursor = {
    cursor: $('#cursor'),
    dot: $('#cursor-dot'),
    cx: -100,
    cy: -100,
    dx: -100,
    dy: -100,

    init() {
      if (!this.cursor || !this.dot || !window.matchMedia('(hover: hover)').matches) return;

      document.addEventListener('mousemove', (e) => {
        this.dx = e.clientX;
        this.dy = e.clientY;
        this.dot.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
      }, { passive: true });

      this.animate();
      this.attachHoverListeners();
      this.attachClickListeners();
    },

    animate() {
      this.cx = lerp(this.cx, this.dx, 0.12);
      this.cy = lerp(this.cy, this.dy, 0.12);
      this.cursor.style.transform = `translate(${this.cx}px, ${this.cy}px)`;
      requestAnimationFrame(() => this.animate());
    },

    attachHoverListeners() {
      $$('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => this.cursor.classList.add('is-hovering'), { passive: true });
        el.addEventListener('mouseleave', () => this.cursor.classList.remove('is-hovering'), { passive: true });
      });
    },

    attachClickListeners() {
      document.addEventListener('mousedown', () => this.cursor.classList.add('is-clicking'), { passive: true });
      document.addEventListener('mouseup', () => this.cursor.classList.remove('is-clicking'), { passive: true });
    }
  };

  CustomCursor.init();

  // ─── MAGNETIC BUTTONS ───────────────────────────────────────────────────
  const MagneticButtons = {
    init() {
      if (prefersReducedMotion()) return;

      $$('.magnetic-wrap').forEach(wrap => {
        const btn = $('.btn-primary, .btn-ghost', wrap);
        if (!btn) return;

        wrap.addEventListener('mousemove', (e) => {
          const rect = wrap.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });

        wrap.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        }, { passive: true });
      });
    }
  };

  MagneticButtons.init();


  // ─── HERO CODE TYPEWRITER ────────────────────────────────────────────────
  const HeroCode = {
    element: $('#hero-code-content'),
    
    lines: [
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
    ],

    init() {
      if (!this.element) return;
      
      this.lines.forEach(({ text, delay }) => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.innerHTML = text || '&nbsp;';
          this.element.appendChild(line);
        }, delay);
      });
    }
  };

  HeroCode.init();

  // ─── BENTO COMMIT GRID ───────────────────────────────────────────────────
  const CommitGrid = {
    container: $('#commit-grid'),
    cellCount: 60,

    init() {
      if (!this.container) return;
      
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < this.cellCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'commit-cell';
        const r = Math.random();
        if (r > 0.75) cell.classList.add('active');
        else if (r > 0.45) cell.classList.add('mid');
        fragment.appendChild(cell);
      }
      
      this.container.appendChild(fragment);
    }
  };

  CommitGrid.init();

  // ─── STICKY THINKING SCROLL ──────────────────────────────────────────────
  const ThinkingScroll = {
    outer: $('.sticky-thinking-outer'),
    panels: $$('.thinking-panel'),
    progress: $('#thinking-progress'),
    counter: $('#thinking-counter'),

    isDesktop: () => window.innerWidth >= 1024,

    init() {
      if (!this.outer || !this.panels.length) return;

      // Only enable sticky scroll on desktop
      if (this.isDesktop()) {
        this.panels[0]?.classList.add('is-active');
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
      } else {
        // On mobile/tablet, make all panels visible
        this.panels.forEach(p => p.classList.add('is-active'));
      }

      // Re-initialize on resize
      window.addEventListener('resize', debounce(() => {
        if (this.isDesktop()) {
          this.panels.forEach(p => p.classList.remove('is-active'));
          this.panels[0]?.classList.add('is-active');
          this.update();
        } else {
          this.panels.forEach(p => p.classList.add('is-active'));
        }
      }, 250));
    },

    update() {
      if (!this.isDesktop()) return;

      const rect = this.outer.getBoundingClientRect();
      const total = this.outer.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.max(0, Math.min(1, scrolled / total));

      const panelCount = this.panels.length;
      const activeIndex = Math.min(
        Math.floor(progress * panelCount),
        panelCount - 1
      );

      this.panels.forEach((p, i) => {
        p.classList.toggle('is-active', i === activeIndex);
      });

      if (this.progress) {
        this.progress.style.width = `${((activeIndex + 1) / panelCount) * 100}%`;
      }
      
      if (this.counter) {
        this.counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(panelCount).padStart(2, '0')}`;
      }
    }
  };

  ThinkingScroll.init();

  // ─── TEXT SCRAMBLE ON NAV HOVER ─────────────────────────────────────────
  const TextScramble = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    
    scramble(el) {
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
            return this.chars[Math.floor(Math.random() * this.chars.length)];
          })
          .join('');
        
        frame++;
        
        if (frame > totalFrames) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 40);
    },

    init() {
      $$('[data-scramble]').forEach(el => {
        el.addEventListener('mouseenter', () => this.scramble(el), { passive: true });
      });
    }
  };

  TextScramble.init();

  // ─── WORD-BY-WORD HERO SUBTEXT ───────────────────────────────────────────
  const HeroSubtext = {
    element: $('#hero-content p.animate-in'),
    baseDelay: 520,

    init() {
      if (!this.element) return;

      const firstChild = this.element.firstChild;
      if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) return;

      const words = firstChild.textContent.trim().split(' ');
      const wrapped = words
        .map((word, i) => 
          `<span class="hero-word" style="--word-delay:${this.baseDelay + i * 35}ms">${word}</span> `
        )
        .join('');
      
      firstChild.replaceWith(document.createRange().createContextualFragment(wrapped));
    }
  };

  HeroSubtext.init();



  // ─── TICKER STRIP ────────────────────────────────────────────────────────
  const Ticker = {
    track: $('#ticker-track'),
    
    items: [
      { label: 'Currently learning', value: 'ML model evaluation & bias' },
      { label: 'Reading',            value: 'Clean Code — Robert C. Martin' },
      { label: 'Exploring',          value: 'React Server Components' },
      { label: 'Practicing',         value: 'SQL query optimisation' },
      { label: 'This week',          value: 'Understanding transformer architecture basics' },
    ],

    init() {
      if (!this.track) return;

      const fragment = document.createDocumentFragment();
      const allItems = [...this.items, ...this.items]; // Duplicate for seamless loop

      allItems.forEach(({ label, value }) => {
        const el = document.createElement('span');
        el.className = 'ticker-item';
        el.innerHTML = `<span class="ticker-dot"></span><span style="color:rgba(240,235,227,0.3);margin-right:0.4rem">${label}:</span>${value}`;
        fragment.appendChild(el);
      });

      this.track.appendChild(fragment);
    }
  };

  Ticker.init();

  // ─── FOOTER YEAR ─────────────────────────────────────────────────────────
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ─── AVAILABILITY STATUS ────────────────────────────────────────────────
  const AvailabilityStatus = {
    STATUS: 'available', // 'available' | 'selective' | 'unavailable'
    
    statusMap: {
      available:   { cls: '',            title: 'Open to work & collaborations', label: 'Open to work',  color: null },
      selective:   { cls: 'busy',        title: 'Selectively open to opportunities', label: 'Selective', color: '#fbbf24' },
      unavailable: { cls: 'unavailable', title: 'Not available right now', label: 'Unavailable',         color: '#f87171' },
    },

    init() {
      const status = this.statusMap[this.STATUS] || this.statusMap.available;
      
      const dot = $('#availability-dot');
      const bentoDot = $('.bento-availability-dot');
      const bentoStatusText = $('.bento-status-text');

      if (dot) {
        if (status.cls) dot.classList.add(status.cls);
        dot.setAttribute('title', status.title);
        dot.setAttribute('aria-label', status.title);
      }

      if (bentoDot && status.cls) {
        bentoDot.classList.add(status.cls);
      }

      if (bentoStatusText) {
        bentoStatusText.textContent = status.label;
        if (status.color) bentoStatusText.style.color = status.color;
      }
    }
  };

  AvailabilityStatus.init();




  // ─── SCROLL-DRIVEN EFFECTS (consolidated) ──────────────────────────────
  const ScrollEffects = {
    orb1: $('.orb-1'),
    orb2: $('.orb-2'),
    nav: $('nav'),
    heroSection: $('#hero'),
    ticking: false,

    init() {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
      if (this.ticking) return;
      
      this.ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Parallax orbs
        if (this.orb1) this.orb1.style.transform = `translateY(${scrollY * 0.08}px)`;
        if (this.orb2) this.orb2.style.transform = `translateY(${scrollY * -0.05}px)`;

        // Nav deepens after 40px scroll
        if (this.nav) this.nav.classList.toggle('is-scrolled', scrollY > 40);

        // Hero scroll indicator fades out after 80px
        if (this.heroSection) this.heroSection.classList.toggle('hero-scrolled', scrollY > 80);

        this.ticking = false;
      });
    }
  };

  ScrollEffects.init();

  // ─── SCROLL REVEAL ──────────────────────────────────────────────────────
  const ScrollReveal = {
    observer: null,

    init() {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      // Observe all reveal elements
      $$('[data-reveal], [data-reveal-stagger], .cap-item, .log-entry-new').forEach(el => {
        this.observer.observe(el);
      });
    },

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = el.dataset.revealDelay;
        
        if (delay) {
          el.style.setProperty('--reveal-delay', `${delay}ms`);
        }

        el.classList.add('is-visible');

        // Counter animation for decorative numbers
        if (el.classList.contains('counter-num')) {
          el.classList.add('counted');
        }

        this.observer.unobserve(el);
      });
    }
  };

  ScrollReveal.init();


  // ─── ACTIVE NAV LINK ────────────────────────────────────────────────────
  const ActiveNav = {
    sections: $$('section[id]'),
    navLinks: $$('.nav-link'),
    observer: null,

    init() {
      if (!this.sections.length || !this.navLinks.length) return;

      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        { threshold: 0.35 }
      );

      this.sections.forEach(section => this.observer.observe(section));
    },

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        this.navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isActive);
        });
      });
    }
  };

  ActiveNav.init();


  // ─── MOBILE MENU ────────────────────────────────────────────────────────
  const MobileMenu = {
    btn: $('#mobile-menu-btn'),
    menu: $('#mobile-menu'),
    menuInner: null,

    init() {
      if (!this.btn || !this.menu) return;

      this.menuInner = $('.mobile-menu-inner', this.menu);
      
      this.btn.addEventListener('click', () => this.toggle());
      
      $$('a', this.menu).forEach(link => {
        link.addEventListener('click', () => this.close());
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });

      if (this.menuInner) {
        this.menuInner.addEventListener('scroll', () => this.checkScroll());
        window.addEventListener('resize', () => this.checkScroll());
      }
    },

    isOpen() {
      return this.btn.getAttribute('aria-expanded') === 'true';
    },

    toggle() {
      this.isOpen() ? this.close() : this.open();
    },

    open() {
      this.btn.setAttribute('aria-expanded', 'true');
      this.menu.classList.add('is-open');
      this.menu.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      this.checkScroll();
    },

    close() {
      this.btn.setAttribute('aria-expanded', 'false');
      this.menu.classList.remove('is-open');
      this.menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },

    checkScroll() {
      if (!this.menuInner) return;
      const hasScroll = this.menuInner.scrollHeight > this.menuInner.clientHeight;
      this.menuInner.classList.toggle('has-scroll', hasScroll);
    }
  };

  MobileMenu.init();


  // ─── ITEM 2: TERMINAL EASTER EGG ────────────────────────────────────────
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalOutput  = document.getElementById('terminal-output');
  const terminalInput   = document.getElementById('terminal-input');
  const terminalClose   = document.getElementById('terminal-close');
  const terminalBody    = document.getElementById('terminal-body');
  
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
    const body = terminalBody;
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
      const safeCmd = cmd.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      printLines([
        { type: 'response', text: `<span class="terminal-error">command not found: ${safeCmd}</span>` },
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
        btn.style.color = '#e07070';
        btn.classList.remove('is-loading');
        setTimeout(() => { btn.innerHTML = originalText; btn.style.color = ''; btn.disabled = false; }, 4000);
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
