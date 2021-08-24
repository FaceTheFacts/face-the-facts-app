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

interface SearchPolitician {
  name: string;
  locations?: string[];
  zipCodes?: string[];
}

export class FaceTheFactsData {
  private readonly politicians: Map<string, Politician>;
  private readonly politiciansArray: Politician[];
  private readonly parties: Map<string, Party>;
  private readonly committees: Map<string, Committee>;
  private readonly constituencies: Map<string, Constituency>;
  public readonly elections: Election[];
  public readonly polls: Poll[];
  public readonly pollTopics: PollTopic[];
  // public readonly positions: Map<string, Position>;
  private readonly positions: Map<string, Position>;
  private readonly searchIndex: Document;

  private readonly scanTokens: Map<string, string[][]>;
  private readonly scanTokenMap: Map<string, Set<string>>;

  public constructor(dataset: Dataset) {
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
    const positions: Position[] = Array(10)
      .fill(null)
      .map((value, index) => ({
        id: index.toString(),
        title: 'Position ' + index,
        content: 'Description of position ' + index,
      }));
    this.positions = new Map(positions.map(value => [value.id, value]));

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
          charset: 'latin:advanced',
        },
        {
          field: 'zipCodes',
        },
      ],
    });
    this.politiciansArray = dataset.politicians;

    dataset.politicians.forEach(({id, name, constituency}, index) => {
      const boundarySplit = name.split(/\b/).filter(value => value.match(/\b/));
      const spaceSplit = name.split(/\s+/);
      const scanTokens: string[][] = [];
      if (boundarySplit.length) {
        scanTokens.push(boundarySplit.map(makeToken));
      }

      if (spaceSplit.length !== boundarySplit.length && spaceSplit.length) {
        scanTokens.push(spaceSplit.map(makeToken));
      }

      this.scanTokens.set(id, scanTokens);

      scanTokens.forEach(tokenBundle =>
        tokenBundle.forEach(token => {
          if (!this.scanTokenMap.get(token)?.add(id)) {
            this.scanTokenMap.set(token, new Set([id]));
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

  public search(query: string): Politician[] {
    return this.searchIndex
      .search(query)
      .flatMap(result => result.result)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map(index => this.politiciansArray[index])
      .sort((a, b) => b.popularity - a.popularity);
  }
}

export const DataContext = createContext<FaceTheFactsData>(null as any);
