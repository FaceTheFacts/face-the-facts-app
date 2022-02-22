import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PositionAnswer} from '../../logic/api';
import {Colors} from '../../theme';
import {answerColors, getPosition} from '../../utils/util';

interface PositionModalProps {
  statement: string;
  reason: string;
  position: PositionAnswer;
}

const PositionModal = ({statement, reason, position}: PositionModalProps) => {
  const positionWording = getPosition(position);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>These</Text>
      <Text style={styles.subtitle}>{statement}</Text>
      <View
        style={[
          styles.positionContainer,
          {backgroundColor: answerColors[position]},
        ]}>
        <Text style={styles.position}>{positionWording}</Text>
      </View>
      <View style={styles.reasonContainer}>
        <Text style={styles.title}>Begründung</Text>
        <Text style={styles.subtitle}>{reason}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    color: Colors.foreground,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.white70,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 17,
  },
  positionContainer: {
    marginVertical: 12,
    paddingVertical: 4,
    borderRadius: 5,
  },
  position: {
    color: Colors.foreground,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
  },
  reasonContainer: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 4,
  },
});

export default PositionModal;
