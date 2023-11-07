import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ApiPoll} from '../../logic/api';
import {Colors} from '../../theme';
import {NavigationContext} from '@react-navigation/native';
import {formatDate} from '../../utils/util';
import PieChart from 'react-native-pie-chart';
import PoliticianPicture from '../PoliticianPicture';

export interface DashboardPollCardProps {
  poll: ApiPoll;
  result: {yes: number; no: number; abstain: number; no_show: number};
  politicians: number[];
  last_politician: string;
}

const DashboardPollCard = ({
  poll,
  result,
  politicians,
  last_politician,
}: DashboardPollCardProps) => {
  const navigator = useContext<any>(NavigationContext)!;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigator.push('PollDetails', {
          poll,
        });
      }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerImage}>
          <PoliticianPicture politicianId={politicians[0]} size={24} />
          <View style={styles.imageOverlay}>
            <PoliticianPicture politicianId={politicians[1]} size={24} />
            <View style={styles.imageOverlay}>
              <PoliticianPicture politicianId={politicians[2]} size={24} />
              <View style={styles.imageOverlay}>
                <PoliticianPicture politicianId={politicians[3]} size={24} />
                <View style={styles.imageOverlay}>
                  <PoliticianPicture politicianId={politicians[4]} size={24} />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.date}>
            {last_politician}
            <Text style={styles.dateMore}>
              {' '}
              und {result.yes + result.no + result.abstain} weitere
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
      <View style={styles.pollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.date}>{formatDate(poll.field_poll_date)}</Text>
          <Text style={styles.title} numberOfLines={3}>
            {poll.label}
          </Text>
        </View>
        <View style={styles.chartContainer}>
          <PieChart
            widthAndHeight={72}
            series={[result.yes, result.no, result.abstain, result.no_show]}
            sliceColor={['#45C66F', '#E54A6F', '#1382E3', '#464750']}
            doughnut={true}
            coverRadius={0.75}
            coverFill={Colors.cardBackground}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  headerImage: {
    width: 24,
    height: 24,
    flexDirection: 'row',
  },
  imageOverlay: {
    flex: 1,
    width: 24,
    height: 24,
    position: 'relative',
    right: 8,
    flexDirection: 'row',
  },
  headerText: {
    marginLeft: 72,
    justifyContent: 'center',
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  pollContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 3,
    marginRight: 8,
    justifyContent: 'center',
  },
  chartContainer: {
    flex: 1,
    marginRight: 8,
  },
  imageText: {
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
  },
  title: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginTop: 4,
  },
  date: {
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
    opacity: 1,
  },
  dateMore: {
    color: Colors.foreground,
    fontSize: 11,
    fontFamily: 'Inter',
    opacity: 0.5,
  },
});

export default DashboardPollCard;
