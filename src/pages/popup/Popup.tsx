import React, {Fragment, useMemo} from "react";
import {useEffect, useState} from "react";
import "@pages/popup/Popup.css";
import {AppShell, Button} from "@mantine/core";
import {MantineReactTable, MRT_ColumnDef} from "mantine-react-table";
import {RequestLog} from "../shared"


const Popup = () => {
    const [logs, setLogs] = useState([]);
    const columns = useMemo<MRT_ColumnDef<RequestLog>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'requestId',
                header: 'RequestId',
                size: 5,
            },
            {
                accessorKey: 'method',
                header: 'Method',
                size: 5,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 5,
            },
            {
                accessorKey: 'xDebugUrl',
                header: 'xDebugUrl',
            },
            {
                accessorKey: 'url',
                header: 'URL',
                Cell: ({cell}) => (
                    <a target='_blank' href={cell.row.getValue('xDebugUrl')}>
                        {cell.getValue<string>()}
                    </a>
                )
            },
            {
                accessorKey: 'timestampEnd',
                header: 'Time',
                Cell: ({cell}) => (
                    Math.round(cell.row.original.timestampEnd-cell.row.original.timestampStart)
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
        ],
        [],
    );

    const onMessageHandler = (message, port) => {
        console.log(message)
        if (message.type === 'newLog') {
            setLogs(previousLogs=>[message.entry, ...previousLogs])
        }
    }

    useEffect(() => {
        //chrome.runtime.sendMessage({type: 'logs'}).then(setLogs)
        console.log('start')
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs)=>{
            // Open up connection
            const port = chrome.tabs.connect(tabs[0].id, {
                name: "symfony-profiler"
            });
            port.onMessage.addListener(onMessageHandler)
            refresh();

        })

        return () => {
            console.log('popup end')
            //chrome.runtime.onMessage.removeListener(onMessageHandler)
        }
    }, [])

    const refresh = () => {
        console.log('popup refresh 1')
        chrome.runtime.sendMessage({type: 'logs'}).then(setLogs)
        console.log('popup refresh 2')
    }
    const clearLogs = async () => {
        setLogs([])
        console.log('popup clear1')
        chrome.runtime.sendMessage({type: 'clear'}).then(console.log)
        console.log('popup clear2')
    }
    //return (<div>{JSON.stringify(logs)}</div>);
    return (
        <AppShell padding="xs">
            <MantineReactTable
                columns={columns}
                data={logs}
                rowCount={10}
                state={{
                    density: 'xs',
                    isFullScreen: true
                }}
                initialState={{columnVisibility: {xDebugUrl: false}}}
                enableColumnActions={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enablePagination={true}
                enableSorting={true}
                enableBottomToolbar={true}
                enableTopToolbar={true}
                mantineTableProps={{
                    highlightOnHover: false,
                    withColumnBorders: false,
                }}
                renderTopToolbarCustomActions={({ table }) => (
                    <Fragment>
                        <Button
                            variant="contained"
                            color="lightblue"
                            onClick={refresh}
                        >
                            refresh
                        </Button>
                        <Button
                            variant="contained"
                            color="lightblue"
                            onClick={clearLogs}
                        >
                            clear
                        </Button>
                        <a target="_blank" href={"chrome://inspect/#service-workers"}>service-workers</a>
                    </Fragment>
                )}
            />
        </AppShell>

    );
};

export default Popup;
