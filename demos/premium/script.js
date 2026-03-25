/* ==============================================
   Brew & Bite Cafe — Premium Demo JS
   ============================================== */
(function () {
  'use strict';

  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
    }
  }

  // --- Navbar scroll behavior ---
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScrollY = scrollY;
  }

  // --- Hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Hero loaded animation ---
  const hero = document.getElementById('hero');
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('loaded');
    });
  }

  // --- Counter animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-number');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      const target = parseFloat(counter.dataset.target);
      const isDecimal = counter.dataset.decimal === 'true';
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out-quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = eased * target;

        if (isDecimal) {
          counter.textContent = current.toFixed(1);
        } else {
          counter.textContent = Math.floor(current);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
          counter.dataset.animated = 'true';
        }
      }
      requestAnimationFrame(update);
    });
  }

  // --- Intersection Observer for reveal + counters ---
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Counter observer
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterObserver.observe(heroStats);
  }

  // --- Menu tabs ---
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetTab = this.dataset.tab;

      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      var targetPanel = document.getElementById('panel-' + targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- Contact form → WhatsApp ---
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var name = (formData.get('name') || '').toString().trim();
      var phone = (formData.get('phone') || '').toString().trim();
      var date = (formData.get('date') || '').toString().trim();
      var guests = (formData.get('guests') || '').toString().trim();
      var message = (formData.get('message') || '').toString().trim();

      if (!name || !phone || !date || !guests) {
        alert('Please fill in all required fields.');
        return;
      }

      var text = 'Hi! I\'d like to book a table at Brew & Bite.\n\n';
      text += 'Name: ' + name + '\n';
      text += 'Phone: ' + phone + '\n';
      text += 'Date: ' + date + '\n';
      text += 'Guests: ' + guests + '\n';
      if (message) text += 'Message: ' + message + '\n';

      var waURL = 'https://wa.me/918668582490?text=' + encodeURIComponent(text);
      window.open(waURL, '_blank', 'noopener,noreferrer');
    });
  }

  // --- Scroll handler (throttled) ---
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        handleNavbarScroll();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Smooth anchor scrolling (for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Set min date on date input ---
  var dateInput = document.getElementById('c-date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
  }

  // Initial calls
  updateScrollProgress();
  handleNavbarScroll();

})();
