import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {Colors} from '../theme';

export interface TabMenuItem {
  name: string;
  icon: IconProp;
  selectedIcon: IconProp;
  displayName: string;
}

export interface TabMenuProps {
  items: TabMenuItem[];
  selected: string;
  onSelect: (name: string) => void;
  blur: boolean;
}

const TabMenu = ({items, selected, onSelect}: TabMenuProps) => {
  return (
    <View style={styles.container}>
      {items.map(({name, icon, selectedIcon}) => (
        <TouchableOpacity
          key={name}
          style={styles.item}
          onPress={() => onSelect(name)}>
          <FontAwesomeIcon
            style={StyleSheet.flatten([
              styles.icon,
              selected === name && styles.selectedIcon,
            ])}
            // @ts-ignore
            icon={selected === name ? selectedIcon : icon}
            size={30}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
  },
  icon: {
    color: Colors.foreground,
    opacity: 0.6,
    alignSelf: 'center',
  },
  selectedIcon: {
    opacity: 1,
  },
});

export default TabMenu;
