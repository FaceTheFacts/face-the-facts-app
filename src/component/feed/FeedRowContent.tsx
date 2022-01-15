import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Politician, SideJob} from '../../logic/data';
import {Colors} from '../../theme';

export interface PollTab {
  id: string;
  title: string;
  politicians: Politician[];
  date: string;
}

interface PollRowProps {
  poll: PollTab;
}

export const PollRowContent = ({poll}: PollRowProps) => (
  <View style={styles.title}>
    <Text style={styles.boldText}>{poll.politicians[0].name}</Text>
    {poll.politicians.length > 1 ? (
      <>
        <Text style={styles.titleText}> und </Text>
        <Text style={styles.boldText}>
          {poll.politicians.length - 1} weitere
        </Text>
        <Text style={styles.titleText}> haben an einer </Text>
      </>
    ) : (
      <Text style={styles.titleText}> hat an einer </Text>
    )}
    <TouchableOpacity>
      <Text style={styles.linkText}>Abstimmung</Text>
    </TouchableOpacity>
    <Text style={styles.titleText}> teilgenommen.</Text>
  </View>
);

export type SideJobTab = SideJob & {
  politicians: Politician[];
};

interface SideJobRowProps {
  sideJob: SideJobTab;
}

export const SideJobRowContent = ({sideJob}: SideJobRowProps) => (
  <View style={styles.title}>
    <Text style={styles.boldText}>{sideJob.politicians[0].name}</Text>
    <Text style={styles.titleText}> hat an eine </Text>
    <TouchableOpacity>
      <Text style={styles.linkText}>Nebentätigkeit</Text>
    </TouchableOpacity>
    <Text style={styles.titleText}> hinzugefügt.</Text>
  </View>
);

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
  descText: {
    fontSize: 11,
    color: Colors.baseWhite,
    marginTop: 4,
    flexWrap: 'wrap',
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
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
    marginTop: 16,
  },
});
