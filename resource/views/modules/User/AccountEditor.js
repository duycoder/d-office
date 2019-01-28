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
import DatePicker from 'react-native-datepicker';
//constants
import { EMPTY_STRING, API_URL, Colors } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { scale, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, emptyDataPage } from '../../../common/Utilities'

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

class AccountEditor extends Component {
  constructor(props) {
    super(props);

    const { fullName, dateOfBirth, mobilePhone, address } = props.navigation.state.params;

    this.state = {
      id: props.userInfo.ID,

      // state hiện tại
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      mobilePhone: mobilePhone,
      address: address,
      // state cũ
      TMPfullName: fullName,
      TMPdateOfBirth: dateOfBirth,
      TMPmobilePhone: mobilePhone,
      TMPaddress: address,

      headerComponentsDisplayStatus: 'flex',

      isDisabledLoginButton: true,
      isRememberPassword: false,
      isHidePassword: true,
      passwordIconDisplayStatus: 'none',

      loading: false,
      logoMargin: 40,
    }

    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow() {
    this.setState({
      logoMargin: 20,
    })
  }

  _keyboardDidHide() {
    this.setState({
      logoMargin: 40,
    })
  }

  _handleFieldNameChange = fieldName => text => {
    this.setState({
      [fieldName]: text
    });
  }

  navigateBackToAccountInfo = () => {
    this.props.navigation.navigate('AccountInfoScreen');
  }

  async onSaveAccountInfo() {

    this.setState({
      loading: true
    });
    if (this.state.fullName === EMPTY_STRING) {
      this.setState({
        fullName: this.state.TMPfullName
      });
    }
    if (this.state.dateOfBirth === EMPTY_STRING) {
      this.setState({
        dateOfBirth: this.state.TMPdateOfBirth
      });
    }
    if (this.state.mobilePhone === EMPTY_STRING) {
      this.setState({
        mobilePhone: this.state.TMPmobilePhone
      });
    }
    if (this.state.address === EMPTY_STRING) {
      this.setState({
        address: this.state.TMPaddress
      });
    }

    if (!this.state.mobilePhone.match(/^\d{8,13}$/)) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Hãy nhập đúng số điện thoại',
          type: 'danger',
          textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
          duration: 3000
        });
      });
      return;
    }

    const url = `${API_URL}/api/Account/UpdatePersonalInfo`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    });

    let DateFormat = this.state.dateOfBirth.split('/');
    let ConvertDateFormat = DateFormat[1] + '/' + DateFormat[0] + '/' + DateFormat[2];

    const body = JSON.stringify({
      ID: this.state.id,
      HOTEN: this.state.fullName,
      NGAYSINH: new Date(ConvertDateFormat),
      DIENTHOAI: this.state.mobilePhone,
      DIACHI: this.state.address
    });

    console.log(new Date(this.state.dateOfBirth));

    await asyncDelay(2000);

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          loading: false
        });
        console.log(responseJson);
        return responseJson;
      });
    if (result.Status) {
      Toast.show({
        text: 'Đã lưu thông tin tài khoản!',
        type: 'success',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.GREEN_PANTONE_364C },
        duration: 3000,
        onClose: () => {
          this.props.navigation.navigate('AccountInfoScreen');
        }
      })
    }
    else {
      Toast.show({
        text: result.Message,
        type: 'danger',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: 3000
      })
    }
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={() => this.navigateBackToAccountInfo()}>
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
                <Label>Họ và tên</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('fullName')}
                  placeholder={this.state.fullName}
                  autoCorrect={false}
                />
              </Item>
              <Item stackedLabel style={{ height: verticalScale(100) }}>
                <Label>Ngày sinh</Label>
                <DatePicker
                  style={{ width: scale(300), alignSelf: 'center', marginVertical: 30 }}
                  date={this.state.dateOfBirth}
                  mode='date'
                  placeholder='Chọn ngày sinh'
                  format='DD/MM/YYYY'
                  minDate={'01/01/1900'}
                  maxDate={new Date()}
                  confirmBtnText='XÁC NHẬN'
                  cancelBtnText='HUỶ'
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: scale(36),
                    }
                  }}
                  onDateChange={this._handleFieldNameChange('dateOfBirth')}
                />
              </Item>
              <Item stackedLabel>
                <Label>Điện thoại</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('mobilePhone')}
                  placeholder={this.state.mobilePhone}
                  autoCorrect={false}
                />
              </Item>
              <Item stackedLabel>
                <Label>Địa chỉ</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('address')}
                  placeholder={this.state.address}
                  autoCorrect={false}
                />
              </Item>
            </Form>
            <TouchableOpacity
              onPress={() => this.onSaveAccountInfo()}
              style={[LoginStyle.formButtonLogin, { backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20), borderRadius: 0 }]}
            >
              <Text style={[LoginStyle.formButtonText, { color: Colors.WHITE }]}>LƯU THÔNG TIN</Text>
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

export default connect(mapStatetoProps, mapDispatchToProps)(AccountEditor);