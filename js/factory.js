// document.addEventListener('DOMContentLoaded', function () {
//     const dropdown = document.querySelector('.custom-dropdown');
//     const toggle = dropdown.querySelector('.dropdown-toggle');
//     const menu = dropdown.querySelector('.dropdown-menu');
//     const selected = dropdown.querySelector('.selected-option');

//     toggle.addEventListener('click', () => {
//         dropdown.classList.toggle('open');
//     });

//     // 点击选项：关闭菜单并跳转锚点
//     menu.querySelectorAll('li').forEach(item => {
//         item.addEventListener('click', () => {
//             const value = item.getAttribute('data-value');
//             selected.textContent = item.textContent;
//             dropdown.classList.remove('open');
//             if (value) location.href = value;
//         });
//     });

//     // 点击其他区域关闭菜单
//     document.addEventListener('click', (e) => {
//         if (!dropdown.contains(e.target)) {
//             dropdown.classList.remove('open');
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.custom-dropdown');
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const selected = dropdown.querySelector('.selected-option');
    const items = dropdown.querySelectorAll('.dropdown-menu li');

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdown.classList.toggle('open');
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            selected.textContent = item.textContent;
            dropdown.classList.remove('open');

            const target = item.getAttribute('data-value');
            if (target) {
                location.href = target;
            }
        });
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
    });
});