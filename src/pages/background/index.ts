import { RequestLog, XDebugData } from "../shared";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import HttpHeader = chrome.webRequest.HttpHeader;
import { sendMessage, onMessage } from "../shared/messaging";
import BlockingResponse = chrome.webRequest.BlockingResponse;

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

const logs: Map<string, RequestLog> = new Map<string, RequestLog>();
const bufferRequests: Map<string, RequestLog> = new Map<string, RequestLog>();

const getDebugToken = (headers: HttpHeader[]): XDebugData | null => {
  const result = { link: null, token: null };
  headers.forEach((header) => {
    if (header.name.toLowerCase() === "x-debug-token-link") {
      result.link = header.value;
    }
    if (header.name.toLowerCase() === "x-debug-token") {
      result.token = header.value;
    }
  });
  return result.link === null || result.token === null ? null : result;
};

const updateBadgeIcon = () => {
  chrome.action.setBadgeText({ text: `${logs.size}` });
};

const onWebRequestBeforeRequest = (details) => {
  bufferRequests.set(
    details.requestId,
    new RequestLog(
      details.requestId,
      details.method,
      details.url,
      details.timeStamp,
      details.requestBody
    )
  );
};

const onWebRequestBeforeSendHeaders = (details): void | BlockingResponse => {
  try {
    if (!bufferRequests.has(details.requestId)) {
      return;
    }
    bufferRequests
      .get(details.requestId)
      .setRequestHeaders(details.requestHeaders);
  } catch (error) {
    console.log(error);
  }
};

const onWebRequestCompleted = async (details) => {
  try {
    console.log("worker onCompleted");
    if (!bufferRequests.has(details.requestId)) {
      return;
    }

    const xDebugData = getDebugToken(details.responseHeaders);
    if (xDebugData === null) {
      bufferRequests.delete(details.requestId);
      return;
    }
    console.log(details);
    const requestLog = bufferRequests.get(details.requestId);
    requestLog.onComplete(
      details.statusCode,
      details.responseText,
      details.responseHeaders,
      details.timeStamp,
      xDebugData
    );
    console.log("worker onCompleted sent");
    bufferRequests.delete(details.requestId);
    logs.set(details.requestId, requestLog);
    updateBadgeIcon();
    sendMessage("newRequest", requestLog).catch(() => {
      console.log("Popup not available now");
    });
  } catch (error) {
    console.log(error);
  }
};

const initBackground = () => {
  chrome.webRequest.onBeforeRequest.addListener(
    onWebRequestBeforeRequest,
    {
      urls: ["<all_urls>"],
      types: ["xmlhttprequest", "main_frame"],
    },
    ["extraHeaders", "requestBody"]
  );
  chrome.webRequest.onBeforeSendHeaders.addListener(
    onWebRequestBeforeSendHeaders,
    {
      urls: ["<all_urls>"],
      types: ["xmlhttprequest", "main_frame"],
    },
    ["requestHeaders"]
  );
  chrome.webRequest.onCompleted.addListener(
    onWebRequestCompleted,
    {
      urls: ["<all_urls>"],
      types: ["xmlhttprequest", "main_frame"],
    },
    ["responseHeaders"]
  );

  onMessage("getLogs", (): RequestLog[] => {
    return Array.from(logs, ([, value]) => value);
  });

  onMessage("clear", () => {
    console.log("background clear");
    logs.clear();
    updateBadgeIcon();
  });

  console.log("background loaded");
};

initBackground();
