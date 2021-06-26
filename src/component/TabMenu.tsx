import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import {SFSymbol} from 'react-native-sfsymbols';

export interface TabMenuItem {
  name: string;
  icon: string;
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
      {items.map(({name, icon, label}) => (
        <TouchableOpacity
          key={name}
          style={styles.itemWrapper}
          onPress={() => onSelect(name)}>
          <View style={styles.item}>
            <SFSymbol
              style={StyleSheet.flatten([
                styles.icon,
                selected === name && styles.selectedIcon,
              ])}
              name={icon}
              size={24}
              color={Colors.foreground}
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
  },
  icon: {
    color: Colors.foreground,
    opacity: 0.3,
    alignSelf: 'center',
    width: 24,
    height: 24,
  },
  selectedIcon: {
    opacity: 1,
  },
  label: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.foreground,
  },
});

export default TabMenu;
