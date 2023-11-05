import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Colors} from '../../theme';
import PartyTag from '../PartyTag';
import {ApiParty, PartySeparation} from '../../logic/api';

interface PartyDonationFilterProps {
  navigate: (party: ApiParty) => void;
  parties: PartySeparation;
  filter: number[];
  setFilter: (value: number[]) => void;
}
const PartyDonationFilter = ({
  navigate,
  parties,
  filter,
  setFilter,
}: PartyDonationFilterProps) => {
  const [showMore, setShowMore] = useState(false);
  const handlePartyToggle = (partyId: number) => {
    // If the party is already selected, remove it if the result is >= 2
    if (filter.includes(partyId)) {
      if (filter.length > 2) {
        setFilter(filter.filter(value => value !== partyId));
      } else {
        // Display a message to the user (you can use a toast, modal, etc.)
        Alert.alert(
          'Auswahllimit',
          'Du musst mindestens 2 Parteien auswählen!',
        );
      }
    } else {
      // If the party isn't selected, add it if the result is <= 5
      if (filter.length < 5) {
        setFilter([...filter, partyId]);
      } else {
        // Display a message to the user (you can use a toast, modal, etc.)
        Alert.alert(
          'Auswahllimit',
          'Du kannst nicht mehr als 5 Parteien auswählen!',
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.modalTitleContainer}>
        <Text style={styles.modalTitle}>Parteien</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowMore(!showMore)}>
          <Text style={styles.filterText}>{showMore ? 'weniger' : 'alle'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.partyScrollContainer}>
          <View style={styles.partyRow}>
            {parties &&
              parties.bundestagParties.map((party: ApiParty) => (
                <TouchableOpacity
                  key={party.id}
                  style={
                    filter.includes(party.id)
                      ? styles.partySelected
                      : styles.party
                  }
                  onPress={() => handlePartyToggle(party.id)}>
                  <PartyTag
                    party={{
                      id: party.party_style.id,
                      display_name: party.party_style.display_name,
                      background_color: party.party_style.background_color,
                      foreground_color: party.party_style.foreground_color,
                    }}
                    style={styles.partyStyle}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
      {showMore && (
        <View style={styles.partyColumn}>
          <Text style={styles.modalTitle}>Sonstige Parteien</Text>
          {parties &&
            parties.otherParties.map((party: ApiParty) => (
              <TouchableOpacity
                key={party.id}
                style={styles.otherParty}
                onPress={() => navigate(party)}>
                <PartyTag
                  party={party.party_style}
                  style={styles.otherPartyStyle}
                />
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 33,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
  },
  heading2: {
    fontSize: 17,
    color: Colors.foreground,
    marginBottom: 4,
  },
  text1: {
    fontSize: 13,
    lineHeight: 17.73,
    color: Colors.white70,
  },
  filterBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginTop: 13,
    marginBottom: 3,
  },
  partyScrollContainer: {
    flexDirection: 'column',
    marginVertical: 12,
  },
  partyRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  partyColumn: {
    marginHorizontal: 4,
  },
  party: {
    flexDirection: 'row',
    opacity: 0.3,
    borderRadius: 8,
    marginRight: 8,
  },
  partyStyle: {
    padding: 12,
  },
  partySelected: {
    flexDirection: 'row',
    opacity: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  otherParty: {
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 8,
  },
  otherPartyStyle: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PartyDonationFilter;
