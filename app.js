document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initThemeToggle();
  initLangToggle();
  initActiveNavLinkOnScroll();
  initScrollReveals();
  initCaseStudyExpanders();
  initAstWorkflow();
  initOlderTimelineToggle();
  initHamburgerMenu();
  initResumeDownloadLinks();
});

/**
 * Theme Toggle Functionality
 * Persists user preference in localStorage and handles OS settings changes
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const htmlEl = document.documentElement;

  if (!toggleBtn) return;

  // Toggle theme on button click
  toggleBtn.addEventListener("click", () => {
    const currentTheme = htmlEl.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlEl.setAttribute("data-theme", newTheme);
    localStorage.setItem("color-scheme", newTheme);
  });
}

/**
 * Language Toggle Functionality
 * Manages 'en' vs 'fr' state, updates SEO metadata, and notifies dynamic components
 */
function initLangToggle() {
  const langButtons = document.querySelectorAll(".lang-btn");
  const htmlEl = document.documentElement;

  if (langButtons.length === 0) return;

  const storedLang = document.documentElement.getAttribute('lang') || 'en';
  setLanguage(storedLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      setLanguage(selectedLang);
    });
  });

  function setLanguage(lang) {
    htmlEl.setAttribute("lang", lang);
    localStorage.setItem("portfolio-lang", lang);

    // Update active class state on toggle buttons
    langButtons.forEach((b) => {
      if (b.getAttribute("data-lang") === lang) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    // Update SEO meta descriptions and page title
    updateSeoMeta(lang);

    // Trigger update of dynamic content (like AST text)
    document.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
  }

  function updateSeoMeta(lang) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (lang === "fr") {
      document.title = "François Ohl — Senior UX & Product Designer";
      if (metaDescription) {
        metaDescription.setAttribute("content", "Portfolio de François Ohl, Senior UX/Product Designer spécialisé dans l'architecture de l'information et le design system.");
      }
    } else {
      document.title = "François Ohl — Senior UX & Product Designer";
      if (metaDescription) {
        metaDescription.setAttribute("content", "Portfolio of François Ohl, Senior UX/Product Designer focusing on information architecture, complex systems, and design system scaling.");
      }
    }
  }
}

/**
 * Active Navigation Link Highlighter
 * Highlights the current page section in the header based on scroll position
 */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -50% 0px", // Trigger when section is in the middle of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Minimal Scroll Reveal
 * Fades in page sections gracefully as they enter the screen, avoiding "wordpress template vibes"
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll("[data-js-reveal]");

  if (revealElements.length === 0) return;

  // Respect prefers-reduced-motion media query
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px", // Trigger slightly before element enters view
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Interactive 2D Risk vs Frequency Quadrant Matrix
 * Demonstrates intentional friction and usability trade-offs across 4 real clinical scenarios
 */
