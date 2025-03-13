const subjectModal = document.getElementById('subjectModal');
const editProfileModal = document.getElementById('editProfileModal');
const modalTitle = document.getElementById('modalTitle');
const tasksList = document.getElementById('tasksList');

const assigmentData = {
    math: {
        title: 'Математика',
        tasks: [
            'Контрольная работа по алгебре - 20.05',
            'Домашнее задание №5 - 22.05',
            'Тест по геометрии - 25.05',
        ],
    },
    physics: {
        title: 'Физика',
        tasks: [
            'Лабораторная работа №3 - 21.05',
            'Проект "Механика" - 27.05',
            'Тест по электричеству - 30.05',
        ],
    },
    russian: {
        title: 'Русский язык',
        tasks: [
            'Сочинение - 19.05',
            'Диктант - 23.05',
            'Тест по пунктуации - 26.05',
        ],
    },
};

const editModeBtn = document.getElementById('editModeBtn');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const profileImage = document.getElementById('profileImage');
const studentName = document.getElementById('studentName');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const studentAge = document.getElementById('studentAge');
const studentAgeDisplay = document.getElementById('studentAgeDisplay');
const saveProfileBtn = document.getElementById('saveProfileBtn');
//
// window.addEventListener('load', function() {
//     const studentNameDisplay = document.getElementById('studentNameDisplay');
//     const studentAgeDisplay = document.getElementById('studentAgeDisplay');
//     const profileImage = document.getElementById('profileImage');
//
//     async function fetchUserData() {
//         await fetch('http://localhost:8080/profile', {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => {
//             //TODO почему не работает, а выдаёт 401 статус ? Хотя в postman работает
//             if (response.status === 401) {
//                 window.location.href = '../pages/login.html';
//                 return;
//             }
//             return response.json();
//         }).then(data => {
//             studentNameDisplay.textContent = data.firstname || 'Имя не указано';
//             // studentAgeDisplay.textContent = data.birthDate ? `${data.birthDate} лет` : 'Возраст не указан';
//             profileImage.src = data.profileImageUrl ? data.profileImageUrl : '../images/default-avatar.png';
//         }).catch(error => {
//             console.error(error);
//         });
//     }
//
//     fetchUserData();
// });

document.querySelectorAll('.subject').forEach(subject => {
    subject.addEventListener('click', () => {
        const subjectType = subject.dataset.subject;
        if (!subjectType || !assigmentData[subjectType]) return;

        const data = assigmentData[subjectType];

        modalTitle.textContent = data.title;
        tasksList.innerHTML = data.tasks
            .map(task => `<li>${task}</li>`)
            .join('');

        subjectModal.classList.remove('hidden');
    });
});

editModeBtn.addEventListener('click', () => {
    imagePreview.src = profileImage.src || '../images/default-avatar.png';
    studentName.value = studentNameDisplay.textContent.trim();
    studentAge.value = studentAgeDisplay.textContent.trim();
    editProfileModal.classList.remove('hidden');
});

//TODO переделать сохранение изображения (в localStorage ограничение 5MB)

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result; // base64
        };
        reader.readAsDataURL(file);
    }
});

//TODO доделать
saveProfileBtn.addEventListener('click', () => {
    profileImage.src = imagePreview.src;
    studentNameDisplay.textContent = studentName.value.trim();
    studentAgeDisplay.textContent = studentAge.value.trim();

    const user = {
        firstname: studentName.value.trim(),
        profileImageUrl: imagePreview.src,
    };

    async function updateUser(){
        await fetch('http://localhost:8080/profile/edit', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then(async response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Ошибка регистрации');
                });
            }
            return response.json();
        }).then((userData) => {
            studentNameDisplay.textContent = userData.firstname;
            profileImage.src = userData.profileImageUrl ? userData.profileImageUrl : '../images/default-avatar.png';
        })
    }

    updateUser();

    editProfileModal.classList.add('hidden');
});

document.querySelectorAll('.modal__close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target === subjectModal) {
        subjectModal.classList.add('hidden');
    }
    if (e.target === editProfileModal) {
        editProfileModal.classList.add('hidden');
    }
});
