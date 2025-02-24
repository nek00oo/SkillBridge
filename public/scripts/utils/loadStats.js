(function () {
    window.addEventListener('load', function () {
        const timing = window.performance.timing;
        const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;

        const statsText = `
            Время загрузки: ${domContentLoadedTime} мс
        `;

        const statsContainer = document.getElementById('loadStats');
        if (statsContainer) {
            statsContainer.innerHTML = statsText;
        }
    });
})();