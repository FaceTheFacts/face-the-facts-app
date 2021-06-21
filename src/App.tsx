import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import TabMenu from './component/TabMenu';
import {
  faCamera as falCamera,
  faHistory as falHistory,
  faStar as falStar,
} from '@fortawesome/pro-light-svg-icons';
import {faCamera, faHistory, faStar} from '@fortawesome/free-solid-svg-icons';
import CandidatesView from './view/CandidatesView';
import {Colors} from './theme';
import ScannerView from './view/ScannerView';
import {DataContext, FaceTheFactsData} from './logic/model';
import politicians from '../politicians.json';
import parties from '../parties.json';
import elections from '../elections.json';

const data = new FaceTheFactsData({
  politicians,
  parties,
  elections,
});

const App = () => {
  const [selected, setSelected] = useState('candidates');

  return (
    <DataContext.Provider value={data}>
      <SafeAreaView style={styles.container}>
        {selected === 'candidates' && <CandidatesView />}
        {selected === 'scanner' && <ScannerView />}
        <TabMenu
          items={[
            {
              name: 'candidates',
              icon: falStar,
              selectedIcon: faStar,
              displayName: '',
            },
            {
              name: 'scanner',
              icon: falCamera,
              selectedIcon: faCamera,
              displayName: '',
            },
            {
              name: 'history',
              icon: falHistory,
              selectedIcon: faHistory,
              displayName: '',
            },
          ]}
          selected={selected}
          onSelect={setSelected}
          blur={false}
        />
      </SafeAreaView>
    </DataContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
