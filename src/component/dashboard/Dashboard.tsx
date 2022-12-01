import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {
  ApiPaginatedData,
  ApiSpeechBundestag,
  ApiSidejobsBundestag,
  ApiPollBundestagData,
  ApiBundestagPartyDonation,
} from '../../logic/api';
import {fetch_api} from '../../logic/fetch';
import {DataContext} from '../../logic/model';
import SkeletonDashboard from '../skeleton/SkeletonDashboard';
import ErrorCard from '../Error';
import PartyDonationCarousel from '../partydonation/PartyDonationCarousel';
import SpeechCarousel from '../speech/SpeechCarousel';
import PollCarousel from '../poll/PollCarousel';
import SideJobCarousel from '../sidejob/SideJobCarousel';

const Dashboard = () => {
  const database = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    database.dbManager.getFollowedIds().then(setFollowedIds);
  }, [database]);
  let query = '';
  Array.from(followedIds).map(id => (query += `follow_ids=${id}&`));

  const {
    data: speeches,
    isLoading: speechesLoading,
    isError: speechesError,
  } = useQuery<ApiPaginatedData<ApiSpeechBundestag> | undefined, Error>(
    'speeches: Bundestag page:1',
    () =>
      fetch_api<ApiPaginatedData<ApiSpeechBundestag>>(
        'bundestag/speeches?page=1',
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {
    data: polls,
    isLoading: pollsLoading,
    isError: pollsError,
  } = useQuery<ApiPollBundestagData[] | undefined, Error>(
    `polls: Bundestag ${query}`,
    () => fetch_api<ApiPollBundestagData[]>(`bundestag/polls?${query}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {
    data: sidejobs,
    isLoading: sidejobsLoading,
    isError: sidejobsError,
  } = useQuery<ApiSidejobsBundestag[] | undefined, Error>(
    'sidejobs: Bundestag',
    () => fetch_api<ApiSidejobsBundestag[]>('bundestag/sidejobs?size=5'),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {
    data: partydonations,
    isLoading: partydonationsLoading,
    isError: partydonationsError,
  } = useQuery<ApiBundestagPartyDonation[] | undefined, Error>(
    'partdonations: Bundestag',
    () => fetch_api<ApiBundestagPartyDonation[]>('homepagepartydonations'),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  if (
    pollsLoading ||
    speechesLoading ||
    sidejobsLoading ||
    partydonationsLoading
  ) {
    return <SkeletonDashboard />;
  }
  if (pollsError || sidejobsError || speechesError || partydonationsError) {
    return <ErrorCard />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {partydonations && <PartyDonationCarousel donations={partydonations} />}
      {speeches && <SpeechCarousel speeches={speeches} />}
      {polls && <PollCarousel polls={polls} />}
      {sidejobs && <SideJobCarousel sidejobs={sidejobs} />}
    </ScrollView>
  );
};

export default Dashboard;
