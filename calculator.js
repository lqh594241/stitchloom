/* Counts describe fabric stitches, not foundation chains or turning chains. */
(function (root) {
  'use strict';
  function number(value, name, min, max, integer = false) {
    if (String(value).trim() === '') throw new Error(`Enter ${name}.`);
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) {
      throw new Error(`${name} must be ${integer ? 'a whole number' : 'a number'} from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}.`);
    }
    return n;
  }
  function resize(input) {
    const stitches = number(input.stitches, 'Swatch stitches', 1, 1000);
    const rows = number(input.rows, 'Swatch rows', 1, 1000);
    const swatchWidth = number(input.swatchWidth, 'Swatch width', 0.1, 1000);
    const swatchHeight = number(input.swatchHeight, 'Swatch height', 0.1, 1000);
    const width = number(input.width, 'Project width', 0.1, 1000);
    const height = number(input.height, 'Project height', 0.1, 1000);
    const multiple = number(input.multiple, 'Stitch repeat', 1, 1000, true);
    const extra = number(input.extra, 'Extra stitches', 0, 1000, true);
    if (!['nearest', 'up', 'down'].includes(input.rounding)) throw new Error('Select a rounding method.');
    const rawStitches = stitches / swatchWidth * width;
    const round = { nearest: Math.round, up: Math.ceil, down: Math.floor }[input.rounding];
    const repeatEstimate = (rawStitches - extra) / multiple;
    // Unit conversions may produce 89.99999999999999 for an exact 90.
    const stableEstimate = Math.abs(repeatEstimate - Math.round(repeatEstimate)) < 1e-9
      ? Math.round(repeatEstimate) : repeatEstimate;
    const repeats = Math.max(1, round(stableEstimate));
    const count = repeats * multiple + extra;
    const rowCount = Math.max(1, Math.round(rows / swatchHeight * height));
    return { rawStitches, count, rowCount, repeats, multiple, extra,
      actualWidth: count / stitches * swatchWidth, actualHeight: rowCount / rows * swatchHeight,
      stitchesPerUnit: stitches / swatchWidth, rowsPerUnit: rows / swatchHeight,
      minimumRepeat: rawStitches < multiple + extra,
      rounded: Math.abs(count - rawStitches) > 0.000001 };
  }
  function shaping(input) {
    const current = number(input.current, 'Starting stitches', 1, 2000, true);
    const target = number(input.target, 'Target stitches', 1, 2000, true);
    const change = target - current;
    const events = Math.abs(change);
    const increasing = change > 0;
    if (increasing && events > current) throw new Error('For this single row, use at most one increase per starting stitch. Split a larger change across several rows.');
    if (!increasing && events * 2 > current) throw new Error('There are not enough stitches for that many two-stitch decreases in one row. Split the change across several rows.');
    if (!events) return { current, target, change, events, increasing: false, gaps: [current], consumed: current, produced: current };
    const plain = current - events * (increasing ? 1 : 2);
    const gaps = Array.from({ length: events + 1 }, (_, i) =>
      Math.round((i + 1) * plain / (events + 1)) - Math.round(i * plain / (events + 1)));
    return { current, target, change, events, increasing, gaps,
      consumed: plain + events * (increasing ? 1 : 2),
      produced: plain + events * (increasing ? 2 : 1) };
  }
  root.Stitchloom = Object.freeze({ resize, shaping });
})(globalThis);
