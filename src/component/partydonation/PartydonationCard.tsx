import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import {ApiParty} from '../../logic/api';
import {LineChart} from 'react-native-chart-kit';
import {averageDonations, getSumUpDonationsInMillion} from '../../utils/util';

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
  const screenWidth = useWindowDimensions().width;
  const chartConfig = {
    backgroundGradientFrom: Colors.cardBackground,
    backgroundGradientTo: Colors.cardBackground,
    color: () => party.party_style.background_color,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
  };

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
                data: donations,
              },
            ],
          }}
          width={164}
          height={72}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          chartConfig={chartConfig}
          fromZero={true}
          style={styles.lineChart}
          bezier
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
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
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
});

export default PartyDonationCard;
