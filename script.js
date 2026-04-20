/* ============================================================
   E&E MEDICAL AMBULANCE SERVICES — script.js
   Handles: Typed.js, Hamburger, Navbar Scroll, Image Slider,
            Scroll Reveal, Form Validation, WhatsApp Dispatch,
            Floating Call Button, Back to Top, Active Nav
============================================================ */

'use strict';


/* ── DOM REFERENCES ─────────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const hamburgerIcon= document.getElementById('hamburger-icon');
const mobileNav    = document.getElementById('mobile-nav');
const floatingCall = document.getElementById('floatingCall');
const backToTop    = document.getElementById('backToTop');
const dispatchForm = document.getElementById('dispatchForm');
const submitBtn    = document.getElementById('submitBtn');
const submitText   = document.getElementById('submitText');
const spinner      = document.getElementById('spinner');
const formSuccess  = document.getElementById('formSuccess');
const formError    = document.getElementById('formError');
const searchFab    = document.getElementById('searchFab');
const searchBar    = document.getElementById('searchBar');
const allSections  = document.querySelectorAll('section[id]');
const navItems     = document.querySelectorAll('.nav-item');


/* ============================================================
   1. TYPED.JS — Hero headline animation
============================================================ */
if (document.querySelector('.multiple-text')) {
  new Typed('.multiple-text', {
    strings: ['Large Events', 'Medical Emergencies', 'Patient Transfers', 'We got you covered!'],
    typeSpeed: 55,
    backSpeed: 35,
    backDelay: 1200,
    loop: true,
    smartBackspace: true,
  });
}


/* ============================================================
   2. NAVBAR — Scroll shadow
============================================================ */
function onNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onNavbarScroll, { passive: true });
onNavbarScroll();


/* ============================================================
   3. HAMBURGER — Mobile menu toggle (your original logic kept)
============================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);

  if (isOpen) {
    hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
    document.body.style.overflow = 'hidden';
  } else {
    hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
    document.body.style.overflow = '';
  }
});

// Close when a link is clicked
mobileNav.querySelectorAll('.mobile-nav-item').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    closeMobileNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// Close on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) closeMobileNav();
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
  document.body.style.overflow = '';
}


/* ============================================================
   4. SMOOTH SCROLL — All anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});


/* ============================================================
   5. ACTIVE NAV LINK — Highlight on scroll
============================================================ */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: `-${navbar.offsetHeight + 10}px 0px -55% 0px`,
  threshold: 0
});
allSections.forEach(s => sectionObserver.observe(s));


/* ============================================================
   6. IMAGE SLIDER
============================================================ */
const slides     = document.querySelectorAll('.slide');
const dots       = document.querySelectorAll('.dot');
const sliderTrack= document.getElementById('sliderTrack');
const prevBtn    = document.getElementById('sliderPrev');
const nextBtn    = document.getElementById('sliderNext');

let currentSlide = 0;
let sliderTimer  = null;
const SLIDE_DELAY = 5000;

function goToSlide(index) {
  // Remove active from current
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  // Set new index (wrap around)
  currentSlide = (index + slides.length) % slides.length;

  // Slide the track
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Activate new slide
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoPlay() {
  stopAutoPlay();
  sliderTimer = setInterval(nextSlide, SLIDE_DELAY);
}
function stopAutoPlay() {
  if (sliderTimer) clearInterval(sliderTimer);
}

// Arrow buttons
if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
}

// Dot buttons
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
});

// Touch / swipe support on slider
const sliderSection = document.getElementById('sliderSection');
let touchStartX = 0;

if (sliderSection) {
  sliderSection.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderSection.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
      startAutoPlay();
    }
  }, { passive: true });
}

// Pause on hover
if (sliderSection) {
  sliderSection.addEventListener('mouseenter', stopAutoPlay);
  sliderSection.addEventListener('mouseleave', startAutoPlay);
}

// Kick off autoplay
startAutoPlay();


/* ============================================================
   7. STAT COUNTER ANIMATION — Your original countUp kept + extended
============================================================ */
function countUp(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = start + '+';
    }
  }, 16);
}

// Trigger when slider stats come into view
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    countUp('stat1', 100, 2000);
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const sliderStats = document.querySelector('.slider-stats');
if (sliderStats) statsObserver.observe(sliderStats);


