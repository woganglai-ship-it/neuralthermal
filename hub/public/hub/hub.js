/* NT Hub · renders window.NT_HUB_ITEMS newest first: a numbered Top 5, each section's current items
   10 at a time, and an 往期 archive grouped by month for expired ones. */
(function () {
  const CAT = { news: '物理 AI 与行业动态', study: '升学留学', contest: '会议与竞赛' };
  const PAGE = 10;
  const items = (window.NT_HUB_ITEMS || []).slice();
  const list = document.getElementById('hub-list');
  const more = document.getElementById('hub-more');
  const pastBtn = document.getElementById('hub-past');
  const today = new Date().toISOString().slice(0, 10);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = d => { const [y, m, dd] = d.split('-'); return dd ? `${y} 年 ${+m} 月 ${+dd} 日` : (m ? `${y} 年 ${+m} 月` : y); };
  const daysAgo = d => (Date.parse(today) - Date.parse(d)) / 864e5;

  // Newest collection day first; inside a day, newest publish date first, undated last.
  items.sort((a, b) => (b.added || '').localeCompare(a.added || '') || (b.date || '0').localeCompare(a.date || '0'));

  // An item expires once its deadline passes; without a deadline, news keeps 30 days from collection, others 90.
  const expired = x => x.deadline ? x.deadline < today : daysAgo(x.added || today) > (x.cat === 'news' ? 30 : 90);
  const current = items.filter(x => !expired(x));
  const past = items.filter(expired);

  function card(x, rank) {
    const meta = [`<span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span>`, `<span>${esc(x.source)}</span>`];
    if (x.date) meta.push(`<time datetime="${esc(x.date)}">${day(x.date)}</time>`);
    const when = [];
    if (x.deadline) {
      const past = x.deadline < today;
      when.push(`<span class="hub-due${past ? ' past' : ''}">${past ? '已截止' : '截止'} ${day(x.deadline)}</span>`);
    }
    if (x.when) when.push(`<span>${esc(x.when)}</span>`);
    const pic = `<a class="hub-pic" href="${esc(x.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${x.logo ? 'logos/' + esc(x.logo) : '/assets/favicon.svg'}" alt="" loading="lazy"></a>`;
    return `<article class="hub-item"><div>
      <div class="hub-meta">${meta.join('')}</div>
      <h2>${rank ? `<span class="hub-rank">${rank}</span>` : ''}<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a></h2>
      <p class="s">${esc(x.summary)}</p>
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
    if (!rows.length) { list.innerHTML = '<p>暂无条目。</p>'; more.hidden = true; return; }
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
  pastBtn.textContent = `往期（${past.length} 条）`;
  pastBtn.addEventListener('click', () => { press(null); renderPast(); list.scrollIntoView({ behavior: 'smooth' }); });
  const burger = document.querySelector('.burger'), links = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  render('top');
})();
