import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import {ApiPollBundestagData} from '../../logic/api';
import DashboardPollCard from './DashboardPollCard';
import {Colors} from '../../theme';

interface PollCarouselProps {
  polls: ApiPollBundestagData[];
  eu?: boolean;
}

const PollCarousel = ({polls, eu}: PollCarouselProps) => {
  const navigator = useContext(NavigationContext);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Abstimmungen {eu ? 'EU' : ''}</Text>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => {
            navigator?.navigate('DashboardPolls', {polls});
          }}>
          <Text style={styles.btnText}>mehr</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.scrollContainer}>
        {polls.map((poll, index) => (
          <DashboardPollCard
            key={index}
            poll={poll.poll}
            result={poll.result}
            politicians={poll.politicians}
            last_politician={poll.last_politician}
          />
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  moreBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
});

export default PollCarousel;
