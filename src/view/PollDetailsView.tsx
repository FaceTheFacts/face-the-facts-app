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
import {getChartData, getWidth} from '../utils/date';
import PieChart from 'react-native-pie-chart';

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
  const chartData = getChartData(pollDetailsQuery?.data);
  console.log(chartData);
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
        <View style={styles.votesCard}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>Gesamt</Text>
            <Text style={styles.totalVote}>{chartData[0]} Abgeordnete</Text>
          </View>
          <View style={styles.separatorLine} />
          <View style={styles.contentContainer}>
            <View style={styles.chartContainer}>
              <PieChart
                widthAndHeight={100}
                series={chartData.slice(1, 5)}
                sliceColor={['#45C66F', '#E54A6F', '#1382E3', '#464750']}
                doughnut={true}
                coverRadius={0.7}
                coverFill={Colors.cardBackground}
              />
            </View>
            <View style={styles.voteNumberCardContainer}>
              <View style={styles.voteNumberContainer}>
                <View style={styles.yesVote} />
                <Text style={styles.voteNumberText}>Ja: {chartData[1]}</Text>
              </View>
              <View style={styles.voteNumberContainer}>
                <View style={styles.noVote} />
                <Text style={styles.voteNumberText}>Nein: {chartData[2]}</Text>
              </View>
              <View style={styles.voteNumberContainer}>
                <View style={styles.abstainVote} />
                <Text style={styles.voteNumberText}>
                  Enthalten: {chartData[3]}
                </Text>
              </View>
              <View style={styles.voteNumberContainer}>
                <View style={styles.noShowVote} />
                <Text style={styles.voteNumberText}>
                  Abwesend: {chartData[4]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.votesCard}>
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
  votesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Inter',
    padding: 12,
  },
  totalVote: {
    color: Colors.foreground,
    fontWeight: '400',
    fontSize: 11,
    fontFamily: 'Inter',
    padding: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 54.5,
    paddingVertical: 24,
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
  },
  voteNumberCardContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
  },
  voteNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yesVote: {
    height: 12,
    width: 12,
    backgroundColor: '#45C66F',
    borderRadius: 2,
    marginVertical: 6,
    marginLeft: 2,
    marginRight: 8,
  },
  noVote: {
    height: 12,
    width: 12,
    backgroundColor: '#E54A6F',
    borderRadius: 2,
    marginVertical: 6,
    marginLeft: 2,
    marginRight: 8,
  },
  abstainVote: {
    height: 12,
    width: 12,
    backgroundColor: '#1382E3',
    borderRadius: 2,
    marginVertical: 6,
    marginLeft: 2,
    marginRight: 8,
  },
  noShowVote: {
    height: 12,
    width: 12,
    backgroundColor: '#464750',
    borderRadius: 2,
    marginVertical: 6,
    marginLeft: 2,
    marginRight: 8,
  },
  voteNumberText: {
    color: Colors.foreground,
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400',
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
