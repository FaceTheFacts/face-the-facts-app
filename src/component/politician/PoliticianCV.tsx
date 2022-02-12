import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';

const PoliticianCV = () => {
  const politician = useContext(PoliticianContext);

  return (
    <ScrollView style={styles.container}>
      {politician?.profile?.cvs?.map((step, index) => (
        <View key={index} style={styles.step}>
          <Text style={styles.label}>{step.raw_text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  step: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  date: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  label: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PoliticianCV;
