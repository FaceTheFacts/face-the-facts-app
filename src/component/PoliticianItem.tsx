import React, {useContext} from 'react';
import {DataContext} from '../logic/model';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import PartyTag from './PartyTag';
import PoliticianPicture from './PoliticianPicture';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../view/RootStackParams';
import {ApiParty} from '../logic/api';

export interface PoliticianItemProps {
  politicianId: number;
  politicianName: string;
  party: ApiParty;
}

type politicianScreenProp = StackNavigationProp<
  RootStackParamList,
  'Politician'
>;

const PoliticianItem = ({
  politicianId,
  politicianName,
  party,
}: PoliticianItemProps) => {
  const database = useContext(DataContext);
  const navigator = useNavigation<politicianScreenProp>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        database.dbManager.pushHistoryItem(politicianId);
        navigator.navigate('NewPolitician', {
          politicianId,
        });
      }}>
      <PoliticianPicture politicianId={politicianId} size={48} />
      <View style={styles.content}>
        <Text style={styles.name}>{politicianName}</Text>
        <PartyTag party={party} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
});

export default PoliticianItem;
