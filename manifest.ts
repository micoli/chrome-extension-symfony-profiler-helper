import packageJson from "./package.json";
import * as process from "process";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version:
    process.env["steps.taggerDryRun.outputs.new_tag"] || packageJson.version,
  description: packageJson.description,
  icons: {
    "48": "symfony-color-48.png",
    "128": "symfony-color-128.png",
  },

  permissions: ["webRequest", "storage"],
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "symfony-color-48.png",
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  options_page: "src/pages/options/index.html",
  devtools_page: "src/pages/devtools/index.html",
  content_scripts: [],
  // content_scripts: [
  //   {
  //     matches: ["http://*/*", "https://*/*", "<all_urls>"],
  //     js: ["src/pages/content/index.js"],
  //     // KEY for cache invalidation
  //     css: ["assets/css/contentStyle<KEY>.chunk.css"],
  //     run_at: "document_start",
  //   },
  // ],
  host_permissions: ["<all_urls>"],
  externally_connectable: {
    matches: ["<all_urls>"],
  },
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "*.png"],
      matches: ["<all_urls>"],
    },
  ],
};

export default manifest;
