/* mathlite.js — 无网络依赖的轻量 LaTeX 渲染器
   API 与 KaTeX 兼容：MathLite.renderToString(tex, {displayMode})
   若页面上没有 katex，则接管 window.katex，使现有调用无需改动。 */
(function () {
  var SYM = {
    alpha: 'α', beta: 'β', gamma: 'γ', Gamma: 'Γ', delta: 'δ', Delta: 'Δ',
    epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', Theta: 'Θ',
    iota: 'ι', kappa: 'κ', lambda: 'λ', Lambda: 'Λ', mu: 'μ', nu: 'ν', xi: 'ξ',
    pi: 'π', Pi: 'Π', rho: 'ρ', sigma: 'σ', Sigma: 'Σ', tau: 'τ', upsilon: 'υ',
    phi: 'φ', varphi: 'φ', Phi: 'Φ', chi: 'χ', psi: 'ψ', Psi: 'Ψ', omega: 'ω', Omega: 'Ω',
    cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗', star: '⋆',
    le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', equiv: '≡',
    sim: '∼', simeq: '≃', propto: '∝', ll: '≪', gg: '≫', ldots: '…', cdots: '⋯', dots: '…',
    to: '→', rightarrow: '→', longrightarrow: '⟶', leftarrow: '←', Rightarrow: '⇒',
    infty: '∞', partial: '∂', nabla: '∇', circ: '°', degree: '°', prime: '′',
    perp: '⊥', angle: '∠', in: '∈', notin: '∉', ni: '∋', subset: '⊂', subseteq: '⊆', supset: '⊃',
    cup: '∪', cap: '∩', emptyset: '∅', forall: '∀', exists: '∃', neg: '¬', land: '∧', lor: '∨',
    surd: '√', ell: 'ℓ', hbar: 'ℏ', aleph: 'ℵ',
    '{': '{', '}': '}', '%': '%', '&': '&', '#': '#', '$': '$', '_': '_'
  };
  var BIG = { sum: '∑', prod: '∏', int: '∫', oint: '∮' };
  var FUNCS = ['ln', 'log', 'lg', 'exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'max', 'min', 'lim', 'det', 'deg', 'mod'];
  var SPACE = { ',': '.17em', ';': '.28em', ':': '.22em', ' ': '.3em', '!': '-.17em', quad: '1em', qquad: '2em', enspace: '.5em', thinspace: '.17em' };
  var ACCENT = { dot: '̇', ddot: '̈', bar: '̄', overline: '‾', hat: '̂', widehat: '̂', check: '̌',
    vec: '⃗', tilde: '̃', widetilde: '̃', acute: '́', grave: '̀', breve: '̆' };
  var UPRIGHT = ['mathrm', 'text', 'textrm', 'mathbf', 'textbf', 'mathsf', 'mathtt', 'operatorname', 'mathbb', 'mathcal', 'rm'];
  var SERIF = "'Times New Roman','Nimbus Roman','Songti SC',STIXGeneral,serif";

  function esc(c) { return c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c; }

  function lex(s) {
    var t = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === '\\') {
        var m = /^[a-zA-Z]+/.exec(s.slice(i + 1));
        if (m) { t.push({ t: 'cmd', v: m[0] }); i += 1 + m[0].length; }
        else { t.push({ t: 'cmd', v: s[i + 1] || '' }); i += 2; }
        continue;
      }
      if (c === '{' || c === '}' || c === '^' || c === '_') { t.push({ t: c }); i++; continue; }
      if (c === ' ' || c === '\n' || c === '\t') { t.push({ t: 'sp' }); i++; continue; }
      t.push({ t: 'ch', v: c }); i++;
    }
    return t;
  }

  function frac(n, d) {
    return '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;' +
      'margin:0 .2em;line-height:1.25;position:relative;top:-.08em">' +
      '<span style="padding:0 .15em">' + n + '</span>' +
      '<span style="border-top:1px solid currentColor;padding:0 .15em">' + d + '</span></span>';
  }

  function radical(inner) {
    return '<span style="display:inline-block;white-space:nowrap;line-height:1.1">' +
      '<span style="font-size:1.08em">√</span>' +
      '<span style="display:inline-block;border-top:1px solid currentColor;padding:.02em .14em 0;' +
      'margin-left:-.07em;line-height:1.15">' + inner + '</span></span>';
  }

  function accent(mark, inner) {
    if (mark === '‾') {
      return '<span style="display:inline-block;border-top:1px solid currentColor;padding-top:.06em;line-height:1.1">' + inner + '</span>';
    }
    // 单字母底座：直接用组合附加符号，由字体自行定位，最可靠
    var m = /^(<i style="font-family:inherit">)([A-Za-z])(<\/i>)$/.exec(inner);
    if (m) return m[1] + m[2] + mark + m[3];
    if (/^[A-Za-z0-9]$/.test(inner)) return inner + mark;
    return '<span style="display:inline-block">' + inner + mark + '</span>';
  }

  function delimOf(tok) {
    if (!tok) return '';
    var v = tok.v;
    if (tok.t === 'cmd') {
      if (v === '{' || v === '}') return v;
      if (v === 'langle') return '⟨';
      if (v === 'rangle') return '⟩';
      if (v === 'lvert' || v === 'rvert' || v === 'vert') return '|';
      return '';
    }
    if (v === '.') return '';
    return v || '';
  }

  function stretch(ch, f) {
    if (!ch) return '';
    if (f <= 1.25) return esc(ch);
    return '<span style="display:inline-block;transform:scaleY(' + f.toFixed(2) +
      ');transform-origin:center;vertical-align:middle">' + esc(ch) + '</span>';
  }

  function arg(tk, p, up) {
    if (p >= tk.length) return { html: '', tall: false, p: p };
    while (tk[p] && tk[p].t === 'sp') p++;
    if (tk[p] && tk[p].t === '{') { var g = build(tk, p + 1, 'group', up); return g; }
    var one = build([tk[p]], 0, 'end', up);
    return { html: one.html, tall: one.tall, p: p + 1 };
  }

  var REL = '=<>≤≥≠≈≡∼≃∝≪≫→←⇒∈⊂+±∓−';
  var TIGHT = '·×÷∘';

  function build(tk, p, mode, up) {
    var out = [], tall = false, lastOp = true;
    function put(h, t) { out.push(h); if (t) tall = true; lastOp = false; }
    function putOp(ch) {
      var unary = lastOp && (ch === '−' || ch === '+');
      var gap = TIGHT.indexOf(ch) >= 0 ? '.11em' : '.2em';
      out.push(unary ? esc(ch) : '<span style="margin:0 ' + gap + '">' + esc(ch) + '</span>');
      lastOp = !unary;
    }
    while (p < tk.length) {
      var t = tk[p];
      if (t.t === '}') { p++; if (mode === 'group') break; continue; }
      if (t.t === 'sp') { p++; continue; }
      if (t.t === '{') { var g = build(tk, p + 1, 'group', up); put(g.html, g.tall); p = g.p; continue; }
      if (t.t === '^' || t.t === '_') {
        var a = arg(tk, p + 1, up);
        put('<span style="font-size:.72em;vertical-align:' + (t.t === '^' ? 'super' : 'sub') + '">' + a.html + '</span>', false);
        p = a.p; continue;
      }
      if (t.t === 'cmd') {
        var v = t.v;
        if (v === 'right') { if (mode === 'right') break; p++; continue; }
        if (v === 'frac' || v === 'dfrac' || v === 'tfrac' || v === 'cfrac') {
          var n = arg(tk, p + 1, up), d = arg(tk, n.p, up);
          put(frac(n.html, d.html), true); p = d.p; continue;
        }
        if (v === 'sqrt') { var s = arg(tk, p + 1, up); put(radical(s.html), s.tall); p = s.p; continue; }
        if (v === 'left') {
          var open = delimOf(tk[p + 1]);
          var inner = build(tk, p + 2, 'right', up);
          var q = inner.p;
          var close = '';
          if (tk[q] && tk[q].t === 'cmd' && tk[q].v === 'right') { close = delimOf(tk[q + 1]); q += 2; }
          var f = inner.tall ? 2.05 : 1.2;
          put(stretch(open, f) + inner.html + stretch(close, f), inner.tall);
          p = q; continue;
        }
        if (ACCENT[v]) {
          var ac = arg(tk, p + 1, up);
          put(accent(ACCENT[v], ac.html), ac.tall); p = ac.p; continue;
        }
        if (UPRIGHT.indexOf(v) >= 0) {
          var u = arg(tk, p + 1, true);
          put('<span style="font-style:normal">' + u.html + '</span>', u.tall); p = u.p; continue;
        }
        if (BIG[v]) {
          put('<span style="font-size:1.4em;line-height:0;vertical-align:-.12em;padding:0 .06em">' + BIG[v] + '</span>', false);
          p++; continue;
        }
        if (FUNCS.indexOf(v) >= 0) {
          put('<span style="font-style:normal;padding-right:.12em">' + v + '</span>', false); p++; continue;
        }
        if (SPACE[v] !== undefined) {
          put('<span style="display:inline-block;width:' + SPACE[v] + '"></span>', false); p++; continue;
        }
        if (SYM[v] !== undefined) {
          var sv = SYM[v];
          if (REL.indexOf(sv) >= 0 || TIGHT.indexOf(sv) >= 0) putOp(sv); else put(esc(sv), false);
          p++; continue;
        }
        put('<span style="font-family:monospace;font-style:normal;color:#b3261e">\\' + v.replace(/[<>&]/g, esc) + '</span>', false); p++; continue;
      }
      var c = t.v;
      if (/[a-zA-Z]/.test(c) && !up) put('<i style="font-family:inherit">' + c + '</i>', false);
      else if (c === "'") put('′', false);
      else if (c === '-') putOp('−');
      else if (REL.indexOf(c) >= 0) putOp(c);
      else put(esc(c), false);
      p++;
    }
    return { html: out.join(''), tall: tall, p: p };
  }

  var ML = {
    renderToString: function (tex, opts) {
      var r;
      try { r = build(lex(String(tex == null ? '' : tex)), 0, 'end', false); }
      catch (e) { return '<span style="font-family:monospace">' + String(tex).replace(/[<>&]/g, esc) + '</span>'; }
      var base = 'font-family:' + SERIF + ';font-size:1.08em;line-height:1.45;';
      if (opts && opts.displayMode) base += 'display:inline-block;padding:.3em 0 .14em;';
      else base += 'padding-top:.22em;';
      return '<span class="ml-math" style="' + base + '">' + r.html + '</span>';
    },
    render: function (tex, el, opts) { el.innerHTML = ML.renderToString(tex, opts); }
  };

  window.MathLite = ML;
  if (!window.katex) window.katex = ML;
})();
