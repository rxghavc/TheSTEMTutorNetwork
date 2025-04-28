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

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChars) {
            return 'Password must contain at least one special character';
        }
        return null;
    }

    const resetPasswordForm = document.querySelector('.reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Validate password
            const passwordError = validatePassword(data.newPassword);
            if (passwordError) {
                showToast(passwordError, 'invalid');
                return;
            }

            // Check if new password and confirm password match
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

                const result = await response.json();
                if (response.ok) {
                    showToast(result.message, 'success');
                    resetPasswordForm.reset(); // Clear the form fields
                    setTimeout(() => {
                        window.location.href = '/login-signup'; // Redirect to login page
                    }, 2000); // Wait for 2 seconds before redirecting
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Server error', 'error');
            }
        });
    }
});