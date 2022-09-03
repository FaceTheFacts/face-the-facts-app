import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {Colors} from '../../theme';
const PartyDonationCard = () => {
  const data = {party: 'MLPD', amount: 50000};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{data.party}</Text>
        <Text style={styles.text}>{data.amount} €</Text>
      </View>
      <View style={styles.separatorLine} />
      <View>
        <Text style={styles.descText}>Test</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 12,
    marginLeft: 12,
  },

  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },

  text: {},

  header: {
    flex: 1,
  },

  descText: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 15.73,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
});

export default PartyDonationCard;
