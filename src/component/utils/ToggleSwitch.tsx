import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';
import {Colors} from '../../theme';

interface ToggleSwitchProps {
  label: string;
  isEnabled: boolean;
  onValueChange: () => void;
}

const ToggleSwitch = ({label, isEnabled, onValueChange}: ToggleSwitchProps) => {
  const animatedValue = new Animated.Value(0);
  const color = isEnabled ? Colors.baseGreen : Colors.darkBlue20;

  animatedValue.setValue(isEnabled ? 0 : 1);

  Animated.timing(animatedValue, {
    toValue: isEnabled ? 1 : 0,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 20],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading3}>{label}</Text>
      <TouchableOpacity onPress={() => onValueChange()}>
        <View
          style={StyleSheet.flatten([
            styles.toggleContainer,
            {backgroundColor: color},
          ])}>
          <Animated.View
            style={StyleSheet.flatten([
              styles.toggleWheelStyle,
              {marginLeft: moveToggle},
            ])}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  toggleContainer: {
    width: 36,
    height: 20,
    marginLeft: 3,
    borderRadius: 15,
    justifyContent: 'center',
  },
  label: {
    marginRight: 2,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.foreground,
  },
  toggleWheelStyle: {
    width: 12,
    height: 12,
    backgroundColor: Colors.baseWhite,
    borderRadius: 6,
  },
});

export default ToggleSwitch;
