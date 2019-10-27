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

class CreateNotiUyQuyen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      tieude: EMPTY_STRING,
      noidung: EMPTY_STRING,
      showUntil: EMPTY_STRING,

      executing: false,
      focusId: EMPTY_STRING,
      loading: false,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveNotiUyQuyen = async () => {
    const {
      tieude, noidung, showUntil, userId
    } = this.state;

    if (!tieude) {
      Toast.show({
        text: 'Vui lòng nhập tiêu đề',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    // else if (!noidung) {
    //   Toast.show({
    //     text: 'Vui lòng nhập nội dung',
    //     type: 'danger',
    //     buttonText: "OK",
    //     buttonStyle: { backgroundColor: Colors.WHITE },
    //     buttonTextStyle: { color: Colors.LITE_BLUE },
    //   });
    // } 
    else if (!showUntil) {
      Toast.show({
        text: 'Vui lòng chọn hạn hiển thị thông báo',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } 
    else {
      this.setState({
        executing: true
      });

      const url = `${API_URL}/api/account/SaveNotiUyQuyen`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        tieude,
        noidung,
        showUntil,
        userId
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
        text: resultJson.Status ? 'Đăng thông báo uỷ quyền thành công' : 'Đăng thông báo uỷ quyền thất bại',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: 3000,
        onClose: () => {
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({
              checkRefreshUyQuyenList: true
            });
            this.navigateBack();
          }
        }
      });
    }
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: Colors.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        tieude, noidung, showUntil,
        loading, focusId
      } = this.state,
      nothingChangeStatus = !tieude || !showUntil,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY },
      headerSubmitButtonStyle = !nothingChangeStatus ? { opacity: 1 } : { opacity: 0.6 };

    let bodyContent = null;
    if (loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <KeyboardAwareScrollView contentContainerStyle={{ margin: 5, padding: 5 }}>
          <Form style={{ marginVertical: 10 }}>
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "tieude" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Tiêu đề <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={tieude}
                onChangeText={this.handleChange("tieude")}
                onFocus={() => this.setState({ focusId: "tieude" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Hạn hiển thị <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={showUntil}
                mode="date"
                placeholder='Chọn hạn hiển thị thông báo'
                format='DD/MM/YYYY'
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
                onDateChange={this.handleChange("showUntil")}
              />
            </Item>

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Nội dung
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={noidung}
                onChangeText={this.handleChange("noidung")}
                style={[{ width: '100%', marginTop: 20 }, focusId === "noidung" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "noidung" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />

            </Item>

            <TouchableOpacity
              onPress={() => this.saveNotiUyQuyen()}
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
              ĐĂNG THÔNG BÁO UỶ QUYỀN
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveNotiUyQuyen()} style={headerSubmitButtonStyle} disabled={nothingChangeStatus}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNotiUyQuyen);

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