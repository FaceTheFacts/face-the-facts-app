import React from 'react';
import {Party} from '../logic/model';
import {StyleSheet, Text, View} from 'react-native';

export interface PartyTagProps {
  party: Party;
}

const PartyTag = ({party}: PartyTagProps) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 4,
      padding: 5,
      backgroundColor: party.backgroundColor,
      borderColor: party.borderColor,
      borderWidth: party.borderColor ? 2 : undefined,
      alignSelf: 'flex-start',
    },
    label: {
      fontSize: 12,
      fontFamily: 'Inter',
      color: party.foregroundColor,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{party.displayName}</Text>
    </View>
  );
};

export default PartyTag;
