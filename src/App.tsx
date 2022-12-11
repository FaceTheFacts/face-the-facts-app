import React, {useEffect, useState} from 'react';
import {Host} from 'react-native-portalize';
import {DataContext, FaceTheFactsData} from './logic/model';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainView from './view/MainView';
import PoliticianView from './view/PoliticianView';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SplashScreen from './view/SplashScreen';
import {Colors} from './theme';
import PollsView from './view/PollsView';
import PollDetailsView from './view/PollDetailsView';
import {QueryClient, QueryClientProvider} from 'react-query';
import SpeechesView from './view/SpeechesView';
import NewsView from './view/NewsView';
import DashboardSpeechesView from './view/DashboardSpeechesView';
import {RootStackParamList} from './view/RootStackParams';
import DashboardSidejobsView from './view/DashboardSidejobsView';
import DashboardPollsView from './view/DashboardPollsView';
import PartyDonationView from './view/PartyDonationView';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorView from './view/ErrorView';

const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  const [data, setData] = useState<FaceTheFactsData | null>(null);
  const [missingData, setMissingData] = useState(false);

  useEffect(() => {
    FaceTheFactsData.load(setData, () => setMissingData(true));
  }, []);

  if (!data) {
    if (missingData) {
      return (
        <SafeAreaView style={styles.missingData}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.missingDataTitle}>
            Leider konnte keine Verbindung zum Internet hergestelllt werden.
          </Text>
          <Text style={styles.missingDataSubtitle}>
            Bitte prüfe, ob dein Handy eine Verbindung zum Internet hat.
          </Text>
          <TouchableOpacity
            style={styles.missingDataButton}
            onPress={() => {
              setMissingData(false);
              FaceTheFactsData.load(setData, () => setMissingData(true));
            }}>
            <Text style={styles.missingDataButtonLabel}>Nochmal versuchen</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return (
      <>
        <StatusBar hidden />
        <SplashScreen />
      </>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <QueryClientProvider client={queryClient}>
        <DataContext.Provider value={data}>
          <StatusBar barStyle="light-content" />
          <Host>
            <View style={styles.container}>
              <NavigationContainer theme={DarkTheme}>
                <Stack.Navigator>
                  {/* Main contains Home, Scanner and History */}
                  <Stack.Screen
                    name="Main"
                    component={MainView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Politician"
                    component={PoliticianView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Polls"
                    component={PollsView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="News"
                    component={NewsView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="PartyDonations"
                    component={PartyDonationView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Speeches"
                    component={SpeechesView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="PollDetails"
                    component={PollDetailsView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="DashboardSpeeches"
                    component={DashboardSpeechesView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="DashboardSidejobs"
                    component={DashboardSidejobsView}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="DashboardPolls"
                    component={DashboardPollsView}
                    options={{headerShown: false}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </Host>
        </DataContext.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  missingData: {
    backgroundColor: Colors.background,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missingDataTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground,
    margin: 16,
    textAlign: 'center',
  },
  missingDataSubtitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: Colors.foreground,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  missingDataButton: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
  },
  missingDataButtonLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default App;
