/**
 * @description: màn hình truy vấn thông tin người dùng
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react'
import {
  View, Text,
  Keyboard, Image, ImageBackground,
  TouchableOpacity
} from 'react-native'

//lib
import {
  Container, Content, Form, Item, Input, Label, Toast,
  Header, Right, Body, Left, Button, Title
} from 'native-base';
import { Icon } from 'react-native-elements';
import * as util from 'lodash';
import DatePicker from 'react-native-datepicker';
//constants
import { EMPTY_STRING, API_URL, Colors } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { scale, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, convertDateToString } from '../../../common/Utilities'

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//fcm
//import FCM, { FCMEvent } from 'react-native-fcm';

//images
const uriBackground = require('../../../assets/images/background.png');
const dojiBigIcon = require('../../../assets/images/doji-big-icon.png');
const showPasswordIcon = require('../../../assets/images/visible-eye.png');
const hidePasswordIcon = require('../../../assets/images/hidden-eye.png');
const userAvatar = require('../../../assets/images/avatar.png');

class AccountEditor extends Component {
  constructor(props) {
    super(props);

    const { fullName, dateOfBirth, mobilePhone, address, email } = props.extendsNavParams;

    this.state = {
      id: props.userInfo.ID,

      // state hiện tại
      fullName: fullName,
      dateOfBirth: dateOfBirth || new Date(),
      mobilePhone: mobilePhone,
      address: address,
      email: email,
      // state cũ
      TMPfullName: fullName,
      TMPdateOfBirth: dateOfBirth || new Date(),
      TMPmobilePhone: mobilePhone,
      TMPaddress: address,
      TMPemail: email,

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
    this.props.navigation.goBack();
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
    if (this.state.email === EMPTY_STRING) {
      this.setState({
        email: this.state.TMPemail
      });
    }

    if (this.state.mobilePhone != EMPTY_STRING && !this.state.mobilePhone.match(/^\d{8,13}$/)) {
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

    if (this.state.email != EMPTY_STRING && !this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Hãy nhập đúng email',
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

    // let DateFormat = this.state.dateOfBirth.split('/');
    // let ConvertDateFormat = DateFormat[1] + '/' + DateFormat[0] + '/' + DateFormat[2];

    const body = JSON.stringify({
      ID: this.state.id,
      HOTEN: this.state.fullName,
      NGAYSINH: new Date(this.state.dateOfBirth.replace(/\//g, "-")),
      DIENTHOAI: this.state.mobilePhone,
      DIACHI: this.state.address,
      EMAIL: this.state.email
    });

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
        return responseJson;
      });
    if (result.Status) {
      this.props.updateExtendsNavParams({ check: true });
      Toast.show({
        text: 'Đã lưu thông tin tài khoản!',
        type: 'success',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.GREEN_PANTONE_364C },
        duration: 3000,
        onClose: () => {
          this.navigateBackToAccountInfo()
        }
      });
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
      });
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
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('email')}
                  placeholder={this.state.email}
                  keyboardType="email-address"
                />
              </Item>
              <Item stackedLabel style={{ height: verticalScale(100) }}>
                <Label>Ngày sinh</Label>
                <DatePicker
                  style={{ width: scale(300), alignSelf: 'center', marginVertical: 30 }}
                  date={(this.state.dateOfBirth)}
                  mode='date'
                  placeholder='Chọn ngày sinh'
                  format='YYYY/MM/DD'
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
                  keyboardType="phone-pad"
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
    userInfo: state.userState.userInfo,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => dispatch(userAction.setUserInfo(data)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(AccountEditor);