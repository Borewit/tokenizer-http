import { IRangeRequestClient, IRangeRequestConfig, RangeRequestTokenizer } from '@tokenizer/range';
import { HttpClient } from './http-client';

export { IRangeRequestConfig } from '@tokenizer/range';

export class HttpTokenizer extends RangeRequestTokenizer {

  public static fromUrl(url: string, config?: IRangeRequestConfig): HttpTokenizer {
    return new HttpTokenizer(new HttpClient(url), config);
  }

  constructor(httpClient: IRangeRequestClient, config?: IRangeRequestConfig) {
    super(httpClient, config);
  }

}
