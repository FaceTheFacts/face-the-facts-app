import {NavigationContext} from '@react-navigation/native';
import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {Colors} from '../../theme';
import {ApiPaginatedData, ApiSpeechBundestag} from '../../logic/api';
import {formatDate} from '../../utils/util';
import SpeechCard from './SpeechCard';

interface SpeechCarouselProps {
  speeches: ApiPaginatedData<ApiSpeechBundestag>;
}

const SpeechCarousel = ({speeches}: SpeechCarouselProps) => {
  const navigator = useContext(NavigationContext);
  const {width} = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Reden</Text>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => {
            navigator?.navigate('DashboardSpeeches', {
              speeches: speeches,
            });
          }}>
          <Text style={styles.btnText}>mehr</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainerContent}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}>
        {speeches.items.map((speech, index) => (
          <SpeechCard
            key={index}
            politicianId={speech.speaker.id}
            politicianName={speech.speaker.label}
            party={speech.speaker.party}
            title={speech.title}
            date={formatDate(speech.date)}
            video={speech.videoFileURI}
            cardHeight={143}
            cardWidth={width * 0.71}
            verticalScroll
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  moreBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  scrollContainerContent: {
    paddingRight: 24,
  },
});

export default SpeechCarousel;
