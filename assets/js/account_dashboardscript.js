document.addEventListener('DOMContentLoaded', function () {
    const tutoringForm = document.getElementById('tutoringForm');
    const emailField = document.getElementById('email');

    // Pre-fill the email field with the logged-in user's email
    fetch('/api/get-user-email')
        .then(response => response.json())
        .then(data => {
            emailField.value = data.email;
        })
        .catch(error => {
            console.error('Error fetching user email:', error);
        });

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

    // Ensure the toast notification container exists
    const toastBox = document.createElement('div');
    toastBox.id = 'toastBox';
    document.body.appendChild(toastBox);

    tutoringForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = {
            email: emailField.value,
            subject: document.getElementById('subject').value,
            level: document.getElementById('level').value,
            availability: document.getElementById('availability').value,
            additionalInfo: document.getElementById('additionalInfo').value
        };

        if (!formData.subject || !formData.level || !formData.availability) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/tutoring-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showToast('Your request has been submitted successfully!', 'success');
                tutoringForm.reset();
            } else {
                const result = await response.json();
                showToast(result.message || 'There was an error submitting your request.', 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('An unexpected error occurred. Please try again later.', 'error');
        }
    });
});