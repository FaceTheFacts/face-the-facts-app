import {ApiParty, IPoliticianContext} from '../logic/api';

//to do: Define the params of the other routes
export type RootStackParamList = {
  Main: undefined;
  NewPolitician: {
    politicianId: number;
    politicianName: string;
    party: ApiParty;
  };
  Politician: {politicianId: number};
  News: undefined;
  Speeches: undefined;
  Polls: {politician: IPoliticianContext};
  PollDetails: undefined;
};
