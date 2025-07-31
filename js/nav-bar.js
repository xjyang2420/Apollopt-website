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
        menuOverlay?.classList.remove('active');
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

    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
            searchForm.classList.remove('fade-in');
            setTimeout(() => searchForm.classList.add('hidden'), 200);
            suggestions.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchForm.classList.remove('fade-in');
            setTimeout(() => searchForm.classList.add('hidden'), 200);
            suggestions.style.display = 'none';
        }
    });

    // document.addEventListener('click', () => {
    //     suggestions.style.display = 'none';
    //     selIdx = -1;
    //     langDropdown.classList.remove('visible');
    //     langToggle.setAttribute('aria-expanded', 'false');
    // });

    const keywords = [
        'Pulley', 'Taper Bush', 'Gearbox', 'Motor', 'Coupling', 'Bearing', 'Catalog', 'Support', 'Powertrain', 'Machinery',
        '皮带轮', '锥套', '齿轮箱', '电机', '联轴器', '轴承', '目录', '支持', '传动系统', '机械'
    ];

    let selIdx = -1;

    searchToggle.addEventListener('click', e => {
        e.stopPropagation();
        searchForm.classList.toggle('hidden');
        searchForm.classList.toggle('fade-in');
        if (!searchForm.classList.contains('hidden')) {
            searchInput.focus();
            renderHistorySuggestions();
        }
    });

    // 点击外部关闭
    document.addEventListener('click', e => {
        if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
            closeSearch();
        }
    });

    // ESC 关闭
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSearch();
    });

    function closeSearch() {
        searchForm.classList.add('hidden');
        searchForm.classList.remove('fade-in');
        suggestions.style.display = 'none';
        selIdx = -1;
    }

    // 关键词模糊匹配（带高亮）
    searchInput.addEventListener('input', () => {
        const v = searchInput.value.trim().toLowerCase();
        if (!v) {
            renderHistorySuggestions();
            return;
        }
        const list = keywords.filter(k => k.toLowerCase().includes(v));
        if (!list.length) {
            suggestions.style.display = 'none';
            return;
        }
        suggestions.innerHTML = list.map(k =>
            `<li>${k.replace(new RegExp(v, 'gi'), m => `<span class="highlight">${m}</span>`)}</li>`
        ).join('');
        suggestions.style.display = 'block';
        selIdx = -1;
        updateActive();
    });

    // 键盘导航 + 选择
    searchInput.addEventListener('keydown', e => {
        const items = [...suggestions.children];
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selIdx = (selIdx + 1) % items.length;
            updateActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selIdx = (selIdx - 1 + items.length) % items.length;
            updateActive();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selIdx >= 0 && items[selIdx]) {
                searchInput.value = items[selIdx].textContent;
            }
            saveHistory(searchInput.value.trim());
            suggestions.style.display = 'none';
            searchForm.submit();
        }
    });

    suggestions.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            searchInput.value = e.target.textContent;
            saveHistory(searchInput.value.trim());
            suggestions.style.display = 'none';
            searchForm.submit();
        }
    });

    function updateActive() {
        [...suggestions.children].forEach((li, i) =>
            li.classList.toggle('active', i === selIdx)
        );
    }

    // 本地历史缓存
    function saveHistory(term) {
        if (!term) return;
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history = [term, ...history.filter(h => h !== term)];
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    function renderHistorySuggestions() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (!history.length) {
            suggestions.style.display = 'none';
            return;
        }
        suggestions.innerHTML = history.map(h => `<li>${h}</li>`).join('');
        suggestions.style.display = 'block';
        selIdx = -1;
        updateActive();
    }

    function updateActive() {
        [...suggestions.children].forEach((li, i) => li.classList.toggle('active', i === selIdx));
    }

    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
            closeSearch();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    function closeSearch() {
        searchForm.classList.remove('fade-in');
        setTimeout(() => searchForm.classList.add('hidden'), 200);
        suggestions.style.display = 'none';
        selIdx = -1;
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

    // document.querySelectorAll('.lang-option').forEach(option => {
    //     option.addEventListener('click', () => {
    //         document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('selected'));
    //         option.classList.add('selected');

    //         const targetLang = option.getAttribute('data-lang'); // 'en' or 'zh'
    //         const proto = window.location.protocol;              // 'http:' | 'https:' | 'file:'
    //         let path = window.location.pathname;                 // 例如：/subpage/about_us/company.html

    //         // —— 统一把首页当成 index.html 处理
    //         if (path === '/' || path === '') path = '/index.html';

    //         const isZh = path.startsWith('/zh/');

    //         // 生成目标路径（仅路径，不含协议和域名）
    //         let nextPath;
    //         if (targetLang === 'zh') {
    //             if (isZh) return; // 已是中文
    //             // 英文 -> 中文：加 /zh 前缀
    //             nextPath = '/zh' + path;
    //         } else {
    //             if (!isZh) return; // 已是英文
    //             // 中文 -> 英文：去 /zh 前缀
    //             nextPath = path.replace(/^\/zh/, '');
    //             if (nextPath === '' || nextPath === '/') nextPath = '/index.html';
    //         }

    //         // —— 在 http/https 下，直接用绝对路径跳转
    //         if (proto === 'http:' || proto === 'https:') {
    //             window.location.href = nextPath;
    //             return;
    //         }

    //         // —— 在 file:// 下（本地直接打开），用“相对路径”跳转，避免绝对路径指向磁盘根
    //         // 规则：从当前页面的目录开始跳；若当前为中文页（/zh/...），去掉 /zh 后再相对跳
    //         if (proto === 'file:') {
    //             const currentDir = window.location.href.replace(/[^/]*$/, ''); // 当前文件所在目录（带结尾/）
    //             let relative;

    //             if (targetLang === 'zh') {
    //                 // 英 -> 中：在当前站点根目录下插入 zh/。由于 file 协议拿不到“站点根”，
    //                 // 这里的稳妥做法是：从当前目录退回到站点根再进入 zh，但我们不知道你的“站点根”。
    //                 // 因此推荐：在 file 模式下，使用相对于“项目根”的 BASE 标签，或者本地服务器。
    //                 // 这里给一个保守方案：从当前目录跳，尽量在路径前面补 ../ 直到能命中 zh/ 同名结构。
    //                 // —— 简化：直接替换为同层的 zh 目录（需要你的项目在本地也保持 /zh 的镜像结构）
    //                 relative = nextPath.replace(/^\//, ''); // 去掉最前面的斜杠，作为相对路径
    //             } else {
    //                 // 中 -> 英：去掉 zh 后，仍使用相对路径
    //                 relative = nextPath.replace(/^\//, '');
    //             }

    //             // 实际跳转
    //             window.location.href = relative;
    //             return;
    //         }

    //         // const langCode = option.getAttribute('data-lang');

    //         // const currentPath = window.location.pathname;

    //         // if (langCode === 'zh') {
    //         //     // 如果当前不是 zh 路径，就添加 /zh 前缀
    //         //     if (!currentPath.startsWith('/zh/')) {
    //         //         window.location.href = '/zh' + currentPath;
    //         //     }
    //         // } else if (langCode === 'en') {
    //         //     // 如果当前是 zh 页面，就移除 /zh 前缀
    //         //     if (currentPath.startsWith('/zh/')) {
    //         //         window.location.href = currentPath.replace('/zh', '');
    //         //     }
    //         // }
    //         // const isHomePage = currentPath === '/' || currentPath.endsWith('/index.html');

    //         // if (langCode === 'zh') {
    //         //     if (!currentPath.startsWith('/zh')) {
    //         //         if (isHomePage) {
    //         //             window.location.href = '/zh/index.html';
    //         //         } else {
    //         //             window.location.href = '/zh' + currentPath;
    //         //         }
    //         //     }
    //         // } else if (langCode === 'en') {
    //         //     if (currentPath.startsWith('/zh')) {
    //         //         const newPath = currentPath.replace(/^\/zh/, '');
    //         //         window.location.href = newPath === '' ? '/index.html' : newPath;
    //         //     }
    //         // }
    //     });
    // });

    // (function setupLangSwitch() {
    //     const options = document.querySelectorAll('.lang-option');
    //     if (!options.length) return;

    //     // 读取站点基路径（如 / 或 /project/）
    //     const baseEl = document.querySelector('base');
    //     const BASE = (baseEl ? baseEl.getAttribute('href') : '/') || '/';
    //     const baseNoTrail = BASE.replace(/\/+$/, ''); // 去掉尾部斜杠：/project

    //     // 把一个“绝对路径”（以 / 开头）转换成 “去掉 BASE 前缀的相对路径”
    //     function stripBase(absPath) {
    //         if (baseNoTrail && absPath.startsWith(baseNoTrail + '/')) {
    //             return absPath.slice(baseNoTrail.length); // 仍然以 / 开头
    //         }
    //         return absPath; // 本身就在根
    //     }

    //     // 输出一个“带 BASE 前缀”的绝对路径
    //     function addBase(relPath) {
    //         // relPath 以 / 开头
    //         return (baseNoTrail ? baseNoTrail : '') + relPath;
    //     }

    //     // 规范化：把 "/" 视为 "/index.html"
    //     function normalizeHome(p) {
    //         return (p === '/' || p === '') ? '/index.html' : p;
    //     }

    //     // 生成目标路径（带/开头，且已去掉 BASE 的相对根路径）
    //     function buildTargetPath(targetLang, currentAbsPath) {
    //         // currentAbsPath：以 / 开头的绝对路径（含 BASE 前缀）
    //         let rel = stripBase(currentAbsPath);       // 去掉 BASE 前缀
    //         rel = normalizeHome(rel);

    //         const isZh = rel.startsWith('/zh/');

    //         if (targetLang === 'zh') {
    //             if (isZh) return null; // 已是中文，不跳
    //             return '/zh' + rel;    // 英 -> 中：加 /zh
    //         } else {
    //             if (!isZh) return null; // 已是英文，不跳
    //             const enRel = rel.replace(/^\/zh/, ''); // 中 -> 英：去 /zh
    //             return enRel === '' ? '/index.html' : enRel;
    //         }
    //     }

    //     options.forEach(option => {
    //         option.addEventListener('click', (e) => {
    //             // 视觉状态
    //             options.forEach(o => o.classList.remove('selected'));
    //             option.classList.add('selected');

    //             // 目标语言
    //             const targetLang = option.getAttribute('data-lang'); // 'en' | 'zh'

    //             // 计算目标“去掉 BASE 的相对根路径”
    //             const targetRel = buildTargetPath(targetLang, window.location.pathname);
    //             if (!targetRel) return; // 已经是目标语言

    //             // 组合成最终绝对路径（带 BASE）
    //             const nextAbsPath = addBase(targetRel);

    //             // 调试（可留可删）
    //             // console.log('[lang-switch]', {
    //             //   base: BASE, current: window.location.pathname, targetRel, nextAbsPath
    //             // });

    //             // 在 http/https 下，直接跳
    //             if (location.protocol === 'http:' || location.protocol === 'https:') {
    //                 window.location.href = nextAbsPath;
    //                 return;
    //             }

    //             // 在 file:// 下强烈建议用本地服务器；如果仍要用 file 协议，尽量用相对路径：
    //             // 将带 BASE 的绝对路径转为相对当前的相对路径（去掉开头的 /）
    //             if (location.protocol === 'file:') {
    //                 const relative = nextAbsPath.replace(/^\//, ''); // 去掉前导 /
    //                 // 用当前 URL 的目录作为基准跳转
    //                 const currentDir = window.location.href.replace(/[^/]*$/, ''); // 当前文件所在目录
    //                 window.location.href = new URL(relative, currentDir).href;
    //             }
    //         });
    //     });
    // })();

    // 语言切换（自动适配 GitHub Pages 项目路径）
    (function setupLangSwitch() {
        const options = document.querySelectorAll('.lang-option');
        const toggleBtn = document.getElementById('lang-toggle');
        if (!options.length || !toggleBtn) return;

        const currentLang = location.pathname.includes('/zh/') ? 'zh' : 'en';

        function updateToggleDisplay(lang) {
            const selected = document.querySelector(`.lang-option[data-lang="${lang}"]`);
            if (selected) {
                toggleBtn.innerHTML = selected.innerHTML;
            }
        }

        function highlightSelected(lang) {
            options.forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.lang === lang);
            });
        }

        // 计算仓库基路径，如：/ApolloPT-website/
        function getBasePath() {
            const segs = location.pathname.split('/').filter(Boolean); // e.g. ['ApolloPT-website', ...]
            const repo = segs[0] || ''; // 仓库名
            return '/' + (repo ? repo + '/' : ''); // '/ApolloPT-website/' 或 '/'
        }

        const BASE = getBasePath(); // '/ApolloPT-website/'（你当前的情况）
        const baseNoTrail = BASE.replace(/\/+$/, ''); // '/ApolloPT-website'

        // 取“去掉 BASE 后”的路径段数组
        function getRelSegments() {
            const segs = location.pathname.split('/').filter(Boolean);
            // 去掉仓库段
            return segs.slice(baseNoTrail ? 1 : 0);
        }

        // 把 '/' 视为 'index.html'
        function normalizeHome(segs) {
            return segs.length === 0 ? ['index.html'] : segs;
        }

        function buildTargetPath(targetLang) {
            let rel = normalizeHome(getRelSegments()); // 如 ['subpage','about_us','company.html'] 或 ['zh',...]
            const isZh = rel[0] === 'zh';

            if (targetLang === 'zh') {
                if (isZh) return null;            // 已是中文
                rel = ['zh', ...rel];             // 英 -> 中：加 zh 前缀
            } else { // 'en'
                if (!isZh) return null;           // 已是英文
                rel = rel.slice(1);               // 中 -> 英：去 zh
                if (rel.length === 0) rel = ['index.html']; // /zh -> /index.html
            }

            // 最终绝对路径：BASE + 相对段
            return BASE + rel.join('/');
        }

        options.forEach(option => {
            option.addEventListener('click', () => {
                const targetLang = option.getAttribute('data-lang'); // 'en' or 'zh'
                const next = buildTargetPath(targetLang);
                if (!next) return;                // 已在目标语言，忽略
                location.href = next;             // 例如：/ApolloPT-website/zh/index.html
            });

            const suffix = location.search + location.hash;
            location.href = next + suffix;
            window.scrollTo(0, 0);
        });

        updateToggleDisplay(currentLang);
        highlightSelected(currentLang)
    })();

    document.querySelectorAll('.lang-option').forEach(li => {
        li.classList.toggle('selected', li.dataset.lang === currentLang);
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
    backToTop.setAttribute('aria-label', 'Back to top');
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
    function updateBackToTop() {
        if (window.scrollY > 300) {
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
    }

    window.addEventListener('load', updateBackToTop);
    window.addEventListener('scroll', updateBackToTop);

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

