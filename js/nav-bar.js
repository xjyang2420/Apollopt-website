document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const header = document.getElementById('header');
    const navbar = document.querySelector('.navbar');
    const subpageHero = document.querySelector('.subpage-hero');
    const navMenu = document.getElementById('nav-menu');

    const root = document.documentElement;
    const setVar = (k, v) => root.style.setProperty(k, v);
    function syncNavbarHeight() {
        const h = document.querySelector('.navbar')?.offsetHeight || 0;
        setVar('--navbar-height', h + 'px');
    }

    const isMobile = () => window.matchMedia('(max-width: 1278px)').matches;

    function openMenu() {
        mobileMenu?.classList.add('active');
        menuOverlay?.classList.add('active');
        header?.classList.add('menu-open');
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        mobileMenu?.classList.remove('active');
        menuOverlay?.classList.add('active');
        header?.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
        mobileMenu?.querySelectorAll('.is-open').forEach(li => li.classList.remove('is-open'));
    }

    navToggle?.addEventListener('click', () => {
        if (!isMobile()) return;
        const open = mobileMenu.classList.contains('active');
        open ? closeMenu() : openMenu();
        syncNavbarHeight();
    });

    menuOverlay?.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-submenu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1278) {
                closeMenu();
            }
        });
    });

    document.querySelectorAll('.has-submenu > .list').forEach(link => {
        link.addEventListener('click', function () {
            const parent = this.closest('.nav-item');
            parent.classList.toggle('open');
            syncNavbarHeight();
        });
    });

    // function toggleSubmenu(event, index) {
    //     // 仅在小屏下启用点击展开
    //     if (window.innerWidth > 1024) return;

    //     event.preventDefault();
    //     const submenu = document.querySelectorAll('.mobile-menu .mobile-submenu')[index];
    //     const arrow = event.currentTarget.querySelector('.arrow-icon');

    //     const isActive = submenu.classList.toggle('active');
    //     arrow.classList.toggle('rotate', isActive);
    // }

    // document.querySelectorAll('.mobile-menu .has-mobile-submenu > a').forEach((trigger) => {
    //     trigger.addEventListener('click', (e) => {
    //         if (!isMobile()) return;

    //         const li = trigger.closest('.has-mobile-submenu');
    //         const submenu = li.querySelector('.mobile-submenu');
    //         const isOpen = li.classList.contains('is-open');

    //         if (trigger.getAttribute('href') === '#' || trigger.getAttribute('href') === '') {
    //             e.preventDefault();
    //         }

    //         // 关闭其他子菜单（手风琴效果）
    //         li.parentElement?.querySelectorAll('.is-open').forEach(openLi => {
    //             if (openLi !== li) openLi.classList.remove('is-open');
    //         });

    //         li.classList.toggle('is-open', !isOpen);
    //     });
    // });

    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions-list');

    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        searchForm.classList.toggle('hidden');
        searchForm.classList.toggle('fade-in');
        if (!searchForm.classList.contains('hidden')) searchInput.focus();
    });

    document.addEventListener('click', () => closeSearch());
    document.addEventListener('keydown', e => e.key === 'Escape' && closeSearch());

    document.addEventListener('click', () => {
        searchForm.classList.add('hidden');
        searchForm.classList.remove('fade-in');
        suggestions.style.display = 'none';
        selIdx = -1;
        langDropdown.classList.remove('visible');
        langToggle.setAttribute('aria-expanded', 'false');
    });

    const keywords = ['Pulley', 'Taper Bush', 'gearbox', 'motor', 'coupling', 'bearing', 'catalog', 'support', 'powertrain', 'machinery'];
    let selIdx = -1;
    searchInput.addEventListener('input', () => {
        const v = searchInput.value.trim().toLowerCase();
        if (!v) { suggestions.style.display = 'none'; return }
        const list = keywords.filter(k => k.includes(v));
        if (!list.length) { suggestions.style.display = 'none'; return }
        suggestions.innerHTML = list.map(k => `<li>${k.replace(new RegExp(v, 'gi'), m => `<span class=\"highlight\">${m}</span>`)}</li>`).join('');
        suggestions.style.display = 'block'; selIdx = -1; updateActive();
    });
    suggestions.addEventListener('click', e => {
        if (e.target.tagName === 'LI') { searchInput.value = e.target.textContent; suggestions.style.display = 'none'; }
    });
    searchInput.addEventListener('keydown', e => {
        if (suggestions.style.display !== 'block') return;
        const items = [...suggestions.children];
        if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = (selIdx + 1) % items.length; updateActive(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = (selIdx - 1 + items.length) % items.length; updateActive(); }
        else if (e.key === 'Enter') { if (selIdx >= 0) { searchInput.value = items[selIdx].textContent; suggestions.style.display = 'none'; } }
    });
    function updateActive() {
        [...suggestions.children].forEach((li, i) => li.classList.toggle('active', i === selIdx));
    }

    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');

    langToggle.addEventListener('click', e => {
        e.stopPropagation();
        langDropdown.classList.toggle('visible');
    });

    // document.querySelectorAll('.lang-option').forEach(option => {
    //     option.addEventListener('click', () => {
    //         document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('selected'));
    //         option.classList.add('selected');
    //         const langCode = option.getAttribute('data-lang');
    //         if (langCode === 'zh') {
    //             window.location.href = '/zh/index.html';
    //         } else {
    //             window.location.href = '/en/index.html';
    //         }
    //     });
    // });
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            const langCode = option.getAttribute('data-lang');

            const currentPath = window.location.pathname;

            if (langCode === 'en') {
                // 如果当前是中文页（在 /zn/ 下），切换为去掉 /zn/
                if (currentPath.startsWith('/zn/')) {
                    const newPath = currentPath.replace('/zn', '');
                    window.location.href = newPath;
                } else {
                    // 当前已是en页，不跳转
                    return;
                }
            } else if (langCode === 'zn') {
                // 如果当前不是zn页，就加上 /zn/
                if (!currentPath.startsWith('/zn/')) {
                    window.location.href = '/zn' + currentPath;
                } else {
                    // 当前已是zn页，不跳转
                    return;
                }
            }
        });
    });

    // Highlight current page nav
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-item a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.textContent = 'TOP';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // window.addEventListener('scroll', () => {
    //     backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
    // });

    // // Shrink navbar on scroll
    // window.addEventListener('scroll', () => {
    //     navbar.classList.toggle('scrolled', window.scrollY > 10);
    // });

    // document.querySelectorAll('.top-bar, .navbar').forEach(el => {
    //     el.addEventListener('animationend', () => {
    //         el.style.transform = 'none';
    //     }, { once: true });
    // });
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            if (!backToTop.classList.contains('show')) {
                backToTop.classList.remove('hide');
                backToTop.classList.add('show');
                backToTop.style.display = 'flex';
            }
        } else {
            if (backToTop.classList.contains('show')) {
                backToTop.classList.remove('show');
                backToTop.classList.add('hide');
                setTimeout(() => {
                    backToTop.style.display = 'none';
                }, 400);
            }
        }
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    });

    document.querySelectorAll('.top-bar, .navbar').forEach(el => {
        el.addEventListener('animationend', () => {
            el.style.transform = 'none';
        }, { once: true });
    });

});


function toggleMobileSubmenu(event) {
    if (window.innerWidth > 1278) return;

    const trigger = event.currentTarget;
    const href = trigger.getAttribute('href');
    if (!href || href === '#') {
        event.preventDefault();
    }

    const li = trigger.closest('.has-mobile-submenu');
    if (!li) return;

    const isOpen = li.classList.contains('is-open');

    const siblings = li.parentElement.querySelectorAll('.has-mobile-submenu.is-open');
    siblings.forEach(s => {
        if (s !== li) s.classList.remove('is-open');
    });

    li.classList.toggle('is-open', !isOpen);
}

