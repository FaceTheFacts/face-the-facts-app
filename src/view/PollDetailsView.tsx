import React, {useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Vote} from '../logic/data';
import {Colors} from '../theme';
import ReadMoreHTML from '../component/utils/ReadMoreHTML';
import type {
  ApiPoliticianProfile,
  ApiPoll,
  ApiPollDetail,
  ApiVote,
} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../component/BackButton';
import {getChartData} from '../utils/date';
import PoliticianCard from '../component/PoliticianCard';
import PollChart from '../component/poll/PollChart';
import PollVoteCard from '../component/poll/PollVoteCard';

type PollDetailsViewParams = {
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote: Vote;
  politician: ApiPoliticianProfile;
};

interface PollDetailsViewProps {
  route: RouteProp<{params: PollDetailsViewParams}, 'params'>;
}

const PollDetailsView = ({route}: PollDetailsViewProps) => {
  const {poll, candidateVote, politician} = route.params;
  const scrollView = useRef<ScrollView | null>(null);
  const pollDetailsQuery = useQuery<Array<ApiPollDetail> | undefined, Error>(
    `poll:${poll.id}:details`,
    () => fetch_api<Array<ApiPollDetail>>(`poll/${poll.id}/details`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const chartData = getChartData(pollDetailsQuery?.data);
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />

      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.cardBackground}
      />
      <BackButton />
      <ScrollView
        ref={scrollView}
        scrollEnabled={true}
        style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{poll.label}</Text>
          <ReadMoreHTML
            baseStyle={styles.description}
            html={poll.field_intro}
            onCollapse={() => {
              scrollView.current!.scrollTo({});
            }}
          />
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.politicianCardContainer}>
          <PoliticianCard
            politicianId={politician.id}
            politicianName={politician.label}
            party={politician.party}
            vote={candidateVote}
          />
        </View>
        <PollChart chartData={chartData} />
        <PollVoteCard pollData={pollDetailsQuery.data} />
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  iosSafeBottom: {
    flex: 0,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Inter',
  },
  description: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
  politicianCardContainer: {
    marginTop: 6,
  },
});

export default PollDetailsView;
