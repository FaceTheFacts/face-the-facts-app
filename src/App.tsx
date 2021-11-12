import React, {useEffect, useState} from 'react';
import {Host} from 'react-native-portalize';
import {DataContext, FaceTheFactsData} from './logic/model';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainView from './view/MainView';
import HomeView from './view/HomeView';
import EmbeddedView from './view/EmbeddedView';
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
import {useQueryClient, QueryClient, QueryClientProvider} from 'react-query';

const Stack = createStackNavigator();

const App = () => {
  const [data, setData] = useState<FaceTheFactsData | null>(null);
  const [missingData, setMissingData] = useState(false);
  // Create a QueryClient
  const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={data}>
        <StatusBar barStyle="light-content" />
        <Host>
          <View style={styles.container}>
            <NavigationContainer>
              <Stack.Navigator headerMode="none">
                <Stack.Screen name="main" component={MainView} />
                <Stack.Screen name="home" component={HomeView} />
                <Stack.Screen name="embedded" component={EmbeddedView} />
                <Stack.Screen
                  name="PoliticianScreen"
                  component={PoliticianView}
                />
                <Stack.Screen name="PollsScreen" component={PollsView} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </Host>
      </DataContext.Provider>
    </QueryClientProvider>
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
