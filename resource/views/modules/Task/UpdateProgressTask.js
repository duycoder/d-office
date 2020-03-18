/*
    @description: cập nhật tiến độ công việc
    @author: duynn
    @since: 15/05/2018
*/
'use strict'
import React, { Component } from 'react';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Left, Text, Content, Label, Toast,
  Body, Right, Title, Button, Form, Item, Input
} from 'native-base';
import Slider from 'react-native-slider';
import * as util from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//utilities
import {
  EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { showWarningToast } from '../../../common/Utilities';
import { executeLoading } from '../../../common/Effect';
import { verticalScale, scale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { GoBackButton } from '../../common';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { taskApi } from '../../../common/Api';

class UpdateProgressTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      taskId: props.coreNavParams.taskId,
      taskType: props.coreNavParams.taskType,

      oldProgressValue: this.props.extendsNavParams.oldProgressValue,
      progressValue: this.props.extendsNavParams.progressValue,
      progressValueStr: this.props.extendsNavParams.progressValue.toString(),
      comment: EMPTY_STRING,

      executing: false,
    }
  }

  onUpdateProgressTask = async () => {
    if (util.isNull(this.state.progressValueStr) || util.isEmpty(this.state.progressValueStr)) {
      showWarningToast('Vui lòng nhập phần trăm hoàn thành công việc');
    } else if (util.isNull(this.state.comment) || util.isEmpty(this.state.comment)) {
      showWarningToast('Vui lòng nhập nội dung');
    } else {
      this.setState({
        executing: true
      });

      const { userId, taskId, progressValue, comment } = this.state;

      const resultJson = await taskApi().updateProgressTask({
        userId,
        taskId,
        percentComplete: progressValue,
        comment
      });

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Cập nhật tiến độ công việc thành công' : resultJson.Message,
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({ check: true });
            this.navigateBackToDetail();
          }
        }
      });
    }
  }

  navigateBackToDetail = () => {
    this.props.navigation.goBack();
  }

  onSliderChange = (value) => {
    this.setState({
      progressValue: value,
      progressValueStr: value.toString()
    })
  }

  onInputChange = (value) => {
    this.setState({
      progressValueStr: value
    });

    if (!util.isNull(value) && !util.isEmpty(value) && !isNaN(value)) {
      let finalValue = parseInt(value);
      if (finalValue > 100) {
        finalValue = 100;
        this.setState({
          progressValueStr: '100'
        });
      }

      this.setState({
        progressValue: finalValue
      })
    } else {
      this.setState({
        progressValue: 0
      })
    }
  }

  render() {
    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToDetail()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CẬP NHẬT TIẾN ĐỘ
                        </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>
        <KeyboardAwareScrollView contentContainerStyle={AccountStyle.mainContainer}>
          <Slider
            step={1}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={Colors.LITE_BLUE}
            maximumTrackTintColor={Colors.WHITE}
            value={this.state.progressValue}
            onValueChange={value => this.onSliderChange(value)}
            thumbStyle={{
              height: verticalScale(50),
              width: scale(25),
              backgroundColor: Colors.WHITE,
              borderRadius: 4,
              borderColor: Colors.GRAY,
              borderWidth: 1
            }}
            trackStyle={{
              height: verticalScale(30),
              borderWidth: 1,
              borderColor: Colors.GRAY
            }}

            style={{
              borderRadius: 4,
              marginHorizontal: scale(5),
              marginVertical: verticalScale(50),
              height: verticalScale(50),

            }} />

          <Form>
            <Item stackedLabel>
              <Label>Tiến độ hiện tại (%)</Label>
              <Input value={this.state.oldProgressValue.toString()}
                editable={false} />
            </Item>
            <Item stackedLabel>
              <Label>Tiến độ cập nhật (%)</Label>
              <Input value={this.state.progressValueStr}
                keyboardType='numeric' maxLength={3}
                onChangeText={value => this.onInputChange(value)} />
            </Item>

            <Item stackedLabel>
              <Label>Nội dung <Text style={{ color: '#f00' }}>*</Text></Label>
              <Input
                value={this.state.comment}
                onChangeText={(comment) => this.setState({ comment })}
                returnKeyLabel='Cập nhật'
                returnKeyType='done'
                onSubmitEditing={() => this.onUpdateProgressTask()}
              />
            </Item>

            <Button block danger
              style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
              onPress={() => this.onUpdateProgressTask()}>
              <Text>
                CẬP NHẬT
                            </Text>
            </Button>
          </Form>
        </KeyboardAwareScrollView>

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
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProgressTask);