# Performance Optimization Guide

This guide covers optional performance improvements that require additional setup. Your portfolio works great as-is — these are enhancements, not fixes.

---

## 1. Replace Tailwind CDN (High Impact)

**Current:** Loading ~3MB on every page load  
**Target:** ~10KB purged CSS  
**Impact:** 90% size reduction, faster load times

### Steps

#### 1. Install Tailwind CLI

```bash
npm init -y
npm install -D tailwindcss
```

#### 2. Create `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-base":        "#0c0b10",
        "bg-raised":      "#100f15",
        "bg-surface":     "#16151c",
        "bg-elevated":    "#1d1b25",
        "accent":         "#6366f1",
        "accent-dim":     "#4f52d4",
        "accent-muted":   "rgba(99,102,241,0.12)",
        "accent-glow":    "rgba(99,102,241,0.25)",
        "text-primary":   "#eeedf5",
        "text-secondary": "rgba(238,237,245,0.55)",
        "text-tertiary":  "rgba(238,237,245,0.28)",
        "border-subtle":  "rgba(238,237,245,0.06)",
        "border-mid":     "rgba(238,237,245,0.11)",
        "green-tag":      "#6ee7b7",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body:    ["Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg:      "1rem",
        xl:      "2rem",
        full:    "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

#### 3. Create `input.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. Generate Purged CSS

```bash
npx tailwindcss -i ./input.css -o ./tailwind.css --minify
```

#### 5. Update `index.html`

Remove this:
```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    // ... config
  }
</script>
```

Add this:
```html
<link rel="stylesheet" href="tailwind.css"/>
```

#### 6. Add Build Script to `package.json`

```json
{
  "scripts": {
    "build:css": "tailwindcss -i ./input.css -o ./tailwind.css --minify",
    "watch:css": "tailwindcss -i ./input.css -o ./tailwind.css --watch"
  }
}
```

### Result

- **Before:** 3MB CSS loaded on every visit
- **After:** ~10KB CSS (90% reduction)
- **Load time:** Significantly faster, especially on mobile

---

## 2. Self-Host Primary Font (Medium Impact)

**Current:** Loading Inter from Google Fonts (render-blocking)  
**Target:** Self-hosted with preload  
**Impact:** Faster initial render, no FOUT

### Steps

#### 1. Download Inter Variable Font

Visit [rsms.me/inter](https://rsms.me/inter/) and download:
- `Inter-Variable.woff2` (variable font, best)
- Or `Inter-roman.var.woff2` (if you only need roman)

#### 2. Create Fonts Directory

```bash
mkdir fonts
# Move downloaded font to fonts/Inter-Variable.woff2
```

#### 3. Add Font Face Declaration

Add to `index.css` (at the top):

```css
/* Self-hosted Inter Variable Font */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

#### 4. Add Preload Link

Add to `<head>` in `index.html` (before other stylesheets):

```html
<!-- Preload critical font -->
<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
```

#### 5. Keep Google Fonts as Fallback

Keep the existing Google Fonts link, but move it to the end of `<head>`:

```html
<!-- Fallback fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=JetBrains+Mono:wght@300;400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

Note: Remove `Inter` from the Google Fonts URL since you're self-hosting it.

### Result

- **Before:** Font loads from Google Fonts (external request)
- **After:** Font loads from your server (faster, no external dependency)
- **Benefit:** Faster initial render, no flash of unstyled text

---

## 3. Optimize Images (Low Impact)

If you add project screenshots or images:

### Steps

#### 1. Use Modern Formats

- **WebP** for photos (smaller than JPEG)
- **SVG** for logos and icons (scalable)
- **PNG** only when transparency is needed

#### 2. Compress Images

Use tools like:
- [TinyPNG](https://tinypng.com/) — Online compression
- [Squoosh](https://squoosh.app/) — Google's image optimizer
- [ImageOptim](https://imageoptim.com/) — Mac app

#### 3. Use Responsive Images

```html
<picture>
  <source srcset="image-large.webp" media="(min-width: 1024px)" type="image/webp">
  <source srcset="image-medium.webp" media="(min-width: 640px)" type="image/webp">
  <img src="image-small.webp" alt="Description" loading="lazy">
</picture>
```

#### 4. Add Lazy Loading

```html
<img src="image.jpg" alt="Description" loading="lazy">
```

---

## 4. Add Service Worker (Advanced)

For offline support and caching:

### Create `sw.js`

```javascript
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/script.js',
  '/tailwind.css',
  '/fonts/Inter-Variable.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Register in `script.js`

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
```

---

## Performance Checklist

After implementing optimizations:

### Test Performance

1. **Lighthouse Audit**
   - Open DevTools (F12)
   - Go to Lighthouse tab
   - Run audit
   - Target: 90+ in all categories

2. **WebPageTest**
   - Visit [webpagetest.org](https://www.webpagetest.org/)
   - Test from multiple locations
   - Check load times and waterfall

3. **Real Device Testing**
   - Test on actual mobile device
   - Use slow 3G throttling
   - Verify load time < 3 seconds

### Expected Results

| Metric | Before | After |
|--------|--------|-------|
| CSS Size | 3MB | 10KB |
| Load Time | 2-3s | 0.5-1s |
| Lighthouse Performance | 70-80 | 90-95 |
| First Contentful Paint | 1.5s | 0.5s |

---

## Deployment Considerations

### If Using Netlify/Vercel

These platforms handle:
- ✅ Automatic HTTPS
- ✅ CDN distribution
- ✅ Gzip/Brotli compression
- ✅ Cache headers

No additional configuration needed!

### If Using Traditional Hosting

Add `.htaccess` for Apache:

```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

---

## Priority Order

If you only have time for one:

1. **Replace Tailwind CDN** — Biggest impact (90% size reduction)
2. **Self-host fonts** — Medium impact (faster initial render)
3. **Optimize images** — Low impact (only if you add images)
4. **Service worker** — Advanced (offline support)

---

## Need Help?

If you run into issues:

1. Check the [Tailwind CLI docs](https://tailwindcss.com/docs/installation)
2. Check the [Inter font docs](https://rsms.me/inter/)
3. Test in incognito mode (clears cache)
4. Check browser console for errors

---

## Remember

**Your portfolio works great as-is!** These optimizations are enhancements, not requirements. Deploy first, optimize later if needed.

The most important optimization is **shipping**. 🚀
