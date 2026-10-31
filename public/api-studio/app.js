/* NT API Studio · cloud inference UI; no model weights or inference code in the browser. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var M = window.NT_MODEL, KEY = 'nt_demo_2026', ONLINE = true, LIMIT = M.limit_c;
  var LABEL = {
    channel_width_mm: ['槽宽', 'mm', 0.01], fin_thickness_mm: ['齿厚', 'mm', 0.01], fin_height_mm: ['齿高', 'mm', 0.1], flow_lpm: ['流量', 'L/min', 0.1],
    inlet_c: ['进水温度', '°C', 0.5], power_kw: ['总功耗', 'kW', 0.05], tim2_w_mk: ['TIM2 导热系数', 'W/m·K', 0.5], hotspot_share: ['热点功耗占比', '', 0.01]
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function f(v, n) { return (+v).toFixed(n == null ? 1 : n); }
  function kpi(label, val, cls) { return '<div class="kpi ' + (cls || '') + '"><b>' + val + '</b><span>' + label + '</span></div>'; }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  /* NeuralThermal mark and wordmark, copied unchanged from the official site (070 NT Website/source/src/logo.js) */
  var LOGO = '<svg class="mark" viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true"><g stroke="#0b6bcb" stroke-width="1.4"><path d="M2 3 L24 29"/><path d="M22 3 L6 29"/><path d="M2 3 L28 29"/><path d="M28 3 L4 29"/><path d="M23 3 L13 29"/><path d="M9 3 L29 29"/></g><path d="M11 3 L23 29" stroke="#e2580a" stroke-width="1.9"/></svg><span>Neural<svg class="t" viewBox="0 0 62 72" aria-hidden="true"><rect width="20" height="15" fill="#2FD4E8"/><rect x="21" width="20" height="15" fill="currentColor"/><rect x="42" width="20" height="15" fill="#76B900"/><rect x="21" y="15" width="20" height="57" fill="currentColor"/></svg>hermal</span>';
  $('brand').innerHTML = LOGO; $('brand2').innerHTML = LOGO;

  /* ---------- API 调用：服务器或浏览器内 ---------- */
  function api(path, body) {
    return fetch('/api-studio' + path, { method: 'POST', headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); }).catch(function () {return {status:503,body:{message:'服务暂不可用，请稍后重试'}};});
  }
  function setConn() {
    $('conn').className = 'conn' + (ONLINE ? ' on' : '');
    $('conn').innerHTML = '<i></i>' + (ONLINE ? '云端已连接' : '云端暂不可用，请稍后重试');
    $('conn').title = ONLINE ? '模型在云端运行，不向浏览器发送权重' : '本页面不包含离线模型';
  }

  /* ---------- JSON 显示（长数组折叠） ---------- */
  function shorten(o) {
    if (Array.isArray(o)) {
      if (o.length > 10 && typeof o[0] !== 'object') return o.slice(0, 6).concat(['… 共 ' + o.length.toLocaleString() + ' 个']);
      if (o.length > 4 && typeof o[0] === 'object') return o.slice(0, 3).map(shorten).concat(['… 共 ' + o.length + ' 条']);
      return o.map(shorten);
    }
    if (o && typeof o === 'object') { var r = {}; for (var k in o) r[k] = shorten(o[k]); return r; }
    return o;
  }
  function pretty(o) {
    return esc(JSON.stringify(shorten(o), null, 2))
      .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/:\s(&quot;.*?&quot;)/g, ': <span class="s">$1</span>')
      .replace(/:\s(-?[\d.]+(e-?\d+)?)/g, ': <span class="n">$1</span>');
  }
  function reqText(path, body) {
    return '<span class="c">POST ' + location.origin + '/api-studio' + path + '\nAuthorization: Bearer ' + KEY + '\nContent-Type: application/json</span>\n\n' + pretty(body);
  }
  function errBox(res) {
    var b = res.body, items = (b.errors || []).map(function (e) {
      if (e.errors) return '<li>t = ' + e.t_s + ' s：' + e.errors.map(function (x) { return x.field; }).join('、') + '</li>';
      var L = LABEL[e.field] || [e.field, ''];
      return '<li>' + esc(L[0]) + (e.value != null ? ' = ' + esc(e.value) : '') + (e.allowed ? '，已验证范围 ' + e.allowed[0] + '–' + e.allowed[1] + ' ' + L[1] : '：' + esc(e.error || '')) + '</li>';
    }).join('');
    return '<div class="err"><b>HTTP ' + res.status + ' · ' + esc(b.status) + '</b><br>' + esc(b.message || '') + (items ? '<ul>' + items + '</ul>' : '') + '</div>';
  }

  /* ---------- 画图 ---------- */
  function setup(cv) {
    var dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
    cv.width = Math.max(10, Math.round(r.width * dpr)); cv.height = Math.max(10, Math.round(r.height * dpr));
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, r.width, r.height);
    ctx.font = '12px ' + css('--font-sans');
    return { ctx: ctx, W: r.width, H: r.height };
  }
  /* opts: {series:[{x,y,color,width,dash,label,dots,r}], xlab, ylab, xlog, xMin,xMax,yMin,yMax, hlines:[{y,color,label}], vlines:[{x,color,label}]} */
  function plot(cv, o) {
    var c = setup(cv), ctx = c.ctx, L = 48, R = 12, T = 22, B = 30, w = c.W - L - R, h = c.H - T - B;
    var xs = [], ys = [];
    o.series.forEach(function (s) { s.y.forEach(function (v, i) { if (isFinite(v)) { ys.push(v); xs.push(s.x[i]); } }); });
    (o.hlines || []).forEach(function (l) { ys.push(l.y); });
    var tx = o.xlog ? Math.log10 : function (v) { return v; };
    var x0 = o.xMin != null ? o.xMin : Math.min.apply(null, xs), x1 = o.xMax != null ? o.xMax : Math.max.apply(null, xs);
    var y0 = o.yMin != null ? o.yMin : Math.min.apply(null, ys), y1 = o.yMax != null ? o.yMax : Math.max.apply(null, ys);
    if (o.yMin == null) { var pd = (y1 - y0) * 0.08 || 1; y0 -= pd; y1 += pd; }
    var X = function (v) { return L + (tx(v) - tx(x0)) / ((tx(x1) - tx(x0)) || 1) * w; }, Y = function (v) { return T + (1 - (v - y0) / ((y1 - y0) || 1)) * h; };
    ctx.strokeStyle = css('--line'); ctx.fillStyle = css('--muted'); ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) { var v = y0 + (y1 - y0) * g / 4; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(L + w, Y(v)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(f(v, y1 - y0 < 4 ? 2 : y1 - y0 < 20 ? 1 : 0), L - 5, Y(v) + 4); }
    ctx.textAlign = 'center';
    var ticks = [];
    if (o.xlog) { for (var e = Math.floor(Math.log10(x0)); e <= Math.ceil(Math.log10(x1)); e++) [1, 2, 5].forEach(function (m) { var t = m * Math.pow(10, e); if (t >= x0 && t <= x1) ticks.push(t); }); }
    else { var st = niceStep((x1 - x0) / 5); for (var tv = Math.ceil(x0 / st) * st; tv <= x1 + 1e-9; tv += st) ticks.push(tv); }
    ticks.forEach(function (t) { ctx.fillText(o.xlog ? String(+t.toPrecision(2)) : String(+t.toFixed(3)), X(t), T + h + 15); });
    ctx.textAlign = 'right'; if (o.xlab) ctx.fillText(o.xlab, L + w, c.H - 2);
    ctx.textAlign = 'left'; if (o.ylab) ctx.fillText(o.ylab, 4, 12);
    (o.hlines || []).forEach(function (l) { ctx.strokeStyle = l.color; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(L, Y(l.y)); ctx.lineTo(L + w, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color; ctx.textAlign = 'right'; ctx.fillText(l.label, L + w - 2, Y(l.y) - 4); } });
    (o.vlines || []).forEach(function (l) { ctx.strokeStyle = l.color; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(X(l.x), T); ctx.lineTo(X(l.x), T + h); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color; ctx.textAlign = 'left'; ctx.fillText(l.label, X(l.x) + 4, T + 10); } });
    ctx.save(); ctx.beginPath(); ctx.rect(L, T - 2, w, h + 4); ctx.clip();
    o.series.forEach(function (s) {
      ctx.strokeStyle = ctx.fillStyle = s.color; ctx.globalAlpha = s.alpha || 1;
      if (s.dots) { s.y.forEach(function (v, i) { ctx.beginPath(); ctx.arc(X(s.x[i]), Y(v), s.r || 3, 0, 7); ctx.fill(); }); }
      else { ctx.lineWidth = s.width || 1.8; ctx.setLineDash(s.dash || []); ctx.beginPath(); s.y.forEach(function (v, i) { if (i) ctx.lineTo(X(s.x[i]), Y(v)); else ctx.moveTo(X(s.x[i]), Y(v)); }); ctx.stroke(); ctx.setLineDash([]); }
      ctx.globalAlpha = 1;
    });
    ctx.restore();
    ctx.textAlign = 'left'; var lx = Math.max(L + 4, o.ylab ? 4 + ctx.measureText(o.ylab).width + 18 : 0);
    o.series.forEach(function (s) { if (!s.label) return; ctx.fillStyle = s.color; if (s.dots) { ctx.beginPath(); ctx.arc(lx + 5, 9, 3.5, 0, 7); ctx.fill(); } else ctx.fillRect(lx, 8, 12, 3); ctx.fillStyle = css('--muted'); ctx.fillText(s.label, lx + 16, 13); lx += ctx.measureText(s.label).width + 34; });
  }
  function niceStep(raw) { var p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
  function turbo(t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var r = 0.13572138 + t * (4.61539260 + t * (-42.66032258 + t * (132.13108234 + t * (-152.94239396 + t * 59.28637943))));
    var g = 0.09140261 + t * (2.19418839 + t * (4.84296658 + t * (-14.18503333 + t * (4.27729857 + t * 2.82956604))));
    var b = 0.10667330 + t * (12.64194608 + t * (-60.58204836 + t * (110.36276771 + t * (-89.90310912 + t * 27.34824973))));
    return [r, g, b].map(function (x) { return Math.max(0, Math.min(255, Math.round(x * 255))); });
  }
  function drawField(cv, fld, lo, hi) { /* rows = x (flow direction), cols = y; draw x to the right, y up */
    var nx = fld.nx, ny = fld.ny, S = 8, sm = document.createElement('canvas'); sm.width = nx; sm.height = ny;
    var sc = sm.getContext('2d'), img = sc.createImageData(nx, ny);
    for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++) {
      var c = turbo((fld.data[i * ny + j] - lo) / ((hi - lo) || 1)), p = ((ny - 1 - j) * nx + i) * 4;
      img.data[p] = c[0]; img.data[p + 1] = c[1]; img.data[p + 2] = c[2]; img.data[p + 3] = 255;
    }
    sc.putImageData(img, 0, 0);
    cv.width = nx * S; cv.height = ny * S;
    var ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.drawImage(sm, 0, 0, nx * S, ny * S);
    var PX = M.plate_mm[0], PY = M.plate_mm[1], k = cv.width / PX;
    ctx.lineWidth = 2; ctx.font = '600 22px ' + css('--font-sans'); ctx.textAlign = 'center';
    M.rects.forEach(function (r) {
      var x0 = (r.mm[0] + PX / 2) * k, x1 = (r.mm[1] + PX / 2) * k, y0 = (PY / 2 - r.mm[3]) * k, y1 = (PY / 2 - r.mm[2]) * k;
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      if (r.kind === 'DIE') { ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillText('芯片 ' + (r.i + 1), (x0 + x1) / 2, (y0 + y1) / 2 + 8); }
    });
    ctx.font = '600 17px ' + css('--font-sans'); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillText('HBM', ((M.rects[2].mm[0] + M.rects[2].mm[1]) / 2 + PX / 2) * k, (PY / 2 - (M.rects[2].mm[2] + M.rects[2].mm[3]) / 2) * k + 6);
  }
  function colorbar(cv) {
    cv.width = 256; cv.height = 1; var ctx = cv.getContext('2d'), img = ctx.createImageData(256, 1);
    for (var i = 0; i < 256; i++) { var c = turbo(i / 255); img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = 255; }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------- 表单 ---------- */
  function numInput(name, val, opts) {
    opts = opts || {};
    var L = LABEL[name] || [name, '', 0.1], rng = M.inputs.filter(function (x) { return x.name === name; })[0];
    return '<label data-n="' + name + '"><span>' + (opts.label || L[0]) + (L[1] ? '（' + L[1] + '）' : '') + (rng && !opts.noRange ? ' <small>' + rng.lo + '–' + rng.hi + '</small>' : '') + '</span>' +
      '<input type="number" step="' + (opts.step || L[2]) + '" value="' + val + '" data-n="' + name + '"></label>';
  }
  function readForm(root) { var o = {}; root.querySelectorAll('input[data-n]').forEach(function (i) { o[i.dataset.n] = i.value === '' ? null : +i.value; }); return o; }
  function markRange(root) {
    root.querySelectorAll('label[data-n]').forEach(function (l) {
      var rng = M.inputs.filter(function (x) { return x.name === l.dataset.n; })[0], v = +l.querySelector('input').value;
      l.classList.toggle('bad', !!rng && (v < rng.lo || v > rng.hi));
    });
  }

  /* ---------- 概览 / 建模与验证 ---------- */
  var SM = M.scalar_metrics, FM = M.field_metrics;
  $('hErr').textContent = f(SM.die_mae_k, 2) + ' K';
  async function drawModel() {
    var bench = await api('/v1/design/predict', {inputs:{channel_width_mm:0.3,fin_thickness_mm:0.2,fin_height_mm:3,flow_lpm:2,inlet_c:40,power_kw:2.28,tim2_w_mk:5,hotspot_share:0.15},return_field:false});
    if (bench.status !== 200) {$('vKpis').innerHTML=errBox(bench);return;}
    var ms = bench.body.timing_ms;
    $('vKpis').innerHTML = kpi('组求解器样本', SM.n_samples.toLocaleString(), 'bl') +
      kpi('最热芯片平均误差（最大 ' + f(SM.die_max_k, 2) + ' K）', f(SM.die_mae_k, 2) + ' K', 'ai') + kpi('最热 HBM 平均误差', f(SM.hbm_mae_k, 2) + ' K', 'ai') +
      kpi('温度场 RMSE · 100 测试场', f(FM.rmse_k, 2) + ' K', 'ai') +
      kpi('求解器单次（离线测试中位数）', f(SM.solver_s_median, 2) + ' s') + kpi('代理模型单次（云端计算）', ms < 1 ? '< 1 ms' : f(ms, 2) + ' ms', 'ai');
    var p = M.parity, lo = Math.floor(Math.min.apply(null, p.true) / 5) * 5, hi = Math.ceil(Math.max.apply(null, p.true) / 5) * 5;
    plot($('parity'), { series: [{ x: [lo, hi], y: [lo, hi], color: css('--muted'), dash: [5, 4], width: 1.2, label: '完全一致' },
      { x: p.true, y: p.pred, color: css('--ai-deep'), dots: true, r: 2.6, alpha: .7, label: '测试设计' }],
      xMin: lo, xMax: hi, yMin: lo, yMax: hi, xlab: '求解器 °C', ylab: '代理模型 °C' });
    $('rangeTbl').innerHTML = '<tr><th>输入</th><th>已验证范围</th></tr>' + M.inputs.map(function (x) { var L = LABEL[x.name]; return '<tr><td>' + L[0] + ' <small class="num">' + x.name + '</small></td><td class="num">' + x.lo + '–' + x.hi + ' ' + L[1] + '</td></tr>'; }).join('');
    var probe = await api('/v1/design/predict', { inputs: { channel_width_mm: 0.3, fin_thickness_mm: 0.2, fin_height_mm: 3, flow_lpm: 5, inlet_c: 40, power_kw: 2.28, tim2_w_mk: 5, hotspot_share: 0.15 } }, KEY);
    var rows = [['最热芯片平均误差 ≤ 0.5 K', SM.die_mae_k <= 0.5, f(SM.die_mae_k, 2) + ' K'], ['最热芯片最大误差 ≤ 1.0 K', SM.die_max_k <= 1, f(SM.die_max_k, 2) + ' K'],
      ['温度场均方根误差 ≤ 0.5 K', FM.rmse_k <= 0.5, f(FM.rmse_k, 2) + ' K'], ['压降与求解器公式一致', SM.dp_max_abs_kpa < 0.01, '最大差 ' + SM.dp_max_abs_kpa.toExponential(1) + ' kPa'],
      ['超出范围的输入被拒绝', probe.status === 422, '流量 5 L/min → HTTP ' + probe.status]];
    $('accept').innerHTML = rows.map(function (r) { return '<li><span class="badge ' + (r[1] ? 'ok' : 'bad') + '">' + (r[1] ? '通过' : '未通过') + '</span> ' + r[0] + ' <small class="num">（' + r[2] + '）</small></li>'; }).join('');
    $('vNote').textContent = '求解器样本：标量模型 2,400 / 300 / 300；温度场 700 / 100 / 100（训练 / 验证 / 测试）。压降采用解析式。';
  }

  /* ---------- NT Design ---------- */
  var PRESET = { typical: [0.305, 0.203, 3.0, 2.05, 40, 2.28, 5, 0.15], best: [0.1, 0.1, 2.2, 4.0, 40, 2.28, 5, 0.15], out: [0.305, 0.203, 3.0, 5.0, 40, 3.5, 5, 0.15] };
  $('dForm').innerHTML = M.inputs.map(function (x, i) { return numInput(x.name, PRESET.typical[i]); }).join('');
  function setPreset(k) { var v = PRESET[k]; $('dForm').querySelectorAll('input').forEach(function (inp, i) { inp.value = v[i]; }); runDesign(); }
  document.querySelectorAll('[data-preset]').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.go) { drawn.design = 1; showTab('design'); } setPreset(b.dataset.preset); }); });
  var dT;
  $('dForm').addEventListener('input', function () { markRange($('dForm')); clearTimeout(dT); dT = setTimeout(runDesign, 250); });
  function designBody() { return { model: M.id, inputs: readForm($('dForm')), return_field: true }; }
  function runDesign() {
    markRange($('dForm'));
    var body = designBody(); $('dReq').innerHTML = reqText('/v1/design/predict', body); $('dVer').classList.add('hide');
    return api('/v1/design/predict', body).then(function (res) {
      $('dRes').innerHTML = pretty(res.body);
      if (res.status !== 200) { $('dKpis').innerHTML = errBox(res); $('dMap').getContext('2d').clearRect(0, 0, 1e4, 1e4); $('dLo').textContent = $('dHi').textContent = ''; return; }
      var r = res.body.results, over = r.die_max_c > LIMIT;
      $('dKpis').innerHTML = kpi('最热芯片', f(r.die_max_c) + ' °C', over ? 'th' : 'bl') + kpi('最热 HBM', f(r.hbm_max_c) + ' °C') + kpi('压降', f(r.dp_kpa, r.dp_kpa < 10 ? 2 : 1) + ' kPa') +
        kpi('出水温度', f(r.outlet_c) + ' °C') + kpi('距 ' + LIMIT + ' °C 上限', (r.margin_k >= 0 ? '' : '超 ') + f(Math.abs(r.margin_k)) + ' K', over ? 'th' : '') + kpi(ONLINE ? '服务端耗时' : '浏览器内耗时', (res.body.timing_ms < 1 ? '< 1 ms' : f(res.body.timing_ms, 2) + ' ms'), 'ai');
      drawField($('dMap'), res.body.field, res.body.field.lo, res.body.field.hi); colorbar($('dCb'));
      $('dLo').textContent = f(res.body.field.lo) + ' °C'; $('dHi').textContent = f(res.body.field.hi) + ' °C';
    });
  }
  $('dRun').onclick = runDesign;
  $('dVerify').onclick = function () {
    var body = designBody(), b = this; b.disabled = true; b.textContent = '求解器计算中…';
    $('dReq').innerHTML = reqText('/v1/design/verify', body);
    api('/v1/design/verify', body).then(function (res) {
      b.disabled = false; b.textContent = '用求解器复核';
      $('dRes').innerHTML = pretty(res.body); $('dVer').classList.remove('hide');
      if (res.status !== 200) { $('dVer').innerHTML = errBox(res); return; }
      var r = res.body;
      $('dVer').innerHTML = '<h3>求解器复核 <span class="badge info">/v1/design/verify</span></h3><table class="tbl"><tr><th></th><th>最热芯片</th><th>耗时</th></tr>' +
        '<tr><td>求解器（三维稳态导热）</td><td class="num">' + f(r.results.die_max_c, 2) + ' °C</td><td class="num">' + f(r.solver_seconds, 2) + ' s</td></tr>' +
        '<tr><td>代理模型</td><td class="num">' + f(r.surrogate.die_max_c, 2) + ' °C</td><td class="num">毫秒级</td></tr></table>' +
        '<p class="note">差 ' + f(r.surrogate.error_k, 2) + ' K。日常调用用代理模型；关键方案、或客户要求时，再用求解器复核。</p>';
    });
  };

  /* ---------- NT Sensor ---------- */
  var SEN = M.sensor;
  function sensorBody() {
    return { model: M.id, product: { channel_width_mm: SEN.geom[0], fin_thickness_mm: SEN.geom[1], fin_height_mm: SEN.geom[2], tim2_w_mk: SEN.tim2_w_mk },
      series: { t_s: SEN.t_s, power_kw: SEN.power_kw, flow_lpm: SEN.flow_lpm, inlet_c: SEN.inlet_c, hotspot_share: SEN.hotspot_share }, limit_c: LIMIT, hysteresis_k: 2 };
  }
  function drawSensorIn() {
    var t = SEN.t_s;
    plot($('sInP'), { series: [{ x: t, y: SEN.power_kw, color: css('--blue'), label: '总功耗 kW' }], xlab: '' });
    plot($('sInF'), { series: [{ x: t, y: SEN.flow_lpm, color: css('--cool'), label: '泵流量 L/min' }], xlab: '' });
    plot($('sInT'), { series: [{ x: t, y: SEN.inlet_c, color: css('--muted'), label: '进水温度 °C' }], xlab: '时间 s' });
  }
  function runSensor() {
    var body = sensorBody(); $('sReq').innerHTML = reqText('/v1/sensor/estimate', body);
    return api('/v1/sensor/estimate', body).then(function (res) {
      $('sRes').innerHTML = pretty(res.body);
      if (res.status !== 200) { $('sKpis').innerHTML = errBox(res); return; }
      var e = res.body.estimates, t = SEN.t_s, rx = SEN.ref_idx.map(function (i) { return t[i]; });
      var dev = SEN.ref_idx.map(function (i, k) { return Math.abs(e.die_max_c[i] - SEN.ref_die_c[k]); }), mae = dev.reduce(function (a, b) { return a + b; }, 0) / dev.length;
      plot($('sOut'), { series: [
        { x: t, y: e.die_max_c, color: css('--ai-deep'), width: 2.2, label: 'NT 估计：芯片最热点' },
        { x: rx, y: SEN.ref_die_c, color: '#16181A', dots: true, r: 3.2, label: '求解器参考点' },
        { x: t, y: e.outlet_c, color: '#9AA4AB', label: '出水温度（常规传感器）' }],
        hlines: [{ y: res.body.limit_c, color: '#B3261E', label: '上限 ' + res.body.limit_c + ' °C' }], xlab: '时间 s', ylab: '°C' });
      var A = res.body.alarms;
      $('sAlarms').innerHTML = A.map(function (a) { return '<li>' + f(a.start_s, 0) + '–' + f(a.end_s, 0) + ' s 报警，最高 ' + f(a.peak_c) + ' °C（' + f(a.at_s, 0) + ' s）</li>'; }).join('') || '<li style="color:var(--green-ink)">没有超限</li>';
      var mx = Math.max.apply(null, e.die_max_c);
      $('sKpis').innerHTML = kpi('报警段数', A.length, A.length ? 'th' : 'bl') + kpi('估计的最高温度', f(mx) + ' °C', mx > LIMIT ? 'th' : '') +
        kpi('与 30 个求解器参考点的平均差', f(mae, 2) + ' K', 'ai') + kpi(res.body.points + ' 个时刻 · ' + (ONLINE ? '服务端耗时' : '浏览器内耗时'), f(res.body.timing_ms, 1) + ' ms', 'bl');
    });
  }
  $('sRun').onclick = runSensor;

  /* ---------- NT Workflow ---------- */
  var WR = { channel_width_mm: [0.10, 0.60, 4], fin_thickness_mm: [0.10, 0.40, 4], fin_height_mm: [1.0, 5.0, 4], flow_lpm: [0.8, 4.0, 4] };
  var WF = { inlet_c: 40, power_kw: 2.28, tim2_w_mk: 5, hotspot_share: 0.15 };
  $('wForm').innerHTML = Object.keys(WR).map(function (k) {
    var L = LABEL[k], r = WR[k];
    return '<label class="full"><span>' + L[0] + '（' + L[1] + '）：最小 · 最大 · 点数</span><div class="trio3">' +
      ['lo', 'hi', 'n'].map(function (p, i) { return '<input type="number" step="' + (i === 2 ? 1 : L[2]) + '" value="' + r[i] + '" data-r="' + k + '" data-p="' + i + '">'; }).join('') + '</div></label>';
  }).join('') + Object.keys(WF).map(function (k) { return numInput(k, WF[k]); }).join('') +
    '<label><span>约束：最热芯片 ≤（°C）</span><input type="number" id="wTmax" value="' + LIMIT + '" step="1"></label>' +
    '<label><span>约束：压降 ≤（kPa）</span><input type="number" id="wDp" value="60" step="5"></label>' +
    '<label class="full"><span>目标</span><select id="wObj"><option value="min_die">最热芯片温度最低</option><option value="min_flow">满足约束、所需流量最小（省泵功）</option><option value="min_dp">满足约束、压降最小</option></select></label>';
  function flowBody() {
    var ranges = {}; Object.keys(WR).forEach(function (k) { ranges[k] = [0, 1, 2].map(function (i) { return +document.querySelector('[data-r="' + k + '"][data-p="' + i + '"]').value; }); });
    return { model: M.id, ranges: ranges, fixed: readForm($('wForm')), constraints: { die_max_c: +$('wTmax').value, dp_max_kpa: +$('wDp').value }, objective: $('wObj').value, top: 10 };
  }
  function wCount() {
    var b = flowBody(), n = Object.keys(b.ranges).reduce(function (p, k) { return p * Math.max(1, Math.round(b.ranges[k][2])); }, 1);
    $('wCount').innerHTML = '本次 <b>' + n.toLocaleString() + '</b> 个组合 · 演示上限 256';
    $('wReq').innerHTML = reqText('/v1/workflow/sweep', b);
  }
  $('wForm').addEventListener('input', function () { markRange($('wForm')); wCount(); });
  var lastSweep = null, lastVerify = null;
  function runFlow() {
    var body = flowBody(), btn = $('wRun'); btn.disabled = true; btn.textContent = '计算中…'; $('wReq').innerHTML = reqText('/v1/workflow/sweep', body);
    $('wVer').innerHTML = ''; lastVerify = null;
    return new Promise(function (ok) { setTimeout(ok, 30); }).then(function () { return api('/v1/workflow/sweep', body); }).then(function (res) {
      btn.disabled = false; btn.textContent = '提交批量分析';
      $('wRes').innerHTML = pretty(res.body);
      if (res.status !== 200) { $('wKpis').innerHTML = errBox(res); $('wTop').innerHTML = ''; lastSweep = null; return; }
      var r = res.body; lastSweep = { req: body, res: r };
      $('wKpis').innerHTML = kpi('个设计已评估', r.evaluated.toLocaleString(), 'bl') + kpi('个满足约束', r.feasible.toLocaleString(), r.feasible ? '' : 'th') +
        kpi('计算耗时', f(r.compute_seconds, 2) + ' s', 'ai') + kpi('求解器逐个算约需', f(r.solver_equivalent_hours, 1) + ' h');
      var ok = r.cloud.filter(function (p) { return p[2]; }), no = r.cloud.filter(function (p) { return !p[2]; });
      var allDp = r.cloud.map(function (p) { return p[0]; }).filter(function (v) { return v > 0; });
      var top1 = r.top[0];
      plot($('wSc'), { xlog: true, xMin: Math.max(0.1, Math.min.apply(null, allDp)), xMax: Math.max.apply(null, allDp), series: [
        { x: no.map(function (p) { return p[0]; }), y: no.map(function (p) { return p[1]; }), color: '#B9C1C7', dots: true, r: 2, alpha: .7, label: '不满足约束' },
        { x: ok.map(function (p) { return p[0]; }), y: ok.map(function (p) { return p[1]; }), color: css('--thermal'), dots: true, r: 2.4, alpha: .85, label: '满足约束' }]
        .concat(top1 ? [{ x: [top1.dp_kpa], y: [top1.die_max_c], color: css('--ai-deep'), dots: true, r: 6, label: '第 1 名' }] : []),
        hlines: [{ y: r.constraints.die_max_c, color: '#B3261E', label: '温度约束' }], vlines: [{ x: r.constraints.dp_max_kpa, color: '#B3261E', label: '压降约束' }],
        xlab: '压降 kPa（对数）', ylab: '最热芯片 °C' });
      $('wTop').innerHTML = '<tr><th>#</th><th>槽宽 mm</th><th>齿厚 mm</th><th>齿高 mm</th><th>流量 L/min</th><th>最热芯片 °C</th><th>最热 HBM °C</th><th>压降 kPa</th></tr>' +
        (r.top.length ? r.top.map(function (t) { var i = t.inputs; return '<tr' + (t.rank === 1 ? ' class="pick"' : '') + '><td>' + t.rank + '</td><td class="num">' + f(i.channel_width_mm, 3) + '</td><td class="num">' + f(i.fin_thickness_mm, 3) + '</td><td class="num">' + f(i.fin_height_mm, 2) + '</td><td class="num">' + f(i.flow_lpm, 2) + '</td><td class="num">' + f(t.die_max_c, 2) + '</td><td class="num">' + f(t.hbm_max_c, 2) + '</td><td class="num">' + f(t.dp_kpa, 2) + '</td></tr>'; }).join('')
          : '<tr><td colspan="8">没有设计满足约束，放宽约束或扩大范围再试。</td></tr>');
    });
  }
  $('wRun').onclick = runFlow;
  $('wVerify').onclick = function () {
    if (!lastSweep || !lastSweep.res.top.length) return;
    var body = { model: M.id, fixed: lastSweep.req.fixed, designs: lastSweep.res.top.slice(0, 3).map(function (t) { return t.inputs; }) }, b = this;
    b.disabled = true; b.textContent = '求解器计算中…'; $('wReq').innerHTML = reqText('/v1/workflow/verify', body);
    api('/v1/workflow/verify', body).then(function (res) {
      b.disabled = false; b.textContent = '用求解器复核前 3 名'; $('wRes').innerHTML = pretty(res.body);
      if (res.status !== 200) { $('wVer').innerHTML = errBox(res); return; }
      lastVerify = res.body.checks;
      $('wVer').innerHTML = '<table class="tbl mt"><tr><th>#</th><th>代理模型 °C</th><th>求解器 °C</th><th>差 K</th><th>求解器耗时</th></tr>' + lastVerify.map(function (c, i) {
        return '<tr><td>' + (i + 1) + '</td><td class="num">' + f(c.surrogate_die_c, 2) + '</td><td class="num">' + f(c.solver_die_c, 2) + '</td><td class="num">' + f(c.error_k, 2) + '</td><td class="num">' + f(c.solver_seconds, 2) + ' s</td></tr>'; }).join('') + '</table>';
    });
  };
  $('wReport').onclick = function () {
    if (!lastSweep) return;
    var q = lastSweep.req, r = lastSweep.res, L = [];
    L.push('# NT Workflow 批量分析报告（演示）', '', '- 请求编号：' + r.request_id, '- 模型：' + r.model.id + ' ' + r.model.version + '（' + M.title.zh + '，示意模型，尺寸近似）', '- 生成时间：' + new Date().toLocaleString('zh-CN'), '');
    L.push('## 条件', '', '| 项目 | 值 |', '|---|---|');
    Object.keys(q.ranges).forEach(function (k) { L.push('| ' + LABEL[k][0] + '（' + LABEL[k][1] + '） | ' + q.ranges[k][0] + '–' + q.ranges[k][1] + '，' + q.ranges[k][2] + ' 点 |'); });
    Object.keys(q.fixed).forEach(function (k) { L.push('| ' + LABEL[k][0] + (LABEL[k][1] ? '（' + LABEL[k][1] + '）' : '') + ' | ' + q.fixed[k] + ' |'); });
    L.push('| 约束 | 最热芯片 ≤ ' + r.constraints.die_max_c + ' °C，压降 ≤ ' + r.constraints.dp_max_kpa + ' kPa |', '| 目标 | ' + $('wObj').selectedOptions[0].textContent + ' |', '');
    L.push('## 结果', '', '评估 ' + r.evaluated.toLocaleString() + ' 个设计，' + r.feasible.toLocaleString() + ' 个满足约束；计算 ' + f(r.compute_seconds, 2) + ' s（求解器逐个算约 ' + f(r.solver_equivalent_hours, 1) + ' h）。', '');
    L.push('| # | 槽宽 mm | 齿厚 mm | 齿高 mm | 流量 L/min | 最热芯片 °C | 最热 HBM °C | 压降 kPa |', '|---|---|---|---|---|---|---|---|');
    r.top.forEach(function (t) { var i = t.inputs; L.push('| ' + [t.rank, i.channel_width_mm, i.fin_thickness_mm, i.fin_height_mm, i.flow_lpm, f(t.die_max_c, 2), f(t.hbm_max_c, 2), f(t.dp_kpa, 2)].join(' | ') + ' |'); });
    if (lastVerify) { L.push('', '## 求解器复核', '', '| # | 代理模型 °C | 求解器 °C | 差 K |', '|---|---|---|---|'); lastVerify.forEach(function (c, i) { L.push('| ' + (i + 1) + ' | ' + f(c.surrogate_die_c, 2) + ' | ' + f(c.solver_die_c, 2) + ' | ' + f(c.error_k, 2) + ' |'); }); }
    L.push('', '## 说明', '', '- 温度由代理模型预测（测试集最热芯片平均误差 ' + f(SM.die_mae_k, 2) + ' K、最大 ' + f(SM.die_max_k, 2) + ' K）；压降用解析公式。', '- 参考求解器为三维稳态导热模型，不是实测。', '- 只在模型已验证的参数范围内有效。');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([L.join('\n') + '\n'], { type: 'text/markdown' })); a.download = 'NT_批量分析报告_' + r.request_id + '.md'; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  };

  /* ---------- 接入与收费 ---------- */
  function drawAccess() {
    var base = location.origin + '/api-studio';
    $('epTbl').innerHTML = '<tr><th>接口</th><th>用途</th><th>返回</th><th>单次耗时</th></tr>' + [
      ['POST /v1/design/predict', 'NT Design 热预测', '最热点、压降、出水温度、温度场', '毫秒级'],
      ['POST /v1/sensor/estimate', 'NT Sensor 虚拟传感', '每个时刻的芯片最热点温度、报警段', '毫秒级（300 点）'],
      ['POST /v1/workflow/sweep', 'NT Workflow 批量分析', '可行数、方案排序、散点抽样', '公开演示 ≤256 组合'],
      ['GET /v1/health', '检查演示服务', '服务状态、模型版本', '—']
    ].map(function (r) { return '<tr><td class="num"><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('');
    $('exCurl').textContent = 'curl -s ' + base + '/v1/design/predict \\\n  -H "Authorization: Bearer ' + KEY + '" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "' + M.id + '", "return_field": false,\n       "inputs": {"channel_width_mm": 0.3, "fin_thickness_mm": 0.2,\n                  "fin_height_mm": 3.0, "flow_lpm": 2.0, "inlet_c": 40,\n                  "power_kw": 2.28, "tim2_w_mk": 5, "hotspot_share": 0.15}}\'';
    $('exPy').textContent = 'import json, urllib.request\n\nreq = urllib.request.Request(\n    "' + base + '/v1/design/predict",\n    data=json.dumps({"model": "' + M.id + '", "return_field": False, "inputs": {\n        "channel_width_mm": 0.3, "fin_thickness_mm": 0.2, "fin_height_mm": 3.0,\n        "flow_lpm": 2.0, "inlet_c": 40, "power_kw": 2.28,\n        "tim2_w_mk": 5, "hotspot_share": 0.15}}).encode(),\n    headers={"Authorization": "Bearer ' + KEY + '",\n             "Content-Type": "application/json"})\nres = json.load(urllib.request.urlopen(req))\nprint(res["results"]["die_max_c"], "°C")';
  }

  /* ---------- 标签页 ---------- */
  var tab = 'home', drawn = {};
  function showTab(name) {
    if (!$('p-' + name)) name = 'home';
    tab = name;
    document.body.dataset.page = name;
    var headings = {
      home: ['让热模型，<br>成为你的研发能力。', '连接设计工具与智能体，实时预测温度、感知热点、筛选方案。'],
      design: ['调整参数，即刻看见温度。', 'NT Design · 预测热点、温度场与压降。'],
      sensor: ['从运行数据，感知芯片热点。', 'NT Sensor · 估算温度，识别超限。'],
      flow: ['比较更多设计，找到更优方案。', 'NT Workflow · 设置约束，筛选候选。'],
      model: ['每一次预测，都有验证依据。', '对照求解器，查看误差与适用范围。'],
      access: ['让热模型接入你的工作流。', '支持设计软件、优化程序与智能体。']
    };
    $('page-title').innerHTML = headings[name][0];
    $('page-lead').textContent = headings[name][1];
    document.querySelectorAll('#tabs button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tab === name)); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === name); });
    document.querySelectorAll('.pane').forEach(function (p) { p.classList.toggle('on', p.id === 'p-' + name); });
    try { history.replaceState(null, '', '#' + name); } catch (e) {}
    if (name === 'model') drawModel();
    if (name === 'design' && !drawn.design) { drawn.design = 1; runDesign(); }
    if (name === 'sensor') { drawSensorIn(); if (!drawn.sensor) { drawn.sensor = 1; $('sReq').innerHTML = reqText('/v1/sensor/estimate', sensorBody()); runSensor(); } else runSensor(); }
    if (name === 'flow') { wCount(); if (!drawn.flow) { drawn.flow = 1; runFlow(); } }
    if (name === 'access') drawAccess();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('#tabs button').forEach(function (b) { b.onclick = function () { showTab(b.dataset.tab); }; });
  document.querySelectorAll('[data-go]').forEach(function (b) { if (!b.dataset.preset) b.onclick = function () { showTab(b.dataset.go); }; });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (tab === 'model') drawModel(); if (tab === 'sensor') { drawSensorIn(); runSensor(); } if (tab === 'flow' && lastSweep) runFlow(); }, 200); });

  function start() { setConn(); showTab((location.hash || '#home').slice(1)); }
  window.addEventListener('hashchange', function () { var h = (location.hash || '#home').slice(1); if (h !== tab) showTab(h); });
  if (/^https?:$/.test(location.protocol)) {
    fetch('/api-studio/v1/health').then(function (r) { return r.json(); }).then(function (j) { ONLINE = j.status === 'ok'; }).catch(function () { ONLINE = false; }).then(start);
  } else start();
  window.NT_UI = { showTab: showTab, online: function () { return ONLINE; }, runDesign: runDesign, runSensor: runSensor, runFlow: runFlow };
})();
