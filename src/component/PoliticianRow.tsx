import React, {useContext, useState} from 'react';
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
import {
  ApiPoliticianProfile,
  ApiPositions,
  ApiSearchPolitician,
} from '../logic/api';
import {fetch_api} from '../logic/fetch';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politician: ApiSearchPolitician;
}

const PoliticianRow = ({style, politician}: PoliticianRowProps) => {
  const database = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    profileQuery.refetch();
    positionsQuery.refetch();
    setClicked(true);
  };

  const profileQuery = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician-${politician.id}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politician.id}?sidejobs_end=15&votes_end=5`,
      ),
    {enabled: false},
  );
  const positionsQuery = useQuery<ApiPositions | undefined, Error>(
    `postition-${politician.id}`,
    () => fetch_api<ApiPositions>(`politician/${politician.id}/positions`),
    {enabled: false},
  );
  if (
    profileQuery.status === 'success' &&
    positionsQuery.status === 'success' &&
    clicked
  ) {
    navigator.push('PoliticianScreen', {
      profile: profileQuery.data,
      positions: positionsQuery.data,
    });
    database.dbManager.pushHistoryItem(politician.id);
    setClicked(false);
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
