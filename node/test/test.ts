import { assert } from 'chai';
import { tiuqottigeloot_vol24_Tracks, providers } from './test-data';
import * as mm from 'music-metadata';

import { HttpTokenizer } from '../../lib/http-tokenizer';

describe('streaming-http-token-reader with Node.js', function() {

  this.timeout(10 * 1000);

  const config = {
    avoidHeadRequests: false
  };

  it('Test #1', async () => {
    const track = tiuqottigeloot_vol24_Tracks[0];
    const audioTrackUrl = providers.netlify.getUrl(track.url);

    const streamingHttpTokenReader = HttpTokenizer.fromUrl(audioTrackUrl, config);
    await streamingHttpTokenReader.init();
    const metadata = await mm.parseFromTokenizer(streamingHttpTokenReader, streamingHttpTokenReader.contentType, {});
    assert.equal(metadata.format.container, 'MPEG', 'metadata.format.container');
  });

});
