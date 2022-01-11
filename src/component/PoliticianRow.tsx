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
import {fetch_api} from '../logic/fetch';
import type {ApiPoliticianProfile, ApiSearchPolitician} from '../logic/api';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politician?: ApiSearchPolitician;
  politicianId: number;
}

const PoliticianRow = ({
  style,
  politician,
  politicianId,
}: PoliticianRowProps) => {
  const database = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;

  const {data} = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politicianId}?sidejobs_end=15&votes_end=5`,
      ),
    {enabled: !politician},
  );
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => {
        database.dbManager.pushHistoryItem(politicianId);
        navigator.push('PoliticianScreen', {
          politicianId,
        });
      }}>
      <PoliticianPicture politicianId={politicianId} />
      <View style={styles.content}>
        {politician ? (
          <>
            <Text style={styles.name}>{politician.label}</Text>
            <PartyTag party={politician.party} />
          </>
        ) : (
          data && (
            <>
              <Text style={styles.name}>{data.label}</Text>
              <PartyTag party={data.party} />
            </>
          )
        )}
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
