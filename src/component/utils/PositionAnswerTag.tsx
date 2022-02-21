import React from 'react';
import {PositionAnswer} from '../../logic/api';
import Tag from './Tag';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {
  answerColors,
  answerLongLabels,
  answerShortLabels,
} from '../../utils/util';

export interface VoteTagProps {
  style?: StyleProp<ViewStyle>;
  short?: boolean;
  center?: boolean;
  answer: PositionAnswer;
}

const PositionAnswerTag = ({
  style,
  short = false,
  center = false,
  answer,
}: VoteTagProps) => {
  return (
    <Tag
      style={StyleSheet.flatten([
        style,
        {
          alignSelf: center ? 'center' : 'flex-start',
          minWidth: 48,
          alignItems: 'center',
        },
      ])}
      content={(short ? answerShortLabels : answerLongLabels)[answer]}
      backgroundColor={answerColors[answer]}
      bold
      uppercase
    />
  );
};

export default PositionAnswerTag;
