import test from 'node:test';
import assert from 'node:assert/strict';
import '../calculator.js';
const { resize, shaping } = globalThis.Stitchloom;
const swatch = { stitches: 18, rows: 24, swatchWidth: 4, swatchHeight: 4, width: 20, height: 24, multiple: 1, extra: 0, rounding: 'nearest' };
test('18 stitches and 24 rows over 4 inches produce 90 stitches and 144 rows at 20 × 24 inches', () => {
  const r = resize(swatch);
  assert.equal(r.count, 90); assert.equal(r.rowCount, 144);
  assert.equal(r.actualWidth, 20); assert.equal(r.actualHeight, 24);
});
test('50 × 60 inch throw uses 225 stitches and 360 rows at the example gauge', () => {
  const r = resize({ ...swatch, width: 50, height: 60 });
  assert.equal(r.count, 225); assert.equal(r.rowCount, 360);
});
test('multiple of 6 plus 2 rounds to valid counts and exposes resulting dimensions', () => {
  assert.equal(resize({ ...swatch, multiple: 6, extra: 2 }).count, 92);
  assert.equal(resize({ ...swatch, multiple: 6, extra: 2, rounding: 'down' }).count, 86);
  assert.equal(resize({ ...swatch, multiple: 6, extra: 2, rounding: 'up' }).count, 92);
  assert.ok(resize({ ...swatch, multiple: 6, extra: 2 }).actualWidth > 20);
});
test('one full repeat is retained even when the requested width cannot contain it', () => {
  const r = resize({ ...swatch, width: 0.1, multiple: 12, extra: 2, rounding: 'down' });
  assert.equal(r.count, 14); assert.equal(r.minimumRepeat, true);
});
test('converting all lengths to centimeters preserves stitch and row counts', () => {
  const metric = { ...swatch };
  for (const key of ['swatchWidth', 'swatchHeight', 'width', 'height']) metric[key] *= 2.54;
  const r = resize(metric);
  assert.equal(r.count, 90); assert.equal(r.rowCount, 144);
  assert.ok(Math.abs(r.actualWidth - 50.8) < 1e-9);
  for (const rounding of ['up', 'down']) assert.equal(resize({ ...metric, rounding }).count, 90);
});
test('blank, zero, nonfinite and fractional repeat values cannot produce a valid plan', () => {
  for (const change of [{ stitches: '' }, { rows: 0 }, { swatchWidth: 0 }, { width: Infinity }, { multiple: 1.5 }, { extra: -1 }, { rounding: 'other' }]) {
    assert.throws(() => resize({ ...swatch, ...change }));
  }
});
test('100 to 110 uses 10 single-stitch increases and 90 plain stitches', () => {
  const r = shaping({ current: 100, target: 110 });
  assert.equal(r.events, 10); assert.equal(r.gaps.reduce((a, b) => a + b), 90);
  assert.equal(r.consumed, 100); assert.equal(r.produced, 110);
});
test('100 to 90 uses 10 two-stitch decreases and 80 plain stitches', () => {
  const r = shaping({ current: 100, target: 90 });
  assert.equal(r.events, 10); assert.equal(r.gaps.reduce((a, b) => a + b), 80);
  assert.equal(r.consumed, 100); assert.equal(r.produced, 90);
});
test('same-count row and full-row shaping handle the smallest possible gaps', () => {
  assert.deepEqual(shaping({ current: 5, target: 5 }).gaps, [5]);
  assert.deepEqual(shaping({ current: 2, target: 1 }).gaps, [0, 0]);
  assert.deepEqual(shaping({ current: 1, target: 2 }).gaps, [0, 0]);
});
test('impossible one-row changes and invalid stitch counts are rejected', () => {
  for (const [current, target] of [[10, 21], [10, 4], [0, 4], [5, 0], [1.5, 2], [5, '']]) {
    assert.throws(() => shaping({ current, target }));
  }
});
test('all valid shaping plans through 80 stitches conserve counts and use balanced nonnegative gaps', () => {
  for (let current = 1; current <= 80; current++) {
    for (let target = Math.ceil(current / 2); target <= current * 2; target++) {
      const r = shaping({ current, target });
      assert.equal(r.consumed, current); assert.equal(r.produced, target);
      assert.equal(r.gaps.length, r.events + 1);
      assert.ok(r.gaps.every(n => Number.isInteger(n) && n >= 0));
      assert.ok(Math.max(...r.gaps) - Math.min(...r.gaps) <= 1);
    }
  }
});
