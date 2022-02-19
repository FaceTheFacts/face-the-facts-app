import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../theme';
import PoliticianPicture from './PoliticianPicture';
import {ApiPoliticianProfile} from '../logic/api';
import {fetch_api} from '../logic/fetch';
import {useQuery} from 'react-query';

interface CardPoliticianProps {
  politicianId: number;
}

const CardPolitician = ({politicianId}: CardPoliticianProps) => {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politicianId}?sidejobs_end=0&votes_end=0`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (profileLoading) {
    return <Text>Loading</Text>;
  }

  if (profileError) {
    return <Text>Error</Text>;
  }

  return (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politicianId} size={48} />
      <View style={styles.info}>
        <Text style={styles.nameText}>{profile?.label}</Text>
        <View
          style={StyleSheet.flatten([
            styles.partyTag,
            {backgroundColor: profile?.party.party_style.background_color},
          ])}>
          <Text
            style={StyleSheet.flatten([
              styles.tagText,
              {color: profile?.party.party_style.foreground_color},
            ])}>
            {profile?.party.label}
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
