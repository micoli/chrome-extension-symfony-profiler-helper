import {RequestLog} from "../shared"
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import HttpHeader = chrome.webRequest.HttpHeader;

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

const logs: Map<string, RequestLog> = new Map<string, RequestLog>();
const bufferRequests: Map<string, RequestLog> = new Map<string, RequestLog>();

const filterDebugToken = (headers: HttpHeader[]) => {
    return headers.filter((header: HttpHeader) => header.name === 'X-Debug-Token-Link');
}

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        try {
            if (!bufferRequests.has(details.requestId)) {
                return;
            }

            const filteredHeaders = filterDebugToken(details.responseHeaders);
            if (filteredHeaders.length === 0) {
                //bufferRequests.delete(details.requestId);
                return;
            }
            const requestLog = bufferRequests.get(details.requestId);
            requestLog.onComplete(
                details.statusCode,
                details.responseHeaders,
                details.timeStamp,
                filteredHeaders.length > 0 ? filteredHeaders[0].value : '--'
            )
            await chrome.runtime.sendMessage({type: 'newLog', entry: requestLog});
            console.log("worker onCompleted 2");
            chrome.action.setBadgeText({text: `${logs.size}`});
            bufferRequests.delete(details.requestId);
            logs.set(details.requestId, requestLog);
        } catch (error) {
            console.log(error);
        }
    },
    {
        urls: ["<all_urls>"],
        types: [
            'xmlhttprequest',
            'main_frame'
        ]
    },
    ['responseHeaders']
)
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        bufferRequests.set(details.requestId, new RequestLog(
            details.requestId,
            details.method,
            details.url,
            details.timeStamp,
            details.requestBody
        ))
    },
    {
        urls: ["<all_urls>"],
        types: [
            'xmlhttprequest',
            'main_frame'
        ]
    },
    ['extraHeaders', 'requestBody']
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.type === 'logs') {
            sendResponse(Array.from(logs, ([name, value]) => value));
            return true;
        }
        if (message.type === 'clear') {
            logs.clear();
            chrome.action.setBadgeText({text: `${logs.size}`});
            return true;
        }
        return false;
    } catch (error) {
        console.log(error)
    }
});
console.log("background loaded");
