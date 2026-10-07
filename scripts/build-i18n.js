const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://hellofrancois.github.io';
const srcFile = path.join(__dirname, '..', 'index.src.html');
const rootDir = path.join(__dirname, '..');
const enDir = path.join(__dirname, '..', 'en');

if (!fs.existsSync(enDir)) {
  fs.mkdirSync(enDir, { recursive: true });
}

const PAGES = {
  home: {
    fr: {
      title: 'François Ohl — Senior Product Designer',
      description: "François Ohl — Senior Product Designer. Je conçois des interfaces claires et fiables pour des environnements complexes : santé, outils métier et design systems à grande échelle.",
      ogTitle: 'François Ohl — Senior Product Designer',
      ogDescription: "Conception d'outils numériques pour environnements complexes et exigeants. Études de cas : Antibiogo (MSF) & Origami (AG2R LA MONDIALE).",
      canonical: `${BASE_URL}/`,
      hreflangFr: `${BASE_URL}/`,
      hreflangEn: `${BASE_URL}/en/`,
      hreflangDefault: `${BASE_URL}/`,
      outFile: path.join(rootDir, 'index.html'),
    },
    en: {
      title: 'François Ohl — Senior Product Designer',
      description: 'François Ohl — Senior Product Designer. Designing clear, resilient interfaces for complex and high-stakes environments: health-tech, enterprise tools, and design systems.',
      ogTitle: 'François Ohl — Senior Product Designer',
      ogDescription: 'Product design for complex, high-stakes environments. Selected case studies: Antibiogo (MSF) & Origami Design System (AG2R LA MONDIALE).',
      canonical: `${BASE_URL}/en/`,
      hreflangFr: `${BASE_URL}/`,
      hreflangEn: `${BASE_URL}/en/`,
      hreflangDefault: `${BASE_URL}/`,
      outFile: path.join(enDir, 'index.html'),
    }
  },
  antibiogo: {
    fr: {
      title: 'Antibiogo : Dispositif médical mobile — François Ohl',
      description: "Étude de cas Antibiogo : conception UX d'une application médicale mobile (certifiée IVDD/IVDR) pour interpréter les antibiogrammes sur le terrain (Fondation MSF).",
      ogTitle: 'Antibiogo : Dispositif médical mobile — François Ohl',
      ogDescription: "Étude de cas Antibiogo : conception UX d'une application médicale mobile (certifiée IVDD/IVDR) pour interpréter les antibiogrammes sur le terrain (Fondation MSF).",
      canonical: `${BASE_URL}/antibiogo.html`,
      hreflangFr: `${BASE_URL}/antibiogo.html`,
      hreflangEn: `${BASE_URL}/en/antibiogo.html`,
      hreflangDefault: `${BASE_URL}/antibiogo.html`,
      outFile: path.join(rootDir, 'antibiogo.html'),
    },
    en: {
      title: 'Antibiogo: Mobile Medical Device — François Ohl',
      description: 'Antibiogo Case Study: UX design for an offline certified medical device helping frontline lab technicians interpret antibiograms (MSF Foundation).',
      ogTitle: 'Antibiogo: Mobile Medical Device — François Ohl',
      ogDescription: 'Antibiogo Case Study: UX design for an offline certified medical device helping frontline lab technicians interpret antibiograms (MSF Foundation).',
      canonical: `${BASE_URL}/en/antibiogo.html`,
      hreflangFr: `${BASE_URL}/antibiogo.html`,
      hreflangEn: `${BASE_URL}/en/antibiogo.html`,
      hreflangDefault: `${BASE_URL}/antibiogo.html`,
      outFile: path.join(enDir, 'antibiogo.html'),
    }
  },
  origami: {
    fr: {
      title: 'Origami : Design System à grande échelle — François Ohl',
      description: "Étude de cas Origami : création et déploiement du design system d'AG2R LA MONDIALE pour unifier les espaces clients de 15 millions d'assurés.",
      ogTitle: 'Origami : Design System à grande échelle — François Ohl',
      ogDescription: "Étude de cas Origami : création et déploiement du design system d'AG2R LA MONDIALE pour unifier les espaces clients de 15 millions d'assurés.",
      canonical: `${BASE_URL}/origami.html`,
      hreflangFr: `${BASE_URL}/origami.html`,
      hreflangEn: `${BASE_URL}/en/origami.html`,
      hreflangDefault: `${BASE_URL}/origami.html`,
      outFile: path.join(rootDir, 'origami.html'),
    },
    en: {
      title: 'Origami: Enterprise Design System — François Ohl',
      description: 'Origami Case Study: Building and scaling an enterprise design system to unify web customer portals for 15M policyholders (AG2R LA MONDIALE).',
      ogTitle: 'Origami: Enterprise Design System — François Ohl',
      ogDescription: 'Origami Case Study: Building and scaling an enterprise design system to unify web customer portals for 15M policyholders (AG2R LA MONDIALE).',
      canonical: `${BASE_URL}/en/origami.html`,
      hreflangFr: `${BASE_URL}/origami.html`,
      hreflangEn: `${BASE_URL}/en/origami.html`,
      hreflangDefault: `${BASE_URL}/origami.html`,
      outFile: path.join(enDir, 'origami.html'),
    }
  }
};

