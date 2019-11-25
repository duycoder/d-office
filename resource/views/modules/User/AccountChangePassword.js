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
  Container, Content, Form, Item, Input, Label, Toast,
  Header, Right, Body, Left, Button, Title
} from 'native-base';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as util from 'lodash';
//constants
import { EMPTY_STRING, API_URL, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, emptyDataPage } from '../../../common/Utilities'

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';
import GoBackButton from '../../common/GoBackButton';

//fcm
//import FCM, { FCMEvent } from 'react-native-fcm';

//images
const uriBackground = require('../../../assets/images/background.png');
const dojiBigIcon = require('../../../assets/images/doji-big-icon.png');
const showPasswordIcon = require('../../../assets/images/visible-eye.png');
const hidePasswordIcon = require('../../../assets/images/hidden-eye.png');
const userAvatar = require('../../../assets/images/avatar.png');

class AccountChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.userInfo.ID,

      password: EMPTY_STRING,
      TMPpassword: EMPTY_STRING,

      headerComponentsDisplayStatus: 'flex',

      isDisabledLoginButton: true,
      isRememberPassword: false,
      isHidePassword: true,
      passwordIconDisplayStatus: 'none',

      loading: false,
      logoMargin: 40,

      focusId: EMPTY_STRING,
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

  _handleChangePassword = fieldName => text => {
    this.setState({
      [fieldName]: text
    })
  }

  onChangePasswordVisibility() {
    //show and hide password
    this.setState({
      isHidePassword: !this.state.isHidePassword
    });
  }

  async onSaveChange() {
    Keyboard.dismiss();

    this.setState({
      loading: true
    });

    // if (!this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/)) {
    //   this.setState({
    //     loading: false
    //   }, () => {
    //     Toast.show({
    //       text: 'Mật khẩu phải có ít nhất 8 kí tự, 1 kí tự số,\n1 kí tự viết hoa và 1 kí tự đặc biệt',
    //       type: 'danger',
    //       textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
    //       buttonText: "OK",
    //       buttonStyle: { backgroundColor: Colors.WHITE },
    //       buttonTextStyle: { color: Colors.LITE_BLUE },
    //       duration: TOAST_DURATION_TIMEOUT
    //     });
    //   });
    //   return;
    // }
    if (this.state.TMPpassword !== this.state.password) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Mật khẩu xác nhận không khớp',
          type: 'danger',
          textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
          duration: TOAST_DURATION_TIMEOUT
        });
      });
      return;
    }

    const url = `${API_URL}/api/Account/UpdatePersonalInfo`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    });

    const body = JSON.stringify({
      ID: this.state.id,
      MATKHAU: this.state.password
    });

    await asyncDelay();

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

    console.log('something = ', result);
    if (result.Status) {
      Toast.show({
        text: 'Đổi mật khẩu thành công',
        type: 'success',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.GREEN_PANTONE_364C },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => this.signOut()
      })
    }
    else {
      Toast.show({
        text: 'Thất bại',
        type: 'danger',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT
      })
    }
  }

  signOut = async () => {
    //lấy thông tin người dùng từ storage
    const userInfoJSON = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoJSON);

    //vô hiệu hóa token hiện tại của thiết bị với người dùng hiện tại
    const deActiveTokenResult = await fetch(`${API_URL}/api/Account/DeActiveUserToken`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }, body: JSON.stringify({
        userId: userInfo.ID,
        token: userInfo.Token
      })
    }).then(response => response.json())
      .then(responseJson => {
        return responseJson
      });


    //xóa dữ liệu storage of người dùng trên thiết bị
    AsyncStorage.removeItem('userInfo').then(() => {
      this.props.navigation.navigate('LoadingScreen');
    });
  }

  onCheckPassword = () => {
    if (!this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/)) {
      Toast.show({
        text: 'Mật khẩu phải có ít nhất 8 kí tự, 1 kí tự số,\n1 kí tự viết hoa và 1 kí tự đặc biệt',
        type: 'danger',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT
      });
      return;
    }
    Toast.show({
      text: 'Mật khẩu hợp lệ',
      type: 'success',
      textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: Colors.GREEN_PANTONE_364C },
      duration: TOAST_DURATION_TIMEOUT,
    });
  }

  onCheckValidate = () => {
    if (this.state.TMPpassword !== this.state.password) {
      Toast.show({
        text: 'Mật khẩu xác nhận không khớp',
        type: 'danger',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT
      });
      return;
    }
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: Colors.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        password, TMPpassword,
        focusId
      } = this.state,
      nothingChangeStatus = !password && !TMPpassword,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.GRAY },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY };


    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.props.navigation.goBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              ĐỔI MẬT KHẨU
            </Title>
          </Body>
          <Right style={NativeBaseStyle.right}>
          </Right>
        </Header>
        <Container style={{ backgroundColor: Colors.LIGHT_GRAY_PASTEL }}>
          <Content style={[AccountStyle.mainContainer, { paddingHorizontal: 0 }]}>
            <Form style={{ backgroundColor: Colors.WHITE, paddingHorizontal: moderateScale(12, .9) }}>
              <Item stackedLabel style={focusId === 'newPassword' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Điền mật khẩu mới</Label>
                <Input
                  onChangeText={this._handleChangePassword('password')}
                  value={this.state.password}
                  secureTextEntry={this.state.isHidePassword}
                  autoCorrect={false}
                  returnKeyType={'done'}
                  onSubmitEditing={this.onCheckPassword}
                  onFocus={() => this.setState({ focusId: 'newPassword' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
              <Item stackedLabel style={focusId === 'confirmPassword' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Xác nhận mật khẩu</Label>
                <Input
                  onChangeText={this._handleChangePassword('TMPpassword')}
                  value={this.state.TMPpassword}
                  secureTextEntry={this.state.isHidePassword}
                  autoCorrect={false}
                  returnKeyType={'done'}
                  onSubmitEditing={this.onCheckValidate}
                  onFocus={() => this.setState({ focusId: 'confirmPassword' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
            </Form>
            <View style={{ marginHorizontal: 25 }}>
              <TouchableOpacity
                onPress={() => this.onSaveChange()}
                style={[AccountStyle.submitButton, submitableButtonBackground]}
                disabled={nothingChangeStatus}
              >
                <Text style={[AccountStyle.submitButtonText, submitableButtonTextColor]}>LƯU MẬT KHẨU</Text>
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
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

export default connect(mapStatetoProps, mapDispatchToProps)(AccountChangePassword);