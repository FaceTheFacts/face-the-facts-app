/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Face, RNCamera, TrackedTextFeature} from 'react-native-camera';

const App = () => {
  const [texts, setTexts] = useState<TrackedTextFeature[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);

  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onFacesDetected={response => setFaces(response.faces)}
        onTextRecognized={response => setTexts(response.textBlocks)}>
        {texts.map((text, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: text.bounds.origin.y,
              left: text.bounds.origin.x,
              width: text.bounds.size.width,
              height: text.bounds.size.height,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.line}>{text.value}</Text>
          </View>
        ))}
        {faces.map((face, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: face.bounds.origin.y,
              left: face.bounds.origin.x,
              width: face.bounds.size.width,
              height: face.bounds.size.height,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
            }}>
            <Text style={styles.line}>{face.faceID}</Text>
          </View>
        ))}
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
  line: {
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 15,
    fontSize: 12,
  },
});

export default App;
