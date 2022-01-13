import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ApiPoll, ApiVote} from '../../logic/api';
import VoteTag from '../utils/VoteTag';
import {pollResultLabels} from '../../view/PollDetailsView';
import {Colors} from '../../theme';
import {PollResult, Vote} from '../../logic/data';
import {NavigationContext} from '@react-navigation/native';

export interface PollCardProps {
  style?: StyleProp<ViewStyle>;
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote: Vote;
}

const PollCard = ({style, poll, vote, candidateVote}: PollCardProps) => {
  const navigator = useContext<any>(NavigationContext)!;
  const pollResult: PollResult = poll.poll_passed ? 'yes' : 'no';

  return (
    <TouchableOpacity
      key={poll.id}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        navigator.push('PollDetailsScreen', {
          poll,
          vote,
          candidateVote,
        });
      }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {poll.label}
        </Text>
        <VoteTag vote={candidateVote} />
      </View>
      <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.inactive,
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    overflow: 'hidden',
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginRight: 8,
  },
  result: {
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
    opacity: 0.5,
  },
  votesContainer: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  vote: {
    height: 6,
  },
});

export default PollCard;
