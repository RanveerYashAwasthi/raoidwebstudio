(function () {
  'use strict';

  var siteHeader = document.querySelector('.site-header');
  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');
  var bookingForm = document.getElementById('bookingForm');
  var dateInput = document.getElementById('visitDate');
  var scrollTicking = false;

  function syncHeaderState() {
    if (!siteHeader) {
      return;
    }

    if (window.scrollY > 16) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  if (dateInput) {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    dateInput.min = year + '-' + month + '-' + day;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      var name = document.getElementById('patientName').value.trim();
      var phone = document.getElementById('patientPhone').value.trim();
      var visitType = document.getElementById('visitType').value.trim();
      var visitDate = document.getElementById('visitDate').value.trim();
      var notes = document.getElementById('visitNotes').value.trim();

      var messageLines = [
        'Hi Northside Family Clinic, I would like to book an appointment.',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'Visit type: ' + visitType,
        'Preferred date: ' + visitDate
      ];

      if (notes) {
        messageLines.push('Notes: ' + notes);
      }

      var whatsappUrl = 'https://wa.me/918668582490?text=' + encodeURIComponent(messageLines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (element) {
      observer.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  window.addEventListener('scroll', function () {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;
    window.requestAnimationFrame(function () {
      syncHeaderState();
      scrollTicking = false;
    });
  }, { passive: true });
  syncHeaderState();
})();