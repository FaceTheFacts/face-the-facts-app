import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {RenderHTML} from 'react-native-render-html';
import {Colors} from '../../theme';
import {MixedStyleDeclaration} from '@native-html/transient-render-engine';

export interface ReadMoreHTMLProps {
  containerStyle?: StyleProp<ViewStyle>;
  baseStyle?: MixedStyleDeclaration;
  html: string;
  onExpand?: () => void;
  onCollapse?: () => void;
}

const ReadMoreHTML = ({
  containerStyle,
  baseStyle,
  html,
  onExpand,
  onCollapse,
}: ReadMoreHTMLProps) => {
  const {width} = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const linkStyles = {
    a: {
      color: '#3AA6F4',
    },
  };
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
          tagsStyles={linkStyles}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setExpanded(!expanded);
          if (expanded) {
            onCollapse?.call(null);
          } else {
            onExpand?.call(null);
          }
        }}>
        <Text style={styles.moreButton}>{expanded ? 'weniger' : 'mehr'}</Text>
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
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  moreButton: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default ReadMoreHTML;
