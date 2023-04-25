import React, {useState, useContext, useEffect, useMemo} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import {ApiPoliticianProfile, Tab, Row, PoliticianInfo} from '../../logic/api';
import EmptyFeedCard from './EmptyFeedCard';
import FeedMoreButton from './FeedMoreButton';
import FeedMonthHeader from './FeedMonthHeader';
import FeedTabContent from './FeedTabContent';
import {useFetchFollowFeed} from '../../queries/useFetchFollowFeed';
import {
  processPolls,
  processSideJobs,
  processSpeeches,
  sortTabsByDate,
  groupTabsByMonth,
} from '../../logic/followfeed';

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
  const [tabs] = useState<Tab<Row>[]>([]);
  const [page, setPage] = useState<number>(1);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());

  const [, setProfilesMap] = useState(new Map<number, ApiPoliticianProfile>());
  const [allTabs, setAllTabs] = useState<Tab<Row>[]>([]);

  const visibleTabs = useMemo(() => {
    // Compute the visibleTabs value only when the allTabs and visibleCount values change
    return allTabs.slice(0, visibleCount);
  }, [allTabs, visibleCount]);

  const sections = useMemo(() => {
    // Compute the sections value only when the visibleTabs value changes
    return groupTabsByMonth(visibleTabs);
  }, [visibleTabs]);

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);
  const {politicianQueries, speechQueries} = useFetchFollowFeed(
    followedIds,
    page,
    showSpeeches,
  );

  const isProfileLoading = politicianQueries.some(query => query.isLoading);
  const isSpeechLoading = speechQueries.some(query => query.isLoading);

  useEffect(() => {
    if (!isProfileLoading && !isSpeechLoading && followedIds.size > 0) {
      const newProfilesMap = new Map<number, ApiPoliticianProfile>();
      const newAllTabs: Tab<Row>[] = [];
      politicianQueries.forEach(query => {
        if (query.data) {
          const profile: ApiPoliticianProfile = query.data;
          newProfilesMap.set(profile.id, profile);
          const politician: PoliticianInfo = {
            id: profile.id,
            label: profile.label,
            party: profile.party,
          };
          if (showSideJobs) {
            const sideJobTabs = processSideJobs(profile, politician);
            newAllTabs.push(...sideJobTabs);
          }
          if (showPolls) {
            const pollTabs = processPolls(profile, politician);
            newAllTabs.push(...pollTabs);
          }
        }
      });
      if (showSpeeches) {
        const speechTabs = processSpeeches(speechQueries, newProfilesMap);
        newAllTabs.push(...speechTabs);
      }

      if (newAllTabs.length > 0) {
        const sortedTabs = sortTabsByDate(newAllTabs);
        setAllTabs(sortedTabs);
        setProfilesMap(newProfilesMap);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileLoading, isSpeechLoading, followedIds]);

  if (followedIds.size < 1) {
    return <EmptyFeedCard setSelected={setSelected} />;
  }
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <FeedTabContent index={index} tab={item} />
        )}
        ListFooterComponent={
          <FeedMoreButton
            tabs={tabs}
            page={page}
            visibleCount={visibleCount}
            setPage={setPage}
            setVisibleCount={setVisibleCount}
          />
        }
        renderSectionHeader={({section: {title}}) => (
          <FeedMonthHeader sectionTitle={title} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separatorLine} />}
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
    paddingTop: 12,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
});

export default FollowFeed;
