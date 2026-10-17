(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-btn');
  var themeToggle = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var THEME_COLORS = { dark: '#0e0f11', light: '#faf8f5' };

  // ---------- Theme ----------
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[theme]);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });

  // ---------- Mobile menu ----------
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));

  function isMenuOpen() {
    return header.classList.contains('nav-open');
  }

  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  menuBtn.addEventListener('click', function () {
    var open = !isMenuOpen();
    setMenu(open);
    // The links come before the button in the page, so move focus into them.
    if (open && links.length) links[0].focus();
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', function (event) {
    if (isMenuOpen() && !header.contains(event.target)) setMenu(false);
  });

  header.addEventListener('focusout', function (event) {
    if (isMenuOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !isMenuOpen()) return;
    var focusWasInHeader = header.contains(document.activeElement);
    setMenu(false);
    if (focusWasInHeader) menuBtn.focus();
  });

  var desktop = window.matchMedia('(min-width: 768px)');
  var closeOnDesktop = function (event) {
    if (event.matches) setMenu(false);
  };
  if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
  else if (desktop.addListener) desktop.addListener(closeOnDesktop);

  // ---------- Highlight the nav link for the section in view ----------
  var sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    })
    .filter(Boolean);
  if (!sections.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  // After a nav click, keep the clicked link highlighted until that jump finishes;
  // short sections near the end of the page can't always scroll to the top.
  var jumpTarget = null;
  var jumpTimer;

  function releaseJumpSoon() {
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(function () {
      jumpTarget = null;
    }, 200);
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      jumpTarget = link.getAttribute('href').slice(1);
      setActive(jumpTarget);
      releaseJumpSoon();
    });
  });

  function update() {
    var line = window.innerHeight * 0.4;
    var current = sections[0].id;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1].id;
    setActive(current);
  }

  function onScroll() {
    if (jumpTarget) releaseJumpSoon();
    else update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
