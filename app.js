document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initSkipLink();
  initActiveNavLinkOnScroll();
  initScrollReveals();
  AppRouter.init();
  initAstWorkflow();
  initCaseTabs();
  initOlderTimelineToggle();
  initHamburgerMenu();
  initResumeDownloadLinks();
  initMediaScrollHints();
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
  const currentLang = lang || document.documentElement.getAttribute("lang") || "fr";
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
  const panels = document.querySelectorAll(".panel-footer .panel-desc-box");

  if (cells.length === 0 || panels.length === 0) return;

  cells.forEach((cell) => {
    function selectCell() {
      const targetId = cell.getAttribute("aria-controls") || `zone-desc-${cell.getAttribute("data-zone")}`;

      cells.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      cell.classList.add("active");
      cell.setAttribute("aria-pressed", "true");

      panels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
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
      const section = btn.closest(".case-deep-dives-section");
      const isCurrentlyExpanded = btn.getAttribute("aria-expanded") === "true";

      if (isCurrentlyExpanded) {
        // Toggle OFF: collapse the panel
        btn.setAttribute("aria-expanded", "false");
        btn.classList.remove("active");
        if (card) card.classList.remove("is-active", "active");
        if (targetPanel) {
          targetPanel.setAttribute("hidden", "");
        }
        if (section) {
          delete section.dataset.active;
        }
      } else {
        disclosureButtons.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.classList.remove("active");
          const c = b.closest(".case-teaser-card");
          if (c) c.classList.remove("is-active", "active");
        });
        tabPanels.forEach((p) => {
          p.setAttribute("hidden", "");
        });
        document.querySelectorAll(".case-deep-dives-section").forEach((s) => {
          delete s.dataset.active;
        });

        // Activate clicked disclosure
        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("active");
        if (card) card.classList.add("is-active", "active");
        if (section) {
          section.dataset.active = targetPanelId;
        }
        if (targetPanel) {
          targetPanel.removeAttribute("hidden");
        }

        // On mobile carousel: smoothly align/center the card within the horizontal scroller
        if (card) {
          const grid = card.parentElement;
          if (grid && grid.scrollWidth > grid.clientWidth) {
            const max = grid.scrollWidth - grid.clientWidth;
            const target = card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2;
            const left = Math.min(Math.max(target, 0), max);
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            grid.scrollTo({ left, behavior: prefersReducedMotion ? "auto" : "smooth" });
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

    const currentLang = document.documentElement.getAttribute('lang') || 'fr';
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

/**
 * Horizontal Media Scroll Affordance
 * Provides dynamic edge fades (via .can-scroll-left / .can-scroll-right), a one-shot
 * peek animation on reveal, and click-and-drag scrolling for .case-media-scroll frames.
 */
function initMediaScrollHints() {
  const frames = document.querySelectorAll(".case-media-scroll");
  if (frames.length === 0) return;

  const EDGE_THRESHOLD = 12; // px of scroll before an edge is considered "reached"
  const PEEK_DISTANCE = 45; // px scrolled during the reveal nudge
  const PEEK_VISIBILITY = 0.6; // share of the frame that must be on screen to trigger the nudge
  const DRAG_SPEED = 1.4;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateEdges = (el) => {
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.classList.toggle("can-scroll-left", el.scrollLeft > EDGE_THRESHOLD);
    el.classList.toggle("can-scroll-right", el.scrollLeft < maxScroll - EDGE_THRESHOLD);
  };

  // Recompute whenever a frame is resized or revealed (hidden language/route views have no size)
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => updateEdges(entry.target));
  });

  const peek = (el) => {
    el.scrollTo({ left: PEEK_DISTANCE, behavior: "smooth" });
    setTimeout(() => {
      if (!el.dataset.interacted) el.scrollTo({ left: 0, behavior: "smooth" });
    }, 450);
  };

  // Frames currently in view; the peek waits for the lazy-loaded image to make them scrollable
  const visibleFrames = new WeakSet();

  const tryPeek = (el) => {
    if (!visibleFrames.has(el) || el.dataset.peeked || el.dataset.interacted) return;
    if (el.scrollWidth - el.clientWidth <= PEEK_DISTANCE) return;
    el.dataset.peeked = "true";
    if (prefersReducedMotion.matches) return;
    setTimeout(() => {
      if (!el.dataset.interacted) peek(el);
    }, 350);
  };

  const peekObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.intersectionRatio >= PEEK_VISIBILITY) {
        visibleFrames.add(el);
        tryPeek(el);
      } else {
        visibleFrames.delete(el);
      }
    });
  }, { threshold: PEEK_VISIBILITY });

  frames.forEach((el) => {
    el.addEventListener("scroll", () => updateEdges(el), { passive: true });

    // The image size defines the overflow: refresh fades and retry the peek once it has loaded
    const img = el.querySelector("img");
    if (img) {
      const onImageReady = () => {
        updateEdges(el);
        tryPeek(el);
      };
      if (img.complete) onImageReady();
      else img.addEventListener("load", onImageReady, { once: true });
    }

    const markInteracted = () => { el.dataset.interacted = "true"; };
    el.addEventListener("touchstart", markInteracted, { passive: true });
    el.addEventListener("wheel", markInteracted, { passive: true });
    el.addEventListener("keydown", markInteracted);

    // Click & drag scrolling (mouse only, touch uses native scrolling)
    let startX = 0;
    let startScroll = 0;

    const onPointerMove = (e) => {
      el.scrollLeft = startScroll - (e.clientX - startX) * DRAG_SPEED;
    };
    const onPointerUp = () => {
      el.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      markInteracted();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add("is-dragging");
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    });

    resizeObserver.observe(el);
    peekObserver.observe(el);
  });
}
