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
import { Icon, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as util from 'lodash';
//constants
import { EMPTY_STRING, API_URL, Colors, EMTPY_DATA_MESSAGE } from '../../../common/SystemConstant';

//styles
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import {ListChatterStyle} from '../../../assets/styles/ChatStyle';
import { moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';

import { authenticateLoading } from '../../../common/Effect';
import { asyncDelay, emptyDataPage, convertDateTimeToString, convertDateToString } from '../../../common/Utilities'

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

class DetailChatter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.navigation.state.params.id,
      name: props.navigation.state.params.name,
      email: props.navigation.state.params.email,
      level: props.navigation.state.params.level,
      phone: props.navigation.state.params.phone,
    }
  }

  navigateBackToChatter = () => {
    this.props.navigation.navigate('ChatterScreen');
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
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={()=>this.navigateBackToChatter()} />
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
              <ListItem
                leftIcon={
                  <View style={{marginHorizontal: moderateScale(30)}}>
                    <Icon name={'address-card'} type={'font-awesome'} size={moderateScale(40)} />
                  </View>
                }
                leftIconUnderlayColor={'transparent'}
                hideChevron={true}
                title={
                  this.state.name
                }
                titleStyle={ListChatterStyle.chatterName}
              />

              <ListItem
                leftIcon={
                  <View style={{marginHorizontal: moderateScale(30)}}>
                    <Icon name={'envelope'} type={'font-awesome'} size={moderateScale(40)} />
                  </View>
                }
                leftIconUnderlayColor={'transparent'}
                hideChevron={true}
                title={
                  this.state.email
                }
                titleStyle={ListChatterStyle.chatterName}
              />

              <ListItem
                leftIcon={
                  <View style={{marginHorizontal: moderateScale(30)}}>
                    <Icon name={'user-tie'} type={'font-awesome'} size={moderateScale(40)} />
                  </View>
                }
                leftIconUnderlayColor={'transparent'}
                hideChevron={true}
                title={
                  this.state.level
                }
                titleStyle={ListChatterStyle.chatterName}
              />

              <ListItem
                leftIcon={
                  <View style={{marginHorizontal: moderateScale(30), alignSelf: 'center'}}>
                    <Icon name={'mobile'} type={'font-awesome'} size={moderateScale(40)} />
                  </View>
                }
                leftIconUnderlayColor={'transparent'}
                hideChevron={true}
                title={
                  this.state.phone
                }
                titleStyle={ListChatterStyle.chatterName}
              />
            </Form>
          </Content>
        </ImageBackground>
        {
          //authenticateLoading(this.state.loading)
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

export default connect(mapStatetoProps)(DetailChatter);