document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initSkipLink();
  initLangToggle();
  initActiveNavLinkOnScroll();
  initScrollReveals();
  AppRouter.init();
  initAstWorkflow();
  initCaseTabs();
  initOlderTimelineToggle();
  initHamburgerMenu();
  initResumeDownloadLinks();
});

/**
 * Skip Link Keyboard Navigation
 * Moves focus and scrolls to the main content landmark without triggering hash routing
 */
function initSkipLink() {
  const skipLink = document.querySelector(".skip-link");
  const mainEl = document.getElementById("main-content");
  if (!skipLink || !mainEl) return;

  skipLink.addEventListener("click", (e) => {
    e.preventDefault();
    mainEl.focus();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mainEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

/**
 * Centralized Document Title & SEO Manager
 * Synchronizes title and meta description based on both language and active route view
 */
function updateDocumentTitleAndSeo(lang, routeHash) {
  const currentLang = lang || document.documentElement.getAttribute("lang") || "en";
  const rawHash = (routeHash !== undefined ? routeHash : (window.location.hash || "")).toLowerCase();
  const metaDescription = document.querySelector('meta[name="description"]');

  if (rawHash === "#antibiogo") {
    document.title = currentLang === "fr"
      ? "Antibiogo — François Ohl"
      : "Antibiogo — François Ohl";
  } else if (rawHash === "#origami") {
    document.title = currentLang === "fr"
      ? "Origami Design System — François Ohl"
      : "Origami Design System — François Ohl";
  } else {
    document.title = currentLang === "fr"
      ? "François Ohl — Senior UX & Product Designer"
      : "François Ohl — Senior UX & Product Designer";
  }

  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      currentLang === "fr"
        ? "Portfolio de François Ohl, Senior UX/Product Designer spécialisé dans l'architecture de l'information et le design system."
        : "Portfolio of François Ohl, Senior UX/Product Designer focusing on information architecture, complex systems, and design system scaling."
    );
  }
}

/**
 * Language Toggle Functionality
 * Manages 'en' vs 'fr' state, updates SEO metadata, and notifies dynamic components
 */
function initLangToggle() {
  const langButtons = document.querySelectorAll(".lang-btn");
  const htmlEl = document.documentElement;

  if (langButtons.length === 0) return;

  const storedLang = document.documentElement.getAttribute("lang") || "en";
  setLanguage(storedLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      setLanguage(selectedLang);
    });
  });

  function setLanguage(lang) {
    htmlEl.setAttribute("lang", lang);
    try {
      localStorage.setItem("portfolio-lang", lang);
    } catch (e) {
      // LocalStorage non disponible ou restreint
    }

    // Update active class state and aria-pressed on toggle buttons
    langButtons.forEach((b) => {
      const isActive = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    // Update SEO meta descriptions and page title
    updateDocumentTitleAndSeo(lang, window.location.hash);

    // Trigger update of dynamic content (like AST text)
    document.dispatchEvent(new CustomEvent("lang-changed", { detail: { lang } }));
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
  const stepImages = document.getElementById("step-images");

  if (cells.length === 0 || !stepTitle || !stepText) return;

  const quadrantImages = {
    1: [
      {
        src: "assets/antibiogo/matrix 1 - synergy.jpg",
        alt: {
          en: "Antibiogo app interface showing rare phenotype synergy detection alert",
          fr: "Interface Antibiogo affichant l'alerte de détection de synergie pour un phénotype rare"
        }
      },
      {
        src: "assets/antibiogo/matrix 1b.jpg",
        alt: {
          en: "Antibiogo app interface showing rare phenotype synergy detection alert",
          fr: "Interface Antibiogo affichant l'alerte de détection de synergie pour un phénotype rare"
        }
      }
    ],
    2: [
      {
        src: "assets/antibiogo/matrix 2a - antibiotic confirm.jpg",
        alt: {
          en: "Antibiogo app interface with antibiotic confirmation dialog",
          fr: "Interface Antibiogo avec dialogue de confirmation de l'antibiotique"
        }
      },
      {
        src: "assets/antibiogo/matrix 2b - IZD confirm.jpg",
        alt: {
          en: "Antibiogo app interface confirming inhibition zone diameter",
          fr: "Interface Antibiogo confirmant la mesure du diamètre de zone d'inhibition"
        }
      }
    ],
    3: [
      {
        src: "assets/antibiogo/matrix 3 - metadata.jpg",
        alt: {
          en: "Antibiogo app interface for patient and sample metadata input",
          fr: "Interface Antibiogo pour la saisie des métadonnées du patient et de l'échantillon"
        }
      }
    ],
    4: []
  };

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
        text: "Flexible, non-blocking input for optional fields (age, ward, sample ID), streamlining the workflow by eliminating unnecessary administrative friction."
      },
      4: {
        title: "Quality Control (QC)",
        text: "Streamlined interaction steps on repetitive validation tasks to prevent cognitive fatigue while preserving mandatory regulatory traceability."
      }
    },
    fr: {
      1: {
        title: "Détection d'un phénotype rare",
        text: "Risque critique & événement rare : déclenchement d'une alerte visuelle bloquante avec confirmation explicite requise et rappel pédagogique pour prévenir toute erreur critique de diagnostic face à une antibiorésistance majeure."
      },
      2: {
        title: "Validation des antibiotiques",
        text: "Risque critique & routine quotidienne : processus semi-automatisé imposant la confirmation manuelle des noms de disques et diamètres pour empêcher l'acceptation automatique et aveugle des propositions."
      },
      3: {
        title: "Métadonnées du patient et de l'échantillon",
        text: "Saisie fluide et non bloquante des informations optionnelles (âge, service, identifiant), permettant de se concentrer sur l'analyse sans imposer d'étapes superflues."
      },
      4: {
        title: "Contrôle Qualité (CQ)",
        text: "Allègement mesuré des interactions sur une tâche récurrente de validation pour réduire la fatigue cognitive tout en garantissant la traçabilité."
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

    if (stepImages) {
      stepImages.innerHTML = "";
      const images = quadrantImages[zoneIndex] || [];
      if (images.length > 0) {
        stepImages.style.display = "flex";
        images.forEach((imgData) => {
          const img = document.createElement("img");
          img.src = imgData.src;
          img.alt = (imgData.alt && imgData.alt[lang]) ? imgData.alt[lang] : "";
          img.className = "case-img case-img--phone";
          img.loading = "lazy";
          stepImages.appendChild(img);
        });
      } else {
        stepImages.style.display = "none";
      }
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
 * Case Study Deep Dives Disclosure Navigation
 * Supports exclusive accordion behavior (clicking active card closes it, starts closed by default)
 */
function initCaseTabs() {
  const disclosureButtons = document.querySelectorAll(".teaser-btn");
  const tabPanels = document.querySelectorAll(".case-tab-panel");

  if (disclosureButtons.length === 0 || tabPanels.length === 0) return;

  disclosureButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPanelId = btn.getAttribute("aria-controls");
      const targetPanel = document.getElementById(targetPanelId);
      const card = btn.closest(".case-teaser-card");
      const isCurrentlyExpanded = btn.getAttribute("aria-expanded") === "true";

      if (isCurrentlyExpanded) {
        // Toggle OFF: collapse the panel
        btn.setAttribute("aria-expanded", "false");
        btn.classList.remove("active");
        if (card) card.classList.remove("is-active", "active");
        if (targetPanel) {
          targetPanel.setAttribute("hidden", "");
        }
      } else {
        // Switch / Open: close any other open disclosures
        disclosureButtons.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.classList.remove("active");
          const c = b.closest(".case-teaser-card");
          if (c) c.classList.remove("is-active", "active");
        });
        tabPanels.forEach((p) => {
          p.setAttribute("hidden", "");
        });

        // Activate clicked disclosure
        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("active");
        if (card) card.classList.add("is-active", "active");
        if (targetPanel) {
          targetPanel.removeAttribute("hidden");
          const rect = targetPanel.getBoundingClientRect();
          const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (rect.top > window.innerHeight * 0.75) {
            targetPanel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
          }
        }
      }
    });
  });

  // Delegate click on teaser card to the disclosure button if clicked outside the button
  const teaserCards = document.querySelectorAll(".case-teaser-card");
  teaserCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".teaser-btn")) {
        const btn = card.querySelector(".teaser-btn");
        if (btn) btn.click();
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
 * Toggles the mobile navigation menu open/close state with Escape key support
 */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburgerBtn || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key and restore focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      hamburgerBtn.focus();
    }
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
 * Lightweight Vanilla JS Hash Router
 * Handles 1-level drill-down navigation (#antibiogo, #origami) and returns to #home-view (#work)
 * Supports browser Back/Forward natively with history scroll restoration and accessible focus management
 */
const AppRouter = {
  previousScrollY: 0,
  hasInternalNavigation: false,
  lastActiveLink: null,
  routes: {
    '#antibiogo': 'project-view-antibiogo',
    '#origami': 'project-view-origami'
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      const backTrigger = e.target.closest('[data-route-back]');
      if (backTrigger) {
        e.preventDefault();
        this.navigateBack();
        return;
      }

      // Check if user clicked a link navigating to an internal case study
      const caseLink = e.target.closest('a[href="#antibiogo"], a[href="#origami"]');
      if (caseLink) {
        this.hasInternalNavigation = true;
        this.lastActiveLink = caseLink;
      }
    });

    this.handleRoute(true);
  },

  navigateBack() {
    if (this.hasInternalNavigation && window.history.length > 1) {
      window.history.back();
    } else {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '#work');
        this.handleRoute();
      } else {
        window.location.hash = '#work';
      }
    }
  },

  handleRoute(isInitial = false) {
    const rawHash = (window.location.hash || '').toLowerCase();
    const homeView = document.getElementById('home-view');
    const projectViews = document.querySelectorAll('.case-study-view');

    if (!homeView) return;

    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const targetProjectViewId = this.routes[rawHash];
    document.body.classList.toggle('is-project-view', Boolean(targetProjectViewId));

    if (targetProjectViewId) {
      const targetView = document.getElementById(targetProjectViewId);
      if (!targetView) return;

      // Update document title for project view
      updateDocumentTitleAndSeo(currentLang, rawHash);

      // Save scroll position only if coming from the visible home view
      if (!homeView.hasAttribute('hidden')) {
        this.previousScrollY = window.scrollY;
      }

      homeView.setAttribute('hidden', '');
      projectViews.forEach((v) => {
        if (v === targetView) {
          v.removeAttribute('hidden');
        } else {
          v.setAttribute('hidden', '');
        }
      });

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: (isInitial || prefersReducedMotion) ? 'instant' : 'smooth' });

      // Move accessible focus to the case study h1
      const heading = targetView.querySelector('.case-header h1, h1');
      if (heading) {
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    } else {
      // Restore home view title
      updateDocumentTitleAndSeo(currentLang, '');

      const wasInsideCase = Array.from(projectViews).some((v) => !v.hasAttribute('hidden'));

      projectViews.forEach((v) => v.setAttribute('hidden', ''));
      homeView.removeAttribute('hidden');

      if (wasInsideCase) {
        if (rawHash === '#work' || rawHash === '') {
          if (this.previousScrollY > 0) {
            window.scrollTo({ top: this.previousScrollY, behavior: 'instant' });
          } else {
            const workSec = document.getElementById('work');
            if (workSec) workSec.scrollIntoView({ behavior: 'instant' });
          }
        }

        // Restore focus to the link that triggered the case study view
        if (this.lastActiveLink && typeof this.lastActiveLink.focus === 'function') {
          this.lastActiveLink.focus();
          this.lastActiveLink = null;
        }
      }

      if (rawHash && rawHash !== '#work' && !this.routes[rawHash]) {
        const targetElement = document.querySelector(rawHash);
        if (targetElement) {
          const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          targetElement.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      }
    }
  }
};


