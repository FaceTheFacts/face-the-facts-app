import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar} from 'react-native';
import CandidatesView from './CandidatesView';
import ScannerView from './ScannerView';
import TabMenu from '../component/TabMenu';
import HistoryView from './HistoryView';
import {Colors} from '../theme';
import {HistoryIcon, ListIcon, ScanPersonIcon} from '../icons';

const MainView = () => {
  const [selected, setSelected] = useState('scanner');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.contentContainer}>
        {selected === 'candidates' && <CandidatesView />}
        {selected === 'scanner' && <ScannerView />}
        {selected === 'history' && <HistoryView />}
      </View>
      <SafeAreaView style={styles.tabBarContainer}>
        <TabMenu
          items={[
            {
              name: 'candidates',
              icon: ListIcon,
              label: 'Wahl',
            },
            {
              name: 'scanner',
              icon: ScanPersonIcon,
              label: 'Scannen',
            },
            {
              name: 'history',
              icon: HistoryIcon,
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
