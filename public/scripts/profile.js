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
const studentSurname = document.getElementById('studentSurname');
const studentSurnameDisplay = document.getElementById('studentSurnameDisplay');
const studentAge = document.getElementById('studentAge');
const studentAgeDisplay = document.getElementById('studentAgeDisplay');
const saveProfileBtn = document.getElementById('saveProfileBtn');

document.addEventListener('DOMContentLoaded', () => {
    const eventSource = new EventSource('/assignments/sse', { withCredentials: true });

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'new') {
                iziToast.success({
                    title: `Новое задание ${data.assignment.title}`,
                    message: `Срок сдачи: ${new Date(data.assignment.dueDate).toLocaleDateString()}`,
                    position: 'bottomRight',
                    timeout: 5000,
                });
            }
        } catch (error) {
            console.error('Ошибка парсинга данных:', error);
        }
    };

    eventSource.onerror = (error) => {
        console.error('Ошибка SSE:', error);
    };
});


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
    const user = {
        firstname: studentName.value.trim(),
        lastname: studentSurname.value.trim(),
    };

    async function updateUser(){
        await fetch('api/v1/users/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        }).then(async response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Ошибка обновления');
                });
            }
            return response.json();
        }).then((userData) => {
            studentNameDisplay.textContent = userData.firstname;
            studentSurnameDisplay.textContent = userData.lastname;
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
