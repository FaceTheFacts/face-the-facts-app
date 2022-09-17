import React from 'react';
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

//Define the interface for the party spending card props
interface PartyspendingCardProps {
  party: ApiParty;
  amountText: string;
  amountNumber: string;
  spender: string;
}

//Define the party spending card component

const PartyspendingCard = ({
  party,
  amountText,
  amountNumber,
  spender,
}: PartyspendingCardProps) => {
  return (
    //Loop through the array and display the data

    <View>
      <Text style={styles.headerText}>Parteispenden</Text>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header}></View>
        </View>
        <View style={styles.politicianContainer}>
          <PartyTag party={party}></PartyTag>

          <View style={styles.info}>
            <Text style={styles.nameText}>Gesamt</Text>
            <Text style={styles.totalAmount}>{amountNumber}</Text>
          </View>
        </View>
        <View style={styles.separatorLine} />
        <Text style={styles.donationAmount}>
          Placeholder graph 2014 --------^------
        </Text>
        <View style={styles.separatorLine} />
        <View>
          <Text style={styles.spenderText}>{spender}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 12,
    marginLeft: 12,

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

  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
  },

  spenderText: {
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
});

export default PartyspendingCard;
