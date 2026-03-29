(function () {
  'use strict';

  var siteHeader = document.querySelector('.site-header');
  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');
  var dateInput = document.getElementById('clientDate');
  var bookingForm = document.getElementById('bookingForm');
  var tabs = document.querySelectorAll('.service-tab');
  var panels = document.querySelectorAll('.service-panel');
  var comparison = document.getElementById('comparison');
  var comparisonRange = document.getElementById('comparisonRange');
  var scrollTicking = false;

  function syncHeaderState() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
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

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-panel');

      tabs.forEach(function (button) {
        button.classList.remove('is-active');
        button.setAttribute('aria-selected', 'false');
      });

      panels.forEach(function (panel) {
        panel.classList.remove('is-active');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      var panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('is-active');
      }
    });
  });

  if (comparison && comparisonRange) {
    comparisonRange.addEventListener('input', function () {
      comparison.style.setProperty('--split', comparisonRange.value + '%');
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

      var name = document.getElementById('clientName').value.trim();
      var phone = document.getElementById('clientPhone').value.trim();
      var service = document.getElementById('clientService').value.trim();
      var date = document.getElementById('clientDate').value.trim();
      var notes = document.getElementById('clientNotes').value.trim();

      var messageLines = [
        'Hi Velvet Frame, I want to book an appointment.',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'Service: ' + service,
        'Preferred date: ' + date
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
      threshold: 0.14,
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