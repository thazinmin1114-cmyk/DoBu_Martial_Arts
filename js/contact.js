document.addEventListener('DOMContentLoaded', function()
{
    const contactForm = document.getElementById('contactForm');

    if (contactForm)
    {
        contactForm.addEventListener('submit', function(e)
        {
            e.preventDefault();

            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!fullName)
            {
                alert('Please enter your full name.');
                document.getElementById('fullName').focus();
                return;
            }

            if (!email)
            {
                alert('Please enter your email address.');
                document.getElementById('email').focus();
                return;
            }

            if (!email.includes('@'))
            {
                alert('Please include "@" in the email address. "' + email + '" is missing an "@".');
                document.getElementById('email').focus();
                return;
            }

            if (!subject)
            {
                alert('Please enter a subject.');
                document.getElementById('subject').focus();
                return;
            }

            if (!message)
            {
                alert('Please enter your message.');
                document.getElementById('message').focus();
                return;
            }

            alert('Thank you for your message! We will get back to you as soon as possible.');

            contactForm.reset();
        });
    }
});
