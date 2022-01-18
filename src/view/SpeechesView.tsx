import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  useWindowDimensions,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import SpeechCard from '../component/speech/SpeechCard';
import BackButton from '../component/BackButton';
import {ApiSpeeches, IPoliticianContext} from '../logic/api';
import {checkPreviousMonth, formatDate, formatMonth} from '../utils/date';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface SpeechesViewProps {
  route: RouteProp<{params: {politician: IPoliticianContext}}, 'params'>;
}

const SpeechesView = ({route}: SpeechesViewProps) => {
  const {politician} = route.params;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const {width} = useWindowDimensions();
  const {data: speeches} = useQuery<ApiSpeeches | undefined, Error>(
    `speeches:${politician?.profile?.id}-${pageNumber}`,
    () =>
      fetch_api<ApiSpeeches>(
        `politician/${politician?.profile?.id}/speeches?page=${pageNumber}`,
      ),
    {keepPreviousData: true},
  );
  return (
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
      <View style={styles.separatorLine} />
      <ScrollView style={styles.container}>
        {politician?.speeches?.items.map((speech, index) => (
          <View key={index}>
            {index !== 0 ? (
              checkPreviousMonth(
                speech.date,
                politician?.speeches!.items[index + -1].date,
              ) && (
                <View style={styles.monthContainer}>
                  <Text style={styles.month}>{formatMonth(speech.date)}</Text>
                </View>
              )
            ) : (
              <View style={styles.monthContainer}>
                <Text style={styles.month}>{formatMonth(speech.date)}</Text>
              </View>
            )}
            <View style={styles.speechCardContainer}>
              <SpeechCard
                politician={politician.profile?.label!}
                title={speech.title}
                date={formatDate(speech.date)}
                video={speech.videoFileURI}
                cardHeight={87}
                cardWidth={width - 24}
              />
            </View>
          </View>
        ))}
        {!speeches?.is_last_page && (
          <TouchableOpacity onPress={() => setPageNumber(pageNumber + 1)}>
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
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(1,1,1,0.6)',
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
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default SpeechesView;
