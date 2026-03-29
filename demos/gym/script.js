(function () {
  'use strict';

  var siteHeader = document.querySelector('.site-header');
  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');
  var scrollProgress = document.getElementById('scrollProgress');
  var billingButtons = document.querySelectorAll('.billing-toggle__button');
  var priceElements = document.querySelectorAll('.plan-card__price');
  var scheduleTabs = document.querySelectorAll('.schedule-tab');
  var schedulePanels = document.querySelectorAll('.schedule-panel');
  var trialForm = document.getElementById('trialForm');
  var counterElements = document.querySelectorAll('.count-up');
  var scrollTicking = false;

  function syncHeaderState() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  function updateScrollProgress() {
    if (!scrollProgress) {
      return;
    }

    var scrollTop = window.scrollY;
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollHeight > 0 ? scrollTop / scrollHeight * 100 : 0;
    scrollProgress.style.transform = 'scaleX(' + (progress / 100) + ')';
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

  billingButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var billingType = button.getAttribute('data-billing');

      billingButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');

      priceElements.forEach(function (price) {
        var value = price.getAttribute('data-' + billingType);
        if (value) {
          price.textContent = 'Rs.' + Number(value).toLocaleString('en-IN');
        }
      });
    });
  });

  scheduleTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-panel');

      scheduleTabs.forEach(function (button) {
        button.classList.remove('is-active');
        button.setAttribute('aria-selected', 'false');
      });

      schedulePanels.forEach(function (panel) {
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

  if (trialForm) {
    trialForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!trialForm.checkValidity()) {
        trialForm.reportValidity();
        return;
      }

      var name = document.getElementById('trialName').value.trim();
      var phone = document.getElementById('trialPhone').value.trim();
      var goal = document.getElementById('trialGoal').value.trim();
      var time = document.getElementById('trialTime').value.trim();

      var messageLines = [
        'Hi Forge District, I want to book a free trial.',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'Goal: ' + goal,
        'Preferred time: ' + time
      ];

      var whatsappUrl = 'https://wa.me/918668582490?text=' + encodeURIComponent(messageLines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  function animateCounter(counter) {
    if (counter.getAttribute('data-animated') === 'true') {
      return;
    }

    var target = Number(counter.getAttribute('data-target'));
    var isDecimal = counter.getAttribute('data-decimal') === 'true';
    var startTime = null;
    var duration = 1400;

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var currentValue = eased * target;

      counter.textContent = isDecimal ? currentValue.toFixed(1) : Math.round(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = isDecimal ? target.toFixed(1) : String(target);
        counter.setAttribute('data-animated', 'true');
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (element) {
      revealObserver.observe(element);
    });

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counterElements.forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4
    });

    var statsContainer = document.querySelector('.hero__stats');
    if (statsContainer) {
      counterObserver.observe(statsContainer);
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });
    counterElements.forEach(animateCounter);
  }

  window.addEventListener('scroll', function () {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;
    window.requestAnimationFrame(function () {
      syncHeaderState();
      updateScrollProgress();
      scrollTicking = false;
    });
  }, { passive: true });

  syncHeaderState();
  updateScrollProgress();
})();