function buildPage(pageKey, lang) {
  const template = fs.readFileSync(srcFile, 'utf8');
  const $ = cheerio.load(template, { decodeEntities: false });

  const isEn = lang === 'en';
  const otherLang = isEn ? 'fr' : 'en';
  const meta = PAGES[pageKey][lang];

  // 1. Structural extraction per page type
  if (pageKey === 'home') {
    // Remove case study views from homepage
    $('#project-view-antibiogo').remove();
    $('#project-view-origami').remove();

    // Language Switcher in header
    const langSwitchHtml = isEn
      ? `<div class="lang-switch" role="group" aria-label="Language selection / Choix de langue">
            <a href="../index.html" class="lang-btn" lang="fr" hreflang="fr" aria-label="Version française">FR</a>
            <span class="lang-divider" aria-hidden="true">/</span>
            <span class="lang-btn active" lang="en" aria-current="page" aria-label="English">EN</span>
          </div>`
      : `<div class="lang-switch" role="group" aria-label="Choix de langue / Language selection">
            <span class="lang-btn active" lang="fr" aria-current="page" aria-label="Français">FR</span>
            <span class="lang-divider" aria-hidden="true">/</span>
            <a href="en/index.html" class="lang-btn" lang="en" hreflang="en" aria-label="English version">EN</a>
          </div>`;
    $('.lang-switch').replaceWith(langSwitchHtml);
  } else if (pageKey === 'antibiogo') {
    // Remove home view and origami
    $('#home-view').remove();
    $('#project-view-origami').remove();

    // Remove site header (case study has its own topbar with back link)
    $('.header').remove();

    // Reveal Antibiogo
    $('#project-view-antibiogo').removeAttr('hidden');
    $('body').addClass('is-project-view');

    // Ensure back links explicitly target index.html#work
    $('.case-back-link').attr('href', 'index.html#work');
  } else if (pageKey === 'origami') {
    // Remove home view and antibiogo
    $('#home-view').remove();
    $('#project-view-antibiogo').remove();

    // Remove site header
    $('.header').remove();

    // Reveal Origami
    $('#project-view-origami').removeAttr('hidden');
    $('body').addClass('is-project-view');

    // Ensure back links explicitly target index.html#work
    $('.case-back-link').attr('href', 'index.html#work');
  }

  // 2. SEO & Head tags
  $('html').attr('lang', lang);
  $('title').text(meta.title);
  $('meta[name="description"]').attr('content', meta.description);
  $('meta[property="og:title"]').attr('content', meta.ogTitle);
  $('meta[property="og:description"]').attr('content', meta.ogDescription);
  $('meta[property="og:url"]').attr('content', meta.canonical);
  $('link[rel="canonical"]').attr('href', meta.canonical);
  $('link[rel="alternate"][hreflang="en"]').attr('href', meta.hreflangEn);
  $('link[rel="alternate"][hreflang="fr"]').attr('href', meta.hreflangFr);
  $('link[rel="alternate"][hreflang="x-default"]').attr('href', meta.hreflangDefault);

  // 3. Remove elements of the other language (except inside .lang-switch if present)
  $(`[lang="${otherLang}"]`).each((_, el) => {
    if (!$(el).closest('.lang-switch').length) {
      $(el).remove();
    }
  });

  // 4. Clean up redundant targetLang attribute on regular elements (since <html> defines it)
  $(`[lang="${lang}"]`).each((_, el) => {
    if (!$(el).closest('.lang-switch').length && el.tagName !== 'html') {
      $(el).removeAttr('lang');
    }
  });

  // 5. Fix asset paths for /en/ (subfolder)
  if (isEn) {
    // Stylesheet
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        $(el).attr('href', `../${href}`);
      }
    });

    // Scripts
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('//')) {
        $(el).attr('src', `../${src}`);
      }
    });

    // Images
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
        $(el).attr('src', `../${src}`);
      }
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const newSrcset = srcset
          .split(',')
          .map((part) => {
            const trimmed = part.trim();
            if (!trimmed.startsWith('http') && !trimmed.startsWith('//')) {
              return `../${trimmed}`;
            }
            return trimmed;
          })
          .join(', ');
        $(el).attr('srcset', newSrcset);
      }
    });

    // Relative asset links (e.g. CV downloads)
    $('a[href^="assets/"]').each((_, el) => {
      const href = $(el).attr('href');
      $(el).attr('href', `../${href}`);
    });
  }

  return $.html();
}

console.log('Building pages...');

for (const [pageKey, pageConfig] of Object.entries(PAGES)) {
  for (const lang of ['fr', 'en']) {
    const config = pageConfig[lang];
    console.log(`- Building ${pageKey} (${lang}): ${path.relative(rootDir, config.outFile)}`);
    const html = buildPage(pageKey, lang);
    fs.writeFileSync(config.outFile, html, 'utf8');
  }
}

console.log('Build completed successfully! 6 pages generated.');
