/* NT Hub · renders window.NT_HUB_ITEMS newest first: a numbered Top 5, each section's current items
   10 at a time, and an 往期 archive grouped by month for expired ones. */
(function () {
  // Language follows the main site: ?lang= > this tab's switch > saved choice > browser language.
  const ok = l => (l === 'zh' || l === 'en') ? l : null;
  const store = (k, v, area) => { try { const a = window[area || 'localStorage']; if (v === undefined) return a.getItem(k); a.setItem(k, v); } catch (e) { return null; } };
  const lang = ok(new URLSearchParams(location.search).get('lang')) || ok(store('nt-lang-tab', undefined, 'sessionStorage')) || ok(store('nt-lang')) ||
    ((navigator.languages || [navigator.language || 'en'])[0].toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
  const T = {
    zh: { title: 'NT Hub · NeuralThermal', skip: '跳到正文', menu: '菜单', products: '产品', industries: '行业', labs: '实验室', cases: '案例与演示', api: '开发者中心', engage: '合作方式', about: '关于', contact: '联系',
      switchTo: 'EN', switchLabel: 'Switch to English', h1: '物理 AI 与先进计算前沿速递',
      lede: '我们持续整理物理 AI、先进计算与热管理方向的行业动态、升学留学机会、会议与竞赛，每条注明来源和时间，点标题可直达原文。每两天更新一次。',
      news: '物理 AI 与行业动态', study: '升学留学', contest: '会议与竞赛', more: '查看更多', past: n => `往期（${n} 条）`, empty: '暂无条目。',
      due: '截止', closed: '已截止', tabs: '栏目',
      note: '信息来自各来源的公开页面，日期和名额请以原文为准。发现有误或想推荐线索，欢迎写信至 <a href="mailto:tech@neuralthermal.com">tech@neuralthermal.com</a>。' },
    en: { title: 'NT Hub · NeuralThermal', skip: 'Skip to content', menu: 'Menu', products: 'Products', industries: 'Industries', labs: 'Labs', cases: 'Cases & demos', api: 'Developer Center', engage: 'How we work', about: 'About', contact: 'Contact',
      switchTo: '中文', switchLabel: '切换到中文', h1: 'Physical AI & Advanced Computing Briefing',
      lede: 'We track news, graduate study openings, conferences and competitions in physical AI, advanced computing and thermal management. Every item names its source and date, and each title links to the original. Updated every two days.',
      news: 'Physical AI & industry', study: 'Graduate study', contest: 'Conferences & contests', more: 'Show more', past: n => `Archive (${n})`, empty: 'Nothing here yet.',
      due: 'Deadline', closed: 'Closed', tabs: 'Sections',
      note: 'Items come from public pages; check the original for exact dates and places. Spotted an error or have a lead? Write to <a href="mailto:tech@neuralthermal.com">tech@neuralthermal.com</a>.' }
  }[lang];
  const CAT = { news: T.news, study: T.study, contest: T.contest };
  const pick = (x, k) => (lang === 'en' && x[k + '_en']) || x[k];
  const PAGE = 10;
  const items = (window.NT_HUB_ITEMS || []).slice();
  const list = document.getElementById('hub-list');
  const more = document.getElementById('hub-more');
  const pastBtn = document.getElementById('hub-past');
  const today = new Date().toISOString().slice(0, 10);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = d => {
    const [y, m, dd] = d.split('-');
    if (lang === 'zh') return dd ? `${y} 年 ${+m} 月 ${+dd} 日` : (m ? `${y} 年 ${+m} 月` : y);
    return m ? new Intl.DateTimeFormat('en-GB', dd ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'long', year: 'numeric' }).format(new Date(`${y}-${m}-${dd || '01'}T12:00:00`)) : y;
  };

  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = T.title;
  document.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = T[e.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-html]').forEach(e => { e.innerHTML = T[e.dataset.i18nHtml]; });
  document.getElementById('hub-tabs').setAttribute('aria-label', T.tabs);
  document.querySelector('.burger').lastChild.textContent = T.menu;
  document.getElementById('hub-api').href = '/api-studio/?lang=' + lang;
  const sw = document.getElementById('lang');
  sw.textContent = T.switchTo;
  sw.setAttribute('aria-label', T.switchLabel);
  sw.lang = lang === 'zh' ? 'en' : 'zh-CN';
  sw.addEventListener('click', () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    store('nt-lang', next); store('nt-lang-tab', next, 'sessionStorage');
    const u = new URL(location.href); u.searchParams.set('lang', next); location.href = u.href;
  });
  const daysAgo = d => (Date.parse(today) - Date.parse(d)) / 864e5;

  // Newest collection day first; inside a day, newest publish date first, undated last.
  items.sort((a, b) => (b.added || '').localeCompare(a.added || '') || (b.date || '0').localeCompare(a.date || '0'));

  // An item expires once its deadline passes; without a deadline, news keeps 30 days from collection, others 90.
  const expired = x => x.deadline ? x.deadline < today : daysAgo(x.added || today) > (x.cat === 'news' ? 30 : 90);
  const current = items.filter(x => !expired(x));
  const past = items.filter(expired);

  function card(x, rank) {
    const meta = [`<span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span>`, `<span>${esc(pick(x, 'source'))}</span>`];
    if (x.date) meta.push(`<time datetime="${esc(x.date)}">${day(x.date)}</time>`);
    const when = [];
    if (x.deadline) {
      const past = x.deadline < today;
      when.push(`<span class="hub-due${past ? ' past' : ''}">${past ? T.closed : T.due} ${day(x.deadline)}</span>`);
    }
    if (x.when) when.push(`<span>${esc(pick(x, 'when'))}</span>`);
    const pic = `<a class="hub-pic" href="${esc(x.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${x.logo ? 'logos/' + esc(x.logo) : '/assets/favicon.svg'}" alt="" loading="lazy"></a>`;
    return `<article class="hub-item"><div>
      <div class="hub-meta">${meta.join('')}</div>
      <h2>${rank ? `<span class="hub-rank">${rank}</span>` : ''}<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(pick(x, 'title'))}</a></h2>
      <p class="s">${esc(pick(x, 'summary'))}</p>
      ${when.length ? `<div class="hub-when">${when.join('')}</div>` : ''}
    </div>${pic}</article>`;
  }

  let shown = 0, rows = [];

  function page() {
    list.insertAdjacentHTML('beforeend', rows.slice(shown, shown + PAGE).map(x => card(x)).join(''));
    shown += PAGE;
    more.hidden = shown >= rows.length;
  }

  function render(cat) {
    list.innerHTML = ''; shown = 0;
    if (cat === 'top') {
      rows = [];
      list.innerHTML = current.filter(x => x.top).sort((a, b) => a.top - b.top).map((x, i) => card(x, i + 1)).join('');
      more.hidden = true;
      return;
    }
    rows = current.filter(x => x.cat === cat);
    if (!rows.length) { list.innerHTML = `<p>${T.empty}</p>`; more.hidden = true; return; }
    page();
  }

  function renderPast() {
    let html = '', last = '';
    for (const x of past) {
      const m = (x.added || '').slice(0, 7);
      if (m !== last) { last = m; html += `<h3 class="hub-month">${day(m)}</h3>`; }
      html += card(x);
    }
    list.innerHTML = html;
    more.hidden = true;
  }

  const chips = document.querySelectorAll('.hub-tabs .chip');
  const press = b => chips.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
  chips.forEach(b => b.addEventListener('click', () => { press(b); render(b.dataset.cat); }));
  more.addEventListener('click', page);
  pastBtn.hidden = !past.length;
  pastBtn.textContent = T.past(past.length);
  pastBtn.addEventListener('click', () => { press(null); renderPast(); list.scrollIntoView({ behavior: 'smooth' }); });
  const burger = document.querySelector('.burger'), links = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  render('top');
})();