function initAstWorkflow() {
  const cells = document.querySelectorAll(".quadrant-cell");
  const stepTitle = document.getElementById("step-title");
  const stepText = document.getElementById("step-text");

  if (cells.length === 0 || !stepTitle || !stepText) return;

  const quadrantData = {
    en: {
      1: {
        title: "Rare Phenotype Detection",
        text: "Safety-critical & rare event: Triggering a hard visual interrupt and requiring explicit confirmation with contextual guidance to prevent misdiagnosing critical bacterial resistance."
      },
      2: {
        title: "Antibiotic Validation",
        text: "Safety-critical & daily routine: Semi-automated verification flow requiring manual confirmation of drug names and measured inhibition diameters to prevent blind automatic rubber-stamping."
      },
      3: {
        title: "Patient & Sample Metadata",
        text: "Low clinical risk & punctual entry: Flexible, non-blocking input for optional fields (Sample ID, Date & Time of collection, Ward, Age, Sex), ensuring routine workflow is never stalled during emergencies."
      },
      4: {
        title: "Quality Control (QC)",
        text: "Low clinical risk & frequent routine (daily/weekly): Streamlined interaction steps on repetitive calibration tasks to prevent cognitive fatigue while preserving mandatory regulatory traceability."
      }
    },
    fr: {
      1: {
        title: "Détection d'un phénotype rare",
        text: "Risque critique & événement rare : déclenchement d'une alerte visuelle bloquante avec confirmation explicite requise et rappel pédagogique pour prévenir toute erreur de diagnostic vital."
      },
      2: {
        title: "Validation des antibiotiques",
        text: "Risque critique & routine quotidienne : processus semi-automatisé imposant la confirmation manuelle des noms de disques et diamètres pour empêcher l'acceptation automatique et aveugle des propositions."
      },
      3: {
        title: "Métadonnées du patient et de l'échantillon",
        text: "Risque faible & saisie ponctuelle : saisie fluide et non contraignante pour les informations optionnelles (identifiant de l'échantillon, date/heure de prélèvement, service d'hospitalisation, âge et sexe du patient), évitant tout blocage du flux lors des urgences."
      },
      4: {
        title: "Contrôle Qualité (CQ)",
        text: "Risque faible & routine fréquente (quotidienne ou hebdo) : allègement mesuré des interactions sur une tâche récurrente de calibrage pour réduire la fatigue cognitive tout en garantissant la traçabilité."
      }
    }
  };

  function updateQuadrantText() {
    const activeCell = document.querySelector(".quadrant-cell.active");
    if (!activeCell) return;

    const zoneIndex = activeCell.getAttribute("data-zone");
    const lang = document.documentElement.getAttribute("lang") || "en";

    if (quadrantData[lang] && quadrantData[lang][zoneIndex]) {
      stepTitle.textContent = quadrantData[lang][zoneIndex].title;
      stepText.textContent = quadrantData[lang][zoneIndex].text;
    }
  }

  // Listen for language changes
  document.addEventListener('lang-changed', updateQuadrantText);

  // Initial sync
  updateQuadrantText();

  // Click & keyboard handlers for quadrant cells
  cells.forEach((cell) => {
    function selectCell() {
      cells.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      cell.classList.add("active");
      cell.setAttribute("aria-pressed", "true");
      updateQuadrantText();
    }

    cell.addEventListener("click", selectCell);
    cell.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCell();
      }
    });
  });
}


/**
 * Older Timeline Toggle
 * Expands or collapses the older communications and web design experiences
 */
function initOlderTimelineToggle() {
  const toggleBtn = document.getElementById("toggle-older-btn");
  const olderTimeline = document.getElementById("older-timeline");

  if (!toggleBtn || !olderTimeline) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      olderTimeline.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('expanded');
    } else {
      olderTimeline.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('expanded');
    }
  });
}

/**
 * Hamburger Menu
 * Toggles the mobile navigation menu open/close state
 */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Resume Download Links
 * Prevents scroll-to-top jump when placeholder href="#" is clicked
 */
function initResumeDownloadLinks() {
  const downloadLinks = document.querySelectorAll(".js-download-cv");
  downloadLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
      }
    });
  });
}

/**
 * Expandable Case Study Cards
 * Handles independent progressive disclosure for featured project cards
 */
function initCaseStudyExpanders() {
  const cards = document.querySelectorAll('.case-study-card');
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const mainToggleBtn = card.querySelector('.case-toggle-bar .btn-toggle-case');
    const collapsible = card.querySelector('.case-study-collapsible');
    const bottomToggleBtn = card.querySelector('.case-bottom-collapse .btn-toggle-case');

    if (!mainToggleBtn || !collapsible) return;

    function setExpanded(expand) {
      mainToggleBtn.setAttribute('aria-expanded', String(expand));
      if (expand) {
        collapsible.removeAttribute('hidden');
      } else {
        collapsible.setAttribute('hidden', '');
      }
    }

    mainToggleBtn.addEventListener('click', () => {
      const isCurrentlyExpanded = mainToggleBtn.getAttribute('aria-expanded') === 'true';
      setExpanded(!isCurrentlyExpanded);
    });

    if (bottomToggleBtn) {
      bottomToggleBtn.addEventListener('click', () => {
        setExpanded(false);
        // Smoothly scroll back to the card header with comfortable offset
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}

