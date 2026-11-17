/* NeuralThermal review site · app (v3). Hash routes so every page deep-links from file:// (index.html?lang=en#/industries/motors).
   Language: per-tab override (set by the switch) > ?lang= > saved manual choice > trusted region hint (online only) >
   browser language / locale region > English. No scroll animations (v3 brief: no unnecessary animation). */
(function () {
  var NT = window.NT;
  var EMAIL = 'tech@neuralthermal.com';
  var BUILD = '2026-10-26';

  // ------------------------------------------------------------------ language
  var ZH_REGIONS = /^(cn|hk|mo|tw)$/;
  function storage(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function session(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; }
  }
  function valid(l) { return l === 'zh' || l === 'en' ? l : null; }
  function detect() {
    var q = valid(new URLSearchParams(location.search).get('lang'));
    var s = valid(session('nt-lang-tab'));
    if (s) return { lang: s, why: 'manual' };
    if (q) return { lang: q, why: 'url' };
    var m = valid(storage('nt-lang'));
    if (m) return { lang: m, why: 'manual' };
    // Online deployments may fill <meta name="nt-geo-country"> from a trusted edge header. Empty in this local build.
    var geo = (document.querySelector('meta[name="nt-geo-country"]') || {}).content;
    if (geo) return { lang: ZH_REGIONS.test(geo.toLowerCase()) ? 'zh' : 'en', why: 'region' };
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    var first = String(list[0]).toLowerCase();
    var region = first.split('-')[1] || '';
    return { lang: first.indexOf('zh') === 0 || ZH_REGIONS.test(region) ? 'zh' : 'en', why: 'browser' };
  }
  var L = detect();
  var lang = L.lang;
  function t(o) { return o == null ? '' : typeof o === 'string' ? o : o[lang] != null ? o[lang] : o.zh; }
  function setLang(l) {
    lang = l;
    L = { lang: l, why: 'manual' };
    storage('nt-lang', l);
    session('nt-lang-tab', l);
    try {
      var u = new URL(location.href);
      u.searchParams.set('lang', l);
      history.replaceState(null, '', u.href);
    } catch (e) { /* some browsers refuse replaceState on file://; the tab override above still applies */ }
    render();
  }
  var fmtDate = function (iso) {
    return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso + 'T12:00:00'));
  };

  // ------------------------------------------------------------------ UI strings
  var U = {
    nav: { labs: {zh:'实验室',en:'Labs'}, hub: {zh:'NT Hub',en:'NT Hub'}, apiStudio: {zh:'开发者中心',en:'Developer Center'}, products: { zh: '产品', en: 'Products' }, industries: { zh: '行业', en: 'Industries' }, cases: { zh: '案例与演示', en: 'Cases & demos' }, engage: { zh: '合作方式', en: 'How we work' }, about: { zh: '关于', en: 'About' } },
    contact: { zh: '联系', en: 'Contact' },
    menu: { zh: '菜单', en: 'Menu' },
    switchTo: { zh: 'EN', en: '中文' },
    switchLabel: { zh: 'Switch to English', en: '切换到中文' },
    home: { zh: '首页', en: 'Home' },
    heroTitle: { zh: '致力于成为\n先进计算、物理 AI 的\n前沿热管理技术伙伴', en: 'Aspiring to be a\npioneering thermal management partner\nfor advanced computing and physical AI' },
    heroSub: { zh: 'AI 热设计 · 虚拟温度传感 · 工程自动化', en: 'AI thermal design · virtual temperature sensing · engineering automation' },
    heroCta: { zh: '选择行业', en: 'Choose your industry' },
    heroTool: { zh: '试用 H100 实验室', en: 'Try the H100 lab' },
    heroAlt: { zh: '神经网络与芯片温度场', en: 'Neural network and chip temperature field' },
    s1: { zh: '四个行业', en: 'Four industries' },
    s2: { zh: '三条产品线', en: 'Three product lines' },
    s3: { zh: '证据', en: 'Evidence' },
    s4: { zh: '实验室', en: 'Labs' },
    s5: { zh: '合作方式', en: 'How we work' },
    s5h: { zh: '先做付费小试点，再做完整工具。', en: 'A small paid pilot first, the full tool after.' },
    ctaH: { zh: '有一个具体的热问题？', en: 'Have a specific thermal problem?' },
    ctaP: { zh: '先发一段非敏感摘要：产品类型、想回答的问题、已有数据。', en: 'Send a short, non-sensitive summary: product type, the question, the data you have.' },
    writeUs: { zh: '写信给我们', en: 'Write to us' },
    more: { zh: '查看', en: 'View' },
    allCases: { zh: '全部案例', en: 'All cases' },
    moreHere: { zh: '本行业全部案例', en: 'All cases in this industry' },
    evidence: { zh: '证据类型', en: 'Evidence' },
    problem: { zh: '问题', en: 'The problem' },
    results: { zh: '结果', en: 'Results' },
    bounds: { zh: '适用边界', en: 'Limits' },
    research: { zh: '设计示范，非供货能力', en: 'Design demo, not a supply capability' },
    products: { zh: '相关产品', en: 'Products' },
    tool: { zh: '可以试用', en: 'Try it' },
    open: { zh: '打开工具', en: 'Open tool' },
    clip: { zh: '播放视频摘录', en: 'Play film excerpt' },
    clipNote: { zh: '视频摘录 · 无声 · 点击后加载', en: 'Film excerpt · silent · loads on click' },
    inputs: { zh: '输入', en: 'Inputs' },
    outputs: { zh: '输出', en: 'Outputs' },
    deliver: { zh: '交付', en: 'Deliverables' },
    pilot: { zh: '试点', en: 'Pilot' },
    cases: { zh: '案例', en: 'Cases' },
    filters: { zh: '筛选', en: 'Filter' },
    all: { zh: '全部', en: 'All' },
    extended: { zh: '拓展案例', en: 'Other fields' },
    search: { zh: '搜索编号或关键词', en: 'Search number or keyword' },
    noMatch: { zh: '没有符合条件的案例。', en: 'No cases match.' },
    pending: { zh: '目录项 · 待审核', en: 'Index entry · pending review' },
    count: { zh: '共 {n} 项', en: '{n} entries' },
    libTitle: { zh: '案例库', en: 'Case library' },
    libLead: { zh: '公开资料、公开数据或自建模型上的复现与示范；不是客户交付业绩。', en: 'Reproductions and demos on published work, public data or self-built models; not customer deliveries.' },
    toolsTitle: { zh: '实验室', en: 'Labs' },
    toolsLead: { zh: '从封装结构到温度预测，动手探索热设计。', en: 'Explore thermal design, from package structure to temperature prediction.' },
    resTitle: { zh: '技术资源', en: 'Technical resources' },
    resLead: { zh: '讲 AI 方法本身的短片，不是案例。', en: 'Short films on the methods themselves; not cases.' },
    notFound: { zh: '没有这个页面', en: 'Page not found' },
    back: { zh: '回到首页', en: 'Back to home' },
    footNote: { zh: '', en: '' },
    footBuild: { zh: '版本日期', en: 'Build date' },
    skip: { zh: '跳到正文', en: 'Skip to content' }
  };
  function u(k) { return t(U[k]); }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var img = function (name, alt, cls, eager) {
    if (name === 'case-rubin' && lang === 'zh') name += '-zh';
    return '<img class="' + (cls || '') + '" src="assets/img/' + name + '.jpg" alt="' + esc(alt) + '"' + (eager ? ' fetchpriority="high"' : '') + '>';
  };
  var link = function (path) { return '#/' + path; };
  var caseById = function (id) { return NT.cases.filter(function (c) { return c.id === id; })[0]; };
  var indById = function (id) { return id === 'extended' ? { id: 'extended', name: { zh: '拓展案例', en: 'Other fields' }, color: 'blue' } : NT.industries.filter(function (i) { return i.id === id; })[0]; };
  var prodById = function (id) { return NT.products.filter(function (p) { return p.id === id; })[0]; };
  var evBadge = function (ev) { return ev ? '<span class="badge ev-' + ev + '">' + t(NT.evidence[ev]) + '</span>' : ''; };
  var researchBadge = function (c) { return c.research ? '<span class="badge warn">' + u('research') + '</span>' : ''; };
  var label = function (n, s) { return '<p class="label">' + (n ? '<span class="n">' + n + '</span>' : '') + s + '</p>'; };
  var list = function (arr) { return '<ul class="ticks">' + arr.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; };
  var toolHref = function (id) { return (id === 'advanced-packaging' ? 'labs/advanced-packaging/' : 'tools/' + id + '/index.html') + '?lang=' + lang; };

  var ZH_CLIPS = ['cpo', 'mi300x', 'rubin'];   // excerpts that also exist from the Chinese film
  function clip(name, poster, alt) {
    var full = name === "rubin";
    var playLabel = full ? (lang === "zh" ? "播放完整视频" : "Play full video") : u("clip");
    var playNote = full ? (lang === "zh" ? "完整视频 · 含音频 · 点击播放" : "Full video · with audio · click to play") : u("clipNote");
    if (lang === 'zh' && ZH_CLIPS.indexOf(name) >= 0) { name += '-zh'; poster += '-zh'; }
    return '<figure class="clip" data-clip="' + name + '">' + img(poster, alt) +
      '<button class="play" type="button" aria-label="' + esc(playLabel + ' · ' + alt) + '"><span aria-hidden="true">▶</span>' + playLabel + '</button>' +
      '<figcaption>' + playNote + '</figcaption></figure>';
  }

  // Number + label + condition, always shown together.
  function metric(m, big) {
    return '<div class="metric' + (big ? ' big' : '') + '"><b>' + m.v + '</b><span class="ml">' + t(m.l) + '</span>' +
      (m.c ? '<span class="mc">' + t(m.c) + '</span>' : '') + '</div>';
  }

  // Storyboard row: text column + large picture, alternating sides.
  function story(o) {
    return '<section class="story' + (o.flip ? ' flip' : '') + (o.pic ? '' : ' nopic') + '"' + (o.id ? ' id="' + o.id + '"' : '') + '>' +
      '<div class="story-text">' + (o.label || '') + '<h3>' + o.title + '</h3>' + (o.body ? '<p class="body">' + o.body + '</p>' : '') +
      (o.metric ? metric(o.metric, true) : '') + (o.after || '') + '</div>' +
      (o.pic ? '<div class="story-pic">' + o.pic + '</div>' : '') + '</section>';
  }

  function casePic(c, eager) { return c.clip ? clip(c.clip, 'poster-' + c.clip, t(c.title)) : c.img ? img(c.img, t(c.title), 'shot', eager) : ''; }
  function evLine(c, extra) {
    return '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + (extra || '') + '<a class="more" href="' + link('cases/' + c.id) + '">' + u('more') + ' ' + c.id + ' →</a></p>';
  }

  // ------------------------------------------------------------------ pages
  function home() {
    var inds = NT.industries.map(function (ind) {
      return '<a class="ind-tile c-' + ind.color + '" href="' + link('industries/' + ind.id) + '">' +
        '<div class="ind-pic">' + img(ind.img, t(ind.long)) + '</div>' +
        '<div class="ind-body"><h3>' + t(ind.name) + '</h3><p>' + t(ind.head) + '</p><span class="more">' + u('more') + ' →</span></div></a>';
    }).join('');
    var prods = NT.products.map(function (p) {
      return '<a class="prod-row c-' + p.color + '" href="' + link('products/' + p.id) + '"><span class="prod-code">' + p.code + '</span>' +
        '<h3>' + t(p.name) + '</h3><p>' + t(p.line) + '</p></a>';
    }).join('');
    var picks = ['064', '018'].map(function (id, i) {
      var c = caseById(id);
      return story({ label: label('', t(c.tag)), title: t(c.title), metric: c.m[0], flip: i % 2 === 1, after: evLine(c), pic: img(c.img, t(c.title), 'shot') });
    }).join('');
    return '<section class="hero"><div class="wrap hero-in">' +
      '<div class="hero-text"><h1 class="hero-positioning">' + u('heroTitle').split('\n').map(function (line, i) { return '<span class="hero-line hero-line-' + i + '">' + (i === 2 ? '<strong>' + esc(line) + '</strong>' : esc(line)) + '</span>'; }).join('') + '</h1><p class="sub">' + u('heroSub') + '</p>' +
      '<div class="actions"><a class="btn primary" href="#industries">' + u('heroCta') + '</a>' +
      '<a class="btn ghost" href="' + toolHref('h100') + '">' + u('heroTool') + '</a></div></div>' +
      '<figure class="hero-pic">' + img('hero-thermal-ai', u('heroAlt'), '', true) + '</figure></div></section>' +
      '<section class="band" id="industries"><div class="wrap">' + label('01', u('s1')) + '<div class="ind-grid">' + inds + '</div></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('02', u('s2')) + '<div class="prod-list">' + prods + '</div></div></section>' +
      '<section class="band"><div class="wrap">' + label('03', u('s3')) + picks +
      '<p class="center"><a class="btn ghost" href="' + link('cases') + '">' + u('allCases') + ' →</a></p></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('04', u('s4')) + toolPanels() + '</div></section>' +
      '<section class="band"><div class="wrap">' + label('05', u('s5')) + '<h2>' + u('s5h') + '</h2>' + flow() +
      '<p class="center"><a class="btn ghost" href="' + link('engage') + '">' + t(U.nav.engage) + ' →</a></p></div></section>' +
      cta();
  }

  var TOOLS = [
    { id: 'space-radiator', img: 'tool-space-radiator',
      name: {zh:'太空散热实验室',en:'Space Radiator Lab'},
      d: {zh:'调整算力功耗与散热板温度，探索卫星所需的辐射面积、太阳翼和质量。',en:'Adjust compute power and radiator temperature to explore satellite radiator area, solar arrays and mass.'},
      scope: {zh:'轨道环境 · 热辐射 · 交互式卫星',en:'Orbital environment · Thermal radiation · Interactive satellite'} },
    { id: 'advanced-packaging', img: 'tool-advanced-packaging-top',
      name: {zh:'先进封装实验室',en:'Advanced packaging lab'},
      d: {zh:'旋转、拆解与切换互连，探索 SoC、HBM 和封装层叠。',en:'Rotate, explode and switch interconnects to explore SoC, HBM and package layers.'},
      scope: {zh:'交互式 3D 结构探索',en:'Interactive 3D structure explorer'} },
    { id: 'h100', img: 'tool-h100',
      name: { zh: 'H100 液冷实验室', en: 'H100 liquid-cooling lab' },
      d: { zh: '拖动功耗、流量和进液温度，实时看整颗芯片的稳态温度场，并对比物理求解。', en: 'Drag power, flow and inlet temperature; see the die’s steady-state field live and compare it with the physics solve.' },
      scope: { zh: '公开简化模型；不含客户数据，不含训练代码与训练数据。', en: 'Public simplified model; no customer data, no training code or data.' } },
    { id: 'heatsink', img: 'tool-heatsink',
      name: { zh: 'Heatsink选型实验室', en: 'Heatsink Selection Lab' },
      d: { zh: '选器件，改散热器与风扇，看结温、热阻、压降和重量。', en: 'Pick a device, change heat sink and fan, read junction temperature, resistance, pressure drop and mass.' },
      scope: { zh: '风冷，基于公开工程关联式；跨行业工具。', en: 'Air cooling on published correlations; cross-industry.' } },
    { id: 'chip-thermal', img: 'tool-chip-thermal',
      name: { zh: '芯片温度实验室', en: 'Chip thermal lab' },
      d: { zh: '选择 CPU 或 GPU，调整负载、功耗与冷却条件，查看模块功率和温度分布。', en: 'Choose a CPU or GPU, adjust load, power and cooling, and explore module power and temperature maps.' },
      scope: { zh: '43 款芯片 · 交互式热模拟', en: '43 chips · Interactive thermal simulation' } },
    { id: 'neurovis', img: 'tool-neurovis',
      name: { zh: 'NeuroVis CNN 实验室', en: 'NeuroVis CNN Lab' },
      d: { zh: '手写一个数字，逐层观察卷积神经网络如何提取特征并完成识别。', en: 'Draw a digit and explore how a convolutional neural network extracts features and recognizes it, layer by layer.' },
      scope: { zh: '手写识别 · 特征图 · 卷积可视化', en: 'Digit recognition · Feature maps · Convolution visualization' } }
  ];
  function toolPanels(only) {
    return TOOLS.filter(function (x) { return !only || only.indexOf(x.id) >= 0; }).map(function (x, i) {
      return '<div class="tool' + (i % 2 ? ' flip' : '') + '"><a class="tool-shot" href="' + toolHref(x.id) + '" aria-label="' + esc(t(x.name)) + '">' + img(x.img, t(x.name)) + '</a>' +
        '<div class="tool-text"><h3>' + t(x.name) + '</h3><p>' + t(x.d) + '</p><p class="scope-note">' + t(x.scope) + '</p>' +
        '<a class="btn primary" href="' + toolHref(x.id) + '">' + u('open') + ' →</a></div></div>';
    }).join('');
  }

  function flow() {
    return '<ol class="flow">' + NT.steps.map(function (s, i) { return '<li><span class="node">' + (i + 1) + '</span><b>' + t(s.t) + '</b></li>'; }).join('') + '</ol>';
  }

  function cta(text) {
    return '<section class="cta"><div class="wrap cta-in"><div><h2>' + (text || u('ctaH')) + '</h2><p>' + u('ctaP') + '</p></div>' +
      '<a class="btn primary" href="' + link('contact') + '">' + u('writeUs') + ' →</a></div></section>';
  }

  function pageHead(title, lead, crumbs) {
    return '<header class="page-head"><div class="wrap">' + (crumbs ? '<nav class="crumbs" aria-label="breadcrumb">' + crumbs + '</nav>' : '') +
      '<h1>' + title + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + '</div></header>';
  }

  function industriesIndex() {
    return pageHead(t(U.nav.industries), null) + '<section class="band"><div class="wrap"><div class="ind-grid">' + NT.industries.map(function (ind) {
      return '<a class="ind-tile c-' + ind.color + '" href="' + link('industries/' + ind.id) + '"><div class="ind-pic">' + img(ind.img, t(ind.long)) + '</div>' +
        '<div class="ind-body"><h3>' + t(ind.name) + '</h3><p>' + t(ind.head) + '</p><span class="more">' + u('more') + ' →</span></div></a>';
    }).join('') + '</div></div></section>' + cta();
  }

  function industry(ind, focus) {
    var tabs = '<nav class="ind-tabs" aria-label="' + esc(t(U.nav.industries)) + '">' + NT.industries.map(function (x) {
      return '<a href="' + link('industries/' + x.id) + '"' + (x.id === ind.id ? ' aria-current="page"' : '') + '>' + t(x.name) + '</a>';
    }).join('') + '</nav>';
    var rows = ind.problems.map(function (p, i) {
      var c = caseById(p.c), pr = prodById(p.p);
      return story({ id: 'p-' + p.id, label: label('0' + (i + 1), t(p.t)), title: t(c.title), metric: c.m[0], flip: i % 2 === 1,
        after: evLine(c, '<a class="badge prod c-' + pr.color + '" href="' + link('products/' + pr.id) + '">' + pr.code + '</a>'),
        pic: c.img ? img(c.img, t(c.title), 'shot') : '' }).replace('class="story', 'class="story' + (focus === p.id ? ' focus' : ''));
    }).join('');
    return '<header class="ind-hero c-' + ind.color + '"><div class="wrap ind-hero-in"><div>' +
      '<nav class="crumbs"><a href="#/">' + u('home') + '</a> / <a href="' + link('industries') + '">' + t(U.nav.industries) + '</a></nav>' +
      '<h1>' + t(ind.long) + '</h1><p class="lead">' + t(ind.head) + '</p></div>' +
      '<div class="ind-hero-pic">' + (ind.clip ? clip(ind.clip, 'poster-' + ind.clip, t(ind.long)) : img(ind.img, t(ind.long), '', true)) + '</div></div>' +
      '<div class="wrap">' + tabs + '</div></header>' +
      '<section class="band"><div class="wrap">' + label('', u('s3')) + rows +
      (ind.note ? '<p class="note">' + t(ind.note) + '</p>' : '') + '<p class="related"><a href="' + link('cases?ind=' + ind.id) + '">' + u('moreHere') + ' →</a>' +
      ind.links.map(function (id) { var x = indById(id); return '<a href="' + link('industries/' + x.id) + '">' + t(x.name) + ' →</a>'; }).join('') + '</p></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', u('tool')) + toolPanels([ind.tool]) + '</div></section>' + cta(t(ind.cta));
  }

  function caseRow(c, compact) {
    if (compact) return '<li class="case-row compact"><a href="' + link('cases/' + c.id) + '"><span class="cid">' + c.id + '</span><h3>' + t(c.title) + '</h3>' +
      '<p class="m"><b>' + c.m[0].v + '</b> ' + t(c.m[0].l) + '</p>' + evBadge(c.ev) + '</a></li>';
    return '<li class="case-row"><a href="' + link('cases/' + c.id) + '">' +
      (c.img ? img(c.img, '', 'thumb') : '<span class="thumb ph c-' + indById(c.ind[0]).color + '">' + c.id + '</span>') +
      '<div><p class="code">' + c.id + ' · ' + t(c.tag) + '</p><h3>' + t(c.title) + '</h3><p class="m"><b>' + c.m[0].v + '</b> ' + t(c.m[0].l) + '</p>' +
      '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + c.ind.map(function (i) { return '<span class="badge">' + t(indById(i).name) + '</span>'; }).join('') + '</p></div></a></li>';
  }

  function products() {
    return pageHead(t(U.nav.products), { zh: '三条产品线，跨四个行业复用。', en: 'Three product lines, reused across four industries.' }[lang]) +
      '<section class="band"><div class="wrap"><div class="prod-list">' + NT.products.map(function (p) {
        return '<a class="prod-row c-' + p.color + '" href="' + link('products/' + p.id) + '"><span class="prod-code">' + p.code + '</span><h3>' + t(p.name) + '</h3><p>' + t(p.line) + '</p></a>';
      }).join('') + '</div></div></section>' + cta();
  }

  function product(p) {
    return pageHead(t(p.name), t(p.line), '<a href="#/">' + u('home') + '</a> / <a href="' + link('products') + '">' + t(U.nav.products) + '</a> / ' + p.code) +
      '<section class="band"><div class="wrap">' +
      '<p class="big-p">' + t(p.problem) + '</p>' +
      '<div class="io"><div>' + label('', u('inputs')) + list(t(p.inputs)) + '</div><div class="arrow" aria-hidden="true">→</div><div>' + label('', u('outputs')) + list(t(p.outputs)) + '</div></div>' +
      '<div class="two"><div>' + label('', u('deliver')) + list(t(p.deliver)) + '</div><div class="bounds-box">' + label('', u('bounds')) + list(t(p.bounds)) + '</div></div>' +
      '<div class="pilot">' + label('', u('pilot')) + '<p class="big-p">' + t(p.pilot) + '</p></div>' +
      label('', u('cases')) + '<ul class="case-rows">' + p.cases.slice(0, 3).map(function (id) { return caseRow(caseById(id), true); }).join('') + '</ul>' +
      '<p class="related"><a href="' + link('cases') + '">' + u('allCases') + ' →</a></p>' +
      '</div></section>' + cta();
  }

  var filt = { ind: 'all', prod: 'all', ev: 'all', q: '' };
  function cases(query) {
    var qi = new URLSearchParams(query || '').get('ind');
    if (qi && (indById(qi) || qi === 'extended')) filt.ind = qi;
    var chip = function (group, val, text) {
      return '<button type="button" class="chip" data-g="' + group + '" data-v="' + val + '" aria-pressed="' + (filt[group] === val) + '">' + text + '</button>';
    };
    var g = function (title, group, opts) {
      return '<div class="fgroup" role="group" aria-label="' + esc(title) + '"><span>' + title + '</span>' + chip(group, 'all', u('all')) + opts.map(function (o) { return chip(group, o[0], o[1]); }).join('') + '</div>';
    };
    return pageHead(u('libTitle'), u('libLead')) +
      '<section class="band"><div class="wrap"><div class="filters">' +
      g(t(U.nav.industries), 'ind', NT.industries.map(function (i) { return [i.id, t(i.name)]; }).concat([['extended', u('extended')]])) +
      g(t(U.nav.products), 'prod', NT.products.map(function (p) { return [p.id, p.code]; })) +
      g(u('evidence'), 'ev', Object.keys(NT.evidence).map(function (k) { return [k, t(NT.evidence[k])]; })) +
      '<label class="search"><span class="vh">' + u('search') + '</span><input id="q" type="search" placeholder="' + esc(u('search')) + '" value="' + esc(filt.q) + '"></label></div>' +
      '<p class="count" id="count" aria-live="polite"></p><ul class="case-rows" id="lib"></ul></div></section>' +
      cta();
  }
  function fillLibrary() {
    var lib = document.getElementById('lib');
    if (!lib) return;
    var q = filt.q.trim().toLowerCase();
    var hit = function (id, txt) { return !q || id.indexOf(q) >= 0 || txt.toLowerCase().indexOf(q) >= 0; };
    var rows = NT.cases.filter(function (c) {
      return (filt.ind === 'all' || c.ind.indexOf(filt.ind) >= 0) && (filt.prod === 'all' || c.prod.indexOf(filt.prod) >= 0) &&
        (filt.ev === 'all' || c.ev === filt.ev) && hit(c.id, [c.title.zh, c.title.en, c.tag.zh, c.tag.en].join(' '));
    }).map(function (c) { return caseRow(c, false); });
    var extra = NT.listOnly.filter(function (c) {
      return (filt.ind === 'all' || c.ind.indexOf(filt.ind) >= 0) && filt.prod === 'all' && (filt.ev === 'all' || c.ev === filt.ev) && hit(c.id, c.t.zh + ' ' + c.t.en);
    }).map(function (c) {
      return '<li class="case-row idx"><span class="thumb ph">' + c.id + '</span><div><h3>' + t(c.t) + '</h3><p class="ev-line">' +
        evBadge(c.ev) + '<span class="badge muted">' + u('pending') + '</span></p></div></li>';
    });
    lib.innerHTML = rows.concat(extra).join('') || '<li class="empty">' + u('noMatch') + '</li>';
    document.getElementById('count').textContent = u('count').replace('{n}', rows.length + extra.length);
  }

  function caseDetail(c) {
    var inds = c.ind.map(function (i) { var x = indById(i); return '<a class="badge" href="' + link(i === 'extended' ? 'cases?ind=extended' : 'industries/' + x.id) + '">' + t(x.name) + '</a>'; }).join('');
    var prods = c.prod.map(function (id) { var p = prodById(id); return '<a class="badge prod c-' + p.color + '" href="' + link('products/' + p.id) + '">' + p.code + '</a>'; }).join('');
    var pic = casePic(c, true);
    return '<header class="page-head case-head"><div class="wrap' + (pic ? ' case-head-in' : '') + '"><div>' +
      '<nav class="crumbs"><a href="#/">' + u('home') + '</a> / <a href="' + link('cases') + '">' + u('libTitle') + '</a> / ' + c.id + '</nav>' +
      '<p class="label">' + t(c.tag) + '</p><h1>' + t(c.title) + '</h1>' +
      '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + inds + prods + '</p></div>' +
      (pic ? '<div class="case-pic">' + pic + '</div>' : '') + '</div></header>' +
      '<section class="band"><div class="wrap case-body">' +
      '<p class="big-p">' + t(c.problem) + '</p>' +
      '<div class="cb">' + label('', u('results')) + '<div class="metrics">' + c.m.map(function (m) { return metric(m); }).join('') + '</div></div>' +
      (c.value ? '<div class="cb">' + label('', { zh: '客户价值', en: 'Customer value' }[lang]) + '<p>' + t(c.value) + '</p></div>' : '') +
      (c.tool ? '<p><a class="btn primary" href="' + toolHref(c.tool) + '">' + u('heroTool') + ' →</a></p>' : '') +
      '</div></section>' + cta();
  }

  function tools() {
    return pageHead(u('toolsTitle'), u('toolsLead')) + '<section class="band"><div class="wrap">' + toolPanels() + '</div></section>' + cta();
  }

  function engage() {
    var x = {
      zh: { lead: '先做一个范围清楚的小试点，验收通过再做完整工具。', can: ['热仿真建模、批量数据与代理模型', '虚拟温度传感的离线验证与嵌入式评估', '交互工具、私有部署与重训'], need: ['问题描述与想回答的问题', '参数范围（不需要图纸）', '已有数据的类型和数量', '验收口径'] },
      en: { lead: 'Start with a small, paid, clearly scoped pilot; build the full tool once it passes. Pricing and licensing are agreed per scope.', can: ['Thermal models, batch data and surrogates', 'Offline validation and embedded assessment of virtual sensing', 'Interactive tools, private deployment, retraining'], need: ['The problem and the question', 'Parameter ranges (no drawings needed)', 'What data exists and how much', 'Acceptance criteria'] }
    }[lang];
    return pageHead(t(U.nav.engage), x.lead) +
      '<section class="band"><div class="wrap">' + flow() + '</div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', u('deliver')) + '<div class="tiers">' + NT.tiers.map(function (y) {
        return '<div class="tier"><b>' + t(y.t) + '</b><p>' + t(y.d) + '</p></div>'; }).join('') + '</div></div></section>' +
      '<section class="band"><div class="wrap two"><div>' + label('', { zh: '试点需要', en: 'For a pilot' }[lang]) + list(x.need) + '</div>' +
      '<div>' + label('', { zh: '我们提供', en: 'What we offer' }[lang]) + list(x.can) + '</div></div></section>' + cta();
  }

  function about() {
    var x = {
      zh: {
        lead: 'NeuralThermal 将热仿真与 AI 融合，为研发团队构建更快的设计工具和更清晰的温度洞察。',
        scope: '业务范围',
        industries: [
          ['先进封装', 'Chiplet、HBM 与 CPO 的热点分析、布局评估和热耦合建模。', 'packaging'],
          ['液冷', 'GPU 冷却与冷板的温度、流量和压降权衡。', 'cooling'],
          ['电驱', '逆变器、控制器及功率模块的结温估计与冷却评估。', 'drives'],
          ['电机', '电机与机器人关节的温度估计、热负载分析和持续性能评估。', 'motors']
        ],
        ability: '核心能力',
        capabilities: [
          ['AI 辅助设计', '结合物理仿真与代理模型，快速筛选方案，复核关键设计。'],
          ['虚拟温度传感', '利用已有测点与运行信号，估计难以直接测量的内部温度。'],
          ['工程工具交付', '将模型、交互界面与自动化流程整合，支持私有部署和持续迭代。']
        ],
        value: '为客户创造的价值',
        values: [
          ['更快做出设计决策', '减少重复求解，在同样的研发时间内比较更多方案。'],
          ['更早发现热风险', '识别热点与冷却瓶颈，为设计取舍和测试安排提供依据。'],
          ['让数据持续产生价值', '把仿真和试验积累变成团队可反复使用的工程工具。']
        ]
      },
      en: {
        lead: 'NeuralThermal combines thermal simulation and AI to give engineering teams faster design tools and clearer insight into temperature.',
        scope: 'Where we work',
        industries: [
          ['Advanced packaging', 'Hotspot analysis, layout assessment and thermal coupling for Chiplets, HBM and CPO.', 'packaging'],
          ['Liquid cooling', 'Temperature, flow and pressure-drop trade-offs for GPU cooling and cold plates.', 'cooling'],
          ['Electric drives', 'Junction-temperature estimation and cooling assessment for inverters, controllers and power modules.', 'drives'],
          ['Motors', 'Temperature estimation, thermal-load analysis and sustained-performance assessment for motors and robotic joints.', 'motors']
        ],
        ability: 'What we build',
        capabilities: [
          ['AI-assisted design', 'Combine physics simulation and surrogate models to screen options quickly and verify critical designs.'],
          ['Virtual temperature sensing', 'Use existing measurements and operating signals to estimate internal temperatures that are hard to measure directly.'],
          ['Engineering tools', 'Bring models, interactive interfaces and automated workflows together, with private deployment and ongoing refinement.']
        ],
        value: 'Value for your team',
        values: [
          ['Faster design decisions', 'Reduce repeated solves and compare more options within the same development time.'],
          ['Earlier insight into thermal risk', 'Identify hotspots and cooling bottlenecks to guide design trade-offs and test planning.'],
          ['Lasting value from your data', 'Turn simulation and test results into engineering tools your team can use repeatedly.']
        ]
      }
    }[lang];
    return pageHead(t(U.nav.about), x.lead) +
      '<section class="band"><div class="wrap">' + label('', x.scope) + '<div class="two">' + x.industries.map(function (i) {
        return '<div><h3><a href="' + link('industries/' + i[2]) + '">' + i[0] + ' →</a></h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', x.ability) + '<div class="tiers">' + x.capabilities.map(function (i) {
        return '<div class="tier"><h3>' + i[0] + '</h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' +
      '<section class="band"><div class="wrap">' + label('', x.value) + '<div class="tiers">' + x.values.map(function (i) {
        return '<div class="tier"><h3>' + i[0] + '</h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' + cta();
  }

  function resources() {
    return pageHead(u('resTitle'), u('resLead')) + '<section class="band"><div class="wrap"><ul class="case-rows">' + NT.resources.map(function (r) {
      return '<li class="case-row idx"><span class="thumb ph">' + r.id + '</span><div><h3>' + t(r.t) + '</h3><p class="ev-line"><span class="badge muted">' + u('pending') + '</span></p></div></li>';
    }).join('') + '</ul></div></section>' + cta();
  }

  var CX = {
    zh: { lead: '这个页面不会把任何内容发到服务器。点击“打开邮件程序”后，您电脑上的邮件程序会带着下面的内容新建一封邮件，由您确认后发送。', ind: '行业', topic: '关注方向', pick: '请选择', other: '其他 / 不确定', msg: '简要描述（请勿写图纸、客户名或保密数据）', ph: '例如：电驱 SiC 模块，想在不加传感器的情况下估算各芯片结温；有约 20 小时台架数据。', send: '打开邮件程序', copy: '复制邮箱地址', copied: '已复制邮箱地址。', copyFail: '无法自动复制，请手动选择上面的地址。', opened: '已请求打开邮件程序；本页没有发送任何内容。如果没有弹出，请直接写信到 ', none: '本站不收集文件或 CAD。', email: '邮箱', subj: '咨询 · ', body: ['行业：', '关注方向：', '描述：'] },
    en: { lead: 'This page sends nothing to a server. “Open my email app” starts a new message in your own email program with the text below; you decide whether to send it.', ind: 'Industry', topic: 'Interest', pick: 'Please choose', other: 'Other / not sure', msg: 'Short description (no drawings, customer names or confidential data)', ph: 'For example: SiC module in a drive inverter; per-die junction estimates without new sensors; about 20 h of bench data.', send: 'Open my email app', copy: 'Copy email address', copied: 'Email address copied.', copyFail: 'Could not copy automatically; please select the address above.', opened: 'Your email app was asked to open; this page sent nothing. If nothing appeared, write to ', none: 'This site does not collect files or CAD.', email: 'Email', subj: 'Enquiry · ', body: ['Industry: ', 'Interest: ', 'Description: '] }
  };
  function contact() {
    var x = CX[lang];
    var opt = function (arr) { return '<option value="">' + x.pick + '</option>' + arr.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') + '<option value="' + esc(x.other) + '">' + x.other + '</option>'; };
    return pageHead(u('contact'), x.lead) +
      '<section class="band"><div class="wrap two contact">' +
      '<form id="cf" novalidate><label>' + x.ind + '<select name="ind">' + opt(NT.industries.map(function (i) { return t(i.name); })) + '</select></label>' +
      '<label>' + x.topic + '<select name="topic">' + opt(NT.products.map(function (p) { return p.code + ' · ' + t(p.name); })) + '</select></label>' +
      '<label>' + x.msg + '<textarea name="msg" rows="5" maxlength="800" placeholder="' + esc(x.ph) + '"></textarea></label>' +
      '<button class="btn primary" type="submit">' + x.send + '</button><p class="status" id="cf-status" role="status" aria-live="polite"></p></form>' +
      '<aside class="mailbox">' + label('', x.email) + '<p class="addr"><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>' +
      '<button class="btn ghost" type="button" id="copy">' + x.copy + '</button><p class="note">' + x.none + '</p></aside>' +
      '</div></section>';
  }
  function bindContact() {
    var f = document.getElementById('cf');
    if (!f) return;
    var x = CX[lang];
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var subject = x.subj + (d.get('ind') || 'NeuralThermal');
      var body = [x.body[0] + (d.get('ind') || '-'), x.body[1] + (d.get('topic') || '-'), '', x.body[2], String(d.get('msg') || '')].join('\n');
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      document.getElementById('cf-status').textContent = x.opened + EMAIL + '.';
    });
    document.getElementById('copy').addEventListener('click', function () {
      var s = document.getElementById('cf-status');
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(EMAIL).then(function () { s.textContent = x.copied; }, function () { s.textContent = x.copyFail; });
      else s.textContent = x.copyFail;
    });
  }

  function notFound() {
    return pageHead(u('notFound'), null) + '<section class="band"><div class="wrap"><a class="btn primary" href="#/">' + u('back') + '</a></div></section>';
  }

  // ------------------------------------------------------------------ shell
  var routes = [
    [/^$/, home, function () { return null; }],
    [/^industries$/, industriesIndex, function () { return t(U.nav.industries); }],
    [/^industries\/([\w-]+)(?:\/([\w-]+))?$/, function (m) { var i = indById(m[1]); return i ? industry(i, m[2]) : notFound(); }, function (m) { var i = indById(m[1]); return i ? t(i.long) : u('notFound'); }],
    [/^products$/, products, function () { return t(U.nav.products); }],
    [/^products\/([\w-]+)$/, function (m) { var p = prodById(m[1]); return p ? product(p) : notFound(); }, function (m) { var p = prodById(m[1]); return p ? p.code + ' · ' + t(p.name) : u('notFound'); }],
    [/^cases$/, function (m, q) { return cases(q); }, function () { return u('libTitle'); }],
    [/^cases\/(\d{3})$/, function (m) { var c = caseById(m[1]); return c ? caseDetail(c) : notFound(); }, function (m) { var c = caseById(m[1]); return c ? t(c.title) : u('notFound'); }],
    [/^(labs|tools)$/, tools, function () { return u('toolsTitle'); }],
    [/^engage$/, engage, function () { return t(U.nav.engage); }],
    [/^about$/, about, function () { return t(U.nav.about); }],
    [/^resources$/, resources, function () { return u('resTitle'); }],
    [/^contact$/, contact, function () { return u('contact'); }]
  ];
  function current() {
    var h = location.hash.replace(/^#\/?/, '');
    var i = h.indexOf('?');
    return { path: (i >= 0 ? h.slice(0, i) : h).replace(/\/$/, ''), query: i >= 0 ? h.slice(i + 1) : '' };
  }
  function navHtml(path) {
    var items = ['products', 'industries', 'labs', 'cases', 'hub', 'apiStudio', 'engage', 'about'];
    var top = path.split('/')[0];
    if (top === 'tools') top = 'labs';
    if (top === 'resources') top = 'about';
    return '<a class="skip" href="#main">' + u('skip') + '</a><header class="nav"><div class="wrap nav-in">' +
      '<a class="brand" href="#/" aria-label="NeuralThermal">' + NT.logo + '</a>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true"></span>' + u('menu') + '</button>' +
      '<nav class="nav-links" id="nav-links">' + items.map(function (it) {
        return '<a href="' + (it === 'apiStudio' ? '/api-studio/?lang=' + lang : it === 'hub' ? '/hub/' : link(it)) + '"' + (top === it ? ' aria-current="page"' : '') + '>' + t(U.nav[it]) + '</a>';
      }).join('') + '<span class="nav-right"><button class="lang" type="button" id="lang" lang="' + (lang === 'zh' ? 'en' : 'zh-CN') + '" aria-label="' + esc(u('switchLabel')) + '">' + u('switchTo') + '</button>' +
      '<a class="btn primary small" href="' + link('contact') + '">' + u('contact') + '</a></span></nav></div></header>';
  }
  function footHtml() {
    return '<footer class="foot"><div class="wrap foot-in"><div class="brand dark">' + NT.logo + '</div>' +
      '<nav>' + NT.industries.map(function (i) { return '<a href="' + link('industries/' + i.id) + '">' + t(i.name) + '</a>'; }).join('') + '</nav>' +
      '<nav>' + NT.products.map(function (p) { return '<a href="' + link('products/' + p.id) + '">' + p.code + '</a>'; }).join('') + '<a href="' + link('labs') + '">' + u('toolsTitle') + '</a><a href="' + link('resources') + '">' + u('resTitle') + '</a><a href="/hub/">NT Hub</a></nav>' +
      '<div><p><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p><p>' + u('footNote') + '</p><p>' + u('footBuild') + ': ' + fmtDate(BUILD) + '</p>' +
      '</div></div></footer>';
  }

  function render() {
    var cur = current();
    var hit = null, m = null;
    for (var i = 0; i < routes.length && !hit; i++) { m = cur.path.match(routes[i][0]); if (m) hit = routes[i]; }
    var body = hit ? hit[1](m, cur.query) : notFound();
    var title = hit ? hit[2](m) : u('notFound');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = (title ? title + ' · ' : '') + 'NeuralThermal' + (title ? '' : (lang === 'zh' ? ' · AI 热设计' : ' · AI thermal design'));
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = lang === 'zh' ? 'NeuralThermal：AI 热设计、虚拟温度传感与工程自动化，面向封装、液冷、电驱与电机。' : 'NeuralThermal: AI thermal design, virtual temperature sensing and engineering automation for packaging, liquid cooling, power electronics and motors.';
    document.getElementById('app').innerHTML = navHtml(cur.path) + '<main id="main" tabindex="-1">' + body + '</main>' + footHtml();
    bind();
    fillLibrary();
    bindContact();
    var focus = cur.path.match(/^industries\/[\w-]+\/([\w-]+)$/);
    var target = focus ? document.getElementById('p-' + focus[1]) : null;
    if (target) target.scrollIntoView({ block: 'start' });
  }

  var pendingAnchor = null;
  function bind() {
    document.getElementById('lang').addEventListener('click', function () { setLang(lang === 'zh' ? 'en' : 'zh'); });
    var burger = document.querySelector('.burger');
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      document.getElementById('nav-links').classList.toggle('open', open);
    });
    // On-demand film excerpts: nothing is fetched until the visitor presses play.
    document.querySelectorAll('.clip .play').forEach(function (b) {
      b.addEventListener('click', function () {
        var fig = b.closest('.clip');
        var v = document.createElement('video');
        v.src = 'assets/video/clip-' + fig.dataset.clip + '.mp4';
        v.controls = true; v.muted = fig.dataset.clip.indexOf('rubin') !== 0; v.playsInline = true; v.autoplay = true;
        v.setAttribute('aria-label', b.getAttribute('aria-label'));
        v.poster = fig.querySelector('img').src;
        fig.replaceChild(v, fig.querySelector('img'));
        b.remove();
        v.play().catch(function () {});
      });
    });
    document.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        filt[c.dataset.g] = c.dataset.v;
        document.querySelectorAll('.chip[data-g="' + c.dataset.g + '"]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        fillLibrary();
      });
    });
    var q = document.getElementById('q');
    if (q) q.addEventListener('input', function () { filt.q = q.value; fillLibrary(); });
    document.querySelectorAll('a[data-anchor]').forEach(function (a) {
      a.addEventListener('click', function () { pendingAnchor = a.dataset.anchor; });
    });
    if (pendingAnchor) {
      var el = document.getElementById(pendingAnchor);
      pendingAnchor = null;
      if (el) setTimeout(function () { el.scrollIntoView(); }, 0);
    }
  }

  // In-page anchors (#industries on the home page) are not routes.
  addEventListener('hashchange', function (e) {
    var h = location.hash;
    if (h && h.indexOf('#/') !== 0) {
      var el = document.getElementById(h.slice(1));
      if (el) {
        try { history.replaceState(null, '', e.oldURL.indexOf('#') >= 0 ? e.oldURL.slice(e.oldURL.indexOf('#')) : '#/'); } catch (err) { /* file:// may refuse */ }
        el.scrollIntoView();
        return;
      }
    }
    var anchor = pendingAnchor;
    render();
    if (!current().path.match(/^industries\/[\w-]+\/[\w-]+$/) && !anchor) scrollTo(0, 0);
    var main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
  });
  render();
})();
