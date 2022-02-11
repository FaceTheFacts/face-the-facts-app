import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PoliticianPicture from '../PoliticianPicture';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import Wrap from '../utils/Wrap';
import {ApiParty} from '../../logic/api';

export interface SkeletonPoliticianHeaderProps {
  politicianId: number;
  politicianName: string;
  party: ApiParty;
}

const SkeletonPoliticianHeader = ({
  politicianId,
  politicianName,
  party,
}: SkeletonPoliticianHeaderProps) => {
  return (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politicianId} size={80} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{politicianName}</Text>
        <Wrap spacing={4}>
          <PartyTag party={party} />
        </Wrap>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingTop: 12,
    paddingBottom: 23,
    paddingHorizontal: 16,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  name: {
    color: Colors.foreground,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
});

export default SkeletonPoliticianHeader;
