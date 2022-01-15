import React, {useContext, useRef} from 'react';
import {SafeAreaView, Share, ShareContent, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import WebView from 'react-native-webview';
import {NavigationContext, Route} from '@react-navigation/native';
import {WebViewSource} from 'react-native-webview/lib/WebViewTypes';
import Icon from '../component/Icon';
import {ArrowBackIos, ShareIcon} from '../icons';

export interface EmbeddedViewProps {
  route: Route<'embedded', {source: WebViewSource; shareContent: ShareContent}>;
}

// language=HTML
const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
    window.addEventListener('message', ev => {
      const data = JSON.parse(ev.data);

      const output = document.createElement('pre');
      output.innerText = ev.data;
      document.body.appendChild(output);
    });

    function send() {
      window.ReactNativeWebView.postMessage({message: 'Hello World!'});
    }
    </script>
    <button onclick="send()">Send event</button>
  </body>
</html>
`;

const EmbeddedView = ({route}: EmbeddedViewProps) => {
  const navigator = useContext(NavigationContext)!;
  const webView = useRef<WebView | null>(null);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigator.goBack()}>
            <Icon style={styles.backButtonIcon} icon={ArrowBackIos} />
            <Text style={styles.backButtonLabel}>zurück</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Share.share(route.params.shareContent)}>
            <Icon style={styles.shareButton} icon={ShareIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/*<WebView ref={webView} source={route.params.source} />*/}
      <WebView
        ref={webView}
        source={{html}}
        onLoad={() =>
          webView.current!.postMessage(
            JSON.stringify(
              {
                message: 'Hello',
                key: 'World',
              },
              null,
              4,
            ),
          )
        }
        onMessage={event => {
          console.log('received message', JSON.stringify(event.nativeEvent.data));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  header: {
    height: 70,
    backgroundColor: Colors.cardBackground,
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    width: 18,
    height: 18,
    color: Colors.foreground,
  },
  backButtonLabel: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: Colors.foreground,
    marginLeft: 5,
  },
  shareButton: {
    width: 18,
    height: 18,
    color: Colors.foreground,
  },
});

export default EmbeddedView;
