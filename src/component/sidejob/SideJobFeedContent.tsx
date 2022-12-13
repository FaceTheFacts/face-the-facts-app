import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import {SideJobTab} from '../../logic/api';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';

interface SideJobFeedProps {
  sideJob: SideJobTab;
}

export const SideJobFeedContent = ({sideJob}: SideJobFeedProps) => {
  const navigator = useContext<any>(NavigationContext)!;
  const database = useContext(DataContext);
  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{sideJob.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat eine </Text>
      <TouchableOpacity
        onPress={() => {
          database.dbManager.pushHistoryItem(sideJob.politicians[0].id);
          navigator.push('Politician', {
            politicianId: sideJob.politicians[0].id,
            politicianName: sideJob.politicians[0].label,
            party: sideJob.politicians[0].party,
            toSideJobs: true,
          });
        }}>
        <Text style={styles.linkText}>Nebentätigkeit</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> hinzugefügt.</Text>
      <View style={styles.desc}>
        <Text style={styles.descText}>{sideJob.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
    color: Colors.white40,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseBlueLight,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  desc: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  descText: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.white70,
  },
});
