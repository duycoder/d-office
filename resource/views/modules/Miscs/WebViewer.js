import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Container, Header, Left, Body, Title, Right } from 'native-base';
import { GoBackButton } from '../../common';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

class WebViewer extends Component {
  constructor(props) {
    super(props);
    const DEFAULT_URL = "http://vanban.vnio.vn/LICHCONGTAC_LANHDAOArea/LICHCONGTAC_LANHDAO/Index/";

    this.state = {
      url: props.extendsNavParams.webviewUrl || DEFAULT_URL,
      title: props.extendsNavParams.screenTitle || props.userInfo.Fullname || "Người dùng",
      // deviceToken: props.userInfo.DeviceToken || EMPTY_STRING,
      userId: props.userInfo.ID || 0,
    }
  }

  onNavigationStateChange = navState => {
    if (navState.url.indexOf('https://www.google.com') === 0) {
      const regex = /#access_token=(.+)/;
      // console.log(accessToken);
    }
  };

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const {
      url, title, userId
    } = this.state;
    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
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
            uri: url + userId,
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