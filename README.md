# vansh.dev — Personal Portfolio

A handcrafted, single-page portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies — just deliberate code.

## What's in here

| File | Purpose |
|------|---------|
| `index.html` | Structure, content, and Tailwind config |
| `index.css` | Design system, animations, responsive layout |
| `script.js` | Scroll reveal, terminal easter egg, ticker, form handling |
| `og-image.svg` | Open Graph image for link previews |
| `robots.txt` | Crawler directives |
| `sitemap.xml` | Site map (update domain before deploying) |

## Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, grid, flexbox, keyframe animations
- **Vanilla JS** — IntersectionObserver, terminal emulator, command history
- **Tailwind CSS** — via CDN for utility classes
- **Google Fonts** — Cormorant Garamond, JetBrains Mono (single consolidated request)

## Features

- Terminal easter egg — press `/` or `` ` `` anywhere on the page
- Command history (↑/↓) and tab completion in the terminal
- Availability status indicator (update `STATUS` in `script.js`)
- Currently learning ticker — edit `tickerItems` array in `script.js`
- Scroll-reveal animations with staggered delays
- Fully responsive — tested down to 320px
- Keyboard navigation with custom `focus-visible` styles
- Contact form wired for Formspree (replace `YOUR_FORM_ID` in `script.js`)
- `noscript` fallback for JS-disabled environments

## Running locally

No build step required. Open `index.html` directly or use Live Server in VS Code.

```bash
# If you have a simple HTTP server available
npx serve .
```

## Before deploying

- [ ] Replace `YOUR_FORM_ID` in `script.js` with your Formspree ID
- [ ] Add your CV file and update the CV link `href` in the nav
- [ ] Update `yourdomain.com` in `robots.txt` and `sitemap.xml`
- [ ] Convert `og-image.svg` to PNG for broader social platform support
- [ ] Replace placeholder log entries with real content
- [ ] Update `tickerItems` in `script.js` with what you're actually learning

## Customising availability status

In `script.js`, change the `STATUS` variable near the top:

```js
const STATUS = 'available'; // 'available' | 'selective' | 'unavailable'
```

---

Built by Vansh. No templates. No shortcuts.
