import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import {DataContext} from '../logic/model';
import {Colors} from '../theme';
import PoliticianRow from '../component/PoliticianRow';

const CandidatesView = () => {
  const data = useContext(DataContext);
  const election = data.elections[0];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Spitzenkandidat:innen</Text>
      <Text style={styles.electionName}>{election.displayName}</Text>
      <ScrollView>
        {election.politicians.map(politicianId => (
          <PoliticianRow
            key={politicianId}
            style={styles.row}
            politician={data.lookupPolitician(politicianId)!}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: Colors.foreground,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
  },
  electionName: {
    fontFamily: 'Inter',
    fontSize: 17,
    color: Colors.foreground,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  row: {
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default CandidatesView;
