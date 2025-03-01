document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signUpForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const userData = {
            name: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';

        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                iziToast.success({
                    message: 'Вы успешно вошли!',
                    position: 'bottomRight'
                });
                console.log('User registered:', data);
                localStorage.setItem('userData', JSON.stringify(data));
                setTimeout(() => {
                    window.location.href = '../pages/profile.html';
                }, 800);
            })
            .catch(error => {
                iziToast.error({
                    message: 'Что-то пошло не так, попробуйте позже.',
                    position: 'bottomRight'
                });
                console.error('Error registering user:', error);
            })
            .finally(() => {
                overlay.style.display = 'none';
            });
    });
});
