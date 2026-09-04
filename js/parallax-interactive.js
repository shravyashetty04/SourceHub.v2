/**
 * SOURCEHUB.IN - PARALLAX & INTERACTIVE SECTIONS CONTROLLER
 * High-performance, GPU-accelerated scroll parallax and card 3D micro-interactions.
 * Preserves 100% content stability and responsive layout.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initScrollParallax();
  initCard3DTilt();
  initProblemSolutionHoverSync();
  initStoreFormatFilters();
  initGreenFleetCalculator();
  initScrollRevealObserver();
});

/* --------------------------------------------------------------------------
   1. HIGH-PERFORMANCE SCROLL-DRIVEN PARALLAX
   -------------------------------------------------------------------------- */
function initScrollParallax() {
  // Check if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
  if (!parallaxElements.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach(el => {
      const parent = el.closest('.parallax-section') || el.parentElement;
      const rect = parent.getBoundingClientRect();

      // Only update when section is near viewport
      if (rect.top < windowHeight + 100 && rect.bottom > -100) {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
        // Calculate offset centered around middle of viewport
        const centerDistance = rect.top + (rect.height / 2) - (windowHeight / 2);
        const yOffset = Math.round(centerDistance * speed);

        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateParallax();
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE 3D CARD PHYSICS & DYNAMIC CURSOR SPOTLIGHT
   -------------------------------------------------------------------------- */
function initCard3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Select interactive cards across all sections
  const cards = document.querySelectorAll('.interactive-card-3d, .identity-card, .comparison-card, .store-format-card, .pricing-card, .ev-fleet-card, .hub-detail-card');

  cards.forEach(card => {
    // Add base class if missing
    card.classList.add('interactive-card-3d');

    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update cursor spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        // Calculate gentle tilt (max 4.5 degrees to keep text completely stable)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (((y - centerY) / centerY) * -4.5).toFixed(2);
        const rotateY = (((x - centerX) / centerX) * 4.5).toFixed(2);

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   3. PROBLEM VS. SOLUTION SYNCHRONIZED INTERACTIVE HOVER
   -------------------------------------------------------------------------- */
function initProblemSolutionHoverSync() {
  const compItems = document.querySelectorAll('.comparison-item[data-compare-pair]');
  const vsBadge = document.querySelector('.comparison-vs-badge') || document.querySelector('.comparison-vs-center');

  compItems.forEach(item => {
    const pairId = item.getAttribute('data-compare-pair');

    item.addEventListener('mouseenter', () => {
      // Highlight matching counterpart
      const matched = document.querySelectorAll(`.comparison-item[data-compare-pair="${pairId}"]`);
      matched.forEach(el => el.classList.add('is-active-pair'));

      if (vsBadge) {
        vsBadge.classList.add('active-pulse');
      }
    });

    item.addEventListener('mouseleave', () => {
      const matched = document.querySelectorAll(`.comparison-item[data-compare-pair="${pairId}"]`);
      matched.forEach(el => el.classList.remove('is-active-pair'));

      if (vsBadge) {
        vsBadge.classList.remove('active-pulse');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. STORE FORMATS INTERACTIVE FILTER TABS
   -------------------------------------------------------------------------- */
function initStoreFormatFilters() {
  const filterBtns = document.querySelectorAll('.format-filter-btn');
  const formatCards = document.querySelectorAll('.store-format-card');

  if (!filterBtns.length || !formatCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      formatCards.forEach(card => {
        const category = card.getAttribute('data-category') || 'all';

        if (filter === 'all' || category === filter) {
          card.classList.remove('dimmed');
          card.classList.add('highlighted');
          setTimeout(() => card.classList.remove('highlighted'), 500);
        } else {
          card.classList.add('dimmed');
          card.classList.remove('highlighted');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE GREEN FLEET SAVINGS CALCULATOR (EV LOGISTICS)
   -------------------------------------------------------------------------- */
function initGreenFleetCalculator() {
  const slider = document.getElementById('ev-km-range');
  const kmDisplay = document.getElementById('ev-km-value');
  const fuelCostDisplay = document.getElementById('ev-fuel-cost-val');
  const savingsDisplay = document.getElementById('ev-savings-val');
  const carbonDisplay = document.getElementById('ev-co2-val');

  if (!slider) return;

  function recalculate() {
    const dailyKm = parseInt(slider.value, 10);
    const monthlyKm = dailyKm * 28; // standard 28 working days in retail month

    // Average light commercial diesel vehicle consumes 1 liter per 11 km
    // Diesel price ~₹92 / Liter + ₹2.5/km maintenance & lubricant overhead
    const fuelCostPerKm = (92 / 11) + 2.5; // ~₹10.86 per km
    const traditionalMonthlyCost = Math.round(monthlyKm * fuelCostPerKm);

    // SourceHub 100% EV Zero-Emission Fleet provides 100% free delivery on orders > ₹3,000
    // Net saved by retailer per month:
    const netSavings = traditionalMonthlyCost;

    // CO2 emission factor for light diesel vehicles ~168g CO2 / km
    const co2SavedKg = Math.round((monthlyKm * 0.168));

    if (kmDisplay) kmDisplay.textContent = `${dailyKm} km / day`;
    if (fuelCostDisplay) fuelCostDisplay.textContent = `₹${traditionalMonthlyCost.toLocaleString('en-IN')}`;
    if (savingsDisplay) savingsDisplay.textContent = `₹${netSavings.toLocaleString('en-IN')}`;
    if (carbonDisplay) carbonDisplay.textContent = `${co2SavedKg.toLocaleString('en-IN')} kg`;
  }

  slider.addEventListener('input', recalculate);
  // Initial calculate
  recalculate();
}

/* --------------------------------------------------------------------------
   6. LUXURIOUS SCROLL REVEAL & STAGGER ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollRevealObserver() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll, .reveal-scale').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // 1. Automatically register all section headers and core content elements
  const targetSelectors = [
    // Section Header Intro Blocks
    '#platform .container > div:first-child',
    '#problem-solution .container > div:first-child',
    '#spo-pricing .container > div:first-child',
    '#store-formats .container > div:first-child',
    '#dashboards .container > div:first-child',
    '#ev-logistics .container > .ev-showcase-grid > div:first-child h2',
    '#ev-logistics .container > .ev-showcase-grid > div:first-child p',
    '#expansion .container > div:first-child',
    
    // Cards, Grids & Interactive Components
    '#platform .identity-card',
    '#problem-solution .problem-card',
    '#problem-solution .comparison-vs-center',
    '#problem-solution .solution-card',
    '#problem-solution .highlight-bar-item',
    '#spo-pricing .pricing-controls-card',
    '#spo-pricing .pricing-result-card',
    '#store-formats .format-filter-bar',
    '#store-formats .store-format-card',
    '#dashboards .dashboard-role-tabs',
    '#dashboards .dashboard-preview-window',
    '#ev-logistics .ev-stat-box',
    '#ev-logistics .ev-image-holder',
    '#ev-logistics .ev-calc-card',
    '#expansion .interactive-map-card',
    '#expansion .hub-details-card',
    '.cta-banner-card'
  ];

  targetSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('reveal-on-scroll') && !el.classList.contains('reveal-scale')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  // 2. Set dynamic stagger delays on siblings within grids for wave cascade effect
  const staggeredGroups = [
    { selector: '#platform .identity-grid', delay: 0.1 },
    { selector: '#problem-solution .comparison-container', delay: 0.15 },
    { selector: '#problem-solution .comparison-highlights-bar', delay: 0.08 },
    { selector: '#store-formats .store-formats-grid', delay: 0.1 },
    { selector: '#ev-logistics .ev-stat-grid', delay: 0.08 },
    { selector: '#spo-pricing .pricing-engine-wrapper', delay: 0.14 },
    { selector: '#expansion .map-section-wrapper', delay: 0.14 }
  ];

  staggeredGroups.forEach(({ selector, delay }) => {
    const group = document.querySelector(selector);
    if (group) {
      Array.from(group.children).forEach((child, idx) => {
        child.style.transitionDelay = `${(idx * delay).toFixed(2)}s`;
      });
    }
  });

  // 3. IntersectionObserver with smooth threshold and root margin
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. HERO BACKGROUND VIDEO CONTROLLER
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById('hero-bg-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  const startPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If browser policies temporarily restrict autoplay, play on first user interaction
        const triggerPlay = () => {
          video.play();
          window.removeEventListener('touchstart', triggerPlay);
          window.removeEventListener('click', triggerPlay);
          window.removeEventListener('scroll', triggerPlay);
        };
        window.addEventListener('touchstart', triggerPlay, { once: true, passive: true });
        window.addEventListener('click', triggerPlay, { once: true });
        window.addEventListener('scroll', triggerPlay, { once: true, passive: true });
      });
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startPlay();
  } else {
    window.addEventListener('load', startPlay);
  }
}
