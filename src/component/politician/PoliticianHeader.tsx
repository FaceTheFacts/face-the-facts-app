import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PoliticianPicture from '../PoliticianPicture';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import Tag from '../utils/Tag';
import Wrap from '../utils/Wrap';
import {PoliticianContext} from '../../view/PoliticianView';

const PoliticianHeader = () => {
  const politician = useContext(PoliticianContext);

  return (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politician.profile.id} size={80} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{politician.profile.label}</Text>
        <Wrap spacing={4}>
          <PartyTag party={politician.profile.party} />
          {politician.profile.occupations?.map((occupation, index) => (
            <Tag key={index} content={occupation} />
          ))}
        </Wrap>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    // padding: 24,
    paddingTop: 4,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  name: {
    color: Colors.foreground,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabContainer: {},
});

export default PoliticianHeader;
