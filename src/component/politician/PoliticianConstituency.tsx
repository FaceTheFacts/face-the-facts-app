import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import PoliticianItem from './PoliticianItem';

const PoliticianConstituency = () => {
  const politician = useContext(PoliticianContext);
  return (
    <View style={styles.container}>
      <ScrollView>
        {politician?.constituency &&
          politician?.constituency.map(
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  iosSafeBottom: {flex: 0, backgroundColor: Colors.background},
});

export default PoliticianConstituency;
