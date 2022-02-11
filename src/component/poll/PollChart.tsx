import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {Colors} from '../../theme';

interface PollChartProps {
  chartData: number[];
}

const PollChart = ({chartData}: PollChartProps) => {
  return (
    <View style={styles.votesCard}>
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>Gesamt</Text>
        <Text style={styles.totalVote}>{chartData[0]} Abgeordnete</Text>
      </View>
      <View style={styles.separatorLine} />
      <View style={styles.contentContainer}>
        <View style={styles.chartContainer}>
          <PieChart
            widthAndHeight={100}
            series={chartData.slice(1, 5)}
            sliceColor={['#45C66F', '#E54A6F', '#1382E3', '#464750']}
            doughnut={true}
            coverRadius={0.7}
            coverFill={Colors.cardBackground}
          />
        </View>
        <View style={styles.voteNumberCardContainer}>
          <View style={styles.voteNumberContainer}>
            <View style={[styles.vote, styles.yes]} />
            <Text style={styles.voteNumberText}>Ja: {chartData[1]}</Text>
          </View>
          <View style={styles.voteNumberContainer}>
            <View style={[styles.vote, styles.no]} />
            <Text style={styles.voteNumberText}>Nein: {chartData[2]}</Text>
          </View>
          <View style={styles.voteNumberContainer}>
            <View style={[styles.vote, styles.abstain]} />
            <Text style={styles.voteNumberText}>Enthalten: {chartData[3]}</Text>
          </View>
          <View style={styles.voteNumberContainer}>
            <View style={[styles.vote, styles.noShow]} />
            <Text style={styles.voteNumberText}>Abwesend: {chartData[4]}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  votesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Inter',
    padding: 12,
  },
  totalVote: {
    color: Colors.foreground,
    fontWeight: '400',
    fontSize: 11,
    fontFamily: 'Inter',
    padding: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: 24,
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    marginLeft: 14,
  },
  voteNumberCardContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginLeft: 14,
  },
  voteNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vote: {
    height: 12,
    width: 12,
    borderRadius: 2,
    marginVertical: 6,
    marginLeft: 2,
    marginRight: 8,
  },
  yes: {
    backgroundColor: '#45C66F',
  },
  no: {
    backgroundColor: '#E54A6F',
  },
  abstain: {
    backgroundColor: '#1382E3',
  },
  noShow: {
    backgroundColor: '#464750',
  },
  voteNumberText: {
    color: Colors.foreground,
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400',
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
});

export default PollChart;
