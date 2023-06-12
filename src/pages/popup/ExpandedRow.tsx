import React, { Fragment } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import { Tabs } from "@mantine/core";
import { RequestLog } from "../shared";
import { Text } from "@mantine/core";
import {
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import RequestHeaders from "@pages/popup/RequestHeaders";
import JsonDisplay from "@pages/popup/JsonDisplay";
import RequestDetail from "@pages/popup/RequestDetail";

const ExpandedRow = ({ record }: { record: RequestLog }) => {
  return (
    <Tabs defaultValue="request" keepMounted={false}>
      <Tabs.List grow position="apart">
        <Tabs.Tab value="request" icon={<IconPhoto size="0.8rem" />}>
          Request
        </Tabs.Tab>
        <Tabs.Tab value="body" icon={<IconMessageCircle size="0.8rem" />}>
          Body
        </Tabs.Tab>
        <Tabs.Tab value="requestHeaders" icon={<IconSettings size="0.8rem" />}>
          Request Hdrs
        </Tabs.Tab>
        <Tabs.Tab value="responseHeaders" icon={<IconSettings size="0.8rem" />}>
          Response Hdrs
        </Tabs.Tab>
        {/* <Tabs.Tab value="response" icon={<IconSettings size="0.8rem" />}>
          Response
        </Tabs.Tab>*/}
      </Tabs.List>

      <Tabs.Panel value="request" pt="xs">
        <RequestDetail record={record} />
      </Tabs.Panel>
      <Tabs.Panel value="body" pt="xs">
        {record.body.formData && (
          <Fragment>
            <Text>Form Data</Text>
            <JsonDisplay data={record.body.formData} />
          </Fragment>
        )}
        {record.body.raw && (
          <Fragment>
            <Text>Raw</Text>
            <JsonDisplay data={record.body.raw} />
          </Fragment>
        )}
        {record.body.formData === null && record.body.raw === null && (
          <Fragment>No Body</Fragment>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="requestHeaders" pt="xs">
        <RequestHeaders headers={record.requestHeaders} />
      </Tabs.Panel>
      <Tabs.Panel value="response" pt="xs">
        Response
      </Tabs.Panel>
      <Tabs.Panel value="responseHeaders" pt="xs">
        <RequestHeaders headers={record.responseHeaders} />
      </Tabs.Panel>
    </Tabs>
  );
};
export default ExpandedRow;
