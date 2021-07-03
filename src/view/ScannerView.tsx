import React, {useContext, useEffect, useRef, useState} from 'react';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {
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
import {SFSymbol} from 'react-native-sfsymbols';
import {Colors} from '../theme';
import PoliticianRow from '../component/PoliticianRow';
import {NavigationContext} from '@react-navigation/native';
import {showPolitician} from '../logic/navigation';

const ScannerView = () => {
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [focussed, setFocussed] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const data = useContext(DataContext);
  const navigator = useContext(NavigationContext)!;

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.searchBarContainer}>
          <SFSymbol
            style={styles.searchBarIcon}
            name="magnifyingglass"
            size={18}
            color={Colors.background}
          />
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
          />
          {!!searchInput && (
            <TouchableOpacity
              onPress={() => {
                setSearchInput('');
                inputRef.current!.focus();
              }}>
              <SFSymbol
                style={styles.searchBarClearButton}
                name="xmark.circle"
                size={18}
                color={Colors.background}
              />
            </TouchableOpacity>
          )}
        </View>
        {searching && !!searchInput && (
          <ScrollView>
            {data.search(searchInput).map(politician => (
              <PoliticianRow
                key={politician.id}
                style={styles.searchItem}
                politician={politician}
              />
            ))}
          </ScrollView>
        )}
        {!searching && focussed && (
          <View style={styles.previewWrapper}>
            <RNCamera
              captureAudio={false}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              onFacesDetected={response => setFaces(response.faces)}
              onTextRecognized={response => setTexts(response.textBlocks)}
            />
          </View>
        )}
        {!searching && (
          <Text style={styles.infoText}>
            Kamera auf Gesicht und Namen richten
          </Text>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchBarContainer: {
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.foreground,
    flexDirection: 'row',
  },
  searchBarIcon: {
    width: 18,
    height: 18,
    marginRight: 16,
  },
  searchBarInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 17,
  },
  searchBarClearButton: {
    width: 18,
    height: 18,
  },
  searchItem: {
    marginBottom: 8,
  },
  previewWrapper: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ScannerView;
