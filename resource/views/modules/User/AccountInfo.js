/**
 * @description: màn hình truy vấn thông tin người dùng
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  View, Text,
  Image, ImageBackground,
  TouchableOpacity, StatusBar
} from 'react-native';

//lib
import {
  Container, Content, Form, Item, Input, Label,
  Header, Right, Body, Left, Button, Title
} from 'native-base';
import { Icon } from 'react-native-elements';
import * as util from 'lodash';
//constants
import { EMPTY_STRING, API_URL, Colors } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading, dataLoading, executeLoading } from '../../../common/Effect';
import { convertDateToString } from '../../../common/Utilities';

//redux
import { connect } from 'react-redux';
import * as userAction from '../../../redux/modules/User/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//fcm
//import FCM, { FCMEvent } from 'react-native-fcm';
import Confirm from '../../common/Confirm';

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

  navigateToEditAccount = () => {
    const targetScreenParams = {
      fullName: this.state.fullName,
      dateOfBirth: this.state.dateOfBirth,
      mobilePhone: this.state.mobilePhone,
      address: this.state.address,
      email: this.state.email
    }
    this.props.updateExtendsNavParams(targetScreenParams);
    this.props.navigation.navigate('AccountEditorScreen');
  }

  fetchData = async () => {
    const url = `${API_URL}/api/account/GetUserInfo/${this.state.id}`;
    let result = await fetch(url)
      .then(response => response.json())
      .then(responseJson => responseJson);

    this.setState({
      userName: result.TENDANGNHAP,
      fullName: result.HOTEN,
      email: result.EMAIL,
      dateOfBirth: result.NGAYSINH,
      mobilePhone: result.DIENTHOAI,
      address: result.DIACHI,
      loading: false
    });
  }

  componentWillMount = () => {
    this.setState({
      loading: true
    }, () => this.fetchData())
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('didFocus', () => {
      // StatusBar.setBarStyle('light-content');
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({
            loading: true
          }, () => {
            this.fetchData();
          });
          this.props.updateExtendsNavParams({ check: false });
        }
      }
    });
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  onLogOut() {
    this.refs.confirm.showModal();
  }

  render() {
    const { fullName, email, dateOfBirth, mobilePhone, address } = this.state;

    const fullNameText = (fullName === EMPTY_STRING) ? '(Không có)' : fullName;
    const emailText = (email === EMPTY_STRING) ? '(Không có)' : email;
    const dateOfBirthText = dateOfBirth ? convertDateToString(dateOfBirth) : '(Không có)';
    const mobilePhoneText = (mobilePhone === EMPTY_STRING) ? '(Không có)' : mobilePhone;
    const addressText = (address === EMPTY_STRING) ? '(Không có)' : address;

    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TÀI KHOẢN
            </Title>
          </Body>
          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={()=>this.onLogOut()} style={{marginRight: 20}}>
              <Icon name="power" size={moderateScale(20, 1.2)} color={Colors.WHITE} type="material-community" />
            </TouchableOpacity>
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
          executeLoading(this.state.loading)
        }

        <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
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

export default connect(mapStatetoProps, mapDispatchToProps)(AccountInfo);