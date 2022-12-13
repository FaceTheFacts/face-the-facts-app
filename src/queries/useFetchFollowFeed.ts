import {fetch_api} from '../logic/fetch';
import {ApiPoliticianProfile, ApiSpeeches} from '../logic/api';
import {useQueries} from 'react-query';

export const useFetchFollowFeed = (
  followedIds: Set<number>,
  page: number,
  showSpeeches: boolean,
) => {
  console.log('useFetchFollowFeed', followedIds, page, showSpeeches);

  const politicianQueries = useQueries(
    Array.from(followedIds).map(politicianId => {
      return {
        queryKey: ['politician', politicianId],
        queryFn: () =>
          fetch_api<ApiPoliticianProfile>(
            `politician/${politicianId}?sidejobs_end=100&votes_end=100`,
          ),
        staleTime: 60 * 10000000, // 10000 minute = around 1 week
        cacheTime: 60 * 10000000,
      };
    }),
  );

  const speechQueries = useQueries(
    Array.from(followedIds).map(politicianId => {
      return {
        queryKey: ['politician:speech', politicianId, page],
        queryFn: () =>
          fetch_api<ApiSpeeches>(
            `politician/${politicianId}/speeches?page=${page}`,
          ),
        staleTime: 60 * 10000000, // 10000 minute = around 1 week
        cacheTime: 60 * 10000000,
        keepPreviousData: true,
        enabled: showSpeeches,
      };
    }),
  );
  return {politicianQueries, speechQueries};
};
