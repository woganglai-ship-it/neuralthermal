/* NT Hub · renders window.NT_HUB_ITEMS grouped by collection date (newest first), filtered by section. */
(function () {
  const CAT = { news: '物理 AI 与行业动态', study: '升学留学', contest: '会议与竞赛' };
  const items = (window.NT_HUB_ITEMS || []).slice();
  const list = document.getElementById('hub-list');
  const today = new Date().toISOString().slice(0, 10);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = d => { const [y, m, dd] = d.split('-'); return dd ? `${y} 年 ${+m} 月 ${+dd} 日` : (m ? `${y} 年 ${+m} 月` : y); };

  // Newest collection day first; inside a day, newest publish date first, undated last.
  items.sort((a, b) => (b.added || '').localeCompare(a.added || '') || (b.date || '0').localeCompare(a.date || '0'));

  function card(x) {
    const meta = [`<span class="hub-cat ${x.cat}">${CAT[x.cat] || ''}</span>`, `<span>${esc(x.source)}</span>`];
    if (x.date) meta.push(`<time datetime="${esc(x.date)}">${day(x.date)}</time>`);
    const when = [];
    if (x.deadline) {
      const past = x.deadline < today;
      when.push(`<span class="hub-due${past ? ' past' : ''}">${past ? '已截止' : '截止'} ${day(x.deadline)}</span>`);
    }
    if (x.when) when.push(`<span>${esc(x.when)}</span>`);
    const pic = x.img ? `<a class="hub-pic" href="${esc(x.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="/assets/img/${esc(x.img)}" alt="" loading="lazy"></a>` : '';
    return `<article class="hub-item"><div>
      <div class="hub-meta">${meta.join('')}</div>
      <h2><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a></h2>
      <p class="s">${esc(x.summary)}</p>
      ${when.length ? `<div class="hub-when">${when.join('')}</div>` : ''}
    </div>${pic}</article>`;
  }

  function render(cat) {
    const rows = items.filter(x => !cat || x.cat === cat);
    let html = '', last = '';
    for (const x of rows) {
      if (x.added !== last) { last = x.added; html += `<h3 class="hub-day">${day(x.added)} 收录</h3>`; }
      html += card(x);
    }
    list.innerHTML = html || '<p>暂无条目。</p>';
  }

  document.querySelectorAll('.hub-tabs .chip').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.hub-tabs .chip').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    render(b.dataset.cat);
  }));

  const burger = document.querySelector('.burger'), links = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  render('');
})();
