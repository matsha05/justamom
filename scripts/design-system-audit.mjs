import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function parseThemeVars(themeCss) {
  const map = new Map();
  const regex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = regex.exec(themeCss)) !== null) {
    map.set(`--${match[1]}`, match[2].trim());
  }
  return map;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "").trim();
  if (![3, 6].includes(clean.length)) return null;
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;

  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return null;

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function channelToLinear(value) {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = channelToLinear(rgb.r);
  const g = channelToLinear(rgb.g);
  const b = channelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const lumA = luminance(hexA);
  const lumB = luminance(hexB);
  if (lumA == null || lumB == null) return null;

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

function formatRatio(value) {
  return value == null ? "n/a" : value.toFixed(2);
}

const failures = [];
const notes = [];

const themeCss = read("app/styles/theme.css");
const layoutTsx = read("app/layout.tsx");
const ogTsx = read("app/opengraph-image.tsx");

const vars = parseThemeVars(themeCss);

const requiredTokens = [
  "--color-ink",
  "--color-ink-soft",
  "--color-ink-muted",
  "--color-ink-faint",
  "--color-paper",
  "--color-accent",
  "--font-heading",
  "--font-body",
  "--text-display",
  "--text-body",
  "--radius-pill",
];

for (const token of requiredTokens) {
  assert(vars.has(token), `Missing token in theme: ${token}`, failures);
}

const paper = vars.get("--color-paper");
const inkSoft = vars.get("--color-ink-soft");
const inkMuted = vars.get("--color-ink-muted");
const inkFaint = vars.get("--color-ink-faint");
const accent = vars.get("--color-accent");

if (paper && inkSoft) {
  const ratio = contrastRatio(inkSoft, paper);
  notes.push(`Contrast --color-ink-soft on --color-paper: ${formatRatio(ratio)}`);
  assert((ratio ?? 0) >= 4.5, "Contrast check failed: --color-ink-soft on --color-paper < 4.5", failures);
}

if (paper && inkMuted) {
  const ratio = contrastRatio(inkMuted, paper);
  notes.push(`Contrast --color-ink-muted on --color-paper: ${formatRatio(ratio)}`);
  assert((ratio ?? 0) >= 4.5, "Contrast check failed: --color-ink-muted on --color-paper < 4.5", failures);
}

if (paper && inkFaint) {
  const ratio = contrastRatio(inkFaint, paper);
  notes.push(`Contrast --color-ink-faint on --color-paper: ${formatRatio(ratio)}`);
  assert((ratio ?? 0) >= 4.5, "Contrast check failed: --color-ink-faint on --color-paper < 4.5", failures);
}

if (paper && accent) {
  const ratio = contrastRatio(accent, paper);
  notes.push(`Contrast --color-accent on --color-paper: ${formatRatio(ratio)}`);
  assert((ratio ?? 0) >= 4.5, "Contrast check failed: --color-accent on --color-paper < 4.5", failures);
}

if (accent) {
  const ratio = contrastRatio("#ffffff", accent);
  notes.push(`Contrast white on --color-accent: ${formatRatio(ratio)}`);
  assert((ratio ?? 0) >= 4.5, "Contrast check failed: white on --color-accent < 4.5", failures);
}

assert(
  layoutTsx.includes("Literata") && layoutTsx.includes("Plus_Jakarta_Sans"),
  "Layout font imports are not the expected Literata + Plus Jakarta Sans",
  failures,
);

assert(
  layoutTsx.includes("--font-literata") && layoutTsx.includes("--font-plus-jakarta-sans"),
  "Layout font variable names are not normalized",
  failures,
);

assert(
  ogTsx.includes("literata-latin-700-normal.ttf") &&
    ogTsx.includes("plus-jakarta-sans-latin-500-normal.ttf"),
  "OpenGraph image font files are not aligned to the production type stack",
  failures,
);

assert(
  ogTsx.includes("fontFamily: \"Literata\"") && ogTsx.includes("fontFamily: \"Plus Jakarta Sans\""),
  "OpenGraph text styles are not using the production font family names",
  failures,
);

console.log("Design system audit results");
for (const note of notes) {
  console.log(`- ${note}`);
}

if (failures.length > 0) {
  console.error("\nDesign system audit FAILED:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nDesign system audit PASSED");
