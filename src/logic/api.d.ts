export interface ApiSearchPolitician {
  id: number;
  label: string;
  party: ApiParty;
}

export interface ApiParty {
  id: number;
  label: string;
}

export interface ApiEntities<T> {
  items: T[];
}

export interface ApiResponse<T> {
  items: T[];
}

export interface ApiEntity {
  politician: ApiEntities<ApiPolitician>;
}

export interface ApiPolitician {
  id: number;
  entity_type: string;
  label: string;
  first_name: string;
  last_name: string;
  sex: string;
  year_of_birth: string;
  party_past: string;
  deceased: boolean;
  deceased_date: string;
  education: string;
  residence: string;
  occupation: string;
  statistic_questions: string;
  statistic_questions_answered: string;
  qid_wikidata: string;
  field_title: string;
  sidejobs: ApiSidejob[];
  cvs: [
    {
      polician_id: number;
      short_description: string;
      raw_text: string;
    },
  ];
  weblinks: [
    {
      id: number;
      politician_id: number;
      link: string[];
    },
  ];
  votes_and_polls: [
    {
      Vote: ApiVote;
      Poll: ApiPoll;
    },
  ];
}

export interface ApiVote {
  id: number;
  entity_type: string;
  label: string;
  api_url: string;
  mandate_id: number;
  fraction_id: number;
  poll_id: number;
  vote: string;
  reason_no_show: string;
  reason_no_show_other: string;
}

export interface ApiPoll {
  id: number;
  label: string;
  field_intro: string;
  field_poll_date: string;
}

export interface ApiSidejob {
  id: number;
  entity_type: string;
  label: string;
  income_level: string;
  interval: string;
  data_change_date: string;
  sidejob_organization: ApiSidejobOrganisation;
}

export interface ApiSidejobOrganisation {
  id: number;
  entity_type: string;
  label: string;
}
