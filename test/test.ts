// localStorage.debug = '*';

import * as mm from 'music-metadata-browser';

import { IRangeRequestConfig } from '@tokenizer/range';
import { makeTokenizer } from '../lib';
import { IProvider, netBlocVol24, providers } from '@music-metadata/test-audio';

interface IParserTest {
  methodDescription: string;
  enable?: boolean;

  parseUrl(audioTrackUrl: string, config?: IRangeRequestConfig, options?: mm.IOptions): Promise<mm.IAudioMetadata>;
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
      return mm.parseFromTokenizer(tokenizer, options);
    },
    enable: true
  }
];

describe('streaming-http-token-reader', () => {

  describe('Parse WebAmp tracks', () => {

    const profiles: IFetchProfile[] = [
      {
        provider: providers.netlify,
        config:
          {
            avoidHeadRequests: false
          }
      },
      {
        provider: providers.netlify,
        config:
          {
            avoidHeadRequests: true
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
                  expect(metadata.common.artist).toEqual(track.metadata.artist);
                  expect(metadata.common.title).toEqual(track.metadata.title);
                });
              });
            });
          });

        });

      });
    });
  });

});
