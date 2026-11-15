(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const B = (pair, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-es="${esc(pair[0])}" data-en="${esc(pair[1])}">${pair[0]}</${tag}>`;
  const P = window.PROJECTS, CH = window.CHAPTERS;

  /* ───── Render de capítulos y proyectos ───── */
  function panel(id) {
    const p = P[id];
    const cls = ['panel', p.skin, p.half ? 'half' : '', p.flip ? 'flip' : ''].join(' ');
    const meta = `<div class="meta">${B(p.kind)}${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${B(['Código abierto ↗', 'Open source ↗'])}</a>` : ''}</div>`;
    if (p.also) {
      return `<article class="${cls}" id="p-${id}"><div class="copy">${meta}<div class="also">${p.also.map((a) => `<article>${B(a[0], 'h4')}${B(a[1], 'p')}</article>`).join('')}</div></div></article>`;
    }
    return `<article class="${cls}" id="p-${id}">
      <div class="copy">${meta}${B(p.name, 'h3')}${B(p.tagline, 'p', 'tagline')}${p.how ? B(p.how, 'p', 'how') : ''}
        <ul class="points">${p.points.map((x) => B(x, 'li')).join('')}</ul>
        <ul class="chips">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
        <div class="facts">${p.facts.map((f) => `<div><b>${f[0]}</b>${B(f[1])}</div>`).join('')}</div>
      </div>
      <div class="demo"><div class="stage" data-demo="${id}"></div><div class="demo-note">${window.DEMO_NOTES[id] ? B(window.DEMO_NOTES[id]) : ''}</div></div>
    </article>`;
  }
  $('#chapters').innerHTML = CH.map((c) => `<section class="chapter" id="${c.id}"><div class="wrap">
      <header class="chapter-head rise"><div>${B(c.eyebrow, 'p', 'eyebrow')}${B(c.title, 'h2')}</div>${B(c.intro, 'p')}</header>
      <div class="stack-v">${c.rows.map((r) => (r.length > 1 ? `<div class="pair">${r.map(panel).join('')}</div>` : panel(r[0]))).join('')}</div>
    </div></section>`).join('');

  $('#tape').innerHTML = CH.flatMap((c) => c.rows.flat()).filter((id) => !P[id].noTile).map((id) => {
    const p = P[id];
    return `<a class="tile ${p.skin}" href="#p-${id}">${B([p.kind[0].split(' · ')[0], p.kind[1].split(' · ')[0]], 'small')}${B(p.short)}<u></u></a>`;
  }).join('');

  /* ───── Idioma ───── */
  $$('[data-en]').forEach((e) => { if (!e.hasAttribute('data-es')) e.setAttribute('data-es', e.innerHTML); });
  function setLang(l, save) {
    document.documentElement.lang = l;
    $$('[data-en]').forEach((e) => { const v = e.getAttribute(l === 'en' ? 'data-en' : 'data-es'); if (v !== null && e.innerHTML !== v) e.innerHTML = v; });
    $('#lang').textContent = l === 'en' ? 'ES' : 'EN';
    $('#lang').setAttribute('aria-label', l === 'en' ? 'Cambiar a español' : 'Switch to English');
    document.title = l === 'en' ? 'Nicolás Palermo · Portfolio' : 'Nicolás Palermo · Portfolio';
    if (save) { try { localStorage.setItem('lang', l); } catch (e) { /* sin storage */ } }
    document.dispatchEvent(new Event('langchange'));
  }
  let saved = null; try { saved = localStorage.getItem('lang'); } catch (e) { /* sin storage */ }
  const initial = saved || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
  if (initial !== 'es') setLang(initial, false);
  $('#lang').addEventListener('click', () => setLang(document.documentElement.lang === 'en' ? 'es' : 'en', true));

  /* ───── Demos: se crean y arrancan al entrar en pantalla ───── */
  const inst = new Map();
  const demoIO = new IntersectionObserver((es) => es.forEach((e) => {
    const el = e.target, id = el.dataset.demo;
    if (e.isIntersecting && !inst.has(el)) {
      let api = null;
      try { api = window.DEMOS[id] ? window.DEMOS[id](el) || {} : {}; } catch (err) { console.error('demo ' + id, err); api = {}; }
      inst.set(el, api);
    }
    const api = inst.get(el); if (!api) return;
    try { if (e.isIntersecting) { api.start && api.start(); } else { api.stop && api.stop(); } } catch (err) { console.error('demo ' + id, err); }
  }), { rootMargin: '120px 0px' });
  $$('.stage[data-demo]').forEach((s) => demoIO.observe(s));

  const revIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } }), { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
  $$('.panel, .rise').forEach((e) => revIO.observe(e));

  /* ───── Hero: la frase se escribe sola, trazo a trazo ───── */
  const hw = $('#heroWrite');
  if (hw && window.makeWriter) {
    const w = window.makeWriter(hw, () => (document.documentElement.lang === 'en' ? '15 projects. 12 private. All explained.' : '15 proyectos. 12 privados. Todos explicados.'), { color: '#d6ff3f', cursor: '#ece6da', cursorEdge: '#0d0c0a', max: 96, pad: 6, speed: 620, lw: 0.05 });
    const go = () => setTimeout(() => w.start(), 500);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  }

  /* ───── Nav y barra de progreso ───── */
  const nav = $('.nav'), bar = $('.progress i'); let tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle('solid', y > 40); bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`; tick = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  requestAnimationFrame(() => $$('.hero .rise').forEach((e) => e.classList.add('in')));
})();
