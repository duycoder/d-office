import 'react-native-gesture-handler';
import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import bgMessaging from './bgMessaging';

// YellowBox.ignoreWarnings(['Warning: ...']);
console.ignoredYellowBox = ['Remote debugger'];
AppRegistry.registerComponent('EbizOffice', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
