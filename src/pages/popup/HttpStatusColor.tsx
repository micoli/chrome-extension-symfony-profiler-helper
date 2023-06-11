import React from "react";
import { MantineTheme } from "@mantine/core";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";

const httpStatusColor = (theme: MantineTheme, statusCode: number) => {
  switch (true) {
    case statusCode >= 100 && statusCode < 200:
      return theme.colors.blue[8];
    case statusCode >= 200 && statusCode < 300:
      return theme.colors.green[8];
    case statusCode >= 300 && statusCode < 400:
      return theme.colors.yellow[8];
    case statusCode >= 400 && statusCode < 500:
      return theme.colors.orange[8];
    default:
      return theme.colors.red[8];
  }
};

export default httpStatusColor;
