import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../theme';

interface TimeFrameFilterProps {
  timeframe: number;
  setTimeframe: (value: number) => void;
}

const TimeframeFilter = ({timeframe, setTimeframe}: TimeFrameFilterProps) => {
  return (
    <View style={styles.timeframeContainer}>
      <TouchableOpacity
        style={timeframe === 2 ? styles.timeframeActive : {}}
        onPress={() => setTimeframe(2)}>
        <Text
          style={[
            timeframe === 2 ? styles.timeframeActive : styles.timeframeText,
          ]}>
          4 Jahre
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={timeframe === 1 ? styles.timeframeActive : {}}
        onPress={() => setTimeframe(1)}>
        <Text
          style={[
            timeframe === 1 ? styles.timeframeActive : styles.timeframeText,
          ]}>
          8 Jahre
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={timeframe === 0 ? styles.timeframeActive : {}}
        onPress={() => setTimeframe(0)}>
        <Text
          style={[
            timeframe === 0 ? styles.timeframeActive : styles.timeframeText,
          ]}>
          Allzeit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 192,
  },
  timeframeText: {
    color: Colors.white40,
    margin: 8,
  },
  timeframeActive: {
    color: Colors.baseWhite,
    margin: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
});

export default TimeframeFilter;
