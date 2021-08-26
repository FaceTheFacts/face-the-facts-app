import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Poll, PollResult, Vote} from '../../logic/data';
import {Colors} from '../../theme';
import Icon from '../Icon';
import {ClearIcon} from '../../icons';
import VoteTag, {voteColors} from '../utils/VoteTag';
import Tag from '../utils/Tag';
import {possibleVotes} from './PoliticianOverview';
import PartyTag from '../PartyTag';
import {DataContext} from '../../logic/model';
import ReadMoreHTML from '../utils/ReadMoreHTML';

export const pollResultLabels: Record<PollResult, string> = {
  yes: 'Antrag angenommen',
  no: 'Antrag abgelehnt',
};

export interface PollDetailsProps {
  poll: Poll;
  candidateAnswer: Vote;
  onClose: () => void;
}

const PollDetails = ({poll, candidateAnswer, onClose}: PollDetailsProps) => {
  const data = useContext(DataContext);

  const [yesVotes, noVotes] = poll.votes;
  const pollResult: PollResult = yesVotes > noVotes ? 'yes' : 'no';

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Gesetzesentwurf</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon style={styles.closeIcon} icon={ClearIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{poll.title}</Text>
        <ReadMoreHTML baseStyle={styles.description} html={poll.description} />
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
            {possibleVotes.map(vote => (
              <VoteTag key={vote} style={styles.tableVoteTag} vote={vote} />
            ))}
          </View>
          <View style={styles.tableTotalColumn}>
            <Tag style={styles.tableTag} content="Gesamt" uppercase />
            {possibleVotes.map((vote, index) => (
              <Tag
                key={vote}
                style={styles.tableTag}
                content={poll.votes[index].toString()}
                backgroundColor={
                  vote === pollResult ? voteColors[vote] : Colors.background
                }
                spacing
                bold
              />
            ))}
          </View>
          {poll.participatedParties
            .map(
              (partyId, index) =>
                [
                  partyId,
                  poll.votes.slice((index + 1) * 4, (index + 1) * 4 + 4),
                ] as [string, number[]],
            )
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([partyId, votes]) => (
              <View key={partyId} style={styles.tablePartyColumn}>
                <PartyTag
                  style={styles.tableTag}
                  party={data.lookupParty(partyId)!}
                />
                {possibleVotes.map((vote, voteIndex) => (
                  <Tag
                    key={vote}
                    style={styles.tableTag}
                    content={votes[voteIndex].toString()}
                    backgroundColor={
                      vote === pollResult ? voteColors[vote] : Colors.background
                    }
                    spacing
                    bold
                  />
                ))}
              </View>
            ))}
        </ScrollView>
      </View>
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
