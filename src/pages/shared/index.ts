export class RequestLog {
    requestId: string;
    method: string;
    url: string;
    timestampStart: number;
    body: any;
    status: number = null;
    responseHeaders: any;
    timestampEnd: number;
    xDebugUrl: string;

    constructor(requestId, method, url, timestampStart, body) {
        this.requestId = requestId;
        this.method = method;
        this.url = url;
        this.timestampStart = timestampStart;
        this.body = body;
    }

    onComplete(status, responseHeaders, timestampEnd, xDebugUrl) {
        this.status = status;
        this.responseHeaders = responseHeaders;
        this.timestampEnd = timestampEnd;
        this.xDebugUrl = xDebugUrl;

    }
}
