import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
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
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url!)}
      style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <NewsPicture
          source={source}
          image={image}
          width={80}
          height={80}
          borderBottom={true}
        />
      </View>
      <View style={styles.contentContainer}>
        <NewsIcon source={source} />
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 351,
    height: 104,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
  imageContainer: {
    padding: 12,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 9,
    justifyContent: 'space-between',
  },
  titleText: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
    paddingRight: 12,
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
