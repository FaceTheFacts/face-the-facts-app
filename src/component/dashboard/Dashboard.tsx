import {NavigationContext} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {useQuery} from 'react-query';
import {
  ApiPaginatedData,
  ApiSpeechBundestag,
  ApiSidejobsBundestag,
  ApiPollBundestagData,
  ApiBundestagPartyDonation,
} from '../../logic/api';
import {fetch_api} from '../../logic/fetch';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import {formatDate} from '../../utils/util';
import DashboardPollCard from '../poll/DashboardPollCard';
import SkeletonDashboard from '../skeleton/SkeletonDashboard';
import SpeechCard from '../speech/SpeechCard';
import SideJobCard from '../SideJobCard';
import ErrorCard from '../Error';
import PartyDonationCard from '../partydonation/PartydonationCard';

const Dashboard = () => {
  const navigator = useContext(NavigationContext);
  const database = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    database.dbManager.getFollowedIds().then(setFollowedIds);
  }, [database]);
  let query = '';
  Array.from(followedIds).map(id => (query += `follow_ids=${id}&`));

  const {
    data: speeches,
    isLoading: speechesLoading,
    isError: speechesError,
  } = useQuery<ApiPaginatedData<ApiSpeechBundestag> | undefined, Error>(
    'speeches: Bundestag page:1',
    () =>
      fetch_api<ApiPaginatedData<ApiSpeechBundestag>>(
        'bundestag/speeches?page=1',
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {
    data: polls,
    isLoading: pollsLoading,
    isError: pollsError,
  } = useQuery<ApiPollBundestagData[] | undefined, Error>(
    `polls: Bundestag ${query}`,
    () => fetch_api<ApiPollBundestagData[]>(`bundestag/polls?${query}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {
    data: sidejobs,
    isLoading: sidejobsLoading,
    isError: sidejobsError,
  } = useQuery<ApiSidejobsBundestag[] | undefined, Error>(
    'sidejobs: Bundestag',
    () => fetch_api<ApiSidejobsBundestag[]>('bundestag/sidejobs?size=5'),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

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
  const {width} = useWindowDimensions();
  if (
    pollsLoading ||
    speechesLoading ||
    sidejobsLoading ||
    partydonationsLoading
  ) {
    return <SkeletonDashboard />;
  }
  if (pollsError || sidejobsError || speechesError || partydonationsError) {
    return <ErrorCard />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {partydonations && partydonations.length > 0 && (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Parteispenden</Text>
            {/* <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
                navigator?.navigate('DashboardPartyDonations', {polls});
              }}>
              <Text style={styles.btnText}>mehr</Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}>
            {partydonations.map((partydonation, index) => (
              <PartyDonationCard
                key={index}
                party={partydonation.party}
                donations={partydonation.donations_over_96_months.reverse()}
                donations_total={partydonation.donations_total}
              />
            ))}
          </ScrollView>
        </>
      )}
      {speeches && (
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Reden</Text>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
                navigator?.navigate('DashboardSpeeches', {
                  speeches: speeches,
                });
              }}>
              <Text style={styles.btnText}>mehr</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{paddingRight: 24}}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}>
            {speeches.items.map((speech, index) => (
              <SpeechCard
                key={index}
                politicianId={speech.speaker.id}
                politicianName={speech.speaker.label}
                party={speech.speaker.party}
                title={speech.title}
                date={formatDate(speech.date)}
                video={speech.videoFileURI}
                cardHeight={143}
                cardWidth={width * 0.71}
                verticalScroll
              />
            ))}
          </ScrollView>
        </View>
      )}

      {polls && (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Abstimmungen</Text>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
                navigator?.navigate('DashboardPolls', {polls});
              }}>
              <Text style={styles.btnText}>mehr</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollContainer}>
            {polls.map((poll, index) => (
              <DashboardPollCard
                key={index}
                poll={poll.poll}
                result={poll.result}
                politicians={poll.politicians}
                last_politician={poll.last_politician}
              />
            ))}
          </View>
        </View>
      )}
      {sidejobs && (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Nebentätigkeiten</Text>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => {
                navigator?.navigate('DashboardSidejobs');
              }}>
              <Text style={styles.btnText}>mehr</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingRight: 24}}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}>
            {sidejobs.map((sidejob, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  database.dbManager.pushHistoryItem(sidejob.politician.id);
                  navigator?.navigate('Politician', {
                    politicianId: sidejob.politician.id,
                    politicianName: sidejob.politician.label,
                    party: sidejob.politician.party,
                    toSideJobs: true,
                  });
                }}>
                <SideJobCard
                  politicianId={sidejob.politician.id}
                  politicianName={sidejob.politician.label}
                  party={sidejob.politician.party}
                  label={sidejob.sidejob.label}
                  date={sidejob.sidejob.created}
                  income={sidejob.sidejob.income_level}
                  organization={sidejob.sidejob.sidejob_organization.label}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
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
});

export default Dashboard;
