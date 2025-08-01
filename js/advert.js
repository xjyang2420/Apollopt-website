document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('ad-hero');
    const slides = hero ? [...document.querySelectorAll('.ad-slide')] : [];
    const navbar = document.querySelector('.navbar');
    const topbar = document.querySelector('.top-bar');
    const pagination = document.querySelector('.ad-hero-pagination');
    const btnPrev = document.querySelector('.hero-prev');
    const btnNext = document.querySelector('.hero-next');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const root = document.documentElement;

    const setVar = (k, v) => root.style.setProperty(k, v);
    function isVisible(el) {
        if (!el) return false;
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && !el.classList.contains('hidden');
    }

    function syncHeaderOffset() {
        const th = isVisible(topbar) ? (topbar.offsetHeight || 0) : 0;
        const nh = navbar ? (navbar.offsetHeight || 0) : 0;
        root.style.setProperty('--topbar-height', th + 'px');
        root.style.setProperty('--navbar-height', nh + 'px');
        root.style.setProperty('--header-offset', (th + nh) + 'px');
    }
    syncHeaderOffset();
    if (topbar) new ResizeObserver(syncHeaderOffset).observe(topbar);
    if (navbar) new ResizeObserver(syncHeaderOffset).observe(navbar);
    window.addEventListener('resize', syncHeaderOffset);

    let current = 0;
    let bars = [];
    let timer = null;
    const IMAGE_DURATION = 5000;

    // 检查 search-form 是否正在显示
    const isSearchOpen = () => {
        const f = document.querySelector('.search-form');
        return f && !f.classList.contains('hidden');
    };

    if (hero && slides.length) {
        current = slides.findIndex(s => s.classList.contains('is-active'));
        if (current === -1) current = 0, slides[0].classList.add('is-active');

        /* —— 创建小进度条 —— */
        if (pagination) {
            pagination.innerHTML = '';
            slides.forEach((_, i) => {
                const bar = document.createElement('span');
                bar.className = 'bar' + (i === current ? ' active' : '');
                bar.dataset.index = i;
                bar.addEventListener('click', () => go(i));
                pagination.appendChild(bar);
            });
            bars = [...pagination.children];
        }

        function setNavbarForSlide(idx) {
            const type = slides[idx].dataset.type;
            if (type === 'video') {
                hero.classList.add('is-video-on');
                navbar?.classList.add('transparent');
                mobileMenu?.classList.add('video-mode');
                navToggle?.classList.add('white-bars');
                if (!isSearchOpen()) {
                    setVar('--search-extra-offset', '0px');
                }
                // setVar('--search-extra-offset', '32px');
            } else {
                hero.classList.remove('is-video-on');
                navbar?.classList.remove('transparent');
                mobileMenu?.classList.remove('video-mode');
                navToggle?.classList.remove('white-bars'); 
                if (!isSearchOpen()) {
                    setVar('--search-extra-offset', '32px');
                }
                // setVar('--search-extra-offset', '0px');
            }

            requestAnimationFrame(syncHeaderOffset);
        }

        function go(next) {
            if (timer) clearTimeout(timer);
            const prev = current;
            slides[prev].classList.remove('is-active');
            slides[prev].setAttribute('aria-hidden', 'true');
            slides[next].classList.add('is-active');
            slides[next].setAttribute('aria-hidden', 'false');
            if (bars.length) {
                bars[prev].classList.remove('active');
                bars[next].classList.add('active');
            }
            current = next;
            setNavbarForSlide(current);

            const s = slides[current];
            if (s.dataset.type === 'video') {
                const v = s.querySelector('video');
                if (v) {
                    v.currentTime = 0;
                    v.play().catch(() => { });
                    const onEnded = () => { v.removeEventListener('ended', onEnded); go((current + 1) % slides.length); };
                    v.addEventListener('ended', onEnded);
                }
            } else {
                timer = setTimeout(() => go((current + 1) % slides.length), IMAGE_DURATION);
            }
        }
        btnPrev?.addEventListener('click', () => go((current - 1 + slides.length) % slides.length));
        btnNext?.addEventListener('click', () => go((current + 1) % slides.length));
        go(current);
    } else {
        if (!isSearchOpen()) {
            setVar('--search-extra-offset', '0px');
        }
        // setVar('--search-extra-offset', '32px');
    }

    const STICKY_THRESHOLD = 500;
    function applyByScroll() {
        const compact = (window.scrollY || window.pageYOffset) > STICKY_THRESHOLD;

        topbar?.classList.toggle('hidden', compact);
        navbar?.classList.toggle('compact', compact);
        navbar?.classList.toggle('dark', compact);
        document.documentElement.classList.toggle('is-compact', compact);

        if (compact) {
            navToggle?.classList.add('white-bars');
            mobileMenu?.classList.remove('video-mode');
            if (!isSearchOpen()) {
                setVar('--search-extra-offset', '32px');
            }
            // setVar('--search-extra-offset', '32px');
        } else if (!hero) {
            if (!isSearchOpen()) {
                setVar('--search-extra-offset', '0px');
            }
            // setVar('--search-extra-offset', '32px');
        } else {
            const type = slides[current]?.dataset.type || 'image';
            if (!isSearchOpen()) {
                setVar('--search-extra-offset', type === 'video' ? '0px' : '32px');
            }
            // setVar('--search-extra-offset', type === 'video' ? '0px' : '32px');
        }

        syncHeaderOffset();
    }
    window.addEventListener('scroll', applyByScroll, { passive: true });
    applyByScroll();
});

