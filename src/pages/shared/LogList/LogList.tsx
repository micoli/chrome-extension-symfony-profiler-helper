import React, { MouseEvent } from "react";
import { useEffect, useState } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import { generateColors } from "@mantine/colors-generator";
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
import { RequestLog, SearchableRequestLog, XDebugData } from "../index";
import { sendMessage, onMessage } from "../messaging";
import { CurlGenerator } from "curl-generator";
import { useClipboard } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronRight,
  IconClipboardCopy,
  IconGraph,
  IconPlayerPause,
  IconPlayerRecord,
  IconRefresh,
  IconSolarPanel,
  IconTrashX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Ellipsis from "@pages/shared/LogList/Ellipsis";
import {
  httpStatusColor,
  httpStatusCode,
} from "@pages/shared/LogList/HttpStatusColor";
import ExpandedRow from "@pages/shared/LogList/ExpandedRow";
import ToolBar from "@pages/shared/LogList/ToolBar";
import { profilerMetrics, profilerTabs } from "@pages/shared/Profiler";
import ToolBarIcon from "@pages/shared/LogList/ToolBarIcon";

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
const LogList = ({ height }: { height: string | number }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const [profilerTab, setProfilerTab] = useState("db");
  const [autoloadMetricTab, setAutoloadMetricTab] = useState("db");
  const [filter, setFilter] = useState("");
  const [listenersStatus, setListenersStatus] = useState(false);
  const [requestLogs, setRequestLogs] = useState<SearchableRequestLog[]>([]);
  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([]);

  useEffect(() => {
    onMessage("newRequestEvent", (message) => {
      console.log(message.data.requestId);
      setRequestLogs((previousLogs) =>
        [
          transformToSearchableRequestLog(message.data),
          ...previousLogs.filter(
            (record) => record.requestId !== message.data.requestId
          ),
        ].sort((recordA, recordB) =>
          recordA.timestampStart < recordB.timestampStart ? 1 : -1
        )
      );
    });
    refresh().then();
    sendMessage("getDefaultProfilerTab", null).then(setProfilerTab);
    sendMessage("getAutoloadMetricTab", null).then(setAutoloadMetricTab);
    sendMessage("getListenersStatus", null).then(setListenersStatus);
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

  const onClickRender = (requestLog: SearchableRequestLog) => (
    <Group spacing={2} position="right" noWrap>
      <ActionIcon
        title={"copy as cUrl"}
        color="green"
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          clipboard.copy(
            CurlGenerator({
              url: `"${requestLog.url.replace('"', '\\"')}"`,
              method: requestLog.method,
              body: requestLog.body,
              headers: requestLog.requestHeaders.reduce((obj, item) => {
                return {
                  ...obj,
                  [item.name]: item.value,
                };
              }, {}),
            })
          );
        }}
      >
        <IconClipboardCopy size={16} />
      </ActionIcon>
    </Group>
  );

  return (
    <AppShell
      padding={"xs"}
      header={
        <ToolBar>
          <ToolBarIcon
            title="Record"
            disabled={listenersStatus}
            onClick={startListener}
            icon={<IconPlayerRecord size={20} />}
          />
          <ToolBarIcon
            title="Stop"
            disabled={!listenersStatus}
            onClick={stopListener}
            icon={<IconPlayerPause size={20} />}
          />
          <div style={{ width: 100 }}>
            <TextInput
              placeholder="filter"
              value={filter}
              size={"xs"}
              variant={"unstyled"}
              onChange={(event) =>
                setFilter((event.currentTarget.value ?? "").toLowerCase())
              }
            />
          </div>
          <Tooltip label={"Opened profiler panel on click"}>
            <IconSolarPanel size={20} />
          </Tooltip>
          <Box pos="relative">
            <Select
              placeholder="Pick one"
              value={profilerTab}
              w={100}
              sx={{
                ".mantine-Select-dropdown": {
                  width: "250px !important",
                  left: "0 !important",
                },
              }}
              size={"xs"}
              variant={"unstyled"}
              onChange={(tab) => {
                sendMessage("setDefaultProfilerTab", { tab }).then(
                  setProfilerTab
                );
              }}
              data={profilerTabs.map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Box>
          <Tooltip label={"Collected metric"}>
            <IconGraph size={20} />
          </Tooltip>
          <Box pos="relative">
            <Select
              placeholder="Pick one"
              value={autoloadMetricTab}
              size={"xs"}
              variant={"unstyled"}
              w={100}
              sx={{
                ".mantine-Select-dropdown": {
                  width: "200px !important",
                  left: "0 !important",
                },
              }}
              onChange={(tab) => {
                sendMessage("setAutoloadMetricTab", { tab })
                  .then(setAutoloadMetricTab)
                  .then(() => sendMessage("optionsSetEvent", null));
              }}
              data={[{ value: "null", label: "-None-" }].concat(
                profilerMetrics.map(([value, label]) => ({
                  value,
                  label,
                }))
              )}
            />
          </Box>
          <ToolBarIcon
            title={"Clear"}
            disabled={requestLogs.length === 0}
            onClick={clearLogs}
            icon={<IconTrashX size={20} />}
          />
          <ToolBarIcon
            title="Refresh"
            disabled={false}
            onClick={refresh}
            icon={<IconRefresh size={20} />}
          />
        </ToolBar>
      }
    >
      <DataTable
        withBorder
        borderRadius="xs"
        withColumnBorders
        striped
        height={height}
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
          {
            accessor: "method",
            title: null,
            width: 70,
            render: ({ method, requestId }) => {
              return (
                <Text size="xs">
                  {method.substring(0, 4)}
                  &nbsp;
                  {expandedRecordIds.includes(requestId) ? (
                    <IconChevronDown width={12} height={12} />
                  ) : (
                    <IconChevronRight width={12} height={12} />
                  )}
                </Text>
              );
            },
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
              <>
                <Text size="xs" onClick={() => openProfiler(xDebugData)}>
                  <Ellipsis text={url} max={50} minimumPrefix={10} />
                  <Text align={"right"}>
                    {xDebugData.metadata.map((metric, index) => {
                      return (
                        <Tooltip
                          key={`${metric.label}-${metric.value}`}
                          label={metric.label}
                        >
                          <span>
                            <Text
                              component="span"
                              color={generateColors("#931D1D")[index % 10]}
                            >
                              {metric.value}
                            </Text>
                            {index < xDebugData.metadata.length - 1 && ", "}
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Text>
                </Text>
              </>
            ),
          },
          {
            accessor: "timestampEnd",
            title: null,
            width: 60,
            textAlignment: "right",
            render: ({ timestampEnd, timestampStart }) => {
              return (
                <Tooltip
                  label={`${(timestampEnd - timestampStart).toFixed(8)} ms`}
                >
                  <Text size={"xs"}>
                    {(timestampEnd - timestampStart).toFixed(3)}
                  </Text>
                </Tooltip>
              );
            },
          },
          {
            accessor: "actions",
            title: null,
            width: 50,
            textAlignment: "right",
            render: onClickRender,
          },
        ]}
        rowExpansion={{
          content: ExpandedRow,
          allowMultiple: true,
          expanded: {
            recordIds: expandedRecordIds,
            onRecordIdsChange: setExpandedRecordIds,
          },
        }}
      />
    </AppShell>
  );
};

export default LogList;
