import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DataContext, FaceTheFactsData, Politician} from '../logic/model';
import {Colors} from '../theme';
import PoliticianList, {PoliticianListSection} from '../component/PoliticianList';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spitzenkandidat:innen</Text>
      <PoliticianList
        sections={createSections(data, data.elections[0].politicians)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 20,
    color: Colors.foreground,
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default CandidatesView;
