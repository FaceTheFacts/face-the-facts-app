import React, {useState} from 'react';
import {StyleProp, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ViewStyle} from 'react-native';
import {RenderHTML} from 'react-native-render-html';
import {Colors} from '../../theme';
import {MixedStyleDeclaration} from '@native-html/transient-render-engine';

export interface ReadMoreHTMLProps {
  containerStyle?: StyleProp<ViewStyle>;
  baseStyle?: MixedStyleDeclaration;
  html: string;
}

const ReadMoreHTML = ({containerStyle, baseStyle, html}: ReadMoreHTMLProps) => {
  const {width} = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <View
        style={StyleSheet.flatten([
          styles.container,
          !expanded && styles.collapsed,
          containerStyle,
        ])}>
        <RenderHTML
          baseStyle={baseStyle}
          source={{html}}
          contentWidth={width}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setExpanded(!expanded)}>
        <Text style={styles.buttonLabel}>
          {expanded ? 'Weniger lesen' : 'Mehr lesen'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  collapsed: {
    maxHeight: 60,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: Colors.cardBackground,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default ReadMoreHTML;
