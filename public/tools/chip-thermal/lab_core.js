/* Chip Thermal Map Lab · core: data loading (file://-safe <script> injection), colour maps, small charts, linear algebra. */
var TML = window.TML = { data: {}, wait: {}, summary: [] };

TML.put = function (r) {
  var id = r.id;
  var b = atob(r.maps), q = new Uint8Array(b.length);
  for (var i = 0; i < b.length; i++) q[i] = b.charCodeAt(i);
  var xb = atob(r.x), xa = new Uint8Array(xb.length);
  for (i = 0; i < xb.length; i++) xa[i] = xb.charCodeAt(i);
  r.q = q; r.X = new Float32Array(xa.buffer); r.step = (r.hi - r.lo) / 255; r.px = r.w * r.h;
  delete r.maps; delete r.x;
  TML.data[id] = r;
  (TML.wait[id] || []).forEach(function (f) { f(r); });
  delete TML.wait[id];
};
TML.load = function (id) {
  return new Promise(function (ok, fail) {
    if (TML.data[id]) return ok(TML.data[id]);
    if (TML.wait[id]) return TML.wait[id].push(ok);
    TML.wait[id] = [ok];
    var s = document.createElement('script');
    s.src = 'data/' + id + '.js';
    s.onerror = function () { delete TML.wait[id]; fail(new Error('missing data/' + id + '.js')); };
    document.head.appendChild(s);
  });
};
/* temperature of frame k as Float32Array (decoded from 8-bit) */
TML.frame = function (r, k) {
  var o = new Float32Array(r.px), off = k * r.px;
  for (var i = 0; i < r.px; i++) o[i] = r.lo + r.q[off + i] * r.step;
  return o;
};
TML.timeMean = function (r) {
  if (r._mean) return r._mean;
  var m = new Float32Array(r.px);
  for (var k = 0; k < r.n; k++) { var off = k * r.px; for (var i = 0; i < r.px; i++) m[i] += r.q[off + i]; }
  for (i = 0; i < r.px; i++) m[i] = r.lo + m[i] / r.n * r.step;
  return (r._mean = m);
};
TML.timeMax = function (r) {
  if (r._max) return r._max;
  var m = new Uint8Array(r.px);
  for (var k = 0; k < r.n; k++) { var off = k * r.px; for (var i = 0; i < r.px; i++) if (r.q[off + i] > m[i]) m[i] = r.q[off + i]; }
  var o = new Float32Array(r.px);
  for (i = 0; i < r.px; i++) o[i] = r.lo + m[i] * r.step;
  return (r._max = o);
};

/* ---- colour maps ---- */
TML.turbo = function (t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  var r = 0.13572138 + t * (4.61539260 + t * (-42.66032258 + t * (132.13108234 + t * (-152.94239396 + t * 59.28637943))));
  var g = 0.09140261 + t * (2.19418839 + t * (4.84296658 + t * (-14.18503333 + t * (4.27729857 + t * 2.82956604))));
  var b = 0.10667330 + t * (12.64194608 + t * (-60.58204836 + t * (110.36276771 + t * (-89.90310912 + t * 27.34824973))));
  return [Math.max(0, Math.min(255, r * 255)), Math.max(0, Math.min(255, g * 255)), Math.max(0, Math.min(255, b * 255))];
};
TML.diverge = function (t) { /* 0 blue · 0.5 white · 1 red */
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  if (t < 0.5) { var a = t / 0.5; return [31 + a * 224, 95 + a * 160, 168 + a * 87]; }
  a = (t - 0.5) / 0.5; return [255 - a * 55, 255 - a * 205, 255 - a * 205];
};
TML.lut = function (f) { var L = new Uint8ClampedArray(256 * 3); for (var i = 0; i < 256; i++) { var c = f(i / 255); L[i * 3] = c[0]; L[i * 3 + 1] = c[1]; L[i * 3 + 2] = c[2]; } return L; };
TML.stops = function (st) { /* piecewise-linear colormap from [pos, r, g, b] stops */
  return function (x) {
    for (var i = 1; i < st.length; i++) if (x <= st[i][0] || i === st.length - 1) {
      var a = st[i - 1], b = st[i], u = Math.max(0, Math.min(1, (x - a[0]) / (b[0] - a[0])));
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
    }
  };
};
/* power density on a white ground: white → yellow → orange → red → dark red, distinct from the turbo temperature scale */
TML.heat = TML.stops([[0, 255, 255, 255], [0.2, 255, 237, 160], [0.45, 254, 178, 76], [0.72, 240, 59, 32], [1, 177, 0, 38]]);
TML.LUT = { turbo: TML.lut(TML.turbo), div: TML.lut(TML.diverge), heat: TML.lut(TML.heat) };

