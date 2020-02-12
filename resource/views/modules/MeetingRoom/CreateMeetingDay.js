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
import { EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading, dataLoading } from '../../../common/Effect';
import { showWarningToast } from '../../../common/Utilities';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import GoBackButton from '../../common/GoBackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { meetingRoomApi } from '../../../common/Api';
import { DatePickerCustomStyle, CustomStylesDatepicker } from '../../../assets/styles';
import { CustomPickerButton, HeaderRightButton } from '../../common';

const MeetingRoomApi = meetingRoomApi();

class CreateMeetingDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      chutriId: props.extendsNavParams.chutriId || 0,
      mucdich: props.extendsNavParams.mucdich || EMPTY_STRING, //required
      thamgia: props.extendsNavParams.thamgia || EMPTY_STRING,//required
      ngayHop: props.extendsNavParams.ngayHop || EMPTY_STRING,//required
      thoigianBatdau: props.extendsNavParams.thoigianBatdau || EMPTY_STRING,//required
      thoigianKetthuc: EMPTY_STRING,//required
      lichCongtacId: props.extendsNavParams.lichCongtacId || 0,
      // Chọn phòng họp
      phonghopId: props.extendsNavParams.phonghopId || 0,
      phonghopName: props.extendsNavParams.phonghopName || EMPTY_STRING,

      chutriName: props.extendsNavParams.chutriName || EMPTY_STRING,
      executing: false,
      focusId: EMPTY_STRING,
      fromScreen: props.extendsNavParams.originScreen || EMPTY_STRING,
      loading: false,
      canCreateMeetingForOthers: false,

      isSaveBtnPressed: true,
      isSaveIcoPressed: true,
      isFromCalendar: props.extendsNavParams.isFromCalendar || false,

      joinPlaceholderText: EMPTY_STRING,
      joinNguoiId: [],
      joinNguoiText: [],
      joinVaitroId: [],
      joinVaitroText: [],
      joinPhongId: [],
      joinPhongText: [],
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  componentDidMount = () => {
    const navObj = this.props.navigation || this.props.navigator;
    this.willFocusListener = navObj.addListener('didFocus', () => {
      const { extendsNavParams } = this.props;
      if (extendsNavParams.hasOwnProperty('chutriId')) {

        if (extendsNavParams.chutriId > 0) {
          this.setState({
            chutriId: extendsNavParams.chutriId,
            chutriName: extendsNavParams.chutriName
          });
        }
      }
      if (extendsNavParams.hasOwnProperty('phonghopId')) {
        if (extendsNavParams.phonghopId > 0) {
          this.setState({
            phonghopId: extendsNavParams.phonghopId,
            phonghopName: extendsNavParams.phonghopName,
            fromScreen: EMPTY_STRING
          });
        }
      }
      if (extendsNavParams.hasOwnProperty('joinNguoiId')) {
        this.setState({
          joinNguoiId: extendsNavParams.joinNguoiId,
          joinNguoiText: extendsNavParams.joinNguoiText,
        });
      }
      if (extendsNavParams.hasOwnProperty('joinVaitroId')) {
        this.setState({
          joinVaitroId: extendsNavParams.joinVaitroId,
          joinVaitroText: extendsNavParams.joinVaitroText,
        });
      }
      if (extendsNavParams.hasOwnProperty('joinPhongId')) {
        this.setState({
          joinPhongId: extendsNavParams.joinPhongId,
          joinPhongText: extendsNavParams.joinPhongText,
        });
      }
      let joinPlaceholderTemp = [];
      if (extendsNavParams.hasOwnProperty('joinNguoiText')) {
        joinPlaceholderTemp = joinPlaceholderTemp.concat(extendsNavParams.joinNguoiText);
      }
      if (extendsNavParams.hasOwnProperty('joinVaitroText')) {
        joinPlaceholderTemp = joinPlaceholderTemp.concat(extendsNavParams.joinVaitroText);
      }
      if (extendsNavParams.hasOwnProperty('joinPhongText')) {
        joinPlaceholderTemp = joinPlaceholderTemp.concat(extendsNavParams.joinPhongText);
      }
      if (joinPlaceholderTemp.length > 0) {
        this.setState({
          joinPlaceholderText: joinPlaceholderTemp.join(', '),
          thamgia: joinPlaceholderTemp.map(text => `- ${text}`).join('\n'),
        });
      }
    });
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

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

    const resultJson = await MeetingRoomApi.getCreateHelper([
      this.state.userId
    ]);

    this.setState({
      loading: false,
      canCreateMeetingForOthers: resultJson.Status || false
    });
  }

  onPickChutri = async () => {
    const targetScreenParam = {
      chutriId: this.state.chutriId,
      chutriName: this.state.chutriName
    };

    this.onNavigate("PickNguoiChutriScreen", targetScreenParam);
  }
  clearNguoiChutri = () => {
    this.setState({
      chutriId: 0,
      chutriName: null
    });
  }

  onPickPhonghop = () => {
    const {
      phonghopId, phonghopName, thoigianBatdau, thoigianKetthuc, ngayHop
    } = this.state;

    const targetScreenParam = {
      phonghopId: phonghopId,
      phonghopName: phonghopName,
      fromScreen: "createMeetingDay",
      startHour: thoigianBatdau.split(":")[0],
      startMinute: thoigianBatdau.split(":")[1],
      endHour: thoigianKetthuc.split(":")[0],
      endMinute: thoigianKetthuc.split(":")[1],
      currentDate: ngayHop
    };
    this.onNavigate("PickMeetingRoomScreen", targetScreenParam);
  }
  clearPhonghop = () => {
    this.setState({
      phonghopId: 0,
      phonghopName: EMPTY_STRING
    });
  }

  onPickInvite = () => {
    const {
      joinNguoiId, joinNguoiText,
      joinVaitroId, joinVaitroText,
      joinPhongId, joinPhongText,
    } = this.state;
    const targetScreenParam = {
      joinNguoiId, joinNguoiText,
      joinVaitroId, joinVaitroText,
      joinPhongId, joinPhongText,
    }
    this.onNavigate('PickInviteUnitsScreen', targetScreenParam);
  }
  clearPickInvite = () => {
    this.setState({
      joinNguoiId: [],
      joinNguoiText: [],
      joinVaitroId: [],
      joinVaitroText: [],
      joinPhongId: [],
      joinPhongText: [],
      joinPlaceholderText: EMPTY_STRING,
      thamgia: EMPTY_STRING,
    });
  }

  saveLichhop = async () => {
    this.setState({
      isSaveBtnPressed: false,
      isSaveIcoPressed: false
    });
    const {
      mucdich, thamgia, chutriId, thoigianBatdau, thoigianKetthuc, ngayHop, userId, lichCongtacId, phonghopId,
      canCreateMeetingForOthers, isFromCalendar,
    } = this.state;

    if (!mucdich) {
      showWarningToast('Vui lòng nhập mục đích');
    } else if (!thamgia) {
      showWarningToast('Vui lòng nhập thành phần tham dự');
    } else if (!thoigianBatdau) {
      showWarningToast('Vui lòng chọn thời gian bắt đầu');
    } else if (!thoigianKetthuc) {
      showWarningToast('Vui lòng chọn thời gian kết thúc');
    } else if (!ngayHop) {
      showWarningToast('Vui lòng chọn ngày họp');
    } else {
      this.setState({
        executing: true
      });

      const resultJson = await MeetingRoomApi.saveCalendar({
        mucdich,
        thamgia,
        ngayHop,
        gioBatdau: thoigianBatdau.split(":")[0],
        phutBatdau: thoigianBatdau.split(":")[1],
        gioKetthuc: thoigianKetthuc.split(":")[0],
        phutKetthuc: thoigianKetthuc.split(":")[1],
        chutriId: isFromCalendar ? chutriId : (canCreateMeetingForOthers ? chutriId : userId),
        userId,
        lichCongtacId,
        phonghopId
      });

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Message,
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            const screenParam = {
              lichhopId: resultJson.Params,
              from: this.state.isFromCalendar ? "createMeetingDayViaCalendar" : "createMeetingDay",
            };

            this.props.updateCoreNavParams(screenParam);
            this.props.navigation.navigate("DetailMeetingDayScreen");
          }
          else {
            this.setState({
              isSaveBtnPressed: true,
              isSaveIcoPressed: true
            });
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
        mucdich, thamgia, chutriId, thoigianBatdau, thoigianKetthuc, ngayHop,
        loading, focusId, chutriName, canCreateMeetingForOthers,
        isSaveBtnPressed, isSaveIcoPressed,
        phonghopId, phonghopName
      } = this.state,
      nothingChangeStatus = !mucdich || !thoigianBatdau || !thoigianKetthuc || !ngayHop || !isSaveBtnPressed || !isSaveIcoPressed,
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
            {
              // (this.state.vanbanDenId > 0 || this.state.vanbanDiId > 0) && relateDoc
            }
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "mucdich" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Nội dung <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={mucdich}
                onChangeText={this.handleChange("mucdich")}
                onFocus={() => this.setState({ focusId: "mucdich" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>

            <CustomPickerButton
              isRender={canCreateMeetingForOthers}
              labelText='Người chủ trì'
              placeholderText='Chọn người chủ trì'
              valueId={chutriId}
              valueName={chutriName}
              pickFunc={() => this.onPickChutri()}
              clearFunc={() => this.clearNguoiChutri()}
            />

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Ngày họp <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={DatePickerCustomStyle.containerStyle}
                date={ngayHop}
                mode="date"
                placeholder='Chọn ngày họp'
                format='DD/MM/YYYY'
                // minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
                customStyles={CustomStylesDatepicker}
                onDateChange={this.handleChange("ngayHop")}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian bắt đầu <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={DatePickerCustomStyle.containerStyle}
                date={thoigianBatdau}
                mode="time"
                placeholder='Chọn thời gian bắt đầu'
                // format='HH:MM'
                // minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
                customStyles={CustomStylesDatepicker}
                onDateChange={this.handleChange("thoigianBatdau")}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian dự kiến kết thúc <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={DatePickerCustomStyle.containerStyle}
                date={thoigianKetthuc}
                mode="time"
                placeholder='Chọn thời gian dự kiến kết thúc'
                // format='HH:MM'
                // minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
                customStyles={CustomStylesDatepicker}
                onDateChange={this.handleChange("thoigianKetthuc")}
              />
            </Item>

            <CustomPickerButton
              labelText='Thành phần tham dự'
              placeholderText={'Chọn thành phần tham dự'}
              // valueId={phonghopId}
              valueName={this.state.joinPlaceholderText}
              pickFunc={() => this.onPickInvite()}
              clearFunc={() => this.clearPickInvite()}
            />

            <Item stackedLabel style={[{ marginHorizontal: verticalScale(0) }, focusId === "thamgia" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Textarea
                rowSpan={5} bordered
                placeholder='Nhập thành phần tham dự'
                onChangeText={this.handleChange('thamgia')}
                onFocus={() => this.setState({ focusId: "thamgia" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                style={{ width: '100%', marginTop: 20 }}
                value={thamgia}
                placeholderTextColor={Colors.GRAY}
              />
            </Item>

            <CustomPickerButton
              labelText='Phòng họp'
              placeholderText='Chọn phòng họp'
              valueId={phonghopId}
              valueName={phonghopName}
              pickFunc={() => this.onPickPhonghop()}
              clearFunc={() => this.clearPhonghop()}
            />

            <TouchableOpacity
              onPress={() => this.saveLichhop()}
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
              THÊM MỚI LỊCH HỌP
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              iconName='save' iconType='material'
              onPress={() => this.saveLichhop()}
              btnStyle={headerSubmitButtonStyle}
              btnDisabled={nothingChangeStatus}
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
    // coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetingDay);
