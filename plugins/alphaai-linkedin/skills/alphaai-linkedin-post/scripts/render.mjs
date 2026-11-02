#!/usr/bin/env node
// Renders an alpha.ai graphic (HTML) to JPG or PNG with a headless Chromium browser
// (Chrome, Edge, Chromium or Brave). Works on Windows, macOS and Linux. No npm packages.
//
//   node render.mjs <input.html> <output.jpg|.png> [--size 1080x1350]
//
// The output format follows the file extension. Templates size themselves to the
// viewport (100vw x 100vh), so --size alone decides the format.
// Set CHROME_PATH to use a specific browser binary.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir, platform } from "node:os";
import { join, resolve, extname } from "node:path";
import { pathToFileURL } from "node:url";

function usage(msg) {
  if (msg) console.error(`Error: ${msg}`);
  console.error("Usage: node render.mjs <input.html> <output.jpg|.png> [--size 1080x1350]");
  process.exit(2);
}

const args = process.argv.slice(2);
const positional = [];
let size = "1080x1350";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--size") size = args[++i];
  else if (args[i].startsWith("--size=")) size = args[i].slice(7);
  else positional.push(args[i]);
}
if (positional.length !== 2) usage();

const src = resolve(positional[0]);
const out = resolve(positional[1]);
const ext = extname(out).toLowerCase();
if (!existsSync(src)) usage(`input not found: ${src}`);
if (![".jpg", ".jpeg", ".png"].includes(ext)) usage("output must end in .jpg, .jpeg or .png");
const m = /^(\d+)x(\d+)$/.exec(size || "");
if (!m) usage(`--size must look like 1080x1350, got "${size}"`);
const [width, height] = [Number(m[1]), Number(m[2])];

function onPath(name) {
  const r = spawnSync(platform() === "win32" ? "where" : "which", [name], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.split(/\r?\n/)[0].trim() : null;
}

function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const os = platform();
  const candidates = [];
  if (os === "win32") {
    const roots = [process.env["PROGRAMFILES"], process.env["PROGRAMFILES(X86)"], process.env["LOCALAPPDATA"]].filter(Boolean);
    for (const root of roots) {
      candidates.push(
        join(root, "Google", "Chrome", "Application", "chrome.exe"),
        join(root, "Microsoft", "Edge", "Application", "msedge.exe"),
        join(root, "Chromium", "Application", "chrome.exe"),
        join(root, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
      );
    }
  } else if (os === "darwin") {
    for (const home of ["", process.env.HOME || ""]) {
      candidates.push(
        `${home}/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
        `${home}/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`,
        `${home}/Applications/Chromium.app/Contents/MacOS/Chromium`,
        `${home}/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`,
      );
    }
  }
  const found = candidates.find((p) => existsSync(p));
  if (found) return found;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "microsoft-edge-stable", "brave-browser", "chrome", "msedge"]) {
    const p = onPath(name);
    if (p) return p;
  }
  return null;
}

// Reads pixel dimensions from a PNG or JPEG header, to prove the render came out at the right size.
function imageSize(file) {
  const b = readFileSync(file);
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  console.error("No Chromium-based browser found (Chrome, Edge, Chromium or Brave).");
  console.error("Install one, or point CHROME_PATH at its executable.");
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), "alphaai-render-"));
if (existsSync(out)) rmSync(out);
const flags = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "--force-device-scale-factor=1",
  "--default-background-color=ffffffff",
  "--virtual-time-budget=6000",
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  `--screenshot=${out}`,
];
// Ubuntu 23.10+ blocks the Chromium sandbox for unprivileged users; we only render local files.
if (platform() === "linux") flags.push("--no-sandbox");

const r = spawnSync(browser, [...flags, pathToFileURL(src).href], { encoding: "utf8", timeout: 60000 });
try { rmSync(profile, { recursive: true, force: true }); } catch {}

if (!existsSync(out) || statSync(out).size === 0) {
  console.error(`Render failed with ${browser}`);
  if (r.error) console.error(r.error.message);
  if (r.stderr) console.error(r.stderr.split("\n").slice(-10).join("\n"));
  process.exit(1);
}

const dims = imageSize(out);
if (!dims || dims[0] !== width || dims[1] !== height) {
  console.error(`Rendered ${out}, but it is ${dims ? dims.join("x") : "unreadable"}, expected ${width}x${height}.`);
  process.exit(1);
}
console.log(`OK: ${out} (${width}x${height})`);
