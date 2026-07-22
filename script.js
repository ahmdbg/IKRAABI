(function () {
  'use strict';

  const boot = () => {
    initIcons();
    initAOS();
    initNavbar();
    initMobileMenu();
    initDarkMode();
    initSmoothAnchors();
    initCounters();
    initSwiper();
    initBackToTop();
    bindGoogleForms();
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  function initIcons() { if (window.lucide) lucide.createIcons(); }

  function initAOS() {
    if (window.AOS) AOS.init({ once: true, duration: 700, offset: 60, easing: 'ease-out-cubic' });
  }

  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const btn = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    const setState = (open) => {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = open ? '<i data-lucide="x" class="w-6 h-6"></i>' : '<i data-lucide="menu" class="w-6 h-6"></i>';
      if (window.lucide) lucide.createIcons();
    };

    btn.addEventListener('click', () => setState(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setState(false)));
  }

  function initDarkMode() {
    const toggle = document.getElementById('darkToggle');
    const root = document.documentElement;
    if (!toggle) return;

    const saved = localStorage.getItem('ikraabi-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) root.classList.add('dark');

    toggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('ikraabi-theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => observer.observe(c));
  }

  function initSwiper() {
    if (!window.Swiper) return;
    new Swiper('.infoSwiper', {
      slidesPerView: 1.05,
      spaceBetween: 20,
      breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } },
      navigation: { nextEl: '#infoNext', prevEl: '#infoPrev' },
      a11y: { enabled: true }
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 480), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function bindGoogleForms() {
    const forms = (window.IKRAABI_CONFIG && window.IKRAABI_CONFIG.forms) || {};
    document.querySelectorAll('[data-form-key]').forEach((el) => {
      const key = el.getAttribute('data-form-key');
      if (forms[key]) el.setAttribute('href', forms[key]);
    });

    const social = (window.IKRAABI_CONFIG && window.IKRAABI_CONFIG.social) || {};
    const ig = document.querySelector('a[href*="instagram.com/ikraabi.official"]');
    if (ig && social.instagram) ig.setAttribute('href', social.instagram);
  }
})();