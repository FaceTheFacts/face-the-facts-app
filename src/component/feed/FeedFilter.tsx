import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import ToggleSwitch from '../utils/ToggleSwitch';

const FeedFilter = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading2}>Filtern</Text>
      <Text style={styles.text1}>
        Wähle aus, welche Informationen in deinem Newsfeed angezeigt werden
        sollen.
      </Text>
      <View style={styles.separatorLine} />
      <ToggleSwitch label={'Reden'} />
      <ToggleSwitch label={'Abstimmungen'} />
      <ToggleSwitch label={'Artikel'} />
      <ToggleSwitch label={'Nebentätigkeiten'} />
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