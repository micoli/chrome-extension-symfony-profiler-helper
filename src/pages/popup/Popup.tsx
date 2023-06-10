import React, {useMemo} from "react";
import {useEffect, useState} from "react";
import "@pages/popup/Popup.css";
import {AppShell, Button} from "@mantine/core";
import {MantineReactTable, MRT_ColumnDef} from "mantine-react-table";
import {xDebugLog} from "../shared"


const Popup = () => {
  const [logs,setLogs] = useState([]);
    const columns = useMemo<MRT_ColumnDef<xDebugLog>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'method',
                header: 'Method',
                size:5,
            },
            {
                accessorKey: 'xDebugUrl',
                header: 'xDebugUrl',
            },
            {
                accessorKey: 'url',
                header: 'URL',
                Cell: ({ cell }) => (
                    <a target='_blank' href={cell.row.getValue('xDebugUrl')}>
                        {cell.getValue<string>()}
                    </a>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
        ],
        [],
    );
  useEffect(()=>{
    chrome.runtime.sendMessage({ type:'logs' }).then(setLogs)
  })
  const refresh = async ()=>{
    setLogs(await chrome.runtime.sendMessage({ type:'logs' }))
  }
  return (
      <AppShell padding="xs" >
        <MantineReactTable
            columns={columns}
            data={logs}
            rowCount={10}
            state={{
                density: 'xs',
                isFullScreen:true
            }}
            initialState={{ columnVisibility: { xDebugUrl: false } }}
            enableColumnActions={false}
            enableColumnFilters={true}
            enablePagination={true}
            enableSorting={true}
            enableBottomToolbar={true}
            enableTopToolbar={true}
            mantineTableProps={{
              highlightOnHover: false,
              withColumnBorders: false,
            }}
        />
      </AppShell>

  );
};

export default Popup;
