document.addEventListener('DOMContentLoaded', function()
{
    // auth guard
    let isLoggedIn = false;
    try
    {
        const userCheck = localStorage.getItem('dobu_current_user');
        if (userCheck)
        {
            isLoggedIn = true;
        }
    } catch (e)
    {
        isLoggedIn = false;
    }
    if (!isLoggedIn)
    {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }


    // load user data
    let currentUser = null;
    try
    {
        const stored = localStorage.getItem('dobu_current_user');
        if (stored)
        {
            currentUser = JSON.parse(stored);
        }
    } catch (e)
    {
        currentUser = null;
    }

    // Load saved profile from localStorage 
    let savedProfile = null;
    try
    {
        const profileStored = localStorage.getItem('dobu_user_profile');
        if (profileStored)
        {
            savedProfile = JSON.parse(profileStored);
        }
    } catch (e)
    {
        savedProfile = null;
    }

    // Merge: use saved profile if available, otherwise use signup data
    let displayName = 'John Doe';
    let displayEmail = 'john@example.com';
    let displayPhone = '';
    let displayAvatar = null;
    let membershipPlan = 'intermediate';

    if (savedProfile)
    {
        displayName = savedProfile.fullName || displayName;
        displayEmail = savedProfile.email || displayEmail;
        displayPhone = savedProfile.phone || '';
        displayAvatar = savedProfile.avatar || null;
    } else if (currentUser)
    {
        displayName = (currentUser.firstName || '') + ' ' + (currentUser.lastName || '');
        displayEmail = currentUser.email || displayEmail;
        membershipPlan = currentUser.membershipPlan || 'intermediate';
    }

    // Update page with user info
    document.getElementById('memberName').textContent = displayName;
    document.getElementById('profileName').textContent = displayName;
    document.getElementById('profileEmail').textContent = displayEmail;
    const profilePhoneEl = document.getElementById('profilePhone');
    if (profilePhoneEl) profilePhoneEl.textContent = displayPhone || 'Not set';

    // Display avatar if saved
    if (displayAvatar)
    {
        const avatarImg = document.getElementById('avatarImage');
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        if (avatarImg && avatarPlaceholder)
        {
            avatarImg.src = displayAvatar;
            avatarImg.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
        }
    }

    // Membership plan display
    const planNames =
    {
        basic: 'Basic',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        elite: 'Elite',
        junior: 'Junior'
    };
    const planName = planNames[membershipPlan] || 'Intermediate';
    const memberPlanEl = document.getElementById('memberPlan');
    const profilePlanEl = document.getElementById('profilePlan');
    if (memberPlanEl) memberPlanEl.textContent = planName + ' Member';
    if (profilePlanEl) profilePlanEl.textContent = planName;

    // cancel class booking
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(function(btn)
    {
        btn.addEventListener('click', function()
        {
            const className = this.getAttribute('data-class');
            const classItem = this.closest('.class-booking-item');

            if (confirm('Are you sure you want to cancel this ' + className + ' class booking?'))
            {
                classItem.style.opacity = '0';
                classItem.style.transform = 'translateX(20px)';
                setTimeout(function()
                {
                    classItem.remove();
                    alert('Class booking cancelled successfully.');
                }, 300);
            }
        });
    });

    // logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn)
    {
        logoutBtn.addEventListener('click', function(e)
        {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?'))
            {
                localStorage.removeItem('dobu_current_user');
                localStorage.removeItem('dobu_user_profile');
                alert('You have been logged out successfully.');
                window.location.href = 'login.html';
            }
        });
    }

    // edit profile modal
    const modal = document.getElementById('editProfileModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('editProfileForm');
    const editFullName = document.getElementById('editFullName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editNameError = document.getElementById('editNameError');
    const editEmailError = document.getElementById('editEmailError');

    // Avatar elements in modal
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const modalAvatarInput = document.getElementById('modalAvatarInput');
    const modalAvatarImg = document.getElementById('modalAvatarImg');
    const modalAvatarIcon = document.getElementById('modalAvatarIcon');
    let selectedAvatarData = displayAvatar;

    // Profile avatar click (on the page)
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarInput = document.getElementById('avatarInput');

    function openModal()
    {
        if (!modal) return;
        // Populate form with current values
        editFullName.value = displayName;
        editEmail.value = displayEmail;
        editPhone.value = displayPhone;
        selectedAvatarData = displayAvatar;

        // Show current avatar in modal
        if (selectedAvatarData)
        {
            modalAvatarImg.src = selectedAvatarData;
            modalAvatarImg.style.display = 'block';
            modalAvatarIcon.style.display = 'none';
        } else
        {
            modalAvatarImg.style.display = 'none';
            modalAvatarIcon.style.display = 'block';
        }

        // Clear errors
        editNameError.style.display = 'none';
        editEmailError.style.display = 'none';

        modal.style.display = 'flex';
    }

    function closeModal()
    {
        if (modal) modal.style.display = 'none';
    }

    // Open modal buttons
    if (editProfileBtn)
    {
        editProfileBtn.addEventListener('click', function(e)
        {
            e.preventDefault();
            openModal();
        });
    }
    if (updateProfileBtn)
    {
        updateProfileBtn.addEventListener('click', function(e)
        {
            e.preventDefault();
            openModal();
        });
    }

    // Close modal buttons
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeModal);

    // Close modal when clicking overlay
    if (modal)
    {
        modal.addEventListener('click', function(e)
        {
            if (e.target === modal) closeModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e)
    {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex')
        {
            closeModal();
        }
    });

    // avatar upload
    function handleAvatarFile(file)
    {
        if (!file) return;
        // Validate file type
        if (!file.type.startsWith('image/'))
        {
            alert('Please select an image file.');
            return;
        }
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024)
        {
            alert('Image size must be less than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e)
        {
            selectedAvatarData = e.target.result;
            // Update modal preview
            modalAvatarImg.src = selectedAvatarData;
            modalAvatarImg.style.display = 'block';
            modalAvatarIcon.style.display = 'none';
        };
        reader.onerror = function()
        {
            alert('Failed to read the image file. Please try another file.');
        };
        reader.readAsDataURL(file);
    }

    // Change photo button in modal
    if (changePhotoBtn && modalAvatarInput)
    {
        changePhotoBtn.addEventListener('click', function()
        {
            modalAvatarInput.click();
        });
        modalAvatarInput.addEventListener('change', function()
        {
            handleAvatarFile(this.files[0]);
        });
    }

    // Click avatar on page to upload directly
    if (profileAvatar && avatarInput)
    {
        profileAvatar.addEventListener('click', function()
        {
            avatarInput.click();
        });
        avatarInput.addEventListener('change', function()
        {
            const file = this.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/'))
            {
                alert('Please select an image file.');
                return;
            }
            if (file.size > 2 * 1024 * 1024)
            {
                alert('Image size must be less than 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e)
            {
                const avatarData = e.target.result;
                // Update page avatar immediately
                const avatarImg = document.getElementById('avatarImage');
                const avatarPlaceholder = document.getElementById('avatarPlaceholder');
                avatarImg.src = avatarData;
                avatarImg.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
                // Save to localStorage
                saveProfile(displayName, displayEmail, displayPhone, avatarData);
                displayAvatar = avatarData;
                alert('Profile photo updated successfully.');
            };
            reader.readAsDataURL(file);
        });
    }

    // save profile
    function saveProfile(fullName, email, phone, avatar)
    {
        const profileData =
        {
            fullName: fullName,
            email: email,
            phone: phone,
            avatar: avatar,
            updatedAt: new Date().toISOString()
        };
        try
        {
            localStorage.setItem('dobu_user_profile', JSON.stringify(profileData));
            return true;
        } catch (e)
        {
            // localStorage might be full (avatar too large)
            alert('Failed to save profile. The image may be too large for browser storage. Try a smaller image.');
            return false;
        }
    }

    // form submission
    if (editForm)
    {
        editForm.addEventListener('submit', function(e)
        {
            e.preventDefault();

            let isValid = true;
            const fullName = editFullName.value.trim();
            const email = editEmail.value.trim();
            const phone = editPhone.value.trim();

            // Validate name
            if (!fullName || fullName.length < 2)
            {
                editNameError.style.display = 'block';
                isValid = false;
            } else
            {
                editNameError.style.display = 'none';
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email))
            {
                editEmailError.style.display = 'block';
                isValid = false;
            } else
            {
                editEmailError.style.display = 'none';
            }

            if (!isValid) return;

            // Save profile
            const saved = saveProfile(fullName, email, phone, selectedAvatarData);
            if (!saved) return;

            // Update display variables
            displayName = fullName;
            displayEmail = email;
            displayPhone = phone;
            displayAvatar = selectedAvatarData;

            // Update page
            document.getElementById('memberName').textContent = displayName;
            document.getElementById('profileName').textContent = displayName;
            document.getElementById('profileEmail').textContent = displayEmail;
            const phoneEl = document.getElementById('profilePhone');
            if (phoneEl) phoneEl.textContent = displayPhone || 'Not set';

            // Update page avatar
            if (displayAvatar)
            {
                const avatarImg = document.getElementById('avatarImage');
                const avatarPlaceholder = document.getElementById('avatarPlaceholder');
                avatarImg.src = displayAvatar;
                avatarImg.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
            }

            closeModal();
            alert('Profile updated successfully.');
        });
    }
    // EMPTY STATE FOR CLASS BOOKINGS 
    function checkEmptyState()
    {
        const bookingItems = document.querySelectorAll('.class-booking-item');
        const bookingsList = document.querySelector('.bookings-list') || document.querySelector('.upcoming-classes');
        if (bookingItems.length === 0 && bookingsList)
        {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-state';
            emptyMsg.style.cssText = 'text-align:center;padding:30px;color:#888;';
            emptyMsg.innerHTML = '<p style="font-size:20px;font-weight:600;color:#555;margin-bottom:8px;">No upcoming classes</p><p style="font-size:13px;color:#888;">Book a class from the timetable to see it here.</p>';            bookingsList.appendChild(emptyMsg);
        }
    }
    // Run after a short delay to allow cancel animations
    setTimeout(checkEmptyState, 500);


});
