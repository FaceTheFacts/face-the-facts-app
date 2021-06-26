import {TrackedTextFeature} from 'react-native-camera';
import {PoliticianScanner} from './scanner';
import {makeToken} from './tokenizer';
import {createContext} from 'react';

export interface Politician {
  id: string;
  displayName: string;
  picture: string | null;
  party: string;
  popularity: number;
}

export interface Party {
  id: string;
  displayName: string;
  foregroundColor: string;
  backgroundColor: string;
  borderColor?: string;
}

export interface Election {
  id: string;
  displayName: string;
  politicians: string[];
}

export interface FaceTheFactsDataset {
  politicians: Politician[];
  parties: Party[];
  elections: Election[];
}

export class FaceTheFactsData {
  private readonly politicians: Map<string, Politician>;
  private readonly parties: Map<string, Party>;
  public readonly elections: Election[];

  private readonly scanTokens: Map<string, string[][]>;
  private readonly scanTokenMap: Map<string, Set<string>>;

  public constructor(dataset: FaceTheFactsDataset) {
    this.politicians = new Map(
      dataset.politicians.map(value => [value.id, value]),
    );
    this.parties = new Map(dataset.parties.map(value => [value.id, value]));
    this.elections = dataset.elections;

    this.scanTokens = new Map();
    this.scanTokenMap = new Map();
    dataset.politicians.forEach(({id, displayName}) => {
      const boundarySplit = displayName
        .split(/\b/)
        .filter(value => value.match(/\b/));
      const spaceSplit = displayName.split(/\s+/);
      const scanTokens: string[][] = [boundarySplit.map(makeToken)];
      if (spaceSplit.length !== boundarySplit.length) {
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
    });
  }

  public lookupPolitician(id: string): Politician | null {
    return this.politicians.get(id) ?? null;
  }

  public lookupParty(id: string): Party | null {
    return this.parties.get(id) ?? null;
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
}

export const DataContext = createContext<FaceTheFactsData>(null as any);
