/**
 * @description: màn hình truy vấn thông tin người dùng
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react'
import {
  AsyncStorage, View, ScrollView, Text, TextInput,
  Keyboard, Animated, Image, ImageBackground,
  TouchableOpacity
} from 'react-native'

//lib
import {
  Container, Content, CheckBox, Form, Item, Input, Label, Toast,
  Header, Right, Body, Left, Button, Title
} from 'native-base';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as util from 'lodash';
//constants
import { EMPTY_STRING, API_URL, Colors, EMTPY_DATA_MESSAGE } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, emptyDataPage, convertDateTimeToString, convertDateToString, appGetDataAndNavigate } from '../../../common/Utilities'

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';

//fcm
import FCM, { FCMEvent } from 'react-native-fcm';

//images
const uriBackground = require('../../../assets/images/background.png');
const dojiBigIcon = require('../../../assets/images/doji-big-icon.png');
const showPasswordIcon = require('../../../assets/images/visible-eye.png');
const hidePasswordIcon = require('../../../assets/images/hidden-eye.png');
const userAvatar = require('../../../assets/images/avatar.png');

class AccountInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.userInfo.ID,

      userName: EMPTY_STRING,
      fullName: EMPTY_STRING,
      email: EMPTY_STRING,
      dateOfBirth: EMPTY_STRING,
      mobilePhone: EMPTY_STRING,
      address: EMPTY_STRING,

      headerComponentsDisplayStatus: 'flex',

      isDisabledLoginButton: true,
      isRememberPassword: false,
      isHidePassword: true,
      passwordIconDisplayStatus: 'none',

      loading: false,
      logoMargin: 40,
    }
  }

  navigateBackToLogin = () => {
    this.props.navigation.navigate('VanBanDenIsNotProcessScreen');
  }

  navigateToEditAccount = () => {
    this.props.navigation.navigate('AccountEditorScreen', {
      fullName: this.state.fullName,
      dateOfBirth: this.state.dateOfBirth,
      mobilePhone: this.state.mobilePhone,
      address: this.state.address,
    });
  }

  componentWillMount = async () => {
    const url = `${API_URL}/api/account/GetUserInfo/${this.state.id}`;
    let result = await fetch(url)
      .then(response => response.json())
      .then(responseJson => responseJson);

    console.log('Result sau khi mount = ', result);
    this.setState({
      userName: result.TENDANGNHAP,
      fullName: result.HOTEN,
      email: result.EMAIL,
      dateOfBirth: convertDateToString(result.NGAYSINH),
      mobilePhone: result.DIENTHOAI,
      address: result.DIACHI
    });
  }

  render() {
    const { fullName, email, dateOfBirth, mobilePhone, address } = this.state;

    const fullNameText = (fullName === EMPTY_STRING) ? '(Không có)' : fullName;
    const emailText = (email === EMPTY_STRING) ? '(Không có)' : email;
    const dateOfBirthText = (dateOfBirth === EMPTY_STRING) ? '(Không có)' : dateOfBirth;
    const mobilePhoneText = (mobilePhone === EMPTY_STRING) ? '(Không có)' : mobilePhone;
    const addressText = (address === EMPTY_STRING) ? '(Không có)' : address;

    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={this.navigateBackToLogin}>
              <Icon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TÀI KHOẢN
            </Title>
          </Body>
          <Right style={NativeBaseStyle.right}>
            {/* <Button transparent onPress={() => this.navigateToEditAccount()}>
              <Icon name='ios-save' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button> */}
          </Right>
        </Header>
        <ImageBackground style={{ flex: 1 }}>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Tên đăng nhập</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK }}>
                  {this.state.userName}
                </Label>
              </Item>
              <Item stackedLabel>
                <Label>Họ và tên</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK }}>
                  {fullNameText}
                </Label>
              </Item>
              <Item stackedLabel>
                <Label>Email</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK }}>
                  {emailText}
                </Label>
              </Item>
              <Item stackedLabel>
                <Label>Ngày sinh</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK }}>
                  {dateOfBirthText}
                </Label>
              </Item>
              <Item stackedLabel>
                <Label>Điện thoại</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK }}>
                  {mobilePhoneText}
                </Label>
              </Item>
              <Item stackedLabel style={{ height: 'auto' }}>
                <Label>Địa chỉ</Label>
                <Label style={{ fontSize: moderateScale(16, 1.3), color: Colors.BLACK, marginBottom: verticalScale(15) }}>
                  {addressText}
                </Label>
              </Item>
            </Form>
            <TouchableOpacity
              onPress={() => this.navigateToEditAccount()}
              style={[LoginStyle.formButtonLogin, { backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20), borderRadius: 0 }]}
            >
              <Text style={[LoginStyle.formButtonText, { color: Colors.WHITE }]}>SỬA THÔNG TIN</Text>
            </TouchableOpacity>
          </Content>
        </ImageBackground>
        {
          authenticateLoading(this.state.loading)
        }
      </Container>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => dispatch(userAction.setUserInfo(data))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(AccountInfo);