import { HttpClient } from './http-client';
import * as rangeTokenizer from '@tokenizer/range';
import { ITokenizer } from 'strtok3/lib/core';

/**
 * Create and initialize the HTTP tokenizer
 * @param url URL to resource to stream with tokenizer
 * @param config Configuration options
 * @return Tokenizer
 */
export function makeTokenizer(url: string, config?: rangeTokenizer.IRangeRequestConfig): Promise<ITokenizer> {
  const httpClient = new HttpClient(url);
  return rangeTokenizer.tokenizer(httpClient, config);
}
