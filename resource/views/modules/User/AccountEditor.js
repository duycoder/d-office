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
import { EMPTY_STRING, API_URL, Colors, TOAST_DURATION_TIMEOUT, EMAIL_VALIDATION } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { scale, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, convertDateToString, convertStringToDate } from '../../../common/Utilities'

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
import GoBackButton from '../../common/GoBackButton';
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
      fullName: EMPTY_STRING,
      dateOfBirth: EMPTY_STRING,
      mobilePhone: EMPTY_STRING,
      address: EMPTY_STRING,
      email: EMPTY_STRING,
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

    const {
      fullName, email, dateOfBirth, mobilePhone, address,
      TMPfullName, TMPemail, TMPdateOfBirth, TMPmobilePhone, TMPaddress
    } = this.state;
    let savedFullname = fullName || TMPfullName,
      savedEmail = email || TMPemail,
      savedDateOfBirth = dateOfBirth ? convertStringToDate(dateOfBirth) : TMPdateOfBirth,
      savedMobilePhone = mobilePhone || TMPmobilePhone,
      savedAddress = address || TMPaddress;

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
          duration: TOAST_DURATION_TIMEOUT
        });
      });
      return;
    }

    if (this.state.email != EMPTY_STRING && !this.state.email.match(EMAIL_VALIDATION)) {
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

    // let DateFormat = this.state.dateOfBirth.split('/');
    // let ConvertDateFormat = DateFormat[1] + '/' + DateFormat[0] + '/' + DateFormat[2];

    const body = JSON.stringify({
      ID: this.state.id,
      HOTEN: savedFullname,
      NGAYSINH: savedDateOfBirth,
      DIENTHOAI: savedMobilePhone,
      DIACHI: savedAddress,
      EMAIL: savedEmail,
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
        duration: TOAST_DURATION_TIMEOUT,
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
        duration: TOAST_DURATION_TIMEOUT
      });
    }
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: Colors.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        fullName, email, dateOfBirth, mobilePhone, address,
        TMPfullName, TMPemail, TMPdateOfBirth, TMPmobilePhone, TMPaddress,
      } = this.state,
      nothingChangeStatus = !fullName && !email && !dateOfBirth && !mobilePhone && !address,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.GRAY },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY };

    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToAccountInfo()} />
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
        <Container style={{ backgroundColor: Colors.LIGHT_GRAY_PASTEL }}>
          <Content style={[AccountStyle.mainContainer, { paddingHorizontal: 0 }]}>
            <Form style={{ backgroundColor: Colors.WHITE, paddingHorizontal: moderateScale(12, .9) }}>
              <Item stackedLabel style={this.state.focusId === 'fullName' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Tên đầy đủ</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('fullName')}
                  placeholder={TMPfullName}
                  autoCorrect={false}
                  onFocus={() => this.setState({ focusId: 'fullName' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
              <Item stackedLabel style={this.state.focusId === 'email' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Email</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('email')}
                  placeholder={TMPemail}
                  keyboardType="email-address"
                  onFocus={() => this.setState({ focusId: 'email' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
              <Item stackedLabel style={[{ alignItems: 'flex-start' }, this.state.focusId === 'dateOfBirth' ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
                <Label style={AccountStyle.labelTitle}>Ngày sinh</Label>
                <DatePicker
                  // style={{ width: scale(300), alignSelf: 'center', marginVertical: 30 }}
                  style={{ width: '100%' }}
                  date={(dateOfBirth ? dateOfBirth : convertDateToString(TMPdateOfBirth))}
                  mode='date'
                  placeholder={TMPdateOfBirth ? convertDateToString(TMPdateOfBirth) : 'Chọn ngày sinh'}
                  format='DD/MM/YYYY'
                  minDate={'01/01/1900'}
                  maxDate={new Date()}
                  confirmBtnText='XÁC NHẬN'
                  cancelBtnText='HUỶ'
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      // marginLeft: scale(36),
                      borderWidth: 0,
                      alignItems: 'flex-start',
                      flex: 1,
                    }, dateText: {
                      fontSize: 17
                    },
                    placeholderText: {
                      fontSize: 17,
                      color: Colors.BLACK
                    },
                    // datePicker: {
                    //   marginVertical: 0
                    // },
                    // datePickerCon: {
                    //   marginVertical: 0
                    // }
                  }}
                  onDateChange={this._handleFieldNameChange('dateOfBirth')}
                  onOpenModal={() => this.setState({ focusId: 'dateOfBirth' })}
                  onCloseModal={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
              <Item stackedLabel style={this.state.focusId === 'mobilePhone' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Điện thoại</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('mobilePhone')}
                  placeholder={TMPmobilePhone}
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  onFocus={() => this.setState({ focusId: 'mobilePhone' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
              <Item stackedLabel style={this.state.focusId === 'address' ? focusTextboxBorderStyle : blurTextboxBorderStyle}>
                <Label style={AccountStyle.labelTitle}>Địa chỉ</Label>
                <Input
                  onChangeText={this._handleFieldNameChange('address')}
                  placeholder={TMPaddress}
                  autoCorrect={false}
                  onFocus={() => this.setState({ focusId: 'address' })}
                  onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                />
              </Item>
            </Form>
            <View style={{marginHorizontal: 25}}>
              <TouchableOpacity
                onPress={() => this.onSaveAccountInfo()}
                style={[AccountStyle.submitButton, submitableButtonBackground]}
                disabled={nothingChangeStatus}
              >
                <Text style={[AccountStyle.submitButtonText, submitableButtonTextColor]}>LƯU THÔNG TIN</Text>
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