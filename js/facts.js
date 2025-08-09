(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            })
        }, { threshold: 0.15 });
        revealEls.forEach(el => io.observe(el));
    } else {
        // fallback
        revealEls.forEach(el => el.classList.add('is-in'));
    }

    // Count up numbers for facts
    const counters = Array.from(document.querySelectorAll('.fact-number[data-count]'));
    const format = (n) => {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return Math.round(n).toString();
    }
    const animateCount = (el) => {
        const target = Number(el.getAttribute('data-count')) || 0;
        if (!target) return;
        const dur = 1200; const start = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(target * eased);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const startCounters = () => counters.forEach(animateCount);

    // Run counters when facts section appears
    const facts = document.getElementById('facts');
    if (facts && 'IntersectionObserver' in window) {
        const io2 = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { startCounters(); io2.disconnect(); }
            })
        }, { threshold: 0.25 });
        io2.observe(facts);
    } else { startCounters(); }

    // Parallax drift for hero caption
    if (!prefersReduced) {
        const drift = document.querySelector('.parallax-drift');
        if (drift) {
            const onScroll = () => {
                const sc = window.scrollY || 0; // move subtly
                drift.style.transform = `translateY(${Math.min(30, sc * 0.06)}px)`;
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }
})();