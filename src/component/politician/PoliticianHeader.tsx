import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import PoliticianPicture from '../PoliticianPicture';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import Tag from '../utils/Tag';
import Wrap from '../utils/Wrap';
import {PoliticianContext} from '../../view/PoliticianView';
import {DataContext} from '../../logic/model';

const PoliticianHeader = () => {
  const politician = useContext(PoliticianContext);
  const data = useContext(DataContext);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    data.dbManager.isIdFollowed(politician?.profile?.id!).then(setIsFollowed);
  }, [data, politician]);

  return politician?.profile ? (
    <View style={styles.container}>
      <PoliticianPicture politicianId={politician.profile.id!} size={80} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{politician.profile.label}</Text>
        <Wrap spacing={4}>
          <PartyTag party={politician.profile.party} />
          {politician.profile.occupations?.map((occupation, index) => (
            <Tag key={index} content={occupation} />
          ))}
        </Wrap>
        <Wrap spacing={4}>
          <TouchableOpacity
            style={isFollowed ? styles.unFollowBtn : styles.followBtn}
            onPress={() => {
              if (isFollowed) {
                data.dbManager.removeFollowedId(politician.profile!.id);
                setIsFollowed(false);
              } else {
                data.dbManager.pushFollowId(politician.profile!.id);
                setIsFollowed(true);
              }
            }}>
            {isFollowed ? (
              <Text style={styles.unFollowText}>Folge ich</Text>
            ) : (
              <Text style={styles.followText}>Folgen</Text>
            )}
          </TouchableOpacity>
        </Wrap>
      </View>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
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
  followBtn: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.white40,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    borderRadius: 4,
  },
  unFollowBtn: {
    backgroundColor: Colors.baseWhite,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
