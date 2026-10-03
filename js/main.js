document.addEventListener('DOMContentLoaded', function()
{

    // mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav)
    {
        menuToggle.addEventListener('click', function()
        {
            mainNav.classList.toggle('active');
        });
    }

    // back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn)
    {
        window.addEventListener('scroll', function()
        {
            if (window.scrollY > 300)
            {
                backToTopBtn.classList.add('visible');
            } else
            {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function()
        {
            window.scrollTo(
            {
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // newsletter form validation
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(function(form)
    {
        form.addEventListener('submit', function(e)
        {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (email && email.indexOf('@') !== -1)
            {
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else
            {
                alert('Please include "@" in the email address. "' + email + '" is missing an "@".');
            }
        });
    });

    // site search functionality
    const searchBox = document.querySelector('.search-box');
    const searchInput = searchBox ? searchBox.querySelector('input') : null;
    const searchBtn = searchBox ? searchBox.querySelector('button') : null;

    if (searchBox && searchInput && searchBtn)
    {
        // Create results dropdown
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        searchBox.appendChild(resultsDiv);

        // Search index - all pages with titles, descriptions and keywords
        const searchIndex = [
            { title: 'Home', url: 'index.html', desc: 'DoBu Martial Arts gym - Jiu-jitsu, Karate, Judo, Muay Thai classes', keywords: 'home main welcome martial arts gym' },
            { title: 'About Us', url: 'about.html', desc: 'Our story, mission, instructors and world-class facilities', keywords: 'about story mission values instructors facilities gym sauna steam' },
            { title: 'Classes', url: 'classes.html', desc: 'Jiu-jitsu, Karate, Judo, Muay Thai, fitness training and self-defence courses', keywords: 'classes jiu-jitsu karate judo muay thai fitness self-defence training' },
            { title: 'Timetable', url: 'timetable.html', desc: 'Weekly class schedule for all martial arts and skill levels', keywords: 'timetable schedule weekly classes times days kids adults' },
            { title: 'Prices & Membership', url: 'pricing.html', desc: 'Membership plans, pricing, private tuition and specialist courses', keywords: 'prices pricing membership plans basic intermediate advanced elite junior cost fees' },
            { title: 'Member Dashboard', url: 'dashboard.html', desc: 'Manage your profile, book classes and view membership details', keywords: 'dashboard member account profile booking classes membership' },
            { title: 'Community Forum', url: 'forum.html', desc: 'Ask questions, share tips and connect with fellow martial artists', keywords: 'forum community discussion posts questions tips social' },
            { title: 'Contact Us', url: 'contact.html', desc: 'Get in touch - address, phone, email, opening hours and contact form', keywords: 'contact address phone email hours location map enquiry' },
            { title: 'Login', url: 'login.html', desc: 'Sign in to your member account', keywords: 'login sign in member account' },
            { title: 'Sign Up', url: 'signup.html', desc: 'Create your account and join DoBu Martial Arts', keywords: 'signup sign up register join account create' }
        ];

        function performSearch()
        {
            const query = searchInput.value.trim().toLowerCase();
            if (!query)
            {
                resultsDiv.classList.remove('visible');
                resultsDiv.innerHTML = '';
                return;
            }

            const queryWords = query.split(/\s+/);
            let results = [];

            for (let i = 0; i < searchIndex.length; i++)
            {
                const page = searchIndex[i];
                const searchText = (page.title + ' ' + page.desc + ' ' + page.keywords).toLowerCase();
                let score = 0;

                for (let w = 0; w < queryWords.length; w++)
                {
                    const word = queryWords[w];
                    if (page.title.toLowerCase().indexOf(word) !== -1) score += 3;
                    if (page.keywords.toLowerCase().indexOf(word) !== -1) score += 2;
                    if (searchText.indexOf(word) !== -1) score += 1;
                }

                if (score > 0)
                {
                    results.push({ page: page, score: score });
                }
            }

            results.sort(function(a, b) { return b.score - a.score; });

            if (results.length === 0)
            {
                resultsDiv.innerHTML = '<div class="search-no-results">No results found for "' + query + '"</div>';
            } else
            {
                let html = '';
                for (let r = 0; r < results.length; r++)
                {
                    const p = results[r].page;
                    html += '<a href="' + p.url + '">' +
                            '<span class="result-title">' + p.title + '</span>' +
                            '<span class="result-desc">' + p.desc + '</span>' +
                            '</a>';
                }
                resultsDiv.innerHTML = html;
            }
            resultsDiv.classList.add('visible');
        }

        // Button click
        searchBtn.addEventListener('click', function(e)
        {
            e.preventDefault();
            performSearch();
        });

        // Enter key
        searchInput.addEventListener('keydown', function(e)
        {
            if (e.key === 'Enter' || e.keyCode === 13)
            {
                e.preventDefault();
                performSearch();
            }
        });

        // Close results when clicking outside
        document.addEventListener('click', function(e)
        {
            if (!searchBox.contains(e.target))
            {
                resultsDiv.classList.remove('visible');
            }
        });
    }

    // social share buttons (classes page)
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(function(btn)
    {
        btn.addEventListener('click', function(e)
        {
            e.preventDefault();
            const label = this.getAttribute('aria-label') || '';
            const pageUrl = window.location.href;
            const pageTitle = document.title;
            let shareUrl = '';

            if (label.indexOf('Facebook') !== -1)
            {
                shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl);
            } else if (label.indexOf('X') !== -1 || label.indexOf('Twitter') !== -1)
            {
                shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(pageTitle);
            } else if (label.indexOf('LinkedIn') !== -1)
            {
                shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl);
            }

            if (shareUrl)
            {
                window.open(shareUrl, '_blank', 'width=600,height=500,scrollbars=yes');
            }
        });
    });

    // forgot password link (login page)
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink)
    {
        forgotPasswordLink.addEventListener('click', function(e)
        {
            e.preventDefault();
            alert('Password reset is an extended feature. In a full implementation, you would receive an email with a reset link. Please contact the gym admin at info@dobumartialarts.com for assistance.');
        });
    }

});
