import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CandidatesView from './CandidatesView';
import ScannerView from './ScannerView';
import TabMenu from '../component/TabMenu';
import HistoryView from './HistoryView';
import {Colors} from '../theme';

const MainView = () => {
  const [selected, setSelected] = useState('candidates');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentContainer}>
        {selected === 'candidates' && <CandidatesView />}
        {selected === 'scanner' && <ScannerView />}
        {selected === 'history' && <HistoryView />}
      </SafeAreaView>
      <SafeAreaView style={styles.tabBarContainer}>
        <TabMenu
          items={[
            {
              name: 'candidates',
              icon: 'square.grid.2x2.fill',
              label: 'Wahl',
            },
            {
              name: 'scanner',
              icon: 'person.fill.viewfinder',
              label: 'Scannen',
            },
            {
              name: 'history',
              icon: 'clock.fill',
              label: 'Verlauf',
            },
          ]}
          selected={selected}
          onSelect={setSelected}
          blur={false}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBarContainer: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MainView;
