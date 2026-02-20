/* ============================================
   BHUWAN SHAH — Portfolio Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Typewriter Effect ----
  const roles = [
    'Environmental Data Scientist',
    'Model Developer',
    'Watershed Scientist',
    'Open-Source Developer',
    'Geospatial Data Specialist'
  ];

  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typewrite() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // pause before next word
    }

    setTimeout(typewrite, typingSpeed);
  }

  typewrite();


  // ---- Navbar Scroll Behavior ----
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // Navbar background
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call


  // ---- Hamburger Menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMenu() {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    navOverlay.classList.toggle('show');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu when link clicked
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });


  // ---- Scroll Reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Back to Top ----
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Number Count-Up Animation ----
  const countUpElements = document.querySelectorAll('.count-up');

  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Parse securely by stripping everything except digits in case the user hardcoded "$45"
        const targetStr = el.getAttribute('data-target') || '0';
        const target = parseInt(targetStr.replace(/\D/g, ''), 10) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation
        let startTime = null;

        function animateCount(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const percentage = Math.min(progress / duration, 1);

          // Easing function to slow down at the end
          const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
          const currentCount = Math.floor(easeOut * target);

          el.textContent = `${prefix}${currentCount}${suffix}`;

          if (progress < duration) {
            window.requestAnimationFrame(animateCount);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        window.requestAnimationFrame(animateCount);
        // Stop observing once animated
        countUpObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -20px 0px'
  });

  countUpElements.forEach(el => countUpObserver.observe(el));

});


// ---- Publication Abstract Toggle ----
function toggleAbstract(pubId) {
  const card = document.getElementById(pubId);
  const btn = card.querySelector('.pub-toggle');
  card.classList.toggle('expanded');

  if (card.classList.contains('expanded')) {
    btn.innerHTML = 'Hide abstract <span>↑</span>';
  } else {
    btn.innerHTML = 'Show abstract <span>→</span>';
  }
}

// ---- Talk Modal Logic ----
window.openTalkModal = function (btn, type) {
  const card = btn.closest('.conf-card');
  const title = card.querySelector('h3').textContent;
  const dataNode = card.querySelector('.conf-data');

  const modal = document.getElementById('talkModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal) return;

  modalTitle.textContent = title;

  if (type === 'abstract') {
    const abstractText = dataNode && dataNode.querySelector('.talk-abstract') ? dataNode.querySelector('.talk-abstract').innerHTML : 'Abstract coming soon...';
    modalBody.innerHTML = `<p>${abstractText}</p>`;
  } else if (type === 'poster') {
    const posterSrc = dataNode && dataNode.querySelector('.talk-poster') ? dataNode.querySelector('.talk-poster').textContent.trim() : '';
    if (posterSrc) {
      modalBody.innerHTML = `<img src="${posterSrc}" alt="Poster" style="width: 100%; height: auto; border-radius: 8px;">`;
    } else {
      modalBody.innerHTML = `<p>Poster coming soon...</p>`;
    }
  }

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('talkModal');
  if (modal) {
    const modalClose = modal.querySelector('.modal-close');

    modalClose.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }
});
