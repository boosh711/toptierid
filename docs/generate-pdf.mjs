import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const md = readFileSync(path.join(dir, "TOP-TIER-ID-Project-Summary.md"), "utf8");

function mdToHtml(markdown) {
  let html = markdown
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^- \[ \] (.+)$/gm, "<li class='check'>☐ $1</li>")
    .replace(/^- \[x\] (.+)$/gm, "<li class='check'>☑ $1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>");

  html = html.replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, (m) => {
    if (m.includes('class="check"')) return `<ul class="checklist">${m}</ul>`;
    return `<ul>${m}</ul>`;
  });

  html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
    const ths = header.split("|").filter(Boolean).map((c) => `<th>${c.trim()}</th>`).join("");
    const rows = body.trim().split("\n").map((row) => {
      const tds = row.split("|").filter(Boolean).map((c) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    }).join("");
    return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/\n\n+/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p>\s*(<h[123]>)/g, "$1");
  html = html.replace(/(<\/h[123]>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<table>)/g, "$1");
  html = html.replace(/(<\/table>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<pre>)/g, "$1");
  html = html.replace(/(<\/pre>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<hr>)/g, "$1");
  html = html.replace(/(<hr>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*<\/p>/g, "");
  return html;
}

const body = mdToHtml(md);
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>TOP TIER ID — Project Summary</title>
<style>
  @page { size: letter; margin: 0.75in; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #111; max-width: 100%; }
  h1 { font-size: 22pt; color: #1E6BD6; border-bottom: 3px solid #1E6BD6; padding-bottom: 8px; margin-top: 0; page-break-after: avoid; }
  h2 { font-size: 14pt; color: #1E6BD6; margin-top: 22px; border-bottom: 1px solid #ddd; padding-bottom: 4px; page-break-after: avoid; }
  h3 { font-size: 11pt; color: #333; margin-top: 16px; page-break-after: avoid; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 9.5pt; page-break-inside: avoid; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f0f4fa; font-weight: 600; }
  tr:nth-child(even) td { background: #fafafa; }
  code, pre { font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 9pt; }
  pre { background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 10px; overflow-x: auto; white-space: pre-wrap; page-break-inside: avoid; }
  blockquote { border-left: 4px solid #1E6BD6; margin: 12px 0; padding: 8px 16px; background: #f8fafc; color: #333; page-break-inside: avoid; }
  blockquote p { margin: 6px 0; }
  ul { margin: 8px 0; padding-left: 22px; }
  li { margin: 3px 0; }
  hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
  strong { color: #000; }
  .checklist { list-style: none; padding-left: 0; }
</style>
</head>
<body>${body}</body>
</html>`;

const htmlPath = path.join(dir, "TOP-TIER-ID-Project-Summary.html");
const pdfPath = path.join(dir, "TOP-TIER-ID-Project-Summary.pdf");
writeFileSync(htmlPath, fullHtml);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execSync(
  `"${chrome}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`,
  { stdio: "inherit" }
);
console.log("PDF written to:", pdfPath);
