import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {ApiParty} from '../logic/api';
import {Colors} from '../theme';
import {formatDate} from '../utils/util';
import PoliticianCard from './politician/PoliticianCard';
//import CardPolitician from '../CardPolitician';

interface SideJobCardProps {
  politicianId?: number;
  politicianName?: string;
  party?: ApiParty;
  date: string;
  label: string;
  organization: string;
  income: string;
  fromView?: boolean;
}

const SideJobCard = ({
  politicianId,
  politicianName,
  party,
  date,
  label,
  organization,
  income,
  fromView,
}: SideJobCardProps) => {
  const {width} = useWindowDimensions();
  const cardWidth = fromView ? width - 24 : width * 0.7;
  return (
    <View
      style={
        politicianId
          ? [styles.container, {width: cardWidth}]
          : [styles.container, styles.profile]
      }>
      {politicianId && politicianName && party && (
        <>
          <PoliticianCard
            politicianId={politicianId}
            politicianName={politicianName}
            party={party}
          />
          <View style={styles.separatorLine} />
        </>
      )}

      <View style={styles.cardContainer}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {politicianId && !fromView ? (
          <Text
            style={styles.descText}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {label}
          </Text>
        ) : (
          <Text style={styles.descText}>{label}</Text>
        )}

        <Text style={styles.orgText}>{organization}</Text>
        <View style={styles.separatorLine} />
        <Text style={styles.dateText}>{income ? income : 'ehrenamtlich'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 8,
  },
  profile: {
    marginBottom: 12,
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
    lineHeight: 13.31,
    color: Colors.white70,
  },
});

export default SideJobCard;
