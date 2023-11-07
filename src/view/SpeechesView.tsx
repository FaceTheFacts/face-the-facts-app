import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import SpeechCard from '../component/speech/SpeechCard';
import BackButton from '../component/BackButton';
import {ApiSpeeches} from '../logic/api';
import {checkPreviousMonth, formatDate, formatMonth} from '../utils/util';
import {useInfiniteQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import SkeletonDashboardSpeeches from '../component/skeleton/SkeletonSpeechesDashboard';
import ErrorCard from '../component/Error';
import {RootStackParamList} from './RootStackParams';

export interface SpeechesViewProps {
  route: RouteProp<RootStackParamList, 'Speeches'>;
}

const SpeechesView = ({route}: SpeechesViewProps) => {
  const {politician} = route.params;
  const {width} = useWindowDimensions();
  const fetchSpeeches = (pageParam: number) =>
    fetch_api<ApiSpeeches>(
      `politician/${politician?.profile?.id}/speeches?page=${pageParam}`,
    );
  const {
    data: speeches,
    isError,
    isLoading,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<ApiSpeeches | undefined, Error>(
    `speechesView:${politician?.profile?.id}`,
    ({pageParam = 1}) => fetchSpeeches(pageParam),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
      placeholderData: {
        pages: [politician.speeches],
        pageParams: [],
      },
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) =>
        !lastPage?.is_last_page && pages.length + 1,
    },
  );
  return isLoading ? (
    <SkeletonDashboardSpeeches />
  ) : isError ? (
    <ErrorCard />
  ) : (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Reden</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isSuccess &&
          speeches?.pages.map((page, pageIndex) =>
            page?.items.map((speech, speechIndex) => (
              <View key={pageIndex + speechIndex}>
                {speechIndex === 0 && pageIndex === 0 ? (
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>{formatMonth(speech.date)}</Text>
                  </View>
                ) : pageIndex !== 0 && speechIndex === 0 ? (
                  checkPreviousMonth(
                    speeches.pages[pageIndex - 1]?.items[
                      speeches.pages[pageIndex - 1]!.items.length - 1
                    ].date,
                    speech.date,
                  ) && (
                    <View style={styles.monthContainer}>
                      <Text style={styles.month}>
                        {formatMonth(speech.date)}
                      </Text>
                    </View>
                  )
                ) : (
                  checkPreviousMonth(
                    page.items[speechIndex - 1].date,
                    speech.date,
                  ) && (
                    <View style={styles.monthContainer}>
                      <Text style={styles.month}>
                        {formatMonth(speech.date)}
                      </Text>
                    </View>
                  )
                )}
                <View style={styles.speechCardContainer}>
                  <SpeechCard
                    politicianName={politician.profile?.label!}
                    title={speech.title}
                    date={formatDate(speech.date)}
                    video={speech.videoFileURI}
                    cardHeight={87}
                    cardWidth={width - 24}
                  />
                </View>
              </View>
            )),
          )}
        {hasNextPage && !isFetchingNextPage && (
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
    flex: 1,
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
  speechCardContainer: {
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

export default SpeechesView;
