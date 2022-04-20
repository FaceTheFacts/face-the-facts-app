import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {PoliTrackImage} from '../../logic/api';
import {Colors} from '../../theme';
import NewsIcon from './NewsIcon';
import NewsPicture from './NewsPicture';

interface NewsCardProps {
  title: string;
  date: string;
  image: PoliTrackImage[];
  url: string;
  source: string;
}

const NewsCard = ({title, date, image, url, source}: NewsCardProps) => {
  const {width} = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[styles.container, {width: width * 0.51}]}
      onPress={() => Linking.openURL(url!)}>
      <View>
        <NewsPicture
          source={source}
          image={image}
          width={width * 0.51}
          height={105}
        />
        <View style={styles.iconContainer}>
          <NewsIcon source={source} />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.titleText} numberOfLines={3} ellipsizeMode={'tail'}>
          {title}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 4,
  },
  iconContainer: {
    position: 'absolute',
    padding: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    paddingTop: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    lineHeight: 15.73,
    color: Colors.baseWhite,
  },
  dateText: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
    alignSelf: 'flex-end',
  },
  icon: {
    width: 20,
    height: 20,
    color: Colors.background,
  },
});

export default NewsCard;
