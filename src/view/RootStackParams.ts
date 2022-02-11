import {
  ApiParty,
  ApiPoliticianProfile,
  ApiPoll,
  ApiVote,
  IPoliticianContext,
} from '../logic/api';
import {Vote} from '../logic/data';

//to do: Define the params of the other routes
export type RootStackParamList = {
  Main: undefined;
  Politician: {
    politicianId: number;
    politicianName: string;
    party: ApiParty;
  };
  News: {politician: IPoliticianContext};
  Speeches: {politician: IPoliticianContext};
  Polls: {politician: IPoliticianContext};
  PollDetails: {
    poll: ApiPoll;
    vote: ApiVote;
    candidateVote: Vote;
    politician: ApiPoliticianProfile;
  };
};
