import React, {useContext, useEffect, useRef, useState} from 'react';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataContext} from '../logic/model';
import {Colors} from '../theme';
import PoliticianRow from '../component/PoliticianRow';
import {NavigationContext} from '@react-navigation/native';
import Icon from '../component/Icon';
import {
  ArrowBackIos,
  ClearIcon,
  ErrorIcon,
  ScanIcon,
  SearchIcon,
} from '../icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import InfoBanner from '../component/InfoBanner';
import {Politician} from '../logic/data';

const ScannerView = () => {
  // Scanning
  const camera = useRef<RNCamera | null>(null);
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [showPolitician, setShowPolitician] = useState<Politician | null>(null);

  // State
  const [searching, setSearching] = useState(false);
  const [focussed, setFocussed] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  // Search
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<TextInput>(null);
  const searchOverlayOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (searching) {
      Animated.spring(searchOverlayOpacity, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(searchOverlayOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching]);

  function startSearching(): void {
    setSearching(true);
    setTexts([]);
    setFaces([]);
  }

  function stopSearching(): void {
    setSearching(false);
    setSearchInput('');
    inputRef.current?.blur();
  }

  useEffect(() => {
    if (!searching) {
      return;
    }

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      stopSearching();
      return true;
    });
    return () => handler.remove();
  }, [searching]);

  const data = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;
  const insets = useSafeAreaInsets();

  useEffect(
    () => navigator.addListener('focus', () => setFocussed(true)),
    [navigator],
  );
  useEffect(
    () =>
      navigator.addListener('blur', () => {
        setFocussed(false);
        setTexts([]);
        setFaces([]);
      }),
    [navigator],
  );

  if (!searching && !showPolitician && focussed && faces.length) {
    const scannedPolitician = data.scanPolitician(texts);
    if (scannedPolitician) {
      setShowPolitician(scannedPolitician);
      setFocussed(false);
      setTexts([]);
      setFaces([]);
      data.historyManager.pushItem(scannedPolitician.id);
    }
  }

  const [searchResult, setSearchResult] = useState<Politician[]>([]);
  const searchInProgress = useRef({count: 0, id: 0}).current;

  useEffect(() => {
    if (searching && searchInput) {
      searchInProgress.count++;
      const id = ++searchInProgress.id;
      setSearchResult([...searchResult]);
      data.search(searchInput).then(result => {
        searchInProgress.count--;
        if (searchInProgress.id !== id) {
          return;
        }
        setSearchResult(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, searchInput, data, searchInProgress]);

  useEffect(() => {
    if (showPolitician) {
      navigator.push('PoliticianScreen', {politician: showPolitician});
      setShowPolitician(null);
      setFocussed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPolitician]);

  return (
    <View style={styles.container}>
      {focussed && (
        <RNCamera
          ref={camera}
          style={styles.preview}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onFacesDetected={
            searching || showPolitician
              ? undefined
              : response => setFaces(response.faces)
          }
          onTextRecognized={
            searching || showPolitician
              ? undefined
              : response => setTexts(response.textBlocks)
          }
          notAuthorizedView={
            <InfoBanner
              style={styles.infoBanner}
              icon={ErrorIcon}
              title="Kein Kamerazugriff"
              subtitle='Gehe zu "Einstellungen" > "FaceTheFacts" > "Kamera" und aktiviere sie, um Plakate scannen zu können.'
            />
          }
          onStatusChange={event =>
            setCameraReady(event.cameraStatus === 'READY')
          }
        />
      )}
      <Animated.View
        style={StyleSheet.flatten([
          styles.searchOverlay,
          {
            opacity: searchOverlayOpacity,
          },
        ])}
      />
      <SafeAreaView style={StyleSheet.absoluteFillObject}>
        <KeyboardAvoidingView
          style={styles.searchWrapper}
          behavior="height"
          keyboardVerticalOffset={insets.top}>
          <View
            style={StyleSheet.flatten([
              styles.searchBarContainer,
              insets.top <= 20 && {marginTop: 16},
            ])}>
            {searching ? (
              <TouchableOpacity
                style={styles.searchBarButton}
                onPress={stopSearching}>
                <Icon style={styles.searchBarIcon} icon={ArrowBackIos} />
              </TouchableOpacity>
            ) : (
              <Icon style={styles.searchBarIcon} icon={SearchIcon} />
            )}
            <TextInput
              ref={inputRef}
              style={styles.searchBarInput}
              placeholder="Wohnort, PLZ oder Name"
              placeholderTextColor={Colors.placeholderColor}
              onFocus={startSearching}
              onBlur={() => setSearching(searchInput !== '')}
              value={searchInput}
              onChangeText={setSearchInput}
              autoCompleteType="off"
              dataDetectorTypes="none"
              textContentType="none"
              spellCheck={false}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
              keyboardAppearance="dark"
            />
            {!!searchInProgress.count && (
              <ActivityIndicator style={styles.searchBarLoadingIndicator} />
            )}
            {!!searchInput && (
              <TouchableOpacity
                style={styles.searchBarButton}
                onPress={() => {
                  setSearchInput('');
                  inputRef.current!.focus();
                }}>
                <Icon style={styles.searchBarClearButton} icon={ClearIcon} />
              </TouchableOpacity>
            )}
          </View>
          {searching && !!searchResult.length && (
            <ScrollView
              style={styles.searchResultContainer}
              keyboardDismissMode="interactive">
              {searchResult.map(politician => (
                <PoliticianRow
                  key={politician.id}
                  style={styles.searchItem}
                  politician={politician}
                />
              ))}
            </ScrollView>
          )}
          {searching &&
            !searchResult.length &&
            !!searchInput &&
            !searchInProgress.count && (
              <Text style={styles.searchNoResult}>
                Es wurden keine Politiker:innen gefunden.
              </Text>
            )}
        </KeyboardAvoidingView>
      </SafeAreaView>
      {cameraReady && !searching && (
        <InfoBanner
          style={styles.infoBanner}
          icon={ScanIcon}
          title="Nach Plakaten suchen"
          subtitle="Achte darauf, dass der Name des:der Kandidat:in gut lesbar ist."
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    maxHeight: '100%',
  },
  searchBarContainer: {
    borderRadius: 8,
    backgroundColor: Colors.foreground,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  searchBarButton: {
    padding: 16,
    margin: -16,
  },
  searchBarIcon: {
    width: 24,
    height: 24,
    marginLeft: 16,
    color: Colors.background,
  },
  searchBarInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 17,
    padding: 16,
    color: Colors.background,
  },
  searchBarLoadingIndicator: {
    marginRight: 8,
  },
  searchBarClearButton: {
    width: 24,
    height: 24,
    marginRight: 16,
    color: Colors.background,
  },
  searchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  searchResultContainer: {
    height: '100%',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchNoResult: {
    fontFamily: 'Inter',
    fontSize: 17,
    marginHorizontal: 16,
    marginTop: 8,
    color: Colors.foreground,
  },
  searchItem: {
    marginBottom: 12,
    borderColor: 'rgba(248, 248, 248, 0.22)',
    borderWidth: 1,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  infoBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ScannerView;
