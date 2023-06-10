import React from "react";
import { useEffect, useState } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import {
  ActionIcon,
  AppShell,
  Box,
  Group,
  Select,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { RequestLog, SearchableRequestLog, XDebugData } from "../shared";
import { sendMessage, onMessage } from "../shared/messaging";
import { CurlGenerator } from "curl-generator";
import { useClipboard } from "@mantine/hooks";
import {
  IconClipboardCopy,
  IconPlayerPause,
  IconPlayerRecord,
  IconRefresh,
  IconTrashX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Ellipsis from "@pages/popup/Ellipsis";
import { httpStatusColor, httpStatusCode } from "@pages/popup/HttpStatusColor";
import ExpandedRow from "@pages/popup/ExpandedRow";
import ToolBar from "@pages/popup/ToolBar";
import { profilerTabs } from "@pages/shared/Profiler";
import {
  storageGetItem,
  storageKeys,
  storageSetItem,
} from "@pages/shared/storage";
import ToolBarIcon from "@pages/popup/ToolBarIcon";

const transformToSearchableRequestLog = (
  requestLog: RequestLog
): SearchableRequestLog => {
  return {
    ...requestLog,
    searchableText: [requestLog.method, requestLog.status, requestLog.url]
      .join(" ")
      .toLowerCase(),
  };
};
const Popup = () => {
  const clipboard = useClipboard({ timeout: 500 });
  const [profilerTab, setProfilerTab] = useState("db");
  const [filter, setFilter] = useState("");
  const [listenersStatus, setListenersStatus] = useState(false);
  const [requestLogs, setRequestLogs] = useState<SearchableRequestLog[]>([]);

  useEffect(() => {
    onMessage("newRequestEvent", (message) => {
      setRequestLogs((previousLogs) => [
        transformToSearchableRequestLog(message.data),
        ...previousLogs,
      ]);
    });
    storageGetItem(storageKeys.profilerTab).then(setProfilerTab);
    sendMessage("getListenersStatus", null).then(setListenersStatus);

    refresh().then();
  }, []);

  const refresh = async () => {
    setRequestLogs(
      (await sendMessage("getLogs", null)).map(transformToSearchableRequestLog)
    );
  };

  const clearLogs = async () => {
    await sendMessage("clear", null);
    setRequestLogs([]);
  };

  const startListener = () => {
    sendMessage("startListeners", null).then(() => setListenersStatus(true));
  };

  const stopListener = () => {
    sendMessage("stopListeners", null).then(() => setListenersStatus(false));
  };

  const openProfiler = (xDebugData: XDebugData) => {
    window.open(`${xDebugData.link}?panel=${profilerTab}`, "_blank");
  };

  return (
    <AppShell
      padding={"xs"}
      header={
        <ToolBar>
          <ToolBarIcon
            title="Record"
            disabled={listenersStatus}
            onClick={startListener}
            icon={<IconPlayerRecord />}
          />
          <ToolBarIcon
            title="Stop"
            disabled={!listenersStatus}
            onClick={stopListener}
            icon={<IconPlayerPause />}
          />
          <Select
            placeholder="Pick one"
            value={profilerTab}
            variant={"unstyled"}
            onChange={(tab) =>
              storageSetItem(storageKeys.profilerTab, tab).then(setProfilerTab)
            }
            data={profilerTabs.map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <ToolBarIcon
            title="Refresh"
            disabled={false}
            onClick={refresh}
            icon={<IconRefresh />}
          />
          <ToolBarIcon
            title={"Clear"}
            disabled={requestLogs.length === 0}
            onClick={clearLogs}
            icon={<IconTrashX />}
          />
          <TextInput
            placeholder="filter"
            value={filter}
            variant={"unstyled"}
            onChange={(event) =>
              setFilter((event.currentTarget.value ?? "").toLowerCase())
            }
          />
        </ToolBar>
      }
    >
      <DataTable
        withBorder
        borderRadius="xs"
        withColumnBorders
        striped
        height={500}
        highlightOnHover
        records={requestLogs.filter((requestLog) => {
          if (filter === "") {
            return true;
          }
          return requestLog.searchableText.includes(filter);
        })}
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
                <Tooltip label={httpStatusCode(status)}>
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
                </Tooltip>
              );
            },
          },
          {
            accessor: "url",
            title: "Url",
            render: ({ xDebugData, url }) => (
              <Text onClick={() => openProfiler(xDebugData)}>
                <Ellipsis text={url} max={45} minimumPrefix={10} />
              </Text>
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

export default Popup;
