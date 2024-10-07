import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {DataContext} from '../../logic/model';
import SkeletonDashboard from '../skeleton/SkeletonDashboard';
import ErrorCard from '../Error';
import PollCarousel from '../poll/PollCarousel';
import {useQuery} from 'react-query';
import {ApiPollBundestagData} from '../../logic/api';
import {fetch_api} from '../../logic/fetch';

const DashboardEurope = () => {
  const database = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    database.dbManager.getFollowedIds().then(setFollowedIds);
  }, [database]);

  const followIdFilterQuery = Array.from(followedIds)
    .map(id => `follow_ids=${id}&`)
    .join('');

  const euPolls = useQuery<ApiPollBundestagData[] | undefined, Error>(
    'euPolls',
    () =>
      fetch_api<ApiPollBundestagData[]>(
        'eu/polls?size=10&' + followIdFilterQuery,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (euPolls.isLoading) {
    return <SkeletonDashboard />;
  }
  if (euPolls.isError) {
    return <ErrorCard />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {euPolls.data && <PollCarousel polls={euPolls.data} eu />}
    </ScrollView>
  );
};

export default DashboardEurope;
