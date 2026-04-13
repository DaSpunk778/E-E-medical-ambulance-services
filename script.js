const typed = new Typed('.multiple-text', {
    strings: ['Large events', 'Medical Emergencies', 'Patient Transfers', 'we gat you covered!'],
    typeSpeed: 50,
    backSpeed: 80,
    backDelay: 900,
    loop: true
});

// Mobile nav toggle
 const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const icon = document.getElementById('hamburger-icon');

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    // swap between bars and X icon
    if (mobileNav.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // close nav when a link is clicked
  mobileNav.querySelectorAll('.header-menu-item').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });

  // close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });
