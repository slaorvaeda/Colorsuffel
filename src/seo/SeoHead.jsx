// @ts-nocheck — document head mutations for SPA SEO.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, SITE } from './routeMeta';

function setMetaByName(name, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkRel(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeLinkRel(rel) {
  document.querySelector(`link[rel="${rel}"]`)?.remove();
}

const JSON_LD_ID = 'colorsuffel-jsonld';

/**
 * Updates document title, description, Open Graph, Twitter, canonical, and robots for the current route.
 */
export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    const origin = window.location.origin;
    const canonical = `${origin}${meta.path === '/' ? '/' : meta.path}`;
    const fullTitle =
      meta.title.includes(SITE.brand) || meta.title.includes(SITE.titleSuffix)
        ? meta.title
        : `${meta.title} | ${SITE.titleSuffix}`;

    document.title = fullTitle;

    setMetaByName('description', meta.description);
    if (meta.keywords) setMetaByName('keywords', meta.keywords);
    else setMetaByName('keywords', SITE.defaultKeywords);

    if (meta.robots) setMetaByName('robots', meta.robots);
    else {
      setMetaByName('robots', 'index, follow, max-image-preview:large');
    }

    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:site_name', SITE.brand);
    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', meta.description);
    setMetaByProperty('og:url', canonical);
    const ogImage = `${origin}/logo.png`;
    setMetaByProperty('og:image', ogImage);
    setMetaByProperty('og:image:alt', `${SITE.brand} logo`);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', meta.description);
    setMetaByName('twitter:image', ogImage);

    if (meta.robots?.includes('noindex')) {
      removeLinkRel('canonical');
    } else {
      setLinkRel('canonical', canonical);
    }

    // WebApplication JSON-LD on home only (avoid duplicate entities on every navigation).
    const existing = document.getElementById(JSON_LD_ID);
    if (meta.path === '/') {
      const payload = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE.brand,
        description: SITE.defaultDescription,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: `${origin}/`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      };
      const script = existing || document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(payload);
      if (!existing) document.head.appendChild(script);
      else script.textContent = JSON.stringify(payload);
    } else if (existing) {
      existing.remove();
    }
  }, [pathname]);

  return null;
}
