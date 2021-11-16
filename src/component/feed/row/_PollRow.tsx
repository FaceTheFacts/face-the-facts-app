import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Politician} from '../../../logic/data';
import {Colors} from '../../../theme';
import PoliticianPicture from '../../PoliticianPicture';

export interface Poll {
  id: string;
  title: string;
  participants: Politician[];
  date: string;
}

interface PollRowProps {
  poll: Poll;
}
// <PoliticianPicture politicianId={poll.participants[0].id} size={48} />

const PollRow = ({poll}: PollRowProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.boldText}> {poll.participants[0].name}</Text>
          {poll.participants.length > 1 ? (
            <>
              <Text style={styles.titleText}> und </Text>
              <Text style={styles.boldText}>
                {poll.participants.length - 1} weitere
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
        <Text style={styles.descText}>{poll.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flexDirection: 'row',
  },
  content: {},
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
    paddingLeft: 4,
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
});

export default PollRow;
