import fs from "fs";
import path from "path";
import { assertAllowed } from "../permissions.js";

export const testReportsResource = {
  name: "QA Test Reports",
  async read() {
    const reportsDir = assertAllowed("./reports");

    if (!fs.existsSync(reportsDir)) {
      return { contents: [] };
    }

    const files = fs.readdirSync(reportsDir);

    const data = files.map(file => ({
      file,
      content: fs.readFileSync(
        path.join(reportsDir, file),
        "utf-8"
      )
    }));

    return {
      contents: [
        {
          uri: "qa://test-reports",
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  }
};
