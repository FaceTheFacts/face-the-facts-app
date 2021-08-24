import React, {Children, ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

export interface WrapProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  spacing: number;
}

const Wrap = ({style, children, spacing}: WrapProps) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: -spacing,
      marginBottom: -spacing,
    },
    item: {
      marginLeft: spacing,
      marginBottom: spacing,
    },
  });

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {Children.map(children, child => (
        <View style={styles.item}>{child}</View>
      ))}
    </View>
  );
};

export default Wrap;
