import fs from "fs";
import path from "path";
import { assertAllowed } from "../permissions.js";

export const drupalConfigResource = {
  name: "Drupal Config Sync",
  async read() {
    const configPath = assertAllowed("../config/sync");

    const files = fs
      .readdirSync(configPath)
      .filter(f => f.endsWith(".yml"))
      .slice(0, 50); // safety limit

    const data = files.map(file => ({
      file,
      content: fs.readFileSync(
        path.join(configPath, file),
        "utf-8"
      )
    }));

    return {
      contents: [
        {
          uri: "drupal://config/sync",
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  }
};
