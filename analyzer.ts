import {TrackedTextFeature, TrackedTextFeatureRecursive} from 'react-native-camera';
import {makeToken} from './tokenizer';

export interface Politician {
  id: string;
  names: string[][];
}

const politicians: Politician[] = [
  {
    id: 'Ulf Wilhelm',
    names: [['Ulf', 'Wilhelm']],
  },
  {
    id: 'Jürn Jakob Schultze-Berndt',
    names: [
      ['Jürn', 'Jakob', 'Schultze-Berndt'],
      ['Jürn', 'Jakob', 'Schultze', 'Berndt'],
    ],
  },
];
const politicianMap = new Map<string, Politician>(
  politicians.map(value => [value.id, value]),
);
const nameMap = new Map<string, Set<string>>();
politicians.forEach(({id, names}) =>
  names.forEach(nameBundle =>
    nameBundle.forEach(name => {
      const token = makeToken(name);
      if (!nameMap.get(token)?.add(id)) {
        nameMap.set(token, new Set([id]));
      }
    }),
  ),
);

interface NameFragment {
  id: string;
  pendingTokens: string[];
}

export class PoliticianNameAnalyzer {
  private readonly foundTokens: string[] = [];

  public analyze(features: TrackedTextFeature[]): Politician | null {
    features.forEach(feature => this.analyzeFeature(feature));

    if (this.foundTokens.length === 0) {
      return null;
    }
    console.log('found tokens', this.foundTokens);

    const fullNames = new Set<string>();
    let fragments: NameFragment[] = [];

    for (const token of this.foundTokens) {
      fragments = fragments.filter(fragment => {
        const nextToken = fragment.pendingTokens.shift();
        if (nextToken !== token) {
          return false;
        }
        if (fragment.pendingTokens.length === 0) {
          fullNames.add(fragment.id);
          return false;
        }
        return true;
      });

      nameMap.get(token)!.forEach(id => {
        const {names} = politicianMap.get(id)!;
        names.forEach(nameBundle => {
          if (makeToken(nameBundle[0]) === token) {
            const pendingTokens = nameBundle.map(makeToken);
            pendingTokens.shift();
            if (pendingTokens.length === 0) {
              fullNames.add(id);
            } else {
              fragments.push({
                id,
                pendingTokens,
              });
            }
          }
        });
      });
    }

    if (fullNames.size !== 1) {
      return null;
    }
    const id = [...fullNames][0];
    return politicianMap.get(id) ?? null;
  }

  private analyzeFeature(feature: TrackedTextFeatureRecursive): void {
    feature.components?.forEach(value => this.analyzeFeature(value));
    if (feature.type !== 'element') {
      return;
    }
    const token = makeToken(feature.value);
    if (nameMap.has(token)) {
      this.foundTokens.push(token);
    }
  }
}
