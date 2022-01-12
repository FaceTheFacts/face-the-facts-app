import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import CardPolitician from '../CardPolitician';

interface SpeechCardProps {
  politicianId?: number;
  desc: string;
  title: string;
  date: string;
  cardHeight: number;
}

const SpeechCard = ({
  politicianId,
  desc,
  title,
  date,
  cardHeight,
}: SpeechCardProps) => {
  return (
    <View style={[styles.container, {height: cardHeight}]}>
      {politicianId && (
        <>
          <CardPolitician politicianId={politicianId} />
          <View style={styles.separatorLine} />
        </>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.descText}>{title}</Text>
        <Text style={styles.descText}>{desc}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 266,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  descText: {
    fontSize: 13,
    lineHeight: 15.73,
    color: Colors.baseWhite,
  },
  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
    alignSelf: 'flex-end',
  },
});

export default SpeechCard;