/* draw a field (Float32Array w*h) into canvas at native resolution, then return nothing; caller scales via CSS */
TML.paint = function (cv, field, w, h, lo, hi, lut) {
  cv.width = w; cv.height = h;
  if (cv.parentNode && cv.parentNode.classList.contains('mapwrap')) { cv.style.width = 'min(100%, ' + Math.round(620 * w / h) + 'px)'; cv.style.margin = '0 auto'; } /* cap tall maps at ~620 px high */
  var ctx = cv.getContext('2d'), img = ctx.createImageData(w, h), d = img.data, s = 255 / ((hi - lo) || 1);
  for (var i = 0; i < w * h; i++) {
    var k = Math.round((field[i] - lo) * s); k = k < 0 ? 0 : k > 255 ? 255 : k;
    d[i * 4] = lut[k * 3]; d[i * 4 + 1] = lut[k * 3 + 1]; d[i * 4 + 2] = lut[k * 3 + 2]; d[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return ctx;
};
TML.colorbar = function (cv, lut) {
  cv.width = 256; cv.height = 1;
  var ctx = cv.getContext('2d'), img = ctx.createImageData(256, 1);
  for (var i = 0; i < 256; i++) { img.data[i * 4] = lut[i * 3]; img.data[i * 4 + 1] = lut[i * 3 + 1]; img.data[i * 4 + 2] = lut[i * 3 + 2]; img.data[i * 4 + 3] = 255; }
  ctx.putImageData(img, 0, 0);
};

/* ---- charts ---- */
TML.css = function (v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); };
TML.setup = function (cv) {
  var dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
  cv.width = Math.max(10, Math.round(r.width * dpr)); cv.height = Math.max(10, Math.round(r.height * dpr));
  var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, r.width, r.height);
  ctx.font = '12px ' + TML.css('--font-sans');
  return { ctx: ctx, W: r.width, H: r.height };
};
/* series: [{y:[...], color, width, dash, label}], opts: {x0, marker, ylab, yMin, yMax, bars} */
TML.lines = function (cv, series, opts) {
  opts = opts || {};
  var c = TML.setup(cv), ctx = c.ctx, L = 42, R = 10, T = 18, B = 22, w = c.W - L - R, h = c.H - T - B;
  var all = []; series.forEach(function (s) { s.y.forEach(function (v) { if (isFinite(v)) all.push(v); }); });
  if (!all.length) return;
  var lo = opts.yMin != null ? opts.yMin : Math.min.apply(null, all), hi = opts.yMax != null ? opts.yMax : Math.max.apply(null, all);
  if (hi - lo < 1e-6) { hi += 0.5; lo -= 0.5; }
  var pad = (hi - lo) * 0.08; if (opts.yMin == null) lo -= pad; if (opts.yMax == null) hi += pad;
  var n = series[0].y.length, X = function (i) { return L + (n <= 1 ? 0 : i / (n - 1) * w); }, Y = function (v) { return T + (1 - (v - lo) / (hi - lo)) * h; };
  ctx.strokeStyle = TML.css('--line'); ctx.fillStyle = TML.css('--muted'); ctx.lineWidth = 1;
  for (var g = 0; g <= 4; g++) {
    var v = lo + (hi - lo) * g / 4, y = Y(v);
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + w, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(v.toFixed(Math.abs(hi - lo) < 3 ? 2 : 1), L - 4, y + 4);
  }
  ctx.textAlign = 'left';
  if (opts.xlab) ctx.fillText(opts.xlab, L, c.H - 4);
  if (opts.bars) {
    var bw = w / n * 0.7;
    series.forEach(function (s, si) {
      ctx.fillStyle = s.color;
      s.y.forEach(function (v, i) { var x = L + (i + 0.5) / n * w - bw / 2 + si * bw / series.length; ctx.fillRect(x, Y(v), bw / series.length, Y(lo) - Y(v)); });
    });
  } else series.forEach(function (s) {
    ctx.strokeStyle = s.color; ctx.lineWidth = s.width || 1.6; ctx.setLineDash(s.dash || []);
    ctx.beginPath(); var st = false;
    s.y.forEach(function (v, i) { if (!isFinite(v)) { st = false; return; } if (!st) { ctx.moveTo(X(i), Y(v)); st = true; } else ctx.lineTo(X(i), Y(v)); });
    ctx.stroke(); ctx.setLineDash([]);
  });
  if (opts.marker != null) { ctx.strokeStyle = TML.css('--fg'); ctx.globalAlpha = .35; ctx.beginPath(); ctx.moveTo(X(opts.marker), T); ctx.lineTo(X(opts.marker), T + h); ctx.stroke(); ctx.globalAlpha = 1; }
  var lx = L + 4;
  series.forEach(function (s) { if (!s.label) return; ctx.fillStyle = s.color; ctx.fillRect(lx, 4, 10, 3); ctx.fillStyle = TML.css('--muted'); ctx.fillText(s.label, lx + 14, 10); lx += ctx.measureText(s.label).width + 30; });
};
TML.hist = function (cv, vals, lo, hi, bins, color) {
  var cnt = new Array(bins).fill(0);
  for (var i = 0; i < vals.length; i++) { var k = Math.floor((vals[i] - lo) / (hi - lo) * bins); k = k < 0 ? 0 : k >= bins ? bins - 1 : k; cnt[k]++; }
  var c = TML.setup(cv), ctx = c.ctx, L = 10, B = 20, w = c.W - 20, h = c.H - B - 6, mx = Math.max.apply(null, cnt);
  for (i = 0; i < bins; i++) {
    var t = (i + 0.5) / bins, col = TML.turbo(t);
    ctx.fillStyle = color || 'rgb(' + col.map(Math.round).join(',') + ')';
    var bh = cnt[i] / mx * h; ctx.fillRect(L + i / bins * w, 6 + h - bh, w / bins - 1, bh);
  }
  ctx.fillStyle = TML.css('--muted'); ctx.textAlign = 'left'; ctx.fillText(lo.toFixed(1) + ' °C', L, c.H - 4);
  ctx.textAlign = 'right'; ctx.fillText(hi.toFixed(1) + ' °C', L + w, c.H - 4);
};

