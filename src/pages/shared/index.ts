import HttpHeader = chrome.webRequest.HttpHeader;

export interface XDebugData {
  link: string;
  token: string;
  metadata: { label: string; value: string }[];
}

export interface RequestBody {
  formData: never | null;
  raw: never | null;
}

export type HttpMethod =
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

export interface GenericRequestLog {
  requestId: string;
  method: HttpMethod;
  url: string;
  timestampStart: number;
  body: RequestBody;
  response: any;
  status: number;
  requestHeaders: HttpHeader[];
  responseHeaders: HttpHeader[];
  timestampEnd: number;
  xDebugData: XDebugData;
}

export interface SearchableRequestLog extends GenericRequestLog {
  searchableText: string;
}

export class RequestLog implements GenericRequestLog {
  requestId: string;
  method: HttpMethod;
  url: string;
  timestampStart: number;
  body: RequestBody;
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
