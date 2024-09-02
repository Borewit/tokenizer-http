import initDebug from 'debug';

import type { IHeadRequestInfo, IRangeRequestResponse, IRangeRequestClient } from '@tokenizer/range';
import { ResponseInfo } from './response-info.js'; // Add 'fetch' API for node.js

const debug = initDebug('streaming-http-token-reader:http-client');

/**
 * Configuration options for the HTTP client.
 */
export type HttpClientConfig = {
  resolveUrl?: boolean
};

const DEFAULT_CONFIG = {
  resolveUrl: false
};

/**
 * Simple HTTP-client, which works both in node.js and browser
 */
export class HttpClient implements IRangeRequestClient {

  public resolvedUrl?: string;
  private readonly config: HttpClientConfig;

  constructor(private url: string, config?: HttpClientConfig) {
    this.config = DEFAULT_CONFIG;
    Object.assign(this.config, config);
  }

  public async getHeadInfo(): Promise<IHeadRequestInfo> {
    const response = new ResponseInfo(await fetch(this.url, {method: 'HEAD'}));
    if (this.config.resolveUrl) this.resolvedUrl = response.response.url;
    return response.toRangeRequestResponse();
  }

  public async getResponse(method: string, range?: [number, number]): Promise<IRangeRequestResponse> {
    if (range) {
      debug(`_getResponse ${method} ${range[0]}..${range[1]}`);
    } else {
      debug(`_getResponse ${method} (range not provided)`);
    }

    const headers = new Headers();

    const response = new ResponseInfo(await fetch(this.resolvedUrl || this.url, {method, headers}));
    if (response.response.ok) {
      if (this.config.resolveUrl) this.resolvedUrl = response.response.url;
      return response.toRangeRequestResponse();
    }
      throw new Error(`Unexpected HTTP response status=${response.response.status}`);
  }

}
