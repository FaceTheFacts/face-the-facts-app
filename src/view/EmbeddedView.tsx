import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SFSymbol} from 'react-native-sfsymbols';
import {Colors} from '../theme';
import WebView from 'react-native-webview';
import {NavigationContext, Route} from '@react-navigation/native';
import {WebViewSource} from 'react-native-webview/lib/WebViewTypes';

export interface EmbeddedViewProps {
  route: Route<'embedded', {source: WebViewSource}>;
}

const EmbeddedView = ({route}: EmbeddedViewProps) => {
  const navigator = useContext(NavigationContext)!;

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigator.goBack()}>
            <SFSymbol
              style={styles.backButtonIcon}
              name="chevron.backward"
              size={18}
              color={Colors.foreground}
            />
            <Text style={styles.backButtonLabel}>zurück</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <SFSymbol
              style={styles.shareButton}
              name="square.and.arrow.up"
              size={18}
              color={Colors.foreground}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <WebView source={route.params.source} />
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
  },
});

export default EmbeddedView;
