export interface IContentRangeType {
  firstBytePosition?: number;
  lastBytePosition?: number;
  instanceLength?: number;
}

export interface IHeadInfo {
  contentLength?: number;
  contentType?: string;
  contentRange?: IContentRangeType;
}

export interface IHttpResponse extends IHeadInfo {
  arrayBuffer: () => Promise<Buffer>;
}

export interface IHttpClient extends IRangeRequestClient {
  resolvedUrl?: string;
}
