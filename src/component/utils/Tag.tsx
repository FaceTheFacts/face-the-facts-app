import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

export interface TagProps {
  style?: StyleProp<ViewStyle>;
  content: string;
  foregroundColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  bold?: boolean;
  spacing?: boolean;
  uppercase?: boolean;
  width?: boolean;
  abstain?: boolean;
}

const Tag = ({
  style,
  content,
  foregroundColor = '#F8F8F8',
  backgroundColor = 'rgba(248, 248, 248, 0.12)',
  borderColor,
  bold = false,
  spacing = false,
  uppercase = false,
  width = false,
  abstain = false,
}: TagProps) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 4,
      paddingVertical: borderColor ? 3 : 5,
      paddingHorizontal: borderColor ? 3 : 5,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: borderColor ? 2 : undefined,
      alignSelf: 'flex-start',
      width: width ? 50 : undefined,
    },
    label: {
      fontSize: abstain ? 11 : 13,
      fontFamily: 'Inter',
      color: foregroundColor,
      fontWeight: bold ? '600' : 'normal',
      marginLeft: spacing ? 8 : 0,
      marginRight: spacing ? 8 : 0,
      textTransform: uppercase ? 'uppercase' : 'none',
    },
  });

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Text style={styles.label}>{content}</Text>
    </View>
  );
};

export default Tag;
