/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Root } from 'native-base';
import { CommonDrawerNavigator } from './resource/views/common/CommonDrawerNavigator';

//redux
import { Provider } from 'react-redux';
import { globalStore } from './resource/redux/common/GlobalStore'

//network status
import NetworkStatus from './resource/views/common/NetworkStatus';

export default class App extends Component {
  render() {
    return (
      <Provider store={globalStore}>
          <Root>
            <CommonDrawerNavigator />
            <NetworkStatus/>
          </Root>
      </Provider>
    );
  }
}
