import { assert } from 'chai';
import { tiuqottigeloot_vol24_Tracks, providers } from './test-data';
import * as mm from 'music-metadata';

import { makeTokenizer } from '../../lib';

describe('streaming-http-token-reader with Node.js', function() {

  this.timeout(10 * 1000);

  const config = {
    avoidHeadRequests: false
  };

  it('Test #1', async () => {
    const track = tiuqottigeloot_vol24_Tracks[0];
    const audioTrackUrl = providers.netlify.getUrl(track.url);

    const tokenizer = await makeTokenizer(audioTrackUrl, config);
    const metadata = await mm.parseFromTokenizer(tokenizer);
    assert.equal(metadata.format.container, 'MPEG', 'metadata.format.container');
  });

});
