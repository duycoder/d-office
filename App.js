/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Root } from 'native-base';
import { CommonDrawerNavigator } from './resource/views/common/CommonDrawerNavigator';
import { COMMON_COLOR } from './resource/common/SystemConstant';
import { StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';

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
        <SafeAreaView style={{ flex: 1, backgroundColor: COMMON_COLOR.DANK_BLUE, padding: 0 }} forceInset={{ bottom: 'never', top: 'never' }}>
          <StyleProvider style={getTheme()}>
            <Root>
              <CommonDrawerNavigator />
              <NetworkStatus />
            </Root>
          </StyleProvider>
        </SafeAreaView>
      </Provider>
    );
  }
}
