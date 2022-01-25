import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import PoliticianRow from '../PoliticianRow';

const PoliticianConstituency = () => {
  const politician = useContext(PoliticianContext);
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {politician?.constituency &&
            politician?.constituency.map(
              (constituencyCandidate, index) =>
                constituencyCandidate.id !== politician.profile?.id && (
                  <View style={styles.rowContainer}>
                    <PoliticianRow
                      key={index}
                      politician={constituencyCandidate}
                      politicianId={constituencyCandidate.id}
                    />
                  </View>
                ),
            )}
        </ScrollView>
      </View>
      <SafeAreaView style={styles.iosSafeBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 6,
    paddingHorizontal: 12,
  },
  rowContainer: {
    padding: 6,
  },
  iosSafeBottom: {flex: 0, backgroundColor: Colors.background},
});

export default PoliticianConstituency;
