First-Version Features
index.html: Density and stitch count calculator. Enter a measured swatch and target width/height to calculate stitches, rows, and estimated dimensions; supports "multiple + extra stitches" patterns and rounding direction.

blanket-size-calculator.html: Blanket size and stitch count. Baby/Lap/Throw/Twin/Queen with editable reference dimensions, supporting inches and centimeters; does not include a separate border.

stitch-increase-decrease-calculator.html: Even increases/decreases within a single row. Outputs the sequence of operations from start to finish, validating that the old stitch count is consumed and the new stitch count is produced; supports US crochet and knitting kfb/k2tog.

Each page can download TXT project notes, copy results, print, or save as PDF. Data is kept only on the current page; it is not uploaded or stored.

Static tool URLs for three distinct tasks, English instructions, formulas, examples, FAQ, internal links, privacy and terms, and structured data.

There is no validation of real keyword search volume or competition; these pages provide search entry points and do not promise indexing, rankings, AI citations, or ad revenue.

Local Development
Double-click index.html directly, or after installing Node.js, run:

sh
npm run dev
Open http://127.0.0.1:4174. No npm install is required. Online preview: https://stitchloom.luqihang594241.workers.dev/

sh
npm test
npm run build
