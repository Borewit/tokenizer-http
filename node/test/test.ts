import { assert } from 'chai';
import * as mm from 'music-metadata';
import { makeTokenizer } from '../../lib';
import { netBlocVol24, providers } from '@music-metadata/test-audio';

describe('streaming-http-token-reader with Node.js', function() {

  this.timeout(10 * 1000);

  const config = {
    avoidHeadRequests: false
  };

  it('Download audio file', async () => {
    const audioTrackUrl = providers.netlify.getUrl(netBlocVol24.folder, netBlocVol24.tracks[0]);

    const tokenizer = await makeTokenizer(audioTrackUrl, config);
    const metadata = await mm.parseFromTokenizer(tokenizer);
    assert.equal(metadata.format.container, 'MPEG', 'metadata.format.container');
  });

});
