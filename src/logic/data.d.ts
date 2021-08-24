export interface Dataset {
  politicians: Politician[];
  parties: Party[];
  polls: Poll[];
  pollTopics: PollTopic[];
  positions: Position[];
  constituencies: Constituency[];
  elections: Election[];
  committees: Committee[];
}

export interface Party {
  id: string;
  displayName: string;
  foregroundColor: string;
  backgroundColor: string;
  borderColor?: string;
}

export interface Committee {
  id: string;
  name: string;
  icon?: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;

  /**
   * A list of the IDs of all parties which participated in the poll
   */
  participatedParties: string[];

  /**
   * The number of votes per party. Every party has a dataset of 4 numbers. The parties
   * are concatenated behind each other in the same order as the `participatedParties`
   * field.
   *
   * A dataset of a party contains the number of votes in the order: yes, no, abstain, none
   *
   * Example:
   * participatedParties: [CDU, SPD]
   * votes: [0, 230, 4, 14, 2, 140, 2, 10]
   *
   * This means that the vote was as the following:
   *         | CDU | SDP
   * yes     |  0  |  2
   * no      | 230 | 140
   * abstain |  4  |  2
   * none    | 14  | 10
   */
  votes: number[];
  topic?: string[];
  date: string;
}

export interface PollTopic {
  id: string;
  title: string;
  icon: string;
}

export interface PollLink {
  link: string;
}

export interface Position {
  id: string;
  title: string;
  content: string;
}

export interface Constituency {
  id: string;
  name: string;
  number: number;
  zipCodes?: string[];
  locations?: string[];
  politicians: string[];
}

export interface Election {
  id: string;
  displayName: string;
  politicians: string[];
}

export interface Politician {
  id: string;
  popularity: number;
  name: string;
  partyId: string;
  constituency?: string;
  occupation?: string[];
  committees?: string[];
  votes?: Record<string, Vote>;
  sideJobs?: SideJob[];
  cv?: CVEntry[];
  links?: string[];
  positions?: PoliticianPosition[];
}

export type Vote = 'yes' | 'no' | 'abstain' | 'none';

export type PollResult = 'yes' | 'no';

export type PositionAnswer = 'yes' | 'no' | 'abstain';

export interface PoliticianPosition {
  id: string;
  reason: string;
  answer: PositionAnswer;
}

export type SideJobIncomeLevel =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10';

export interface SideJob {
  job: string;
  organization: string;
  incomeLevel?: SideJobIncomeLevel;
  date?: string;
}

export interface CVEntry {
  date?: string;
  title: string;
}
