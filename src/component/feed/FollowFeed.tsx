import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import PollRow, {Poll} from './row/PollRow';

interface FollowFeedProps {
  setSelected: (value: string) => void;
}

const FollowFeed = (props: FollowFeedProps) => {
  const data = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number> | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    if (followedIds) {
      const pollsMap: Map<string, Poll> = new Map();
      for (const id of followedIds) {
        const politician = data.lookupPolitician(id.toString());
        if (!politician) {
          return;
        }
        const {votes} = data.lookupPolitician(id.toString())!;
        const visiblePolls = data.polls.filter(poll => poll.id in votes!);
        for (const visiblePoll of visiblePolls) {
          const poll: Poll = pollsMap.get(visiblePoll.id) ?? {
            id: visiblePoll.id,
            title: visiblePoll.title,
            participants: [],
            date: visiblePoll.date,
          };
          poll.participants.push(politician);
          pollsMap.set(visiblePoll.id, poll);
        }
      }
      const newPolls = Array.from(pollsMap.values());
      newPolls.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      // setPolls(newPolls.slice(0, 15));
      setPolls(newPolls);
    }
  }, [followedIds, data]);

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);

  if (!followedIds || followedIds.size < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.header4}>
          Folge Politikern, um Neues über sie zu erfahren.
        </Text>
        <TouchableOpacity
          style={styles.search_btn}
          onPress={() => props.setSelected('scanner')}>
          <Text style={styles.header4}>Politiker suchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={item => item.id}
        renderItem={({item}) => <PollRow poll={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  header4: {
    color: Colors.foreground,
    fontSize: 13,
    fontWeight: '600',
  },
  search_btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.white40,
    marginTop: 18,
  },
});

export default FollowFeed;
