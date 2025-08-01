document.addEventListener('DOMContentLoaded', () => {
    /* ========== 元素缓存 ========== */
    const header = document.getElementById('header');
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const root = document.documentElement;

    /* ========== 兜底/创建遮罩（若页面中没有 #menu-overlay） ========== */
    const overlay = document.getElementById('menu-overlay') || (() => {
      const d = document.createElement('div');
      d.id = 'menu-overlay';
      document.body.appendChild(d);
      return d;
    })();

    /* ========== 工具函数 ========== */
    const setVar = (k, v) => root.style.setProperty(k, v);
    const isMobile = () => window.matchMedia('(max-width: 1278px)').matches;

    function syncNavbarHeight() {
      const h = navbar?.offsetHeight || 60;
      setVar('--navbar-height', h + 'px');
    }
    syncNavbarHeight();
    window.addEventListener('resize', syncNavbarHeight);

    /* ========== 移动菜单开关 ========== */
    function openMenu() {
      mobileMenu?.classList.add('active');
      overlay?.classList.add('active');
      header?.classList.add('menu-open');
      document.body.classList.add('no-scroll');
    }
    function closeMenu() {
      mobileMenu?.classList.remove('active');
      overlay?.classList.remove('active');
      header?.classList.remove('menu-open');
      document.body.classList.remove('no-scroll');
      mobileMenu?.querySelectorAll('.is-open').forEach(li => li.classList.remove('is-open'));
    }
    navToggle?.addEventListener('click', () => {
      if (!isMobile()) return;
      mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
      syncNavbarHeight();
    });
    overlay?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => (e.key === 'Escape') && closeMenu());

    // 点击移动端子菜单项后自动收起
    document.querySelectorAll('.mobile-submenu a').forEach(a => {
      a.addEventListener('click', () => { if (isMobile()) closeMenu(); });
    });

    /* ========== 搜索框 ========== */
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');   // <form action="search.html">
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions-list');

    function closeSearch() {
      if (!searchForm) return;
      searchForm.classList.add('hidden');
      searchForm.classList.remove('fade-in');
      if (suggestions) suggestions.style.display = 'none';
      selIdx = -1;
    }

    let selIdx = -1;
    const keywords = [
      'Pulley', 'Taper Bush', 'Gearbox', 'Motor', 'Coupling', 'Bearing', 'Catalog', 'Support', 'Powertrain', 'Machinery',
      '皮带轮', '锥套', '齿轮箱', '电机', '联轴器', '轴承', '目录', '支持', '传动系统', '机械'
    ];

    searchToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!searchForm) return;

      const showing = !searchForm.classList.contains('hidden');
      searchForm.classList.toggle('hidden');
      searchForm.classList.toggle('fade-in');

      if (!showing) {
        searchInput?.focus();
        // 小屏滚动到可见区域（可按需调整偏移）
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            const rect = searchForm.getBoundingClientRect();
            const offsetTop = window.scrollY + rect.top - 60;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }, 80);
        }
        renderHistorySuggestions();
      }
    });

    // 外点关闭 + ESC 关闭（只保留一份监听）
    document.addEventListener('click', (e) => {
      if (!searchForm) return;
      if (!searchForm.contains(e.target) && !searchToggle?.contains(e.target)) {
        closeSearch();
      }
    });
    document.addEventListener('keydown', (e) => (e.key === 'Escape') && closeSearch());

    // 输入联想 + 高亮
    function updateActive() {
      [...(suggestions?.children || [])].forEach((li, i) => li.classList.toggle('active', i === selIdx));
    }
    searchInput?.addEventListener('input', () => {
      const v = searchInput.value.trim().toLowerCase();
      if (!v) { renderHistorySuggestions(); return; }
      const list = keywords.filter(k => k.toLowerCase().includes(v));
      if (!list.length) { suggestions.style.display = 'none'; return; }
      suggestions.innerHTML = list.map(k =>
        `<li>${k.replace(new RegExp(v, 'gi'), m => `<span class="highlight">${m}</span>`)}</li>`
      ).join('');
      suggestions.style.display = 'block'; selIdx = -1; updateActive();
    });
    // 键盘导航 + Enter 提交
    searchInput?.addEventListener('keydown', (e) => {
      const items = [...(suggestions?.children || [])];
      if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = (selIdx + 1) % items.length; updateActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = (selIdx - 1 + items.length) % items.length; updateActive(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (selIdx >= 0 && items[selIdx]) searchInput.value = items[selIdx].textContent;
        saveHistory(searchInput.value.trim());
        suggestions.style.display = 'none';
        searchForm?.submit();
      }
    });
    suggestions?.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        searchInput.value = e.target.textContent;
        saveHistory(searchInput.value.trim());
        suggestions.style.display = 'none';
        searchForm?.submit();
      }
    });

    // 历史缓存
    function saveHistory(term) {
      if (!term) return;
      let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history = [term, ...history.filter(h => h !== term)];
      if (history.length > 10) history = history.slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    function renderHistorySuggestions() {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      if (!history.length) { suggestions.style.display = 'none'; return; }
      suggestions.innerHTML = history.map(h => `<li>${h}</li>`).join('');
      suggestions.style.display = 'block'; selIdx = -1; updateActive();
    }

    /* ========== 语言切换（GitHub Pages 兼容） ========== */
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    langToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown?.classList.toggle('visible');
    });
    document.addEventListener('click', (e) => {
      if (langDropdown?.classList.contains('visible')
        && !langDropdown.contains(e.target)
        && !langToggle?.contains(e.target)) {
        langDropdown.classList.remove('visible');
      }
    });
    document.addEventListener('keydown', (e) => (e.key === 'Escape') && langDropdown?.classList.remove('visible'));

    (function setupLangSwitch() {
      const options = document.querySelectorAll('.lang-option');
      if (!options.length) return;

      const currentLang = location.pathname.includes('/zh/') ? 'zh' : 'en';
      function updateToggleDisplay(lang) {
        const selected = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (selected && langToggle) langToggle.innerHTML = selected.innerHTML;
      }
      function highlightSelected(lang) {
        options.forEach(opt => opt.classList.toggle('selected', opt.dataset.lang === lang));
      }
      updateToggleDisplay(currentLang);
      highlightSelected(currentLang);

      function getBasePath() {
        const segs = location.pathname.split('/').filter(Boolean);
        const repo = segs[0] || '';               // e.g. 'ApolloPT-website'
        return '/' + (repo ? repo + '/' : '');    // '/ApolloPT-website/' or '/'
      }
      const BASE = getBasePath();
      const baseNoTrail = BASE.replace(/\/+$/, '');

      function getRelSegments() {
        const segs = location.pathname.split('/').filter(Boolean);
        return segs.slice(baseNoTrail ? 1 : 0);
      }
      function normalizeHome(segs) {
        return segs.length === 0 ? ['index.html'] : segs;
      }
      function buildTargetPath(targetLang) {
        let rel = normalizeHome(getRelSegments());
        const isZh = rel[0] === 'zh';
        if (targetLang === 'zh') {
          if (isZh) return null;
          rel = ['zh', ...rel];
        } else { // en
          if (!isZh) return null;
          rel = rel.slice(1);
          if (rel.length === 0) rel = ['index.html'];
        }
        return BASE + rel.join('/');
      }

      options.forEach(option => {
        option.addEventListener('click', () => {
          const targetLang = option.getAttribute('data-lang');
          const next = buildTargetPath(targetLang);
          if (!next) return;
          const suffix = location.search + location.hash;   // 保留 ?query 和 #hash
          location.href = next + suffix;
        });
      });
    })();

    /* ========== 返回顶部按钮 ========== */
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.textContent = 'TOP';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

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
          setTimeout(() => { backToTop.style.display = 'none'; }, 400);
        }
      }
    }
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop);
    window.addEventListener('load', updateBackToTop);

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========== 保留你的大屏悬停逻辑（不动） ========== */
    document.querySelectorAll('.has-submenu > .list').forEach(link => {
      link.addEventListener('click', function () {
        const parent = this.closest('.nav-item');
        parent?.classList.toggle('open');
        syncNavbarHeight();
      });
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

