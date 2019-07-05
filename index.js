import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import bgMessaging from './bgMessaging';
import './FontScalingConfig';

// YellowBox.ignoreWarningstry(['Warning: ...']);
console.ignoredYellowBox = ['Remote debugger'];
AppRegistry.registerComponent('EbizOffice', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
