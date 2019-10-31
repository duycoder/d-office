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
import { asyncDelay, convertDateToString, backHandlerConfig, appGetDataAndNavigate, pickerFormat } from '../../../common/Utilities';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//style
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import GoBackButton from '../../common/GoBackButton';

class ConfirmTaskPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      // taskId: props.coreNavParams.taskId,
      // taskType: props.coreNavParams.taskType,

      planStatus: "1",
      planSummary: EMPTY_STRING,

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
      Toast.show({
        text: 'Vui lòng nhập nội dung',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (util.isNull(this.state.chosenDate) || util.isEmpty(this.state.chosenDate)) {
      Toast.show({
        text: 'Vui lòng nhập thời hạn xử lý',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else {
      this.setState({
        executing: true
      });

      const url = `${API_URL}/api/HscvCongViec/CreateSubTask`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        beginTaskId: this.state.taskId,
        taskContent: this.state.content,
        priority: this.state.priorityValue,
        urgency: this.state.urgencyValue,
        deadline: this.state.chosenDate,
        isHasPlan: this.state.planValue == '1'
      });

      const result = await fetch(url, {
        method: 'POST',
        headers,
        body
      });

      const resultJson = await result.json();

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
        planStatus, planSummary, focusId
      } = this.state,
      nothingChangeStatus = !planStatus,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY };

    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              PHÊ DUYỆT KẾ HOẠCH
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={AccountStyle.mainContainer} scrollEnabled>
          <Form>
            <Item stackedLabel>
              <Label>Trạng thái phê duyệt <Text style={{ color: Colors.RED_PANTONE_186C }}>*</Text></Label>
              <Picker
                iosHeader='Chọn trạng thái phê duyệt'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat() }}
                selectedValue={planStatus}
                onValueChange={this.handleChange("planStatus")}>
                <Picker.Item value="1" label="Duyệt" />
                <Picker.Item value="0" label="Trả lại" />
              </Picker>
            </Item>

            <Item stackedLabel>
              <Label>
                Nội dung
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={planSummary}
                onChangeText={this.handleChange("planSummary")}
                style={[{ width: '100%', marginTop: 20 }, focusId === "planSummary" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "planSummary" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTaskPlan);

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