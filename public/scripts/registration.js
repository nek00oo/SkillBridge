document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signUpForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const userData = {
            firstname: e.target.firstname.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value,
        };


        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        if (password !== confirmPassword) {
            iziToast.error({
                message: 'Пароли не совпадают!',
                position: 'bottomRight',
            });
            return;
        }

        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';


        fetch('http://localhost:8080/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Ошибка регистрации');
                    });
                }
                return response.json();
            })
            .then(data => {
                iziToast.success({
                    message: 'Вы успешно зарегистрировались!',
                    position: 'bottomRight',
                });

                console.log('User registered:', data);

                if (data.access_token) {
                    localStorage.setItem('authToken', data.access_token);
                }

                setTimeout(() => {
                    window.location.href = '/profile';
                }, 800);
            })
            .catch(error => {
                iziToast.error({
                    message: error.message || 'Что-то пошло не так, попробуйте позже.',
                    position: 'bottomRight',
                });
                console.error('Error registering user:', error);
            })
            .finally(() => {
                overlay.style.display = 'none';
            });
    });
});