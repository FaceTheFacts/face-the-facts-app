import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {ScrollView} from 'react-native-gesture-handler';
import PoliticianRow from '../PoliticianRow';

const PoliticianConstituency = () => {
  const politician = useContext(PoliticianContext);
  return (
    <View style={styles.container}>
      <ScrollView>
        {politician?.constituency &&
          politician?.constituency.map(
            (constituencyCandidate, index) =>
              constituencyCandidate.id !== politician.profile?.id && (
                <PoliticianRow
                  key={index}
                  politicianId={constituencyCandidate.id}
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
  },
  iosSafeBottom: {flex: 0, backgroundColor: Colors.background},
});

export default PoliticianConstituency;
