import React, {createContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PoliticianPositions from '../component/politician/PoliticianPositions';
import PoliticianConstituency from '../component/politician/PoliticianConstituency';
import BackButton from '../component/BackButton';
import {Colors} from '../theme';
import PoliticianHeader from '../component/politician/PoliticianHeader';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {
  ApiNews,
  ApiParty,
  ApiPoliticianProfile,
  ApiPositions,
  ApiPoliticianContext,
  ApiSpeeches,
  ApiPoliticianConstituency,
} from '../logic/api';
import SkeletonPoliticianProfile from '../component/skeleton/SkeletonPoliticianProfile';
import PoliticianProfile from '../component/politician/PoliticianProfile';
import ErrorCard from '../component/Error';

type PoliticianViewParams = {
  politicianId: number;
  politicianName: string;
  party: ApiParty;
  toSideJobs?: boolean;
};

interface PoliticianViewProps {
  route: RouteProp<{params: PoliticianViewParams}, 'params'>;
}

export const PoliticianContext = createContext<ApiPoliticianContext | null>(
  null,
);

const PoliticianView = ({route}: PoliticianViewProps) => {
  const politicianId = route.params.politicianId;
  const politicianName = route.params.politicianName;
  const party = route.params.party;
  const Tab = createMaterialTopTabNavigator();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () => fetch_api<ApiPoliticianProfile>(`politician/${politicianId}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const {data: speeches} = useQuery<ApiSpeeches | undefined, Error>(
    `speeches:${politicianId}`,
    () => fetch_api<ApiSpeeches>(`politician/${politicianId}/speeches?page=1`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {data: news} = useQuery<ApiNews | undefined, Error>(
    `news:${politicianId}`,
    () => fetch_api<ApiNews>(`politician/${politicianId}/news?page=1&size=6`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {data: positions, isLoading: positionLoading} = useQuery<
    ApiPositions | undefined,
    Error
  >(
    `positions:${politicianId}`,
    () => fetch_api<ApiPositions>(`politician/${politicianId}/positions`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  const {data: constituency, isLoading: constituencyLoading} = useQuery<
    ApiPoliticianConstituency | undefined,
    Error
  >(
    `constituency:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianConstituency>(
        `politician/${politicianId}/constituencies`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (profileLoading || positionLoading || constituencyLoading) {
    return (
      <SkeletonPoliticianProfile
        politicianId={politicianId}
        politicianName={politicianName}
        party={party}
      />
    );
  }
  if (profileError) {
    return <ErrorCard />;
  }

  return (
    <PoliticianContext.Provider
      value={{profile, news, speeches, positions, constituency}}>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.container}>
        <PoliticianHeader />
        {!(positions?.positions && positions?.positions.length > 0) &&
        !(constituency && constituency.politicians.length > 0) ? (
          <PoliticianProfile toSideJobs={route.params.toSideJobs} />
        ) : (
          <Tab.Navigator
            sceneContainerStyle={{backgroundColor: Colors.background}}
            screenOptions={() => ({
              swipeEnabled: false,
              tabBarActiveTintColor: Colors.baseWhite,
              tabBarInactiveTintColor: '#FCFCFC66',
              tabBarIndicatorStyle: {
                backgroundColor: Colors.baseWhite,
              },
              tabBarLabelStyle: styles.tabBarLabel,
              tabBarStyle: {backgroundColor: Colors.cardBackground},
            })}>
            <Tab.Screen
              name="Profilseite"
              children={() => (
                <PoliticianProfile toSideJobs={route.params.toSideJobs} />
              )}
            />
            {positions?.positions && positions?.positions.length > 0 && (
              <Tab.Screen name="Positionen" component={PoliticianPositions} />
            )}
            {constituency && constituency.politicians.length > 0 && (
              <Tab.Screen name="Wahlkreis" component={PoliticianConstituency} />
            )}
          </Tab.Navigator>
        )}
      </View>
    </PoliticianContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    textTransform: 'none',
  },
});
export default PoliticianView;
