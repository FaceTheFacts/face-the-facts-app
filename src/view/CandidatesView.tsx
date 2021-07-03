import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import {DataContext, FaceTheFactsData, Politician} from '../logic/model';
import {Colors} from '../theme';
import {PoliticianListSection} from '../component/PoliticianList';
import PoliticianRow from '../component/PoliticianRow';

function createSections(
  data: FaceTheFactsData,
  politicianIds: string[],
): PoliticianListSection[] {
  const politicians = politicianIds.map(value => data.lookupPolitician(value)!);
  const politiciansByParty = new Map<string, Politician[]>();
  politicians.forEach(
    value =>
      politiciansByParty.get(value.party)?.push(value) ??
      politiciansByParty.set(value.party, [value]),
  );
  return [...politiciansByParty.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([party, politicians]) => ({
      title: data.lookupParty(party)!.displayName,
      politicians,
    }));
}

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
