import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme';

interface AdditionalInformationProps {
  screenWidth: number;
  totalDonations: string;
  averageDonationPerYear: string;
  averageDonation: string;
  donarName: string;
  largestDonation: string;
}

const AdditionalInformation = ({
  screenWidth,
  totalDonations,
  averageDonationPerYear,
  averageDonation,
  donarName,
  largestDonation,
}: AdditionalInformationProps) => {
  const donationDetails = [
    {label: 'Gesamtspenden', value: totalDonations},
    {label: 'Spenden/Jahr', value: averageDonationPerYear},
    {label: 'Ø Spende', value: averageDonation},
    {
      label: 'Größter Spender',
      value:
        largestDonation !== '0 €'
          ? `${donarName} mit ${largestDonation}`
          : 'nicht vorhanden',
    },
  ];
  return (
    <View>
      {donationDetails.map(detail => (
        <View key={detail.label} style={styles.informationContainer}>
          <Text style={styles.label}>{detail.label}</Text>
          <Text
            style={[
              styles.value,
              {
                maxWidth: screenWidth * 0.65,
              },
            ]}>
            {detail.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  informationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  label: {
    color: 'white',
    marginRight: 8,
  },
  value: {
    color: Colors.white70,
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
});

export default AdditionalInformation;
