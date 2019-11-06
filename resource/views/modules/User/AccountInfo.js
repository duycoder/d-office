/**
 * @description: màn hình truy vấn thông tin người dùng
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  View, Text,
  Image, ImageBackground, StyleSheet,
  TouchableOpacity, StatusBar
} from 'react-native';

//lib
import {
  Container, Content, Form, Item, Input, Label,
  Header, Right, Body, Left, Button, Title
} from 'native-base';
import { Icon, Button as RNEButton, ListItem } from 'react-native-elements';
import 'moment/locale/vi';
// import ImagePicker from 'react-native-image-picker';
import * as util from 'lodash';
//constants
import { EMPTY_STRING, API_URL, Colors, WEB_URL } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
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

import Images from '../../../common/Images';
import GoBackButton from '../../common/GoBackButton';

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

      avatarLink: EMPTY_STRING,
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
      userName: result.TENDANGNHAP || '(Không có)',
      fullName: result.HOTEN || '(Không có)',
      email: result.EMAIL || '(Không có)',
      dateOfBirth: result.NGAYSINH,
      mobilePhone: result.DIENTHOAI || '(Không có)',
      address: result.DIACHI || '(Không có)',
      avatarLink: result.ANH_DAIDIEN || EMPTY_STRING,
      loading: false
    });
  }

  componentWillMount = () => {
    this.setState({
      loading: true
    }, () => this.fetchData())
  }

  componentDidMount = () => {
    const navObj = this.props.navigation || this.props.navigator;
    this.willFocusListener = navObj.addListener('didFocus', () => {
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

  navigateBack = () => {
    const navObj = this.props.navigation || this.props.navigator;
    navObj.goBack();
  }

  render() {
    const {
      fullName, email, dateOfBirth, mobilePhone, address,
      avatarLink
    } = this.state;

    const dateOfBirthText = dateOfBirth ? convertDateToString(dateOfBirth) : '(Không có)';

    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            {
              // <GoBackButton onPress={() => this.navigateBack()} />
            }
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TÀI KHOẢN
            </Title>
          </Body>
          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.onLogOut()} style={{ marginRight: 20 }}>
              <Icon name="power" size={moderateScale(20, 1.2)} color={Colors.WHITE} type="material-community" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Container style={{ backgroundColor: Colors.LIGHT_GRAY_PASTEL }}>
          <ListItem
            roundAvatar
            hideChevron
            title={fullName.toUpperCase()}
            titleStyle={{ fontWeight: 'bold', fontSize: moderateScale(14, 1.1) }}
            subtitle={email}
            subtitleStyle={{ fontSize: moderateScale(12, 1.1) }}
            avatar={avatarLink.length > 0 ? { uri: `${WEB_URL}/Uploads/${avatarLink}` } : Images.userAvatar}
            containerStyle={{ borderBottomWidth: 0, marginTop: moderateScale(14, .9), backgroundColor: Colors.WHITE, paddingHorizontal: 15 }}
          />
          <Content style={[AccountStyle.mainContainer, { paddingHorizontal: 0 }]}>

            <Form style={{ backgroundColor: Colors.WHITE, paddingHorizontal: moderateScale(12, .9) }}>
              {
                // <Item stackedLabel style={AccountStyle.labelContainer}>
                //   <Label>Tên đăng nhập</Label>
                //   <Label style={AccountStyle.labelResult}>
                //     {this.state.userName}
                //   </Label>
                // </Item>
                // <Item stackedLabel style={AccountStyle.labelContainer}>
                //   <Label style={AccountStyle.labelTitle}>Tên đầy đủ</Label>
                //   <Label style={AccountStyle.labelResult}>
                //     {fullName}
                //   </Label>
                // </Item>
                // <Item stackedLabel style={AccountStyle.labelContainer}>
                //   <Label style={AccountStyle.labelTitle}>Email</Label>
                //   <Label style={AccountStyle.labelResult}>
                //     {email}
                //   </Label>
                // </Item>
              }

              <Item stackedLabel style={AccountStyle.labelContainer}>
                <Label style={AccountStyle.labelTitle}>Ngày sinh</Label>
                <Label style={AccountStyle.labelResult}>
                  {dateOfBirthText}
                </Label>
              </Item>
              <Item stackedLabel style={AccountStyle.labelContainer}>
                <Label style={AccountStyle.labelTitle}>Điện thoại</Label>
                <Label style={AccountStyle.labelResult}>
                  {mobilePhone}
                </Label>
              </Item>
              <Item stackedLabel style={AccountStyle.labelContainer}>
                <Label style={AccountStyle.labelTitle}>Địa chỉ</Label>
                <Label style={[AccountStyle.labelResult, { marginBottom: verticalScale(15) }]}>
                  {address}
                </Label>
              </Item>
            </Form>

            <View style={{ marginHorizontal: moderateScale(25) }}>
              <TouchableOpacity
                onPress={() => this.navigateToEditAccount()}
                style={[LoginStyle.formButtonLogin, AccountStyle.submitButton]}
              >
                <Text style={[LoginStyle.formButtonText, AccountStyle.submitButtonText]}>SỬA THÔNG TIN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("AccountChangePasswordScreen")}
                style={[LoginStyle.formButtonLogin, AccountStyle.submitButton, { backgroundColor: '#e3900b' }]}
              >
                <Text style={[LoginStyle.formButtonText, AccountStyle.submitButtonText]}>ĐỔI MẬT KHẨU</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onLogOut()}
                style={[LoginStyle.formButtonLogin, AccountStyle.submitButton, { backgroundColor: '#ec391e' }]}
              >
                <Text style={[LoginStyle.formButtonText, AccountStyle.submitButtonText]}>ĐĂNG XUẤT</Text>
              </TouchableOpacity>
            </View>

          </Content>
        </Container>


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