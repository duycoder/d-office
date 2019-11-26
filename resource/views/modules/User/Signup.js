/**
 * @description: màn hình đăng ký người dùng
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
import { EMPTY_STRING, API_URL, Colors, TOAST_DURATION_TIMEOUT, PASSWD_VALIDATION, EMAIL_VALIDATION } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, emptyDataPage } from '../../../common/Utilities'

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';
import GoBackButton from '../../common/GoBackButton';
import { accountApi } from '../../../common/Api';

//fcm
//import FCM, { FCMEvent } from 'react-native-fcm';

//images
const uriBackground = require('../../../assets/images/background.png');
const dojiBigIcon = require('../../../assets/images/doji-big-icon.png');
const showPasswordIcon = require('../../../assets/images/visible-eye.png');
const hidePasswordIcon = require('../../../assets/images/hidden-eye.png');

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: EMPTY_STRING,
      fullName: EMPTY_STRING,
      email: EMPTY_STRING,
      password: EMPTY_STRING,

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

  onRememberPassword() {
    this.setState({
      isRememberPassword: !this.state.isRememberPassword
    })
  }

  onChangeFullNameText(fullName) {
    this.setState({
      fullName
    }, () => {
      this.setState({
        isDisabledLoginButton: (fullName.length <= 0 || this.state.password.length <= 0)
      });
    });
  }

  onChangeEmailText(email) {
    this.setState({
      email
    }, () => {
      this.setState({
        isDisabledLoginButton: (email.length <= 0 || this.state.password.length <= 0)
      });
    });
  }

  onChangeUserNameText(userName) {
    this.setState({
      userName
    }, () => {
      this.setState({
        isDisabledLoginButton: (userName.length <= 0 || this.state.password.length <= 0)
      });
    });
  }

  onChangePasswordText(password) {
    if (password.length > 0) {
      this.setState({
        password,
        passwordIconDisplayStatus: 'flex'
      }, () => {
        if (this.state.userName.length > 0) {
          this.setState({
            isDisabledLoginButton: false
          })
        }
      });
    } else {
      this.setState({
        isHidePassword: true,
        password,
        passwordIconDisplayStatus: 'none'
      }, () => {
        this.setState({
          isDisabledLoginButton: true
        })
      })
    }
  }

  onChangePasswordVisibility() {
    //show and hide password
    this.setState({
      isHidePassword: !this.state.isHidePassword
    });
  }

  async onSignup() {
    const {
      fullName, userName, password, email
    } = this.state;

    this.setState({
      loading: true
    });

    if (fullName.length < 0) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Bạn phải nhập họ và tên của mình',
          textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
          duration: TOAST_DURATION_TIMEOUT
        });
      });
      return;
    }

    if (userName.length < 6 || userName.length > 16) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Tên đăng nhập phải có 6 - 16 kí tự',
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

    if (!email.match(EMAIL_VALIDATION)) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Hãy nhập đúng Email',
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

    if (!password.match(PASSWD_VALIDATION)) {
      this.setState({
        loading: false
      }, () => {
        Toast.show({
          text: 'Mật khẩu phải có ít nhất 8 kí tự, 1 kí tự số,\n1 kí tự viết hoa và 1 kí tự đặc biệt',
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

    const result = await accountApi().postSignup({
      EMAIL: email,
      HOTEN: fullName,
      MATKHAU: password,
      TENDANGNHAP: userName
    });

    this.setState({
      loading: false
    });

    if (result.Status) {
      Toast.show({
        text: 'Đăng ký tài khoản thành công',
        type: 'success',
        textStyle: { fontSize: moderateScale(12, 1.5), color: Colors.WHITE },
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.GREEN_PANTONE_364C },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          this.props.navigation.goBack();
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
        duration: TOAST_DURATION_TIMEOUT
      })
    }
  }

  navigateBackToLogin = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { fullName, userName, email, password } = this.state;
    const toggleLoginStyleButton = (userName !== EMPTY_STRING && fullName !== EMPTY_STRING && email !== EMPTY_STRING && password !== EMPTY_STRING) ? { backgroundColor: '#da2032' } : { backgroundColor: 'lightgrey' };
    const toggleLoginStyleText = (userName !== EMPTY_STRING && fullName !== EMPTY_STRING && email !== EMPTY_STRING && password !== EMPTY_STRING) ? { color: 'white' } : { color: 'grey' };
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToLogin()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              ĐĂNG KÝ
            </Title>
          </Body>
          <Right style={NativeBaseStyle.right} />
        </Header>
        <ImageBackground source={uriBackground} style={{ flex: 1 }}>
          <Content>
            <Form>
              {/* <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: verticalScale(this.state.logoMargin) }}>
                <Image source={dojiBigIcon} />
              </View> */}
              <Item stackedLabel>
                <Label>Họ và tên</Label>
                <Input
                  onChangeText={(fullName) => this.onChangeFullNameText(fullName)}
                  value={this.state.fullName}
                  autoCorrect={false}
                />
              </Item>
              <Item stackedLabel>
                <Label>Tên đăng nhập</Label>
                <Input
                  onChangeText={(userName) => this.onChangeUserNameText(userName)}
                  value={this.state.userName}
                  autoCorrect={false}
                />
              </Item>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  onChangeText={(email) => this.onChangeEmailText(email)}
                  value={this.state.email}
                  keyboardType={'email-address'}
                  autoCorrect={false}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Mật khẩu</Label>
                <Input
                  onChangeText={(password) => this.onChangePasswordText(password)}
                  value={this.state.password}
                  secureTextEntry={this.state.isHidePassword}
                  autoCorrect={false}
                />
              </Item>
              <View style={[LoginStyle.formInputs, LoginStyle.formButton]}>
                <TouchableOpacity
                  disabled={this.state.isDisabledLoginButton}
                  onPress={() => this.onSignup()}
                  style={[LoginStyle.formButtonLogin, toggleLoginStyleButton]}
                >
                  <Text style={[LoginStyle.formButtonText, toggleLoginStyleText]}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
              </View>
            </Form>
          </Content>
        </ImageBackground>
        {
          authenticateLoading(this.state.loading)
        }
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => dispatch(userAction.setUserInfo(data))
  }
}

export default connect(null, mapDispatchToProps)(Signup);