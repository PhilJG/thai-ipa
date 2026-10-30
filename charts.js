// Small SVG charts for the Progress page: bars (grouped or stacked) and a line.
// Each returns a <figure> with a legend (2+ series), a hover/tap tooltip and a "Show as table" view.
//
// Charts.bars({ title, categories, series: [{ label, color, values }], stacked, labelEvery, totals, format })
// Charts.line({ title, categories, values (null = no data), max, format })
const Charts = (() => {
  const W = 600, H = 210;
  const PAD = { l: 44, r: 8, t: 18, b: 26 };
  const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b;
  const NS = 'http://www.w3.org/2000/svg';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtDefault = (v) => String(v);

  // A round axis top and its tick step (counts are whole numbers).
  function scale(max) {
    const raw = Math.max(1, max) / 4;
    const pow = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, [1, 2, 5, 10].map((k) => k * pow).find((s) => s >= raw));
    return { top: step * Math.ceil(Math.max(1, max) / step), step };
  }

  // A bar with only its data end rounded (4px), anchored square to the baseline.
  function barPath(x, bottom, top, w, round) {
    const h = bottom - top;
    if (h <= 0) return '';
    const r = round ? Math.min(4, h, w / 2) : 0;
    return `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bottom}Z`;
  }

  function frame(title, series) {
    const fig = document.createElement('figure');
    fig.className = 'chart';
    const legend = series.length > 1
      ? `<div class="chart-legend">${series.map((s) =>
        `<span class="legend-item"><span class="swatch" style="background: var(${s.color})"></span>${esc(s.label)}</span>`).join('')}</div>`
      : '';
    fig.innerHTML = `<figcaption class="chart-title">${esc(title)}</figcaption>${legend}
      <div class="chart-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"></svg>
      <div class="chart-tip" hidden></div></div>`;
    return fig;
  }

  function svgEl(tag, attrs, parent) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    parent.append(el);
    return el;
  }

  function axes(svg, top, step, format) {
    const y = (v) => PAD.t + plotH - (v / top) * plotH;
    for (let v = 0; v <= top; v += step) {
      svgEl('line', { x1: PAD.l, x2: W - PAD.r, y1: y(v), y2: y(v), class: v ? 'grid' : 'baseline' }, svg);
      svgEl('text', { x: PAD.l - 6, y: y(v) + 4, class: 'tick', 'text-anchor': 'end' }, svg).textContent = format(v);
    }
    return y;
  }

  function xLabels(svg, categories, band, labelEvery) {
    categories.forEach((c, i) => {
      if ((categories.length - 1 - i) % labelEvery) return; // counted back from the newest
      svgEl('text', { x: PAD.l + band * (i + 0.5), y: H - 8, class: 'tick', 'text-anchor': 'middle' }, svg).textContent = c;
    });
  }

  // One invisible column per category catches hover/tap and shows the tooltip.
  function hover(fig, categories, band, rows) {
    const svg = fig.querySelector('svg');
    const tip = fig.querySelector('.chart-tip');
    const plot = fig.querySelector('.chart-plot');
    let active = null;
    const hide = () => { tip.hidden = true; if (active) active.classList.remove('on'); active = null; };
    categories.forEach((c, i) => {
      const hit = svgEl('rect', { x: PAD.l + band * i, y: PAD.t, width: band, height: plotH, class: 'hit' }, svg);
      const show = () => {
        if (active) active.classList.remove('on');
        active = hit;
        hit.classList.add('on');
        tip.innerHTML = `<div class="tip-head">${esc(c)}</div>${rows(i)}`;
        tip.hidden = false;
        const box = plot.getBoundingClientRect();
        const r = hit.getBoundingClientRect();
        const left = r.left - box.left + r.width / 2;
        tip.style.left = `${Math.min(Math.max(left, tip.offsetWidth / 2), box.width - tip.offsetWidth / 2)}px`;
      };
      hit.addEventListener('pointerenter', show);
      hit.addEventListener('click', show);
    });
    plot.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hide(); });
    document.addEventListener('click', (e) => { if (!plot.contains(e.target)) hide(); });
  }

  function table(fig, categories, series, format) {
    const d = document.createElement('details');
    d.className = 'chart-table';
    d.innerHTML = `<summary>Show as table</summary><div class="table-scroll"><table>
      <thead><tr><th></th>${series.map((s) => `<th>${esc(s.label)}</th>`).join('')}</tr></thead>
      <tbody>${categories.map((c, i) => `<tr><th>${esc(c)}</th>${series.map((s) =>
        `<td>${s.values[i] == null ? '–' : format(s.values[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    fig.append(d);
  }

  const tipRow = (s, v, format) =>
    `<div class="tip-row"><span class="swatch" style="background: var(${s.color})"></span>${esc(s.label)}<b>${format(v)}</b></div>`;

  function bars({ title, categories, series, stacked = false, labelEvery = 1, totals = false, format = fmtDefault }) {
    const fig = frame(title, series);
    const svg = fig.querySelector('svg');
    const sums = categories.map((_, i) => (stacked
      ? series.reduce((t, s) => t + s.values[i], 0)
      : Math.max(...series.map((s) => s.values[i]))));
    const { top, step } = scale(Math.max(...sums));
    const y = axes(svg, top, step, format);
    const band = plotW / categories.length;
    const groupW = Math.min(band * 0.72, stacked ? 28 : 56);

    categories.forEach((_, i) => {
      const x0 = PAD.l + band * i + (band - groupW) / 2;
      if (stacked) {
        // Bottom to top; a 2px surface gap between segments, only the top one rounded.
        const drawn = series.map((s, k) => ({ s, v: s.values[i], k })).filter((d) => d.v > 0);
        let cum = 0;
        drawn.forEach((d, n) => {
          const bottom = y(cum) - (n ? 2 : 0);
          cum += d.v;
          const p = barPath(x0, bottom, y(cum), groupW, n === drawn.length - 1);
          if (p) svgEl('path', { d: p, style: `fill: var(${d.s.color})` }, svg);
        });
      } else {
        const w = (groupW - 2 * (series.length - 1)) / series.length;
        series.forEach((s, k) => {
          const p = barPath(x0 + k * (w + 2), y(0), y(s.values[i]), w, true);
          if (p) svgEl('path', { d: p, style: `fill: var(${s.color})` }, svg);
        });
      }
      if (totals && sums[i]) {
        svgEl('text', { x: x0 + groupW / 2, y: y(sums[i]) - 5, class: 'value', 'text-anchor': 'middle' }, svg).textContent = format(sums[i]);
      }
    });
    xLabels(svg, categories, band, labelEvery);
    hover(fig, categories, band, (i) => series.map((s) => tipRow(s, s.values[i], format)).join('')
      + (stacked && series.length > 1 ? `<div class="tip-row tip-total">Total<b>${format(sums[i])}</b></div>` : ''));
    table(fig, categories, series, format);
    return fig;
  }

  function line({ title, categories, values, max = 100, color = '--c-words', label = title, format = fmtDefault }) {
    const series = [{ label, color, values }];
    const fig = frame(title, series);
    const svg = fig.querySelector('svg');
    const y = axes(svg, max, max / 2, format);
    const band = plotW / categories.length;
    const x = (i) => PAD.l + band * (i + 0.5);
    // Break the line where a week has no answers rather than drawing through it.
    let d = '';
    values.forEach((v, i) => {
      if (v == null) return;
      d += `${i && values[i - 1] != null ? 'L' : 'M'}${x(i)},${y(v)}`;
    });
    if (d) svgEl('path', { d, class: 'line', style: `stroke: var(${color})` }, svg);
    values.forEach((v, i) => {
      if (v != null) svgEl('circle', { cx: x(i), cy: y(v), r: 4, class: 'dot', style: `fill: var(${color})` }, svg);
    });
    xLabels(svg, categories, band, 1);
    hover(fig, categories, band, (i) => (values[i] == null ? '<div class="tip-row">No answers</div>' : tipRow(series[0], values[i], format)));
    table(fig, categories, series, format);
    return fig;
  }

  return { bars, line };
})();
