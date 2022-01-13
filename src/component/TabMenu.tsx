import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import Icon from './Icon';
import {SVGIcon} from '../icons';

export interface TabMenuItem {
  name: string;
  icons: [SVGIcon, SVGIcon];
  label: string;
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
      {items.map(({name, icons, label}) => (
        <TouchableOpacity
          key={name}
          style={styles.itemWrapper}
          onPress={() => onSelect(name)}>
          <View
            style={StyleSheet.flatten([
              styles.item,
              selected === name && styles.selectedItem,
            ])}>
            <Icon
              style={styles.icon}
              icon={selected === name ? icons[1] : icons[0]}
            />
            <Text style={styles.label}>{label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'flex-end',
  },
  itemWrapper: {
    flex: 1,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  selectedItem: {
    opacity: 1,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 21,
    height: 21,
  },
  label: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.foreground,
  },
});

export default TabMenu;
