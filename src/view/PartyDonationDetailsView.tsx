import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  useWindowDimensions,
  SectionList,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import BackButton from '../component/BackButton';
import {PartyDonationDetails} from '../logic/api';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import ErrorCard from '../component/Error';
import {
  groupAndSortDonations,
  getAdditionalDonationInformation,
  getGraphData,
} from '../logic/partydonation';
import {RootStackParamList} from './RootStackParams';
import GraphComponent from '../component/partydonation/GraphComponent';
import TimeFrameFilter from '../component/partydonation/TimeFrameFilter';
import AdditionalInformation from '../component/partydonation/AdditionalInformation';
import PartyDonationDetailsCard from '../component/partydonation/PartyDonationDetailsCard';
import DonationSectionHeader from '../component/partydonation/DonationSectionHeader';
import SkeletonPartyDonation from '../component/skeleton/SkeletonPartyDonation';

export interface PartyDonationDetailsViewProps {
  route: RouteProp<RootStackParamList, 'PartyDonationDetails'>;
}

const PartyDonationDetailsView = ({route}: PartyDonationDetailsViewProps) => {
  const screenWidth = useWindowDimensions().width;
  // selection == 2 -> show donations of past 4 years
  // selection == 1 -> show donations of past 8 years
  // selection == 0 -> show donations of all time
  // TO DO Rename it to time frame
  const [selection, setSelection] = useState<number>(2);
  const {
    data: partydonations,
    isLoading: partydonationsLoading,
    isError: partydonationsError,
  } = useQuery<PartyDonationDetails | undefined, Error>(
    `${route.params.party.id} partydonation details`,
    () =>
      fetch_api<PartyDonationDetails>(
        `partydonationsdetails?party_id=${route.params.party.id}`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const groupedDonations = useMemo(() => {
    if (partydonations) {
      return groupAndSortDonations(partydonations, selection);
    }
    return [];
  }, [partydonations, selection]);

  const graphData = useMemo(() => {
    if (partydonations) {
      return getGraphData(partydonations, selection);
    }
    return {
      data: {
        data: [],
        maxValue: 0,
        noOfSections: 0,
        stepValue: 0,
      },
      yAxis: [],
    };
  }, [partydonations, selection]);

  const additionalDonationInfo = useMemo(() => {
    if (partydonations) {
      return getAdditionalDonationInformation(partydonations, selection);
    }
    return null;
  }, [partydonations, selection]);

  const color =
    route.params.party.party_style.background_color !== '#333333'
      ? route.params.party.party_style.background_color
      : 'white';

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
          <Text style={styles.title}>
            Parteispenden {route.params.party.party_style.display_name}
          </Text>
        </View>
        <View style={styles.placeHolder} />
      </View>
      <SectionList
        style={styles.section}
        sections={groupedDonations}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: {title, sum}}) => (
          <DonationSectionHeader title={title} sum={sum} />
        )}
        renderItem={({item}) => (
          <PartyDonationDetailsCard screenWidth={screenWidth} donation={item} />
        )}
        keyExtractor={(item, index) => item.id + '_' + index}
        ListHeaderComponent={
          <>
            <View style={styles.filterCategoryContainer}>
              <TimeFrameFilter
                timeframe={selection}
                setTimeframe={setSelection}
              />
            </View>
            {partydonations && graphData.data && graphData.yAxis && (
              <GraphComponent
                data={graphData.data}
                yAxis={graphData.yAxis}
                graphColor={color}
                width={screenWidth}
              />
            )}
            {additionalDonationInfo &&
              additionalDonationInfo.averageDonation !== '0 €' && (
                <>
                  <View style={styles.separatorLine} />
                  <AdditionalInformation
                    screenWidth={screenWidth}
                    totalDonations={additionalDonationInfo.totalDonations}
                    averageDonationPerYear={
                      additionalDonationInfo.averageDonationPerYear
                    }
                    averageDonation={additionalDonationInfo.averageDonation}
                    donarName={
                      additionalDonationInfo.largestDonor.organization
                        .donor_name
                    }
                    largestDonation={additionalDonationInfo.largestDonor.sum}
                  />
                  <View style={styles.separatorLine} />
                </>
              )}
          </>
        }
      />
      <SafeAreaView style={styles.iosSafeBottom} />
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
  filterCategoryContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 12,
    paddingTop: 0,
  },
  placeHolder: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '70%',
    alignItems: 'center',
    marginBottom: -10,
  },
  logoIcon: {
    flex: 1,
    color: Colors.foreground,
    height: 56,
    width: 44,
    marginLeft: 45,
    marginRight: -32,
  },
  logoError: {
    flex: 1,
    height: 18,
    width: 166,
  },
});

export default PartyDonationDetailsView;
