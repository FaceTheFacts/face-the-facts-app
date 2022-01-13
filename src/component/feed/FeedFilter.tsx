import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import ToggleSwitch from '../utils/ToggleSwitch';
import {
  POLLS_TOGGLE_KEY,
  SIDEJOBS_TOGGLE_KEY,
  SPEECHES_TOGGLE_KEY,
  ARTICLES_TOGGLE_KEY,
} from '../../view/HomeView';

interface FeedFilterProps {
  showPolls: boolean;
  showSideJobs: boolean;
  showSpeeches: boolean;
  showArticles: boolean;
  setShowPolls: (showPolls: boolean) => void;
  setShowSideJobs: (showSideJobs: boolean) => void;
  setShowSpeeches: (showSpeeches: boolean) => void;
  setShowArticles: (showArticles: boolean) => void;
}

const FeedFilter = ({
  showPolls,
  showSideJobs,
  showSpeeches,
  showArticles,
  setShowPolls,
  setShowSideJobs,
  setShowSpeeches,
  setShowArticles,
}: FeedFilterProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading2}>Filtern</Text>
      <Text style={styles.text1}>
        Wähle aus, welche Informationen in deinem Newsfeed angezeigt werden
        sollen.
      </Text>
      <View style={styles.separatorLine} />
      <ToggleSwitch
        key={SPEECHES_TOGGLE_KEY}
        label={'Reden'}
        isEnabled={showSpeeches}
        setIsEnabled={setShowSpeeches}
      />
      <ToggleSwitch
        key={POLLS_TOGGLE_KEY}
        label={'Abstimmungen'}
        isEnabled={showPolls}
        setIsEnabled={setShowPolls}
      />
      <ToggleSwitch
        key={ARTICLES_TOGGLE_KEY}
        label={'Artikel'}
        isEnabled={showArticles}
        setIsEnabled={setShowArticles}
      />
      <ToggleSwitch
        key={SIDEJOBS_TOGGLE_KEY}
        label={'Nebentätigkeiten'}
        isEnabled={showSideJobs}
        setIsEnabled={setShowSideJobs}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 33,
  },
  heading2: {
    fontSize: 17,
    color: Colors.foreground,
    marginBottom: 4,
  },
  text1: {
    fontSize: 13,
    lineHeight: 17.73,
    color: Colors.white70,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginTop: 13,
    marginBottom: 3,
  },
});

export default FeedFilter;
