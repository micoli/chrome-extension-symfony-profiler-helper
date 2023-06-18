import React, { Fragment } from "react";
import { useState } from "react";
import "@pages/popup/Popup.css";
import "react-json-pretty/themes/monikai.css";
import { Switch, Table } from "@mantine/core";
import HttpHeader = chrome.webRequest.HttpHeader;
import JsonDisplay from "@pages/shared/LogList/JsonDisplay";
import jwtDecode from "jwt-decode";

const decodeHeader = (
  httpHeader: chrome.webRequest.HttpHeader
): string | JSX.Element => {
  if (
    httpHeader.name === "Authorization" &&
    httpHeader.value.startsWith("Bearer")
  ) {
    return (
      <Fragment>
        <br />
        <span style={{ color: "orange" }}>
          {JSON.stringify(
            jwtDecode(httpHeader.value.replace("Bearer", "")),
            null,
            4
          )}
        </span>
      </Fragment>
    );
  }
  return "";
};

const RequestHeaders = ({ headers }: { headers: HttpHeader[] }) => {
  const [asTable, setAsTable] = useState(true);

  return (
    <Fragment>
      <Switch
        checked={asTable}
        onChange={(event) => setAsTable(event.currentTarget.checked)}
        label={"Table"}
      />
      {asTable ? (
        <Table>
          {headers.map((httpHeader, index) => (
            <tr key={`${httpHeader.name}-${index}`}>
              <td style={{ maxWidth: 120, overflow: "auto" }}>
                {httpHeader.name}
              </td>
              <td style={{ maxWidth: 460, overflow: "auto" }}>
                {httpHeader.value}
                {decodeHeader(httpHeader)}
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <JsonDisplay data={headers} />
      )}
    </Fragment>
  );
};
export default RequestHeaders;
