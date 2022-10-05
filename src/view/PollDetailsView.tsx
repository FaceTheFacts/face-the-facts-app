import React, {useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {ApiPollDetails, Vote} from '../logic/api';
import {Colors} from '../theme';
import ReadMoreHTML from '../component/utils/ReadMoreHTML';
import type {ApiPoliticianProfile, ApiPoll, ApiVote} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../component/BackButton';
import {getChartData} from '../utils/util';
import PoliticianCard from '../component/politician/PoliticianCard';
import PollChart from '../component/poll/PollChart';
import PollVoteCard from '../component/poll/PollVoteCard';
import Icon from '../component/Icon';
import {ArrowUpRightFromSquare} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import ErrorCard from '../component/Error';

type PollDetailsViewParams = {
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote?: Vote;
  politician?: ApiPoliticianProfile;
};

interface PollDetailsViewProps {
  route: RouteProp<{params: PollDetailsViewParams}, 'params'>;
}

const PollDetailsView = ({route}: PollDetailsViewProps) => {
  const {poll, candidateVote, politician} = route.params;
  const scrollView = useRef<ScrollView | null>(null);
  const modal = useRef<Modalize>(null);
  const {data: pollDetails, isError} = useQuery<
    ApiPollDetails | undefined,
    Error
  >(
    `poll:${poll.id}:details`,
    () => fetch_api<ApiPollDetails>(`poll/${poll.id}/details`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const chartData = getChartData(pollDetails?.poll_results);

  if (isError) {
    return <ErrorCard />;
  }
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.filterContainer}>
          {pollDetails && pollDetails.poll_links.length > 0 && (
            <TouchableOpacity
              style={styles.redirectBtn}
              onPress={() => {
                pollDetails.poll_links.length > 1
                  ? modal.current?.open()
                  : Linking.openURL(pollDetails.poll_links[0].uri);
              }}>
              <Icon style={styles.arrowIcon} icon={ArrowUpRightFromSquare} />
              <Text style={styles.redirectBtnText}>
                {pollDetails.poll_links.length > 1
                  ? 'weiterführende Links'
                  : 'weiterführender Link'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        ref={scrollView}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
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
        {politician && (
          <View style={styles.politicianCardContainer}>
            <PoliticianCard
              politicianId={politician.id}
              politicianName={politician.label}
              party={politician.party}
              vote={candidateVote}
              styling={styles.politicianCard}
            />
          </View>
        )}
        {pollDetails && pollDetails.poll_results && (
          <>
            <PollChart
              yes_votes={chartData[0]}
              no_votes={chartData[1]}
              abstain_votes={chartData[2]}
              no_show_votes={chartData[3]}
            />
            <PollVoteCard pollData={pollDetails.poll_results} />
          </>
        )}
      </ScrollView>
      {pollDetails && pollDetails.poll_links && (
        <BottomSheet
          modalRef={modal}
          modalStyle={styles.modalStyle}
          adjustToContentHeight={true}>
          {pollDetails?.poll_links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkBtn}
              onPress={() => Linking.openURL(link.uri)}>
              <Icon style={styles.arrowIcon} icon={ArrowUpRightFromSquare} />
              <Text style={styles.linkBtnText}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheet>
      )}
      <SafeAreaView style={styles.iosSafeBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.cardBackground,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
  },
  backButtonContainer: {
    flex: 1,
  },
  filterContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  arrowIcon: {
    color: Colors.foreground,
    height: 13,
    width: 13,
    marginTop: 2,
    marginRight: 8,
  },
  redirectBtn: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: 16,
    marginRight: 12,
    borderColor: 'rgba(252, 252, 252, 0.4)',
    borderWidth: 1,
  },
  redirectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.foreground,
  },
  politicianCard: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
    padding: 12,
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
  modalStyle: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.background,
    paddingVertical: 6,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
    marginVertical: 6,
    margin: 12,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
    color: Colors.foreground,
  },
});

export default PollDetailsView;
