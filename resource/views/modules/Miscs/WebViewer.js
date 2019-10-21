import React, { Component } from 'react';
import {

} from 'react-native';

import { connect } from 'react-redux';

import { WebView } from 'react-native-webview';
import * as navAction from '../../../redux/modules/Nav/Action';
import { EMPTY_STRING, Colors } from '../../../common/SystemConstant';
import { Container, Header, Left, Body, Title, Right } from 'native-base';
import GoBackButton from '../../common/GoBackButton';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

const DEFAULT_URL = "http://vanban.vnio.vn/LICHCONGTAC_LANHDAOArea/LICHCONGTAC_LANHDAO/Index/";

class WebViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.extendsNavParams.webviewUrl || DEFAULT_URL,
      title: props.userInfo.Fullname || "Người dùng",
      deviceToken: props.userInfo.DeviceToken || EMPTY_STRING
    }
  }

  onNavigationStateChange = navState => {
    if (navState.url.indexOf('https://www.google.com') === 0) {
      const regex = /#access_token=(.+)/;
      let accessToken = navState.url.match(regex)[1];
      // console.log(accessToken);
    }
  };

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const {
      url, title, deviceToken
    } = this.state;
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle} >
              {title.toUpperCase()}
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>
        <WebView
          source={{
            uri: url + deviceToken,
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState
          scalesPageToFit
          javaScriptEnabled
          style={{ flex: 1 }}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    extendsNavParams: state.navState.extendsNavParams,
    userInfo: state.userState.userInfo,
  }
}

export default connect(mapStateToProps, null)(WebViewer);