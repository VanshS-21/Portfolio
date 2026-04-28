document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.setAttribute('data-visible', 'true');
                entry.target.removeAttribute('data-hidden');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add data-hidden to sections and other elements we want to animate
    const animatedElements = document.querySelectorAll('section, .group, h1, h2, h3, p');
    animatedElements.forEach(el => {
        // Prevent animating elements inside the navbar or hero immediately
        if (!el.closest('nav') && el.tagName !== 'H1') {
            el.setAttribute('data-hidden', 'true');
            observer.observe(el);
        }
    });
    
    // Animate hero text explicitly
    const heroElements = document.querySelectorAll('section:first-of-type h1, section:first-of-type p');
    heroElements.forEach((el, idx) => {
        el.setAttribute('data-hidden', 'true');
        setTimeout(() => {
            el.setAttribute('data-visible', 'true');
            el.removeAttribute('data-hidden');
        }, 100 * (idx + 1));
    });

    // Form submission handling
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Message sent! I\'ll be in touch soon.';
            btn.classList.remove('bg-primary-container', 'hover:bg-[#f7b991]');
            btn.classList.add('bg-[#7FA88A]', 'text-[#141311]');
            
            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.classList.add('bg-primary-container', 'hover:bg-[#f7b991]');
                btn.classList.remove('bg-[#7FA88A]', 'text-[#141311]');
            }, 4000);
        });
    }
});
