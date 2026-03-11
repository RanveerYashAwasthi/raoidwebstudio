(function () {
    'use strict';

    // ── Navbar Scroll ──
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── Mobile Toggle ──
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }

    // ── Menu Tab Filtering ──
    const tabs  = document.querySelectorAll('.menu-tab');
    const items = document.querySelectorAll('.menu-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.category;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            items.forEach(item => {
                item.style.display = item.dataset.category === cat ? '' : 'none';
            });
        });
    });

    // ── Hero Floating Particles ──
    const particlesBox = document.getElementById('particles');
    if (particlesBox) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.setProperty('--dur', (6 + Math.random() * 10) + 's');
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
            particlesBox.appendChild(p);
        }
    }

    // ── Hero Counter Animation ──
    const counters = document.querySelectorAll('.hs-num[data-target]');
    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);           // ease-out cubic
            const current = eased * target;
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                counters.forEach(animateCounter);
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    if (counters.length) heroObserver.observe(counters[0].closest('.hero-stats'));

    // ── Scroll Animations ──
    const fadeObserver = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // ── Contact → WhatsApp ──
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const fd    = new FormData(form);
            const name  = fd.get('name')    || '';
            const phone = fd.get('phone')   || '';
            const date  = fd.get('date')    || '';
            const guests= fd.get('guests')  || '';
            const msg   = fd.get('message') || '';
            const text  = `Hi! I'm ${name}${phone ? ' (' + phone + ')' : ''}. I'd like to book a table${date ? ' on ' + date : ''}${guests ? ' for ' + guests + ' guests' : ''}. ${msg}`;
            window.open(`https://wa.me/918668582490?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Scroll Progress Bar ──
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
        }, { passive: true });
    }

    // ── Staggered Reveals ──
    function staggerReveal(selector, delay) {
        const items = document.querySelectorAll(selector);
        if (!items.length) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx * delay) + 's';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(24px) scale(0.97)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            obs.observe(item);
        });
    }
    staggerReveal('.gallery-item', 0.1);
    staggerReveal('.insta-item', 0.08);

    // ── Navbar active link highlight ──
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        navAnchors.forEach(a => {
            a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });
})();
