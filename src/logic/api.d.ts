export interface ApiPoliticianHeader {
  id: number;
  label: string;
  party: ApiParty;
}

export interface ApiEntities<T> {
  items: Array<T>;
}

export interface ApiResponse<T> {
  items: T[];
}

export interface ApiEntity {
  politician: ApiEntities<ApiPolitician>;
}

export interface ApiPolitician {
  profile: ApiPoliticianProfile;
  positions: ApiPositions;
}

export interface ApiPoliticianContext {
  profile?: ApiPoliticianProfile;
  positions?: ApiPositions;
  speeches?: ApiSpeeches;
  news?: ApiNews;
  constituency?: ApiPoliticianConstituency;
}

export interface ApiVoteAndPoll {
  Vote: ApiVote;
  Poll: ApiPoll;
}

export interface ApiVoteAndPoll {
  Vote: ApiVote;
  Poll: ApiPoll;
}

export interface ApiPoliticianProfile {
  id: number;
  entity_type: string;
  label: string;
  first_name: string;
  last_name: string;
  sex: string;
  year_of_birth: string;
  party: ApiParty;
  deceased: boolean;
  deceased_date: string;
  education: string;
  residence: string;
  occupations: string[];
  statistic_questions: string;
  statistic_questions_answered: string;
  qid_wikidata: string;
  field_title: string;
  sidejobs: ApiSidejob[];
  cvs: {
    polician_id: number;
    short_description: string;
    raw_text: string;
  }[];
  abgeordnetenwatch_url: string;
  weblinks: {
    id: number;
    politician_id: number;
    link: string;
  }[];
  votes_and_polls: ApiVoteAndPoll[];
  topic_ids_of_latest_committee: number[];
}

export interface ApiParty {
  id: number;
  label: string;
  party_style: ApiPartyStyle;
}

export interface ApiPartyStyle {
  id: number;
  display_name: string;
  foreground_color: string;
  background_color: string;
  border_color?: string;
}

export interface ApiVote {
  id: number;
  entity_type: string;
  label: string;
  api_url: string;
  mandate_id: number;
  fraction_id: number;
  poll_id: number;
  vote: Vote;
  reason_no_show: string;
  reason_no_show_other: string;
}

export interface ApiPoll {
  id: number;
  label: string;
  field_intro: string;
  field_poll_date: string;
  poll_passed: boolean;
}

export interface ApiPollVotes {
  yes: ApiPoliticianHeader[];
  no: ApiPoliticianHeader[];
  abstain: ApiPoliticianHeader[];
  no_show: ApiPoliticianHeader[];
}

export interface ApiSidejob {
  id: number;
  entity_type: string;
  label: string;
  income_level: string;
  interval: string;
  created: string;
  sidejob_organization: ApiSidejobOrganisation;
}

export interface ApiSidejobOrganisation {
  id: number;
  entity_type: string;
  label: string;
}

export interface ApiSidejobsBundestag {
  sidejob: ApiSidejob;
  politician: ApiPoliticianHeader;
}

export interface ApiPositions {
  id: number;
  positions: ApiPosition[];
}

export interface ApiPosition {
  id: number;
  position: PositionAnswer;
  reason: string;
  position_statement: {
    statement: string;
  };
}

export interface ApiPollDetails {
  poll_results: ApiPollResult[];
  poll_links: ApiPollLink[];
}

export interface ApiPollResult {
  id: number;
  poll_id: number;
  fraction: {
    id: number;
    full_name: string;
    short_name: string;
    label: string;
  };
  total_yes: number;
  total_no: number;
  total_abstain: number;
  total_no_show: number;
}

export interface ApiPollLink {
  title: string;
  uri: string;
}

interface SpeechAttribute {
  originID?: string;
  originMediaID?: string;
  creator: string;
  videoFileURI: string;
  dateEnd: string;
}

interface SpeechRelationship {
  agendaItem: {
    data: {
      attributes: {
        title: string;
      };
    };
  };
  people: {
    data: {
      attributes: {
        additionalInformation: {
          abgeordnetenwatchID: string;
        };
      };
    }[];
  };
}

interface ApiSpeechData {
  type: string;
  id: string;
  attributes: SpeechAttribute;
  relationships: SpeechRelationship;
}

interface ApiSpeeches {
  items: ApiSpeech[];
  total: number;
  page: number;
  size: number;
  is_last_page: boolean;
  politician_id: number;
}
interface SpeechResponse {
  meta: {
    api: unknown;
    requestStatus: string;
    results: {
      count: number;
      total: number;
    };
  };
  data: ApiSpeechData[];
}

export interface ApiPaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  is_last_page: boolean;
}

export interface ApiSpeech {
  videoFileURI: string;
  title: string;
  date: string;
}

export interface ApiSpeechBundestag {
  videoFileURI: string;
  title: string;
  date: string;
  speaker: ApiPoliticianHeader;
}

export interface ApiPollBundestagData {
  poll: ApiPoll;
  result: {
    yes: number;
    no: number;
    abstain: number;
    no_show: number;
  };
  politicians: number[];
  last_politician: string;
}

export interface ApiPollBundestag {
  data: ApiPollBundestagData[];
  last_page: boolean;
}
export interface ApiNews {
  items: ApiNewsArticle[];
}

export interface ApiNewsArticle {
  id: string;
  highlight: string;
  images: PoliTrackImage[];
  published: string;
  source: string;
  title: string;
  url: string;
}

export interface ApiPoliticianConstituency {
  constituency_number: number;
  constituency_name: string;
  politicians: ApiPoliticianHeader[];
}
export interface PoliTrackImage {
  url: string;
  title: string;
  height: number;
  width: number;
}

export type TopicIcon = {
  label: string;
  icon: string;
};

export type Vote = 'yes' | 'no' | 'abstain' | 'no_show';

export type PollResult = 'yes' | 'no';

export type PositionAnswer = 'agree' | 'disagree' | 'neutral';
