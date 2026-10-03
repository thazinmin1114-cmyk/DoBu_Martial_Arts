document.addEventListener('DOMContentLoaded', function()
{
    const signupForm = document.getElementById('signupForm');
    const errorDiv = document.getElementById('signupError');

    if (signupForm)
    {
        signupForm.addEventListener('submit', function(e)
        {
            e.preventDefault();

            // Clear previous error
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const membershipPlan = document.getElementById('membershipPlan').value;
            const terms = document.getElementById('terms').checked;

            // Validation
            if (!firstName)
            {
                showError('Please enter your first name.');
                return;
            }

            if (!lastName)
            {
                showError('Please enter your last name.');
                return;
            }

            if (!email)
            {
                showError('Please enter your email address.');
                return;
            }

            if (!email.includes('@'))
            {
                showError('Please include "@" in the email address. "' + email + '" is missing an "@".');
                return;
            }

            if (!password)
            {
                showError('Please enter a password.');
                return;
            }

            if (password.length < 6)
            {
                showError('Password must be at least 6 characters long.');
                return;
            }

            if (!confirmPassword)
            {
                showError('Please confirm your password.');
                return;
            }

            if (password !== confirmPassword)
            {
                showError('Passwords do not match. Please try again.');
                return;
            }

            if (!membershipPlan)
            {
                showError('Please select a membership plan.');
                return;
            }

            if (!terms)
            {
                showError('Please agree to the Terms and Conditions and Privacy Policy.');
                return;
            }

            // Store account in localStorage 
            // Data persists across page navigation but is lost on browser refresh
            const newUser =
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                membershipPlan: membershipPlan,
                createdAt: new Date().toISOString()
            };

            // Get existing users from localStorage
            let registeredUsers = [];
            try
            {
                const stored = localStorage.getItem('dobu_registered_users');
                if (stored)
                {
                    registeredUsers = JSON.parse(stored);
                }
            } catch (e)
            {
                registeredUsers = [];
            }

            // Check if email already registered
            const existingUser = registeredUsers.find(function(u)
            {
                return u.email === email;
            });

            if (existingUser)
            {
                showError('An account with this email already exists. Please use a different email or login.');
                return;
            }

            registeredUsers.push(newUser);
            localStorage.setItem('dobu_registered_users', JSON.stringify(registeredUsers));

            // Show success message and redirect to login
            alert('Account created successfully! You can now login with your credentials.');
            window.location.href = 'login.html';
        });
    }

    function showError(message)
    {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
