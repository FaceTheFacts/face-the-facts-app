import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import {ApiParty} from '../../logic/api';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

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
  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundGradientFrom: Colors.cardBackground,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.cardBackground,
    backgroundGradientToOpacity: 1,
    color: () => party.party_style.background_color,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
  };

  function round(value: number, decimals: number) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  function getSumUpDonationsInMillion(donations_sum: number) {
    return round(donations_sum / 1000000, 2);
  }

  function averageDonations(donations_sum: number) {
    const average = Math.floor(donations_sum / 8);
    return average.toLocaleString('de-DE');
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.politicianContainer}>
          <PartyTag party={party} />

          <View style={styles.info}>
            <Text style={styles.nameText}>Gesamt</Text>
            <Text style={styles.totalAmount}>
              {getSumUpDonationsInMillion(donations_total)} Mio €
            </Text>
          </View>
        </View>
        <View style={styles.separatorLine} />
        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: donations.reverse(),
              },
            ],
          }}
          width={screenWidth * 0.75 - 24} // from react-native
          height={80}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          chartConfig={chartConfig}
          fromZero={true}
          style={{
            paddingVertical: 0,
            paddingRight: 0,
          }}
        />
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>2014</Text>
          <Text style={styles.dateText}>2022</Text>
        </View>
        <View style={styles.separatorLine} />
        <View>
          <Text style={styles.averageText}>
            Ø {averageDonations(donations_total)} € / Jahr
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lineChart: {
    flex: 1,
    //responsive layout, fit the chart to the screen width
  },
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 12,
    marginBottom: 12,
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
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.baseWhite,
  },

  partyName: {
    fontSize: 15,
    color: '#FCFCFC',
  },
  donationAmount: {
    fontSize: 15,
    color: '#FCFCFC',
  },

  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  descText: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 15.73,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
});

export default PartyDonationCard;
