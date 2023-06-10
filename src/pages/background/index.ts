import {xDebugLog} from "../shared"
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import HttpHeader = chrome.webRequest.HttpHeader;

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

const logs: xDebugLog[] = [];

const filterDebugToken = (headers: HttpHeader[]) => {
    return headers.filter((header: HttpHeader) => header.name === 'X-Debug-Token-Link');
}

// chrome.webRequest.onCompleted.addListener(
//     (details) => {
//         const filteredHeaders = filterDebugToken(details.responseHeaders);
//         if (filteredHeaders.length === 0) {
//             return;
//         }
//         logs.unshift(<xDebugLog>{
//             status: details.statusCode,
//             url: details.url,
//             method: details.method,
//             xDebugUrl: filteredHeaders[0].value,
//         })
//         chrome.action.setBadgeText({text: `${logs.length}`});
//         chrome.runtime.sendMessage({type: 'newLog'});
//     },
//     {
//         urls: ["<all_urls>"],
//         types: [
//             'xmlhttprequest',
//             'main_frame'
//         ]
//     },
//     ['responseHeaders']
// )
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        logs.unshift(<xDebugLog>{
            status: details.requestId,
            url: JSON.stringify(details.requestBody),
            method: details.method,
            xDebugUrl: "ee",
        })
        chrome.action.setBadgeText({text: `${logs.length}`});
        chrome.runtime.sendMessage({type: 'newLog'});
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
    if (message.type === 'logs') {
        sendResponse(logs);
        return true;
    }
    return false;
});
console.log("background loaded");
