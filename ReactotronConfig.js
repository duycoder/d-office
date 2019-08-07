import { NativeModules, Platform } from 'react-native';
import Reactotron from 'reactotron-react-native';
// import {reactotronRedux} from 'reactotron-redux';
let scriptHostname = '192.168.1.96';
if (Platform.OS === "ios") {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}
Reactotron
  .configure({ host: scriptHostname }) // controls connection & communication settings '192.168.1.96'
  .useReactNative() // add all built-in react native plugins
  // .use(reactotronRedux()) // subscription to redux
  .connect() // let's connect!

console.tron = Reactotron