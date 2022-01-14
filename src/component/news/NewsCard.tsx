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
    <TouchableOpacity onPress={() => Linking.openURL(url!)}>
      <View style={styles.container}>
        <View>
          <NewsPicture source={source} image={image} width={191} height={105} />
          <View style={styles.iconContainer}>
            <NewsIcon source={source} />
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 191,
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    marginRight: 8,
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
