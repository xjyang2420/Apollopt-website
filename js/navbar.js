
document.addEventListener('DOMContentLoaded', () => {
    const header      = document.getElementById('header');
    const navbar      = document.querySelector('.navbar');
    const container   = document.querySelector('.nav-container');
    const navLeft     = document.querySelector('.nav-left');
    const navCenter   = document.getElementById('nav-menu'); // .nav-center
    const navRight    = document.querySelector('.nav-right');
    const navToggle   = document.getElementById('nav-toggle');
    const overlay     = document.getElementById('menu-overlay');

    // ====== 工具：同步变量，保证 subpage-hero 紧跟展开高度 ======
    const root = document.documentElement;
  const setVar = (k, v) => root.style.setProperty(k, v);
    function syncNavbarHeight() {
    if (!navbar) return;
    const h = navbar.offsetHeight || 0;
    setVar('--navbar-height', h + 'px');
  }

    // ====== 容量检测：装不下就进入紧凑模式（显示汉堡，隐藏主菜单） ======
    function updateNavCompactMode() {
    if (!header || !container || !navLeft || !navRight) return;
    // 左 + 右 + 安全间距，占据的总宽度
    const leftW  = navLeft.getBoundingClientRect().width;
    const rightW = navRight.getBoundingClientRect().width;
    const totalW = container.clientWidth;
    const safety = 32; // 预留的安全间距，避免抖动
    const need   = leftW + rightW + safety;

    const shouldCompact = totalW < need;
    header.classList.toggle('is-nav-compact', shouldCompact);

    // 若从紧凑 → 常规，顺带把展开的菜单关掉、遮罩关掉
    if (!shouldCompact) {
        navCenter.classList.remove('open');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    }
    // 同步高度
    syncNavbarHeight();
  }

  // ====== 汉堡点击：展开/收起菜单 + 遮罩 + 高度同步 ======
  navToggle?.addEventListener('click', (e) => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    const willExpand = !expanded;

    navToggle.setAttribute('aria-expanded', String(willExpand));
    navCenter.classList.toggle('open', willExpand);
    overlay.classList.toggle('active', willExpand);

    syncNavbarHeight(); // 展开后 navbar 变高，要同步
  });

  // 点击遮罩关闭
  overlay?.addEventListener('click', () => {
        navCenter.classList.remove('open');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    syncNavbarHeight();
  });

  // ====== 子菜单点击展开/收起（紧凑/移动模式生效） ======
  document.querySelectorAll('.has-submenu > .list').forEach(link => {
        link.addEventListener('click', function (e) {
            // 仅在紧凑模式或移动断点下用点击展开
            const isCompactUI = header.classList.contains('is-nav-compact') || window.matchMedia('(max-width: 992px)').matches;
            if (!isCompactUI) return;

            e.preventDefault();
            const parent = this.closest('.nav-item');
            parent.classList.toggle('open');
            syncNavbarHeight(); // 子菜单展开会进一步抬高 navbar
        });
  });

    // ====== 搜索（保持你原有逻辑，略微防抖） ======
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm   = document.querySelector('.search-form');
    const searchInput  = document.getElementById('search-input');
    const suggestions  = document.getElementById('suggestions-list');

  searchToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
    searchForm.classList.toggle('hidden');
    searchForm.classList.toggle('fade-in');
    if (!searchForm.classList.contains('hidden')) searchInput?.focus();
  });

    function closeSearch() {
    if (!searchForm) return;
    searchForm.classList.add('hidden');
    searchForm.classList.remove('fade-in');
    if (suggestions) suggestions.style.display = 'none';
    selIdx = -1;
  }

  document.addEventListener('click', () => {closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

    const keywords = ['Pulley', 'Taper Bush', 'gearbox', 'motor', 'coupling', 'bearing', 'catalog', 'support', 'powertrain', 'machinery'];
    let selIdx = -1;
  searchInput?.addEventListener('input', () => {
    const v = searchInput.value.trim().toLowerCase();
    if (!v || !suggestions) { if (suggestions) suggestions.style.display = 'none'; return; }
    const list = keywords.filter(k => k.toLowerCase().includes(v));
    if (!list.length) {suggestions.style.display = 'none'; return; }
    suggestions.innerHTML = list.map(k => `<li>${k.replace(new RegExp(v, 'gi'), m => `<span class="highlight">${m}</span>`)}</li>`).join('');
    suggestions.style.display = 'block'; selIdx = -1; updateActive();
  });

    function updateActive() {
    if (!suggestions) return;
    [...suggestions.children].forEach((li, i) => li.classList.toggle('active', i === selIdx));
  }

  suggestions?.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {searchInput.value = e.target.textContent; suggestions.style.display = 'none'; }
  });

  searchInput?.addEventListener('keydown', e => {
    if (!suggestions || suggestions.style.display !== 'block') return;
    const items = [...suggestions.children];
    if (e.key === 'ArrowDown') {e.preventDefault(); selIdx = (selIdx + 1) % items.length; updateActive(); }
    else if (e.key === 'ArrowUp') {e.preventDefault(); selIdx = (selIdx - 1 + items.length) % items.length; updateActive(); }
    else if (e.key === 'Enter')  { if (selIdx >= 0) {searchInput.value = items[selIdx].textContent; suggestions.style.display = 'none'; } }
  });

    // ====== 语言切换（沿用你的逻辑，避免重复绑定） ======
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');

  langToggle?.addEventListener('click', e => {
        e.stopPropagation();
    langDropdown?.classList.toggle('visible');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            langDropdown?.classList.remove('visible');
            const lang = opt.dataset.lang;
            window.location.href = lang === 'zh' ? '/zh/index.html' : '/en/index.html';
        });
  });

    // ====== 当前导航激活、高度同步、事件绑定 ======
    const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll('.nav-item a').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });

    // 返回顶部（保留）
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => backToTop.style.display = window.scrollY > 300 ? 'block' : 'none');

  // 滚动态样式（保留）
  window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 10);
    // 滚动时也同步一下高度（有时粘连/阴影会影响像素）
    syncNavbarHeight();
  });

    // ====== 初始 & 变化时都执行 ======
    function onResizeOrLoad() {
        updateNavCompactMode();
    syncNavbarHeight();
  }
    window.addEventListener('resize', onResizeOrLoad);
    window.addEventListener('load', onResizeOrLoad);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResizeOrLoad);
    onResizeOrLoad();
});

