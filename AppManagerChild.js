import React, { useRef, useState, useEffect } from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import Clipboard from '@react-native-clipboard/clipboard';

const CRYPTO_SCHEMES = [
  'bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'bitcoincash',
  'tether', 'bch', 'dash', 'ripple', 'monero', 'zcash', 'stellar', 'usdcoin',
];

const INJECTED_JS = `
  (function() {
    var s = ${JSON.stringify(CRYPTO_SCHEMES)};
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el.tagName !== 'A') el = el.parentElement;
      if (!el || !el.href) return;
      var scheme = el.href.split(':')[0].toLowerCase();
      if (s.indexOf(scheme) !== -1) {
        e.preventDefault();
        e.stopPropagation();
        var addr = el.href.split(':').slice(1).join(':').split('?')[0] || '';
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'crypto', address: addr, url: el.href }));
      }
    }, true);
    document.addEventListener('submit', function(e) {
      if (e.target && e.target.target === '_blank') {
        e.target.target = '_self';
      }
    }, true);
  })();
  true;
`;

export default function AppManagerChild({ navigation, route }) {
  const url = route.params.data;
  const userAgent = route.params.userAgent;
  const webViewRef = useRef(null);
  const [isTwoClick, setTwoClick] = useState(false);

  const isWebUrl = /^https?:\/\//i.test(url || '');

  useEffect(() => {
    if (!url) return;

    if (!isWebUrl) {
      Linking.openURL(url).catch(() => {});
      navigation.goBack();
    }
  }, [url]);

  const handleBackPress = () => {
    if (isTwoClick) {
      navigation.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current?.goBack();
    setTimeout(() => setTwoClick(false), 1000);
  };

  const handleShouldStartLoad = event => {
    const scheme = (event.url.split(':')[0] || '').toLowerCase();

    if (event.navigationType === 'formSubmitted' || event.navigationType === 'formResubmitted') {
      return true;
    }

    if (
      event.url.includes('wa.me/') ||
      event.url.includes('api.whatsapp.com/') ||
      event.url.includes('whatsapp.com/')
    ) {
      let waUrl = event.url;
      const match = event.url.match(/wa\.me\/(\d+)/);
      if (match) waUrl = `whatsapp://send?phone=${match[1]}`;
      Linking.openURL(waUrl).catch(() => Linking.openURL(event.url));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(scheme) && !internalSchemes.includes(scheme)) {
      Linking.openURL(event.url).catch(() => {});
      return false;
    }

    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        {isWebUrl && (
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            userAgent={userAgent}
            style={{ flex: 1 }}
            originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            injectedJavaScript={INJECTED_JS}
            onMessage={e => {
              try {
                const msg = JSON.parse(e.nativeEvent.data);
                if (msg.type === 'crypto' && msg.address && Clipboard?.setString) {
                  Clipboard.setString(msg.address);
                  if (msg.url) Linking.openURL(msg.url).catch(() => {});
                }
              } catch {}
            }}
            textZoom={100}
            allowsBackForwardNavigationGestures
            domStorageEnabled
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically
            showsVerticalScrollIndicator={false}
            onError={({ nativeEvent }) => {
              if (nativeEvent.code === -1101 || nativeEvent.code === -1002) {
                navigation.goBack();
              }
            }}
          />
        )}
      </SafeAreaView>

      <TouchableOpacity
        style={{ width: 40, height: 40, position: 'absolute', bottom: 8, left: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20 }}
        onPress={handleBackPress}>
        <Text style={{ color: 'white', fontSize: 20, lineHeight: 24 }}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ width: 40, height: 40, position: 'absolute', bottom: 8, right: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20 }}
        onPress={() => webViewRef.current?.reload()}>
        <Text style={{ color: 'white', fontSize: 20, lineHeight: 24 }}>↺</Text>
      </TouchableOpacity>
    </View>
  );
}
