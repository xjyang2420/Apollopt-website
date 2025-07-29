// function toggleFooterNav() {
//     const nav = document.getElementById('footer-nav');
//     nav.classList.toggle('active');
// }

function toggleFooterMenu() {
    const menu = document.getElementById('footerSideMenu');
    const overlay = document.getElementById('footerOverlay');
    menu.classList.add('open');
    overlay.classList.add('show');
    // document.body.style.overflow = 'hidden'; 
}

function closeFooterMenu() {
    const menu = document.getElementById('footerSideMenu');
    const overlay = document.getElementById('footerOverlay');
    menu.classList.remove('open');
    overlay.classList.remove('show');
    // document.body.style.overflow = 'hidden'; 
}

function toggleSubMenu(el) {
    const submenu = el.nextElementSibling;
    const isOpen = submenu.classList.contains('open');

    // Close all submenus
    document.querySelectorAll('.footer-submenu').forEach(s => s.classList.remove('open'));
    document.querySelectorAll('.footer-menu-item').forEach(m => m.classList.remove('active'));

    if (!isOpen) {
        submenu.classList.add('open');
        el.classList.add('active');
    }
}