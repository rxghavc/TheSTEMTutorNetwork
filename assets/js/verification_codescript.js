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

    const verifyCodeForm = document.querySelector('.verify-code-form');
    if (verifyCodeForm) {
        verifyCodeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/verify_code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json(); // Parse JSON response
                if (response.ok) {
                    showToast('Verification successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '/login-signup'; // Redirect to login page
                    }, 2000); // Wait for 2 seconds before redirecting
                } else {
                    showToast(result.message, 'error'); // Extract message from JSON response
                }
            } catch (error) {
                showToast('Server error', 'error');
            }
        });
    }

    async function resendCode() {
        try {
            const response = await fetch('/resend_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json(); // Parse JSON response
            if (response.ok) {
                showToast('Verification email resent', 'success');
            } else {
                showToast(result.message, 'error'); // Extract message from JSON response
            }
        } catch (error) {
            showToast('Server error', 'error');
        }
    }

    const resendCodeButton = document.querySelector('.resend-code-btn');
    if (resendCodeButton) {
        resendCodeButton.addEventListener('click', (e) => {
            e.preventDefault();
            resendCode();
        });
    }
});