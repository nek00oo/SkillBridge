document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.main-header__mobile-toggle');
    const nav = document.querySelector('.main-header__nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('open');
            mobileToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
    }

    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-header__nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPage.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentPage === '/' && linkPath === '/') {
            link.classList.add('active');
        }
    });
});