import {
  TrackedTextFeature,
  TrackedTextFeatureRecursive,
} from 'react-native-camera';
import {makeToken} from './tokenizer';
import {FaceTheFactsData, Politician} from './model';

interface NameFragment {
  id: string;
  pendingTokens: string[];
}

export class PoliticianScanner {
  private readonly foundTokens: string[] = [];

  public constructor(private readonly data: FaceTheFactsData) {}

  public analyze(features: TrackedTextFeature[]): Politician | null {
    features.forEach(feature => this.analyzeFeature(feature));

    if (this.foundTokens.length === 0) {
      return null;
    }

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

      this.data.lookupScanToken(token)!.forEach(id =>
        this.data.lookupScanTokens(id)!.forEach(tokenBundle => {
          if (makeToken(tokenBundle[0]) === token) {
            const pendingTokens = tokenBundle.map(makeToken);
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
        }),
      );
    }

    if (fullNames.size !== 1) {
      return null;
    }
    const id = [...fullNames][0];
    return this.data.lookupPolitician(id);
  }

  private analyzeFeature(feature: TrackedTextFeatureRecursive): void {
    feature.components?.forEach(value => this.analyzeFeature(value));
    if (feature.type !== 'element') {
      return;
    }
    const token = makeToken(feature.value);
    if (this.data.lookupScanToken(token)) {
      this.foundTokens.push(token);
    }
  }
}
