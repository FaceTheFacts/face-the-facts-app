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
import {
  PollTab,
  PollRowContent,
  SideJobTab,
  SideJobRowContent,
} from './FeedRowContent';
import FeedRow from '../FeedRow';

type ValueOf<T> = T[keyof T];

interface TabEntities {
  poll: PollTab;
  sideJob: SideJobTab;
}

type Row = PollTab | SideJobTab;

interface Tab<T extends ValueOf<TabEntities>> {
  type: keyof TabEntities;
  content: T;
}

interface FollowFeedProps {
  setSelected: (value: string) => void;
}

const FollowFeed = (props: FollowFeedProps) => {
  const data = useContext(DataContext);
  const [visibleCount, setVisibleCount] = useState(20);
  const [tabs, setTabs] = useState<Tab<Row>[]>([]);
  const [visibleTabs, setVisibleTabs] = useState<Tab<Row>[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<number> | null>(null);

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);

  useEffect(() => {
    if (followedIds) {
      let allTabs: Tab<Row>[] = [];
      const pollsMap: Map<string, Tab<PollTab>> = new Map();
      const sideJobs: Tab<SideJobTab>[] = [];
      for (const id of followedIds) {
        const politician = data.lookupPolitician(id.toString());
        if (!politician) {
          continue;
        }
        politician.sideJobs?.forEach(sideJob => {
          if (sideJob.date) {
            const newSideJob: Tab<SideJobTab> = {
              type: 'sideJob',
              content: {
                ...sideJob,
                politicians: [politician],
              },
            };
            sideJobs.push(newSideJob);
          }
        });
        const {votes} = data.lookupPolitician(id.toString())!;
        const selPolls = data.polls.filter(poll => poll.id in votes!);
        for (const selPoll of selPolls) {
          const poll: Tab<PollTab> = pollsMap.get(selPoll.id) ?? {
            type: 'poll',
            content: {
              id: selPoll.id,
              title: selPoll.title,
              politicians: [],
              date: selPoll.date,
            },
          };
          poll.content.politicians.push(politician);
          pollsMap.set(selPoll.id, poll);
        }
      }
      const allPolls = Array.from(pollsMap.values());
      allTabs = [...allPolls, ...sideJobs];
      allTabs.sort(
        (a, b) =>
          new Date(b.content.date!).getTime() -
          new Date(a.content.date!).getTime(),
      );
      setTabs(allTabs);
      setVisibleTabs(allTabs.slice(0, 20));
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

  const renderTab = (tab: Tab<Row>) => {
    switch (tab.type) {
      case 'poll':
        return (
          <FeedRow
            politicians={tab.content.politicians}
            desc={(tab.content as PollTab).title}>
            <PollRowContent poll={tab.content as PollTab} />
          </FeedRow>
        );
      case 'sideJob':
        return (
          <FeedRow
            politicians={tab.content.politicians}
            desc={(tab.content as SideJobTab).job}>
            <SideJobRowContent sideJob={tab.content as SideJobTab} />
          </FeedRow>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {visibleTabs.map(tab => renderTab(tab))}
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => {
            setVisibleCount(visibleCount + 20);
            setVisibleTabs(tabs.slice(0, visibleCount));
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
