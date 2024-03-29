import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import {ApiParty} from '../../logic/api';
import {LineChart} from 'react-native-chart-kit';
import {
  formatDonationsInMillions,
  formatDonationsInThousands,
  getAverageDonation,
} from '../../logic/partydonation';
import {NavigationContext} from '@react-navigation/native';

interface PartyDonationCardProps {
  party: ApiParty;
  donations: number[];
  donations_total: number;
}

const PartyDonationCard = ({
  party,
  donations,
  donations_total,
}: PartyDonationCardProps) => {
  const navigator = useContext<any>(NavigationContext)!;
  const screenWidth = useWindowDimensions().width;
  const chartConfig = {
    backgroundGradientFrom: Colors.cardBackground,
    fillShadowGradientFromOpacity: 0.6,
    fillShadowGradientToOpacity: 0.0,
    backgroundGradientTo: Colors.cardBackground,
    color: () => party.party_style.background_color,
    strokeWidth: 2, // optional, default 3
  };
  const currentYear = new Date().getFullYear();
  const pastYear = currentYear - 7;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigator.push('PartyDonationDetails', {
          party,
        });
      }}>
      <View style={styles.header} />
      <View style={styles.politicianContainer}>
        <PartyTag party={party.party_style} />
        <View style={styles.info}>
          <Text style={styles.nameText}>Gesamt</Text>
          <Text style={styles.totalAmount}>
            {formatDonationsInMillions(donations_total)}
          </Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: donations,
            },
          ],
        }}
        width={screenWidth * 0.45}
        height={48}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        chartConfig={chartConfig}
        fromZero={true}
        style={styles.lineChart}
        bezier
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{pastYear}</Text>
        <Text style={styles.dateText}>{currentYear}</Text>
      </View>
      <View style={styles.separatorLine} />
      <View>
        <Text style={styles.averageText}>
          Ø {formatDonationsInThousands(getAverageDonation(donations_total, 8))}{' '}
          / Jahr
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  politicianContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 8,
  },
  nameText: {
    fontSize: 11,
    lineHeight: 11,
    color: Colors.white70,
    marginBottom: 3,
  },
  totalAmount: {
    fontFamily: 'Inter',
    flex: 1,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 15,
    color: '#FCFCFC',
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  lineChart: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: -7,
    marginTop: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
  },

  averageText: {
    fontSize: 15,
    color: Colors.white70,
  },
});

export default PartyDonationCard;
