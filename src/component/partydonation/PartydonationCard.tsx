import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../theme';
const PartyDonationCard = () => {
  const data = {
    party: 'MLPD',
    amount: '50.000',
    date: '12.10.2021',
    spender: 'Günter Slave aus Dresden',
  };
  const data2 = {
    party: 'MLPfasdfD',
    amount: '50asdfasdf.000',
    date: '12.10asdfsdaf.2021',
    spender: 'Günter Slave aus Dresden',
  };
  const data3 = {
    party: 'MLPfasdfD',
    amount: '50asdfasdf.000',
    date: '12.10asdfsdaf.2021',
    spender: 'Günter Slave aus Dresden',
  };

  return (
    //Loop through the array and display the data

    <View>
      <Text style={styles.headerText}>Header</Text>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header}></View>

          <Text style={styles.partyName}>{data.party}</Text>
          <Text style={styles.donationAmount}>{data.amount} €</Text>
        </View>
        <View style={styles.separatorLine} />
        <View>
          <Text style={styles.dateText}>{data.date}</Text>
          <Text style={styles.spenderText}>{data.spender}</Text>
        </View>
      </View>
      <View>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.partyName}>{data.party}</Text>
            <Text style={styles.donationAmount}>{data.amount} €</Text>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <Text style={styles.dateText}>{data.date}</Text>
            <Text style={styles.spenderText}>{data.spender}</Text>
          </View>
        </View>
      </View>

      <View>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.partyName}>{data.party}</Text>
            <Text style={styles.donationAmount}>{data.amount} €</Text>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <Text style={styles.dateText}>{data.date}</Text>
            <Text style={styles.spenderText}>{data.spender}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => {
            navigator?.navigate('DashboardSidejobs');
          }}>
          <Text style={styles.btnText}>mehssr</Text>
        </TouchableOpacity>
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

export default PartyDonationCard;
