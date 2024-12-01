import { type IContentRangeType, type IRangeRequestResponse, parseContentRange as rangeParseContentRange } from '@tokenizer/range';

export class ResponseInfo {
  constructor(public response: Response) {
  }

  private getContentLength(): number | undefined {
    const contentLength = this.response.headers.get('Content-Length');
    return contentLength ? Number.parseInt(contentLength, 10) : undefined;
  }

  public getAcceptRangesHeaderValue(): string | null {
    return this.response.headers.get('Accept-Ranges');
  }

  public getContentType(): string | null {
    return this.response.headers.get('Content-Type');
  }

  public acceptRanges() {
    const value = this.getAcceptRangesHeaderValue();
    return value !== null && value.trim().toLowerCase() === 'bytes';
  }

  private getContentRange(): IContentRangeType | undefined {
    const contentRange = this.response.headers.get('Content-Range');
    if (!contentRange) {
      return;
    }
    return rangeParseContentRange(contentRange);
  }

  public toRangeRequestResponse(): IRangeRequestResponse {
    const contentRange = this.getContentRange();
    const size = contentRange ? contentRange.instanceLength : this.getContentLength();
    if (typeof size !== 'number') {
      throw new Error('Could not determine file-size from HTTP response');
    }
    return {
      url: this.response.url,
      size,
      mimeType: this.getContentType() ?? undefined,
      acceptPartialRequests: this.acceptRanges(),
      contentRange,
      arrayBuffer: () => this.response.arrayBuffer().then(res => new Uint8Array(res))
    };
  }
}