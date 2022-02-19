import {TrackedTextFeature} from 'react-native-camera';
import {PoliticianScanner} from './scanner';
import {makeToken} from './tokenizer';
import {createContext} from 'react';
import {Politician} from './data';
import {
  CachesDirectoryPath,
  downloadFile,
  exists,
  Headers,
  readFile,
  stat,
} from 'react-native-fs';
import {decompress} from 'compress-json';
import {DBManager} from './db';

const cacheDatabaseFile = `${CachesDirectoryPath}/data.json`;

declare global {
  interface Date {
    toGMTString(): string;
  }
}

export class FaceTheFactsData {
  public static async load(
    onData: (data: FaceTheFactsData) => void,
    onNoData: () => void,
  ): Promise<void> {
    const headers: Headers = {};
    let fileAlreadyExists = false;

    if (await exists(cacheDatabaseFile)) {
      onData(await this.loadDataFromCache());
      fileAlreadyExists = true;
      const {mtime} = await stat(cacheDatabaseFile);
      const modifiedSince = new Date(mtime);
      headers['If-Modified-Since'] = modifiedSince.toGMTString();
    }

    try {
      const {statusCode} = await downloadFile({
        fromUrl: 'https://database.facethefacts-api.de/data.json',
        toFile: cacheDatabaseFile,
        headers,
      }).promise;

      if (statusCode === 200) {
        onData(await this.loadDataFromCache());
        return;
      }
    } catch (e) {
      // ignore
    }

    if (!fileAlreadyExists) {
      onNoData();
    }
  }

  private static async loadDataFromCache(): Promise<FaceTheFactsData> {
    const json = await readFile(cacheDatabaseFile);
    const compressedData = JSON.parse(json);
    const data = decompress(compressedData);

    return new FaceTheFactsData(data);
  }
  private readonly politicianDb: Map<string, Politician>;
  private readonly scanTokens: Map<string, string[][]>;
  private readonly scanTokenMap: Map<string, Set<string>>;

  public readonly dbManager: DBManager;

  public constructor(dataset: string[]) {
    // @ts-ignore
    this.politicians = new Map(dataset);
    this.scanTokens = new Map();
    this.scanTokenMap = new Map();
    this.politicianDb = new Map();

    dataset.forEach(item => {
      const key = item[0];
      const strId = item[1];
      const boundarySplit = key.split(/\b/).filter(value => value.match(/\b/));
      const spaceSplit = key.split(/\s+/);
      const scanTokens: string[][] = [];
      if (boundarySplit.length) {
        scanTokens.push(boundarySplit.map(makeToken));
      }

      if (spaceSplit.length !== boundarySplit.length && spaceSplit.length) {
        scanTokens.push(spaceSplit.map(makeToken));
      }

      this.scanTokens.set(strId, scanTokens);

      scanTokens.forEach(tokenBundle =>
        tokenBundle.forEach(token => {
          if (!this.scanTokenMap.get(token)?.add(strId)) {
            this.scanTokenMap.set(token, new Set([strId]));
          }
        }),
      );
    });
    this.dbManager = new DBManager(this.politicianDb);
  }

  public scanPolitician(features: TrackedTextFeature[]): number | null {
    return new PoliticianScanner(this).analyze(features);
  }

  public lookupScanToken(token: string): Set<string> | null {
    return this.scanTokenMap.get(token) ?? null;
  }

  public lookupScanTokens(politicianId: string): string[][] | null {
    return this.scanTokens.get(politicianId) ?? null;
  }
}

export const DataContext = createContext<FaceTheFactsData>(null as any);
