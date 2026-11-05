(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('calculator-form');
  const tool = document.body.dataset.tool;
  if (!form) return;
  let unit = 'in';
  let note = '';
  let toastTimer;
  const names = { gauge: 'Gauge & stitch plan', blanket: 'Blanket plan', shaping: 'Increase & decrease plan' };
  const format = n => Number(n.toFixed(2)).toLocaleString('en-US');
  const counts = n => n.toLocaleString('en-US');
  const pair = (term, value) => `<div><dt>${term}</dt><dd>${value}</dd></div>`;
  const input = () => Object.fromEntries(new FormData(form));
  function notify(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000);
  }
  function render() {
    const data = input();
    try {
      if (tool === 'shaping') renderShaping(data);
      else renderSize(data);
      $('input-error').hidden = true;
      for (const id of ['download-button', 'copy-button', 'print-button']) $(id).disabled = false;
    } catch (error) {
      note = '';
      $('input-error').textContent = error.message;
      $('input-error').hidden = false;
      $('result').innerHTML = '<p class="invalid-result">A little detail is missing.</p><p class="result-notice">Check your measurements to see your project plan.</p>';
      for (const id of ['download-button', 'copy-button', 'print-button']) $(id).disabled = true;
    }
  }
  function renderSize(data) {
    const r = Stitchloom.resize(data);
    const width = `${format(r.actualWidth)} ${unit}`;
    const height = `${format(r.actualHeight)} ${unit}`;
    const repeat = `${r.multiple} × ${counts(r.repeats)} + ${r.extra}`;
    const warning = r.minimumRepeat
      ? 'Your requested width is smaller than one full pattern repeat. This plan keeps one repeat; check the predicted width.'
      : r.rounded ? 'Adjusted to a whole pattern repeat. Check the predicted size before you start.'
      : 'Your stitch count fits the selected repeat. Row counts are rounded to whole rows.';
    $('result').innerHTML = `<div class="count-pair"><div class="count-block"><span>WORK ACROSS</span><strong${counts(r.count).length > 4 ? ' class="long-count"' : ''}>${counts(r.count)}</strong><small>fabric stitches</small></div><div class="count-block"><span>WORK UP</span><strong${counts(r.rowCount).length > 4 ? ' class="long-count"' : ''}>${counts(r.rowCount)}</strong><small>rows</small></div></div>
      <div class="project-sketch" aria-label="Projected fabric dimensions"><div class="fabric-preview"><span>${tool === 'blanket' ? 'a little comfort' : 'made by you'}</span><small class="sketch-width">${width} wide</small></div><span class="sketch-height">${height}<br>long</span></div>
      <dl class="result-details">${pair('Requested size', `${format(Number(data.width))} × ${format(Number(data.height))} ${unit}`)}${pair('Predicted size', `${width} × ${height}`)}${pair('Your stitch gauge', `${format(r.stitchesPerUnit)} sts / ${unit}`)}${pair('Your row gauge', `${format(r.rowsPerUnit)} rows / ${unit}`)}${pair('Pattern repeat', repeat)}</dl><p class="result-notice">${warning} Fabric stitches exclude additional foundation or turning chains.</p>`;
    note = `STITCHLOOM — ${names[tool]}\n\nSwatch: ${data.stitches} stitches across ${data.swatchWidth} ${unit}; ${data.rows} rows over ${data.swatchHeight} ${unit}.\nRequested size: ${format(Number(data.width))} × ${format(Number(data.height))} ${unit}.\n\nWork across: ${r.count} fabric stitches.\nWork up: ${r.rowCount} rows.\nPredicted size: ${width} wide × ${height} long.\nRepeat: ${repeat}.\nRounding: ${data.rounding}; at least one repeat. Rows rounded to nearest whole row.\n\n${warning}\nFoundation/turning chains and separate borders are not included. Gauge assumes rectangular fabric worked in regular rows. Wash and dry a swatch, follow your pattern, and check your work.\n\nGenerated locally with Stitchloom.`;
  }
  function renderShaping(data) {
    const r = Stitchloom.shaping(data);
    if (!['crochet', 'knit'].includes(data.craft)) throw new Error('Select a supported craft.');
    const knitting = data.craft === 'knit';
    const plain = knitting ? 'K' : 'sc';
    const action = r.increasing ? knitting ? 'kfb' : 'inc' : knitting ? 'k2tog' : 'sc2tog';
    const tokens = [];
    for (let i = 0; i < r.gaps.length; i++) {
      if (r.gaps[i]) tokens.push({ text: `${plain} ${r.gaps[i]}`, action: false });
      if (i < r.events) tokens.push({ text: action, action: true });
    }
    const definition = r.events === 0 ? 'Work each stitch normally; no shaping is needed.' : r.increasing
      ? knitting ? 'kfb: knit into the front and back of the next stitch (1 stitch becomes 2).' : 'inc: work 2 US single crochet into the next stitch (1 stitch becomes 2).'
      : knitting ? 'k2tog: knit the next 2 stitches together (2 stitches become 1).' : 'sc2tog: single crochet the next 2 stitches together (2 stitches become 1).';
    $('result').innerHTML = `<p class="row-summary">${counts(r.current)} <span aria-hidden="true">→</span><span class="sr-only">to</span> ${counts(r.target)} <small>stitches</small></p><dl class="result-details">${pair(r.change > 0 ? 'Increases to make' : r.change < 0 ? 'Decreases to make' : 'Changes needed', counts(r.events))}${pair('Starting stitches used', counts(r.consumed))}${pair('Finishing stitch count', counts(r.produced))}</dl><h3 class="sequence-caption">YOUR ROW, FROM START TO FINISH</h3><div class="sequence-list" tabindex="0" role="region" aria-label="Scrollable stitch sequence">${tokens.map(t => `<span class="sequence-chip${t.action ? ' action' : ''}">${t.text}</span>`).join('')}</div><p class="sequence-key"><strong>${knitting ? 'Knitting' : 'Crochet · US terms'}</strong><br>${definition}</p><p class="result-notice">Work left to right through the sequence. Each plain-stitch group uses the next stitches. Turning chains and reserved edge stitches are not included.</p>`;
    note = `STITCHLOOM — ${names.shaping}\n\nCraft: ${knitting ? 'Knitting (knit row)' : 'Crochet (US terminology)'}.\nStart: ${r.current} stitches.\nTarget: ${r.target} stitches.\nChanges: ${r.events} ${r.increasing ? 'increases' : 'decreases'}.\n\nROW SEQUENCE\n${tokens.map(t => t.text).join(', ')}.\n\n${definition}\n\nCount check: consumes ${r.consumed} starting stitches; produces ${r.produced} finished stitches.\n${knitting ? 'K = knit the next stated number of stitches.' : 'sc = single crochet in each of the next stated number of stitches.'}\nWork groups in order, once. Plain stitches are spaced across all ${r.events + 1} gaps, including the edges. This is one row, not a repeating multirow pattern.\n\nNo turning chains, selvedges, mirrored shaping or reserved edge stitches included. Follow your pattern for those details.\n\nGenerated locally with Stitchloom.`;
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    if (tool === 'blanket' && ['width', 'height'].includes(event.target.name)) setPreset('custom', false);
    render();
  });
  form.addEventListener('change', render);
  function setUnit(next, convert = true) {
    if (convert && unit !== next) {
      const ratio = next === 'cm' ? 2.54 : 1 / 2.54;
      for (const id of ['swatchWidth', 'swatchHeight', 'width', 'height']) {
        const element = $(id);
        if (element.value !== '' && Number.isFinite(Number(element.value))) {
          element.value = String(Number((Number(element.value) * ratio).toFixed(6)));
        }
      }
    }
    unit = next;
    for (const button of document.querySelectorAll('[data-unit]')) button.setAttribute('aria-pressed', String(button.dataset.unit === next));
    for (const label of document.querySelectorAll('[data-unit-label]')) label.textContent = next;
    render();
  }
  for (const button of document.querySelectorAll('[data-unit]')) button.addEventListener('click', () => setUnit(button.dataset.unit));
  const presets = { baby: [30, 36], lap: [36, 48], throw: [50, 60], twin: [66, 90], queen: [90, 100] };
  function setPreset(name, apply = true) {
    for (const button of document.querySelectorAll('[data-size]')) {
      const selected = button.dataset.size === name;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    if (apply && presets[name]) {
      const ratio = unit === 'cm' ? 2.54 : 1;
      $('width').value = String(Number((presets[name][0] * ratio).toFixed(6)));
      $('height').value = String(Number((presets[name][1] * ratio).toFixed(6)));
      render();
    }
  }
  for (const button of document.querySelectorAll('[data-size]')) button.addEventListener('click', () => setPreset(button.dataset.size));
  if (tool === 'blanket') setPreset('throw', false);
  $('reset-button').addEventListener('click', () => {
    form.reset();
    if (tool !== 'shaping') setUnit('in', false);
    if (tool === 'blanket') setPreset('throw');
    render();
    notify('A fresh start. Example measurements restored.');
  });
  $('download-button').addEventListener('click', () => {
    if (!note) return;
    const url = URL.createObjectURL(new Blob([note], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `stitchloom-${tool}-plan.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Your project note is saved. Happy making!');
  });
  $('copy-button').addEventListener('click', async () => {
    if (!note) return;
    let copied = false;
    try { await navigator.clipboard.writeText(note); copied = true; } catch {
      const textarea = document.createElement('textarea');
      textarea.value = note;
      textarea.style.cssText = 'position:fixed;top:0;left:-9999px';
      textarea.setAttribute('aria-label', 'Project note to copy');
      document.body.append(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { /* Downloads remain available. */ }
      textarea.remove();
    }
    notify(copied ? 'Project note copied.' : 'Copy is unavailable here. Use Save project note instead.');
  });
  $('print-button').addEventListener('click', () => {
    if (!note) return;
    const brand = document.createElement('p'); brand.className = 'print-brand'; brand.textContent = 'stitchloom ✳';
    const title = document.createElement('h1'); title.textContent = names[tool];
    const content = document.createElement('pre'); content.textContent = note;
    $('print-area').replaceChildren(brand, title, content);
    window.print();
  });
  $('year').textContent = new Date().getFullYear();
  render();
})();
