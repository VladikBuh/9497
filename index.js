/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import AppBootstrap from './AppBootstrap';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppBootstrap);
