/*
	@description: màn hình phản hồi văn bản cần review
	@author: duynn
	@since: 16/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
  TouchableOpacity
} from 'react-native';

//constant
import {
  EMPTY_STRING, COMMON_COLOR, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';

//native-base
import {
  Form, Button, Icon as NBIcon, Text as NBText, Item, Input, Title, Picker, Toast,
  Container, Header, Content, Left, Right, Body, Label
} from 'native-base';

import { executeLoading } from '../../../common/Effect';
import { pickerFormat, showWarningToast } from '../../../common/Utilities';

//lib
import { connect } from 'react-redux';
import util from 'lodash';
import * as workflowAction from '../../../redux/modules/Workflow/Action';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

import { AlertMessage, GoBackButton, AlertMessageButton } from '../../common';
import AlertMessageStyle from '../../../assets/styles/AlertMessageStyle';
import { vanbandiApi } from '../../../common/Api';

class WorkflowReplyReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,

      docId: this.coreNavParams.docId,
      docType: this.coreNavParams.docType,

      itemType: this.extendsNavParams.itemType,
      message: EMPTY_STRING,
      selected: 1,
      executing: false
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onConfirmReplyReview() {
    if (util.isNull(this.state.message) || util.isEmpty(this.state.message)) {
      showWarningToast('Vui lòng nhập nội dung phản hồi');
    } else {
      this.refs.confirm.showModal();
    }
  }

  saveReplyReview = async () => {
    this.refs.confirm.closeModal();
    this.setState({
      executing: true
    });

    const {
      userId, message, selected, docId, itemType,
      docType
    } = this.state;

    const resultJson = await vanbandiApi().saveReplyReview({
      userID: userId,
      phanHoiVanBan: message,
      pheDuyetVanBan: selected,
      itemId: docId,
      itemType
    });

    this.setState({
      executing: false
    });

    if (!util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
      const message = this.props.userInfo.Fullname + " đã trả lời yêu cầu review 1 văn bản";
      const content = {
        title: 'TRẢ LỜI REVIEW VĂN BẢN',
        message,
        isTaskNotification: false,
        targetScreen: 'VanBanDiDetailScreen',
        targetDocId: this.state.docId,
        targetDocType: this.state.docType
      }
      content.message = formatMessage(content.message, "VanBanDiDetailScreen", 0, docType, docId);

      resultJson.GroupTokens.forEach(token => {
        pushFirebaseNotify(content, token, "notification");
      });
    }

    Toast.show({
      text: resultJson.Status ? 'Phản hồi yêu cầu review thành công' : 'Phản hồi yêu cầu review không thành công',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
      buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.LITE_BLUE },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        this.props.resetProcessUsers();
        if (resultJson.Status) {
          this.props.updateExtendsNavParams({ check: true });
          this.navigateBack();
        }
      }
    });
  }

  render() {
    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              REVIEW VĂN BẢN TRÌNH KÝ
                        </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Nội dung phản hồi</Label>
              <Input onChangeText={(message) => this.setState({ message })} />
            </Item>

            <Item stackedLabel>
              <Label>Đánh giá</Label>
              <Picker mode='dropdown'
                iosHeader='Chọn kết quả đánh giá'
                iosIcon={<NBIcon name='ios-arrow-down-outline' />}
                style={{ width: pickerFormat() }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label='Đồng ý' value='1' />
                <Picker.Item label='Trả lại' value='0' />
              </Picker>
            </Item>

            <Button block style={{ backgroundColor: COMMON_COLOR.LITE_BLUE, marginTop: verticalScale(20) }} onPress={() => this.onConfirmReplyReview()}>
              <NBText>
                PHẢN HỒI YÊU CẦU
                            </NBText>
            </Button>
          </Form>
        </Content>

        {
          executeLoading(this.state.executing)
        }

        <AlertMessage
          ref="confirm"
          title="XÁC NHẬN PHẢN HỒI"
          bodyText="Bạn có chắc chắn muốn thực hiện việc này?"
          exitText="Huỷ bỏ"
        >
          <AlertMessageButton btnText='ĐỒNG Ý' onPress={() => this.saveReplyReview()} />
        </AlertMessage>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetProcessUsers: () => dispatch(workflowAction.resetProcessUsers()),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowReplyReview);