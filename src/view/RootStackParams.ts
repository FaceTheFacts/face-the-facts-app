import {
  ApiPaginatedData,
  ApiParty,
  ApiPoliticianProfile,
  ApiPoll,
  ApiPollBundestag,
  ApiSpeechBundestag,
  ApiVote,
  ApiPoliticianContext,
  ApiBundestagPartyDonation,
} from '../logic/api';
import {Vote} from '../logic/api';

//to do: Define the params of the other routes
export type RootStackParamList = {
  Main: undefined;
  Politician: {
    politicianId: number;
    politicianName: string;
    party: ApiParty;
    toSideJobs?: boolean;
  };
  News: {politician: ApiPoliticianContext};
  Speeches: {politician: ApiPoliticianContext};
  DashboardSpeeches: {speeches: ApiPaginatedData<ApiSpeechBundestag>};
  PartyDonations: {partydonations: ApiBundestagPartyDonation[]};
  DashboardSidejobs: any;
  Polls: {politician: ApiPoliticianContext};
  DashboardPolls: {polls: ApiPaginatedData<ApiPollBundestag>};
  PollDetails: {
    poll: ApiPoll;
    vote: ApiVote;
    candidateVote: Vote;
    politician?: ApiPoliticianProfile;
  };
};
