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

document.addEventListener('DOMContentLoaded', () => {
    const tutorModal = document.getElementById('TutorModal');
    const tutorCards = document.querySelectorAll('.tutors-section__tutor-card');
    let currentTutorId = null;

    // Обработчик клика по карточке
    tutorCards.forEach(card => {
        card.addEventListener('click', async () => {
            currentTutorId = card.dataset.id;

            try {
                // Загрузка данных преподавателя
                const tutorResponse = await fetch(`/api/v1/tutors/${currentTutorId}`);
                if (!tutorResponse.ok) console.error('Ошибка загрузки данных преподавателя');
                const tutor = await tutorResponse.json();

                // Загрузка отзывов
                const reviewsResponse = await fetch(`/api/v1/reviews/cards/${currentTutorId}`);
                if (!reviewsResponse.ok) console.error('Ошибка загрузки отзывов');
                const reviews = await reviewsResponse.json();

                // Заполнение данных преподавателя
                document.getElementById('modalTitle').textContent = tutor.author.firstname;
                document.getElementById('tutorModalImage').src = tutor.imgUrl;
                document.getElementById('tutorRating').innerHTML = `★ ${tutor.rating}`;
                document.getElementById('tutorPrice').textContent = `${tutor.price} ₽/час`;
                document.getElementById('tutorDescription').textContent = tutor.content;

                // Заполнение предметов
                const subjectsContainer = document.getElementById('tutorSubjects');
                subjectsContainer.innerHTML = tutor.subjectCategories
                    .map(sc => `<span class="subject-tag">${sc.category}</span>`)
                    .join('');

                // Заполнение отзывов
                renderReviews(reviews);

                tutorModal.classList.remove('hidden');

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });
    });

    // Функция рендера отзывов
    function renderReviews(reviews) {
        const reviewsContainer = document.getElementById('reviewsList');

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews">Пока нет отзывов</p>';
            return;
        }

        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <span class="review-author">${review.student.firstname}</span>
                    <span class="review-rating">★ ${review.rating.toFixed(1)}</span>
                </div>
                <p class="review-text">${review.comment || 'Без комментария'}</p>
                <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        `).join('');
    }

    // Закрытие модалки
    tutorModal.addEventListener('click', (e) => {
        if (e.target === tutorModal) {
            tutorModal.classList.add('hidden');
        }
    });

    // Обработка формы отзыва
    document.getElementById('tutorReviewsForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const textarea = form.querySelector('.review-textarea');
        const ratingSelect = form.querySelector('.rating-stars');

        try {
            const response = await fetch('/api/v1/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cardId: Number(currentTutorId),
                    rating: Number(ratingSelect.value),
                    comment: textarea.value
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error.message || 'Ошибка отправки отзыва');
            }

            const newReview = await response.json();

            // Добавляем новый отзыв в список
            const reviewsContainer = document.getElementById('reviewsList');
            const noReviewsMsg = reviewsContainer.querySelector('.no-reviews');

            if (noReviewsMsg) {
                reviewsContainer.innerHTML = '';
            }

            reviewsContainer.insertAdjacentHTML('afterbegin', `
                <div class="review">
                    <div class="review-header">
                        <span class="review-author">Вы</span>
                        <span class="review-rating">★ ${newReview.rating.toFixed(1)}</span>
                    </div>
                    <p class="review-text">${newReview.comment || 'Без комментария'}</p>
                    <span class="review-date">Только что</span>
                </div>
            `);

            // Очищаем форму
            textarea.value = '';
            ratingSelect.value = '5';

            alert('Отзыв успешно добавлен!');

        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message);
        }
    });
});

