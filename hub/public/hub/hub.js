/* NT Hub · renders window.NT_HUB_ITEMS. On /hub/: a Top 5 carousel, a numbered Top 5, each section's
   current items 10 at a time, and an 往期 archive grouped by month. On /hub/a/?id=: one item's NT brief,
   with the original link at the bottom. */
(function () {
  // Language follows the main site: ?lang= > this tab's switch > saved choice > browser language.
  const ok = l => (l === 'zh' || l === 'en') ? l : null;
  const store = (k, v, area) => { try { const a = window[area || 'localStorage']; if (v === undefined) return a.getItem(k); a.setItem(k, v); } catch (e) { return null; } };
  const lang = ok(new URLSearchParams(location.search).get('lang')) || ok(store('nt-lang-tab', undefined, 'sessionStorage')) || ok(store('nt-lang')) ||
    ((navigator.languages || [navigator.language || 'en'])[0].toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
  const T = {
    zh: { title: 'NT Hub · NeuralThermal', skip: '跳到正文', menu: '菜单', products: '产品', industries: '行业', labs: '实验室', cases: '案例与演示', api: '开发者中心', engage: '合作方式', about: '关于', contact: '联系',
      switchTo: 'EN', switchLabel: 'Switch to English', h1: '物理 AI 与先进计算前沿速递',
      back: '← 返回 NT Hub', brief: 'NT 解读', credit: '图片来源', missing: '没有找到这条速递，可能已移入往期或链接有误。',
      share: '分享', shareAll: '分享…', copy: '复制链接', copied: '链接已复制', wechat: '微信 / 朋友圈', weibo: '微博', xhs: '小红书',
      xhsDone: '已复制标题和链接，打开小红书粘贴即可', wxTitle: '用微信扫一扫', wxNote: '在微信里打开后，点右上角「···」即可发给朋友或分享到朋友圈。',
      wxIn: '点右上角「···」，即可发给朋友或分享到朋友圈。', close: '关闭', copyFail: '复制失败，请手动复制地址栏里的链接',
      orig: { ai: '阅读原文', compute: '阅读原文', oss: '打开项目主页', hf: '在 Hugging Face 查看', study: '查看原始招生信息并申请', contest: '前往官网查看详情', jobs: '查看原始岗位并申请' }, origFrom: '原文来自',
      ai: '物理 AI', compute: '先进计算', oss: '开源工具', hf: '论文与模型', study: '硕博留学', contest: '会议与论坛', jobs: '实习与工作', more: '查看更多', past: n => `往期（${n} 条）`, empty: '暂无条目。',
      due: '截止', closed: '已截止', tabs: '栏目',
      askH: '想申这个方向？', ask: '不确定自己的背景对不对口，可以加微信，说说你的专业和想申的岗位，我们从课题角度给些建议。', askScan: '微信扫码或长按识别', askAlt: '微信二维码',
      studyNote: '不确定背景是否对口？每篇解读末尾可以加微信聊聊。',
      jobsNote: '标「NT 推荐」的岗位可以通过我们投递；「行业岗位」供参考，请在原文页面自行投递。',
      kindRef: 'NT 推荐', kindInd: '行业岗位',
      diagH: '想冲这类岗位？', diag: '我们提供求职竞争力诊断：从技术角度看你的项目和简历离这个岗位还差什么，给出简历精修和面试准备的建议。加微信，说说你的背景和目标岗位。', diagScan: '微信扫码或长按识别 · 本岗位请在原文页面自行投递',
      cvH: '想通过我们推荐？', cv: '把简历（PDF）和想投的岗位发到 <a href="mailto:tech@neuralthermal.com?subject={s}">tech@neuralthermal.com</a>，点邮箱地址会自动填好岗位编号，标题后面再加上你的姓名。我们先看背景是否匹配，合适的话会联系你，再推荐给用人企业。推荐对求职者免费。', cvNote: '简历只用于岗位推荐，不会公开。', cvSubject: '简历投递：',
      note: '信息来自各来源的公开页面，日期和名额请以原文为准。发现有误或想推荐线索，欢迎写信至 <a href="mailto:tech@neuralthermal.com">tech@neuralthermal.com</a>。' },
    en: { title: 'NT Hub · NeuralThermal', skip: 'Skip to content', menu: 'Menu', products: 'Products', industries: 'Industries', labs: 'Labs', cases: 'Cases & demos', api: 'Developer Center', engage: 'How we work', about: 'About', contact: 'Contact',
      switchTo: '中文', switchLabel: '切换到中文', h1: 'Physical AI & Advanced Computing Briefing',
      back: '← Back to NT Hub', brief: 'NT brief', credit: 'Image', missing: 'This item was not found. It may have moved to the archive, or the link is wrong.',
      share: 'Share', shareAll: 'Share…', copy: 'Copy link', copied: 'Link copied', wechat: 'WeChat', weibo: 'Weibo', xhs: 'Xiaohongshu',
      xhsDone: 'Title and link copied. Paste them into Xiaohongshu.', wxTitle: 'Scan with WeChat', wxNote: 'Open it in WeChat, then tap “···” at the top right to send it to a chat or post it to Moments.',
      wxIn: 'Tap “···” at the top right to send this to a chat or post it to Moments.', close: 'Close', copyFail: 'Could not copy. Please copy the link from the address bar.',
      orig: { ai: 'Read the original', compute: 'Read the original', oss: 'Open the project', hf: 'View on Hugging Face', study: 'See the original posting and apply', contest: 'Go to the official page', jobs: 'See the original job and apply' }, origFrom: 'Original from',
      ai: 'Physical AI', compute: 'Advanced computing', oss: 'Open-source tools', hf: 'Papers & models', study: 'Graduate study abroad', contest: 'Conferences & forums', jobs: 'Internships & jobs', more: 'Show more', past: n => `Archive (${n})`, empty: 'Nothing here yet.',
      due: 'Deadline', closed: 'Closed', tabs: 'Sections',
      askH: 'Considering this direction?', ask: 'Not sure your background fits? Add us on WeChat, tell us your field and the position you have in mind, and we will share our view on the research fit.', askScan: 'Scan with WeChat, or press and hold to open', askAlt: 'WeChat QR code',
      studyNote: 'Not sure your background fits? Each brief ends with a WeChat contact.',
      jobsNote: 'Roles marked “NT referral” can be applied for through us; “Industry role” listings are for reference, so apply on the original page.',
      kindRef: 'NT referral', kindInd: 'Industry role',
      diagH: 'Aiming for roles like this?', diag: 'Our job-readiness review looks at your projects and CV against the role from a technical angle, and suggests how to sharpen your CV and prepare for interviews. Add us on WeChat with your background and target role.', diagScan: 'Scan with WeChat, or press and hold · Apply for this role on the original page',
      cvH: 'Want us to refer you?', cv: 'Email your CV (PDF) and the position to <a href="mailto:tech@neuralthermal.com?subject={s}">tech@neuralthermal.com</a>; the link fills in the job code, so just add your name to the subject. We check the fit first; if it matches, we will get in touch and refer you to the employer. Referrals are free for candidates.', cvNote: 'Your CV is used only for referrals and is never published.', cvSubject: 'CV: ',
      note: 'Items come from public pages; check the original for exact dates and places. Spotted an error or have a lead? Write to <a href="mailto:tech@neuralthermal.com">tech@neuralthermal.com</a>.' }
  }[lang];
  const CAT = { ai: T.ai, compute: T.compute, oss: T.oss, hf: T.hf, study: T.study, contest: T.contest, jobs: T.jobs };
  const pick = (x, k) => (lang === 'en' && x[k + '_en']) || x[k];
  const PAGE = 10;
  const items = (window.NT_HUB_ITEMS || []).slice();
  const link = x => `/hub/a/?id=${encodeURIComponent(x.id)}&lang=${lang}`;
  const thumb = x => x.img ? `/hub/img/${esc(x.img)}` : (x.logo ? `/hub/logos/${esc(x.logo)}` : '/assets/favicon.svg');
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

  // An item expires once its deadline passes; without a deadline, 物理 AI and 先进计算 keep 30 days from collection, others 90.
  const expired = x => x.deadline ? x.deadline < today : daysAgo(x.added || today) > (x.cat === 'ai' || x.cat === 'compute' ? 30 : x.cat === 'jobs' ? 45 : 90);
  const current = items.filter(x => !expired(x));
  const past = items.filter(expired);

  function card(x, rank) {
    const meta = [`<span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span>`, `<span>${esc(pick(x, 'source'))}</span>`];
    if (x.cat === 'jobs') meta.splice(1, 0, kindTag(x));
    if (x.date) meta.push(`<time datetime="${esc(x.date)}">${day(x.date)}</time>`);
    const when = [];
    if (x.deadline) {
      const past = x.deadline < today;
      when.push(`<span class="hub-due${past ? ' past' : ''}">${past ? T.closed : T.due} ${day(x.deadline)}</span>`);
    }
    if (x.when) when.push(`<span>${esc(pick(x, 'when'))}</span>`);
    const pic = `<a class="hub-pic${x.img ? ' photo' : ''}" href="${link(x)}" tabindex="-1" aria-hidden="true"><img src="${thumb(x)}" alt="" loading="lazy"></a>`;
    return `<article class="hub-item"><div>
      <div class="hub-meta">${meta.join('')}</div>
      <h2>${rank ? `<span class="hub-rank">${rank}</span>` : ''}<a href="${link(x)}">${esc(pick(x, 'title'))}</a></h2>
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
    if (cat === 'study' || cat === 'jobs') list.innerHTML = `<p class="hub-tabnote">${cat === 'study' ? T.studyNote : T.jobsNote}</p>`;
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

  const burger = document.querySelector('.burger'), links = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  const art = document.getElementById('hub-article');
  if (art) return article(art);

  document.getElementById('hub-tabs').setAttribute('aria-label', T.tabs);
  const chips = document.querySelectorAll('.hub-tabs .chip');
  const press = b => chips.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
  // Section tabs stay pinned under the site menu; switching a tab while pinned jumps back to the top of the list.
  const tabs = document.getElementById('hub-tabs'), nav = document.querySelector('.nav');
  const navH = () => nav ? nav.offsetHeight : 0;
  const sizeTabs = () => {
    document.documentElement.style.setProperty('--hub-nav-h', navH() + 'px');
    document.documentElement.style.setProperty('--hub-tabs-h', tabs.offsetHeight + 'px');
    tabs.classList.toggle('stuck', tabs.getBoundingClientRect().top <= navH() + 1 && scrollY > 0);
  };
  addEventListener('scroll', sizeTabs, { passive: true });
  addEventListener('resize', sizeTabs);
  sizeTabs();
  chips.forEach(b => b.addEventListener('click', () => {
    sizeTabs(); press(b); render(b.dataset.cat);
    if (tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = b.offsetLeft - 16;
    if (tabs.classList.contains('stuck')) scrollTo(0, list.getBoundingClientRect().top + scrollY - navH() - tabs.offsetHeight - 12);
  }));
  more.addEventListener('click', page);
  pastBtn.hidden = !past.length;
  pastBtn.textContent = T.past(past.length);
  pastBtn.addEventListener('click', () => { press(null); renderPast(); list.scrollIntoView({ behavior: 'smooth' }); });
  hero(current.filter(x => x.top).sort((a, b) => a.top - b.top));
  render('top');

  // Top 5 carousel: big picture on the left, the five headlines on the right; rotates every 5 s.
  function hero(tops) {
    const box = document.getElementById('hub-hero');
    if (!box || !tops.length) return;
    const slide = (x, i) => `<a class="hs-slide${x.img ? '' : ' noimg'}" href="${link(x)}" data-i="${i}">
      ${x.img ? `<img src="/hub/img/${esc(x.img)}" alt="" ${i ? 'loading="lazy"' : ''}>` : `<span class="hs-logo"><img src="${thumb(x)}" alt=""></span>`}
      <span class="hs-cap"><span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span><strong><span class="hub-rank">${i + 1}</span>${esc(pick(x, 'title'))}</strong></span></a>`;
    box.innerHTML = `<div class="hs-stage">${tops.map(slide).join('')}</div>
      <ol class="hs-list">${tops.map((x, i) => `<li><a href="${link(x)}" data-i="${i}" aria-label="${i + 1}. ${esc(pick(x, 'title'))}"><span class="hub-rank">${i + 1}</span><span>${esc(pick(x, 'title'))}</span></a></li>`).join('')}</ol>`;
    box.hidden = false;
    const slides = box.querySelectorAll('.hs-slide'), heads = box.querySelectorAll('.hs-list li');
    let at = 0, timer = null;
    const show = i => { at = i; slides.forEach((s, k) => s.classList.toggle('on', k === i)); heads.forEach((h, k) => h.classList.toggle('on', k === i)); };
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches, narrow = matchMedia('(max-width: 760px)');
    const play = () => { if (!still && !timer) timer = setInterval(() => show((at + 1) % tops.length), 5000); };
    const stop = () => { clearInterval(timer); timer = null; };
    box.querySelectorAll('.hs-list a').forEach(a => {
      a.addEventListener('mouseenter', () => show(+a.dataset.i));
      a.addEventListener('focus', () => show(+a.dataset.i));
      // On phones the headlines shrink to dots: the first tap on a dot switches the picture.
      a.addEventListener('click', e => { if (narrow.matches && +a.dataset.i !== at) { e.preventDefault(); show(+a.dataset.i); } });
    });
    box.addEventListener('mouseenter', stop); box.addEventListener('mouseleave', play);
    box.addEventListener('focusin', stop); box.addEventListener('focusout', play);
    show(0); play();
  }

  // Article page: the NT brief for one item, the original link last.
  function article(el) {
    const id = new URLSearchParams(location.search).get('id');
    const x = items.find(i => i.id === id);
    el.querySelector('.hub-back').href = '/hub/?lang=' + lang;
    if (!x) { el.insertAdjacentHTML('beforeend', `<p class="hub-missing">${T.missing}</p>`); return; }
    document.title = `${pick(x, 'title')} · NT Hub`;
    const meta = [`<span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span>`, `<span>${esc(pick(x, 'source'))}</span>`];
    if (x.cat === 'jobs') meta.splice(1, 0, kindTag(x));
    if (x.date) meta.push(`<time datetime="${esc(x.date)}">${day(x.date)}</time>`);
    const when = [];
    if (x.deadline) when.push(`<span class="hub-due${x.deadline < today ? ' past' : ''}">${x.deadline < today ? T.closed : T.due} ${day(x.deadline)}</span>`);
    if (x.when) when.push(`<span>${esc(pick(x, 'when'))}</span>`);
    const body = (pick(x, 'report') || pick(x, 'summary')).split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('');
    let host = '';
    try { host = new URL(x.url).hostname.replace(/^www\./, ''); } catch (e) {}
    el.insertAdjacentHTML('beforeend', `
      <div class="hub-meta">${meta.join('')}</div>
      <h1>${esc(pick(x, 'title'))}</h1>
      ${when.length ? `<div class="hub-when">${when.join('')}</div>` : ''}
      ${x.img ? `<figure class="hub-fig"><img src="/hub/img/${esc(x.img)}" alt=""><figcaption>${T.credit}: ${esc(pick(x, 'source'))}</figcaption></figure>` : ''}
      <h2 class="hub-brief">${T.brief}</h2>
      <div class="hub-report">${body}</div>
      ${x.cat === 'study' ? contactCard() : x.cat === 'jobs' ? (x.kind === 'ref' ? cvCard(x) : contactCard(T.diagH, T.diag, T.diagScan)) : ''}
      ${shareBar()}
      ${x.url ? `<div class="hub-orig"><a class="btn primary" href="${esc(x.url)}" target="_blank" rel="noopener">${(T.orig[x.cat] || T.orig.ai)} ↗</a><span>${T.origFrom} ${esc(pick(x, 'source'))}${host ? ' · ' + esc(host) : ''}</span></div>` : ''}`);
    share(el, x);
  }

  // Share bar: the phone's own share sheet where there is one (it reaches WeChat, Xiaohongshu and the rest),
  // a WeChat QR code, Weibo / LinkedIn share pages, and copy link. No login, no tracking. Shown once, after the brief.
  // X is left out on purpose: the user considers it sensitive for readers in China.
  function contactCard(h = T.askH, p = T.ask, scan = T.askScan) {
    return `<aside class="hub-contact"><img src="/hub/contact/wechat.jpg" alt="${T.askAlt}" width="112" height="112" loading="lazy"><div><h2>${h}</h2><p>${p}</p><span>${scan}</span></div></aside>`;
  }

  // Jobs come in two kinds: kind 'ref' = NT referral (CV to us, company may be anonymised), otherwise a public industry role.
  function kindTag(x) {
    return x.kind === 'ref' ? `<span class="hub-kind ref">${T.kindRef}</span>` : `<span class="hub-kind">${T.kindInd}</span>`;
  }

  function cvCard(x) {
    const cv = T.cv.replace('{s}', encodeURIComponent(T.cvSubject + (x.code ? x.code + ' ' : '') + pick(x, 'title')));
    return `<aside class="hub-contact hub-cv"><div><h2>${T.cvH}</h2><p>${cv}</p><span>${T.cvNote}</span></div></aside>`;
  }

  function shareBar() {
    const b = (k, label) => `<button class="chip hub-sh" type="button" data-sh="${k}">${label}</button>`;
    const native = navigator.share ? b('native', T.shareAll) : '';
    const order = lang === 'zh' ? ['wechat', 'xhs', 'weibo', 'linkedin', 'copy'] : ['linkedin', 'wechat', 'weibo', 'copy'];
    const label = { wechat: T.wechat, xhs: T.xhs, weibo: T.weibo, linkedin: 'LinkedIn', copy: T.copy };
    return `<div class="hub-share"><span>${T.share}</span>${native}${order.map(k => b(k, label[k])).join('')}</div>`;
  }

  function share(el, x) {
    const url = `${location.origin}/hub/a/?id=${encodeURIComponent(x.id)}&lang=${lang}`;
    const title = pick(x, 'title');
    const inWeChat = /MicroMessenger/i.test(navigator.userAgent);
    const toast = msg => {
      let t = document.getElementById('hub-toast');
      if (!t) { t = document.createElement('div'); t.id = 'hub-toast'; t.className = 'hub-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.textContent = msg; t.classList.add('on');
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600);
    };
    const copy = (text, done) => {
      const fallback = () => {
        const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select();
        let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
        ta.remove(); toast(ok ? done : T.copyFail);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(done), fallback);
      else fallback();
    };
    const open = u => window.open(u, '_blank', 'noopener,width=640,height=560');
    const q = encodeURIComponent;
    const wechat = () => {
      if (inWeChat) { toast(T.wxIn); return; }
      const show = () => {
        const qr = window.qrcode(0, 'M'); qr.addData(url); qr.make();
        let d = document.getElementById('hub-wx');
        if (!d) { d = document.createElement('dialog'); d.id = 'hub-wx'; d.className = 'hub-wx'; document.body.appendChild(d); d.addEventListener('click', e => { if (e.target === d) d.close(); }); }
        d.innerHTML = `<h2>${T.wxTitle}</h2><div class="hub-qr">${qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true })}</div><p>${T.wxNote}</p><button class="chip" type="button">${T.close}</button>`;
        d.querySelector('button').addEventListener('click', () => d.close());
        d.showModal();
      };
      if (window.qrcode) return show();
      const sc = document.createElement('script'); sc.src = '/hub/vendor/qrcode.js'; sc.onload = show; document.head.appendChild(sc);
    };
    const act = {
      native: () => navigator.share({ title, text: title, url }).catch(() => {}),
      wechat,
      xhs: () => copy(`${title} ${url}`, T.xhsDone),
      weibo: () => open(`https://service.weibo.com/share/share.php?url=${q(url)}&title=${q(title)}`),
      linkedin: () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${q(url)}`),
      copy: () => copy(url, T.copied)
    };
    el.querySelectorAll('.hub-sh').forEach(btn => btn.addEventListener('click', () => act[btn.dataset.sh]()));
  }
})();
