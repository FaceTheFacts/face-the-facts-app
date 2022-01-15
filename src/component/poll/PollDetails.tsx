import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PollResult, Vote} from '../../logic/data';
import {Colors} from '../../theme';
import Icon from '../Icon';
import {ClearIcon} from '../../icons';
import VoteTag, {voteColors} from '../utils/VoteTag';
import Tag from '../utils/Tag';
import ReadMoreHTML from '../utils/ReadMoreHTML';
import {ApiPoll, ApiPollDetail, ApiVote} from '../../logic/api';

export const pollResultLabels: Record<PollResult, string> = {
  yes: 'Antrag angenommen',
  no: 'Antrag abgelehnt',
};

export interface PollDetailsProps {
  poll: ApiPoll;
  vote: ApiVote;
  candidateAnswer: Vote;
  details: Array<ApiPollDetail>;
  onClose: () => void;
}

const PollDetails = ({
  poll,
  vote,
  candidateAnswer,
  details,
  onClose,
}: PollDetailsProps) => {
  const pollResult: PollResult = poll.poll_passed ? 'yes' : 'no';
  const [expanded, setExpanded] = useState(false);
  const scrollView = useRef<ScrollView | null>(null);
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Gesetzesentwurf</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon style={styles.closeIcon} icon={ClearIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollView} scrollEnabled={expanded}>
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
            <VoteTag vote={candidateAnswer} />
          </View>
          <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
        </View>
        <View style={styles.votesContainer}>
          <ScrollView style={styles.table} horizontal>
            <View style={styles.tableVoteColumn}>
              {details &&
                details.map((detail: ApiPollDetail, index: number) => (
                  <VoteTag
                    key={index}
                    style={styles.tableVoteTag}
                    vote={'yes'}
                  />
                ))}
            </View>
            <View style={styles.tableTotalColumn}>
              <Tag style={styles.tableTag} content="Gesamt" uppercase />
              {details &&
                details.map((detail, index) => (
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
            {details &&
              details.map(partyVote => (
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
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    flex: 1,
    color: Colors.foreground,
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  closeIcon: {
    width: 28,
    height: 28,
    color: Colors.foreground,
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

export default PollDetails;
