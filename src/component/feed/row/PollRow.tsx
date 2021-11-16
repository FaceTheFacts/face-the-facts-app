import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {Politician} from '../../../logic/data';
import {Colors} from '../../../theme';
import PoliticianPicture from '../../PoliticianPicture';

export interface Poll {
  id: string;
  title: string;
  participants: Politician[];
  date: string;
}

interface PollRowProps {
  poll: Poll;
}

const PollRow = ({poll}: PollRowProps) => {
  const {width} = useWindowDimensions();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.image}>
          <PoliticianPicture
            politicianId={poll.participants[0].id.toString()}
            size={48}
          />
        </View>
        <View style={[{width: width - 80}]}>
          <View style={styles.title}>
            <Text style={styles.boldText}>{poll.participants[0].name}</Text>
            {poll.participants.length > 1 ? (
              <>
                <Text style={styles.titleText}> und </Text>
                <Text style={styles.boldText}>
                  {poll.participants.length - 1} weitere
                </Text>
                <Text style={styles.titleText}> haben an einer </Text>
              </>
            ) : (
              <Text style={styles.titleText}> hat an einer </Text>
            )}
            <TouchableOpacity>
              <Text style={styles.linkText}>Abstimmung</Text>
            </TouchableOpacity>
            <Text style={styles.titleText}> teilgenommen.</Text>
          </View>
          <Text style={styles.descText}>{poll.title}</Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 16,
    flexDirection: 'row',
  },
  image: {
    paddingRight: 8,
  },
  title: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
    color: Colors.white40,
  },
  descText: {
    fontSize: 11,
    color: Colors.baseWhite,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseBlueLight,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
    marginTop: 16,
    // marginVertical: 16,
  },
});

export default PollRow;
