/* =========================================================
   IKRAABI — script.js
   Semua interaksi frontend: navbar, dark mode, counter,
   carousel, back-to-top, dan binding tombol ke Google Form.
========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
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
    document.getElementById('year').textContent = new Date().getFullYear();
  });

  function initIcons() {
    if (window.lucide) lucide.createIcons();
  }

  function initAOS() {
    if (window.AOS) AOS.init({ once: true, duration: 700, offset: 60, easing: 'ease-out-cubic' });
  }

  /* Navbar: transparan di atas, glass effect saat discroll */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Menu mobile */
  function initMobileMenu() {
    const btn = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.innerHTML = isOpen
        ? '<i data-lucide="x" class="w-6 h-6"></i>'
        : '<i data-lucide="menu" class="w-6 h-6"></i>';
      if (window.lucide) lucide.createIcons();
    });
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        if (window.lucide) lucide.createIcons();
      })
    );
  }

  /* Dark mode toggle, tersimpan di localStorage */
  function initDarkMode() {
    const toggle = document.getElementById('darkToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('ikraabi-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) root.classList.add('dark');

    toggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('ikraabi-theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* Smooth scroll untuk anchor internal, mempertimbangkan tinggi navbar */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 84;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* Animasi angka statistik saat masuk viewport */
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  /* Carousel informasi (SwiperJS) */
  function initSwiper() {
    if (!window.Swiper) return;
    const swiper = new Swiper('.infoSwiper', {
      slidesPerView: 1.05,
      spaceBetween: 20,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
      navigation: { nextEl: '#infoNext', prevEl: '#infoPrev' },
      a11y: { enabled: true },
    });
    return swiper;
  }

  /* Tombol kembali ke atas */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 480) btn.classList.add('show');
        else btn.classList.remove('show');
      },
      { passive: true }
    );
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Menghubungkan setiap tombol pendataan ke URL Google Form
     berdasarkan konfigurasi window.IKRAABI_CONFIG.forms */
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