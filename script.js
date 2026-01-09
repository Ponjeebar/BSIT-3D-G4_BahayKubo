// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form wrapper and toggle elements
    const formWrapper = document.getElementById('formWrapper');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const showLoginFromForgot = document.getElementById('showLoginFromForgot');
    const forgotLink = document.querySelector('.forgot-link');

    // Show Signup Form - panels swap positions
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            formWrapper.classList.add('signup-active');
            formWrapper.classList.remove('forgot-active');
        });
    }

    // Show Login Form - remove signup-active class
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            formWrapper.classList.remove('signup-active');
            formWrapper.classList.remove('forgot-active');
        });
    }

    // Show Login Form from Forgot Password
    if (showLoginFromForgot) {
        showLoginFromForgot.addEventListener('click', (e) => {
            e.preventDefault();
            formWrapper.classList.remove('forgot-active');
        });
    }

    // Show Forgot Password Form
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            formWrapper.classList.add('forgot-active');
            formWrapper.classList.remove('signup-active');
        });
    }

    // Login Form Submission with Loading Screen
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            const rememberMe = loginForm.querySelector('input[name="remember"]').checked;

            // Clear previous messages
            if (loginMessage) {
                loginMessage.textContent = '';
                loginMessage.className = 'form-message';
            }

            // Validation
            if (!username || !password) {
                if (loginMessage) {
                    loginMessage.textContent = 'Please enter both username and password.';
                    loginMessage.className = 'form-message error';
                }
                return;
            }

            // Show loading screen
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.style.opacity = '1';
                loadingOverlay.style.visibility = 'visible';
                loadingOverlay.classList.add('active');
                void loadingOverlay.offsetHeight;
            }
            if (loadingText) {
                loadingText.textContent = 'Logging in...';
            }

            // Simulate processing delay
            setTimeout(() => {
                // Get users from localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                
                // Find user
                const user = users.find(u => 
                    u.username.toLowerCase() === username.toLowerCase() && 
                    u.password === password
                );

                if (user) {
                    // Login successful
                    // Store session data
                    const sessionData = {
                        user_id: user.id,
                        username: user.username,
                        first_name: user.firstName,
                        last_name: user.lastName,
                        logged_in: true,
                        login_time: new Date().toISOString()
                    };

                    if (rememberMe) {
                        // Store in localStorage for persistent session
                        localStorage.setItem('currentUser', JSON.stringify(sessionData));
                    } else {
                        // Store in sessionStorage for session-only
                        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
                    }

                    // Check if there's a pending booking search
                    var pendingBooking = localStorage.getItem('pendingBookingSearch');
                    if (pendingBooking) {
                        try {
                            var bookingData = JSON.parse(pendingBooking);
                            // Format dates for URL (convert m/d/yyyy to yyyy-mm-dd)
                            var formatDateForURL = function(dateString) {
                                var parts = dateString.split('/');
                                return parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
                            };
                            
                            // Store as regular booking search
                            localStorage.setItem('bookingSearch', pendingBooking);
                            localStorage.removeItem('pendingBookingSearch');
                            
                            // Redirect to rooms page with booking parameters
                            var url = 'rooms.html?checkin=' + encodeURIComponent(formatDateForURL(bookingData.checkinDate)) + 
                                      '&checkout=' + encodeURIComponent(formatDateForURL(bookingData.checkoutDate)) + 
                                      '&guests=' + encodeURIComponent(bookingData.guests);
                            if (bookingData.roomType) {
                                url += '&room=' + encodeURIComponent(bookingData.roomType);
                            }
                            window.location.href = url;
                            return;
                        } catch (e) {
                            console.error('Error processing pending booking:', e);
                        }
                    }
                    
                    // Check if there's a pending redirect (from service modals)
                    var pendingRedirect = localStorage.getItem('pendingRedirect');
                    if (pendingRedirect) {
                        localStorage.removeItem('pendingRedirect');
                        localStorage.removeItem('pendingServiceAction');
                        window.location.href = pendingRedirect;
                        return;
                    }
                    
                    // Redirect to homepage if no pending actions
                    window.location.href = 'index.html';
                } else {
                    // Login failed
                    if (loadingOverlay) {
                        loadingOverlay.classList.remove('active');
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                            loadingOverlay.style.opacity = '0';
                            loadingOverlay.style.visibility = 'hidden';
                        }, 300);
                    }

                    if (loginMessage) {
                        loginMessage.textContent = 'Invalid username or password. Please try again.';
                        loginMessage.className = 'form-message error';
                    }
                }
            }, 800);
        });
    }

    // Terms and Privacy Policy Modal
    const termsModal = document.getElementById('termsModal');
    const termsLink = document.getElementById('termsLink');
    const closeModal = document.getElementById('closeModal');
    const acceptTermsBtn = document.getElementById('acceptTerms');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const lastUpdatedDate = document.getElementById('lastUpdatedDate');

    // Set last updated date
    if (lastUpdatedDate) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedDate.textContent = today.toLocaleDateString('en-US', options);
    }

    // Open modal when Terms link is clicked
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    }

    // Close modal when close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (termsModal) {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Close modal when clicking outside the modal container
    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) {
            termsModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Accept terms button - checks the checkbox and closes modal
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', () => {
            if (termsCheckbox) {
                termsCheckbox.checked = true;
                // Trigger change event to ensure form validation recognizes the change
                termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (termsModal) {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Signup Form Submission
    const signupForm = document.getElementById('signupForm');
    const signupMessage = document.getElementById('signupMessage');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const termsAccepted = document.getElementById('termsCheckbox').checked;

            // Clear previous messages
            if (signupMessage) {
                signupMessage.textContent = '';
                signupMessage.className = 'form-message';
            }

            // Validation
            if (!firstName || !lastName || !username || !password) {
                if (signupMessage) {
                    signupMessage.textContent = 'Please fill in all fields.';
                    signupMessage.className = 'form-message error';
                }
                return;
            }

            if (!termsAccepted) {
                if (signupMessage) {
                    signupMessage.textContent = 'Please accept the Terms and Privacy Policy to create an account.';
                    signupMessage.className = 'form-message error';
                }
                // Optionally open the modal to show terms
                if (termsModal && termsLink) {
                    setTimeout(() => {
                        termsLink.click();
                    }, 100);
                }
                return;
            }

            if (password.length < 6) {
                if (signupMessage) {
                    signupMessage.textContent = 'Password must be at least 6 characters long.';
                    signupMessage.className = 'form-message error';
                }
                return;
            }

            // Check if username already exists
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = existingUsers.find(user => user.username.toLowerCase() === username.toLowerCase());

            if (userExists) {
                if (signupMessage) {
                    signupMessage.textContent = 'Username already exists. Please choose another.';
                    signupMessage.className = 'form-message error';
                }
                return;
            }

            // Show loading screen
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.style.opacity = '1';
                loadingOverlay.style.visibility = 'visible';
                loadingOverlay.classList.add('active');
                void loadingOverlay.offsetHeight;
            }
            if (loadingText) {
                loadingText.textContent = 'Creating account...';
            }

            // Simulate processing delay
            setTimeout(() => {
                // Create user object
                const newUser = {
                    id: Date.now().toString(),
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    password: password, // In a real app, this would be hashed
                    createdAt: new Date().toISOString()
                };

                // Store user in localStorage
                existingUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(existingUsers));

                // Hide loading screen
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        loadingOverlay.style.opacity = '0';
                        loadingOverlay.style.visibility = 'hidden';
                    }, 300);
                }

                // Switch to login form immediately
                setTimeout(() => {
                    // Reset signup form
                    signupForm.reset();
                    if (signupMessage) {
                        signupMessage.textContent = '';
                        signupMessage.className = 'form-message';
                    }

                    // Switch to login form
                    formWrapper.classList.remove('signup-active');
                    formWrapper.classList.remove('forgot-active');

                    // Pre-fill username in login form
                    const loginUsernameField = document.getElementById('loginUsername');
                    if (loginUsernameField) {
                        loginUsernameField.value = username;
                    }
                }, 500);
            }, 800);
        });
    }
});
