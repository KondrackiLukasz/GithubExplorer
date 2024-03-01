/**
 * @format
 */

import {AppRegistry} from 'react-native';
import RepoList from './RepoList';
import {name as appName} from './app.json';
import AppNavigator from './AppNavigator';

AppRegistry.registerComponent(appName, () => AppNavigator);

// AppRegistry.registerComponent(appName, () => App);
