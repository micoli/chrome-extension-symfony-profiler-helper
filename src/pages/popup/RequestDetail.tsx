import React, { Fragment } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import { ActionIcon, Group, Table } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconClipboardCopy } from "@tabler/icons-react";
import moment from "moment/moment";
import { SearchableRequestLog } from "@pages/shared";

const RequestDetail = ({ record }: { record: SearchableRequestLog }) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <Table>
      <tr>
        <td>Url</td>
        <td>
          <Group>
            <Fragment>{record.method}</Fragment>
            <ActionIcon
              title={"copy URL"}
              color="green"
              onClick={() => {
                clipboard.copy(record.url);
              }}
            >
              <IconClipboardCopy size={16} />
            </ActionIcon>
            <Fragment>{record.url}</Fragment>
          </Group>
        </td>
      </tr>
      <tr>
        <td>Start</td>
        <td>
          {moment.unix(record.timestampStart).format("DD/MM/YYYY HH:mm:ss.SSS")}
        </td>
      </tr>
      <tr>
        <td>End</td>
        <td>
          {moment.unix(record.timestampEnd).format("DD/MM/YYYY HH:mm:ss.SSS")}
        </td>
      </tr>
      <tr>
        <td>RequestId</td>
        <td>{record.requestId}</td>
      </tr>
    </Table>
  );
};

export default RequestDetail;
