import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {PollResult, Vote} from '../logic/data';
import {Colors} from '../theme';
import VoteTag from '../component/utils/VoteTag';
import ReadMoreHTML from '../component/utils/ReadMoreHTML';
import type {ApiPoll, ApiPollDetail, ApiVote} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../component/BackButton';
import FractionTag from '../component/FractionTag';
import {getWidth} from '../utils/date';

export const pollResultLabels: Record<PollResult, string> = {
  yes: 'Antrag angenommen',
  no: 'Antrag abgelehnt',
};

type PollDetailsViewParams = {
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote: Vote;
};

interface PollDetailsViewProps {
  route: RouteProp<{params: PollDetailsViewParams}, 'params'>;
}

const PollDetailsView = ({route}: PollDetailsViewProps) => {
  const {poll, vote, candidateVote} = route.params;
  const {width} = useWindowDimensions();
  const pollResult: PollResult = poll.poll_passed ? 'yes' : 'no';
  const [expanded, setExpanded] = useState(false);
  const scrollView = useRef<ScrollView | null>(null);
  const pollDetailsQuery = useQuery<Array<ApiPollDetail> | undefined, Error>(
    `poll:${poll.id}:details`,
    () => fetch_api<Array<ApiPollDetail>>(`poll/${poll.id}/details`),
  );
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <ScrollView
        ref={scrollView}
        scrollEnabled={expanded}
        style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.cardBackground}
        />
        <BackButton />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{poll.label}</Text>
          <ReadMoreHTML
            baseStyle={styles.description}
            html={poll.field_intro}
            onCollapse={() => {
              setExpanded(false);
              scrollView.current!.scrollTo({});
            }}
            onExpand={() => setExpanded(true)}
          />
        </View>
        {/*         <View style={styles.middleContainer}>
          <View style={styles.candidateAnswerContainer}>
            <Text style={styles.candidateAnswerLabel}>
              Kandidat:in stimmte mit
            </Text>
            <VoteTag vote={candidateVote} />
          </View>
          <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
        </View> */}
        <View style={styles.partyVotesCard}>
          <Text style={styles.cardTitle}>Parteien</Text>
          <View style={styles.separatorLine} />
          {pollDetailsQuery.data &&
            pollDetailsQuery.data.map(
              (partyVote, index) =>
                partyVote.fraction.full_name !== 'fraktionslos' && (
                  <>
                    <View
                      key={partyVote.fraction.id}
                      style={styles.fractionRow}>
                      <View style={styles.fractionTagContainer}>
                        <FractionTag
                          party={partyVote.fraction.short_name}
                          style={styles.fractionTag}
                        />
                      </View>
                      <View
                        style={[
                          styles.partyVoteContainer,
                          {
                            width: width,
                          },
                        ]}>
                        {partyVote.total_yes > 0 && (
                          <View
                            style={[
                              styles.voteBarContainer,
                              {
                                width: getWidth(
                                  width,
                                  partyVote.total_yes,
                                  partyVote,
                                ),
                              },
                            ]}>
                            <Text style={styles.partyVote}>
                              {partyVote.total_yes}
                            </Text>
                            <View
                              style={[
                                styles.voteBar,
                                {backgroundColor: '#45C66F'},
                              ]}
                            />
                          </View>
                        )}
                        {partyVote.total_no > 0 && (
                          <View
                            style={[
                              styles.voteBarContainer,
                              {
                                width: getWidth(
                                  width,
                                  partyVote.total_no,
                                  partyVote,
                                ),
                              },
                            ]}>
                            <Text style={styles.partyVote}>
                              {partyVote.total_no}
                            </Text>
                            <View
                              style={[
                                styles.voteBar,
                                {backgroundColor: '#E54A6F'},
                              ]}
                            />
                          </View>
                        )}
                        {partyVote.total_abstain > 0 && (
                          <View
                            style={[
                              styles.voteBarContainer,
                              {
                                width: getWidth(
                                  width,
                                  partyVote.total_abstain,
                                  partyVote,
                                ),
                              },
                            ]}>
                            <Text style={styles.partyVote}>
                              {partyVote.total_abstain}
                            </Text>
                            <View
                              style={[
                                styles.voteBar,
                                {backgroundColor: '#1382E3'},
                              ]}
                            />
                          </View>
                        )}
                        {partyVote.total_no_show > 0 && (
                          <View
                            style={[
                              styles.voteBarContainer,
                              {
                                width: getWidth(
                                  width,
                                  partyVote.total_no_show,
                                  partyVote,
                                ),
                              },
                            ]}>
                            <Text style={styles.partyVote}>
                              {partyVote.total_no_show}
                            </Text>
                            <View
                              style={[
                                styles.voteBar,
                                {backgroundColor: '#464750'},
                              ]}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                    {pollDetailsQuery?.data!.length > index + 2 && (
                      <View key={index} style={styles.separatorLine} />
                    )}
                  </>
                ),
            )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  container: {
    // flex: 1,
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
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopColor: Colors.inactive,
    borderTopWidth: 1,
    borderBottomColor: Colors.inactive,
    borderBottomWidth: 1,
  },
  candidateAnswerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRightColor: Colors.inactive,
    borderRightWidth: 1,
  },
  candidateAnswerLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.8,
    maxWidth: 100,
    marginRight: 8,
  },
  result: {
    flex: 1,
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.8,
    textAlign: 'right',
  },
  partyVotesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  cardTitle: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Inter',
    padding: 12,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
  fractionRow: {
    padding: 12,
    flexDirection: 'row',
  },
  fractionTagContainer: {
    marginRight: 8,
  },
  fractionTag: {
    alignItems: 'center',
  },
  partyVoteContainer: {
    flexDirection: 'row',
  },
  partyVote: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.foreground,
    flex: 1,
    minWidth: 7,
  },
  voteBarContainer: {
    marginRight: 4,
    minWidth: 7,
  },
  voteBar: {
    flex: 1,
    maxHeight: 4,
    borderRadius: 4,
    marginBottom: 3,
  },
  tableVoteTag: {
    margin: 4,
    alignSelf: 'flex-end',
  },
});

export default PollDetailsView;
