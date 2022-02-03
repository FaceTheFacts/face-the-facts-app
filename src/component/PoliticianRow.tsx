//
//    This Component has been depreciated.
//    Checkout PoliticianItem instead.
//

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
import {useNavigation} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import type {ApiPoliticianProfile} from '../logic/api';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../view/RootStackParams';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politicianId: number;
}

type politicianScreenProp = StackNavigationProp<
  RootStackParamList,
  'Politician'
>;

const PoliticianRow = ({style, politicianId}: PoliticianRowProps) => {
  const database = useContext(DataContext);
  const navigator = useNavigation<politicianScreenProp>();

  const {data} = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politicianId}?sidejobs_end=15&votes_end=5`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        database.dbManager.pushHistoryItem(politicianId);
        navigator.navigate('Politician', {
          politicianId,
        });
      }}>
      <PoliticianPicture politicianId={politicianId} size={48} />
      <View style={styles.content}>
        {data && (
          <>
            <Text style={styles.name}>{data.label}</Text>
            <PartyTag party={data.party} />
          </>
        )}
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

export default PoliticianRow;
