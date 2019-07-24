/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Root } from 'native-base';
import { CommonDrawerNavigator } from './resource/views/common/CommonDrawerNavigator';
import { Colors } from './resource/common/SystemConstant';

//redux
import { Provider } from 'react-redux';
import { globalStore } from './resource/redux/common/GlobalStore'

//network status
import NetworkStatus from './resource/views/common/NetworkStatus';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

export default class App extends Component {
  render() {
    return (
      <Provider store={globalStore}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.DANK_BLUE, }}>
        <StatusBar barStyle={"light-content"} />
        <Root>
            <CommonDrawerNavigator />
            <NetworkStatus />
          </Root>
        </SafeAreaView>
      </Provider>
    );
  }
}
