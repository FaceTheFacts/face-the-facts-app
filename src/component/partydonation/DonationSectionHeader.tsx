import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme';

interface DonationSectionHeaderProps {
  title: string;
  sum: string;
}

const DonationSectionHeader = ({title, sum}: DonationSectionHeaderProps) => (
  <View style={styles.cardHeader}>
    <View style={styles.monthContainer}>
      <Text style={styles.month}>{title}</Text>
    </View>
    <View style={styles.totalContainer}>
      <Text style={styles.total}>Gesamt</Text>
      <Text style={styles.dateText}>{sum}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
  },
  month: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14.52,
    fontFamily: 'Inter',
    color: Colors.foreground,
    textTransform: 'uppercase',
  },
  totalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  total: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: '500',
    color: Colors.baseWhite,
    marginBottom: 1,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 13,
    color: Colors.white70,
    marginTop: 1,
  },
});

export default DonationSectionHeader;
