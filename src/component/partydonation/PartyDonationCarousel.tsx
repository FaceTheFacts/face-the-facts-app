import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import {ApiBundestagPartyDonation} from '../../logic/api';
import {Colors} from '../../theme';
import PartyDonationCard from './PartydonationCard';

interface PartyDonationCarouselProps {
  donations: ApiBundestagPartyDonation[];
}

const PartyDonationCarousel = ({donations}: PartyDonationCarouselProps) => {
  const navigator = useContext(NavigationContext);
  return (
    <View style={styles.topContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Parteispenden</Text>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => {
            navigator?.navigate('BundestagDonations', {
              donations,
            });
          }}>
          <Text style={styles.btnText}>mehr</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainerContent}
        style={styles.scrollContainer}>
        {donations.map((donation, index) => (
          <PartyDonationCard
            key={index}
            party={donation.party}
            donations={donation.donations_over_32_quarters}
            donations_total={donation.donations_total}
          />
        ))}
      </ScrollView>
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
  scrollContainerContent: {
    paddingRight: 24,
  },
});

export default PartyDonationCarousel;
