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
import {NavigationContext} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {ApiPolitician, ApiSearchPolitician} from '../logic/api';
import {fetch_api} from '../logic/fetch';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politician: ApiSearchPolitician;
  parentPoliticianId?: number;
}

const PoliticianRow = ({
  style,
  politician,
  parentPoliticianId,
}: PoliticianRowProps) => {
  const database = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;

  const handleClick = () => {
    refetch();
  };

  const {data, status, refetch} = useQuery<ApiPolitician | undefined, Error>(
    `politician-${politician.id}`,
    () =>
      fetch_api<ApiPolitician>(
        `politician/${politician.id}?sidejobs_end=15&votes_end=5`,
      ),
    {enabled: false},
  );
  if (status === 'success' && data !== undefined) {
    navigator.push('PoliticianScreen', data);
    database.historyManager.pushItem(politician.id);
  }
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        handleClick();
      }}>
      <PoliticianPicture politicianId={politician.id} />
      <View style={styles.content}>
        <Text style={styles.name}>{politician.label}</Text>
        <PartyTag party={politician.party} />
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
