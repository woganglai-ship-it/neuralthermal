/* Chip Thermal Map Lab · UI. Classic script (file:// safe). Commercial build: simulation only, no third-party measured data or media. Depends on lab_core.js, catalog.js. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var LANG = 'zh';
  try { LANG = localStorage.getItem('tml-lang') || ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'); } catch (e) {}
  var qLang = new URLSearchParams(location.search).get('lang'); if (qLang === 'zh' || qLang === 'en') LANG = qLang;
  var CAT = window.TML_CATALOG || { chips: [] };


  var STR = {
    zh: {
      label: '芯片热实验室',
      chip: '芯片',
      load: '负载',
      power: '功耗',
      rth: '散热热阻',
      tamb: '冷却温度',
      ihs: '铜均热盖（IHS）',
      p3Fp: '芯片模块',
      p3Pw: '功率密度',
      p3T: '温度',
      mHoverHint: '鼠标移到任一张图上，三张图同步读数。',
      modTitle: '各模块功耗与温度',
      modKind: '模块',
      modN: '数量',
      modW: '功耗',
      modTavg: '平均 °C',
      modTmax: '最高 °C',
      simMax: '最高温度',
      simMean: '平均温度',
      spreadT: '片上温差',
      simRise: '温升',
      pdPeak: '峰值功率密度',
      pdAvg: '平均功率密度',
      tjLim: '最高结温',
      simOver: '已超过',
      simOk: '未超过',
      simCheck: '均匀发热校验',
      simWarn: '简化模型：二维稳态导热，散热器按一个总热阻计算。芯片模块图按公开参数（核心数、GPC 数、显存位宽、硅片面积）生成，是示意，不是厂商版图；各模块功耗占比和热阻为假设值。',
      h1: 'CPU / GPU 的功率与温度分布',
      lead: '选一颗芯片，看它的模块、功率密度和温度分布。全部为模拟结果。',
      foot: '“功率与温度”为简化模拟，不是实测。芯片模块图按公开参数生成，是示意，不是厂商版图。芯片规格来自厂商产品页等公开资料，见各型号的来源链接。本页离线运行。'
    },
    en: {
      label: 'Chip thermal lab',
      chip: 'Chip',
      load: 'Load',
      power: 'Power',
      rth: 'Cooling resistance',
      tamb: 'Coolant',
      ihs: 'Copper lid (IHS)',
      p3Fp: 'Modules',
      p3Pw: 'Power density',
      p3T: 'Temperature',
      mHoverHint: 'Hover over any map to read all three at the same spot.',
      modTitle: 'Power and temperature by module',
      modKind: 'Module',
      modN: 'Count',
      modW: 'Power',
      modTavg: 'Mean °C',
      modTmax: 'Max °C',
      simMax: 'Peak temperature',
      simMean: 'Mean temperature',
      spreadT: 'On-die spread',
      simRise: 'Rise',
      pdPeak: 'Peak power density',
      pdAvg: 'Average power density',
      tjLim: 'Max junction',
      simOver: 'exceeded',
      simOk: 'not exceeded',
      simCheck: 'Uniform-power check',
      simWarn: 'Simplified model: 2-D steady conduction with one lumped cooler resistance. Module layouts are generated from public figures (core / GPC counts, memory width, die area) — schematic, not vendor floorplans; module power shares and resistances are assumed.',
      h1: 'Power and temperature across CPUs and GPUs',
      lead: 'Pick a chip to see its modules, power density and temperature. Everything here is simulated.',
      foot: '"Power & heat" is a simplified simulation, not a measurement. Module layouts are generated from public figures — schematic, not vendor floorplans. Chip specs come from vendor product pages and other public sources, linked for each chip. Runs offline.'
    }
  };
  function t(k) { return (STR[LANG] && STR[LANG][k]) || STR.zh[k] || k; }
  function L2(o) { return o == null ? '' : typeof o === 'string' ? o : (o[LANG] || o.en || o.zh || ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function kpi(label, val, cls) { return '<div class="kpi ' + (cls || '') + '"><b>' + val + '</b><span>' + label + '</span></div>'; }
  function f1(v) { return (+v).toFixed(1); }

  function applyLang() {
    document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.dataset.t); });
    $('lang').textContent = LANG === 'zh' ? 'EN' : '中文';
    document.title = (LANG === 'zh' ? '芯片热实验室' : 'Chip thermal lab') + ' · NeuralThermal';
    $('foot').textContent = t('foot');
  }
  /* NeuralThermal mark and wordmark, copied unchanged from the official site (070 NT Website/source/src/logo.js) */
  var LOGO = '<svg class="mark" viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true"><g stroke="#0b6bcb" stroke-width="1.4"><path d="M2 3 L24 29"/><path d="M22 3 L6 29"/><path d="M2 3 L28 29"/><path d="M28 3 L4 29"/><path d="M23 3 L13 29"/><path d="M9 3 L29 29"/></g><path d="M11 3 L23 29" stroke="#e2580a" stroke-width="1.9"/></svg><span>Neural<svg class="t" viewBox="0 0 62 72" aria-hidden="true"><rect width="20" height="15" fill="#2FD4E8"/><rect x="21" width="20" height="15" fill="currentColor"/><rect x="42" width="20" height="15" fill="#76B900"/><rect x="21" y="15" width="20" height="57" fill="currentColor"/></svg>hermal</span>';
  $('brand').innerHTML = LOGO; $('brand2').innerHTML = LOGO;

  function srcLinks(c) { return (c.src || []).map(function (u, i) { return '<a href="' + esc(u) + '" target="_blank" rel="noopener">[' + (i + 1) + ']</a>'; }).join(' '); }

  /* ---------- chip · power · temperature (simplified steady conduction) ---------- */
  var TPL = window.TML_TEMPLATES || {}, KINDS = window.TML_KINDS || {};
  var SIM = { ready: false }, TPLC = {};
  function tplFor(c) {
    if (c.gpu) return TPLC[c.id] || (TPLC[c.id] = window.TML_GPU(c.gpu));
    if ((c.cpu || c.tiles) && !TPLC[c.id]) { TPLC[c.id] = c.cpu ? window.TML_CPU(c.cpu) : window.TML_TILES(c.tiles); if (c.R) TPLC[c.id].ihs = false; } /* laptops: bare die, no lid */
    if (c.cpu || c.tiles) return TPLC[c.id];
    return TPL[c.template];
  }
  function simChips() { return CAT.chips.filter(function (c) { return c.dieMm2 && (c.gpu || c.cpu || c.tiles || (c.template && TPL[c.template])); }); }
  function chipById(id) { return CAT.chips.filter(function (x) { return x.id === id; })[0]; }
  function simInit(id) {
    var sel = $('mChip');
    if (!SIM.ready) {
      var groups = { Intel: [], AMD: [], NVIDIA: [] }, keep = id || sel.value;
      simChips().forEach(function (c) { var v = c.name.split(' ')[0]; (groups[v] = groups[v] || []).push(c); });
      sel.innerHTML = Object.keys(groups).filter(function (g) { return groups[g].length; }).map(function (g) {
        return '<optgroup label="' + g + '">' + groups[g].map(function (c) { return '<option value="' + c.id + '">' + esc(c.name.replace(/^(NVIDIA GeForce |NVIDIA |Intel Core |Intel |AMD )/, '')) + '</option>'; }).join('') + '</optgroup>';
      }).join('');
      SIM.ready = true; sel.value = keep && chipById(keep) ? keep : 'rtx5090'; if (!sel.value) sel.selectedIndex = 0; simChip();
    } else if (id) { sel.value = id; simChip(); } else simRun();
  }
  function simChip() {
    var c = chipById($('mChip').value); if (!c) return;
    var tp = tplFor(c), R0 = c.R || tp.R || Math.min(0.4, Math.max(0.06, 35 / c.tdpW)); /* GPU cooler sized for ~35 K rise at rated power (assumed) */
    $('mP').max = Math.round(Math.max(20, c.tdpW * 1.5)); $('mP').min = 1; $('mP').step = 1; $('mP').value = c.tdpW;
    $('mR').min = -1.7; $('mR').max = 0.4; $('mR').step = 0.01; $('mR').value = Math.log10(R0);
    $('mT').value = c.Ta || tp.Ta || 35; $('mIhs').checked = !!tp.ihs; $('mIhs').parentNode.style.display = tp.ihs ? '' : 'none';
    $('mLoad').innerHTML = Object.keys(tp.loads).map(function (k) { return '<option value="' + k + '">' + esc(L2(tp.loads[k].name)) + '</option>'; }).join('');
    $('mSpec').innerHTML = '<b>' + esc(c.name) + '</b> · ' + [c.arch, c.cores, c.tdp, c.tj, c.die].map(L2).filter(Boolean).map(esc).join(' · ') + ' ' + srcLinks(c);
    simRun();
  }
  function simLoad() { /* light loads (single core, video encode) start from a lower total power */
    var c = chipById($('mChip').value), tp = tplFor(c), ld = tp.loads[$('mLoad').value];
    $('mP').value = Math.round(c.tdpW * (ld && ld.pf || 1)); simRun();
  }
  function kindName(k) { return L2((KINDS[k] || {}).n || k); }
  function big(cv, field, nx, ny, lo, hi, lut, S, smooth) { /* paint the nx×ny field, then scale it up S× so outlines and labels stay sharp */
    var small = document.createElement('canvas'); TML.paint(small, field, nx, ny, lo, hi, lut);
    cv.width = nx * S; cv.height = ny * S;
    var ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = !!smooth; ctx.drawImage(small, 0, 0, nx * S, ny * S);
    return ctx;
  }
  function outline(ctx, blocks, W, H, col) {
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, W / 500);
    blocks.forEach(function (b) { ctx.strokeRect(b.r[0] * W, b.r[1] * H, b.r[2] * W, b.r[3] * H); });
  }
  function drawFloor(blocks, nx, ny, S, mono) {
    var cv = $('mfp'), W = nx * S, H = ny * S; cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
    var used = [];
    blocks.forEach(function (b) {
      var k = KINDS[b.k] || { c: '#888' }, x = b.r[0] * W, y = b.r[1] * H, w = b.r[2] * W, h = b.r[3] * H;
      if (used.indexOf(b.k) < 0) used.push(b.k);
      ctx.fillStyle = k.c; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
      var full = L2(b.n || kindName(b.k)), fs = Math.min(15, h * 0.45, W / 26), lab = full;
      if (fs < 7) return;
      ctx.font = '600 ' + fs + 'px ' + TML.css('--font-sans');
      var num = full.match(/\d+$/);
      if (ctx.measureText(lab).width > w - 4) lab = b.s || (num ? num[0] : full);
      if (!lab || ctx.measureText(lab).width > w - 2) return;
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, x + w / 2, y + h / 2);
    });
    $('mLeg').innerHTML = used.map(function (k) { return '<span><i style="background:' + (KINDS[k] || {}).c + '"></i>' + esc(kindName(k)) + '</span>'; }).join('');
  }
  function simRun() {
    var c = chipById($('mChip').value); if (!c) return;
    var tp = tplFor(c), load = tp.loads[$('mLoad').value] || tp.loads[Object.keys(tp.loads)[0]];
    var P = +$('mP').value, R = Math.pow(10, +$('mR').value), Ta = +$('mT').value, ihs = tp.ihs ? $('mIhs').checked : false;
    $('mPv').textContent = P + ' W'; $('mRv').textContent = R.toFixed(R < 0.1 ? 3 : 2) + ' K/W'; $('mTv').textContent = Ta + ' °C';
    /* domain: template aspect, area scaled so that the silicon covers c.dieMm2 (monolithic dies: the whole rectangle is silicon) */
    var nx = 80, ny = Math.round(80 / (tp.aspect || 1)), blocks = tp.blocks;
    var dieFrac = tp.mono ? 1 : blocks.reduce(function (s, b) { return s + b.r[2] * b.r[3]; }, 0), Adom = c.dieMm2 / dieFrac * 1e-6, dx = Math.sqrt(Adom / (nx * ny));
    var Gsi = 130 * 0.0005, Gcu = 390 * 0.002 + (ihs ? 390 * 0.002 : 0), /* silicon 0.5 mm; cooler copper base / vapour chamber ≈2 mm effective; + 2 mm lid */ G = new Float64Array(nx * ny), q = new Float64Array(nx * ny), onDie = new Uint8Array(nx * ny), owner = new Int16Array(nx * ny).fill(-1);
    /* power per block kind, spread over that kind's area */
    var area = {};
    blocks.forEach(function (b) { area[b.k] = (area[b.k] || 0) + b.r[2] * b.r[3]; });
    var shareSum = 0; Object.keys(load.share).forEach(function (k) { if (area[k]) shareSum += load.share[k]; });
    blocks.forEach(function (b, bi) {
      var x0 = Math.round(b.r[0] * nx), y0 = Math.round(b.r[1] * ny), x1 = Math.round((b.r[0] + b.r[2]) * nx), y1 = Math.round((b.r[1] + b.r[3]) * ny);
      for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) { onDie[y * nx + x] = 1; owner[y * nx + x] = bi; }
    });
    var i, x, y;
    if (tp.mono) for (y = 0; y < ny; y++) for (x = 0; x < nx; x++) { /* monolithic die: thin drawing gaps belong to the neighbouring block */
      i = y * nx + x; if (owner[i] >= 0) continue;
      owner[i] = x > 0 && owner[i - 1] >= 0 ? owner[i - 1] : y > 0 && owner[i - nx] >= 0 ? owner[i - nx] : x < nx - 1 && owner[i + 1] >= 0 ? owner[i + 1] : -1;
    }
    var cellsOf = new Float64Array(blocks.length); for (i = 0; i < owner.length; i++) if (owner[i] >= 0) cellsOf[owner[i]]++;
    for (i = 0; i < owner.length; i++) {
      var bi = owner[i]; if (bi < 0) continue; var b = blocks[bi];
      var off = load.only && load.only.length && load.only.indexOf(bi) < 0;
      q[i] = off ? 0 : (load.share[b.k] || 0) / shareSum * P * (b.r[2] * b.r[3]) / area[b.k] / cellsOf[bi];
    }
    var tq = 0; for (i = 0; i < q.length; i++) tq += q[i]; if (tq > 0) for (i = 0; i < q.length; i++) q[i] *= P / tq; /* exact total after rounding to cells */
    if (tp.mono) onDie.fill(1);
    var dieCells = 0; for (i = 0; i < G.length; i++) { G[i] = (onDie[i] ? Gsi : 0) + Gcu + 1e-6; dieCells += onDie[i]; }
    var hA = 1 / (R * nx * ny); /* the cooler covers the whole footprint */
    var T = new Float64Array(nx * ny).fill(Ta + P * R), w = 1.9;
    for (var it = 0; it < 6000; it++) {
      var dmax = 0;
      for (y = 0; y < ny; y++) for (x = 0; x < nx; x++) {
        i = y * nx + x; var sg = hA, st = hA * Ta + q[i], g;
        if (x > 0) { g = 2 * G[i] * G[i - 1] / (G[i] + G[i - 1]); sg += g; st += g * T[i - 1]; }
        if (x < nx - 1) { g = 2 * G[i] * G[i + 1] / (G[i] + G[i + 1]); sg += g; st += g * T[i + 1]; }
        if (y > 0) { g = 2 * G[i] * G[i - nx] / (G[i] + G[i - nx]); sg += g; st += g * T[i - nx]; }
        if (y < ny - 1) { g = 2 * G[i] * G[i + nx] / (G[i] + G[i + nx]); sg += g; st += g * T[i + nx]; }
        var nv = T[i] + w * (st / sg - T[i]); dmax = Math.max(dmax, Math.abs(nv - T[i])); T[i] = nv;
      }
      if (dmax < 1e-5) break;
    }
    var cm2 = dx * dx * 1e4, f = new Float32Array(T.length), pd = new Float32Array(T.length), lo = 1e9, hi = -1e9, mean = 0, hot = 0, pmax = 0;
    for (i = 0; i < T.length; i++) { f[i] = T[i]; pd[i] = q[i] / cm2; if (pd[i] > pmax) pmax = pd[i]; if (onDie[i]) { if (T[i] > hi) { hi = T[i]; hot = i; } if (T[i] < lo) lo = T[i]; mean += T[i]; } }
    mean /= dieCells;
    for (i = 0; i < f.length; i++) if (!onDie[i]) f[i] = lo;
    var S = 8, W = nx * S, H = ny * S;
    drawFloor(blocks, nx, ny, S, tp.mono);
    var pctx = big($('mpw'), pd, nx, ny, 0, pmax || 1, TML.LUT.heat, S, false);
    outline(pctx, blocks, W, H, 'rgba(22,24,26,.18)');
    var ctx = big($('mcv'), f, nx, ny, lo, hi, TML.LUT.turbo, S, true);
    ctx.fillStyle = '#FFFFFF'; for (i = 0; i < f.length; i++) if (!onDie[i]) ctx.fillRect((i % nx) * S, Math.floor(i / nx) * S, S, S); /* no silicon: white ground */
    outline(ctx, blocks, W, H, 'rgba(255,255,255,.45)');
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc((hot % nx + .5) * S, (Math.floor(hot / nx) + .5) * S, 3.5 * S, 0, 7); ctx.stroke();
    TML.colorbar($('mpb'), TML.LUT.heat); $('mpbLo').textContent = '0 W/cm²'; $('mpbHi').textContent = pmax.toFixed(0) + ' W/cm²';
    TML.colorbar($('mcb'), TML.LUT.turbo); $('mcbLo').textContent = lo.toFixed(1) + ' °C'; $('mcbHi').textContent = hi.toFixed(1) + ' °C';
    var tj = c.tjC, over = tj && hi > tj, avgPd = P / (c.dieMm2 / 100);
    $('mKpis').innerHTML = kpi(t('simMax'), hi.toFixed(1) + ' °C', over ? 'th' : 'bl') + kpi(t('simMean'), mean.toFixed(1) + ' °C') + kpi(t('spreadT'), (hi - lo).toFixed(1) + ' K', 'bl') + kpi(t('simRise'), (hi - Ta).toFixed(1) + ' K') + kpi(t('pdPeak'), pmax.toFixed(0) + ' W/cm²', 'ai') + kpi(t('pdAvg'), avgPd.toFixed(0) + ' W/cm²');
    /* per-module table, grouped by kind */
    var agg = {}, order = [];
    for (i = 0; i < T.length; i++) {
      var b = owner[i]; if (b < 0) continue; var k = blocks[b].k;
      if (!agg[k]) { agg[k] = { n: {}, W: 0, cells: 0, tmax: -1e9, tsum: 0 }; order.push(k); }
      var a = agg[k]; a.n[b] = 1; a.W += q[i]; a.cells++; a.tsum += T[i]; if (T[i] > a.tmax) a.tmax = T[i];
    }
    order.sort(function (x, y) { return agg[y].W - agg[x].W; });
    $('mTbl').innerHTML = '<tr><th>' + t('modKind') + '</th><th>' + t('modN') + '</th><th>' + t('modW') + '</th><th>W/cm²</th><th>' + t('modTavg') + '</th><th>' + t('modTmax') + '</th></tr>' + order.map(function (k) {
      var a = agg[k];
      return '<tr><td><i class="sw" style="background:' + (KINDS[k] || {}).c + '"></i>' + esc(kindName(k)) + '</td><td class="num">' + Object.keys(a.n).length + '</td><td class="num">' + a.W.toFixed(a.W < 10 ? 1 : 0) + ' W · ' + (a.W / P * 100).toFixed(0) + '%</td><td class="num">' + (a.W / (a.cells * cm2)).toFixed(0) + '</td><td class="num">' + (a.tsum / a.cells).toFixed(1) + '</td><td class="num">' + a.tmax.toFixed(1) + '</td></tr>';
    }).join('');
    $('mNote').textContent = (tj ? (over ? '⚠ ' : '') + t('tjLim') + ' ' + tj + ' °C ' + (over ? t('simOver') : t('simOk')) + ' · ' : '') + t('simCheck') + ' ' + (Ta + P * R).toFixed(1) + ' °C = Ta + P·R · ' + t('simWarn') + ' ' + L2(tp.note || '');
    SIM.T = T; SIM.pd = pd; SIM.nx = nx; SIM.ny = ny; SIM.blocks = blocks; SIM.owner = owner;
  }
  function simHover(e) {
    if (!SIM.T) return; var b = e.currentTarget.getBoundingClientRect(), x = Math.floor((e.clientX - b.left) / b.width * SIM.nx), y = Math.floor((e.clientY - b.top) / b.height * SIM.ny);
    if (x < 0 || y < 0 || x >= SIM.nx || y >= SIM.ny) return;
    var i = y * SIM.nx + x, bk = SIM.blocks[SIM.owner[i]];
    $('mHover').textContent = (bk ? L2(bk.n || bk.k) + ' (' + kindName(bk.k) + ') · ' : '') + SIM.pd[i].toFixed(0) + ' W/cm² · ' + SIM.T[i].toFixed(1) + ' °C';
  }

  /* ---------- events ---------- */
  $('lang').onclick = function () { LANG = LANG === 'zh' ? 'en' : 'zh'; try { localStorage.setItem('tml-lang', LANG); } catch (e) {} applyLang(); SIM.ready = false; simInit(); };
  $('mChip').onchange = simChip; ['mP', 'mR', 'mT'].forEach(function (x) { $(x).oninput = simRun; }); $('mLoad').onchange = simLoad; $('mIhs').onchange = simRun;
  ['mfp', 'mpw', 'mcv'].forEach(function (x) { $(x).onmousemove = simHover; });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { simInit(); }, 150); });

  /* ---------- start ---------- */
  applyLang();
  simInit(new URLSearchParams(location.search).get('chip'));
  window.TML_UI = { simChip: function (id) { simInit(id); }, state: function () { return { sim: $('mChip').value }; } };
})();
