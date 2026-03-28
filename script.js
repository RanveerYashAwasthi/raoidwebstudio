(function () {
    'use strict';

    // ======================== NAVBAR SCROLL ========================
    var navbar = document.getElementById('navbar');
    var SCROLL_THRESHOLD = 40;

    function handleNavbarScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ======================== MOBILE HAMBURGER ========================
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var navMenu = document.getElementById('navMenu');
    var navLinks = navMenu.querySelectorAll('.navbar__link');

    function openMenu() {
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('is-open');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
    }

    hamburgerBtn.addEventListener('click', function () {
        var isOpen = navMenu.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeMenu();
            hamburgerBtn.focus();
        }
    });

    // ======================== SMOOTH SCROLL ========================
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    var navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    // ======================== SCROLL REVEAL ========================
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // ======================== ACTIVE NAV LINK ========================
    var sections = document.querySelectorAll('section[id]');
    var allNavLinks = document.querySelectorAll('.navbar__link');

    function highlightNav() {
        var scrollPos = window.scrollY + navbarHeight + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(function (link) {
                    link.classList.remove('is-active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('is-active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ======================== CONTACT FORM -> WHATSAPP ========================
    var contactForm = document.getElementById('contactForm');

    function showError(inputId, errorId, message) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) {
            input.classList.add('form-input--error');
            input.classList.remove('form-input--valid');
            input.setAttribute('aria-invalid', 'true');
        }
        if (error) {
            error.textContent = message;
            error.classList.add('is-visible');
        }
    }

    function clearError(inputId, errorId) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) {
            input.classList.remove('form-input--error');
            input.removeAttribute('aria-invalid');
        }
        if (error) {
            error.textContent = '';
            error.classList.remove('is-visible');
        }
    }

    function markValid(inputId) {
        var input = document.getElementById(inputId);
        if (input && input.value.trim().length > 0) {
            input.classList.add('form-input--valid');
        }
    }

    // ======================== FORM RECOVERY (localStorage) ========================
    var STORAGE_KEY = 'rws_contact_draft';
    var formFields = ['contactName', 'contactBusiness', 'contactPhone', 'contactMessage'];
    var formStatus = document.getElementById('formStatus');

    function saveDraft() {
        var data = {};
        formFields.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) data[id] = el.value;
        });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            // Storage full or unavailable — fail silently
        }
    }

    function restoreDraft() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            var data = JSON.parse(raw);
            var hasData = false;
            formFields.forEach(function (id) {
                var el = document.getElementById(id);
                if (el && data[id]) {
                    el.value = data[id];
                    hasData = true;
                }
            });
            if (hasData && formStatus) {
                formStatus.className = 'form-status form-status--draft';
                formStatus.innerHTML = '&#x1f4be; Your previous draft has been restored.';
                setTimeout(function () {
                    formStatus.className = 'form-status';
                    formStatus.innerHTML = '';
                }, 5000);
            }
            updateCharCount();
            return hasData;
        } catch (e) {
            return false;
        }
    }

    function clearDraft() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            // fail silently
        }
    }

    // ======================== CHARACTER COUNT ========================
    var messageInput = document.getElementById('contactMessage');
    var charCountEl = document.getElementById('messageCharCount');

    function updateCharCount() {
        if (!messageInput || !charCountEl) return;
        var len = messageInput.value.length;
        var max = 500;
        charCountEl.textContent = len + ' / ' + max;
        charCountEl.classList.remove('form-char-count--near', 'form-char-count--limit');
        if (len >= max) {
            charCountEl.classList.add('form-char-count--limit');
        } else if (len >= max * 0.85) {
            charCountEl.classList.add('form-char-count--near');
        }
    }

    if (messageInput) {
        messageInput.addEventListener('input', updateCharCount);
    }

    // ======================== REAL-TIME VALIDATION + DRAFT SAVE ========================
    var validationRules = {
        contactName: function (val) { return val.length >= 2 ? '' : 'Please enter your name (at least 2 characters)'; },
        contactBusiness: function (val) { return val.length >= 2 ? '' : 'Please enter your business name (at least 2 characters)'; },
        contactPhone: function (val) {
            var digits = val.replace(/\s/g, '');
            if (!digits) return 'Please enter your phone number';
            if (digits.length < 10 || !/^[\d\s+\-()]+$/.test(val)) return 'Please enter a valid 10-digit phone number';
            return '';
        }
    };

    formFields.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;

        // Save draft on every input
        el.addEventListener('input', function () {
            saveDraft();
            // Clear error while typing
            clearError(id, id + 'Error');
        });

        // Validate on blur for error prevention
        el.addEventListener('blur', function () {
            var val = el.value.trim();
            if (!validationRules[id]) return;
            var errMsg = validationRules[id](val);
            if (val.length > 0 && errMsg) {
                showError(id, id + 'Error', errMsg);
            } else if (val.length > 0) {
                clearError(id, id + 'Error');
                markValid(id);
            }
        });
    });

    // Also save draft for textarea
    if (messageInput) {
        messageInput.addEventListener('input', saveDraft);
    }

    // ======================== CLEAR FORM BUTTON (User Control & Freedom) ========================
    var formClearBtn = document.getElementById('formClearBtn');
    if (formClearBtn && contactForm) {
        formClearBtn.addEventListener('click', function () {
            // Reset all fields
            contactForm.reset();
            // Clear all validation states
            formFields.forEach(function (id) {
                clearError(id, id + 'Error');
                var el = document.getElementById(id);
                if (el) el.classList.remove('form-input--valid');
            });
            // Clear draft
            clearDraft();
            // Update char count
            updateCharCount();
            // Clear status
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.innerHTML = '';
            }
            // Focus first field for convenience
            var firstName = document.getElementById('contactName');
            if (firstName) firstName.focus();
        });
    }

    // ======================== FORM SUBMIT ========================
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('contactName').value.trim();
            var business = document.getElementById('contactBusiness').value.trim();
            var phone = document.getElementById('contactPhone').value.trim();
            var message = document.getElementById('contactMessage').value.trim();

            var hasError = false;

            // Clear all previous errors
            clearError('contactName', 'contactNameError');
            clearError('contactBusiness', 'contactBusinessError');
            clearError('contactPhone', 'contactPhoneError');

            if (!name || name.length < 2) {
                showError('contactName', 'contactNameError', 'Please enter your name (at least 2 characters)');
                hasError = true;
            }
            if (!business || business.length < 2) {
                showError('contactBusiness', 'contactBusinessError', 'Please enter your business name (at least 2 characters)');
                hasError = true;
            }
            if (!phone) {
                showError('contactPhone', 'contactPhoneError', 'Please enter your phone number');
                hasError = true;
            } else if (phone.replace(/\s/g, '').length < 10 || !/^[\d\s+\-()]+$/.test(phone)) {
                showError('contactPhone', 'contactPhoneError', 'Please enter a valid 10-digit phone number');
                hasError = true;
            }

            if (hasError) {
                var firstError = contactForm.querySelector('.form-input--error');
                if (firstError) firstError.focus();
                return;
            }

            var lines = [
                'Hi, I want a website for my business.',
                '',
                'Name: ' + name,
                'Business: ' + business,
                'Phone: ' + phone
            ];

            if (message) {
                lines.push('Details: ' + message);
            }

            var text = encodeURIComponent(lines.join('\n'));
            var waUrl = 'https://wa.me/918668582490?text=' + text;

            // Clear draft after successful submission
            clearDraft();

            // Show success status
            if (formStatus) {
                formStatus.className = 'form-status form-status--success';
                formStatus.innerHTML = '&#x2705; Opening WhatsApp&hellip; Your details are ready to send.';
            }

            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // ======================== RESTORE DRAFT ON LOAD ========================
    restoreDraft();

})();
