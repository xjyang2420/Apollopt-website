
// document.addEventListener('DOMContentLoaded', () => {
//     const navButtons = document.querySelectorAll('.department-nav .dept-btn');

//     function activateButton(targetId) {
//         navButtons.forEach(btn => {
//             const id = btn.getAttribute('data-target');
//             btn.classList.toggle('active', id === targetId);
//         });
//     }

//     navButtons.forEach(button => {
//         button.addEventListener('click', e => {
//             e.preventDefault();
//             const targetId = button.getAttribute('data-target');
//             const targetEl = document.querySelector(targetId);
//             if (targetEl) {
//                 // 滚动 + 高亮 + 存储
//                 targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                 activateButton(targetId);
//                 localStorage.setItem('activeDepartment', targetId);
//                 // 更新 URL 的 hash
//                 history.replaceState(null, '', targetId);
//             }
//         });
//     });

//     // 页面加载：恢复位置
//     const savedTarget = localStorage.getItem('activeDepartment');
//     const fallbackTarget = navButtons[0]?.getAttribute('data-target') || '';
//     const targetToUse = savedTarget || fallbackTarget;
//     const targetEl = document.querySelector(targetToUse);

//     if (targetEl) {
//         // 延迟执行以避免布局尚未完成
//         setTimeout(() => {
//             targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
//             activateButton(targetToUse);
//         }, 100);
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const sectionsPerPage = 2;
    const blocks = Array.from(document.querySelectorAll('.content-block'));
    const navButtons = document.querySelectorAll('.dept-btn');
    const pagination = document.querySelector('.pagination');
    const totalPages = Math.ceil(blocks.length / sectionsPerPage);

    function getPageOfBlock(blockId) {
        const index = blocks.findIndex(b => `#${b.id}` === blockId);
        return index >= 0 ? Math.floor(index / sectionsPerPage) + 1 : 1;
    }

    function showPage(pageNum) {
        blocks.forEach((block, index) => {
            const visible = index >= (pageNum - 1) * sectionsPerPage && index < pageNum * sectionsPerPage;
            block.style.display = visible ? 'block' : 'none';
        });

        // 更新页码按钮高亮
        const pageLinks = pagination.querySelectorAll('.page');
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === String(pageNum)) {
                link.classList.add('active');
            }
        });

        // 保存当前页码
        localStorage.setItem('currentPage', pageNum);
    }

    function initPagination() {
        const savedPage = parseInt(localStorage.getItem('currentPage')) || 1;
        showPage(savedPage);

        pagination.querySelectorAll('.page').forEach(link => {
            const pageNum = link.dataset.page;
            if (pageNum) {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    showPage(Number(pageNum));
                });
            }
        });

        // 上一页
        const prevBtn = pagination.querySelector('.prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', e => {
                e.preventDefault();
                const current = parseInt(localStorage.getItem('currentPage')) || 1;
                if (current > 1) {
                    showPage(current - 1);
                }
            });
        }

        // 下一页
        const nextBtn = pagination.querySelector('.next');
        if (nextBtn) {
            nextBtn.addEventListener('click', e => {
                e.preventDefault();
                const current = parseInt(localStorage.getItem('currentPage')) || 1;
                if (current < totalPages) {
                    showPage(current + 1);
                }
            });
        }
    }

    initPagination();

    function scrollToTarget(targetId) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function activateButton(targetId) {
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === targetId);
        });

        localStorage.setItem('activeTarget', targetId);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const targetId = button.dataset.target;
            const pageNum = getPageOfBlock(targetId);
            showPage(pageNum);
            scrollToTarget(targetId);
            activateButton(targetId);
            // localStorage.setItem('activeTarget', targetId);
        });
    });

    // 页面加载初始化
    const savedTarget = localStorage.getItem('activeTarget') || navButtons[0]?.dataset.target;
    const savedPage = getPageOfBlock(savedTarget);
    showPage(savedPage);
    activateButton(savedTarget);

    // 延迟跳转，确保 layout 渲染完毕
    setTimeout(() => {
        scrollToTarget(savedTarget);
    }, 100);

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // 部门块有一半进入视口就触发
    };

    const buttons = document.querySelectorAll('.dept-btn');
    const sections = document.querySelectorAll('.content-block');

    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             const id = entry.target.id;
    //             const currentActive = localStorage.getItem('activeTarget');
    //             buttons.forEach(btn => {
    //                 btn.classList.toggle('active', btn.dataset.target === `#${id}`);
    //             });

    //             if (currentActive !== `#${id}`) {
    //                 activateButton(`#${id}`);
    //             }
    //         }
    //     });
    // }, observerOptions);

    const observer = new IntersectionObserver((entries) => {
        const currentActive = localStorage.getItem('activeTarget');
        let mostVisibleId = null;
        let maxRatio = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                mostVisibleId = `#${entry.target.id}`;
                maxRatio = entry.intersectionRatio;
            }
        });

        if (mostVisibleId && mostVisibleId !== currentActive) {
            activateButton(mostVisibleId);
        }
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


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
