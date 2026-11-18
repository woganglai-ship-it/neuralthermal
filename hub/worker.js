// NT Hub Worker: static pages from ./public, plus a small first-party visit counter.
// POST /hub/api/hit    page view or duration update from /hub/t.js (no cookies, no IP stored)
// GET  /hub/api/visits private list for /hub/admin/, needs "Authorization: Bearer <STATS_KEY>"
const json = (v, status = 200) => Response.json(v, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const BOT = /bot|crawl|spider|slurp|headless|preview|fetch|monitor|curl|wget|python|axios/i;
const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
const ID = /^[a-z0-9]{6,40}$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/hub/api/hit') return hit(req, env, url);
    if (url.pathname === '/hub/api/visits') return visits(req, env, url);
    if (url.pathname.startsWith('/hub/api/')) return json({ error: 'Not found' }, 404);
    return env.ASSETS.fetch(req);
  }
};

async function hit(req, env, url) {
  if (req.method !== 'POST') return json({}, 405);
  const origin = req.headers.get('Origin');
  if (origin && new URL(origin).host !== url.host) return json({}, 403);
  if (BOT.test(req.headers.get('User-Agent') || '')) return new Response(null, { status: 204 });
  const text = await req.text();
  if (text.length > 2000) return json({}, 413);
  let b; try { b = JSON.parse(text); } catch { return json({}, 400); }
  if (!b || !ID.test(b.s) || !ID.test(b.p)) return json({}, 400);
  if (b.t === 'd') {
    const d = Math.max(0, Math.min(86400, Math.round(+b.d || 0)));
    await env.DB.prepare('UPDATE views SET dur = MAX(dur, ?) WHERE pid = ? AND sid = ?').bind(d, b.p, b.s).run();
  } else {
    const cf = req.cf || {}, ua = req.headers.get('User-Agent') || '';
    const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';
    await env.DB.prepare('INSERT OR IGNORE INTO views (pid, sid, ts, path, title, ref, country, region, city, device) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(b.p, b.s, Date.now(), clip(b.u, 300), clip(b.ti, 150), clip(b.r, 300), clip(cf.country, 8), clip(cf.region, 80), clip(cf.city, 80), device).run();
  }
  return new Response(null, { status: 204 });
}

async function visits(req, env, url) {
  if (!env.STATS_KEY || req.headers.get('Authorization') !== 'Bearer ' + env.STATS_KEY) return json({ error: 'Unauthorized' }, 401);
  const days = Math.max(1, Math.min(90, +url.searchParams.get('days') || 7));
  // Keep at most 180 days of history.
  await env.DB.prepare('DELETE FROM views WHERE ts < ?').bind(Date.now() - 180 * 86400000).run();
  const { results } = await env.DB.prepare('SELECT sid, ts, path, title, ref, country, region, city, device, dur FROM views WHERE ts >= ? ORDER BY ts DESC LIMIT 5000')
    .bind(Date.now() - days * 86400000).all();
  return json({ days, views: results });
}
