import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme';
import {monthMap} from '../../utils/util';

interface MonthHeaderProps {
  sectionTitle: string;
}

const MonthHeader = ({sectionTitle}: MonthHeaderProps) => {
  let month = sectionTitle.split('/')[0];
  month.length < 2 ? (month = '0' + month) : (month = month);
  return (
    <View style={styles.monthContainer}>
      <Text style={styles.month}>{monthMap[month]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
});

export default MonthHeader;
