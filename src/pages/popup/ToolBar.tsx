import React from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import { Group, Header } from "@mantine/core";

const ToolBar = ({ children }) => (
  <Header height={{ base: 40, md: 60 }} p="lg">
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Group spacing={"lg"}>{children}</Group>
    </div>
  </Header>
);
export default ToolBar;
