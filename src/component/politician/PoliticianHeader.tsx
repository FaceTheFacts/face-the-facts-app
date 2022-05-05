import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PoliticianPicture from '../PoliticianPicture';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import {DataContext} from '../../logic/model';
import Tag from '../utils/Tag';
import Wrap from '../utils/Wrap';
import {PoliticianContext} from '../../view/PoliticianView';

const PoliticianHeader = () => {
  const politician = useContext(PoliticianContext);
  const data = useContext(DataContext);

  return (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politician.id} size={80} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{politician.name}</Text>
        <Wrap spacing={4}>
          <PartyTag party={data.lookupParty(politician.partyId)!} />
          {politician.occupation?.map((occupation, index) => (
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
    padding: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  followBtn: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.white40,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 10,
    borderRadius: 4,
  },
  unFollowBtn: {
    backgroundColor: Colors.baseWhite,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 10,
    borderRadius: 4,
  },
  followText: {
    color: Colors.baseWhite,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  unFollowText: {
    color: '#181924',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});

export default PoliticianHeader;
