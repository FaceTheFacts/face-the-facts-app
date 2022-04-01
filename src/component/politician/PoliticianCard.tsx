import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {Colors} from '../../theme';
import PoliticianPicture from '../PoliticianPicture';
import {ApiParty} from '../../logic/api';
import PartyTag from '../PartyTag';
import {Vote} from '../../logic/api';
import VoteTag from '../utils/VoteTag';

interface PoliticianCardProps {
  politicianId: number;
  politicianName: string;
  party: ApiParty;
  vote?: Vote;
  styling?: StyleProp<ViewStyle>;
}

const PoliticianCard = ({
  politicianId,
  politicianName,
  party,
  vote,
  styling,
}: PoliticianCardProps) => {
  return (
    <View style={styling ? [styles.container, styling] : styles.container}>
      <View style={styles.politicianContainer}>
        <PoliticianPicture politicianId={politicianId} size={48} />
        <View style={styles.info}>
          <Text style={styles.nameText}>{politicianName}</Text>
          <PartyTag party={party} />
        </View>
      </View>
      {vote && (
        <View style={styles.voteContainer}>
          <VoteTag vote={vote} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  pollContainer: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
    padding: 12,
  },
  politicianContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 13,
    lineHeight: 16,
    color: Colors.baseWhite,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  voteContainer: {
    alignContent: 'center',
  },
});

export default PoliticianCard;
