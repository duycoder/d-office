/**
 * @description: màn hình trình xử lý văn bản
 * @author: duynn
 * @since: 16/05/2018
 */
'use strict'
import React, { Component } from 'react';

//utilites
import {
  EMPTY_STRING,
  COMMON_COLOR,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { showWarningToast } from '../../../common/Utilities';

//effect
import { executeLoading } from '../../../common/Effect';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';


//lib
import {
  Container, Header, Left, Content, Title,
  Form, Textarea, Body, Right, Toast
} from 'native-base';

import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import GoBackButton from '../../common/GoBackButton';
import { carApi } from '../../../common/Api';
import { HeaderRightButton } from '../../common';

class CancelRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      registrationId: props.extendsNavParams.registrationId,
      reason: EMPTY_STRING,

      executing: false,
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveReject = async () => {
    const {
      userId, registrationId, reason
    } = this.state;
    if (reason) {
      this.setState({
        executing: true
      });

      const resultJson = await carApi().cancelRegistration({
        registrationId,
        reason,
        currentUserId: userId
      });

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Huỷ yêu cầu đăng ký sử dụng xe thành công' : 'Huỷ yêu cầu đăng ký sử dụng xe thất bại',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
        buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.RED_PANTONE_186C },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({ check: true });
            this.navigateBack();
          }
        }
      });
    }
    else {
      showWarningToast('Vui lòng nhập lý do');
    }
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>
              HUỶ YÊU CẦU
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton onPress={() => this.saveReject()} />
          </Right>
        </Header>

        <Content contentContainerStyle={{ padding: 10 }}>
          <Form>
            <Textarea rowSpan={5} bordered placeholder='Lý do huỷ' onChangeText={(reason) => this.setState({ reason })} />
          </Form>
        </Content>
        {
          executeLoading(this.state.executing)
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelRegistration);