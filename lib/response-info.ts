import { type IContentRangeType, type IRangeRequestResponse, parseContentRange as rangeParseContentRange } from '@tokenizer/range';

export class ResponseInfo {
  constructor(public response: Response) {
  }

  private getContentLength(): number | undefined {
    const contentLength = this.response.headers.get('Content-Length');
    return contentLength ? parseInt(contentLength, 10) : undefined;
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
    return {
      url: this.response.url,
      size: contentRange ? contentRange.instanceLength : this.getContentLength(),
      mimeType: this.getContentType() ?? undefined,
      acceptPartialRequests: this.acceptRanges(),
      contentRange,
      arrayBuffer: () => this.response.arrayBuffer().then(res => new Uint8Array(res))
    };
  }
}