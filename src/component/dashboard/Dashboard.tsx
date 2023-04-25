import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {DataContext} from '../../logic/model';
import SkeletonDashboard from '../skeleton/SkeletonDashboard';
import ErrorCard from '../Error';
import PartyDonationCarousel from '../partydonation/PartyDonationCarousel';
import SpeechCarousel from '../speech/SpeechCarousel';
import PollCarousel from '../poll/PollCarousel';
import SideJobCarousel from '../sidejob/SideJobCarousel';
import {useFetchDashboard} from '../../queries/useFetchDashboard';

const Dashboard = () => {
  const database = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    database.dbManager.getFollowedIds().then(setFollowedIds);
  }, [database]);

  const queries = useFetchDashboard(followedIds);
  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);

  if (isLoading) {
    return <SkeletonDashboard />;
  }
  if (isError) {
    return <ErrorCard />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {queries[0].data && <PartyDonationCarousel donations={queries[0].data} />}
      {queries[1].data && <SpeechCarousel speeches={queries[1].data} />}
      {queries[2].data && <PollCarousel polls={queries[2].data} />}
      {queries[3].data && <SideJobCarousel sidejobs={queries[3].data} />}
    </ScrollView>
  );
};

export default Dashboard;
