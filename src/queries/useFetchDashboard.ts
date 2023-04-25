import {fetch_api} from '../logic/fetch';
import {
  ApiPaginatedData,
  ApiSpeechBundestag,
  ApiSidejobsBundestag,
  ApiPollBundestagData,
  ApiBundestagPartyDonation,
} from '../logic/api';
import {useQueries} from 'react-query';

const queryFunctions = {
  speeches: () =>
    fetch_api<ApiPaginatedData<ApiSpeechBundestag>>(
      'bundestag/speeches?page=1',
    ),
  polls: (pollquery: string) =>
    fetch_api<ApiPollBundestagData[]>(`bundestag/polls?${pollquery}`),
  sidejobs: () =>
    fetch_api<ApiSidejobsBundestag[]>('bundestag/sidejobs?size=5'),
  donations: () =>
    fetch_api<ApiBundestagPartyDonation[]>('homepagepartydonations'),
};

export const useFetchDashboard = (followIds: Set<number>) => {
  const pollquery = Array.from(followIds)
    .map(id => `follow_ids=${id}&`)
    .join('');
  return useQueries([
    {
      queryKey: 'donations: Bundestag',
      queryFn: queryFunctions.donations,
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
    {
      queryKey: 'speeches: Bundestag page:1',
      queryFn: queryFunctions.speeches,
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
    {
      queryKey: `polls: Bundestag ${pollquery}`,
      queryFn: () => queryFunctions.polls(pollquery),
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
    {
      queryKey: 'sidejobs: Bundestag',
      queryFn: queryFunctions.sidejobs,
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  ]);
};
