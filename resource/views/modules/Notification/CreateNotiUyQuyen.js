/*
	@description: tạo công việc con
	@author: duynn
	@since: 19/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
//lib
import {
  Container, Header, Left, Body, Right, Item, Title, Text, Input,
  Form, Toast, Label, Textarea
} from 'native-base'
import DatePicker from 'react-native-datepicker';
import 'moment/locale/vi';

//utilities
import { EMPTY_STRING, COMMON_COLOR, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { executeLoading, dataLoading } from '../../../common/Effect';
import { showWarningToast } from '../../../common/Utilities';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//style
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { accountApi } from '../../../common/Api';
import { DatePickerCustomStyle, CustomStylesDatepicker } from '../../../assets/styles';
import { HeaderRightButton, GoBackButton } from '../../common';

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

      isSaveBtnPressed: true,
      isSaveIcoPressed: true,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveNotiUyQuyen = async () => {
    this.setState({
      isSaveBtnPressed: false,
      isSaveIcoPressed: false
    });
    const {
      tieude, noidung, showUntil, userId
    } = this.state;

    if (!tieude) {
      showWarningToast('Vui lòng nhập tiêu đề', this._toggleSaveState);
    }
    // else if (!noidung) {
    //   Toast.show({
    //     text: 'Vui lòng nhập nội dung',
    //     type: 'danger',
    //     buttonText: "OK",
    //     buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
    //     buttonTextStyle: { color: COMMON_COLOR.LITE_BLUE },
    //   });
    // } 
    else if (!showUntil) {
      showWarningToast('Vui lòng chọn hạn hiển thị thông báo', this._toggleSaveState);
    }
    else {
      this.setState({
        executing: true
      });

      const resultJson = await accountApi().saveNotiUyquyen({
        tieude,
        noidung,
        showUntil,
        userId
      });

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Đăng thông báo uỷ quyền thành công' : 'Đăng thông báo uỷ quyền thất bại',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
        buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({
              checkRefreshUyQuyenList: true
            });
            this.navigateBack();
          }
          else {
            this._toggleSaveState();
          }
        }
      });
    }
  }

  _toggleSaveState = () => {
    this.setState({
      isSaveBtnPressed: true,
      isSaveIcoPressed: true,
    });
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: COMMON_COLOR.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        tieude, noidung, showUntil,
        loading, focusId,
        isSaveBtnPressed, isSaveIcoPressed
      } = this.state,
      nothingChangeStatus = !tieude || !showUntil || !isSaveBtnPressed || !isSaveIcoPressed,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: COMMON_COLOR.LITE_BLUE } : { backgroundColor: COMMON_COLOR.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: COMMON_COLOR.WHITE } : { color: COMMON_COLOR.DARK_GRAY },
      headerSubmitButtonStyle = !nothingChangeStatus ? { opacity: 1 } : { opacity: 0.6 };

    let bodyContent = null;
    if (loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <KeyboardAwareScrollView contentContainerStyle={{ margin: 5, padding: 5 }}>
          <Form style={{ marginVertical: 10, paddingHorizontal: moderateScale(12, .9) }}>
            <Item stackedLabel style={[focusId === "tieude" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Tiêu đề <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={tieude}
                onChangeText={this.handleChange("tieude")}
                autoCorrect={false}
                onFocus={() => this.setState({ focusId: "tieude" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>

            <Item stackedLabel style={{ justifyContent: 'center' }}>
              <Label>Hạn hiển thị <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={DatePickerCustomStyle.containerStyle}
                date={showUntil}
                mode="date"
                placeholder='Chọn hạn hiển thị thông báo'
                format='DD/MM/YYYY'
                // minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
                customStyles={CustomStylesDatepicker}
                onDateChange={this.handleChange("showUntil")}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                Nội dung
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={noidung}
                onChangeText={this.handleChange("noidung")}
                style={[{ width: '100%', marginTop: moderateScale(18.5, 0.85) }, focusId === "noidung" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
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
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              ĐĂNG THÔNG BÁO UỶ QUYỀN
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              onPress={() => this.saveNotiUyQuyen()}
              iconName='save' iconType='material'
              btnStyle={headerSubmitButtonStyle} btnDisabled={nothingChangeStatus}
            />
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
