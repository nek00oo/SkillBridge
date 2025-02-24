const subjectModal = document.getElementById('subjectModal');
const editProfileModal = document.getElementById('editProfileModal');
const modalTitle = document.getElementById('modalTitle');
const tasksList = document.getElementById('tasksList');

const subjectData = {
    math: {
        title: 'Математика',
        tasks: [
            'Контрольная работа по алгебре - 20.05',
            'Домашнее задание №5 - 22.05',
            'Тест по геометрии - 25.05'
        ]
    },
    physics: {
        title: 'Физика',
        tasks: [
            'Лабораторная работа №3 - 21.05',
            'Проект "Механика" - 27.05',
            'Тест по электричеству - 30.05'
        ]
    },
    russian: {
        title: 'Русский язык',
        tasks: [
            'Сочинение - 19.05',
            'Диктант - 23.05',
            'Тест по пунктуации - 26.05'
        ]
    }
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

window.addEventListener('load', function() {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        studentNameDisplay.textContent = userData.name;
        studentAgeDisplay.textContent = userData.age ? userData.age : '';
        profileImage.src = userData.image ? userData.image : '../../public/default-avatar.png';
    }

});

document.querySelectorAll('.subject').forEach(subject => {
    subject.addEventListener('click', () => {
        const subjectType = subject.dataset.subject;
        if (!subjectType || !subjectData[subjectType]) return;

        const data = subjectData[subjectType];

        modalTitle.textContent = data.title;
        tasksList.innerHTML = data.tasks
            .map(task => `<li>${task}</li>`)
            .join('');

        subjectModal.classList.remove('hidden');
    });
});

editModeBtn.addEventListener('click', () => {
    imagePreview.src = profileImage.src || '../../public/default-avatar.png';
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
            imagePreview.src = e.target.result; // Сохраняем base64
        };
        reader.readAsDataURL(file);
    }
});

saveProfileBtn.addEventListener('click', () => {
    profileImage.src = imagePreview.src;
    studentNameDisplay.textContent = studentName.value.trim();
    studentAgeDisplay.textContent = studentAge.value.trim();

    const user = {
        name: studentName.value.trim(),
        age: studentAge.value.trim(),
        image: imagePreview.src
    };

    localStorage.setItem('userData', JSON.stringify(user));

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
