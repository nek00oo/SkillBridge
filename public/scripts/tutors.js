import { createHtmlElement } from './utils/index.js';

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

    tutorCards.forEach(card => {
        card.addEventListener('click', async () => {
            currentTutorId = card.dataset.id;

            try {
                const tutorResponse = await fetch(`/api/v1/tutors/${currentTutorId}`);
                if (!tutorResponse.ok) console.error('Ошибка загрузки данных преподавателя');
                const tutor = await tutorResponse.json();

                const reviewsResponse = await fetch(`/api/v1/reviews/cards/${currentTutorId}`);
                if (!reviewsResponse.ok) console.error('Ошибка загрузки отзывов');
                const reviews = await reviewsResponse.json();

                document.getElementById('modalTitle').textContent = tutor.author.firstname;
                document.getElementById('tutorModalImage').src = tutor.imgUrl;
                document.getElementById('tutorRating').innerHTML = `★ ${tutor.rating}`;
                document.getElementById('tutorPrice').textContent = `${tutor.price} ₽/час`;
                document.getElementById('tutorDescription').textContent = tutor.content;

                const subjectsContainer = document.getElementById('tutorSubjects');
                subjectsContainer.innerHTML = tutor.subjectCategories
                    .map(sc => `<span class="subject-tag">${sc.category}</span>`)
                    .join('');

                renderReviews(reviews);

                tutorModal.classList.remove('hidden');

            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });
    });

    function renderReviews(reviews) {
        const reviewsContainer = document.getElementById('reviewsList');

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews">Пока нет отзывов</p>';
            return;
        }

        reviewsContainer.innerHTML = ''
        reviews.forEach((review) => {
            const reviewAuthor = createHtmlElement('span', 'review-author', review.student.firstname)
            const reviewRating = createHtmlElement('span', 'review-rating', `★ ${review.rating.toFixed(1)}`)
            const reviewText = createHtmlElement('p', 'review-text', `${review.comment || 'Без комментария'}`)
            const reviewDate = createHtmlElement('span', 'review-date', `${new Date(review.createdAt).toLocaleDateString()}`)

            const reviewHeader = createHtmlElement('div', 'review-header', [reviewAuthor, reviewRating])
            const reviewModel = createHtmlElement('div', 'review', [reviewHeader, reviewText, reviewDate])

            reviewsContainer.appendChild(reviewModel)
        })

    }

    tutorModal.addEventListener('click', (e) => {
        if (e.target === tutorModal) {
            tutorModal.classList.add('hidden');
        }
    });

    document.getElementById('tutorReviewsForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const textarea = form.querySelector('.review__textarea');
        const ratingSelect = form.querySelector('.rating__stars');

        try {
            const response = await fetch('/api/v1/reviews', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
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

            textarea.value = '';
            ratingSelect.value = '5';

        } catch (error) {
            console.error('Ошибка:', error);
            alert(error.message);
        }
    });
});

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    });
});

