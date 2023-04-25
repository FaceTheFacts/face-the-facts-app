import {ScrollView, StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import BackButton from '../component/BackButton';
import {ApiNews} from '../logic/api';
import {checkPreviousMonth, formatDate, formatMonth} from '../utils/util';
import NewsScreenCard from '../component/news/NewsScreenCard';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import ErrorCard from '../component/Error';
import {RootStackParamList} from './RootStackParams';

export interface NewsViewProps {
  route: RouteProp<RootStackParamList, 'News'>;
}

const NewsView = ({route}: NewsViewProps) => {
  const {politician} = route.params;
  const {
    data: newsData,
    status: status,
    isError,
  } = useQuery<ApiNews | undefined, Error>(
    `newsScreen:${politician.profile?.id}`,
    () =>
      fetch_api<ApiNews>(
        `politician/${politician.profile?.id}/news?page=1&size=100`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  let news = politician.news;
  if (status === 'success') {
    news = newsData;
  }

  if (isError) {
    return <ErrorCard />;
  }
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Artikel</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {news?.items.map((newsItem, index) => (
          <View key={index}>
            {index !== 0 ? (
              checkPreviousMonth(
                newsItem.published,
                news!.items[index - 1].published,
              ) && (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>
                    {formatMonth(newsItem.published)}
                  </Text>
                </View>
              )
            ) : (
              <View style={styles.monthContainer}>
                <Text style={styles.month}>
                  {formatMonth(newsItem.published)}
                </Text>
              </View>
            )}
            <View style={styles.newsCardContainer}>
              <NewsScreenCard
                title={newsItem.title}
                date={formatDate(newsItem.published)}
                image={newsItem.images}
                url={newsItem.url}
                source={newsItem.source}
              />
            </View>
          </View>
        ))}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  subtitle: {
    color: Colors.foreground,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  newsCardContainer: {
    marginVertical: 6,
    alignSelf: 'center',
    height: 104,
  },
});

export default NewsView;
