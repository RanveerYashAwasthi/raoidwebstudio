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

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('contactName').value.trim();
            var business = document.getElementById('contactBusiness').value.trim();
            var phone = document.getElementById('contactPhone').value.trim();
            var message = document.getElementById('contactMessage').value.trim();

            if (!name || !business || !phone) {
                var firstEmpty = !name ? 'contactName' : !business ? 'contactBusiness' : 'contactPhone';
                document.getElementById(firstEmpty).focus();
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

            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

})();
