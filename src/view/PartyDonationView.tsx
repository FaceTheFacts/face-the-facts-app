import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import Icon from '../component/Icon';
import BackButton from '../component/BackButton';
import {ApiPoliticianContext, ApiBundestagPartyDonation} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {ClearIcon, FilterIcon} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import ErrorCard from '../component/Error';
import {LineChart} from 'react-native-chart-kit';
import PartyTag from '../component/PartyTag';

export interface PartyDonationViewProps {
  route: RouteProp<{params: PartyDonationViewParams}, 'params'>;
}

type PartyDonationViewParams = {
  partydonation: ApiBundestagPartyDonation[];
};

const PartyDonationView = ({route}: PartyDonationViewProps) => {
  const [filter, setFilter] = useState<number[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const modal = useRef<Modalize>(null);
  useEffect(() => {
    let query = '';
    filter.forEach(filterItem => {
      query += `filters=${filterItem + 1}&`;
    });
    setFilterQuery(query);
  }, [filter]);

  /* const chartConfig = {
    backgroundGradientFrom: Colors.background,
    backgroundGradientTo: Colors.background,
    color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
    strokeWidth: 2, // optional, default 3
  }; */

  const {
    data: partydonations,
    isLoading: partydonationsLoading,
    isError: partydonationsError,
  } = useQuery<ApiBundestagPartyDonation[] | undefined, Error>(
    'partdonations: Bundestag',
    () => fetch_api<ApiBundestagPartyDonation[]>('homepagepartydonations'),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (partydonationsError) {
    return <ErrorCard />;
  }

  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Parteispenden Bundestag</Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.filterCategoryContainer}>
          <Text style={{color: 'white'}}>4 Jahre 8 Jahre Allzeit</Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => modal.current?.open()}>
            <Icon style={styles.icon} icon={FilterIcon} />
            <Text style={styles.filterText}>Filtern</Text>
          </TouchableOpacity>
        </View>
        {partydonations && partydonations.length > 0 && (
          <View>
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: partydonations[0].donations_over_96_months,
                    color: () =>
                      partydonations[0].party.party_style.background_color,
                  },
                  {
                    data: partydonations[1].donations_over_96_months,
                    color: () =>
                      partydonations[1].party.party_style.background_color,
                  },
                  {
                    data: partydonations[2].donations_over_96_months,
                    color: () =>
                      partydonations[2].party.party_style.background_color,
                  },
                  {
                    data: partydonations[3].donations_over_96_months,
                    color: () =>
                      partydonations[3].party.party_style.background_color,
                  },
                  {
                    data: partydonations[4].donations_over_96_months,
                    color: () =>
                      partydonations[4].party.party_style.background_color,
                  },
                ],
              }}
              width={315}
              height={180}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withDots={false}
              withInnerLines={false}
              withOuterLines={true}
              withHorizontalLines={true}
              chartConfig={{
                backgroundGradientFrom: Colors.background,
                backgroundGradientTo: Colors.background,
                color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
                strokeWidth: 2, // optional, default 3
              }}
              fromZero={true}
              formatYLabel={value => {
                let num = parseFloat(value);
                let str = Math.floor(num).toLocaleString('de-DE').slice(0, -4);
                if (str.length > 0) {
                  return str + 'k';
                } else {
                  return '';
                }
              }}
              bezier
            />
            <View style={styles.dateContainer}>
              {/*  <Text style={styles.dateText}>2014</Text>
              <Text style={styles.dateText}>2022</Text> */}
            </View>
          </View>
        )}
        <View style={styles.separatorLine} />
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: 'white'}}>Gesamtspenden</Text>
            <Text style={{color: Colors.white70}}>7.578.513 €</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: 'white'}}>Ø Spenden/Jahr</Text>
            <Text style={{color: Colors.white70}}>306.538 €</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: 'white'}}>Ø Spende</Text>
            <Text style={{color: Colors.white70}}>75.523 €</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: 'white'}}>Größter Spender</Text>
            <Text style={{color: Colors.white70}}>
              Max Mustermann aus Frankfurt
            </Text>
          </View>
        </View>
        <View style={styles.separatorLine} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.monthContainer}>
            <Text style={styles.month}>September</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'white'}}>Gesamt</Text>
            <Text style={{color: Colors.white70}}>208.000 €</Text>
          </View>
        </View>
        {partydonations?.map((partydonations, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.dateText}>12.10.2021</Text>
                <Text style={styles.sum}>52.000€</Text>
              </View>
              <Text style={styles.orgText}>
                Günter Slave-Goldschmidt aus Dresden-Neustadt
              </Text>
              <PartyTag party={partydonations.party} />
            </View>
          </View>
        ))}
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />

      {/* Filter Popup
        <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <Text>Filter</Text>
      </BottomSheet> */}
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  iosSafeBottom: {
    flex: 0,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.cardBackground,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
  },
  backButtonContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
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
  filterCategoryContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
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
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 20,
  },
  categoryText: {
    color: Colors.foreground,
    fontSize: 13,
    paddingRight: 12,
  },
  clearIcon: {
    color: Colors.foreground,
    width: 10,
    height: 10,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  modalStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginRight: 8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 6,
  },
  month: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14.52,
    fontFamily: 'Inter',
    color: Colors.foreground,
    textTransform: 'uppercase',
  },
  cardContainer: {
    flex: 1,
  },
  sum: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 15.73,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
  orgText: {
    marginVertical: 5,
    fontSize: 11,
    lineHeight: 13.31,
    fontWeight: '400',
    color: Colors.white70,
  },
  card: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginVertical: 8,
  },
});

export default PartyDonationView;
