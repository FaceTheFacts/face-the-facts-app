import React from 'react';
import {ScrollView, StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import BackButton from '../component/BackButton';
import {ApiNews, IPoliticianContext} from '../logic/api';
import {checkPreviousMonth, formatDate, formatMonth} from '../utils/date';
import NewsScreenCard from '../component/news/NewsScreenCard';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';

export interface NewsViewProps {
  route: RouteProp<{params: {politician: IPoliticianContext}}, 'params'>;
}

const NewsView = ({route}: NewsViewProps) => {
  const {politician} = route.params;
  const {data: newsData, status: status} = useQuery<ApiNews | undefined, Error>(
    `news:${politician.profile?.id}`,
    () =>
      fetch_api<ApiNews>(
        `politician/${politician.profile?.id}/news?page=1&size=100`,
      ),
  );
  let news = politician.news;
  if (status === 'success') {
    news = newsData;
  }
  console.log(news);
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
      <View style={styles.separatorLine} />
      <ScrollView style={styles.container}>
        {news?.items.map((newsItem, index) => (
          <>
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
                key={index}
                title={newsItem.title}
                date={formatDate(newsItem.published)}
                image={newsItem.images}
                url={newsItem.url}
                source={newsItem.source}
              />
            </View>
          </>
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
    height: 55,
    backgroundColor: Colors.cardBackground,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  monthContainer: {
    width: 111,
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
  },
});

export default NewsView;
