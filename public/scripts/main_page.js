const teacherCards = document.querySelectorAll('.teacher-card');
const featuredCard = document.querySelector('.teacher-card.featured');
const smallCards = document.querySelectorAll('.teacher-card.small');
let currentIndex = 0;

function rotateTeachers() {
    const nextIndex = (currentIndex + 1) % smallCards.length;
    const currentSmallCard = smallCards[currentIndex];
    const nextSmallCard = smallCards[nextIndex];

    // Fade out current featured card
    featuredCard.classList.add('fade-out');

    setTimeout(() => {
        // Swap content between featured and next small card
        const featuredContent = featuredCard.innerHTML;
        featuredCard.innerHTML = nextSmallCard.innerHTML;
        nextSmallCard.innerHTML = featuredContent;

        // Reset animations
        featuredCard.classList.remove('fade-out');
        featuredCard.classList.add('fade-in');

        currentIndex = nextIndex;
    }, 500);
}

// Rotate teachers every 10 seconds
setInterval(rotateTeachers, 10000);