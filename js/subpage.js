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
