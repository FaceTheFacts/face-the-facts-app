import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {PollResult, Vote} from '../logic/data';
import {Colors} from '../theme';
import VoteTag, {voteColors} from '../component/utils/VoteTag';
import ReadMoreHTML from '../component/utils/ReadMoreHTML';
import Tag from '../component/utils/Tag';
import type {ApiPoll, ApiPollDetail, ApiVote} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../component/BackButton';

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
        <View style={styles.middleContainer}>
          <View style={styles.candidateAnswerContainer}>
            <Text style={styles.candidateAnswerLabel}>
              Kandidat:in stimmte mit
            </Text>
            <VoteTag vote={candidateVote} />
          </View>
          <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
        </View>
        <View style={styles.votesContainer}>
          <ScrollView style={styles.table} horizontal>
            <View style={styles.tableVoteColumn}>
              {pollDetailsQuery.data &&
                pollDetailsQuery.data.map(
                  (detail: ApiPollDetail, index: number) => (
                    <VoteTag
                      key={index}
                      style={styles.tableVoteTag}
                      vote={'yes'}
                    />
                  ),
                )}
            </View>
            <View style={styles.tableTotalColumn}>
              <Tag style={styles.tableTag} content="Gesamt" uppercase />
              {pollDetailsQuery.data &&
                pollDetailsQuery.data.map((detail, index) => (
                  <Tag
                    key={index}
                    style={styles.tableTag}
                    content={'Ja'}
                    backgroundColor={
                      vote === pollResult ? voteColors[vote] : Colors.background
                    }
                    spacing
                    bold
                  />
                ))}
            </View>
            {pollDetailsQuery.data &&
              pollDetailsQuery.data.map(partyVote => (
                <View
                  key={partyVote.fraction.id}
                  style={styles.tablePartyColumn}>
                  <Text>{partyVote.fraction.short_name}</Text>
                  {/* <PartyTag
                    style={styles.tableTag}
                    party={partyVote.fraction.short_name}
                  /> */}
                  {[
                    partyVote.total_yes,
                    partyVote.total_no,
                    partyVote.total_abstain,
                    partyVote.total_no_show,
                  ].map((vote, index) => (
                    <Tag
                      key={index}
                      style={styles.tableTag}
                      content={vote.toString()}
                      backgroundColor={
                        pollResult && index === 0
                          ? voteColors.yes
                          : Colors.background
                      }
                      spacing
                      bold
                    />
                  ))}
                </View>
              ))}
          </ScrollView>
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
    padding: 20,
  },
  title: {
    color: Colors.foreground,
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
  votesContainer: {
    padding: 20,
  },
  table: {
    overflow: 'visible',
  },
  tableVoteColumn: {
    justifyContent: 'flex-end',
  },
  tableTotalColumn: {
    borderRightColor: Colors.inactive,
    borderRightWidth: 1,
    paddingRight: 4,
    marginRight: 4,
    alignItems: 'center',
  },
  tablePartyColumn: {},
  tableTag: {
    margin: 4,
    alignSelf: 'center',
  },
  tableVoteTag: {
    margin: 4,
    alignSelf: 'flex-end',
  },
});

export default PollDetailsView;
