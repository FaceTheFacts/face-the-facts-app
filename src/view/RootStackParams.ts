import {
  ApiPaginatedData,
  ApiParty,
  ApiPoliticianProfile,
  ApiPoll,
  ApiSpeechBundestag,
  ApiVote,
  ApiPoliticianContext,
  ApiBundestagPartyDonation,
  ApiPollBundestagData,
  Vote,
} from '../logic/api';

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
  PartyDonationDetails: {
    party: ApiParty;
  };
  BundestagDonations: {partydonations: ApiBundestagPartyDonation[]};
  DashboardSidejobs: undefined;
  Polls: {politician: ApiPoliticianContext};
  DashboardPolls: {polls: ApiPollBundestagData[]};
  PollDetails: {
    poll: ApiPoll;
    vote: ApiVote;
    candidateVote: Vote;
    politician?: ApiPoliticianProfile;
  };
};
