// document.addEventListener('DOMContentLoaded', () => {
//     // 分类激活高亮
//     const here = location.pathname.split('/').pop();
//     document.querySelectorAll('.category-list a').forEach(a => {
//         if (a.getAttribute('href') === here) {
//             a.classList.add('active');
//         }
//     });

//     // 分页点击事件
//     document.querySelectorAll('.pagination .page').forEach(page => {
//         page.addEventListener('click', e => {
//             e.preventDefault();

//             const current = document.querySelector('.pagination .page.active');
//             const pages = [...document.querySelectorAll('.pagination .page')].filter(p =>
//                 !p.classList.contains('prev') && !p.classList.contains('next')
//             );

//             const currentIndex = pages.indexOf(current);

//             if (page.classList.contains('prev')) {
//                 if (currentIndex > 0) {
//                     pages[currentIndex].classList.remove('active');
//                     pages[currentIndex - 1].classList.add('active');
//                 }
//             } else if (page.classList.contains('next')) {
//                 if (currentIndex < pages.length - 1) {
//                     pages[currentIndex].classList.remove('active');
//                     pages[currentIndex + 1].classList.add('active');
//                 }
//             } else {
//                 current.classList.remove('active');
//                 page.classList.add('active');
//             }
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const sectionsPerPage = 2;
    const contentBlocks = Array.from(document.querySelectorAll('.content-block'));
    const paginationContainer = document.querySelector('.pagination');
    const dropdown = document.querySelector('.custom-dropdown');
    const dropdownMenu = dropdown?.querySelector('.dropdown-menu');
    const dropdownSelected = dropdown?.querySelector('.selected-option');
    const pages = Math.ceil(contentBlocks.length / sectionsPerPage);

    function showPage(pageNum) {
        const start = (pageNum - 1) * sectionsPerPage;
        const end = start + sectionsPerPage;

        contentBlocks.forEach((block, index) => {
            block.style.display = (index >= start && index < end) ? 'block' : 'none';
        });

        updatePagination(pageNum);
        updateJumpTo(pageNum);

        localStorage.setItem('currentPage', pageNum)

        const visibleBlock = document.querySelector('.content-block[style*="display: block"]');
        if (visibleBlock) {
            visibleBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updatePagination(currentPage) {
        paginationContainer.innerHTML = '';

        // Prev
        const prev = document.createElement('a');
        prev.href = '#';
        prev.className = 'page prev';
        prev.innerHTML = '&laquo;';
        prev.onclick = (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        };
        paginationContainer.appendChild(prev);

        // Page numbers
        for (let i = 1; i <= pages; i++) {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'page' + (i === currentPage ? ' active' : '');
            a.textContent = i;
            a.onclick = (e) => {
                e.preventDefault();
                showPage(i);
            };
            paginationContainer.appendChild(a);
        }

        // Next
        const next = document.createElement('a');
        next.href = '#';
        next.className = 'page next';
        next.innerHTML = '&raquo;';
        next.onclick = (e) => {
            e.preventDefault();
            if (currentPage < pages) {
                showPage(currentPage + 1);
            }
        };
        paginationContainer.appendChild(next);
    }

    function updateJumpTo(currentPage) {
        if (!dropdownMenu || !dropdownSelected) return;

        // 清空旧选项
        dropdownMenu.innerHTML = '';

        // 计算当前页的锚点项
        const start = (currentPage - 1) * sectionsPerPage;
        const end = Math.min(start + sectionsPerPage, contentBlocks.length);

        for (let i = start; i < end; i++) {
            const block = contentBlocks[i];
            const id = block.id;
            const title = block.querySelector('.section-title')?.textContent || `Section ${i + 1}`;

            const li = document.createElement('li');
            li.textContent = title;
            li.setAttribute('data-value', `#${id}`);
            dropdownMenu.appendChild(li);
        }

        // 默认显示第一项
        const firstOption = dropdownMenu.querySelector('li');
        dropdownSelected.textContent = firstOption ? firstOption.textContent : 'Jump To';
    }

    // 下拉菜单点击逻辑
    if (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        dropdownMenu.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            const target = li.getAttribute('data-value');
            dropdownSelected.textContent = li.textContent;
            dropdown.classList.remove('open');

            if (target) {
                const el = document.querySelector(target);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });
    }

    const savedPage = parseInt(localStorage.getItem('currentPage')) || 1;
    showPage(savedPage);

    const panel = document.querySelector('.panel');
    const toggleBtn = document.querySelector('.panel-header');

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target)) {
            panel.classList.remove('open');
        }
    });
});


