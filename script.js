document.addEventListener('DOMContentLoaded', () => {

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


  // ─── DYNAMIC FOOTER YEAR ────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  // Edit this array to update what's shown in the ticker strip.
  // Keep entries short — they scroll automatically.
  const tickerItems = [
    { label: 'Currently learning', value: 'ML model evaluation & bias' },
    { label: 'Reading',            value: 'Clean Code — Robert C. Martin' },
    { label: 'Building',           value: 'First real project (coming soon)' },
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


  // ─── ITEM 3: AVAILABILITY STATUS ────────────────────────────────────────
  // Change STATUS to: 'available' | 'selective' | 'unavailable'
  const STATUS = 'available';

  const dot = document.getElementById('availability-dot');
  if (dot) {
    const statusMap = {
      available:   { cls: '',            title: 'Open to work & collaborations' },
      selective:   { cls: 'busy',        title: 'Selectively open to opportunities' },
      unavailable: { cls: 'unavailable', title: 'Not available right now' },
    };
    const s = statusMap[STATUS] || statusMap.available;
    if (s.cls) dot.classList.add(s.cls);
    dot.setAttribute('title', s.title);
    dot.setAttribute('aria-label', s.title);
  }


  // ─── ITEM 1: CURRENTLY LEARNING TICKER ──────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay;
          if (delay) entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));


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
    const toggleMenu = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

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
    terminalOverlay.classList.add('is-open');
    terminalOverlay.removeAttribute('aria-hidden');
    if (terminalOutput && terminalOutput.children.length === 0) WELCOME_LINES();
    setTimeout(() => terminalInput && terminalInput.focus(), 200);
  };

  const closeTerminal = () => {
    if (!terminalOverlay) return;
    terminalOverlay.classList.remove('is-open');
    terminalOverlay.setAttribute('aria-hidden', 'true');
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
    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

    if ((e.key === '/' || e.key === '`') && !isTyping) {
      e.preventDefault();
      openTerminal();
    }
    if (e.key === 'Escape') closeTerminal();
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


  // ─── CONTACT FORM (Formspree) ────────────────────────────────────────────
  // Replace YOUR_FORM_ID with your Formspree form ID.
  // Get one free at https://formspree.io
  const FORMSPREE_ID = 'YOUR_FORM_ID';

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
        try {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            showFormSuccess(btn, originalText);
          } else {
            btn.textContent = 'Something went wrong — email me directly.';
            btn.style.color = '#e07070';
            setTimeout(() => { btn.textContent = originalText; btn.style.color = ''; btn.disabled = false; }, 4000);
          }
        } catch {
          btn.textContent = 'Network error — email me directly.';
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 4000);
        }
      } else {
        setTimeout(() => showFormSuccess(btn, originalText), 800);
      }
    });
  }

  function showFormSuccess(btn, originalText) {
    btn.textContent = "Sent — I'll be in touch.";
    btn.classList.add('success');
    setTimeout(() => {
      document.getElementById('contact-form')?.reset();
      btn.textContent = originalText;
      btn.classList.remove('success');
      btn.disabled = false;
    }, 5000);
  }

});
