document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initSkipLink();
  initActiveNavLinkOnScroll();
  initScrollReveals();
  initAstWorkflow();
  initCaseTabs();
  initOlderTimelineToggle();
  initHamburgerMenu();
  initResumeDownloadLinks();
  initMediaScrollHints();
  initThemeLab();
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
      const id = entry.target.getAttribute("id");
      const matchingLink = Array.from(navLinks).find(
        (link) => link.getAttribute("href") === `#${id}`
      );

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (matchingLink) {
          matchingLink.classList.add("active");
        }
      } else {
        if (matchingLink && matchingLink.classList.contains("active")) {
          matchingLink.classList.remove("active");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Reset to neutral when scrolled back up into the hero section
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY < 50) {
        navLinks.forEach((link) => link.classList.remove("active"));
      }
    },
    { passive: true }
  );
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

/**
 * Theme Lab: Interactive Live Switcher for Color Palettes & Typographies
 */
function initThemeLab() {
  const PALETTES = [
    { id: "default", name: "🌲 Minéral & Végétal (Fond Sable)" },
    { id: "architect", name: "🏛️ Studio Archi (Fond Béton Minéral)" },
    { id: "acid-lime", name: "⚡ Acid Lime & Cobalt (Light)" },
    { id: "acid-lime-violet", name: "⚡ Acid Lime & Violet Royal (Light)" },
    { id: "acid-lime-rose", name: "⚡ Acid Lime & Rose Magenta (Light)" },
    { id: "punk-light", name: "⚡ Rose Punk Light (Fond Cendre Rosée)" },
    { id: "klein-orange", name: "⚡ Bleu Klein & Safety Orange (Fond Porcelaine)" },
    { id: "acid-lime-dark", name: "⚡ Acid Lime & Carbone (Dark)" },
    { id: "punk-neon", name: "⚡ Rose Punk & Cyan (Dark)" },
    { id: "outremer", name: "🌊 Encre Nuit & Ocre (Dark)" }
  ];

  const HEADING_FONTS = [
    { id: "syne", name: "Syne (Brutaliste Sculptural — Favori)" },
    { id: "unbounded", name: "Unbounded (Ultra-Wide Sculptural)" },
    { id: "sora", name: "Sora (Géométrique Futuriste)" },
    { id: "space", name: "Space Grotesk (Tech Display)" },
    { id: "instrument", name: "Instrument Serif (Élancé Haute Couture)" },
    { id: "fraunces", name: "Fraunces (Serif Expressif)" },
    { id: "newsreader", name: "Newsreader (Serif Éditorial Classique)" },
    { id: "blueprint", name: "Bricolage + Mono (Système Technique)" }
  ];

  const BODY_FONTS = [
    { id: "outfit", name: "Outfit (Tech Épuré — Favori)" },
    { id: "default", name: "Plus Jakarta Sans (Actuel)" },
    { id: "inter", name: "Inter (Standard Suisse)" },
    { id: "dm-sans", name: "DM Sans (Accessible & Rond)" },
    { id: "work-sans", name: "Work Sans (Atelier & Craft)" },
    { id: "newsreader", name: "Newsreader (100% Littéraire)" }
  ];

  let savedPalette = "default";
  let savedHeadingFont = "newsreader";
  let savedBodyFont = "default";
  try {
    savedPalette = localStorage.getItem("theme_lab_palette") || "default";
    savedHeadingFont = localStorage.getItem("theme_lab_font") || "newsreader";
    savedBodyFont = localStorage.getItem("theme_lab_body") || "default";
  } catch (e) {}

  const applyPalette = (paletteId) => {
    if (paletteId === "default") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = paletteId;
    }
    try {
      localStorage.setItem("theme_lab_palette", paletteId);
    } catch (e) {}
  };

  const applyHeadingFont = (fontId) => {
    if (fontId === "newsreader") {
      delete document.documentElement.dataset.font;
    } else {
      document.documentElement.dataset.font = fontId;
    }
    try {
      localStorage.setItem("theme_lab_font", fontId);
    } catch (e) {}
  };

  const applyBodyFont = (bodyId) => {
    if (bodyId === "default") {
      delete document.documentElement.dataset.body;
    } else {
      document.documentElement.dataset.body = bodyId;
    }
    try {
      localStorage.setItem("theme_lab_body", bodyId);
    } catch (e) {}
  };

  applyPalette(savedPalette);
  applyHeadingFont(savedHeadingFont);
  applyBodyFont(savedBodyFont);

  // Widget container
  const widget = document.createElement("aside");
  widget.className = "theme-lab-widget";
  widget.setAttribute("aria-label", "Sélecteur de style Theme Lab");

  // Panel
  const panel = document.createElement("div");
  panel.className = "theme-lab-panel";
  panel.id = "theme-lab-panel";

  // Header
  const header = document.createElement("div");
  header.className = "theme-lab-header";
  header.innerHTML = `
    <span>🧪 Theme Lab</span>
    <button type="button" class="theme-lab-close" aria-label="Réduire le panneau Theme Lab">✕</button>
  `;

  // Palette group
  const paletteGroup = document.createElement("div");
  paletteGroup.className = "theme-lab-group";
  const paletteLabel = document.createElement("label");
  paletteLabel.className = "theme-lab-label";
  paletteLabel.htmlFor = "theme-lab-palette-select";
  paletteLabel.textContent = "Palette & Fond";
  const paletteSelect = document.createElement("select");
  paletteSelect.id = "theme-lab-palette-select";
  paletteSelect.className = "theme-lab-select";
  PALETTES.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    if (p.id === savedPalette) opt.selected = true;
    paletteSelect.appendChild(opt);
  });
  paletteSelect.addEventListener("change", (e) => applyPalette(e.target.value));
  paletteGroup.appendChild(paletteLabel);
  paletteGroup.appendChild(paletteSelect);

  // Heading Font group
  const headingGroup = document.createElement("div");
  headingGroup.className = "theme-lab-group";
  const headingLabel = document.createElement("label");
  headingLabel.className = "theme-lab-label";
  headingLabel.htmlFor = "theme-lab-heading-select";
  headingLabel.textContent = "Typographie des titres";
  const headingSelect = document.createElement("select");
  headingSelect.id = "theme-lab-heading-select";
  headingSelect.className = "theme-lab-select";
  HEADING_FONTS.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.name;
    if (f.id === savedHeadingFont) opt.selected = true;
    headingSelect.appendChild(opt);
  });
  headingSelect.addEventListener("change", (e) => applyHeadingFont(e.target.value));
  headingGroup.appendChild(headingLabel);
  headingGroup.appendChild(headingSelect);

  // Body Font group
  const bodyGroup = document.createElement("div");
  bodyGroup.className = "theme-lab-group";
  const bodyLabel = document.createElement("label");
  bodyLabel.className = "theme-lab-label";
  bodyLabel.htmlFor = "theme-lab-body-select";
  bodyLabel.textContent = "Typographie du texte (Body)";
  const bodySelect = document.createElement("select");
  bodySelect.id = "theme-lab-body-select";
  bodySelect.className = "theme-lab-select";
  BODY_FONTS.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = b.name;
    if (b.id === savedBodyFont) opt.selected = true;
    bodySelect.appendChild(opt);
  });
  bodySelect.addEventListener("change", (e) => applyBodyFont(e.target.value));
  bodyGroup.appendChild(bodyLabel);
  bodyGroup.appendChild(bodySelect);

  panel.appendChild(header);
  panel.appendChild(paletteGroup);
  panel.appendChild(headingGroup);
  panel.appendChild(bodyGroup);

  // Floating Toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "theme-lab-toggle";
  toggleBtn.setAttribute("aria-expanded", "true");
  toggleBtn.setAttribute("aria-controls", "theme-lab-panel");
  toggleBtn.innerHTML = `<span>🧪</span><span>Thèmes & Typos</span>`;

  const closeBtn = header.querySelector(".theme-lab-close");

  const togglePanel = (open) => {
    panel.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", String(open));
  };

  closeBtn.addEventListener("click", () => togglePanel(false));
  toggleBtn.addEventListener("click", () => togglePanel(panel.hidden));

  widget.appendChild(panel);
  widget.appendChild(toggleBtn);
  document.body.appendChild(widget);
}