/* ============================================================
   8. SCROLL REVEAL — Animate elements into view
============================================================ */
function initReveal() {
  // Auto-tag elements that should reveal
  const selectors = [
    '.service-card', '.testi-card', '.about-stat-card',
    '.coverage-tag', '.section-header', '.about-badges',
  ];
  selectors.forEach((sel, groupIdx) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-d1');
      if (i % 3 === 2) el.classList.add('reveal-d2');
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


/* ============================================================
   9. FLOATING CALL BUTTON & BACK TO TOP
============================================================ */
function onScrollExtras() {
  const heroH = document.getElementById('home')?.offsetHeight || 400;
  const scrolled = window.scrollY > heroH * 0.5;

  floatingCall?.classList.toggle('visible', scrolled);
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}
window.addEventListener('scroll', onScrollExtras, { passive: true });
onScrollExtras();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   10. MOBILE SEARCH FAB
============================================================ */
searchFab?.addEventListener('click', () => {
  if (searchBar) {
    searchBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    searchBar.style.background = '#fff';
    setTimeout(() => { searchBar.style.background = ''; }, 600);
  }
});


/* ============================================================
   11. FORM VALIDATION & SUBMISSION
============================================================ */
const validators = {
  fullName(v) {
    if (!v.trim()) return 'Please enter your full name.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
  },
  phone(v) {
    const c = v.replace(/\s/g, '');
    if (!c) return 'Please enter your phone number.';
    if (!/^(\+234|0)[789][01]\d{8}$/.test(c)) return 'Enter a valid Nigerian number (e.g. 080 0000 0000).';
    return null;
  },
  location(v) {
    if (!v.trim()) return 'Please enter your location.';
    if (v.trim().length < 5) return 'Please provide a more detailed address.';
    return null;
  },
  serviceType(v) {
    if (!v) return 'Please select a service type.';
    return null;
  },
};

function showErr(fieldId, msg) {
  const el  = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + 'Err');
  el?.classList.add('error');
  if (err) err.textContent = msg;
}
function clearErr(fieldId) {
  const el  = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + 'Err');
  el?.classList.remove('error');
  if (err) err.textContent = '';
}

// Live validation on blur
['fullName', 'phone', 'location', 'serviceType'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    clearErr(id);
    const msg = validators[id]?.(el.value);
    if (msg) showErr(id, msg);
  });
  el.addEventListener('input', () => {
    if (el.classList.contains('error')) {
      if (!validators[id]?.(el.value)) clearErr(id);
    }
  });
});

function validateAll() {
  let valid = true;
  ['fullName', 'phone', 'location', 'serviceType'].forEach(id => {
    clearErr(id);
    const el  = document.getElementById(id);
    const msg = validators[id]?.(el?.value || '');
    if (msg) { showErr(id, msg); valid = false; }
  });
  return valid;
}

// Build the WhatsApp dispatch message
function buildWAMessage(data) {
  const labels = {
    emergency: '🚨 Emergency Response',
    transfer:  '🏥 Hospital Transfer',
    event:     '🎪 Event Standby',
    other:     '❓ Other',
  };
  return encodeURIComponent(
    `🚑 *NEW DISPATCH REQUEST — E&E Medical*\n\n` +
    `👤 *Name:* ${data.fullName}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `📍 *Location:* ${data.location}\n` +
    `🏷 *Type:* ${labels[data.serviceType] || data.serviceType}\n` +
    `👥 *Patients:* ${data.patients}\n` +
    `📝 *Notes:* ${data.notes || 'None'}\n\n` +
    `_Sent via E&E Medical website_`
  );
}

if (dispatchForm) {
  dispatchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess?.classList.add('hidden');
    formError?.classList.add('hidden');

    if (!validateAll()) {
      const firstErr = dispatchForm.querySelector('.error');
      if (firstErr) {
        const top = firstErr.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    spinner?.classList.remove('hidden');

    try {
      await new Promise(r => setTimeout(r, 700));

      const data = {
        fullName:    document.getElementById('fullName').value.trim(),
        phone:       document.getElementById('phone').value.trim(),
        location:    document.getElementById('location').value.trim(),
        serviceType: document.getElementById('serviceType').value,
        patients:    document.getElementById('patients').value || '1',
        notes:       document.getElementById('notes').value.trim(),
      };

      // Open WhatsApp with pre-filled message
      const waNumber = '2347089674531'; // 
      window.open(`https://wa.me/${waNumber}?text=${buildWAMessage(data)}`, '_blank', 'noopener');

      formSuccess?.classList.remove('hidden');
      formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      dispatchForm.reset();

    } catch (err) {
      console.error(err);
      formError?.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Dispatch Request';
      spinner?.classList.add('hidden');
    }
  });
}


/* ============================================================
   12. PAGE INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();

  // Soft page fade-in
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

// faq section toggle
document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const isOpen = btn.getAttribute('aria-expanded') === 'true';

          // close all others
          document.querySelectorAll('.faq-question').forEach(other => {
            other.setAttribute('aria-expanded', 'false');
            other.nextElementSibling.classList.remove('open');
          });

          // toggle clicked
          if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            btn.nextElementSibling.classList.add('open');
          }
        });
      });


