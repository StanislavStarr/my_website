import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://localhost:3000';
const origin = process.env.SITE_URL?.replace(/\/$/, '');
const slugs = ['ekhonish', 'rzd-cargo', 'client-base', 'medtech'];
let checks = 0;

for (const locale of ['en', 'ru']) {
  const prefix = locale === 'ru' ? '/ru' : '';
  for (const path of ['', ...slugs.map((slug) => '/work/' + slug)]) {
    const route = prefix + path || '/';
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    // Remove scripts: these assertions require server-rendered content.
    const content = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(content, new RegExp('<html[^>]*lang="' + locale + '"'));
    assert.equal((content.match(/<h1\b/g) || []).length, 1, route + ': one h1');
    assert.match(content, /stanislav\.sinitsyn\.work@gmail\.com/);
    assert.match(content, /https:\/\/t\.me\/stanislav_sinitsynn/);
    const robotTag = content.match(/<meta[^>]*name="robots"[^>]*>/)?.[0] || '';
    if (origin && process.env.ENABLE_INDEXING === 'true') {
      assert.match(robotTag, /content="index, follow"/);
    } else {
      assert.match(robotTag, /noindex/);
    }
    if (!path) {
      assert.match(content, /React Native \+ Expo/);
      assert.match(content, /MedTech/);
      assert.match(content, /href="[^"]*\/work\/medtech"/);
    } else {
      assert.match(content, /<article\b/);
      assert.match(content, locale === 'ru' ? /Мой вклад/ : /My contribution/);
    }
    if (origin) {
      const canonical = route === '/' ? origin : origin + route;
      assert.ok(content.includes('href="' + canonical + '"'), route + ': canonical URL');
      assert.match(content, /hrefLang="x-default"|hreflang="x-default"/);
      assert.match(html, /application\/ld\+json/);
    }
    checks++;
    console.log('PASS', route);
  }
}

// Service pages: [path, text that must be present, whether it shows the real cases, directions that are not proven yet]
const servicePages = [
  ['/services/web-development', /React/, true, /Mini App|React Native|Telegram bot/i],
  ['/services/mobile-apps', /React Native[\s\S]*Expo/, false, /Mini App|Telegram bot/i],
  ['/services/seo-geo', /GEO/, false, /Mini App|React Native|Telegram bot/i]
];
for (const [servicePath, must, showsCases, banned] of servicePages) for (const locale of ['en', 'ru']) {
  const route = (locale === 'ru' ? '/ru' : '') + servicePath;
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const content = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.match(content, new RegExp('<html[^>]*lang="' + locale + '"'));
  assert.equal((content.match(/<h1\b/g) || []).length, 1, route + ': one h1');
  assert.match(content, must);
  const caseLinks = /href="[^"]*\/work\/[a-z-]+"/.test(content);
  assert.equal(caseLinks, showsCases, route + (showsCases ? ': links to the real cases' : ': no case links, there are no cases for this direction'));
  assert.doesNotMatch(content, banned, route + ': no unproven directions');
  assert.match(content, /https:\/\/t\.me\/stanislav_sinitsynn/);
  const robotTag = content.match(/<meta[^>]*name="robots"[^>]*>/)?.[0] || '';
  if (origin && process.env.ENABLE_INDEXING === 'true') {
    assert.match(robotTag, /content="index, follow"/);
    assert.ok(content.includes('href="' + origin + route + '"'), route + ': canonical URL');
    assert.match(html, /application\/ld\+json/);
    assert.doesNotMatch(html, /FAQPage/, route + ': no FAQPage on the service page');
  } else {
    assert.match(robotTag, /noindex/);
  }
  checks++;
  console.log('PASS', route);
}

for (const path of ['/work/not-a-case', '/ru/work/not-a-case', '/missing-page', '/ru/missing-page']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 404, path);
  checks++;
  console.log('PASS 404', path);
}

const english = await fetch(base + '/', {headers: {'Accept-Language': 'ru-RU,ru;q=0.9'}, redirect: 'manual'});
assert.equal(english.status, 200, 'English is not redirected by Accept-Language');
const duplicate = await fetch(base + '/en', {redirect: 'manual'});
assert.ok([307, 308].includes(duplicate.status), '/en redirects to the canonical unprefixed URL');
assert.equal(new URL(duplicate.headers.get('location'), base).pathname, '/');
const robots = await (await fetch(base + '/robots.txt')).text();
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, origin && process.env.ENABLE_INDEXING === 'true' ? /Allow: \// : /Disallow: \//);
const sitemap = await fetch(base + '/sitemap.xml');
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.equal((xml.match(/<loc>/g) || []).length, origin ? 16 : 0);
const image = await fetch(base + '/og-image');
assert.equal(image.status, 200);
assert.match(image.headers.get('content-type') || '', /image\/png/);
console.log('PASS language routing, robots, sitemap and Open Graph image');
console.log('Smoke tests completed:', checks, 'pages plus infrastructure checks.');
