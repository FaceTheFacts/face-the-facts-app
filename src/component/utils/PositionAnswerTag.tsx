import React from 'react';
import {PositionAnswer} from '../../logic/data';
import Tag from './Tag';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';

const answerLongLabels: Record<PositionAnswer, string> = {
  agree: 'Kandidat:in stimmt zu',
  disagree: 'Kandidat:in stimmt nicht zu',
  neutral: 'Kandidat:in sieht es Neutral',
};

const answerShortLabels: Record<PositionAnswer, string> = {
  agree: 'Ja',
  disagree: 'Nein',
  neutral: 'Neutral',
};

const answerColors: Record<PositionAnswer, string> = {
  agree: '#5AB760',
  disagree: '#BB3C45',
  neutral: 'rgba(248, 248, 248, 0.12)',
};

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
