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
import PollCard from '../component/poll/PollCard';
import Icon from '../component/Icon';
import BackButton from '../component/BackButton';
import {ApiVoteAndPoll, IPoliticianContext} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {checkPreviousMonth, formatMonth, topicTypes} from '../utils/util';
import {ClearIcon, FilterIcon} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import PollFilter from '../component/poll/PollFilter';

export interface PollsViewProps {
  route: RouteProp<{params: PollViewParams}, 'params'>;
}

type PollViewParams = {
  politician: IPoliticianContext;
};

const PollsView = ({route}: PollsViewProps) => {
  const [filter, setFilter] = useState<number[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const politician = route.params.politician;
  const politicianId = politician.profile?.id;
  const modal = useRef<Modalize>(null);
  useEffect(() => {
    let query = '';
    filter.forEach(filterItem => {
      query += `filters=${filterItem + 1}&`;
    });
    setFilterQuery(query);
  }, [filter]);

  const {
    data: polls,
    isLoading: pollsLoading,
    isSuccess: pollsSuccess,
  } = useQuery<ApiVoteAndPoll[] | undefined, Error>(
    `polls:${politicianId}-${filterQuery}`,
    () => fetch_api<ApiVoteAndPoll[]>(`polls/${politicianId}?${filterQuery}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

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
        {pollsLoading &&
          politician?.profile?.votes_and_polls.map((poll, index) => (
            <View key={index}>
              {index !== 0 ? (
                checkPreviousMonth(
                  poll.Poll.field_poll_date,
                  politician?.profile!.votes_and_polls[index - 1].Poll
                    .field_poll_date,
                ) && (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>
                      {formatMonth(poll.Poll.field_poll_date)}
                    </Text>
                  </View>
                )
              ) : (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>
                    {formatMonth(poll.Poll.field_poll_date)}
                  </Text>
                </View>
              )}
              <View style={styles.pollCardContainer}>
                <PollCard
                  key={poll.Poll.id}
                  poll={poll.Poll}
                  vote={poll.Vote}
                  candidateVote={poll.Vote.vote}
                  politician={politician.profile}
                />
              </View>
            </View>
          ))}
        {pollsSuccess &&
          polls &&
          polls.map((poll, index) => (
            <View key={index}>
              {index !== 0 ? (
                checkPreviousMonth(
                  poll.Poll.field_poll_date,
                  polls[index - 1].Poll.field_poll_date,
                ) && (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>
                      {formatMonth(poll.Poll.field_poll_date)}
                    </Text>
                  </View>
                )
              ) : (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>
                    {formatMonth(poll.Poll.field_poll_date)}
                  </Text>
                </View>
              )}
              <View style={styles.pollCardContainer}>
                <PollCard
                  key={poll.Poll.id}
                  poll={poll.Poll}
                  vote={poll.Vote}
                  candidateVote={poll.Vote.vote}
                  politician={politician.profile}
                />
              </View>
            </View>
          ))}
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
    paddingTop: 12,
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
});

export default PollsView;
