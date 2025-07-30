document.addEventListener('DOMContentLoaded', () => {
    /* ====== HERO SLIDER ====== */
    const hero = document.getElementById('ad-hero');
    const slides = [...document.querySelectorAll('.ad-slide')];
    const adSlider = document.querySelector('.ad-slider');
    const navbar = document.querySelector('.navbar');
    const topbar = document.querySelector('.top-bar');
    const pagination = document.querySelector('.ad-hero-pagination');
    const btnPrev = document.querySelector('.hero-prev');
    const btnNext = document.querySelector('.hero-next');
    const spacer = document.getElementById('header-spacer');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navToggle = document.querySelector('.nav-toggle');

    // function applyTopbarHeight() {
    //     const h = topbar ? topbar.offsetHeight : 0;
    //     document.documentElement.style.setProperty('--topbar-height', h + 'px');
    //     // if (navbar) navbar.style.top = h + 'px';
    //     // if (spacer) spacer.style.height = h + 'px';
    //     // if (adSlider) adSlider.style.marginTop = h + 'px';
    // }
    // applyTopbarHeight();
    // const roTop = new ResizeObserver(applyTopbarHeight);
    // if (topbar) roTop.observe(topbar);
    // window.addEventListener('resize', applyTopbarHeight);


    let timer = null;
    const IMAGE_DURATION = 5000; // 图片停留 5s（可调）

    let current = slides.findIndex(s => s.classList.contains('is-active'));
    if (current === -1) current = 0, slides[0]?.classList.add('is-active');


    let bars = [];
    if (pagination) {
        pagination.innerHTML = '';
        slides.forEach((_, i) => {
            const bar = document.createElement('span');
            bar.className = 'bar' + (i === current ? ' active' : '');
            bar.dataset.index = i.toString();
            bar.addEventListener('click', () => go(i, true));
            pagination.appendChild(bar);
        });
        bars = [...pagination.querySelectorAll('.bar')];
    }

    function setNavbarForSlide(idx) {
        const type = slides[idx].dataset.type;
        if (type === 'video') {
            hero.classList.add('is-video-on');
            navbar.classList.add('transparent');
            mobileMenu.classList.add('video-mode');
            navToggle.classList.add('white-bars');
        } else {
            hero.classList.remove('is-video-on');
            navbar.classList.remove('transparent');
            mobileMenu.classList.remove('video-mode');
            navToggle.classList.remove('white-bars');
        }
    }

    function go(next, byUser = false) {
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
                try { v.currentTime = 0; v.play(); } catch (e) { }
                const onEnded = () => {
                    v.removeEventListener('ended', onEnded);
                    go((current + 1) % slides.length);
                };
                v.addEventListener('ended', onEnded);
            }
        } else {
            timer = setTimeout(() => go((current + 1) % slides.length), IMAGE_DURATION);
        }
    }

    btnPrev?.addEventListener('click', () => go((current - 1 + slides.length) % slides.length, true));
    btnNext?.addEventListener('click', () => go((current + 1) % slides.length, true));

    go(current);

    let heroHeight = hero ? hero.offsetHeight : 0;

    function updateHeroHeight() {
        heroHeight = hero ? hero.offsetHeight : 0;
    }
    updateHeroHeight();
    const roHero = new ResizeObserver(updateHeroHeight);
    if (hero) roHero.observe(hero);
    window.addEventListener('resize', updateHeroHeight);

    const STICKY_THRESHOLD = 500;

    // function setStuck(stuck) {
    //     if (stuck) {
    //         topbar?.classList.add('hidden');          
    //         navbar.classList.add('stuck', 'dark');    
    //         if (spacer) spacer.style.height = navbar.offsetHeight + 'px'; 
    //     } else {
    //         topbar?.classList.remove('hidden');
    //         navbar.classList.remove('stuck', 'dark');
    //         if (spacer) spacer.style.height = '0px';  
    //     }
    // }

    // function onScroll() {
    //     const y = window.scrollY || window.pageYOffset;
    //     setStuck(y > STICKY_THRESHOLD);
    // }
    // window.addEventListener('scroll', onScroll, { passive: true });
    // onScroll();
    const setVar = (k, v) => document.documentElement.style.setProperty(k, v);

    function syncHeights() {
        const topbarVisible = topbar && !topbar.classList.contains('hidden');
        const th = topbar ? topbar.offsetHeight : 0;
        setVar('--topbar-height', th + 'px');
    }

    function applyByScroll() {
        const y = window.scrollY || window.pageYOffset;
        const compact = y > STICKY_THRESHOLD;

        topbar?.classList.toggle('hidden', compact);
        navbar?.classList.toggle('compact', compact);
        navbar?.classList.toggle('dark', compact);
        document.documentElement.classList.toggle('is-compact', compact);

        if (compact) {
            navToggle.classList.add('white-bars');
            mobileMenu.classList.remove('video-mode');
        } else {
            
            const currentSlide = document.querySelector('.ad-slide.is-active');
            if (currentSlide?.dataset.type === 'video') {
                navToggle.classList.add('white-bars');
                mobileMenu.classList.add('video-mode');
            } else {
                navToggle.classList.remove('white-bars');
                mobileMenu.classList.remove('video-mode');
            }
        }

        syncHeights();
    }

    syncHeights();
    if (topbar) new ResizeObserver(syncHeights).observe(topbar);
    if (navbar) new ResizeObserver(syncHeights).observe(navbar);
    window.addEventListener('resize', syncHeights);

    window.addEventListener('scroll', applyByScroll, { passive: true });
    applyByScroll();

});