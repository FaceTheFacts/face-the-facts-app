import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import Icon from '../component/Icon';
import BackButton from '../component/BackButton';
import {ApiPollBundestag} from '../logic/api';
import {useInfiniteQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {checkPreviousMonth, formatMonth, topicTypes} from '../utils/util';
import {ClearIcon, FilterIcon} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import PollFilter from '../component/poll/PollFilter';
import DashboardPollCard from '../component/poll/DashboardPollCard';
import {RootStackParamList} from './RootStackParams';

export interface DashboardPollsViewProps {
  route: RouteProp<RootStackParamList, 'DashboardPolls'>;
  eu?: boolean;
}

const DashboardPollsView = ({route, eu}: DashboardPollsViewProps) => {
  const polls = route.params.polls;
  const [filter, setFilter] = useState<number[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const modal = useRef<Modalize>(null);
  useEffect(() => {
    let query = '';
    filter.forEach(filterItem => {
      query += `filters=${filterItem + 1}&`;
    });
    setFilterQuery(query);
  }, [filter]);

  let fetchallPollsQuery: any;

  if (eu) {
    fetchallPollsQuery = (pageParam = 1) =>
      fetch_api<ApiPollBundestag>(
        `eu/allpolls?page=${pageParam}&${filterQuery}`,
      );
  } else {
    fetchallPollsQuery = (pageParam = 1) =>
      fetch_api<ApiPollBundestag>(
        `bundestag/allpolls?page=${pageParam}&${filterQuery}`,
      );
  }
  const {
    data: pollsData,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage,
  } = useInfiniteQuery<ApiPollBundestag | undefined, Error>(
    `allpolls Bundestag: ${filterQuery}`,
    ({pageParam = 1}) => fetchallPollsQuery(pageParam),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
      keepPreviousData: true,
      getNextPageParam: (lastpage, pages) => {
        if (!lastpage?.last_page) {
          return pages?.length + 1;
        } else {
          return pages.length;
        }
      },
    },
  );
  if (isError) {
    <Text>Error ..</Text>;
  }

  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer} />
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => modal.current?.open()}>
            <Icon style={styles.icon} icon={FilterIcon} />
            <Text style={styles.filterText}>Filtern</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles.separatorLine} />
      </View>
      {filter.length > 0 && (
        <View style={styles.filterCategoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filter.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryBtn}
                onPress={() => {
                  setFilter(filter.filter(value => value !== topic));
                }}>
                <Text style={styles.categoryText}>
                  {topicTypes[topic + 1].label}
                </Text>
                <Icon style={styles.clearIcon} icon={ClearIcon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <ScrollView style={styles.container}>
        {isLoading &&
          polls.map((poll, index) => (
            <View key={index}>
              {index !== 0 ? (
                checkPreviousMonth(
                  poll.poll.field_poll_date,
                  polls[index - 1].poll.field_poll_date,
                ) && (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>
                      {formatMonth(poll.poll.field_poll_date)}
                    </Text>
                  </View>
                )
              ) : (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>
                    {formatMonth(poll.poll.field_poll_date)}
                  </Text>
                </View>
              )}
              <View style={styles.pollCardContainer}>
                <DashboardPollCard
                  key={index}
                  poll={poll.poll}
                  result={poll.result}
                  politicians={poll.politicians}
                  last_politician={poll.last_politician}
                />
              </View>
            </View>
          ))}
        {isSuccess &&
          pollsData &&
          pollsData?.pages.map((page, pageIndex) =>
            page?.data.map((poll, pollIndex) => (
              <View key={pageIndex + pollIndex}>
                {pollIndex !== 0 ? (
                  checkPreviousMonth(
                    pollsData.pages[pageIndex]!.data[pollIndex - 1].poll
                      .field_poll_date,
                    poll.poll.field_poll_date,
                  ) && (
                    <View style={styles.monthContainer}>
                      <Text style={styles.month}>
                        {formatMonth(poll.poll.field_poll_date)}
                      </Text>
                    </View>
                  )
                ) : pageIndex !== 0 ? (
                  checkPreviousMonth(
                    pollsData.pages[pageIndex - 1]!.data[
                      pollsData.pages[pageIndex - 1]!.data.length - 1
                    ].poll.field_poll_date,
                    poll.poll.field_poll_date,
                  ) && (
                    <View style={styles.monthContainer}>
                      <Text style={styles.month}>
                        {formatMonth(poll.poll.field_poll_date)}
                      </Text>
                    </View>
                  )
                ) : (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>
                      {formatMonth(poll.poll.field_poll_date)}
                    </Text>
                  </View>
                )}
                <View style={styles.pollCardContainer}>
                  <DashboardPollCard
                    poll={poll.poll}
                    result={poll.result}
                    politicians={poll.politicians}
                    last_politician={poll.last_politician}
                  />
                </View>
              </View>
            )),
          )}
        {isSuccess &&
          !pollsData?.pages[pollsData.pages.length - 1]?.last_page && (
            <TouchableOpacity onPress={() => fetchNextPage()}>
              <Text style={styles.moreButton}>mehr</Text>
            </TouchableOpacity>
          )}
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <PollFilter filter={filter} setFilter={setFilter} />
      </BottomSheet>
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
  },
  backButtonContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  filterContainer: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
  },
  filterBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  filterCategoryContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 20,
  },
  categoryText: {
    color: Colors.foreground,
    fontSize: 13,
    paddingRight: 12,
  },
  clearIcon: {
    color: Colors.foreground,
    width: 10,
    height: 10,
  },
  modalStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginRight: 8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(252, 252, 252, 0.25)',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicsContainer: {
    overflow: 'visible',
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  topicSelected: {
    backgroundColor: Colors.foreground,
  },
  topicLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  topicContentSelected: {
    color: Colors.cardBackground,
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
    lineHeight: 14.52,
    fontFamily: 'Inter',
    color: Colors.foreground,
    textTransform: 'uppercase',
  },
  pollCardContainer: {
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

export default DashboardPollsView;
