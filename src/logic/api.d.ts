export interface ApiSearchPolitician {
  id: number;
  label: string;
  party: ApiParty;
  image_url: string;
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

export interface IPoliticianContext {
  profile?: ApiPoliticianProfile;
  positions?: ApiPositions;
  speeches?: ApiPaginatedData<ApiSpeech>;
  news?: ApiNews;
  constituency?: ApiSearchPolitician[];
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
  items: ApiEntities<ApiPollDetail>;
}

export interface ApiPollDetail {
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
