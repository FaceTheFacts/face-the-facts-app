import {TrackedTextFeature} from 'react-native-camera';
import {PoliticianScanner} from './scanner';
import {makeToken} from './tokenizer';
import {createContext} from 'react';
import {Document} from 'flexsearch';
import {
  Committee,
  Constituency,
  Dataset,
  Election,
  Party,
  Politician,
  Poll,
  PollTopic,
  Position,
} from './data';
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

interface SearchPolitician {
  name: string;
  locations?: string[];
  zipCodes?: string[];
}

const cacheDatabaseFile = `${CachesDirectoryPath}/database.json`;

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
    if (__DEV__) {
      onData(new FaceTheFactsData(require('../../data.json')));
      return;
    }

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
        fromUrl: 'https://database.facethefacts-api.de/database.json',
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

  private readonly politicians: Map<string, Politician>;
  private readonly politiciansArray: Politician[];
  private readonly parties: Map<string, Party>;
  private readonly committees: Map<string, Committee>;
  private readonly constituencies: Map<string, Constituency>;
  public readonly elections: readonly Election[];
  public readonly polls: readonly Poll[];
  public readonly pollTopics: readonly PollTopic[];
  private readonly positions: Map<string, Position>;
  private readonly searchIndex: Document;
  private readonly scanTokens: Map<string, string[][]>;
  private readonly scanTokenMap: Map<string, Set<string>>;

  public readonly dbManager: DBManager;

  public constructor(dataset: Dataset) {
    // @ts-ignore
    this.politicians = new Map(
      dataset.politicians.map(value => [value.id, value]),
    );
    this.parties = new Map(dataset.parties.map(value => [value.id, value]));
    this.committees = new Map(
      dataset.committees.map(value => [value.id, value]),
    );
    this.constituencies = new Map(
      dataset.constituencies.map(value => [value.id, value]),
    );
    this.elections = dataset.elections;
    this.polls = dataset.polls;
    this.pollTopics = dataset.pollTopics;
    this.positions = new Map(
      dataset.positions?.map(value => [value.id, value]),
    );

    this.scanTokens = new Map();
    this.scanTokenMap = new Map();
    this.searchIndex = new Document({
      index: [
        {
          field: 'name',
          tokenize: 'forward',
          charset: 'latin:advanced',
          context: true,
        },
        {
          field: 'locations',
          tokenize: 'forward',
          charset: 'latin:simple',
        },
        {
          field: 'zipCodes',
          charset: false,
        },
      ],
    });
    this.politiciansArray = dataset.politicians;

    dataset.politicians.forEach(({id, name, constituency}, index) => {
      const strId = id.toString();
      const boundarySplit = name.split(/\b/).filter(value => value.match(/\b/));
      const spaceSplit = name.split(/\s+/);
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

      const searchPolitician: SearchPolitician = {name};
      if (constituency) {
        const constituencyData = this.constituencies.get(constituency)!;
        searchPolitician.locations = constituencyData.locations;
        searchPolitician.zipCodes = constituencyData.zipCodes;
      }

      this.searchIndex.add(index, searchPolitician);
    });

    this.dbManager = new DBManager(this.politicians);
  }

  public lookupPolitician(id: string): Politician | null {
    if (__DEV__) {
      if (!this.politicians.has(id)) {
        console.trace('Tried to lookup unknown politician', id);
      }
    }

    return this.politicians.get(id) ?? null;
  }

  public lookupParty(id: string): Party | null {
    if (__DEV__) {
      if (!this.parties.has(id)) {
        console.trace('Tried to lookup unknown party', id);
      }
    }

    return this.parties.get(id) ?? null;
  }

  public lookupCommittee(id: string): Committee | null {
    if (__DEV__) {
      if (!this.committees.has(id)) {
        console.trace('Tried to lookup unknown committee', id);
      }
    }

    return this.committees.get(id) ?? null;
  }

  public lookupConstituencies(id: string): Constituency | null {
    if (__DEV__) {
      if (!this.constituencies.has(id)) {
        console.trace('Tried to lookup unknown constituency', id);
      }
    }

    return this.constituencies.get(id) ?? null;
  }

  public lookupPosition(id: string): Position | null {
    if (__DEV__) {
      if (!this.positions.has(id)) {
        console.trace('Tried to lookup unknown position', id);
      }
    }

    return this.positions.get(id) ?? null;
  }

  public scanPolitician(features: TrackedTextFeature[]): Politician | null {
    return new PoliticianScanner(this).analyze(features);
  }

  public lookupScanToken(token: string): Set<string> | null {
    return this.scanTokenMap.get(token) ?? null;
  }

  public lookupScanTokens(politicianId: string): string[][] | null {
    return this.scanTokens.get(politicianId) ?? null;
  }

  public search(query: string): Promise<Politician[]> {
    return this.searchIndex.searchAsync(query).then(value =>
      value
        .flatMap(result => result.result)
        .filter((value, index, array) => array.indexOf(value) === index)
        .map(index => this.politiciansArray[index])
        .sort((a, b) => b.popularity - a.popularity),
    );
  }
}

export const DataContext = createContext<FaceTheFactsData>(null as any);
