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
}: TagProps) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 4,
      padding: borderColor ? 3 : 5,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: borderColor ? 2 : undefined,
      alignSelf: 'flex-start',
      width: width ? 50 : undefined,
    },
    label: {
      fontSize: 12,
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
