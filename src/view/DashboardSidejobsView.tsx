import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../theme';
import SidejobCard from '../component/SideJobCard';
import BackButton from '../component/BackButton';
import {ApiPaginatedData, ApiSidejobsBundestag} from '../logic/api';
import {checkPreviousMonth, formatMonth} from '../utils/util';
import {useInfiniteQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {NavigationContext} from '@react-navigation/native';
import {DataContext} from '../logic/model';
import SkeletonDashboardSidejob from '../component/skeleton/SkeletonDashboardSidejob';

const DashboardSidejobView = () => {
  const navigator = useContext(NavigationContext);
  const database = useContext(DataContext);
  const fetchSidejobs = (pageParam: number) =>
    fetch_api<ApiPaginatedData<ApiSidejobsBundestag>>(
      `bundestag/allsidejobs?page=${pageParam}`,
    );
  const {
    data: sidejobsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    ApiPaginatedData<ApiSidejobsBundestag> | undefined,
    Error
  >('sidejobsView: Bundestag', ({pageParam = 1}) => fetchSidejobs(pageParam), {
    staleTime: 60 * 10000000, // 10000 minute = around 1 week
    cacheTime: 60 * 10000000,
    keepPreviousData: true,
    getNextPageParam: (lastPage, pages) =>
      !lastPage?.is_last_page && pages.length + 1,
  });

  if (isError) {
    return <Text>Error</Text>;
  }

  if (isLoading) {
    <SkeletonDashboardSidejob />;
  }
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Nebentätigkeiten</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
      <ScrollView style={styles.container}>
        {sidejobsData?.pages.map((page, pageIndex) =>
          page?.items.map((sidejob, sidejobIndex) => (
            <View key={pageIndex + sidejobIndex}>
              {sidejobIndex !== 0 ? (
                checkPreviousMonth(
                  sidejob.sidejob.created,
                  sidejobsData!.pages[pageIndex]!.items[sidejobIndex + -1]
                    .sidejob.created,
                ) && (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>
                      {formatMonth(sidejob.sidejob.created)}
                    </Text>
                  </View>
                )
              ) : (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>
                    {formatMonth(sidejob.sidejob.created)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.sidejobCardContainer}
                onPress={() => {
                  database.dbManager.pushHistoryItem(sidejob.politician.id);
                  navigator?.navigate('Politician', {
                    politicianId: sidejob.politician.id,
                    politicianName: sidejob.politician.label,
                    party: sidejob.politician.party,
                    toSideJobs: true,
                  });
                }}>
                <SidejobCard
                  politicianId={sidejob.politician.id}
                  politicianName={sidejob.politician.label}
                  party={sidejob.politician.party}
                  label={sidejob.sidejob.label}
                  date={sidejob.sidejob.created}
                  organization={sidejob.sidejob.sidejob_organization.label}
                  income={sidejob.sidejob.income_level}
                  fromView={true}
                />
              </TouchableOpacity>
            </View>
          )),
        )}
        {hasNextPage && (
          <TouchableOpacity onPress={() => fetchNextPage()}>
            <Text style={styles.moreButton}>mehr</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  iosSafeBottom: {
    flex: 0,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.cardBackground,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButtonContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 2,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
  },
  monthContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 6,
  },
  month: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: Colors.foreground,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  sidejobCardContainer: {
    alignSelf: 'center',
    marginVertical: 6,
  },
  moreButton: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    alignSelf: 'center',
  },
});

export default DashboardSidejobView;
