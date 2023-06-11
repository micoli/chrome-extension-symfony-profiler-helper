import React, { Fragment } from "react";
import "@pages/popup/Popup.css";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import { ActionIcon } from "@mantine/core";

import { useClipboard } from "@mantine/hooks";
import { IconClipboardCopy } from "@tabler/icons-react";

const JsonDisplay = ({ data }: { data: any }) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <Fragment>
      <ActionIcon
        title={"copy"}
        color="green"
        onClick={() => {
          clipboard.copy(JSON.stringify(data, null, 4));
        }}
      >
        <IconClipboardCopy size={16} />
      </ActionIcon>
      <JSONPretty
        style={{ overflow: "auto", width: 600 }}
        data={data}
      ></JSONPretty>
    </Fragment>
  );
};

export default JsonDisplay;
