/*
	@description: tạo công việc con
	@author: duynn
	@since: 19/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
//lib
import {
  Container, Header, Left, Body, Content,
  Right, Item, Title, Text, Icon, Input,
  Button, Form, Picker, Toast, Label, Textarea
} from 'native-base'
import { Icon as RneIcon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

//utilities
import { API_URL, HEADER_COLOR, EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';
import { asyncDelay, convertDateToString, backHandlerConfig, appGetDataAndNavigate, pickerFormat, showWarningToast } from '../../../common/Utilities';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//style
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { GoBackButton } from '../../common';
import { DatePickerCustomStyle } from '../../../assets/styles';
import { taskApi } from '../../../common/Api';

class CreateTaskPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      // taskId: props.coreNavParams.taskId,
      // taskType: props.coreNavParams.taskType,

      startDate: null,
      endDate: null,
      purpose: EMPTY_STRING,
      steps: EMPTY_STRING,

      executing: false,
      focusId: EMPTY_STRING,
      fromScreen: props.extendsNavParams.originScreen || EMPTY_STRING,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  componentDidMount = () => {
    // backHandlerConfig(true, this.navigateBackToDetail);
  }

  componentWillUnmount = () => {
    // backHandlerConfig(false, this.navigateBackToDetail);
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }



  saveTask = async () => {
    const { fromScreen } = this.state;

    if (util.isNull(this.state.content) || util.isEmpty(this.state.content)) {
      showWarningToast('Vui lòng nhập nội dung');
    } else if (util.isNull(this.state.chosenDate) || util.isEmpty(this.state.chosenDate)) {
      showWarningToast('Vui lòng nhập thời hạn xử lý');
    } else {
      this.setState({
        executing: true
      });

      const { taskId, content, priorityValue, urgencyValue, chosenDate, planValue } = this.state;

      const resultJson = await taskApi().saveSubTask({
        beginTaskId: taskId,
        taskContent: content,
        priority: priorityValue,
        urgency: urgencyValue,
        deadline: chosenDate,
        isHasPlan: planValue == '1'
      });

      await asyncDelay();

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Tạo công việc thành công' : 'Tạo công việc không thành công',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            if (fromScreen === "DashboardScreen") {
              this.props.navigation.navigate("ListPersonalTaskScreen");
            }
            else {
              this.props.updateExtendsNavParams({ check: true });
              this.navigateBack();
            }
          }
        }
      });
    }

  }

  render() {
    const focusTextboxBorderStyle = { borderColor: Colors.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        startDate, endDate, purpose, steps
      } = this.state,
      nothingChangeStatus = !startDate && !endDate,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY };

    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              LẬP KẾ HOẠCH
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={AccountStyle.mainContainer} scrollEnabled>
          <Form>
            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
              <Label>Dự kiến bắt đầu <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                style={DatePickerCustomStyle.containerStyle}
                date={startDate}
                mode="date"
                placeholder='Chọn ngày'
                format='DD/MM/YYYY'
                minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
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
                onDateChange={this.handleChange("startDate")}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
              <Label>Dự kiến kết thúc <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                style={DatePickerCustomStyle.containerStyle}
                date={endDate}
                mode="date"
                placeholder='Chọn ngày'
                format='DD/MM/YYYY'
                minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
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
                onDateChange={this.handleChange("endDate")}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                Mục tiêu
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={purpose}
                onChangeText={this.handleChange("purpose")}
                style={{ width: '100%', marginTop: 20 }}
              />

            </Item>

            <Item stackedLabel>
              <Label>
                Các bước thực hiện
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={steps}
                onChangeText={this.handleChange("steps")}
                style={{ width: '100%', marginTop: 20 }}
              />
            </Item>

            <TouchableOpacity
              onPress={() => this.saveTask()}
              style={[AccountStyle.submitButton, submitableButtonBackground]}
              disabled={nothingChangeStatus}
            >
              <Text style={[AccountStyle.submitButtonText, submitableButtonTextColor]}>LƯU</Text>
            </TouchableOpacity>
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
    // coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskPlan);

const styles = StyleSheet.create({
  textAreaContainer: {
    borderColor: Colors.GRAY,
    borderWidth: 1,
    padding: 5,
    width: '100%'
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  }
})