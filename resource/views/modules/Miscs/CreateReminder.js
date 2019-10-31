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
import { Icon as RneIcon, ListItem } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import 'moment/locale/vi';

//utilities
import { API_URL, HEADER_COLOR, EMPTY_STRING, Colors } from '../../../common/SystemConstant';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading, dataLoading } from '../../../common/Effect';
import { asyncDelay, convertDateToString, backHandlerConfig, appGetDataAndNavigate, pickerFormat, formatLongText } from '../../../common/Utilities';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//style
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import GoBackButton from '../../common/GoBackButton';
import { ScrollView } from 'react-native-gesture-handler';
import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class CreateReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      noidung: EMPTY_STRING,
      ngay: EMPTY_STRING,
      gio: EMPTY_STRING,
      phut: EMPTY_STRING,
      period: EMPTY_STRING,

      thoigian: EMPTY_STRING,
      listPeriod: [],
      executing: false,
      focusId: EMPTY_STRING,
      fromScreen: props.extendsNavParams.originScreen || EMPTY_STRING,
      loading: false,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  componentWillMount = () => {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({
      loading: true
    });

    const url = `${API_URL}/api/Reminder/CreateReminder/${this.state.userId}`;

    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      loading: false,
      period: resultJson != null ? `${resultJson.Params.DefaultPeriod}` : EMPTY_STRING,
      listPeriod: resultJson != null ? resultJson.Params.ListPeriod : [],
    });
  }

  // navigateToVanbanLienquan = (screenName = "") => {
  //   const targetScreenParam = {
  //     docId: this.state.docId,
  //     docType: this.state.docType
  //   };
  //   this.onNavigate(screenName, targetScreenParam);
  // }

  saveReminder = async () => {
    const {
      noidung, thoigian, period, userId
    } = this.state;

    if (!noidung) {
      Toast.show({
        text: 'Vui lòng nhập nội dung nhắc việc',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    else if (!thoigian) {
      Toast.show({
        text: 'Vui lòng chọn thời gian',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else {
      this.setState({
        executing: true
      });

      const url = `${API_URL}/api/Reminder/SaveReminder`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        userId,
        reminderId: 0,
        noidung,
        ngay: thoigian.split(" ")[0],
        gio: thoigian.split(" ")[1].split(":")[0],
        phut: thoigian.split(" ")[1].split(":")[1],
        period: period
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
        text: resultJson.Status ? "Thêm mới nhắc việc thành công" : "Thêm mới nhắc việc thất bại",
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: 3000,
        onClose: () => {
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({ check: true });
            this.navigateBack();
            // const screenParam = {
            //   lichhopId: resultJson.Params,
            // };

            // this.props.updateCoreNavParams(screenParam);
            // this.props.navigation.navigate("DetailMeetingDayScreen");
          }
        }
      });
    }

  }

  onNavigate = (screenName, targetScreenParam) => {
    this.props.updateExtendsNavParams(targetScreenParam);
    this.props.navigation.navigate(screenName);
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: Colors.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        noidung, thoigian, period,
        loading, focusId
      } = this.state,
      nothingChangeStatus = !noidung || !thoigian,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY },
      headerSubmitButtonStyle = !nothingChangeStatus ? { opacity: 1 } : { opacity: 0.6 };

    let relateCalendar = null;

    let bodyContent = null;
    if (loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <KeyboardAwareScrollView contentContainerStyle={{ margin: 5, padding: 5 }}>
          <Form style={{ marginVertical: 10 }}>
            {
              // (this.state.vanbanDenId > 0 || this.state.vanbanDiId > 0) && relateDoc
            }
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "noidung" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Nội dung <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={noidung}
                onChangeText={this.handleChange("noidung")}
                onFocus={() => this.setState({ focusId: "noidung" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời điểm nhắc</Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={thoigian}
                mode="datetime"
                placeholder='Chọn thời điểm'
                format='DD/MM/YYYY HH:mm'
                // minDate={new Date()}
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
                onDateChange={this.handleChange("thoigian")}
              />
            </Item>

            <Item stackedLabel style={{ marginRight: verticalScale(18) }}>
              <Label>Nhắc nhở sau</Label>
              <Picker
                iosHeader='Nhắc nhở sau'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat(), justifyContent: 'space-around' }}
                selectedValue={period}
                onValueChange={this.handleChange("period")}>
                {
                  this.state.listPeriod.map((item, index) => (
                    <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                  ))
                }
              </Picker>
            </Item>

            <TouchableOpacity
              onPress={() => this.saveReminder()}
              style={[AccountStyle.submitButton, submitableButtonBackground]}
              disabled={nothingChangeStatus}
            >
              <Text style={[AccountStyle.submitButtonText, submitableButtonTextColor]}>LƯU</Text>
            </TouchableOpacity>
          </Form>
        </KeyboardAwareScrollView>
      );
    }

    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÊM MỚI NHẮC VIỆC
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveReminder()} style={headerSubmitButtonStyle} disabled={nothingChangeStatus}>
              <RneIcon name='save' size={30} color={Colors.WHITE} />
            </TouchableOpacity>
          </Right>
        </Header>
        {bodyContent}
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
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateReminder);

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