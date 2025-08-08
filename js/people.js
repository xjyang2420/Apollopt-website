
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.department-nav .dept-btn');

    function activateButton(targetId) {
        navButtons.forEach(btn => {
            const id = btn.getAttribute('data-target');
            btn.classList.toggle('active', id === targetId);
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const targetId = button.getAttribute('data-target');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                // 滚动 + 高亮 + 存储
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                activateButton(targetId);
                localStorage.setItem('activeDepartment', targetId);
                // 更新 URL 的 hash
                history.replaceState(null, '', targetId);
            }
        });
    });

    // 页面加载：恢复位置
    const savedTarget = localStorage.getItem('activeDepartment');
    const fallbackTarget = navButtons[0]?.getAttribute('data-target') || '';
    const targetToUse = savedTarget || fallbackTarget;
    const targetEl = document.querySelector(targetToUse);

    if (targetEl) {
        // 延迟执行以避免布局尚未完成
        setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
            activateButton(targetToUse);
        }, 100);
    }
});

