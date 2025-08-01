
// document.addEventListener('DOMContentLoaded', () => {
//     if (document.getElementById('ad-hero')) return; // 有轮播页则不运行此文件

//     const topbar = document.querySelector('.top-bar');
//     const navbar = document.querySelector('.navbar');
//     const hero = document.querySelector('.page-hero'); // 若有子页横幅，可作为阈值参考
//     const root = document.documentElement;

//     const setVar = (k, v) => root.style.setProperty(k, v);

//     function isVisible(el) {
//         if (!el) return false;
//         const cs = getComputedStyle(el);
//         return cs.display !== 'none' && cs.visibility !== 'hidden' && !el.classList.contains('hidden');
//     }

//     function syncHeaderOffset() {
//         const th = isVisible(topbar) ? (topbar.offsetHeight || 0) : 0;
//         const nh = navbar ? (navbar.offsetHeight || 0) : 0;
//         setVar('--topbar-height', th + 'px');
//         setVar('--navbar-height', nh + 'px');
//         setVar('--header-offset', (th + nh) + 'px');
//     }
//     syncHeaderOffset();
//     if (topbar) new ResizeObserver(syncHeaderOffset).observe(topbar);
//     if (navbar) new ResizeObserver(syncHeaderOffset).observe(navbar);
//     window.addEventListener('resize', syncHeaderOffset);

//     const THRESHOLD = hero ? hero.offsetHeight : 200;
//     function applyByScroll() {
//         const y = window.scrollY || window.pageYOffset;
//         const compact = y > THRESHOLD;

//         topbar?.classList.toggle('hidden', compact);
//         navbar?.classList.toggle('compact', compact);
//         navbar?.classList.toggle('dark', compact);
//         root.classList.toggle('is-compact', compact);

//         // 内页固定使用图片样式的偏移：32px
//         setVar('--search-extra-offset', '32px');

//         syncHeaderOffset();
//     }

//     window.addEventListener('scroll', applyByScroll, { passive: true });
//     applyByScroll();
// });



document.addEventListener('DOMContentLoaded', () => {
    // —— 可选：面包屑/分类激活示例（按当前 URL 简单高亮）——
    const here = location.pathname.split('/').pop();
    document.querySelectorAll('.category-list a').forEach(a => {
        if (a.getAttribute('href') === here) { a.classList.add('active'); }
    });

    document.querySelectorAll('.pagination .page').forEach(page => {
        page.addEventListener('click', e => {
            e.preventDefault();

            const current = document.querySelector('.pagination .page.active');
            const pages = [...document.querySelectorAll('.pagination .page')].filter(p => !p.classList.contains('prev') && !p.classList.contains('next'));

            if (page.classList.contains('prev')) {
                const currentIndex = pages.indexOf(current);
                if (currentIndex > 0) {
                    pages[currentIndex].classList.remove('active');
                    pages[currentIndex - 1].classList.add('active');
                }
            } else if (page.classList.contains('next')) {
                const currentIndex = pages.indexOf(current);
                if (currentIndex < pages.length - 1) {
                    pages[currentIndex].classList.remove('active');
                    pages[currentIndex + 1].classList.add('active');
                }
            } else {
                current.classList.remove('active');
                page.classList.add('active');
            }
        });
    });

});
