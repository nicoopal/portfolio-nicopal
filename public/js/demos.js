/* Miniaturas interactivas. Todo dibujado por código, con datos inventados. */
(function () {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isEn = () => document.documentElement.lang === 'en';
  const tx = (es, en) => (isEn() ? en : es);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const T = (es, en) => `<span data-es="${esc(es)}" data-en="${esc(en)}">${tx(es, en)}</span>`;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[(Math.random() * a.length) | 0];

  function fit(c) {
    const r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(2, Math.round(r.width * d)); c.height = Math.max(2, Math.round(r.height * d));
    const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
    return { x, w: r.width, h: r.height };
  }
  function ticker(fn) {
    let id = 0, on = false, last = 0;
    const f = (t) => { if (!on) return; const dt = Math.min(50, t - last); last = t; fn(t, dt); id = requestAnimationFrame(f); };
    return { start() { if (on) return; on = true; last = performance.now(); id = requestAnimationFrame(f); }, stop() { on = false; cancelAnimationFrame(id); } };
  }
  /* cadena de timeouts cancelable */
  function seq() {
    let ids = [];
    return { at(ms, fn) { ids.push(setTimeout(fn, ms)); }, clear() { ids.forEach(clearTimeout); ids = []; } };
  }

  /* ───────── Escritura de trazo único (como Handpal) ───────── */
  function layoutText(text, W, H, size, pad) {
    const F = window.STROKE_FONT || {}, s = size / 1000, lh = size * 1.12, maxW = W - 2 * pad;
    const adv = (ch) => (F[ch] || F['?'] || [400, []])[0] * s;
    const sp = adv(' ');
    const words = text.split(/\s+/).filter(Boolean);
    const lines = []; let cur = [], cw = 0, tooWide = false;
    for (const w of words) {
      const l = [...w].reduce((a, ch) => a + adv(ch), 0);
      if (l > maxW) tooWide = true;
      if (cur.length && cw + sp + l > maxW) { lines.push(cur); cur = []; cw = 0; }
      cw += (cur.length ? sp : 0) + l; cur.push(w);
    }
    if (cur.length) lines.push(cur);
    const th = lines.length * lh;
    const strokes = [];
    lines.forEach((ln, i) => {
      const base = pad + (H - 2 * pad - th) / 2 + size * 0.86 + i * lh;
      let x = pad;
      ln.forEach((w) => {
        for (const ch of w) {
          const g = F[ch] || F['?']; if (!g) continue;
          for (const st of g[1]) { const p = []; for (let k = 0; k < st.length; k += 2) p.push(x + st[k] * s, base - st[k + 1] * s); if (p.length >= 4) strokes.push(p); }
          x += g[0] * s;
        }
        x += sp;
      });
    });
    return { strokes, fits: !tooWide && th <= H - 2 * pad };
  }
  function writer(canvas, getText, o) {
    let S = [], lens = [], total = 0, prog = 0, D = null, hold = 0;
    function prep() {
      D = fit(canvas);
      const text = getText() || ' ';
      let lo = 8, hi = o.max || 120, best = layoutText(text, D.w, D.h, lo, o.pad);
      for (let i = 0; i < 16; i++) { /* búsqueda binaria del tamaño que entra en la caja */
        const mid = (lo + hi) / 2, L = layoutText(text, D.w, D.h, mid, o.pad);
        if (L.fits) { lo = mid; best = L; } else hi = mid;
      }
      S = best.strokes; lens = S.map((p) => { let l = 0; for (let k = 2; k < p.length; k += 2) l += Math.hypot(p[k] - p[k - 2], p[k + 1] - p[k - 1]); return l; });
      total = lens.reduce((a, b) => a + b, 0); prog = RM ? total : 0; hold = 0;
      D.size = lo;
    }
    function draw() {
      const { x, w, h } = D; x.clearRect(0, 0, w, h);
      if (o.bg) o.bg(x, w, h);
      x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = o.color; x.lineWidth = Math.max(1.3, (o.lw || 0.045) * D.size);
      let left = prog, hx = null, hy = null;
      for (let i = 0; i < S.length && left > 0; i++) {
        const p = S[i]; x.beginPath(); x.moveTo(p[0], p[1]); hx = p[0]; hy = p[1];
        for (let k = 2; k < p.length; k += 2) {
          const sl = Math.hypot(p[k] - p[k - 2], p[k + 1] - p[k - 1]);
          if (left >= sl) { x.lineTo(p[k], p[k + 1]); hx = p[k]; hy = p[k + 1]; left -= sl; }
          else { const f = left / (sl || 1); hx = p[k - 2] + (p[k] - p[k - 2]) * f; hy = p[k - 1] + (p[k + 1] - p[k - 1]) * f; x.lineTo(hx, hy); left = 0; break; }
        }
        x.stroke();
        if (left <= 0) break;
      }
      if (o.cursor && hx !== null && !RM) { /* el cursor que "escribe" */
        x.save(); x.translate(hx, hy); x.fillStyle = o.cursor; x.strokeStyle = o.cursorEdge || '#000'; x.lineWidth = 1;
        x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 17); x.lineTo(4.6, 13); x.lineTo(7.6, 19.6); x.lineTo(10, 18.5); x.lineTo(7, 12); x.lineTo(12.6, 12); x.closePath(); x.fill(); x.stroke(); x.restore();
      }
    }
    const tk = ticker((t, dt) => {
      if (prog < total) prog = Math.min(total, prog + (o.speed || 520) * (D.size / 40) * dt / 1000);
      else if (o.loop) { hold += dt; if (hold > o.loop) { prog = 0; hold = 0; } }
      draw();
    });
    const api = {
      restart() { prep(); draw(); },
      start() { if (!D) prep(); if (RM) { draw(); return; } tk.start(); },
      stop() { tk.stop(); }
    };
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (D) { const p = prog >= total; prep(); if (p) prog = total; draw(); } }, 150); });
    document.addEventListener('langchange', () => { if (D) api.restart(); });
    return api;
  }

  const DEMOS = {};
  const NOTES = {};
  const FAKE = ['Datos inventados para la demo', 'Made-up data for the demo'];

  /* ───────── Conciliador ───────── */
  NOTES.conc = FAKE;
  DEMOS.conc = (el) => {
    const pays = [['PRE', 'Hotel Andino', 1250, [0, 1]], ['DEP', 'Transporte Sur', 830.5, [2]], ['PRE', 'Bodega del Valle', 2100, [3, 4]], ['ACCR', 'Guías del Sur', 415.25, [5]]];
    const accr = [[['Noches, grupo A', 'Nights, group A'], 750], [['Noches, grupo B', 'Nights, group B'], 500], [['Traslados', 'Transfers'], 830.5], [['Almuerzos', 'Lunches'], 1400], [['Degustación', 'Tasting'], 700], [['Guiado', 'Guiding'], 415.25]];
    const fmt = (n) => n.toLocaleString(isEn() ? 'en-US' : 'es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let n = RM ? 8 : 0; const q = seq();
    function render() {
      const k = Math.min(4, n >> 1), act = n % 2 === 1 && k < 4;
      const owner = (j) => pays.findIndex((p) => p[3].includes(j));
      const diff = pays.slice(k).reduce((a, p) => a + p[2], 0);
      el.innerHTML = `<div class="conc"><div><h4>${T('Pagos', 'Payments')}</h4><ul>${pays.map((p, i) => `<li class="${i < k ? 'done' : i === k && act ? 'act' : ''}"><span><i>${p[0]}</i>${p[1]}</span><b class="tnum">${fmt(p[2])}</b></li>`).join('')}</ul></div>
        <div><h4>${T('Devengado', 'Accrued')}</h4><ul>${accr.map((a, j) => `<li class="${owner(j) < k ? 'done' : owner(j) === k && act ? 'act' : ''}"><span>${tx(a[0][0], a[0][1])}</span><b class="tnum">${fmt(a[1])}</b></li>`).join('')}</ul></div></div>
        <div class="conc-foot"><span>${T('Diferencia USD', 'Difference USD')}<br><strong class="tnum ${diff ? '' : 'ok'}">${fmt(diff)}</strong></span><span class="badge ${diff ? 'warn' : 'ok'}">${diff ? T('Pendiente', 'Pending') : T('Cuadra al centavo', 'Balanced to the cent')}</span></div>`;
    }
    function step() { render(); if (RM) return; q.at(n >= 8 ? 3200 : 850, () => { n = n >= 8 ? 0 : n + 1; step(); }); }
    document.addEventListener('langchange', render);
    return { start() { q.clear(); step(); }, stop() { q.clear(); } };
  };

  /* ───────── Control de lotes ───────── */
  NOTES.batch = FAKE;
  DEMOS.batch = (el) => {
    el.innerHTML = `<div class="batch"><div class="batch-top"><small></small><span class="light">···</span></div><div class="rules">${Array.from({ length: 24 }, (_, i) => `<div class="rule">R${String(i + 1).padStart(2, '0')}</div>`).join('')}</div><div class="batch-bar"><i></i></div></div>`;
    const rules = [...el.querySelectorAll('.rule')], light = el.querySelector('.light'), bar = el.querySelector('.batch-bar i'), info = el.querySelector('small');
    const q = seq();
    function verdict(w, b) { light.className = 'light ' + (b ? 'nogo' : w ? 'review' : 'go'); light.textContent = b ? 'NO-GO' : w ? 'REVIEW' : 'GO'; }
    function run() {
      q.clear(); rules.forEach((r) => (r.className = 'rule')); light.className = 'light'; light.textContent = '···'; bar.style.width = '0';
      info.innerHTML = T('Lote', 'Batch') + ' ' + (400 + ((Math.random() * 90) | 0)) + ' · ' + (900 + ((Math.random() * 600) | 0)) + ' ' + T('facturas', 'invoices');
      let w = 0, b = 0;
      rules.forEach((r, i) => {
        const x = Math.random(), res = x < 0.05 ? 'r-bad' : x < 0.15 ? 'r-warn' : 'r-ok';
        const apply = () => { if (i) rules[i - 1].classList.remove('scan'); r.classList.add('scan', res); if (res === 'r-bad') b++; if (res === 'r-warn') w++; bar.style.width = ((i + 1) / 24) * 100 + '%'; if (i === 23) { r.classList.remove('scan'); verdict(w, b); } };
        if (RM) apply(); else q.at(300 + i * 105, apply);
      });
      if (!RM) q.at(300 + 24 * 105 + 3600, run);
    }
    return { start: run, stop() { q.clear(); } };
  };

  /* ───────── Asignador de guías ───────── */
  NOTES.sched = ['Algoritmo real en miniatura: carga balanceada y choques de horario', 'The real algorithm in miniature: balanced load and slot clashes'];
  DEMOS.sched = (el) => {
    const SV = [[['Tour', 'Tour'], 'am', 1], [['Museo', 'Museum'], 'pm', 1], [['Excursión', 'Day trip'], 'full', 2], [['Charla', 'Talk'], 'pm', 3], [['Traslado', 'Transfer'], 'am', 4], [['Cena', 'Dinner'], 'pm', 4]];
    const GUIDES = ['MR', 'LS', 'JP', 'CA', 'VT'], q = seq();
    let starts = [0, 0, 1, 1, 2];
    el.innerHTML = `<div class="sched"><table><thead><tr><th></th>${SV.map((s) => `<th>${T(s[0][0], s[0][1])}</th>`).join('')}</tr></thead><tbody>${starts.map((_, r) => `<tr><th>G-0${r + 1}</th>${SV.map(() => '<td>·</td>').join('')}</tr>`).join('')}</tbody></table>
      <div class="sched-legend"><span><i style="background:#1d4ed8"></i>${T('Mañana', 'Morning')}</span><span><i style="background:#b45309"></i>${T('Tarde', 'Afternoon')}</span><span><i style="background:#6d28d9"></i>${T('Día completo', 'Full day')}</span><span><i style="background:#dc2626"></i>${T('Choque', 'Clash')}</span></div>
      <div class="loads"></div><div class="row" style="padding:12px 6px 2px"><button class="dbtn solid" type="button">${T('Auto-asignar otra vez', 'Auto-assign again')}</button></div></div>`;
    const cells = [...el.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td')]), loads = el.querySelector('.loads');
    const clash = (a, b) => a === 'full' || b === 'full' || a === b;
    function run() {
      q.clear(); cells.flat().forEach((c) => { c.className = ''; c.textContent = '·'; }); loads.innerHTML = '';
      const busy = GUIDES.map(() => ({})), load = GUIDES.map(() => 0), ev = [];
      starts.forEach((st, r) => SV.forEach((s, c) => {
        const day = st + s[2];
        const cands = GUIDES.map((_, g) => g).sort((a, b) => load[a] - load[b] || a - b); let ok = false;
        for (const g of cands) {
          if ((busy[g][day] || []).some((x) => clash(x, s[1]))) { ev.push([r, c, g, true]); continue; }
          (busy[g][day] = busy[g][day] || []).push(s[1]); load[g]++; ev.push([r, c, g, false, s[1]]); ok = true; break;
        }
        if (!ok) ev.push([r, c, -1, false, '']);
      }));
      const fin = () => { loads.innerHTML = GUIDES.map((g, i) => `<span>${g} · ${load[i]}</span>`).join(''); };
      ev.forEach((e, i) => {
        const apply = () => { const td = cells[e[0]][e[1]]; td.textContent = e[2] < 0 ? '—' : GUIDES[e[2]]; td.className = e[3] ? 'clash' : e[4]; if (i === ev.length - 1) fin(); };
        if (RM) { if (!e[3]) apply(); if (i === ev.length - 1) fin(); } else q.at(250 + i * 150, apply);
      });
    }
    el.querySelector('button').addEventListener('click', () => { starts = starts.map(() => (Math.random() * 3) | 0).sort(); run(); });
    let ran = false;
    return { start() { if (!ran) { ran = true; run(); } }, stop() {} };
  };

  /* ───────── Tablero de salidas (Gantt SVG) ───────── */
  NOTES.gantt = ['Recorridos y fechas inventados', 'Made-up routes and dates'];
  DEMOS.gantt = (el) => {
    const C = ['#b4422e', '#c08820', '#3d8b6a', '#2f5d8e'];
    const R = [[['Buenos Aires', 4], ['Bariloche', 5], ['El Calafate', 5], ['Ushuaia', 4]], [['Lima', 3], ['Cusco', 6], ['Valle Sagrado', 4], ['Puno', 3]], [['Santiago', 4], ['Valparaíso', 3], ['Atacama', 5]], [['Montevideo', 3], ['Colonia', 3], ['Buenos Aires', 5], ['Iguazú', 4]]];
    const G = [['Patagonia 1', 0, 2], ['Andes 1', 1, 6], ['Pacífico 1', 2, 12], ['Río de la Plata', 3, 15], ['Patagonia 2', 0, 24], ['Andes 2', 1, 30], ['Pacífico 2', 2, 38]].map(([n, r, s]) => ({ n, r, s, len: R[r].reduce((a, c) => a + c[1], 0) }));
    const W = 520, L = 96, RH = 25, T0 = 22, DAYS = 58, X = (d) => L + (d / DAYS) * (W - L - 8), H = T0 + G.length * RH + 8;
    el.innerHTML = `<div class="gantt"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gantt">${[0, 14, 28, 42, 56].map((d) => `<line x1="${X(d)}" x2="${X(d)}" y1="16" y2="${H - 4}" stroke="#dccfae"/><text x="${X(d) + 3}" y="12">+${d}d</text>`).join('')}
      ${G.map((g, i) => `<text x="4" y="${T0 + i * RH + 15}">${g.n}</text><rect x="${X(g.s)}" y="${T0 + i * RH + 4}" width="${X(g.s + g.len) - X(g.s)}" height="15" rx="3" fill="${C[g.r]}"/>`).join('')}
      <line class="today" x1="0" x2="0" y1="14" y2="${H - 2}" stroke="#2a1f0f" stroke-width="1.5"/></svg><div class="onroad"></div></div>`;
    const line = el.querySelector('.today'), list = el.querySelector('.onroad');
    let d = 9;
    function where(g, k) { let a = 0; for (const [city, n] of R[g.r]) { a += n; if (k < a) return city; } return ''; }
    function render() {
      line.setAttribute('x1', X(d)); line.setAttribute('x2', X(d));
      const on = G.filter((g) => d >= g.s && d < g.s + g.len);
      list.innerHTML = `<div><i>${T('En ruta hoy', 'On the road today')} · ${on.length} ${T('grupos', 'groups')}</i></div>` + on.map((g) => `<div><span><u style="background:${C[g.r]}"></u><b>${g.n}</b> · ${where(g, d - g.s)}</span><i>D${d - g.s + 1}/${g.len}</i></div>`).join('');
    }
    let iv = 0; render();
    document.addEventListener('langchange', render);
    return { start() { if (RM) return; clearInterval(iv); iv = setInterval(() => { d = (d + 1) % DAYS; render(); }, 800); }, stop() { clearInterval(iv); } };
  };

  /* ───────── Invisipal ───────── */
  NOTES.invisi = ['Recreación del lado a lado de la app', 'A recreation of the app\'s side-by-side'];
  DEMOS.invisi = (el) => {
    const cards = [['Abrir con el número del trimestre, no con el contexto.', 'Open with the quarter\'s number, not the background.'], ['Pausa. Preguntar si hay dudas antes de la demo.', 'Pause. Ask for questions before the demo.'], ['No leer la lámina: contar el caso del cliente.', 'Do not read the slide: tell the customer story.'], ['Cierre: próximos pasos y una fecha concreta.', 'Close: next steps and one concrete date.']];
    const slide = `<div class="slide"><b>${T('Resultados del trimestre', 'Quarterly results')}</b><i></i><i style="width:72%"></i><div class="bars"><u style="height:38%"></u><u style="height:55%"></u><u style="height:47%"></u><u style="height:78%"></u><u style="height:92%"></u></div></div>`;
    el.innerHTML = `<div class="invisi"><figure class="screen" style="margin:0"><figcaption>${T('Lo que ves vos', 'What you see')}</figcaption>${slide}<div class="note"><header><em>● private</em><span class="cnt"></span></header><p></p><div class="bar"><i></i></div></div></figure>
      <figure class="screen" style="margin:0"><figcaption>${T('Lo que ve la reunión', 'What the meeting sees')}</figcaption>${slide}<div class="ghost">${T('acá no hay nada', 'nothing here')}</div></figure></div>`;
    const p = el.querySelector('.note p'), cnt = el.querySelector('.cnt'), bar = el.querySelector('.bar i');
    let i = 0, iv = 0;
    const show = () => { p.textContent = tx(cards[i][0], cards[i][1]); cnt.textContent = i + 1 + ' / ' + cards.length; bar.style.width = ((i + 1) / cards.length) * 100 + '%'; };
    show(); document.addEventListener('langchange', show);
    return { start() { if (RM) return; clearInterval(iv); iv = setInterval(() => { p.style.opacity = 0; setTimeout(() => { i = (i + 1) % cards.length; show(); p.style.opacity = 1; }, 340); }, 3200); }, stop() { clearInterval(iv); } };
  };

  /* ───────── Handpal ───────── */
  NOTES.hand = ['Fuente de trazo único EMS Tech (OFL). Escribí tu propio texto', 'EMS Tech single-stroke font (OFL). Type your own text'];
  DEMOS.hand = (el) => {
    el.classList.add('hand-stage');
    el.innerHTML = `<canvas aria-label="handwriting demo"></canvas><input class="hand-in" type="text" maxlength="70" aria-label="${tx('Texto a escribir', 'Text to write')}">`;
    const cv = el.querySelector('canvas'), inp = el.querySelector('input');
    let touched = false;
    const def = () => tx('Escribí algo acá abajo', 'Type something down here');
    inp.value = def();
    const w = writer(cv, () => inp.value, {
      color: '#1f3fbf', cursor: '#fff', cursorEdge: '#17203a', max: 110, pad: 22, speed: 380, loop: 4200,
      bg(x, W, H) { x.strokeStyle = '#e3e7f0'; x.lineWidth = 1; for (let y = 38; y < H; y += 32) { x.beginPath(); x.moveTo(0, y + 0.5); x.lineTo(W, y + 0.5); x.stroke(); } x.strokeStyle = '#f3c7c7'; x.beginPath(); x.moveTo(34.5, 0); x.lineTo(34.5, H); x.stroke(); }
    });
    inp.addEventListener('input', () => { touched = true; w.restart(); });
    document.addEventListener('langchange', () => { if (!touched) { inp.value = def(); w.restart(); } });
    return w;
  };

  /* ───────── Pals Vault: grafo de fuerzas ───────── */
  NOTES.vault = ['Notas de ejemplo. Arrastrá un nodo', 'Sample notes. Drag a node'];
  DEMOS.vault = (el) => {
    el.classList.add('vault'); el.innerHTML = '<canvas aria-label="knowledge graph"></canvas>';
    const cv = el.querySelector('canvas');
    const COL = ['#f59e0b', '#60a5fa', '#f472b6', '#34d399', '#a78bfa'];
    const raw = [['Receta de chimichurri', 'Chimichurri recipe', 0], ['Lista del súper', 'Grocery list', 0], ['Asado del sábado', 'Saturday barbecue', 0], ['Pan de masa madre', 'Sourdough bread', 0],
      ['Idea: app de precios', 'Idea: price app', 1], ['Bug del redondeo', 'The rounding bug', 1], ['Apuntes de Firestore', 'Firestore notes', 1], ['Atajos de teclado', 'Keyboard shortcuts', 1], ['Charla sobre agentes', 'Talk about agents', 1],
      ['Riff en La menor', 'Riff in A minor', 2], ['Discos para escuchar', 'Albums to hear', 2], ['Letra a medio escribir', 'Half-written lyrics', 2], ['Acordes del estribillo', 'Chorus chords', 2],
      ['Viaje al sur', 'Trip south', 3], ['Libros de 2026', 'Books of 2026', 3], ['Cita subrayada', 'Underlined quote', 3], ['Película pendiente', 'Film to watch', 3],
      ['Recordame: turno', 'Remind me: appointment', 4], ['Regalo de cumpleaños', 'Birthday gift', 4], ['Mapa mental: mudanza', 'Mind map: moving', 4]];
    const N = raw.map((r, i) => ({ es: r[0], en: r[1], c: r[2], x: 0, y: 0, vx: 0, vy: 0, i }));
    const E = [];
    N.forEach((a) => N.forEach((b) => { if (a.i < b.i && a.c === b.c && (b.i - a.i < 3)) E.push([a, b]); }));
    [[2, 13], [4, 1], [9, 11], [8, 15], [14, 15], [5, 6], [17, 18], [10, 16], [19, 13], [3, 0], [12, 9], [7, 4]].forEach(([a, b]) => E.push([N[a], N[b]]));
    let D = null, hover = null, drag = null, auto = 0, autoT = 0;
    function init() { D = fit(cv); N.forEach((n) => { if (!n.x) { n.x = D.w / 2 + rnd(-90, 90); n.y = D.h / 2 + rnd(-90, 90); } }); }
    function simTick() {
      for (const a of N) { for (const b of N) { if (a === b) continue; const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 40, f = 2600 / d2; a.vx += (dx / Math.sqrt(d2)) * f; a.vy += (dy / Math.sqrt(d2)) * f; } a.vx += (D.w / 2 - a.x) * 0.006; a.vy += (D.h / 2 - a.y) * 0.009; }
      for (const [a, b] of E) { const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, f = (d - 84) * 0.02; a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f; }
      for (const n of N) { if (n === drag) continue; n.vx *= 0.82; n.vy *= 0.82; n.x = Math.max(14, Math.min(D.w - 14, n.x + n.vx)); n.y = Math.max(14, Math.min(D.h - 14, n.y + n.vy)); }
    }
    function draw() {
      const { x, w, h } = D; x.clearRect(0, 0, w, h);
      const f = hover || N[auto];
      for (const [a, b] of E) { const hot = a === f || b === f; x.strokeStyle = hot ? 'rgba(245,158,11,.9)' : 'rgba(236,236,241,.13)'; x.lineWidth = hot ? 1.6 : 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
      for (const n of N) { x.fillStyle = COL[n.c]; x.globalAlpha = n === f ? 1 : 0.85; x.beginPath(); x.arc(n.x, n.y, n === f ? 8 : 5, 0, 7); x.fill(); }
      x.globalAlpha = 1;
      if (f) { const t = isEn() ? f.en : f.es; x.font = '500 13px Geist, system-ui, sans-serif'; const tw = x.measureText(t).width; let lx = Math.min(w - tw - 18, Math.max(6, f.x + 12)), ly = Math.max(22, f.y - 12); x.fillStyle = 'rgba(20,20,26,.94)'; x.fillRect(lx - 6, ly - 15, tw + 12, 22); x.strokeStyle = '#f59e0b'; x.lineWidth = 1; x.strokeRect(lx - 5.5, ly - 14.5, tw + 11, 21); x.fillStyle = '#ececf1'; x.fillText(t, lx, ly); }
    }
    const tk = ticker((t, dt) => { simTick(); autoT += dt; if (autoT > 2400) { autoT = 0; auto = (auto + 7) % N.length; } draw(); });
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const near = (px, py) => { let b = null, bd = 26; for (const n of N) { const d = Math.hypot(n.x - px, n.y - py); if (d < bd) { bd = d; b = n; } } return b; };
    cv.addEventListener('pointermove', (e) => { const [px, py] = pos(e); if (drag) { drag.x = px; drag.y = py; drag.vx = drag.vy = 0; } else hover = near(px, py); });
    cv.addEventListener('pointerdown', (e) => { const [px, py] = pos(e); drag = near(px, py); if (drag) { hover = drag; cv.setPointerCapture(e.pointerId); } });
    const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); cv.addEventListener('pointerleave', () => { if (!drag) hover = null; });
    window.addEventListener('resize', () => { if (D) D = fit(cv); });
    return { start() { if (!D) init(); if (RM) { for (let i = 0; i < 260; i++) simTick(); draw(); return; } tk.start(); }, stop() { tk.stop(); } };
  };

  /* ───────── Pals Downloader ───────── */
  NOTES.down = ['Simulación de un trabajo. No descarga nada', 'A simulated job. Nothing is downloaded'];
  DEMOS.down = (el) => {
    el.innerHTML = `<div class="aero"><div class="field">https://ejemplo.video/mi-clip</div><div class="row" style="justify-content:space-between"><div class="modes"><button type="button" class="on">Video</button><button type="button">Audio</button><button type="button">GIF</button></div><button type="button" class="gel">${T('Descargar', 'Download')}</button></div>
      <div class="job"><div class="job-top"><span class="st"></span><span class="pc tnum">0%</span></div><div class="job-bar"><i></i></div><small></small></div>
      <div class="flow"><span>Web</span>→<span class="f1">${T('API en VM gratuita', 'API on a free VM')}</span>⇄<span class="f2">${T('tu PC, por túnel', 'your PC, via tunnel')}</span></div></div>`;
    const st = el.querySelector('.st'), pc = el.querySelector('.pc'), bar = el.querySelector('.job-bar i'), sm = el.querySelector('.job small'), f1 = el.querySelector('.f1'), f2 = el.querySelector('.f2');
    const modes = [...el.querySelectorAll('.modes button')]; let mode = 0, p = 0, hold = 0, usePc = false;
    modes.forEach((b, i) => b.addEventListener('click', () => { mode = i; modes.forEach((m, j) => m.classList.toggle('on', j === i)); reset(); }));
    function reset() { p = 0; hold = 0; usePc = Math.random() < 0.5; f1.classList.toggle('hot', !usePc); f2.classList.toggle('hot', usePc); paint(); }
    function paint() {
      bar.style.width = p + '%'; pc.textContent = Math.round(p) + '%';
      const conv = ['ffmpeg: mp4', 'ffmpeg: mp3', tx('GIF: paleta a medida, 2 pasadas', 'GIF: custom palette, 2 passes')][mode];
      if (p < 8) { st.textContent = tx('En cola · posición 2', 'Queued · position 2'); sm.textContent = tx('esperando un lugar libre', 'waiting for a free slot'); }
      else if (p < 78) { st.textContent = tx('Descargando', 'Downloading'); sm.textContent = (3.2 + Math.sin(p / 7) * 1.1).toFixed(1) + ' MB/s · ETA ' + Math.max(1, Math.round((78 - p) / 9)) + ' s'; }
      else if (p < 100) { st.textContent = tx('Convirtiendo', 'Converting'); sm.textContent = conv; }
      else { st.textContent = tx('Listo', 'Done'); sm.textContent = tx('ticket de un solo uso · lo baja el navegador', 'single-use ticket · the browser downloads it'); }
    }
    el.querySelector('.gel').addEventListener('click', reset);
    const tk = ticker((t, dt) => { if (p < 100) { p = Math.min(100, p + dt * (p < 8 ? 0.006 : p < 78 ? 0.022 : 0.012)); paint(); } else { hold += dt; if (hold > 2800) reset(); } });
    reset(); document.addEventListener('langchange', paint);
    return { start() { if (RM) { p = 100; paint(); return; } tk.start(); }, stop() { tk.stop(); } };
  };

  /* ───────── Portal legislativo ───────── */
  NOTES.portal = ['Agenda y lector de ejemplo', 'Sample agenda and reader'];
  DEMOS.portal = (el) => {
    const items = [[['MARTES · 10:00 · COMISIÓN', 'TUESDAY · 10:00 · COMMITTEE'], ['Presupuesto: reunión informativa', 'Budget: briefing session']], [['MIÉRCOLES · 14:30 · COMISIÓN', 'WEDNESDAY · 14:30 · COMMITTEE'], ['Educación: tres dictámenes', 'Education: three opinions']], [['JUEVES · 11:00 · SESIÓN', 'THURSDAY · 11:00 · SESSION'], ['Sesión ordinaria, temario de 12 puntos', 'Ordinary session, 12-item agenda']]];
    el.innerHTML = `<div class="portal"><div class="pdf"><b>AGENDA.PDF</b>${'<i></i>'.repeat(11)}<div class="scan"></div></div><div class="arrow"><b>→</b>JSON</div><div class="agenda">${items.map((it) => `<div><small>${T(it[0][0], it[0][1])}</small>${T(it[1][0], it[1][1])}</div>`).join('')}</div></div>
      <div class="wm" data-wm="${'lector@ejemplo.com · 15/11 10:42   '.repeat(60)}">${T('Así ve un informe un lector externo: su propio email y la hora, repetidos en diagonal sobre el texto.', 'This is how an external reader sees a report: their own email and the time, tiled diagonally across the text.')}</div>`;
    el.style.minHeight = '0';
    const root = el.querySelector('.portal'), ag = [...el.querySelectorAll('.agenda div')], q = seq();
    function run() { q.clear(); root.classList.remove('run'); ag.forEach((a) => a.classList.remove('on')); void root.offsetWidth; root.classList.add('run'); ag.forEach((a, i) => q.at(700 + i * 620, () => a.classList.add('on'))); q.at(7200, run); }
    return { start() { if (RM) { ag.forEach((a) => a.classList.add('on')); return; } run(); }, stop() { q.clear(); } };
  };

  /* ───────── Zappinglate ───────── */
  NOTES.zap = ['Canales dibujados por código. Tocá la pantalla para cambiar', 'Channels drawn in code. Tap the screen to zap'];
  DEMOS.zap = (el) => {
    el.style.border = '0';
    el.innerHTML = `<div class="tv"><div class="tube" role="button" tabindex="0" aria-label="zap"><canvas width="160" height="120"></canvas><div class="osd">CH 07</div><div class="vinfo"></div></div><div class="remote"><span>${T('3 AM. No hay nada en la tele.', '3 AM. Nothing on TV.')}</span><button type="button">ZAP ▸</button></div></div>`;
    const cv = el.querySelector('canvas'), x = cv.getContext('2d'), osd = el.querySelector('.osd'), vinfo = el.querySelector('.vinfo'), tube = el.querySelector('.tube');
    const W = 160, H = 120, img = x.createImageData(W, H);
    let ch = 7, prog = 0, staticLeft = 0, since = 0, osdT = 0, seed = 0;
    const PRE = ['IMG_', 'DSCN', 'MVI_', 'GOPR', 'PXL_'];
    const progs = [
      (t) => { const c = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0']; c.forEach((k, i) => { x.fillStyle = k; x.fillRect((i * W) / 7, 0, W / 7 + 1, 86); }); x.fillStyle = '#111'; x.fillRect(0, 86, W, 34); x.fillStyle = '#fff'; x.fillRect(22 + ((t / 30) % 100), 96, 14, 14); },
      (t) => { const sh = Math.sin(t / 130) * 2, g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f6b26b'); g.addColorStop(0.6, '#c2557a'); g.addColorStop(1, '#2b1a3a'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#ffe9a8'; x.beginPath(); x.arc(110 + sh, 52 + Math.sin(t / 900) * 5, 15, 0, 7); x.fill(); x.fillStyle = '#17121f'; x.beginPath(); x.moveTo(0, 92); for (let i = 0; i <= W; i += 8) x.lineTo(i, 88 + Math.sin(i / 17 + seed) * 7 + sh); x.lineTo(W, H); x.lineTo(0, H); x.fill(); },
      (t) => { const d = img.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = Math.sin(i / 13 + t / 600) + Math.sin(j / 9 - t / 800) + Math.sin((i + j) / 17 + t / 700), k = (j * W + i) * 4; d[k] = 128 + 110 * Math.sin(v * 2); d[k + 1] = 100 + 90 * Math.sin(v * 2 + 2); d[k + 2] = 150 + 100 * Math.sin(v * 2 + 4); d[k + 3] = 255; } x.putImageData(img, 0, 0); },
      (t) => { x.fillStyle = '#1e5b3a'; x.fillRect(0, 0, W, H); x.strokeStyle = '#e8f3e6'; x.lineWidth = 1.5; x.strokeRect(12, 12, W - 24, H - 24); x.beginPath(); x.moveTo(W / 2, 12); x.lineTo(W / 2, H - 12); x.stroke(); x.beginPath(); x.arc(W / 2, H / 2, 16, 0, 7); x.stroke(); const bx = 14 + Math.abs(((t / 9) % 264) - 132), by = 14 + Math.abs(((t / 13) % 184) - 92); x.fillStyle = '#fff'; x.beginPath(); x.arc(bx, by, 3.2, 0, 7); x.fill(); }
    ];
    function noise() { const d = img.data; for (let k = 0; k < d.length; k += 4) { const v = (Math.random() * 255) | 0; d[k] = v * 0.86; d[k + 1] = v * 0.93; d[k + 2] = v; d[k + 3] = 255; } x.putImageData(img, 0, 0); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(0, (Math.random() * H) | 0, W, 2); }
    function zap() { ch = ch >= 13 ? 2 : ch + 1; prog = (prog + 1 + ((Math.random() * 3) | 0)) % progs.length; seed = Math.random() * 9; staticLeft = 260; since = 0; osdT = 1700; osd.textContent = 'CH ' + String(ch).padStart(2, '0'); osd.style.opacity = 1; vinfo.textContent = ''; }
    function info() { vinfo.textContent = pick(PRE) + (1000 + ((Math.random() * 8999) | 0)) + pick(['.MOV', '.AVI', '.MP4']) + ' · 0 ' + tx('vistas', 'views'); }
    const tk = ticker((t, dt) => {
      since += dt; if (osdT > 0) { osdT -= dt; if (osdT <= 0) osd.style.opacity = 0; }
      if (staticLeft > 0) { staticLeft -= dt; noise(); if (staticLeft <= 0) info(); } else { progs[prog](t); if (since > 6500) zap(); }
    });
    tube.addEventListener('click', zap); tube.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zap(); } });
    el.querySelector('.remote button').addEventListener('click', zap);
    progs[0](0); info();
    return { start() { if (RM) return; tk.start(); }, stop() { tk.stop(); } };
  };

  /* ───────── Libro para colorear ───────── */
  NOTES.color = ['Elegí un color y tocá una zona del dibujo', 'Pick a colour and tap an area of the drawing'];
  DEMOS.color = (el) => {
    const W = 480, H = 340;
    const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const solid = (h) => { const c = hex(h); return () => c; };
    const grad = (a, b) => { const A = hex(a), B = hex(b); return (px, py, bx) => { const t = Math.max(0, Math.min(1, ((px - bx[0]) + (py - bx[1])) / ((bx[2] - bx[0]) + (bx[3] - bx[1]) + 1))); return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]; }; };
    const glitter = (h) => { const c = hex(h); return (px, py) => { let n = (px * 374761393 + py * 668265263) | 0; n = (n ^ (n >>> 13)) * 1274126177; n = (n ^ (n >>> 16)) >>> 0; const r = n / 4294967295, k = r > 0.93 ? 1.7 : 0.72 + r * 0.5; return [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)]; }; };
    const hearts = (bg, fg) => { const A = hex(bg), B = hex(fg); return (px, py) => { const S = 26, row = Math.floor(py / S), u = (((px + (row % 2) * S / 2) % S) / S - 0.5) * 2.9, v = -((py % S) / S - 0.5) * 2.9 + 0.25, q = u * u + v * v - 1; return q * q * q - u * u * v * v * v <= 0 ? B : A; }; };
    const PAL = [['#ff6b6b', solid('#ff6b6b')], ['#ffd23f', solid('#ffd23f')], ['#7bd389', solid('#7bd389')], ['#4ecdc4', solid('#4ecdc4')], ['#6c8cff', solid('#6c8cff')], ['#c77dff', solid('#c77dff')], ['#b0744a', solid('#b0744a')],
      ['linear-gradient(135deg,#ffb347,#ff5fa2)', grad('#ffb347', '#ff5fa2')], ['linear-gradient(135deg,#7ee8fa,#5b7bff)', grad('#7ee8fa', '#5b7bff')],
      ['repeating-conic-gradient(#ff8fc0 0 25%,#ffc3de 0 50%) 0 0/8px 8px', glitter('#ff8fc0')], ['radial-gradient(circle,#e8484f 34%,#ffe0e6 36%) 0 0/12px 12px', hearts('#ffe0e6', '#e8484f')]];
    el.classList.add('cbook');
    el.innerHTML = `<canvas width="${W}" height="${H}" aria-label="${tx('Dibujo para colorear', 'Colouring page')}"></canvas><div class="swatches">${PAL.map((p, i) => `<button type="button" class="sw${i === 3 ? ' on' : ''}" style="background:${p[0]}" aria-label="color ${i + 1}"></button>`).join('')}</div><div class="row"><button type="button" class="sticker undo">${T('Deshacer', 'Undo')}</button><button type="button" class="sticker clear">${T('Borrar todo', 'Clear all')}</button></div>`;
    const cv = el.querySelector('canvas'), x = cv.getContext('2d', { willReadFrequently: true });
    const INK = '#2a2440';
    function union(cs) { x.strokeStyle = INK; cs.forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.stroke(); }); x.fillStyle = '#fff'; cs.forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r - 1.6, 0, 7); x.fill(); }); }
    function box(a, b, w, h) { x.fillStyle = '#fff'; x.fillRect(a, b, w, h); x.strokeRect(a, b, w, h); }
    function art() {
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.lineWidth = 4; x.lineJoin = 'round'; x.lineCap = 'round'; x.strokeStyle = INK;
      x.beginPath(); x.moveTo(-5, 252); x.quadraticCurveTo(230, 205, 485, 240); x.stroke();                 // loma
      x.beginPath(); x.moveTo(-5, 300); x.quadraticCurveTo(250, 275, 485, 305); x.stroke();                 // camino
      for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; x.beginPath(); x.moveTo(402 + Math.cos(a) * 44, 68 + Math.sin(a) * 44); x.lineTo(402 + Math.cos(a) * 58, 68 + Math.sin(a) * 58); x.stroke(); }
      x.beginPath(); x.arc(402, 68, 34, 0, 7); x.fillStyle = '#fff'; x.fill(); x.stroke();                    // sol
      union([[84, 76, 22], [114, 62, 28], [146, 78, 22], [114, 84, 20]]);                                  // nube
      union([[250, 52, 15], [270, 44, 19], [292, 54, 15], [271, 58, 13]]);                                 // nube chica
      box(353, 196, 18, 66); union([[362, 168, 32], [338, 188, 23], [387, 188, 23]]);                      // árbol
      box(150, 170, 132, 96);                                                                              // casa
      x.beginPath(); x.moveTo(134, 170); x.lineTo(216, 104); x.lineTo(298, 170); x.closePath(); x.fillStyle = '#fff'; x.fill(); x.stroke();
      x.beginPath(); x.arc(216, 146, 11, 0, 7); x.stroke();
      box(202, 214, 34, 52); box(164, 190, 26, 26); box(246, 190, 26, 26);
      x.beginPath(); x.moveTo(62, 322); x.lineTo(62, 290); x.stroke();                                      // flor
      union([[62, 264, 9], [74, 273, 9], [70, 287, 9], [54, 287, 9], [50, 273, 9]]);
      x.beginPath(); x.arc(62, 277, 7, 0, 7); x.fillStyle = '#fff'; x.fill(); x.stroke();
      x.beginPath(); x.moveTo(432, 328); x.lineTo(432, 300); x.stroke();
      union([[432, 276, 8], [443, 284, 8], [439, 297, 8], [425, 297, 8], [421, 284, 8]]);
      x.beginPath(); x.arc(432, 288, 6, 0, 7); x.fillStyle = '#fff'; x.fill(); x.stroke();
    }
    art();
    const base = x.getImageData(0, 0, W, H), wall = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) wall[i] = (base.data[i * 4] * 0.3 + base.data[i * 4 + 1] * 0.59 + base.data[i * 4 + 2] * 0.11) | 0;
    let work = null, cur = 3;
    const clicks = [[402, 68, 1], [180, 150, 0], [300, 20, 8]];   // el dibujo es una lista de toques
    function fill(px, py, shade) {
      px |= 0; py |= 0; if (px < 0 || py < 0 || px >= W || py >= H || wall[py * W + px] < 120) return;
      const seen = new Uint8Array(W * H), stack = [py * W + px], region = []; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      seen[py * W + px] = 1;
      while (stack.length) {                                       // paredes medidas sobre el original
        const i = stack.pop(), cx = i % W, cy = (i / W) | 0; region.push(i);
        if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy;
        if (wall[i] < 200) continue;                                // borde suavizado: se pinta pero no propaga
        if (cx > 0 && !seen[i - 1] && wall[i - 1] >= 120) { seen[i - 1] = 1; stack.push(i - 1); }
        if (cx < W - 1 && !seen[i + 1] && wall[i + 1] >= 120) { seen[i + 1] = 1; stack.push(i + 1); }
        if (cy > 0 && !seen[i - W] && wall[i - W] >= 120) { seen[i - W] = 1; stack.push(i - W); }
        if (cy < H - 1 && !seen[i + W] && wall[i + W] >= 120) { seen[i + W] = 1; stack.push(i + W); }
      }
      const bx = [x0, y0, x1, y1], d = work.data;
      for (const i of region) { const c = shade(i % W, (i / W) | 0, bx), m = wall[i] / 255, k = i * 4; d[k] = c[0] * m; d[k + 1] = c[1] * m; d[k + 2] = c[2] * m; }
    }
    function replay() { work = new ImageData(new Uint8ClampedArray(base.data), W, H); clicks.forEach((c) => fill(c[0], c[1], PAL[c[2]][1])); x.putImageData(work, 0, 0); }
    replay();
    cv.addEventListener('click', (e) => { const r = cv.getBoundingClientRect(); clicks.push([((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height, cur]); replay(); });
    const sws = [...el.querySelectorAll('.sw')]; sws.forEach((b, i) => b.addEventListener('click', () => { cur = i; sws.forEach((s, j) => s.classList.toggle('on', j === i)); }));
    el.querySelector('.undo').addEventListener('click', () => { clicks.pop(); replay(); });
    el.querySelector('.clear').addEventListener('click', () => { clicks.length = 0; replay(); });
  };

  /* ───────── Estudio de moda: SVG procedural ───────── */
  NOTES.fashion = ['Cada pieza es una función que devuelve SVG', 'Every piece is a function that returns SVG'];
  DEMOS.fashion = (el) => {
    const smooth = (p, closed = true) => {                         // Catmull-Rom a Bézier
      const n = p.length, g = (i) => p[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))]; let d = `M${p[0][0]} ${p[0][1]}`;
      for (let i = 0; i < (closed ? n : n - 1); i++) { const a = g(i - 1), b = g(i), c = g(i + 1), e = g(i + 2); d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0]} ${c[1]}`; }
      return d + (closed ? 'Z' : '');
    };
    const shade = (h, f) => '#' + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * (1 + f)))).toString(16).padStart(2, '0')).join('');
    const shape = (pts, c) => `<path d="${smooth(pts)}" fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="1.6" stroke-linejoin="round"/>`;
    const SKIN = '#f3c9a6';
    const HAIR = {
      back: [(c) => shape([[68, 72], [100, 40], [132, 72], [140, 168], [122, 186], [100, 150], [78, 186], [60, 168]], c), (c) => shape([[67, 74], [100, 41], [133, 74], [136, 114], [118, 122], [100, 108], [82, 122], [64, 114]], c),
        (c) => `<circle cx="70" cy="46" r="15" fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="1.6"/><circle cx="130" cy="46" r="15" fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="1.6"/>` + shape([[70, 78], [100, 42], [130, 78], [124, 96], [100, 88], [76, 96]], c)],
      front: (c) => shape([[72, 76], [79, 52], [100, 45], [121, 52], [128, 76], [113, 63], [100, 68], [87, 61]], c)
    };
    const DRESS = [
      (c) => shape([[75, 138], [100, 147], [125, 138], [121, 190], [150, 298], [100, 310], [50, 298], [79, 190]], c) + `<path d="M80 192Q100 199 120 192" fill="none" stroke="${shade(c, -0.3)}" stroke-width="3" stroke-linecap="round"/>`,
      (c) => shape([[75, 138], [100, 147], [125, 138], [121, 192], [140, 252], [100, 262], [60, 252], [79, 192]], c) + `<path d="${smooth([[62, 250], [80, 258], [100, 254], [120, 258], [138, 250]], false)}" fill="none" stroke="${shade(c, 0.35)}" stroke-width="3" stroke-linecap="round"/>`,
      (c) => shape([[80, 192], [120, 192], [148, 272], [100, 282], [52, 272]], shade(c, -0.22)) + shape([[75, 138], [100, 147], [125, 138], [121, 196], [100, 200], [79, 196]], c)
    ];
    const DC = ['#ff6b9d', '#4ecdc4', '#ffd23f', '#8b7bff', '#ff8a4c', '#3aa76d'], HC = ['#3b2a22', '#b5651d', '#f1c452', '#e4572e'];
    let s = { dc: 0, hc: 0, d: 0, h: 0 };
    el.innerHTML = `<div class="doll"><div class="fig"></div><div class="doll-ui"><div class="col dc">${DC.map((c) => `<button type="button" class="sw" style="background:${c}" aria-label="${c}"></button>`).join('')}</div><div class="col hc">${HC.map((c) => `<button type="button" class="sw" style="background:${c}" aria-label="${c}"></button>`).join('')}</div><button type="button" class="sticker bd">${T('Vestido', 'Dress')}</button><button type="button" class="sticker bh">${T('Pelo', 'Hair')}</button><button type="button" class="sticker br">${T('Sorpresa', 'Surprise')}</button></div></div>`;
    const fig = el.querySelector('.fig');
    function render() {
      const dc = DC[s.dc], hc = HC[s.hc], sk = shade(SKIN, -0.22), limb = (a, b, c, d, w) => `<path d="M${a} ${b}L${c} ${d}" stroke="${sk}" stroke-width="${w + 2.6}" stroke-linecap="round"/><path d="M${a} ${b}L${c} ${d}" stroke="${SKIN}" stroke-width="${w}" stroke-linecap="round"/>`;
      fig.innerHTML = `<svg viewBox="0 0 200 400" role="img" aria-label="doll"><circle cx="100" cy="190" r="150" fill="${shade(dc, 0.5)}" opacity=".35"/><ellipse cx="100" cy="374" rx="52" ry="7" fill="#3a2e5c" opacity=".12"/>
        ${HAIR.back[s.h](hc)}${limb(90, 250, 87, 358, 12)}${limb(110, 250, 113, 358, 12)}${limb(76, 146, 60, 226, 9)}${limb(124, 146, 140, 226, 9)}
        <ellipse cx="85" cy="364" rx="11" ry="5.5" fill="${shade(dc, -0.35)}"/><ellipse cx="115" cy="364" rx="11" ry="5.5" fill="${shade(dc, -0.35)}"/>
        <rect x="93" y="100" width="14" height="44" rx="6" fill="${SKIN}" stroke="${sk}" stroke-width="1.6"/>${shape([[76, 140], [124, 140], [120, 192], [116, 216], [84, 216], [80, 192]], SKIN)}${DRESS[s.d](dc)}
        <ellipse cx="100" cy="78" rx="27" ry="31" fill="${SKIN}" stroke="${sk}" stroke-width="1.6"/>${HAIR.front(hc)}
        <circle cx="90" cy="82" r="2.7" fill="#3a2e5c"/><circle cx="110" cy="82" r="2.7" fill="#3a2e5c"/><circle cx="84" cy="92" r="5" fill="#ff8fa3" opacity=".5"/><circle cx="116" cy="92" r="5" fill="#ff8fa3" opacity=".5"/><path d="M93 95Q100 101 107 95" fill="none" stroke="#3a2e5c" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      el.querySelectorAll('.dc .sw').forEach((b, i) => b.classList.toggle('on', i === s.dc)); el.querySelectorAll('.hc .sw').forEach((b, i) => b.classList.toggle('on', i === s.hc));
    }
    el.querySelectorAll('.dc .sw').forEach((b, i) => b.addEventListener('click', () => { s.dc = i; render(); }));
    el.querySelectorAll('.hc .sw').forEach((b, i) => b.addEventListener('click', () => { s.hc = i; render(); }));
    el.querySelector('.bd').addEventListener('click', () => { s.d = (s.d + 1) % 3; render(); });
    el.querySelector('.bh').addEventListener('click', () => { s.h = (s.h + 1) % 3; render(); });
    el.querySelector('.br').addEventListener('click', () => { s = { dc: (Math.random() * 6) | 0, hc: (Math.random() * 4) | 0, d: (Math.random() * 3) | 0, h: (Math.random() * 3) | 0 }; render(); });
    render();
  };

  /* ───────── Pals Music: mosaico por color ───────── */
  NOTES.music = ['Colores generados, no portadas reales', 'Generated colours, not real covers'];
  DEMOS.music = (el) => {
    el.classList.add('mosaic');
    el.innerHTML = `<canvas aria-label="colour mosaic"></canvas><div class="row"><button type="button" class="dbtn solid"></button><span style="font-family:var(--f-mono);font-size:11px;color:var(--p-soft)">${T('grises aparte, por luminosidad', 'greys apart, by lightness')}</span></div>`;
    const cv = el.querySelector('canvas'), btn = el.querySelector('button'), COLS = 24, ROWS = 10, N = COLS * ROWS;
    const tiles = Array.from({ length: N }, (_, i) => { const grey = Math.random() < 0.16, h = Math.random() * 360, s = grey ? rnd(0, 0.1) : rnd(0.45, 0.95), l = grey ? rnd(0.08, 0.9) : rnd(0.32, 0.7); return { h, s, l, pos: i, x: -1, y: -1 }; });
    let sorted = false, D = null;
    const label = () => { btn.innerHTML = sorted ? T('Mezclar', 'Shuffle') : T('Ordenar por color', 'Sort by colour'); };
    function order() {
      let arr;
      if (sorted) { const col = tiles.filter((t) => t.s >= 0.12).sort((a, b) => a.h - b.h || a.l - b.l), gr = tiles.filter((t) => t.s < 0.12).sort((a, b) => a.l - b.l); arr = col.concat(gr); }
      else arr = tiles.slice().sort(() => Math.random() - 0.5);
      arr.forEach((t, i) => (t.pos = i));
    }
    function draw(snap) {
      const { x, w, h } = D, cw = w / COLS, chh = h / ROWS; x.clearRect(0, 0, w, h); let moving = false;
      for (const t of tiles) { const tx_ = (t.pos % COLS) * cw, ty = ((t.pos / COLS) | 0) * chh; if (t.x < 0 || snap) { t.x = tx_; t.y = ty; } else { t.x += (tx_ - t.x) * 0.09; t.y += (ty - t.y) * 0.09; if (Math.abs(tx_ - t.x) + Math.abs(ty - t.y) > 0.4) moving = true; } x.fillStyle = `hsl(${t.h} ${t.s * 100}% ${t.l * 100}%)`; x.fillRect(t.x + 1, t.y + 1, cw - 2, chh - 2); }
      return moving;
    }
    const tk = ticker(() => { if (!draw(false)) tk.stop(); });
    btn.addEventListener('click', () => { sorted = !sorted; order(); label(); if (RM) draw(true); else tk.start(); });
    label(); let first = true;
    window.addEventListener('resize', () => { if (D) { D = fit(cv); draw(true); } });
    return { start() { if (!D) { D = fit(cv); draw(true); } if (first) { first = false; setTimeout(() => { sorted = true; order(); label(); if (RM) draw(true); else tk.start(); }, 700); } }, stop() {} };
  };

  /* ───────── murmur: audio generativo ───────── */
  NOTES.murmur = ['Sintetizado en tu navegador. Tocá para escuchar', 'Synthesised in your browser. Tap to listen'];
  DEMOS.murmur = (el) => {
    el.classList.add('murmur'); el.style.minHeight = '380px';
    el.innerHTML = `<canvas></canvas><button type="button" class="veil" data-stop=""><span>${T('tocar para escuchar', 'tap to listen')}</span></button>`;
    const cv = el.querySelector('canvas'), veil = el.querySelector('.veil');
    const POOL = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99];
    let ac = null, an = null, master = null, playing = false, D = null, data = null, timer = 0; const live = [];
    const setStop = () => veil.setAttribute('data-stop', tx('tocar para silenciar', 'tap to mute')); setStop();
    function boot() {
      ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0;
      const len = ac.sampleRate * 4, buf = ac.createBuffer(2, len, ac.sampleRate);          // reverb sin samples
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.3); }
      const conv = ac.createConvolver(); conv.buffer = buf; const dry = ac.createGain(), wet = ac.createGain(); dry.gain.value = 0.3; wet.gain.value = 0.7;
      an = ac.createAnalyser(); an.fftSize = 512; data = new Uint8Array(an.frequencyBinCount); const lim = ac.createDynamicsCompressor();
      master.connect(dry); master.connect(conv); conv.connect(wet); dry.connect(an); wet.connect(an); an.connect(lim); lim.connect(ac.destination);
      for (const f of [110, 164.81, 220]) for (const side of [-1, 1]) {                       // drones binaurales
        const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f + (side > 0 ? 6 : 0); g.gain.value = 0.05; o.connect(g);
        if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = side; g.connect(p); p.connect(master); } else g.connect(master);
        o.start();
      }
    }
    function phrase() {
      if (!playing) return; let t = ac.currentTime + 0.1; const n = 1 + ((Math.random() * 4) | 0);
      for (let i = 0; i < n; i++) {
        const f = pick(POOL), o = ac.createOscillator(), g = ac.createGain(); o.type = Math.random() < 0.5 ? 'sine' : 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.085, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0008, t + 5.5); o.connect(g); g.connect(master); o.start(t); o.stop(t + 5.8);
        live.push({ f, at: performance.now() + (t - ac.currentTime) * 1000 }); t += rnd(0.5, 1.3);
      }
      timer = setTimeout(phrase, rnd(2800, 6500));
    }
    function setPlay(on) {
      if (on && !ac) boot(); if (!ac) return; playing = on; el.classList.toggle('playing', on); clearTimeout(timer);
      if (on) { ac.resume(); master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0.5, ac.currentTime + 2.5); phrase(); }
      else { master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.4); setTimeout(() => { if (!playing && ac) ac.suspend(); }, 500); }
    }
    veil.addEventListener('click', () => setPlay(!playing));
    document.addEventListener('langchange', setStop);
    const tk = ticker((t) => {
      const { x, w, h } = D, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.2; x.fillStyle = 'rgba(3,4,12,0.16)'; x.fillRect(0, 0, w, h);
      if (playing && an) an.getByteFrequencyData(data);
      const hue = 220 + Math.sin(t / 9000) * 50;
      for (let i = 0; i < 96; i++) { const v = playing && data ? data[2 + i] / 255 : 0.06 + 0.04 * Math.sin(t / 900 + i / 5), a = (i / 96) * 6.283 + t / 14000, r1 = R + v * R * 1.5; x.strokeStyle = `hsla(${hue + i * 0.9},75%,${55 + v * 25}%,${0.25 + v * 0.7})`; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); x.stroke(); }
      const now = performance.now();
      for (let i = live.length - 1; i >= 0; i--) {                                              // constelación: ángulo = clase de altura
        const n = live[i], age = (now - n.at) / 5500; if (age > 1) { live.splice(i, 1); continue; } if (age < 0) continue;
        const o = Math.log2(n.f / 55), a = (o % 1) * 6.283 - 1.57, r = R * (1.9 + Math.floor(o) * 0.45); x.fillStyle = `hsla(${hue + 60},90%,78%,${1 - age})`; x.beginPath(); x.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2 + (1 - age) * 3.5, 0, 7); x.fill();
      }
    });
    window.addEventListener('resize', () => { if (D) D = fit(cv); });
    return { start() { if (!D) { D = fit(cv); D.x.fillStyle = '#03040c'; D.x.fillRect(0, 0, D.w, D.h); } tk.start(); }, stop() { tk.stop(); if (playing) setPlay(false); } };
  };

  /* ───────── Portal retro ───────── */
  NOTES.iee = ['Mejor visto en 800×600', 'Best viewed at 800×600'];
  DEMOS.iee = (el) => {
    let n = 1; const pad = (v) => String(v).padStart(6, '0');
    el.innerHTML = `<div class="win"><div class="win-title"><span>${T('El Portal', 'The Portal')}.exe</span><span>_ □ ×</span></div><div class="win-body"><div class="marq"><span>${T('★ BIENVENIDOS AL PORTAL ★ sitio en construcción permanente ★ firmá el libro de visitas ★', '★ WELCOME TO THE PORTAL ★ permanently under construction ★ sign the guestbook ★')}</span></div>
      <div class="lcd"><span>${T('Visitas:', 'Visits:')}</span><b>${pad(n)}</b><button type="button" class="w95">${T('Firmar el libro', 'Sign the guestbook')}</button></div><div class="guest">${T('Todavía no firmó nadie. Sé el primero.', 'Nobody has signed yet. Be the first.')}</div><div class="pole"></div></div></div>`;
    const lcd = el.querySelector('.lcd b'), guest = el.querySelector('.guest'); let lines = [];
    el.querySelector('.w95').addEventListener('click', () => { n++; lcd.textContent = pad(n); lines.unshift(tx('Visitante n.º ', 'Visitor no. ') + pad(n) + tx(' estuvo aquí.', ' was here.')); lines = lines.slice(0, 3); guest.innerHTML = lines.join('<br>'); });
  };

  window.DEMOS = DEMOS; window.DEMO_NOTES = NOTES; window.T = T; window.makeWriter = writer;
})();
