import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import LogList from "@pages/shared/LogList/LogList";
import { MantineProvider } from "@mantine/core";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/panel");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }

  const root = createRoot(appContainer);
  root.render(
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <LogList height={"100%"} />
    </MantineProvider>
  );
}

init();
