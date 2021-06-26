import {get} from 'https';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {Politician} from './src/logic/model';

const partyMapping: Record<string, string> = {
  '1': 'sdp',
  '2': 'cdu',
  '3': 'cdu',
  '4': 'fdp',
  '5': 'gruene',
  '6': 'piraten',
  '7': 'freie',
  '8': 'linke',
  '9': 'afd',
  '10': 'tierschutzpartei',
  '12': 'oedp',
  '16': 'die-partei',
  '19': 'bavaria',
  '21': 'ndp',
  '22': 'rep',
};
const partyPopularity: Record<string, number> = {
  sdp: 5,
  cdu: 5,
  fdp: 4,
  gruene: 5,
  piraten: 2,
  freie: 2,
  linke: 3,
  afd: 4,
  tierschutzpartei: 1,
  oedp: 1,
  'die-partei': 1,
  bavaria: 1,
  ndp: 1,
  rep: 1,
  other: 0,
  none: 0,
};

interface ApiPolitician {
  id: number;
  entity_type: 'politician';
  label: string;
  api_url: string;
  abgeordnetenwatch_url: string;
  first_name: string;
  last_name: string;
  birth_name: string | null;
  sex: 'm' | 'f' | 'd' | null;
  year_of_birth: number | null;
  party: Omit<ApiParty, 'full_name'>;
  party_past: string | null;
  deceased: boolean | null;
  deceased_date: string | null;
  education: string | null;
  residence: string | null;
  occupation: string | null;
  statistic_questions: string | null;
  statistic_questions_answered: string | null;
  qid_wikidata: string | null;
  field_title: string | null;
}

interface ApiParty {
  id: number;
  entity_type: 'party';
  label: string;
  api_url: string;
  full_name: string;
}

interface ApiEntities {
  politicians: ApiPolitician;
  parties: ApiParty;
}

interface ApiResponse<T> {
  meta: {
    abgeordnetenwatch_api: {
      version: '2.0';
      documentation: 'https://www.abgeordnetenwatch.de/api';
    };
    status: 'ok';
    status_message: '';
    result: {
      count: number;
      total: number;
      range_start: number;
      range_end: number;
    };
  };
  data: T;
}

function fetch<T>(url: string): Promise<T> {
  console.log('fetch', url);
  return new Promise<T>((resolve, reject) => {
    const req = get(url, res => {
      res.once('error', reject);

      let buffer: string = '';
      res.on('data', chunk => (buffer += chunk));
      res.once('end', () => resolve(JSON.parse(buffer) as T));
    });
    req.once('error', reject);
    req.end();
  });
}

async function fetchEntities<K extends keyof ApiEntities>(
  entityName: K,
): Promise<ApiEntities[K][]> {
  const entities: ApiEntities[K][] = [];
  let totalEntities: number;
  let cursor = 0;

  do {
    const response = await fetch<ApiResponse<ApiEntities[K][]>>(
      `https://www.abgeordnetenwatch.de/api/v2/${entityName}?range_start=${cursor}&range_end=1000`,
    );
    entities.push(...response.data);
    totalEntities = response.meta.result.total;
    cursor += response.data.length;
  } while (totalEntities > entities.length);

  return entities;
}

async function main() {
  let apiPoliticians: ApiPolitician[];
  if (existsSync('api-politicians.json')) {
    apiPoliticians = JSON.parse(
      readFileSync('api-politicians.json').toString(),
    );
  } else {
    apiPoliticians = await fetchEntities('politicians');
    writeFileSync('api-politicians.json', JSON.stringify(apiPoliticians));
  }

  const politicians: Politician[] = apiPoliticians.map(value => {
    const party =
      value.party === null ? 'none' : partyMapping[value.party.id] ?? 'other';

    return {
      id: value.id.toString(),
      displayName: value.label,
      picture: null, // TODO: retrieve picture of politician
      party,
      popularity: partyPopularity[party],
    };
  });
  writeFileSync('politicians.json', JSON.stringify(politicians));
}

main();

export {};
