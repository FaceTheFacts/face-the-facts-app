import React, {useRef} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Poll, PollResult, Vote} from '../../logic/data';
import {Modalize} from 'react-native-modalize';
import VoteTag, {voteColors} from '../utils/VoteTag';
import PollDetails, {pollResultLabels} from './PollDetails';
import {Colors} from '../../theme';
import {possibleVotes} from '../politician/PoliticianOverview';
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
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {poll.title}
        </Text>
        <VoteTag vote={candidateVote} />
      </View>
      <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
      <View style={styles.votesContainer}>
        {possibleVotes.map((vote, index) => (
          <View
            key={vote}
            style={StyleSheet.flatten([
              styles.vote,
              {
                flex: poll.votes[index],
                backgroundColor: voteColors[vote],
              },
            ])}
          />
        ))}
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
