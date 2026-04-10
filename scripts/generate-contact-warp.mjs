// scripts/generate-contact-warp.mjs
// Generates the Contact section "gravity well" distorted grid SVG.
//
// Effect: a regular grid where points are pulled radially toward the center,
// creating a visual focal point that draws the eye to the CTA.
//
// Usage: node scripts/generate-contact-warp.mjs
// Output: public/images/contact-grid-warp.svg
//
// Tweak the PARAMETERS section below to adjust the look, then re-run.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '..', 'public', 'images', 'contact-grid-warp.svg');

// ==========================================
// PARAMETERS — tweak these
// ==========================================
const width = 1200;          // SVG canvas width (viewBox units)
const height = 900;          // SVG canvas height
const gridSpacing = 45;      // distance between grid lines (px)
const subdivisions = 80;     // points per line (higher = smoother curves)
const strength = 0.35;       // 0 = no distortion, 1 = full collapse at center
const radius = 300;          // influence radius of the well (px)
const bgColor = '#B8F0C8';   // mint background — matches the site palette
const strokeColor = '#1A1A1A';
const strokeOpacity = 0.10;
const strokeWidth = 1.0;
const fadeInnerStop = 50;    // % — where the fade starts losing opacity
const fadeOuterStop = 100;   // % — where the fade reaches zero
// ==========================================

const cx = width / 2;
const cy = height / 2;

// Distortion: radial pull using a Gaussian-like falloff.
// At d=0: scale = 1 - strength (strong pull)
// At d=radius: scale ≈ 1 - strength * 0.6 (moderate pull)
// At d >> radius: scale ≈ 1 (no pull)
function distort(x, y) {
  const dx = x - cx;
  const dy = y - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < 0.001) return { x, y };
  const r = d / radius;
  const scale = 1 - strength * Math.exp(-(r * r) / 2);
  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  };
}

// Generate a smooth path through subdivided, distorted points.
function buildPath(axis, fixed) {
  const points = [];
  const length = axis === 'h' ? width : height;
  for (let i = 0; i <= subdivisions; i++) {
    const t = (length * i) / subdivisions;
    const p = axis === 'h' ? distort(t, fixed) : distort(fixed, t);
    points.push(p);
  }
  return 'M' + points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L');
}

const paths = [];

// Horizontal lines
for (let y = 0; y <= height; y += gridSpacing) {
  paths.push(buildPath('h', y));
}
// Vertical lines
for (let x = 0; x <= width; x += gridSpacing) {
  paths.push(buildPath('v', x));
}

// Assemble SVG with radial fade mask so the grid blends with the background.
// The mint rect background matches the site palette exactly, so when this SVG
// is overlaid on the page, it's invisible (same color) while still keeping a
// visible preview when viewed standalone.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true">
  <defs>
    <radialGradient id="fade" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="${fadeInnerStop}%" stop-color="white" stop-opacity="0.9"/>
      <stop offset="${fadeOuterStop}%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="fadeMask">
      <rect width="${width}" height="${height}" fill="url(#fade)"/>
    </mask>
  </defs>
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <g mask="url(#fadeMask)" stroke="${strokeColor}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}" stroke-linecap="round">
${paths.map(d => `    <path d="${d}"/>`).join('\n')}
  </g>
</svg>
`;

// Write file
const outDir = dirname(outputPath);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(outputPath, svg);
console.log(`Generated: ${outputPath}`);
console.log(`Size: ${(svg.length / 1024).toFixed(1)} KB, paths: ${paths.length}`);
