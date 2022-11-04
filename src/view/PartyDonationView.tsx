import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  useWindowDimensions,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import Icon from '../component/Icon';
import BackButton from '../component/BackButton';
import {
  ApiBundestagPartyDonation,
  ApiPartyDonationDetails,
  GroupedPartyDonations,
} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {FilterIcon} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import ErrorCard from '../component/Error';
import {LineChart} from 'react-native-chart-kit';
import PartyTag from '../component/PartyTag';
import {formatDate} from '../utils/util';
import {
  groupAndSortDonations,
  getAdditionalDonationInformation,
  round,
  formatDonationsInThousands,
} from '../logic/partydonation';
import {formatDate} from '../utils/util';
import SkeletonDashboard from '../component/skeleton/SkeletonDashboardSidejob';

export interface PartyDonationViewProps {
  route: RouteProp<{params: PartyDonationViewParams}, 'params'>;
}

type PartyDonationViewParams = {
  partydonation: ApiBundestagPartyDonation[];
};

const PartyDonationView = ({route}: PartyDonationViewProps) => {
  const screenWidth = useWindowDimensions().width;
  // selection == 2 -> show donations of past 4 years
  // selection == 1 -> show donations of past 8 years
  // selection == 0 -> show donations of all time
  // TO DO Rename it to time frame
  const [selection, setSelection] = useState<number>(2);
  const [additionalDonationInfo, setAdditionalDonationInfo] = useState<any>();
  const [groupedDonations, setGroupedDonations] =
    useState<GroupedPartyDonations[]>();
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
  } = useQuery<ApiPartyDonationDetails | undefined, Error>(
    'partdonation details',
    () => fetch_api<ApiPartyDonationDetails>('partydonationsdetails'),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  useEffect(() => {
    if (partydonations) {
      setGroupedDonations(groupAndSortDonations(partydonations, selection));
      setAdditionalDonationInfo(
        getAdditionalDonationInformation(partydonations, selection),
      );
    }
  }, [partydonations, selection]);

  if (partydonationsError) {
    return <ErrorCard />;
  }

  if (partydonationsLoading) {
    // To Do: Loading Screen
    return <SkeletonDashboard />;
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
        <View style={{flex: 1}}></View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.filterCategoryContainer}>
          <View style={styles.timeframeContainer}>
            <TouchableOpacity
              style={selection === 2 ? styles.timeframeButtonActive : {}}
              onPress={() => setSelection(2)}>
              <Text
                style={[
                  selection === 2
                    ? styles.timeframeActive
                    : styles.timeframeText,
                ]}>
                4 Jahre
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={selection === 1 ? styles.timeframeButtonActive : {}}
              onPress={() => setSelection(1)}>
              <Text
                style={[
                  selection === 1
                    ? styles.timeframeActive
                    : styles.timeframeText,
                ]}>
                8 Jahre
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={selection === 0 ? styles.timeframeButtonActive : {}}
              onPress={() => setSelection(0)}>
              <Text
                style={[
                  selection === 0
                    ? styles.timeframeActive
                    : styles.timeframeText,
                ]}>
                Allzeit
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => modal.current?.open()}>
            <Icon style={styles.icon} icon={FilterIcon} />
            <Text style={styles.filterText}>Filtern</Text>
          </TouchableOpacity>
        </View>
        {/* {partydonations && (
          <View>
            <LineChart
              data={{
                labels: [],
                datasets: [],
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
              <Text style={styles.dateText}>2022</Text> 
            </View>
          </View>
        )}*/}
        <View style={styles.separatorLine} />
        {additionalDonationInfo && (
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'white'}}>Gesamtspenden</Text>
              <Text style={{color: Colors.white70}}>
                {additionalDonationInfo.totalDonations}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'white'}}>Ø Spenden/Jahr</Text>
              <Text style={{color: Colors.white70}}>
                {additionalDonationInfo.averageDonationPerYear}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'white'}}>Ø Spende</Text>
              <Text style={{color: Colors.white70}}>
                {additionalDonationInfo.averageDonation}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'white', marginRight: 8}}>
                Größter Spender
              </Text>
              <Text
                style={{
                  color: Colors.white70,
                  justifyContent: 'flex-end',
                  textAlign: 'right',
                  maxWidth: screenWidth * 0.65,
                }}>
                {additionalDonationInfo.largestDonor.organization.donor_name}{' '}
                mit {additionalDonationInfo.largestDonor.sum}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.separatorLine} />
        {partydonations &&
          groupAndSortDonations(partydonations, selection).map(
            (groupedDonations: GroupedPartyDonations, index1: number) => (
              <View key={index1}>
                <View style={styles.cardHeader}>
                  <View style={styles.monthContainer}>
                    <Text style={styles.month}>{groupedDonations.month}</Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.total}>Gesamt</Text>
                    <Text style={styles.dateText}>
                      {formatDonationsInThousands(groupedDonations.sum)}
                    </Text>
                  </View>
                </View>
                {groupedDonations.sorted_donations.map((donation, index2) => (
                  <View style={styles.donationCard} key={index2}>
                    <View style={styles.donationCardHeader}>
                      <Text style={styles.dateText}>
                        {formatDate(donation.date)}
                      </Text>
                      <Text style={styles.sum}>
                        {formatDonationsInThousands(donation.amount)}
                      </Text>
                    </View>
                    <Text style={[styles.orgText, {width: 0.7 * screenWidth}]}>
                      {donation.party_donation_organization.donor_name} aus{' '}
                      {donation.party_donation_organization.donor_city}
                    </Text>
                    <PartyTag party={donation.party.party_style} />
                  </View>
                ))}
              </View>
            ),
          )}
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
    justifyContent: 'space-around',
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
    flex: 4,
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
  timeframeButtonActive: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  filterCategoryContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 192,
  },
  timeframeText: {
    color: Colors.white40,
    margin: 8,
  },
  timeframeActive: {
    color: Colors.baseWhite,
    margin: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 11,
    lineHeight: 13,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
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
  totalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
  },
  total: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
  sum: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.baseWhite,
  },
  orgText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.white70,
    marginBottom: 8,
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

export default PartyDonationView;
