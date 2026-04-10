  /* ── SCROLL REVEAL ── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* ── SMOOTH NAV ── */
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      nav.classList.remove('open');
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100; // adjust for header height
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // initial call

  /* ── HAMBURGER MENU ── */
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      hamburger.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });

  /* ── EXPANDABLE NOTES ── */
  document.querySelectorAll('.notes-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const body   = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!isOpen));
      body.classList.toggle('open', !isOpen);
    });
  });

  /* ── IMAGE MODAL ── */
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  const modalCap = document.getElementById('modalCaption');
  const modalWrap = document.getElementById('modalWrap');

  function openModal(src, caption) {
    modalImg.src = src;
    modalCap.textContent = caption || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // clear src after transition so there's no flash on next open
    setTimeout(() => { modalImg.src = ''; }, 300);
  }

  // Open from .img-card
  document.querySelectorAll('.img-card').forEach(card => {
    const trigger = () => {
      const src     = card.dataset.src || card.querySelector('img')?.src;
      const caption = card.dataset.caption || '';
      if (src) openModal(src, caption);
    };
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  // Close: backdrop click (not on image wrap), close button, ESC
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  document.querySelectorAll(".project-preview").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".project-card");
    const details = card.querySelector(".project-details");

    const isOpen = btn.getAttribute("aria-expanded") === "true";

    btn.setAttribute("aria-expanded", !isOpen);
    details.style.maxHeight = isOpen ? null : details.scrollHeight + "px";
  });
});