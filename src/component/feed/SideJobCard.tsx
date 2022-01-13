import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import CardPolitician from '../CardPolitician';

interface SideJobCardProps {
  politicianId: string;
  date: string;
  desc: string;
  organization: string;
  income: string;
}

const SideJobCard = ({
  politicianId,
  date,
  desc,
  organization,
  income,
}: SideJobCardProps) => {
  return (
    <View style={styles.container}>
      <CardPolitician politicianId={politicianId} />
      <View style={styles.separatorLine} />
      <View style={styles.cardContainer}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.descText}>{desc}</Text>
        <Text style={styles.orgText}>{organization}</Text>
        <View style={styles.separatorLine} />
        <Text style={styles.dateText}>{income}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 181,
    width: 265,
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
  cardContainer: {
    flex: 1,
  },
  descText: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 15.73,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
  orgText: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 13.31,
    fontWeight: '400',
    color: Colors.white70,
  },
  dateText: {
    fontSize: 11,
    color: Colors.white70,
  },
});

export default SideJobCard;
