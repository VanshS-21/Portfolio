# Vansh — Portfolio

A modern, accessible portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just clean, deliberate code.

**Grade: A- (92/100)** — Reviewed by Senior UI/UX Designer

> *"This is an exceptionally well-crafted portfolio that demonstrates professional-level design thinking, technical execution, and authentic voice."*

📄 **[Read Full Design Review](DESIGN-REVIEW.md)**

## 🚀 Quick Start

Open `index.html` in your browser. That's it.

For development, use any local server:
```bash
npx serve .
# or
python -m http.server
```

## ✨ Features

- **Responsive Design** — Works on all screen sizes
- **Dark Theme** — Sophisticated color system with 4 elevation levels
- **Interactive Terminal** — Press `/` or `` ` `` to open developer terminal
- **Smooth Animations** — GPU-accelerated, respects reduced motion
- **Fully Accessible** — Keyboard navigation, skip links, ARIA labels
- **Custom Cursor** — Magnetic buttons and hover effects (desktop)
- **Contact Form** — Integrated with Formspree

## 🛠️ Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, grid, flexbox, animations
- **Vanilla JavaScript** — No frameworks or dependencies
- **Tailwind CSS** — Via CDN for utility classes
- **Google Fonts** — Cormorant Garamond, Inter, JetBrains Mono

## 📁 Structure

```
portfolio/
├── index.html          # Main HTML file
├── index.css           # All custom styles
├── script.js           # All JavaScript
├── og-image.svg/png    # Social media preview
├── robots.txt          # SEO configuration
├── sitemap.xml         # Site structure
└── images/             # Project screenshots
```

## 🎨 Design System

### Colors
```css
--bg-base:        #0c0b10  /* Darkest background */
--bg-raised:      #100f15  /* Raised surfaces */
--bg-surface:     #16151c  /* Interactive surfaces */
--bg-elevated:    #1d1b25  /* Highest elevation */
--accent:         #6366f1  /* Primary accent */
```

### Typography
- **Display:** Cormorant Garamond (headlines)
- **Body:** Inter (content)
- **Mono:** JetBrains Mono (code, labels)

### Spacing Scale
```css
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-4: 1rem     /* 16px */
--space-6: 2rem     /* 32px */
--space-8: 3rem     /* 48px */
```

## ⚙️ Customization

### Update Availability Status
In `script.js`, line ~90:
```javascript
const STATUS = 'available';  // 'available' | 'selective' | 'unavailable'
```

### Update Learning Ticker
In `script.js`, line ~100:
```javascript
const tickerItems = [
  { label: 'Currently learning', value: 'Your topic' },
  // Add more items...
];
```

### Configure Contact Form
In `script.js`, line ~500:
```javascript
const FORMSPREE_ID = 'your-formspree-id';  // Get free at formspree.io
```

## 🧪 Testing

### Quick Test
1. Open `index.html` in browser
2. Check console for errors (should be none)
3. Press `/` to test terminal
4. Click navigation links
5. Test form submission

### Accessibility Test
1. Press Tab to see skip link
2. Navigate with keyboard only
3. Test with screen reader
4. Verify focus indicators

### Mobile Test
1. Resize browser to mobile width
2. Test hamburger menu
3. Verify all sections stack properly
4. Test form on mobile

## 🚀 Deployment

### Before Deploying
- [ ] Set `FORMSPREE_ID` in `script.js`
- [ ] Update domain in `robots.txt` and `sitemap.xml`
- [ ] Add your CV file and update link
- [ ] Convert `og-image.svg` to PNG (1200×630)
- [ ] Test on multiple browsers

### Deploy To
- **Netlify** — Drag & drop folder
- **Vercel** — Connect GitHub repo
- **GitHub Pages** — Push to gh-pages branch
- **Any static host** — Upload via FTP

No build step required!

## ⚡ Performance

### Current
- Load time: ~2-3 seconds
- CSS: ~3MB (Tailwind CDN)
- JS: ~15KB
- Total: ~3.5MB

### Optional Optimizations

Want to make it even faster? See **[PERFORMANCE-GUIDE.md](PERFORMANCE-GUIDE.md)** for:

1. **Replace Tailwind CDN** — Reduce CSS to ~10KB (90% reduction)
2. **Self-host fonts** — Faster initial render
3. **Image optimization** — If you add project screenshots
4. **Service worker** — Offline support

These are optional — the site works great as-is!

## 📝 License

Personal portfolio. Feel free to use as inspiration, but please don't copy directly.

## 📬 Contact

- **Email:** vansh.connectme@gmail.com
- **GitHub:** [github.com/VanshS-21](https://github.com/VanshS-21)
- **LinkedIn:** [linkedin.com/in/vanshsahu21](https://linkedin.com/in/vanshsahu21)

---

Built with care. No frameworks. Just code. ✨
