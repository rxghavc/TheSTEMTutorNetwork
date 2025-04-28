document.addEventListener('DOMContentLoaded', function () {
    function showToast(message, type) {
        const toastBox = document.getElementById('toastBox');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon;
        if (type === 'error') {
            icon = '<i class="fa-solid fa-circle-xmark"></i>';
        } else if (type === 'invalid') {
            icon = '<i class="fa-solid fa-circle-exclamation"></i>';
        } else {
            icon = '<i class="fas fa-info-circle"></i>';
        }

        toast.innerHTML = `${icon} ${message}`;
        toastBox.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(String(email).toLowerCase())) {
            return false;
        }

        const domain = email.split('@')[1];
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];

        if (!commonDomains.includes(domain)) {
            return false;
        }

        return true;
    }

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return false;
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
            return false;
        }
        return true;
    }

    const signupForm = document.querySelector('.flip-card__form[action="/signup"]');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            const email = data.email;
            const password = data.password;

            if (!validateEmail(email)) {
                showToast('Invalid email address', 'error');
                return;
            }

            if (!validatePassword(password)) {
                showToast('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character', 'error');
                return;
            }

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json(); // Parse JSON response
                if (response.ok) {
                    showToast('Signup successful', 'success');
                    setTimeout(() => {
                        window.location.href = '/verification-code'; // Redirect to verification code page
                    }, 2000); // Wait for 2 seconds before redirecting
                } else {
                    showToast(result.message, 'error'); // Extract message from JSON response
                }
            } catch (error) {
                showToast('Server error', 'error');
            }
        });
    }

    const loginForm = document.querySelector('.flip-card__form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json(); // Parse JSON response
                if (response.ok) {
                    showToast('Login successful', 'success');
                    setTimeout(() => {
                        window.location.href = '/account-dashboard'; // Redirect to account dashboard
                    }, 2000); // Wait for 2 seconds before redirecting
                } else {
                    showToast(result.message, 'error'); // Extract message from JSON response
                    document.querySelector('.flip-card__input[name="password"]').value = ''; // Clear password field
                }
            } catch (error) {
                showToast('Server error', 'error');
            }
        });
    }

    const resetPasswordForm = document.querySelector('.reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            if (data.newPassword !== data.confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            try {
                const response = await fetch('/reset_password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.text();
                if (response.ok) {
                    showToast(result, 'success');
                } else {
                    showToast(result, 'error');
                }
            } catch (error) {
                showToast('Server error', 'error');
            }
        });
    }
});