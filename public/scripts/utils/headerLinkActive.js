document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.header__link');

    links.forEach(link => {
        if (link.getAttribute('href') === document.location.pathname) {
            link.classList.add('active');
        }
    });
});