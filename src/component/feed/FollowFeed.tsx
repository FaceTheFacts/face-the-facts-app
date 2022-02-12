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
  PoliticianInfo,
  SpeechTab,
  SpeechRowContent,
} from './FeedRowContent';
import FeedRow from '../FeedRow';
import {useQueries} from 'react-query';
import {fetch_api, request} from '../../logic/fetch';
import {
  ApiPoliticianProfile,
  SpeechResponse,
  ApiSpeechData,
} from '../../logic/api';

type ValueOf<T> = T[keyof T];

interface TabEntities {
  poll: PollTab;
  sideJob: SideJobTab;
  speech: SpeechTab;
}

type Row = PollTab | SideJobTab | SpeechTab;

interface Tab<T extends ValueOf<TabEntities>> {
  type: keyof TabEntities;
  content: T;
}

interface FollowFeedProps {
  setSelected: (value: string) => void;
  showPolls: boolean;
  showSideJobs: boolean;
  showSpeeches: boolean;
  showArticles: boolean;
}

const FollowFeed = ({
  setSelected,
  showPolls,
  showSideJobs,
  showSpeeches,
}: FollowFeedProps) => {
  const data = useContext(DataContext);
  const [visibleCount, setVisibleCount] = useState(20);
  const [tabs, setTabs] = useState<Tab<Row>[]>([]);
  const [visibleTabs, setVisibleTabs] = useState<Tab<Row>[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);

  const politicianQueries = useQueries(
    Array.from(followedIds).map(politicianId => {
      return {
        queryKey: ['politician', politicianId],
        queryFn: () =>
          fetch_api<SpeechResponse>(
            `politician/${politicianId}?sidejobs_end=100&votes_end=100`,
          ),
        staleTime: 60 * 10000000, // 10000 minute = around 1 week
        cacheTime: 60 * 10000000,
      };
    }),
  );

  const isProfileLoading = politicianQueries.some(query => query.isLoading);

  const speechQueries = useQueries(
    Array.from(followedIds).map(politicianId => {
      return {
        queryKey: ['politician:speech', politicianId],
        queryFn: () =>
          request<any>(
            `https://de.openparliament.tv/api/v1/search/media?abgeordnetenwatchID=${politicianId}&page[size]=100&sort=date-desc`,
          ),
        staleTime: 60 * 10000000, // 10000 minute = around 1 week
        cacheTime: 60 * 10000000,
      };
    }),
  );

  const isSpeechLoading = speechQueries.some(query => query.isLoading);

  useEffect(() => {
    const profilesLoaded =
      !isProfileLoading && politicianQueries.length === followedIds.size;

    const speechesLoaded =
      !isSpeechLoading && politicianQueries.length === followedIds.size;

    if (profilesLoaded && speechesLoaded) {
      let sideJobTabs: Tab<SideJobTab>[] = [];
      const pollsMap: Map<number, Tab<PollTab>> = new Map();
      const profilesMap: Map<number, ApiPoliticianProfile> = new Map();

      politicianQueries.forEach(query => {
        // @ts-ignore
        const profile: ApiPoliticianProfile = query.data;
        profilesMap.set(profile.id, profile);
        const politician: PoliticianInfo = {
          id: profile.id,
          label: profile.label,
        };

        profile.sidejobs.forEach(sideJob => {
          const sideJobTab: SideJobTab = {
            politicians: [politician],
            ...sideJob,
          };
          sideJobTabs.push({
            type: 'sideJob',
            content: sideJobTab,
          });
        });

        const pollsInVote: Set<number> = new Set();
        profile.votes_and_polls.forEach(voteAndPoll => {
          pollsInVote.add(voteAndPoll.Vote.poll_id);
        });

        profile.votes_and_polls.forEach(voteAndPoll => {
          const pollId = voteAndPoll.Poll.id;
          if (pollsInVote.has(pollId)) {
            const poll: Tab<PollTab> = pollsMap.get(pollId) ?? {
              type: 'poll',
              content: {
                ...voteAndPoll,
                created: voteAndPoll.Poll.field_poll_date,
                politicians: [],
              },
            };
            poll.content.politicians.push(politician);
            pollsMap.set(pollId, poll);
          }
        });
      });

      let speechTabs: Tab<SpeechTab>[] = [];
      speechQueries.forEach(query => {
        // @ts-ignore
        const speeches: ApiSpeechData[] = query.data.data;
        speeches.forEach(speech => {
          const title = speech.relationships.agendaItem.data.attributes.title;
          const politicianId =
            speech.relationships.people.data[0].attributes.additionalInformation
              .abgeordnetenwatchID;

          const profile = profilesMap.get(Number(politicianId))!;
          const politician: PoliticianInfo = {
            id: profile.id,
            label: profile.label,
          };

          const speechTab: Tab<SpeechTab> = {
            type: 'speech',
            content: {
              politicians: [politician],
              videoFileURI: speech.attributes.videoFileURI,
              title,
              created: speech.attributes.dateEnd,
            },
          };
          speechTabs.push(speechTab);
        });
      });

      const pollTabs = Array.from(pollsMap.values());
      const allTabs = [...pollTabs, ...sideJobTabs, ...speechTabs];
      allTabs.sort(
        (a, b) =>
          new Date(b.content.created).getTime() -
          new Date(a.content.created).getTime(),
      );

      if (allTabs.length > 0) {
        setTabs(allTabs);
        setVisibleTabs(allTabs.slice(0, 20));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileLoading, isSpeechLoading, followedIds]);

  if (followedIds.size < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.header4}>
          Folge Politikern, um Neues über sie zu erfahren.
        </Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setSelected('politicians')}>
          <Text style={styles.header4}>Politiker suchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTab = (tab: Tab<Row>, index: number) => {
    switch (tab.type) {
      case 'poll':
        return (
          showPolls && (
            <FeedRow
              key={index}
              politicians={tab.content.politicians}
              desc={(tab.content as PollTab).Poll.label}>
              <PollRowContent poll={tab.content as PollTab} />
            </FeedRow>
          )
        );
      case 'sideJob':
        return (
          showSideJobs && (
            <FeedRow
              key={index}
              politicians={tab.content.politicians}
              desc={(tab.content as SideJobTab).label}>
              <SideJobRowContent sideJob={tab.content as SideJobTab} />
            </FeedRow>
          )
        );
      case 'speech':
        return (
          showSpeeches && (
            <FeedRow
              key={index}
              politicians={tab.content.politicians}
              desc={(tab.content as SpeechTab).title}>
              <SpeechRowContent speech={tab.content as SpeechTab} />
            </FeedRow>
          )
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {visibleTabs.map((tab, index) => renderTab(tab, index))}
        {tabs.length > visibleCount && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => {
              setVisibleCount(visibleCount + 20);
              setVisibleTabs(tabs.slice(0, visibleCount));
            }}>
            <Text style={styles.showMoreText}>mehr anzeigen</Text>
          </TouchableOpacity>
        )}
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
