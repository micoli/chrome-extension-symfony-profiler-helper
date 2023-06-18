import { RequestLog, XDebugData } from "../shared";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import HttpHeader = chrome.webRequest.HttpHeader;
import { sendMessage, onMessage } from "../shared/messaging";
import BlockingResponse = chrome.webRequest.BlockingResponse;
import ResourceType = chrome.webRequest.ResourceType;
import {
  storageGetItem,
  storageKeys,
  storageSetItem,
} from "@pages/shared/storage";

reloadOnUpdate("pages/background");

const logs: Map<string, RequestLog> = new Map<string, RequestLog>();
const bufferRequests: Map<string, RequestLog> = new Map<string, RequestLog>();

const state = {
  listenersStarted: true,
  xDebugTokenLinkHeader: "",
  xDebugTokenHeader: "",
};

const getDebugToken = (headers: HttpHeader[]): XDebugData | null => {
  const result = { link: null, token: null };
  headers.forEach((header) => {
    switch (header.name.toLowerCase()) {
      case state.xDebugTokenLinkHeader:
        result.link = header.value;
        break;
      case state.xDebugTokenHeader:
        result.token = header.value;
        break;
    }
  });
  return result.link === null || result.token === null ? null : result;
};

const updateBadgeIcon = () => {
  const color = state.listenersStarted ? "color" : "grey";
  chrome.action.setIcon({
    path: {
      "48": `/symfony-${color}-48.png`,
      "128": `/symfony-${color}-128.png`,
    },
  });
  chrome.action.setBadgeText({
    text: `${state.listenersStarted ? logs.size : "||"}`,
  });
};

const decodeRawBody = (raw): string =>
  decodeURIComponent(
    String.fromCharCode.apply(null, new Uint8Array(raw[0].bytes))
  );

const onWebRequestBeforeRequest = (details) => {
  const body = {
    formData: details.requestBody?.formData ?? null,
    raw: details.requestBody?.raw
      ? decodeRawBody(details.requestBody.raw)
      : null,
  };

  // console.log("body", body);
  bufferRequests.set(
    details.requestId,
    new RequestLog(
      details.requestId,
      details.method,
      details.url,
      details.timeStamp / 1000,
      body
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

const onWebRequestCompleted = async (
  details: chrome.webRequest.WebResponseCacheDetails
) => {
  try {
    //console.log("worker onCompleted");
    if (!bufferRequests.has(details.requestId)) {
      return;
    }

    const xDebugData = getDebugToken(details.responseHeaders);
    if (xDebugData === null) {
      bufferRequests.delete(details.requestId);
      return;
    }
    //console.log(details);
    const requestLog = bufferRequests.get(details.requestId);
    requestLog.onComplete(
      details.statusCode,
      "",
      details.responseHeaders,
      details.timeStamp / 1000,
      xDebugData
    );
    //console.log("worker onCompleted sent");
    bufferRequests.delete(details.requestId);
    logs.set(details.requestId, requestLog);
    updateBadgeIcon();
    sendMessage("newRequestEvent", requestLog).catch(() => {
      //console.log("Popup not available now");
    });
  } catch (error) {
    console.log(error);
  }
};

const activateListeners = (activate: boolean) => {
  state.listenersStarted = activate;
  updateBadgeIcon();
  if (!activate) {
    chrome.webRequest.onBeforeRequest.removeListener(onWebRequestBeforeRequest);
    chrome.webRequest.onBeforeSendHeaders.removeListener(
      onWebRequestBeforeSendHeaders
    );
    chrome.webRequest.onCompleted.removeListener(onWebRequestCompleted);
    return;
  }

  const filter: { urls: string[]; types: ResourceType[] } = {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest", "main_frame"],
  };
  chrome.webRequest.onBeforeRequest.addListener(
    onWebRequestBeforeRequest,
    filter,
    ["extraHeaders", "requestBody"]
  );
  chrome.webRequest.onBeforeSendHeaders.addListener(
    onWebRequestBeforeSendHeaders,
    filter,
    ["requestHeaders"]
  );
  chrome.webRequest.onCompleted.addListener(onWebRequestCompleted, filter, [
    "responseHeaders",
  ]);
};

const loadOptionsValues = () => {
  Promise.all([
    storageGetItem(storageKeys.xDebugToken),
    storageGetItem(storageKeys.xDebugTokenLink),
  ]).then(([xDebugToken, xDebugTokenLink]: [string, string]) => {
    state.xDebugTokenHeader = xDebugToken;
    state.xDebugTokenLinkHeader = xDebugTokenLink;
    activateListeners(true);
  });
};

const initBackground = () => {
  loadOptionsValues();
  onMessage("optionsSetEvent", (): void => {
    loadOptionsValues();
  });
  onMessage("getLogs", (): RequestLog[] => {
    return Array.from(logs, ([, value]) => value);
  });

  onMessage("getListenersStatus", (): boolean => {
    return state.listenersStarted;
  });

  onMessage("getDefaultProfilerTab", async (): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return storageGetItem(storageKeys.profilerTab);
  });

  onMessage("setDefaultProfilerTab", async (message): Promise<string> => {
    return storageSetItem(storageKeys.profilerTab, message.data.tab).then(
      () => message.data.tab
    );
  });

  onMessage("clear", () => {
    logs.clear();
    updateBadgeIcon();
  });

  onMessage("startListeners", () => {
    activateListeners(true);
  });

  onMessage("stopListeners", () => {
    activateListeners(false);
  });

  console.log("Background loaded");
};

initBackground();
