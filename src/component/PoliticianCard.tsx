import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../theme';
import PoliticianPicture from './PoliticianPicture';
import {ApiPoliticianProfile} from '../logic/api';
import PartyTag from './PartyTag';
import {Vote} from '../logic/data';
import VoteTag from './utils/VoteTag';

interface CardPoliticianProps {
  politician: ApiPoliticianProfile;
  vote?: Vote;
}

const PoliticianCard = ({politician, vote}: CardPoliticianProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.politicianContainer}>
        <PoliticianPicture politicianId={politician.id} size={48} />
        <View style={styles.info}>
          <Text style={styles.nameText}>{politician.label}</Text>
          <PartyTag party={politician.party} />
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
    padding: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
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
