import React, {useRef} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Colors} from '../../theme';
import Video from 'react-native-video';
import {ScrollView} from 'react-native-gesture-handler';

export interface SpeechPlayerProps {
  politician?: string;
  date: string;
  title: string;
  video: string;
}

const SpeechPlayer = ({politician, date, title, video}: SpeechPlayerProps) => {
  const {width} = useWindowDimensions();
  const ref = useRef<Video | null>(null);
  return (
    <>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{politician ? politician : 'Rede'}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View>
          <Text style={styles.description}>{title}</Text>
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.playerContainer}>
          <Video
            source={{uri: video}}
            style={[styles.backgroundVideo, {width: width - 32}]}
            controls={true}
            ref={ref}
            ignoreSilentSwitch="ignore"
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    paddingBottom: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.foreground,
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  date: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  description: {
    paddingHorizontal: 16,
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.4,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  playerContainer: {
    paddingTop: 0,
    padding: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backgroundVideo: {
    height: 193,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default SpeechPlayer;
