import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';
import {Politician, PoliticianNameAnalyzer} from './logic/analyzer';

const App = () => {
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);

  let politician: Politician | null = null;
  if (faces.length === 1) {
    const analyzer = new PoliticianNameAnalyzer();
    politician = analyzer.analyze(texts);
  }

  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onFacesDetected={response => setFaces(response.faces)}
        onTextRecognized={response => setTexts(response.textBlocks)}>
        {politician && (
          <Text
            style={{
              fontSize: 32,
              position: 'absolute',
              top: 200,
              textShadowColor: 'white',
              textShadowRadius: 15,
            }}>
            {politician.id}
          </Text>
        )}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default App;
