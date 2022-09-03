import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {Colors} from '../../theme';
const PartyDonationCard = () => {
  const data = {
    party: 'MLPD',
    amount: '50.000',
    date: '12.10.2021',
    spender: 'Günter Slave aus Dresden',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.partyName}>{data.party}</Text>
        <Text style={styles.donationAmount}>{data.amount} €</Text>
      </View>
      <View style={styles.separatorLine} />
      <View>
        <Text style={styles.dateText}>{data.date}</Text>
        <Text style={styles.spenderText}>{data.spender}</Text>
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

    marginBottom: 12,
  },

  partyName: {
    fontSize: 15,
    color: '#FCFCFC',
  },
  donationAmount: {
    fontSize: 15,
    color: '#FCFCFC',
  },

  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },

  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
  },

  spenderText: {
    fontSize: 15,
    color: Colors.white70,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
