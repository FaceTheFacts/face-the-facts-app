import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../theme';
import {DataContext} from '../logic/model';
import PoliticianPicture from './PoliticianPicture';

interface CardPoliticianProps {
  politicianId: string;
}

const CardPolitician = ({politicianId}: CardPoliticianProps) => {
  const data = useContext(DataContext);
  const politician = data.lookupPolitician(politicianId)!;
  const party = data.lookupParty(politician.partyId)!;
  return (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politicianId} size={48} />
      <View style={styles.info}>
        <Text style={styles.nameText}>{politician.name}</Text>
        <View
          style={StyleSheet.flatten([
            styles.partyTag,
            {backgroundColor: party.backgroundColor},
          ])}>
          <Text
            style={StyleSheet.flatten([
              styles.tagText,
              {color: party.foregroundColor},
            ])}>
            {party.displayName}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  info: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 13,
    color: Colors.baseWhite,
  },
  partyTag: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default CardPolitician;
