const tutors = [
    {
        id: 1,
        name: 'Анна Петрова',
        subject: 'Математика',
        description: 'Опытный преподаватель',
        price: 900,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 2,
        name: 'Алина Беренцева',
        subject: 'Физика',
        description: 'Кандидат физико-математических наук. Индивидуальный подход к каждому ученику.',
        price: 2100,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 3,
        name: 'Елена Смирнова',
        subject: 'Английский язык',
        description: 'Сертифицированный преподаватель IELTS и TOEFL. Разговорный английский.',
        price: 1800,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 4,
        name: 'Михаил Козлов',
        subject: 'Химия',
        description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
        price: 1700,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    }
];

function createTutorCard(tutor) {
    return `
        <div class="tutors-section__tutor-card">
            <img src="${tutor.image}" alt="${tutor.name}" class="tutor-card__image">
           
                <h2 class="tutor-card__name">${tutor.name}</h2>
                <div class="tutor-card__subject">${tutor.subject}</div>
                <div class="tutor-card__rating">
                    ${'★'.repeat(Math.floor(tutor.rating))}${tutor.rating % 1 ? '½' : ''}
                    ${' '}${tutor.rating}
                </div>
                <p class="tutor-card__description">${tutor.description}</p>
                <p class="tutor-card__price">${tutor.price} ₽/час</p>
                <a href="#" class="tutor-card__contact-button">Связаться</a>
           
        </div>
    `;
}

function textVisible(text, wordLimit = 7) {
    const textWords = text.split(' ');
    const isLongText = textWords.length > wordLimit;

    return isLongText ? textWords.slice(0, wordLimit).join(' ') + '...' : text;
}

function renderTutors(filteredTutors = tutors) {
    const tutorsGrid = document.getElementById('tutorsGrid');
    tutorsGrid.innerHTML = filteredTutors.map(createTutorCard).join('');
}

function filterTutors() {
    const subjectFilter = document.getElementById('subjectFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filtered = tutors.filter(tutor => {
        const matchesSubject = !subjectFilter || tutor.subject.toLowerCase() === subjectFilter.toLowerCase();
        const matchesSearch = tutor.name.toLowerCase().includes(searchQuery) ||
            tutor.subject.toLowerCase().includes(searchQuery) ||
            tutor.description.toLowerCase().includes(searchQuery);
        let matchesPrice = true;

        if (priceFilter) {
            switch(priceFilter) {
                case 'low':
                    matchesPrice = tutor.price <= 1000;
                    break;
                case 'medium':
                    matchesPrice = tutor.price > 1000 && tutor.price <= 2000;
                    break;
                case 'high':
                    matchesPrice = tutor.price > 2000;
                    break;
            }
        }

        return matchesSubject && matchesPrice && matchesSearch;
    });

    renderTutors(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterTutors);
document.getElementById('subjectFilter').addEventListener('change', filterTutors);
document.getElementById('priceFilter').addEventListener('change', filterTutors);

renderTutors();