// localStorage.debug = '*';

import { parseFromTokenizer, type IOptions, type IAudioMetadata } from 'music-metadata';

import type { IRangeRequestConfig } from '@tokenizer/range';
import { makeTokenizer } from '../lib/index.js';
import { type IProvider, netBlocVol24, providers } from '@music-metadata/test-audio';
import { assert, expect } from 'chai';

interface IParserTest {
  methodDescription: string;
  enable?: boolean;

  parseUrl(audioTrackUrl: string, config?: IRangeRequestConfig, options?: IOptions): Promise<IAudioMetadata>;
}

interface IFetchProfile {
  config: IRangeRequestConfig;
  provider: IProvider;
}

const parsers: IParserTest[] = [
  {
    methodDescription: 'StreamingHttpTokenReader => parseTokenizer()',
    parseUrl: async (audioTrackUrl, config, options) => {
      const tokenizer = await makeTokenizer(audioTrackUrl, config);
      return parseFromTokenizer(tokenizer, options);
    },
    enable: true
  }
];

describe('streaming-http-token-reader', function() {

  this.timeout(20000);

  describe('Parse WebAmp tracks', () => {

    const profiles: IFetchProfile[] = [
      {
        provider: providers.netlify,
        config:
          {
            avoidHeadRequests: false
          }
      }
    ];

    profiles.forEach(profile => {

      describe(`provider=${profile.provider.name} avoid-HEAD-request=${profile.config.avoidHeadRequests}`, () => {

        parsers.forEach(parser => {
          if (!parser.enable) {
            return;
          }
          describe(`Parser: ${parser.methodDescription}`, () => {

            netBlocVol24.tracks.forEach(track => {
              const url = profile.provider.getUrl(netBlocVol24.folder, track);
              it(`track ${track.metadata.artist} - ${track.metadata.title} from url: ${url}`, () => {
                return parser.parseUrl(url, profile.config).then(metadata => {
                  expect(metadata.common.artist).eq(track.metadata.artist);
                  expect(metadata.common.title).eq(track.metadata.title);
                });
              });
            });
          });

        });

      });
    });
  });

  it.skip('Big Buck Bunny', async () => {
    const url = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4';
    const tokenizer = await makeTokenizer(url);
    const {common, format} = await parseFromTokenizer(tokenizer);
    assert.strictEqual(format.container, 'M4A/mp42/isom');
    assert.strictEqual(common.title, 'Big Buck Bunny');
  });

});

