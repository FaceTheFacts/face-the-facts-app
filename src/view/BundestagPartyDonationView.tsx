import React, {useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  useWindowDimensions,
  SectionList,
} from 'react-native';
import {Colors} from '../theme';
import BackButton from '../component/BackButton';
import Icon from '../component/Icon';
import {
  ApiParty,
  BundestagPartyDonationDetails,
  GraphDataList,
  GraphDataOverview,
  PartyDonationDetails,
} from '../logic/api';
import {FilterIcon} from '../icons';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import ErrorCard from '../component/Error';
import {
  groupAndSortDonations,
  getAdditionalDonationInformation,
  getPartyStyle,
  determineStepAndSections,
  getGraphDataOverview,
  generateYearList,
  getDonationsFromSelection,
} from '../logic/partydonation';
import GraphComponent from '../component/partydonation/GraphComponent';
import PartyDonationFilter from '../component/partydonation/PartyDonationFilter';
import AdditionalInformation from '../component/partydonation/AdditionalInformation';
import TimeFrameFilter from '../component/partydonation/TimeFrameFilter';
import DonationSectionHeader from '../component/partydonation/DonationSectionHeader';
import PartyDonationDetailsCard from '../component/partydonation/PartyDonationDetailsCard';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from './RootStackParams';
import {StackNavigationProp} from '@react-navigation/stack';
import SkeletonPartyDonation from '../component/skeleton/SkeletonPartyDonation';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'PartyDonationDetails'
>;

