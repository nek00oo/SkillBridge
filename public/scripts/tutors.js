document.addEventListener('DOMContentLoaded', () => {
    const subjectFilter = document.getElementById('subjectFilter');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');
    if (selectedCategory) {
        subjectFilter.value = selectedCategory;
    }

    subjectFilter.addEventListener('change', () => {
        const category = subjectFilter.value;
        const newUrl = new URL(window.location);

        if (category) {
            newUrl.searchParams.set('category', category);
        } else {
            newUrl.searchParams.delete('category');
        }

        window.location.href = newUrl.toString();
    });
});