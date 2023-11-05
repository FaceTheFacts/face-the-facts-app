import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme';
import {FormattedPartyDonation} from '../../logic/api';
import PartyTag from '../PartyTag';

interface PartyDonationDetailsCardProps {
  screenWidth: number;
  donation: FormattedPartyDonation;
  party?: boolean;
}

const PartyDonationDetailsCard = ({
  screenWidth,
  donation,
  party,
}: PartyDonationDetailsCardProps) => {
  return (
    <View style={styles.donationCard}>
      <View style={styles.donationCardHeader}>
        <Text style={styles.dateText}>{donation.date}</Text>
        <Text style={styles.sum}>{donation.amount}</Text>
      </View>
      <Text style={[styles.orgText, {width: 0.7 * screenWidth}]}>
        {donation.party_donation_organization.donor_name} aus{' '}
        {donation.party_donation_organization.donor_city}
      </Text>
      {party && <PartyTag party={donation.party.party_style} />}
    </View>
  );
};

const styles = StyleSheet.create({
  sum: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
  orgText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.white70,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 13,
    color: Colors.white70,
  },
  donationCard: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginVertical: 4,
  },
  donationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PartyDonationDetailsCard;
