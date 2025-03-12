const container = document.getElementById('container');
const registerBtn = document.getElementById('sign-up');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

    const userData = {
        email: e.target.email.value,
        password: e.target.password.value,
    }

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Ошибка входа');
                });
            }
            return response.json();
        })
        .then(data => {
            const accessToken = data.access_token;

            if (accessToken) {
                iziToast.success({
                    message: 'Вы успешно вошли!',
                    position: 'bottomRight',
                });
                localStorage.setItem('authToken', data.access_token);
                setTimeout(() => {
                    window.location.href = "/profile";
                }, 800);
            } else {
                iziToast.error({
                    message: 'Пользователь не найден',
                    position: 'bottomRight',
                });
            }
        })
        .catch(error => {
            iziToast.error({
                message: 'Что-то пошло не так, попробуйте позже.',
                position: 'bottomRight',
            });
            console.error('Error login user:', error);
        })
        .finally(() => {
            overlay.style.display = 'none';
        });
});
