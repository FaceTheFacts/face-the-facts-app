import React, {createContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PoliticianPositions from '../component/politician/PoliticianPositions';
import PoliticianConstituency from '../component/politician/PoliticianConstituency';
import BackButton from '../component/BackButton';
import {Colors} from '../theme';
import PoliticianHeader from '../component/politician/PoliticianHeader';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import {
  ApiNews,
  ApiPaginatedData,
  ApiPoliticianProfile,
  ApiPositions,
  ApiSearchPolitician,
  ApiSpeech,
  IPoliticianContext,
} from '../logic/api';
import SkeletonPoliticianItem from '../component/SkeletonPoliticianItem';
import NewPoliticianProfile from '../component/politician/NewPoliticianProfile';

type PoliticianViewParams = {
  politicianId: number;
};

interface PoliticianViewProps {
  route: RouteProp<{params: PoliticianViewParams}, 'params'>;
}

export const PoliticianContext = createContext<IPoliticianContext | null>(null);

const NewPoliticianView = ({route}: PoliticianViewProps) => {
  const {politicianId} = route.params;
  const Tab = createMaterialTopTabNavigator();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politicianId}?sidejobs_end=15&votes_end=6`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  const {data: speeches} = useQuery<
    ApiPaginatedData<ApiSpeech> | undefined,
    Error
  >(
    `speeches:${politicianId}`,
    () =>
      fetch_api<ApiPaginatedData<ApiSpeech>>(
        `politician/${politicianId}/speeches?page=1`,
      ),
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
    ApiSearchPolitician[] | undefined,
    Error
  >(
    `constituency:${politicianId}`,
    () =>
      fetch_api<ApiSearchPolitician[]>(
        `politician/${politicianId}/constituencies`,
      ),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );

  if (profileLoading || positionLoading || constituencyLoading) {
    return <SkeletonPoliticianItem />;
  }
  if (profileError) {
    return <Text>Error ..</Text>;
  }
  return (
    <PoliticianContext.Provider
      value={{profile, news, speeches, positions, constituency}}>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.cardBackground}
        />
        <BackButton />
        <PoliticianHeader />
        {!(positions?.positions && positions?.positions.length > 0) &&
        !(constituency && constituency.length > 0) ? (
          <NewPoliticianProfile />
        ) : (
          <Tab.Navigator
            screenOptions={() => ({
              sceneContainerStyle: {backgroundColor: Colors.background},
              tabBarActiveTintColor: '#FCFCFC',
              tabBarInactiveTintColor: '#FCFCFC66',
              tabBarIndicatorStyle: {backgroundColor: '#FCFCFC'},
              tabBarLabelStyle: styles.tabBarLabel,
              tabBarStyle: {backgroundColor: Colors.cardBackground},
            })}>
            <Tab.Screen name="Profilseite" component={NewPoliticianProfile} />
            {positions?.positions && positions?.positions.length > 0 && (
              <Tab.Screen name="Positionen" component={PoliticianPositions} />
            )}
            {constituency && constituency.length > 0 && (
              <Tab.Screen name="Wahlkreis" component={PoliticianConstituency} />
            )}
          </Tab.Navigator>
        )}
      </View>
    </PoliticianContext.Provider>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBarLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    textTransform: 'none',
  },
});
export default NewPoliticianView;
