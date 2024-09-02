import { HttpClient, type HttpClientConfig } from './http-client.js';
import * as rangeTokenizer from '@tokenizer/range';
import type { ITokenizer } from 'strtok3';

export { HttpClient, HttpClientConfig } from './http-client.js';

/**
 * Create and initialize the HTTP tokenizer
 * @param url URL to resource to stream with tokenizer
 * @param tokenizerConfig Tokenizer configuration options
 * @param httpClientConfig HTTP client configuration options
 * @return Tokenizer
 */
export function makeTokenizer(
  url: string,
  tokenizerConfig?: rangeTokenizer.IRangeRequestConfig,
  httpClientConfig?: HttpClientConfig
): Promise<ITokenizer> {
  const httpClient = new HttpClient(url, httpClientConfig);
  return rangeTokenizer.tokenizer(httpClient, tokenizerConfig);
}
