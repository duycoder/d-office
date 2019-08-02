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
import { API_URL, HEADER_COLOR, EMPTY_STRING, Colors } from '../../../common/SystemConstant';
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

class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      // taskId: props.coreNavParams.taskId,
      // taskType: props.coreNavParams.taskType,

      deadline: EMPTY_STRING,
      content: EMPTY_STRING,
      title: EMPTY_STRING,
      purpose: EMPTY_STRING,
      listPriority: props.extendsNavParams.listPriority || EMPTY_STRING,
      listUrgency: props.extendsNavParams.listUrgency || EMPTY_STRING,
      priorityValue: props.extendsNavParams.priorityValue || EMPTY_STRING, //độ ưu tiên
      urgencyValue: props.extendsNavParams.urgencyValue || EMPTY_STRING, //đô khẩn
      planValue: '0', //lập kế hoạch 

      executing: false,
      chosenDate: null,
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

      await asyncDelay(2000);

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Tạo công việc thành công' : 'Tạo công việc không thành công',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: 3000,
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
        title, content, chosenDate
      } = this.state,
      nothingChangeStatus = !title && !content && !chosenDate,
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
              THÊM MỚI CÔNG VIỆC
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={AccountStyle.mainContainer} scrollEnabled>
          <Form>
            <Item stackedLabel>
              <Label>
                Tên công việc <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={this.state.title}
                onChangeText={this.handleChange("title")} />
            </Item>

            <Item stackedLabel>
              <Label>Độ ưu tiên</Label>
              <Picker
                iosHeader='Chọn độ ưu tiên'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat() }}
                selectedValue={this.state.priorityValue} //sai chinh ta @@
                onValueChange={this.handleChange("priorityValue")}>
                {
                  // this.state.listPriority.map((item, index) => (
                  //   <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                  // ))
                }
                <Picker.Item value="0" label="Bình thường" />
                <Picker.Item value="1" label="Cao" />
                <Picker.Item value="2" label="Khẩn" />
                <Picker.Item value="3" label="Khẩn cấp" />
              </Picker>
            </Item>

            <Item stackedLabel>
              <Label>Mức độ quan trọng</Label>
              <Picker
                iosHeader='Chọn mức quan trọng'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat() }}
                selectedValue={this.state.urgencyValue}
                onValueChange={this.handleChange("urgencyValue")}>
                {
                  // this.state.listUrgency.map((item, index) => (
                  //   <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                  // ))
                }
                <Picker.Item value="0" label="Quan trọng" />
                <Picker.Item value="1" label="Rất quan trọng" />
              </Picker>
            </Item>

            <Item stackedLabel>
              <Label>Lập kế hoạch</Label>
              <Picker
                iosHeader='Chọn mức quan trọng'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat() }}
                // itemTextStyle={{marginHorizontal:20}}
                // itemStyle={{marginHorizontal:40}}
                selectedValue={this.state.planValue}
                onValueChange={this.handleChange("planValue")}>
                <Picker.Item value="1" label="Có" />
                <Picker.Item value="0" label="Không" />
              </Picker>
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
              <Label>Hạn hoàn thành <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={this.state.chosenDate}
                mode="date"
                placeholder='Hạn hoàn thành'
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
                onDateChange={this.handleChange("chosenDate")}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                Nội dung <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={this.state.content}
                onChangeText={this.handleChange("content")}
                style={{ width: '100%', marginTop: 20 }}
              />

            </Item>

            <Item stackedLabel>
              <Label>
                Mục tiêu
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={this.state.purpose}
                onChangeText={this.handleChange("purpose")}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);

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