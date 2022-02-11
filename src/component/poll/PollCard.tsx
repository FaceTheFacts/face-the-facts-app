import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ApiPoliticianProfile, ApiPoll, ApiVote} from '../../logic/api';
import VoteTag from '../utils/VoteTag';
import {Colors} from '../../theme';
import {PollResult, Vote} from '../../logic/data';
import {NavigationContext} from '@react-navigation/native';
import {formatDate} from '../../utils/util';

const pollResultLabels: Record<PollResult, string> = {
  yes: 'Antrag angenommen',
  no: 'Antrag abgelehnt',
};
export interface PollCardProps {
  style?: StyleProp<ViewStyle>;
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote: Vote;
  politician?: ApiPoliticianProfile;
}

const PollCard = ({
  style,
  poll,
  vote,
  candidateVote,
  politician,
}: PollCardProps) => {
  const navigator = useContext<any>(NavigationContext)!;
  const pollResult: PollResult = poll.poll_passed ? 'yes' : 'no';

  return (
    <TouchableOpacity
      key={poll.id}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        navigator.push('PollDetails', {
          poll,
          vote,
          candidateVote,
          politician,
        });
      }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {poll.label}
        </Text>
        <VoteTag vote={candidateVote} />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
        <Text style={styles.date}>{formatDate(poll.field_poll_date)}</Text>
      </View>
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
    opacity: 0.5,
    alignSelf: 'flex-end',
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