/* ---- linear algebra (small dense, row-major arrays of arrays) ---- */
TML.jacobi = function (A) { /* symmetric eigen: returns {val:[], vec: columns as arrays} sorted desc */
  var n = A.length, a = A.map(function (r) { return r.slice(); }), V = [];
  for (var i = 0; i < n; i++) { V.push(new Array(n).fill(0)); V[i][i] = 1; }
  for (var sweep = 0; sweep < 60; sweep++) {
    var off = 0;
    for (var p = 0; p < n; p++) for (var q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < 1e-18) break;
    for (p = 0; p < n; p++) for (q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      var th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (var k = 0; k < n; k++) { var akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (k = 0; k < n; k++) { var apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (k = 0; k < n; k++) { var vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  var idx = []; for (i = 0; i < n; i++) idx.push(i);
  idx.sort(function (x, y) { return a[y][y] - a[x][x]; });
  return { val: idx.map(function (i) { return a[i][i]; }), vec: idx.map(function (j) { return V.map(function (r) { return r[j]; }); }) };
};
TML.solve = function (A, Bm) { /* Gaussian elimination with partial pivoting; A n x n, B n x m -> X n x m */
  var n = A.length, m = Bm[0].length, a = A.map(function (r, i) { return r.concat(Bm[i]); });
  for (var c = 0; c < n; c++) {
    var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[piv][c])) piv = r;
    var tmp = a[c]; a[c] = a[piv]; a[piv] = tmp;
    for (r = 0; r < n; r++) if (r !== c) { var f = a[r][c] / a[c][c]; if (f) for (var k = c; k < n + m; k++) a[r][k] -= f * a[c][k]; }
  }
  return a.map(function (row, i) { return row.slice(n).map(function (v) { return v / row[i]; }); });
};
