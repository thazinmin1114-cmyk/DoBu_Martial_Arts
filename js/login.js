document.addEventListener('DOMContentLoaded', function()
{
    const loginForm = document.getElementById('loginForm');

    // Autofill remembered email
    try
    {
        const rememberedEmail = localStorage.getItem('dobu_remembered_email');
        if (rememberedEmail)
        {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    } catch (e) { }
    const errorDiv = document.getElementById('loginError');

    if (loginForm)
    {
        loginForm.addEventListener('submit', function(e)
        {
            e.preventDefault();

            // Clear previous error
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';

            // Get form values
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Validation
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
                showError('Please enter your password.');
                return;
            }

            // Check if user exists in localStorage
            // Note: accounts are stored in localStorage from signup.js
            // Data persists across browser sessions and page navigation
            let userFound = false;
            let currentUser = null;

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

            if (registeredUsers.length > 0)
            {
                currentUser = registeredUsers.find(function(u)
                {
                    return u.email === email && u.password === password;
                });

                if (currentUser)
                {
                    userFound = true;
                }
            }

            // For demo purposes: if no users registered yet, accept any valid email/password
            // This allows testing the login flow without signing up first
            if (!userFound && registeredUsers.length === 0)
            {
                // Demo mode: accept any login
                userFound = true;
                currentUser =
                {
                    firstName: 'Demo',
                    lastName: 'User',
                    email: email,
                    membershipPlan: 'intermediate'
                };
            }

            if (userFound)
            {
                // Store current user in localStorage (persists across browser sessions)
                localStorage.setItem('dobu_current_user', JSON.stringify(currentUser));

                // Remember me: save email for autofill
                if (rememberMe)
                {
                    localStorage.setItem('dobu_remembered_email', email);
                } else
                {
                    localStorage.removeItem('dobu_remembered_email');
                }

                // Show success message
                alert('Login successful! Welcome back, ' + currentUser.firstName + '!');

                // Redirect to member dashboard
                window.location.href = 'dashboard.html';
            } else
            {
                showError('Error: Invalid email or password. Please try again.');
            }
        });
    }

    function showError(message)
    {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
