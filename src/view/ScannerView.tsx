import React, {useContext, useEffect, useRef, useState} from 'react';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {StyleSheet, View} from 'react-native';
import {DataContext} from '../logic/model';
import {NavigationContext} from '@react-navigation/native';
import {ErrorIcon, ScanIcon} from '../icons';
import InfoBanner from '../component/InfoBanner';
import {ApiPoliticianHeader} from '../logic/api';
import {fetch_api} from '../logic/fetch';
import {useQuery} from 'react-query';
import ErrorCard from '../component/Error';

const ScannerView = () => {
  // Scanning
  const camera = useRef<RNCamera | null>(null);
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [showPolitician, setShowPolitician] = useState<number | null>(null);

  // State
  const [focussed, setFocussed] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  const dataContext = useContext(DataContext);
  const navigator = useContext<any>(NavigationContext)!;

  const {data: scanData, isError} = useQuery<
    ApiPoliticianHeader[] | undefined,
    Error
  >(
    `scanpolitician:${showPolitician}`,
    () =>
      fetch_api<ApiPoliticianHeader[]>(`image-scanner?id=${showPolitician}`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
      enabled: !!showPolitician,
    },
  );

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
      dataContext.dbManager.pushHistoryItem(scannedPolitician);
    }
  }
  useEffect(() => {
    if (showPolitician && scanData) {
      navigator.push('Politician', {
        politicianId: scanData[0].id,
        politicianName: scanData[0].label,
        party: scanData[0].party,
      });
      setShowPolitician(null);
      setFocussed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPolitician, scanData]);

  if (isError) {
    return <ErrorCard />;
  }
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
