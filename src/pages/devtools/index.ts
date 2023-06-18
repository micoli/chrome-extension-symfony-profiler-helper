try {
  chrome.devtools.panels.create(
    "Symfony Helper",
    "symfony-color-48.png",
    "src/pages/panel/index.html"
  );
} catch (e) {
  console.error(e);
}
