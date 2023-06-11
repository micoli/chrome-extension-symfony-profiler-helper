import React from "react";
import { useEffect, useState } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Group,
  Header,
  Text,
  Tooltip,
} from "@mantine/core";
import { RequestLog } from "../shared";
import { sendMessage, onMessage } from "../shared/messaging";
import { CurlGenerator } from "curl-generator";
import { useClipboard } from "@mantine/hooks";
import { IconClipboardCopy } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Ellipsis from "@pages/popup/Ellipsis";
import httpStatusColor from "@pages/popup/HttpStatusColor";
import ExpandedRow from "@pages/popup/ExpandedRow";

const RequestLogTable = () => {
  const clipboard = useClipboard({ timeout: 500 });
  const [logs, setLogs] = useState<RequestLog[]>([]);

  useEffect(() => {
    console.log("start");

    onMessage("newRequest", (message) => {
      setLogs((previousLogs) => [message.data, ...previousLogs]);
    });

    onMessage("popupClick", (message) => {
      refresh().then();
    });

    refresh().then();
  }, []);

  const refresh = async () => {
    setLogs(await sendMessage("getLogs", null));
  };

  const clearLogs = async () => {
    await sendMessage("clear", null);
    setLogs([]);
  };

  return (
    <AppShell
      padding={"xs"}
      header={
        <Header height={{ base: 40, md: 60 }} p="xs">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Button
              size="xs"
              variant="outline"
              color="lightblue"
              onClick={refresh}
            >
              Refresh
            </Button>
            <Button
              size="xs"
              variant="outline"
              color="lightblue"
              onClick={clearLogs}
            >
              Clear
            </Button>

            <Text>{logs.length}</Text>
          </div>
        </Header>
      }
    >
      <DataTable
        withBorder
        borderRadius="xs"
        withColumnBorders
        striped
        height={500}
        highlightOnHover
        records={logs}
        noHeader
        idAccessor={"requestId"}
        columns={[
          // {
          //   accessor: "requestId",
          //   title: null,
          //   width: 55,
          // },
          {
            accessor: "method",
            title: null,
            width: 60,
          },
          {
            accessor: "status",
            title: null,
            width: 55,
            textAlignment: "center",
            render: ({ status }) => {
              return (
                <Box
                  sx={(theme) => {
                    return {
                      backgroundColor: httpStatusColor(theme, status),
                      borderRadius: "4px",
                      color: "#fff",
                      maxWidth: "9ch",
                      padding: "4px",
                    };
                  }}
                >
                  {status}
                </Box>
              );
            },
          },
          {
            accessor: "url",
            title: "Url",
            render: ({ xDebugData, url }) => (
              <a target="_blank" href={xDebugData.link} rel="noreferrer">
                <Ellipsis text={url} max={45} minimumPrefix={10} />
              </a>
            ),
          },
          {
            accessor: "timestampEnd",
            title: null,
            width: 60,
            textAlignment: "right",
            render: ({ timestampEnd, timestampStart }) => {
              const duration = Math.round(timestampEnd - timestampStart);
              return (
                <Tooltip label={`${timestampEnd - timestampStart} ms`}>
                  <Text>{duration}</Text>
                </Tooltip>
              );
            },
          },
          {
            accessor: "actions",
            title: null,
            width: 50,
            textAlignment: "right",
            render: (requestLog) => (
              <Group spacing={2} position="right" noWrap>
                <ActionIcon
                  title={"copy as cUrl"}
                  color="green"
                  onClick={() => {
                    clipboard.copy(
                      CurlGenerator({
                        url: `"${requestLog.url.replace('"', '\\"')}"`,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        method: requestLog.method,
                        body: requestLog.body,
                        titles: requestLog.requestHeaders.reduce(
                          (obj, item) => {
                            return {
                              ...obj,
                              [item.name]: item.value,
                            };
                          },
                          {}
                        ),
                      })
                    );
                  }}
                >
                  <IconClipboardCopy size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        rowExpansion={{
          content: ExpandedRow,
        }}
      />
    </AppShell>
  );
};

export default RequestLogTable;
