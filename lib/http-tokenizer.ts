import { IRangeRequestClient, IRangeRequestConfig, RangeRequestTokenizer } from '@tokenizer/range';
import { HttpClient } from './http-client';

export { IRangeRequestConfig } from '@tokenizer/range';

export class HttpTokenizer extends RangeRequestTokenizer {

  constructor(httpClient: IRangeRequestClient, config?: IRangeRequestConfig) {
    super(httpClient, config);
  }
}

export function fromUrl(url: string, config?: IRangeRequestConfig): HttpTokenizer {
  return new HttpTokenizer(new HttpClient(url), config);
}
