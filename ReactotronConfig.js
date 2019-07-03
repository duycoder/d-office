import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';
// import {reactotronRedux} from 'reactotron-redux';
let scriptHostname;
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}
Reactotron
  .configure({ host: '192.168.1.96' }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  // .use(reactotronRedux()) // subscription to redux
  .connect() // let's connect!

console.tron = Reactotron