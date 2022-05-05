import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';

const PoliticianCV = () => {
  const politician = useContext(PoliticianContext);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.step}>
        <Text style={styles.desc}>
          {politician?.profile?.cvs[0].short_description}
        </Text>
        <Text style={styles.label}>{politician?.profile?.cvs[0].raw_text}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    backgroundColor: Colors.background,
  },
  step: {
    marginBottom: 16,
  },
  desc: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    paddingBottom: 12,
  },
  label: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PoliticianCV;
