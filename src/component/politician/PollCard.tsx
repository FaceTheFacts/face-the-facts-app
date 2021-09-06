import React, {useRef} from 'react';
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Poll, PollResult, Vote} from '../../logic/data';
import {Modalize} from 'react-native-modalize';
import VoteTag from '../utils/VoteTag';
import PollDetails, {pollResultLabels} from './PollDetails';
import {Colors} from '../../theme';
import BottomSheet from '../utils/BottomSheet';

export interface PollCardProps {
  style?: StyleProp<ViewStyle>;
  poll: Poll;
  candidateVote: Vote;
}

const PollCard = ({style, poll, candidateVote}: PollCardProps) => {
  const [yesVotes, noVotes] = poll.votes;
  const pollResult: PollResult = yesVotes > noVotes ? 'yes' : 'no';
  const modal = useRef<Modalize>(null);

  return (
    <TouchableOpacity
      key={poll.id}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => modal.current!.open()}>
      <Text style={styles.title} numberOfLines={1}>
        {poll.title}
      </Text>
      <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
      <View style={styles.separator} />
      <View style={styles.voteContainer}>
        <Text style={styles.voteLabel}>Kandidat:in stimmte mit:</Text>
        <VoteTag vote={candidateVote} />
      </View>
      <BottomSheet
        modalRef={modal}
        modalStyle={{backgroundColor: Colors.background}}
        modalHeight={600}>
        <PollDetails
          poll={poll}
          candidateAnswer={candidateVote}
          onClose={() => modal.current!.close()}
        />
      </BottomSheet>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    overflow: 'hidden',
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: Colors.inactive,
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  result: {
    color: Colors.foreground,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    opacity: 0.8,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteLabel: {
    flex: 1,
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
    opacity: 0.6,
    marginRight: 8,
  },
});

export default PollCard;
