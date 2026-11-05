import { mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const pages = ['index.html', 'blanket-size-calculator.html', 'stitch-increase-decrease-calculator.html', 'privacy.html', 'terms.html', '404.html'];
const files = [...pages, 'styles.css', 'app.js', 'calculator.js', 'favicon.svg', 'robots.txt'];
let origin;
if (process.env.SITE_URL) {
  origin = new URL(process.env.SITE_URL);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_URL must be an origin such as https://example.com, without a path.');
}
await mkdir(output, { recursive: true });
for (const file of files) await copyFile(path.join(root, file), path.join(output, file));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
if (origin) {
  for (const page of pages.filter(p => p !== '404.html')) {
    const url = new URL(page === 'index.html' ? '/' : page, origin).href;
    const source = await readFile(path.join(output, page), 'utf8');
    await writeFile(path.join(output, page), source.replace('</head>', `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}">\n</head>`));
  }
  const urls = pages.filter(p => p !== '404.html').map(p => `<url><loc>${escape(new URL(p === 'index.html' ? '/' : p, origin).href)}</loc></url>`).join('');
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`);
} else {
  await rm(path.join(output, 'sitemap.xml'), { force: true });
}
console.log(`Built ${files.length} static assets.${origin ? ' Sitemap and canonical URLs generated.' : ' Set SITE_URL for canonical URLs and a sitemap.'}`);
