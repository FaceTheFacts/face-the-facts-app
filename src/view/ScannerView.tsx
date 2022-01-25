import React, {useContext, useEffect, useRef, useState} from 'react';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {StyleSheet, View} from 'react-native';
import {DataContext} from '../logic/model';
import {Colors} from '../theme';
import {NavigationContext} from '@react-navigation/native';
import {ErrorIcon, ScanIcon} from '../icons';
import InfoBanner from '../component/InfoBanner';
import {Politician} from '../logic/data';

const ScannerView = () => {
  // Scanning
  const camera = useRef<RNCamera | null>(null);
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [showPolitician, setShowPolitician] = useState<Politician | null>(null);

  // State
  const [focussed, setFocussed] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  const dataContext = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;

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

  if (!showPolitician && focussed && faces.length) {
    const scannedPolitician = dataContext.scanPolitician(texts);
    if (scannedPolitician) {
      setShowPolitician(scannedPolitician);
      setFocussed(false);
      setTexts([]);
      setFaces([]);
      dataContext.dbManager.pushHistoryItem(scannedPolitician.id);
    }
  }

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
            showPolitician ? undefined : response => setFaces(response.faces)
          }
          onTextRecognized={
            showPolitician
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
      {cameraReady && (
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
