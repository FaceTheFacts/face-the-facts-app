import React, {useContext} from 'react';
import {DataContext, Politician} from '../logic/model';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../theme';
import ProfilePicturePlaceholder from './ProfilePicturePlaceholder';
import PartyTag from './PartyTag';
import {NavigationContext} from '@react-navigation/native';
import {showPolitician} from '../logic/navigation';

export interface PoliticianRowProps {
  style?: StyleProp<ViewStyle>;
  politician: Politician;
}

const PoliticianRow = ({style, politician}: PoliticianRowProps) => {
  const data = useContext(DataContext);
  const navigator = useContext(NavigationContext)!;

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() => showPolitician(navigator, politician.id)}>
      <ProfilePicturePlaceholder />
      <View style={styles.content}>
        <Text style={styles.name}>{politician.displayName}</Text>
        <PartyTag party={data.lookupParty(politician.party)!} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    color: Colors.foreground,
    fontSize: 18,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
});

export default PoliticianRow;
