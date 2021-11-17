import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import PollRow, {Poll} from './row/PollRow';

interface FollowFeedProps {
  setSelected: (value: string) => void;
}

const FollowFeed = (props: FollowFeedProps) => {
  const data = useContext(DataContext);
  const [visibleCount, setVisibleCount] = useState(20);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [visiblePolls, setVisiblePolls] = useState<Poll[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<number> | null>(null);

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);

  useEffect(() => {
    if (followedIds) {
      const pollsMap: Map<string, Poll> = new Map();
      for (const id of followedIds) {
        const politician = data.lookupPolitician(id.toString());
        if (!politician) {
          return;
        }
        const {votes} = data.lookupPolitician(id.toString())!;
        const selPolls = data.polls.filter(poll => poll.id in votes!);
        for (const selPoll of selPolls) {
          const poll: Poll = pollsMap.get(selPoll.id) ?? {
            id: selPoll.id,
            title: selPoll.title,
            participants: [],
            date: selPoll.date,
          };
          poll.participants.push(politician);
          pollsMap.set(selPoll.id, poll);
        }
      }
      const allPolls = Array.from(pollsMap.values());
      allPolls.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setPolls(allPolls);
      setVisiblePolls(allPolls.slice(0, 20));
    }
  }, [followedIds, data]);

  if (!followedIds || followedIds.size < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.header4}>
          Folge Politikern, um Neues über sie zu erfahren.
        </Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => props.setSelected('scanner')}>
          <Text style={styles.header4}>Politiker suchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {visiblePolls.map(poll => (
          <PollRow poll={poll} />
        ))}
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => {
            setVisibleCount(visibleCount + 20);
            setVisiblePolls(polls.slice(0, visibleCount));
          }}>
          <Text style={styles.showMoreText}>mehr anzeigen</Text>
        </TouchableOpacity>
      </ScrollView>
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
  searchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.white40,
    marginTop: 18,
  },
  showMoreButton: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  showMoreText: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default FollowFeed;
