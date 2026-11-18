/* NeuralThermal 访问统计：记录访问的页面、来源和停留时长。不用 cookie，不记录 IP。 */
(function () {
  try {
    if (navigator.webdriver || localStorage.getItem('nt_notrack') === '1') return;
    var rid = function () { return Math.random().toString(36).slice(2, 12) + Date.now().toString(36); };
    var sid = sessionStorage.getItem('nt_sid');
    if (!sid) { sid = rid(); sessionStorage.setItem('nt_sid', sid); }
    var pid = rid(), active = 0, since = Date.now(), visible = !document.hidden;
    var send = function (b) { b.s = sid; b.p = pid; navigator.sendBeacon('/hub/api/hit', JSON.stringify(b)); };
    var ref = '';
    try { if (document.referrer && new URL(document.referrer).host !== location.host) ref = document.referrer; } catch (e) {}
    send({ t: 'v', u: location.pathname + location.search, ti: document.title, r: ref });
    var flush = function () {
      if (visible) active += Date.now() - since;
      since = Date.now();
      send({ t: 'd', d: Math.round(active / 1000) });
    };
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) flush(); else since = Date.now();
      visible = !document.hidden;
    });
    addEventListener('pagehide', function () { if (visible) flush(); });
  } catch (e) {}
})();
