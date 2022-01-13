import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {NavigationContext} from '@react-navigation/native';
import {ApiSidejob, ApiVoteAndPoll} from '../../logic/api';

export interface PoliticianInfo {
  id: number;
  label: string;
}

export type PollTab = ApiVoteAndPoll & {
  created: string;
  politicians: PoliticianInfo[];
};

interface PollRowProps {
  poll: PollTab;
}

export const PollRowContent = ({poll}: PollRowProps) => {
  const navigator = useContext<any>(NavigationContext)!;

  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{poll.politicians[0].label}</Text>
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
      <TouchableOpacity
        onPress={() => {
          navigator.push('PollDetailsScreen', {
            poll: poll.Poll,
            vote: poll.Vote,
            candidateVote: poll.Vote.vote,
          });
        }}>
        <Text style={styles.linkText}>Abstimmung</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> teilgenommen.</Text>
    </View>
  );
};

export type SideJobTab = ApiSidejob & {
  politicians: PoliticianInfo[];
};

interface SideJobRowProps {
  sideJob: SideJobTab;
}

export const SideJobRowContent = ({sideJob}: SideJobRowProps) => {
  const navigator = useContext<any>(NavigationContext)!;

  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{sideJob.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat an eine </Text>
      <TouchableOpacity
        onPress={() => {
          const politicianId = sideJob.politicians[0].id;
          navigator.push('PoliticianScreen', {
            politicianId,
          });
        }}>
        <Text style={styles.linkText}>Nebentätigkeit</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> hinzugefügt.</Text>
    </View>
  );
};

export type SpeechTab = {
  politicians: PoliticianInfo[];
  videoFileURI: string;
  title: string;
  created: string;
};

interface SpeechRowProps {
  speech: SpeechTab;
}

export const SpeechRowContent = ({speech}: SpeechRowProps) => {
  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{speech.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat an eine </Text>
      <TouchableOpacity>
        <Text style={styles.linkText}>Rede</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> gehalten.</Text>
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
