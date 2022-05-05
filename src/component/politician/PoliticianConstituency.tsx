import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import PoliticianItem from './PoliticianItem';

const PoliticianConstituency = () => {
  const politician = useContext(PoliticianContext);
  return (
    <View style={styles.container}>
      <Text style={styles.constituencyNumber}>
        Wahlkreis {politician?.constituency?.constituency_number}
      </Text>
      <Text style={styles.constituencyName}>
        {politician?.constituency?.constituency_name}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {politician?.constituency &&
          politician?.constituency.politicians.map(
            (constituencyCandidate, index) =>
              constituencyCandidate.id !== politician.profile?.id && (
                <PoliticianItem
                  key={index}
                  politicianId={constituencyCandidate.id}
                  politicianName={constituencyCandidate.label}
                  party={constituencyCandidate.party}
                />
              ),
          )}
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.background,
  },
  iosSafeBottom: {
    flex: 0,
    backgroundColor: Colors.background,
  },
  constituencyNumber: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 13,
    color: 'rgba(252, 252, 252, 0.7)',
    paddingBottom: 4,
  },
  constituencyName: {
    fontSize: 15,
    lineHeight: 15,
    fontWeight: '600',
    color: 'rgba(252, 252, 252, 1)',
    paddingBottom: 12,
  },
});

export default PoliticianConstituency;
