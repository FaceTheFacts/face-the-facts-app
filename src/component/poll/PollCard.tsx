import React, {useRef, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ApiPoll, ApiPollDetail, ApiVote} from '../../logic/api';
import {Modalize} from 'react-native-modalize';
import VoteTag, {voteColors} from '../utils/VoteTag';
import PollDetails, {pollResultLabels} from './PollDetails';
import {Colors} from '../../theme';
import BottomSheet from '../utils/BottomSheet';
import {PollResult, Vote} from '../../logic/data';
import {useQuery} from 'react-query';
import {fetch_api} from '../../logic/fetch';

export interface PollCardProps {
  style?: StyleProp<ViewStyle>;
  poll: ApiPoll;
  vote: ApiVote;
  candidateVote: Vote;
}

const PollCard = ({style, poll, vote, candidateVote}: PollCardProps) => {
  //const [yesVotes, noVotes] = poll.votes;
  const pollResult: PollResult = poll.poll_passed ? 'yes' : 'no';
  const modal = useRef<Modalize>(null);
  const [clicked, setClicked] = useState(false);

  const pollQuery = useQuery<Array<ApiPollDetail> | undefined, Error>(
    `poll-${poll.id}`,
    () => fetch_api<Array<ApiPollDetail>>(`poll/${poll.id}/details`),
    {enabled: false},
  );

  const handleClickOpen = () => {
    pollQuery.refetch();
    setClicked(true);
  };

  const handleClickClose = () => {
    modal.current!.close();
  };

  if (clicked && pollQuery.status === 'success') {
    console.log(pollQuery.data);
    modal.current!.open();
    setClicked(false);
  }

  return (
    <TouchableOpacity
      key={poll.id}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={handleClickOpen}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {poll.label}
        </Text>
        <VoteTag vote={candidateVote} />
      </View>
      <Text style={styles.result}>{pollResultLabels[pollResult]}</Text>
      <BottomSheet
        modalRef={modal}
        modalStyle={{backgroundColor: Colors.background}}
        modalHeight={600}>
        <PollDetails
          poll={poll}
          vote={vote}
          details={pollQuery.data}
          candidateAnswer={candidateVote}
          onClose={handleClickClose}
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
