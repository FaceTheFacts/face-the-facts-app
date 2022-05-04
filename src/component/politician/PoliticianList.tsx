import React from 'react';
import {ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {ApiPoliticianHeader} from '../../logic/api';
import {fetch_api} from '../../logic/fetch';
import PoliticianItem from './PoliticianItem';
import SkeletonPoliticianItem from '../skeleton/SkeletonPoliticianItem';
import ErrorCard from '../Error';

export interface PoliticianListProps {
  politicianIds: number[];
}

const PoliticianList = ({politicianIds}: PoliticianListProps) => {
  const history = politicianIds.reverse();
  const politicianHistory =
    history.length > 10 ? history.slice(0, 10) : history;
  let query = '';
  politicianHistory.forEach(politicianId => {
    query += `ids=${politicianId}&`;
  });
  const historyQuery = useQuery<ApiPoliticianHeader[] | undefined, Error>(
    `politicianshistory:${query}`,
    () => fetch_api<ApiPoliticianHeader[]>(`politicianshistory/?${query}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (historyQuery.isLoading) {
    return <SkeletonPoliticianItem />;
  }

  if (historyQuery.isError) {
    return <ErrorCard />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {historyQuery?.data?.map((politician, index) => (
        <PoliticianItem
          key={index}
          politicianId={politician.id}
          politicianName={politician.label}
          party={politician.party}
        />
      ))}
    </ScrollView>
  );
};

export default PoliticianList;
