import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
    manifest_version: 3,
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    options_page: "src/pages/options/index.html",
    background: {
        service_worker: "src/pages/background/index.js",
        type: "module",
    },
    permissions: [
        'webRequest',
        "activeTab",
        "tabs",
        "webRequest",
        "webNavigation",
        "management",
        "scripting",
        "favicon",
        "storage"
    ],
    host_permissions: ['<all_urls>'],
    action: {
        default_popup: "src/pages/popup/index.html",
        default_icon: "icon-34.png",
    },
    icons: {
        "128": "icon-128.png",
    },
    content_scripts: [
        {
            matches: ["http://*/*", "https://*/*", "<all_urls>"],
            js: ["src/pages/content/index.js"],
            // KEY for cache invalidation
            css: ["assets/css/contentStyle<KEY>.chunk.css"],
            run_at: "document_start"
        },
    ],
    devtools_page: "src/pages/devtools/index.html",
    web_accessible_resources: [
        {
            resources: [
                "assets/js/*.js",
                "assets/css/*.css",
                "icon-128.png",
                "icon-34.png",
            ],
            matches: ["<all_urls>"],
            //matches: ["*://*/*"],
        },
    ],
};

export default manifest;
