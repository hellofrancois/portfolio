const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://hellofrancois.github.io';
const srcFile = path.join(__dirname, '..', 'index.src.html');
const outDirFr = path.join(__dirname, '..');
const outDirEn = path.join(__dirname, '..', 'en');

if (!fs.existsSync(outDirEn)) {
  fs.mkdirSync(outDirEn, { recursive: true });
}

function buildLang(targetLang) {
  const template = fs.readFileSync(srcFile, 'utf8');
  const $ = cheerio.load(template, { decodeEntities: false });

  const isEn = targetLang === 'en';
  const otherLang = isEn ? 'fr' : 'en';

  // 1. Set <html lang="...">
  $('html').attr('lang', targetLang);

  // 2. SEO & Head tags
  if (isEn) {
    $('title').text('François Ohl — Senior Product Designer (UX/IA)');
    $('meta[name="description"]').attr(
      'content',
      'François Ohl — Senior Product Designer specializing in UX, information architecture, systemic design systems, and inclusive digital interfaces.'
    );
    $('meta[property="og:title"]').attr('content', 'François Ohl — Senior UX & Product Designer');
    $('meta[property="og:description"]').attr(
      'content',
      'Portfolio of François Ohl, Senior UX/Product Designer focusing on information architecture, complex systems, and design system scaling.'
    );
    $('meta[property="og:url"]').attr('content', `${BASE_URL}/en/`);
    $('link[rel="canonical"]').attr('href', `${BASE_URL}/en/`);
  } else {
    $('title').text('François Ohl — Senior Product Designer (UX/IA)');
    $('meta[name="description"]').attr(
      'content',
      "François Ohl — Senior Product Designer spécialisé en UX, architecture de l'information, design systems systémiques et interfaces numériques inclusives."
    );
    $('meta[property="og:title"]').attr('content', 'François Ohl — Senior UX & Product Designer');
    $('meta[property="og:description"]').attr(
      'content',
      "Portfolio de François Ohl, Senior UX/Product Designer spécialisé dans l'architecture de l'information et le design system."
    );
    $('meta[property="og:url"]').attr('content', `${BASE_URL}/`);
    $('link[rel="canonical"]').attr('href', `${BASE_URL}/`);
  }

  // Canonical & hreflang
  $('link[rel="alternate"][hreflang="en"]').attr('href', `${BASE_URL}/en/`);
  $('link[rel="alternate"][hreflang="fr"]').attr('href', `${BASE_URL}/`);
  $('link[rel="alternate"][hreflang="x-default"]').attr('href', `${BASE_URL}/`);

  // 3. Language Switcher in header
  const langSwitchHtml = isEn
    ? `<div class="lang-switch" role="group" aria-label="Language selection / Choix de langue">
          <span class="lang-btn active" lang="en" aria-current="page" aria-label="English">EN</span>
          <span class="lang-divider" aria-hidden="true">/</span>
          <a href="../" class="lang-btn" lang="fr" hreflang="fr" aria-label="Version française">FR</a>
        </div>`
    : `<div class="lang-switch" role="group" aria-label="Choix de langue / Language selection">
          <a href="en/" class="lang-btn" lang="en" hreflang="en" aria-label="English version">EN</a>
          <span class="lang-divider" aria-hidden="true">/</span>
          <span class="lang-btn active" lang="fr" aria-current="page" aria-label="Français">FR</span>
        </div>`;

  $('.lang-switch').replaceWith(langSwitchHtml);

  // 4. Remove elements of the other language (except inside .lang-switch)
  $(`[lang="${otherLang}"]`).each((_, el) => {
    if (!$(el).closest('.lang-switch').length) {
      $(el).remove();
    }
  });

  // 5. Clean up redundant targetLang attribute on regular elements (since <html> already defines it)
  $(`[lang="${targetLang}"]`).each((_, el) => {
    if (!$(el).closest('.lang-switch').length && el.tagName !== 'html') {
      $(el).removeAttr('lang');
    }
  });

  // 6. Fix asset paths for /en/ (since it lives in a subfolder)
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

console.log('Building French (index.html)...');
const frHtml = buildLang('fr');
fs.writeFileSync(path.join(outDirFr, 'index.html'), frHtml, 'utf8');

console.log('Building English (en/index.html)...');
const enHtml = buildLang('en');
fs.writeFileSync(path.join(outDirEn, 'index.html'), enHtml, 'utf8');

console.log('Build completed successfully!');
