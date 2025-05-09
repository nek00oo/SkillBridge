import { createHtmlElement } from './utils/index.js';

const subjectModal = document.getElementById('subjectModal');
const editProfileModal = document.getElementById('editProfileModal');
const modalTitle = document.getElementById('modalTitle');
const tasksList = document.getElementById('tasksList');
const editModeBtn = document.getElementById('editModeBtn');
const profileImage = document.getElementById('profileImage');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const studentSurnameDisplay = document.getElementById('studentSurnameDisplay');
const studentAge = document.getElementById('studentAge');
const studentAgeDisplay = document.getElementById('studentAgeDisplay');

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.task').forEach(subjectCard => {
        subjectCard.addEventListener('click', async () => {
            const category = subjectCard.querySelector('.subject__title').textContent;
            modalTitle.textContent = category;
            const response = await fetch(`/api/v1/assignments/tasks?category=${encodeURIComponent(category)}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const assignments = await response.json();

            tasksList.innerHTML = ''
            assignments.forEach(assignment => {
                const statusIcon = createHtmlElement('span', 'status-icon',
                    assignment.completed ? '✓' : '⌛'
                );
                const title = createHtmlElement('span', 'task-title', assignment.title)
                const date = createHtmlElement('span', 'task-date',
                    `До: ${new Date(assignment.dueDate).toLocaleDateString()}`)
                console.log(assignment.grade)
                const grade = createHtmlElement('div', 'task-grade', assignment.grade ? assignment.grade.toFixed(2).toString() : null);

                const contentWrapper = createHtmlElement('div', 'task-content', [title, date]);

                const li = createHtmlElement('li', ['task-item', assignment.completed ? 'completed' : null], [statusIcon, contentWrapper, grade]);

                tasksList.appendChild(li);
            });

            subjectModal.classList.remove('hidden');

        });
    });
});

editModeBtn.addEventListener('click', () => {
    imagePreview.src = profileImage.src || '../images/default-avatar.png';
    studentName.value = studentNameDisplay.textContent.trim();
    studentSurname.value = studentSurnameDisplay.textContent.trim();
    studentAge.value = studentAgeDisplay.textContent.trim();
    editProfileModal.classList.remove('hidden');
});

const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const studentName = document.getElementById('studentName');
const studentSurname = document.getElementById('studentSurname');

let uploadedImageUrl = null;


imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        fetch('/files/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Ошибка загрузки');
                    });
                }
                return response.json();
            })
            .then(data => {
                uploadedImageUrl = data.url;
                console.log('Файл загружен. URL:', uploadedImageUrl);
            })
            .catch(error => {
                console.error('Ошибка загрузки файла:', error);
            });
    }
});

saveProfileBtn.addEventListener('click', () => {
    const user = {
        firstname: studentName.value.trim(),
        lastname: studentSurname.value.trim(),
        profileImageUrl: uploadedImageUrl,
    };

    async function updateUser() {
        await fetch('/api/v1/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Ошибка обновления');
                    });
                }
                return response.json();
            })
            .then((userData) => {
                document.getElementById('studentNameDisplay').textContent = userData.firstname;
                document.getElementById('studentSurnameDisplay').textContent = userData.lastname;
                document.getElementById('profileImage').src =
                    userData.profileImageUrl || '../images/default-avatar.png';
            })
            .catch(error => {
                console.error('Ошибка обновления профиля:', error);
            });
    }

    updateUser();
    document.getElementById('editProfileModal').classList.add('hidden');
});

document.querySelectorAll('.modal__close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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
