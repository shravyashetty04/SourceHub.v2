/**
 * SOURCEHUB.IN - CORE APPLICATION LOGIC, MODALS & ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initModals();
  initCarbonTicker();
  initPartnerOnboardingForm();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT & SPY
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-links');
  
  if (mobileBtn && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('mobile-open');
      mobileBtn.classList.remove('is-active');
      mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileBtn.classList.toggle('is-active', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking nav links
    const links = navMenu.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close when tapping outside the menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && e.target !== mobileBtn) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        closeMenu();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. MODAL CONTROLLERS
   -------------------------------------------------------------------------- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close-btn, .modal-backdrop-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on outside click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. CARBON SAVINGS LIVE TICKER
   -------------------------------------------------------------------------- */
function initCarbonTicker() {
  const carbonEl = document.getElementById('carbon-saved-counter');
  if (!carbonEl) return;

  let baseKg = 14850;
  setInterval(() => {
    baseKg += Math.floor(Math.random() * 3) + 1;
    carbonEl.textContent = `${baseKg.toLocaleString('en-IN')} kg`;
  }, 2500);
}

/* --------------------------------------------------------------------------
   5. PARTNER REGISTRATION MULTI-STEP WORKFLOW
   -------------------------------------------------------------------------- */
function initPartnerOnboardingForm() {
  const form = document.getElementById('partner-onboarding-form');
  const step1 = document.getElementById('onboard-step-1');
  const step2 = document.getElementById('onboard-step-2');
  const step3 = document.getElementById('onboard-step-3');
  const nextBtn1 = document.getElementById('btn-step-1-next');
  const nextBtn2 = document.getElementById('btn-step-2-next');
  const qualificationBadge = document.getElementById('qual-tier-badge');
  const marginEstBadge = document.getElementById('qual-margin-est');

  if (nextBtn1) {
    nextBtn1.addEventListener('click', () => {
      const storeName = document.getElementById('input-store-name').value;
      const location = document.getElementById('input-store-city').value;
      if (!storeName || !location) {
        alert('Please enter your Store Name and City.');
        return;
      }
      step1.style.display = 'none';
      step2.style.display = 'block';
    });
  }

  if (nextBtn2) {
    nextBtn2.addEventListener('click', () => {
      const turnover = document.getElementById('input-monthly-turnover').value;
      step2.style.display = 'none';
      step3.style.display = 'block';

      if (turnover === 'tier3') {
        if (qualificationBadge) qualificationBadge.textContent = 'PLATINUM TIER QUALIFIED (22% Avg Margin)';
        if (marginEstBadge) marginEstBadge.textContent = 'Estimated Monthly Profit Boost: ₹48,000 - ₹85,000+';
      } else if (turnover === 'tier2') {
        if (qualificationBadge) qualificationBadge.textContent = 'GOLD TIER QUALIFIED (14% Avg Margin)';
        if (marginEstBadge) marginEstBadge.textContent = 'Estimated Monthly Profit Boost: ₹24,000 - ₹45,000';
      } else {
        if (qualificationBadge) qualificationBadge.textContent = 'SILVER TIER QUALIFIED (8% Avg Margin)';
        if (marginEstBadge) marginEstBadge.textContent = 'Estimated Monthly Profit Boost: ₹12,000 - ₹20,000';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Congratulations! Your Retail Partner verification request is received. A SourceHub Territory Manager will reach out within 2 hours with your onboarding kit.');
      const modal = document.getElementById('partner-modal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      form.reset();
      step1.style.display = 'block';
      step2.style.display = 'none';
      step3.style.display = 'none';
    });
  }
}
