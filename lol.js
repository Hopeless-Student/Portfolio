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
      mainNav.classList.remove('open');
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  function setActiveLink() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If near the bottom of the page, force-activate the last nav link
      if (scrollY + windowHeight >= docHeight - 10) {
        navLinks.forEach(link => link.classList.remove("active"));
        navLinks[navLinks.length - 1].classList.add("active");
        return;
      }

      let current = "";

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 220; // offset for sticky header
        if (scrollY >= sectionTop) {
          current = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
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

/* ── CLICKABLE PROJECT CARDS ── */
document.querySelectorAll('.project-card').forEach(card => {
  const url = card.dataset.url;
  if (!url) return;

  card.style.cursor = 'pointer';

  card.addEventListener('click', e => {
    // Ignore clicks on the image, details/summary, and stack items
    if (e.target.closest('.img-card, details, summary, .project-stack')) return;
    window.open(url, '_blank');
  });
});

/* ── CERTIFICATIONS CAROUSEL ── */
(function () {
  const track       = document.querySelector('.cert-track');
  const container   = document.querySelector('.cert-track-container');
  const cards       = document.querySelectorAll('.cert-card');
  const dotsWrapper = document.querySelector('.cert-dots');
  const btnLeft     = document.querySelector('.cert-arrow-left');
  const btnRight    = document.querySelector('.cert-arrow-right');

  if (!track || cards.length === 0) return;

  // How many cards are visible at once (matches CSS flex-basis)
  const visibleCount = () => window.innerWidth <= 600 ? 1 : 2;
  let current = 0;
  let autoTimer;

  // Build dots
  const totalSteps = () => Math.ceil(cards.length / visibleCount());

  function buildDots() {
    dotsWrapper.innerHTML = '';
    for (let i = 0; i < totalSteps(); i++) {
      const dot = document.createElement('button');
      dot.className = 'cert-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrapper.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.cert-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function updateArrows() {
    btnLeft.disabled  = current === 0;
    btnRight.disabled = current >= totalSteps() - 1;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalSteps() - 1));

    // Card width + gap
    const cardWidth = cards[0].offsetWidth + 16;
    track.style.transform = `translateX(-${current * visibleCount() * cardWidth}px)`;

    updateDots();
    updateArrows();
  }

  function next() { if (current < totalSteps() - 1) goTo(current + 1); else goTo(0); }
  function prev() { goTo(current - 1); }

  btnLeft.addEventListener('click',  () => { resetTimer(); prev(); });
  btnRight.addEventListener('click', () => { resetTimer(); next(); });

  // Auto-slide
  function startTimer() { autoTimer = setInterval(next, 3500); }
  function resetTimer()  { clearInterval(autoTimer); startTimer(); }

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(autoTimer));
  container.addEventListener('mouseleave', startTimer);

  // Rebuild on resize
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  updateArrows();
  startTimer();
})();

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const response = await fetch("https://formspree.io/f/meepbdzv", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    showToast("Message sent successfully!");
    form.reset();
  } else {
    showToast("Failed to send message. Try again.", "error");
  }
});

const toast = document.getElementById("toast");

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}