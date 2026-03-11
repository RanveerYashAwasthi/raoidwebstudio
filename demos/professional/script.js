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

    // ── Scroll Animations ──
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // ── Contact → WhatsApp ──
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const fd   = new FormData(form);
            const name = fd.get('name')    || '';
            const msg  = fd.get('message') || '';
            const text = `Hi! I'm ${name}. ${msg}`;
            window.open(`https://wa.me/918668582490?text=${encodeURIComponent(text)}`, '_blank');
        });
    }
})();
