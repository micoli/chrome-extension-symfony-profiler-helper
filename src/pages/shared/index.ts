import HttpHeader = chrome.webRequest.HttpHeader;

export interface XDebugData {
  link: string;
  token: string;
}

export class RequestLog {
  requestId: string;
  method:
    | "OPTIONS"
    | "options"
    | "GET"
    | "get"
    | "POST"
    | "post"
    | "PUT"
    | "put"
    | "PATCH"
    | "patch"
    | "DELETE"
    | "delete";
  url: string;
  timestampStart: number;
  body: any;
  response: any;
  status: number = null;
  requestHeaders: HttpHeader[];
  responseHeaders: HttpHeader[];
  timestampEnd: number;
  xDebugData: XDebugData;

  constructor(requestId, method, url, timestampStart, body) {
    this.requestId = requestId;
    this.method = method;
    this.url = url;
    this.timestampStart = timestampStart;
    this.body = body;
  }

  setRequestHeaders(requestHeaders) {
    this.requestHeaders = requestHeaders;
  }

  onComplete(status, response, responseHeaders, timestampEnd, xDebugData) {
    this.status = status;
    this.response = response;
    this.responseHeaders = responseHeaders;
    this.timestampEnd = timestampEnd;
    this.xDebugData = xDebugData;
  }
}
