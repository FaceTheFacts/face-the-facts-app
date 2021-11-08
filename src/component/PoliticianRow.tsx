import React, {useContext} from 'react';
import {DataContext} from '../logic/model';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../theme';
import PartyTag from './PartyTag';
import PoliticianPicture from './PoliticianPicture';
import {Politician} from '../logic/data';
import {NavigationContext} from '@react-navigation/native';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politician: Politician;
  parentPoliticianId?: string;
}

const PoliticianRow = ({
  style,
  politician,
  parentPoliticianId,
}: PoliticianRowProps) => {
  const data = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        if (politician.id !== parentPoliticianId) {
          navigator.push('PoliticianScreen', {politician});
          data.dbManager.pushHistoryItem(politician.id);
        }
      }}>
      <PoliticianPicture politicianId={politician.id} />
      <View style={styles.content}>
        <Text style={styles.name}>{politician.name}</Text>
        <PartyTag party={data.lookupParty(politician.partyId)!} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    color: Colors.foreground,
    fontSize: 18,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
});

export default PoliticianRow;
