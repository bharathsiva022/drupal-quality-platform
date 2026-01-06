const fs = require("fs");
const path = require("path");

function formatNumber(value) {
  if (typeof value === "number") {
    return value % 1 === 0
      ? value.toString()
      : value.toFixed(2).replace(/\.00$/, "");
  }
  return value;
}

function generateLighthouseSummary() {
  const reportsDir = "./cypress/reports/lighthouse";

  if (!fs.existsSync(reportsDir)) {
    console.error(`❌ Reports directory does not exist: ${reportsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".json"));
  console.log("📂 Files found:", files);

  if (files.length === 0) {
    console.warn("⚠️ No JSON report files found.");
    process.exit(0);
  }

  const results = {};

  files.forEach((file) => {
    const filePath = path.join(reportsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const categories = data.categories || {};

    const score = {
      performance: categories.performance?.score ? categories.performance.score * 100 : "N/A",
      accessibility: categories.accessibility?.score ? categories.accessibility.score * 100 : "N/A",
      bestPractices: categories["best-practices"]?.score ? categories["best-practices"].score * 100 : "N/A",
      seo: categories.seo?.score ? categories.seo.score * 100 : "N/A",
    };

    const type = file.includes("desktop") ? "desktop" : "mobile";

    const match = file.match(/^lh-(desktop|mobile)-(.+?)\.json$/i);
    let baseName = match ? match[2] : file.replace(/\.json$/, "");
    baseName = baseName.replace(/^[-_]+/, "");

    if (!results[baseName]) {
      results[baseName] = { page: "" };
    }

    // Always store full URL if available
    if (data.finalUrl && !results[baseName].page.startsWith("http")) {
      results[baseName].page = data.finalUrl;
    }

    results[baseName][type] = score;
  });

  const thresholds = { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 };

  let index = 1;
  const rows = Object.entries(results)
    .map(([pageKey, pageData]) => {
      const makeRow = (device, data) => {
        const checks = ["performance", "accessibility", "bestPractices", "seo"];
        let allPass = true;

        const cells = checks.map((key) => {
          const value = formatNumber(data[key]);
          const num = parseFloat(value);
          const passed = !isNaN(num) && num >= thresholds[key];
          if (!passed) allPass = false;
          const bg = passed ? "#d0f0d0" : "#fbdcdc";
          const color = passed ? "#27632a" : "#912d2d";
          return `<td style="background-color:${bg};color:${color};font-weight:500;">${value}</td>`;
        });

        const status = allPass
          ? `<td style="background-color:#d0f0d0;color:#27632a;font-weight:bold;">Pass</td>`
          : `<td style="background-color:#fbdcdc;color:#912d2d;font-weight:bold;">Fail</td>`;

        const deviceLabel = `<td style="font-weight:bold;">${device}</td>`;

        return `<tr>${deviceLabel}${cells.join("")}${status}</tr>`;
      };

      const desktopRow = pageData.desktop
        ? makeRow("Desktop", pageData.desktop)
        : `<tr><td colspan="6" style="color:#888;">No Desktop Data</td></tr>`;

      const mobileRow = pageData.mobile
        ? makeRow("Mobile", pageData.mobile)
        : `<tr><td colspan="6" style="color:#888;">No Mobile Data</td></tr>`;

      const pageCell = pageData.page.startsWith("http")
        ? `<a href="${pageData.page}" target="_blank">${pageData.page}</a>`
        : pageData.page;

      return `
        <tr>
          <td rowspan="2">${index++}</td>
          <td rowspan="2" class="left-align">${pageCell}</td>
          ${desktopRow.replace("<tr>", "").replace("</tr>", "")}
        </tr>
        ${mobileRow}
      `;
    })
    .join("\n");

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Lighthouse Summary Report</title>
    <style>
      body { font-family: Arial, sans-serif; padding:20px; background:#fefefe; }
      h1 { text-align:center; color:#333; margin-bottom:20px; }
      table { border-collapse:collapse; width:100%; table-layout: fixed; }
      th, td { border:1px solid #ccc; padding:10px; text-align:center; word-wrap:break-word; }
      th { background:#f4f4f4; color:#222; }
      tr:nth-child(even) { background:#f9f9f9; }
      .left-align { text-align:left; word-break:break-all; }
      a { color:#0066cc; text-decoration:none; }
      a:hover { text-decoration:underline; }

      /* Column widths */
      th:nth-child(1), td:nth-child(1) { width:40px; }
      th:nth-child(2), td:nth-child(2) { width:400px; }
      th:nth-child(3), td:nth-child(3),
      th:nth-child(4), td:nth-child(4),
      th:nth-child(5), td:nth-child(5),
      th:nth-child(6), td:nth-child(6),
      th:nth-child(7), td:nth-child(7),
      th:nth-child(8), td:nth-child(8) {
        width: 130px;
      }

      .pass { background:#d0f0d0; color:#27632a; font-weight:bold; }
      .fail { background:#fbdcdc; color:#912d2d; font-weight:bold; }
    </style>
  </head>
  <body>
    <h1>Lighthouse Summary Report</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Page</th>
          <th>Device</th>
          <th>Performance</th>
          <th>Accessibility</th>
          <th>Best Practices</th>
          <th>SEO</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>
  `;

  const outputPath = path.join(reportsDir, "lighthouse-summary.html");
  fs.writeFileSync(outputPath, htmlContent);
  console.log(`✅ HTML summary report generated at: ${outputPath}`);
}

if (require.main === module) generateLighthouseSummary();










