import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    "128": "icon-128.png",
  },

  permissions: [
    "webRequest",
    "activeTab",
    "tabs",
    "webRequest",
    "webNavigation",
    "nativeMessaging",
    "management",
    "scripting",
    "favicon",
    "storage",
  ],
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  options_page: "src/pages/options/index.html",
  devtools_page: "src/pages/devtools/index.html",
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
      run_at: "document_start",
    },
  ],
  host_permissions: ["<all_urls>"],
  externally_connectable: {
    matches: ["<all_urls>"],
  },
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["<all_urls>"],
    },
  ],
};

export default manifest;
