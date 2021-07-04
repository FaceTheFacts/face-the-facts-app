import React, {useContext, useEffect, useRef, useState} from 'react';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataContext, Politician} from '../logic/model';
import {Colors} from '../theme';
import PoliticianRow from '../component/PoliticianRow';
import {NavigationContext} from '@react-navigation/native';
import {showPolitician} from '../logic/navigation';
import Icon from '../component/Icon';
import {ClearIcon, ErrorIcon, ImageSearchIcon, SearchIcon} from '../icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import InfoBanner from '../component/InfoBanner';

const ScannerView = () => {
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [focussed, setFocussed] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const data = useContext(DataContext);
  const navigator = useContext(NavigationContext)!;
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

  if (!searching && focussed && faces.length === 1) {
    const scannedPolitician = data.scanPolitician(texts);
    if (scannedPolitician) {
      showPolitician(navigator, scannedPolitician.id);
    }
  }

  let searchResult: Politician[] = [];
  if (searching && searchInput) {
    searchResult = data.search(searchInput);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      {focussed && (
        <RNCamera
          style={styles.preview}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onFacesDetected={
            searching ? undefined : response => setFaces(response.faces)
          }
          onTextRecognized={
            searching ? undefined : response => setTexts(response.textBlocks)
          }
          notAuthorizedView={
            <InfoBanner
              style={styles.infoBanner}
              icon={ErrorIcon}
              title="Kein Kamerazugriff"
              subtitle='Gehe zu "Einstellungen" > "FaceTheFacts" > "Kamera" und aktiviere sie, um Plakate scannen zu können.'
            />
          }
          onStatusChange={event => setCameraReady(event.cameraStatus === 'READY')}
        />
      )}
      {searching && <View style={styles.searchOverlay} />}
      <SafeAreaView style={StyleSheet.absoluteFillObject}>
        <View
          style={StyleSheet.flatten([
            styles.searchBarContainer,
            insets.top <= 20 && {marginTop: 16},
          ])}>
          <Icon style={styles.searchBarIcon} icon={SearchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchBarInput}
            placeholder="Suchen"
            placeholderTextColor={Colors.placeholderColor}
            onFocus={() => {
              setSearching(true);
              setTexts([]);
              setFaces([]);
            }}
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
          {!!searchInput && (
            <TouchableOpacity
              onPress={() => {
                setSearchInput('');
                inputRef.current!.focus();
              }}>
              <Icon style={styles.searchBarClearButton} icon={ClearIcon} />
            </TouchableOpacity>
          )}
        </View>
        {!!searchResult.length && (
          <ScrollView style={styles.searchResultContainer}>
            {searchResult.map(politician => (
              <PoliticianRow
                key={politician.id}
                style={styles.searchItem}
                politician={politician}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
      {!searching && cameraReady && (
        <InfoBanner
          style={styles.infoBanner}
          icon={ImageSearchIcon}
          title="Nach Plakaten suchen"
          subtitle="Achte darauf, dass der Name der Kandidat:in gut lesbar ist."
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    borderRadius: 8,
    backgroundColor: Colors.foreground,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
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
    opacity: 0.8,
  },
  searchResultContainer: {
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
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
