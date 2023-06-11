import React, { Fragment, useMemo } from "react";
import { useEffect, useState } from "react";
import "@pages/popup/Popup.css";
import { AppShell, Box, Button, MantineTheme } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { RequestLog } from "../shared";
import { sendMessage, onMessage } from "../shared/messaging";
import { CurlGenerator } from "curl-generator";
import { useClipboard } from "@mantine/hooks";
import { IconClipboardCopy, IconEdit } from "@tabler/icons-react";
const httpStatusCorlor = (theme: MantineTheme, statusCode: number) => {
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
const Popup = () => {
  const clipboard = useClipboard({ timeout: 500 });
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const columns = useMemo<MRT_ColumnDef<RequestLog>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "requestId",
        header: null,
        size: 5,
      },
      {
        accessorKey: "method",
        header: null,
        size: 70,
      },
      {
        accessorKey: "status",
        header: null,
        size: 55,
        mantineTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Box
              sx={(theme) => {
                return {
                  backgroundColor: httpStatusCorlor(
                    theme,
                    cell.getValue<number>()
                  ),
                  borderRadius: "4px",
                  color: "#fff",
                  maxWidth: "9ch",
                  padding: "4px",
                };
              }}
            >
              {cell.getValue<number>()}
            </Box>
          );
        },
      },
      {
        accessorKey: "url",
        header: null,
        Cell: ({ cell }) => (
          <a
            target="_blank"
            href={cell.row.original.xDebugData.link}
            rel="noreferrer"
          >
            {cell.getValue<string>()}
          </a>
        ),
      },
      {
        accessorKey: "timestampEnd",
        header: null,
        size: 60,
        mantineTableBodyCellProps: {
          align: "right",
        },
        Cell: ({ cell }) =>
          Math.round(
            cell.row.original.timestampEnd - cell.row.original.timestampStart
          ),
      },
    ],
    []
  );

  useEffect(() => {
    console.log("start");

    onMessage("newRequest", (message) => {
      console.log("entry", message);
      setLogs((previousLogs) => [message.data, ...previousLogs]);
    });

    onMessage("popupClick", (message) => {
      console.log("popupClick", message);
      refresh();
    });
    refresh();
  }, []);

  const refresh = async () => {
    console.log("popup refresh 1");
    const _logs = await sendMessage("getLogs", null);
    console.log("popup refresh 2", _logs);
    setLogs(_logs);
  };

  const clearLogs = async () => {
    console.log("popup clear1");
    await sendMessage("clear", null);
    setLogs([]);
    console.log("popup clear2");
  };

  return (
    <MantineReactTable
      columns={columns}
      data={logs}
      state={{
        density: "xs",
        isFullScreen: true,
        sorting: [
          {
            id: "requestId", //sort by age by default on page load
            desc: true,
          },
        ],
        columnVisibility: { requestId: false },
      }}
      mantineTableProps={{
        highlightOnHover: false,
        withColumnBorders: false,
        sx: {
          tableLayout: "fixed",
          fontWeight: "normal",
          fontSize: "10px",
        },
      }}
      enableExpandAll={false}
      positionExpandColumn={"last"}
      positionActionsColumn={"last"}
      enableColumnActions={false}
      enableColumnFilters={false}
      enableHiding={false}
      enableDensityToggle={false}
      enableFullScreenToggle={false}
      enablePagination={true}
      enableSorting={true}
      enableBottomToolbar={true}
      enableTopToolbar={true}
      enableRowActions
      mantinePaginationProps={{
        showRowsPerPage: false,
      }}
      localization={{ expand: null, actions: null }}
      renderRowActions={({ row }) => (
        <Button
          size={"xs"}
          onClick={() => {
            clipboard.copy(
              CurlGenerator({
                url: `"${row.original.url.replace('"', '\\"')}"`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                method: row.original.method,
                body: row.original.body,
                headers: row.original.requestHeaders.reduce((obj, item) => {
                  return {
                    ...obj,
                    [item.name]: item.value,
                  };
                }, {}),
              })
            );
          }}
        >
          <IconClipboardCopy size="xs" />
        </Button>
      )}
      renderDetailPanel={({ row }) => {
        return (
          <Box
            sx={{
              display: "grid",
              margin: "auto",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <ul>
              <li>
                Url: {row.original.method} {row.original.url}
              </li>
              <li>requestId: {row.original.requestId}</li>
              <li>body: {JSON.stringify(row.original.body)}</li>
              <li>
                RequestHeaders: {JSON.stringify(row.original.requestHeaders)}
              </li>
              <li>
                ResponseHeaders: {JSON.stringify(row.original.responseHeaders)}
              </li>
            </ul>
          </Box>
        );
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Fragment>
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
          {logs.length}
          <a
            target="_blank"
            href={"chrome://inspect/#service-workers"}
            rel="noreferrer"
          >
            service-workers
          </a>
        </Fragment>
      )}
    />
  );
};

export default Popup;