const BundestagDonationsView = () => {
  const screenWidth = useWindowDimensions().width;
  const modal = useRef<Modalize>(null);
  const [filter, setFilter] = useState([1, 2, 4, 5, 9]);
  const [tempFilter, setTempFilter] = useState(filter);
  const navigation = useNavigation<NavigationProp>();
  // selection == 2 -> show donations of past 4 years
  // selection == 1 -> show donations of past 8 years
  // selection == 0 -> show donations of all time
  // TO DO Rename it to time frame
  const [selection, setSelection] = useState<number>(2);
  const {
    data: partydonations,
    isLoading: partydonationsLoading,
    isError: partydonationsError,
  } = useQuery<BundestagPartyDonationDetails | undefined, Error>(
    'partdonation details',
    () =>
      fetch_api<BundestagPartyDonationDetails>(
        'bundestag/partydonationsdetails',
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const parties = useMemo(() => {
    if (partydonations) {
      return getPartyStyle(partydonations);
    }
  }, [partydonations]);
  const groupedDonations = useMemo(() => {
    if (partydonations) {
      const filteredDonations = Object.keys(partydonations)
        .filter(key => filter.includes(parseInt(key, 10)))
        .reduce((obj, key) => {
          obj[key] = partydonations[key];
          return obj;
        }, {} as typeof partydonations);

      return groupAndSortDonations(filteredDonations, selection);
    }
    return [];
  }, [partydonations, selection, filter]);
  const graphDataListResult: GraphDataList = useMemo(() => {
    let highestMaxValue = 1;
    let allGraphData: GraphDataOverview[] = [];
    let allRelevantDonations: PartyDonationDetails = {
      donations_older_than_8_years: [],
      donations_4_to_8_years_old: [],
      donations_less_than_4_years_old: [],
    };

    if (partydonations) {
      const partyStyles = getPartyStyle(partydonations);
      allGraphData = getGraphDataOverview(
        partydonations,
        filter,
        selection,
        partyStyles,
      );
      allGraphData.forEach(graphDataOverview => {
        const maxDataValue = Math.max(
          ...graphDataOverview.data.map(d => d.value),
        );
        if (maxDataValue > highestMaxValue) {
          highestMaxValue = maxDataValue;
        }
      });
      filter.forEach(key => {
        const donations = partydonations[key.toString()];
        if (donations) {
          allRelevantDonations.donations_older_than_8_years.push(
            ...getDonationsFromSelection(donations, 0),
          );
          allRelevantDonations.donations_4_to_8_years_old.push(
            ...getDonationsFromSelection(donations, 1),
          );
          allRelevantDonations.donations_less_than_4_years_old.push(
            ...getDonationsFromSelection(donations, 2),
          );
        }
      });

      // Use accumulated relevant donations to generate yAxis
      const yAxisLabels = generateYearList(selection);
      const {maxValue, stepValue, noOfSections} =
        determineStepAndSections(highestMaxValue);
      return {
        graphDataList: allGraphData,
        maxValue,
        noOfSections,
        stepValue,
        yAxis: yAxisLabels,
      };
    }

    return {
      graphDataList: allGraphData,
      maxValue: highestMaxValue,
      noOfSections: highestMaxValue,
      stepValue: highestMaxValue,
      yAxis: ['2019', '2021', '2023'],
    };
  }, [partydonations, selection, filter]);
  const additionalDonationInfo = useMemo(() => {
    if (partydonations) {
      const filteredDonations = Object.keys(partydonations)
        .filter(key => filter.includes(parseInt(key, 10)))
        .reduce((obj, key) => {
          obj[key] = partydonations[key];
          return obj;
        }, {} as typeof partydonations);

      return getAdditionalDonationInformation(filteredDonations, selection);
    }
    return null;
  }, [partydonations, selection, filter]);

  const navigateToPartyDetails = (party: ApiParty) => {
    if (modal.current) {
      modal.current.close();
    }
    setTimeout(() => {
      navigation.navigate('PartyDonationDetails', {party});
    }, 200);
  };
  if (partydonationsError) {
    return <ErrorCard />;
  }

  if (partydonationsLoading) {
    return <SkeletonPartyDonation />;
  }
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Parteispenden Übersicht</Text>
        </View>
        <View style={styles.placeHolder} />
      </View>
      <SectionList
        style={styles.section}
        sections={groupedDonations}
        keyExtractor={(item, index) => item.date + index}
        stickySectionHeadersEnabled={false}
        renderItem={({item}) => (
          <PartyDonationDetailsCard
            screenWidth={screenWidth}
            donation={item}
            party
          />
        )}
        renderSectionHeader={({section: {title, sum}}) => (
          <DonationSectionHeader title={title} sum={sum} />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.filterCategoryContainer}>
              <TimeFrameFilter
                timeframe={selection}
                setTimeframe={setSelection}
              />
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  setTempFilter(filter);
                  modal.current?.open();
                }}>
                <Icon style={styles.icon} icon={FilterIcon} />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>
            {partydonations && graphDataListResult && (
              <GraphComponent
                yAxis={graphDataListResult.yAxis}
                graphColor={'white'}
                width={screenWidth}
                multiple={graphDataListResult}
              />
            )}
            <View style={styles.separatorLine} />
            {additionalDonationInfo && (
              <AdditionalInformation
                screenWidth={screenWidth}
                totalDonations={additionalDonationInfo.totalDonations}
                averageDonationPerYear={
                  additionalDonationInfo.averageDonationPerYear
                }
                averageDonation={additionalDonationInfo.averageDonation}
                donarName={
                  additionalDonationInfo.largestDonor.organization.donor_name
                }
                largestDonation={additionalDonationInfo.largestDonor.sum}
              />
            )}
            <View style={styles.separatorLine} />
          </>
        }
      />
      <SafeAreaView style={styles.iosSafeBottom} />
      <BottomSheet
        onClosed={() => setFilter(tempFilter)}
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        {parties && (
          <PartyDonationFilter
            navigate={navigateToPartyDetails}
            parties={parties}
            filter={tempFilter}
            setFilter={setTempFilter}
          />
        )}
      </BottomSheet>
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
  section: {
    backgroundColor: Colors.background,
    padding: 12,
    paddingTop: 0,
  },
  filterCategoryContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  filterBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginRight: 8,
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
  placeHolder: {
    flex: 1,
  },
});

export default BundestagDonationsView;
