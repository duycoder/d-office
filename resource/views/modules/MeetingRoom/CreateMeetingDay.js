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
import { API_URL, HEADER_COLOR, EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
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
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("chutriId")) {
        if (this.props.extendsNavParams.chutriId > 0) {
          this.setState({
            chutriId: this.props.extendsNavParams.chutriId,
            chutriName: this.props.extendsNavParams.chutriName
          });
        }
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

    const url = `${API_URL}/api/MeetingRoom/CreateLichhop/${this.state.userId}`;

    const result = await fetch(url);
    const resultJson = await result.json();

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
    const targetScreenParam = {
      phonghopId: this.state.phonghopId,
      phonghopName: this.state.phonghopName
    };
    this.onNavigate("PickMeetingRoomScreen", targetScreenParam);
  }
  clearPhonghop = () => {
    this.setState({
      phonghopId,
      phonghopName
    });
  }

  // navigateToVanbanLienquan = (screenName = "") => {
  //   const targetScreenParam = {
  //     docId: this.state.docId,
  //     docType: this.state.docType
  //   };
  //   this.onNavigate(screenName, targetScreenParam);
  // }

  saveLichhop = async () => {
    this.setState({
      isSaveBtnPressed: false,
      isSaveIcoPressed: false
    });
    const {
      mucdich, thamgia, chutriId, thoigianBatdau, thoigianKetthuc, ngayHop, userId, lichCongtacId,
      canCreateMeetingForOthers
    } = this.state;

    if (!mucdich) {
      Toast.show({
        text: 'Vui lòng nhập mục đích',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    else if (!thamgia) {
      Toast.show({
        text: 'Vui lòng nhập thành phần tham dự',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!thoigianBatdau) {
      Toast.show({
        text: 'Vui lòng chọn thời gian bắt đầu',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!thoigianKetthuc) {
      Toast.show({
        text: 'Vui lòng chọn thời gian kết thúc',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!ngayHop) {
      Toast.show({
        text: 'Vui lòng chọn ngày họp',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else {
      this.setState({
        executing: true
      });

      const url = `${API_URL}/api/MeetingRoom/SaveLichhop`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        mucdich,
        thamgia,
        ngayHop,
        gioBatdau: thoigianBatdau.split(":")[0],
        phutBatdau: thoigianBatdau.split(":")[1],
        gioKetthuc: thoigianKetthuc.split(":")[0],
        phutKetthuc: thoigianKetthuc.split(":")[1],
        chutriId: canCreateMeetingForOthers ? chutriId : userId,
        userId,
        lichCongtacId,
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
              from: "createMeetingDay",
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
            {
              canCreateMeetingForOthers && <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }]}>
                <Label>
                  Người chủ trì <Text style={{ color: '#f00' }}>*</Text>
                </Label>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: "space-around" }}>
                  <Button transparent style={{ width: chutriId > 0 ? '100%' : '90%' }} onPress={() => this.onPickChutri()}>
                    {
                      !chutriName
                        ? <Text style={{ color: '#ccc' }}>Chọn người chủ trì</Text>
                        : <Text style={{ color: Colors.BLACK }}>{chutriName}</Text>
                    }
                  </Button>
                  {
                    chutriId > 0 && <Button transparent onPress={() => this.clearNguoiChutri()}>
                      <Icon name="ios-close-circle" style={{ marginTop: 0, alignSelf: 'center', color: Colors.RED_PANTONE_186C }} />
                    </Button>
                  }
                </View>
              </Item>
            }

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Ngày họp <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={ngayHop}
                mode="date"
                placeholder='Chọn ngày họp'
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
                onDateChange={this.handleChange("ngayHop")}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian bắt đầu <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={thoigianBatdau}
                mode="time"
                placeholder='Chọn thời gian bắt đầu'
                // format='HH:MM'
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
                onDateChange={this.handleChange("thoigianBatdau")}
              />
            </Item>

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian dự kiến kết thúc <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={thoigianKetthuc}
                mode="time"
                placeholder='Chọn thời gian dự kiến kết thúc'
                // format='HH:MM'
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
                onDateChange={this.handleChange("thoigianKetthuc")}
              />
            </Item>

            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "thamgia" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Thành phần tham dự
              </Label>

              <Input
                value={thamgia}
                onChangeText={this.handleChange("thamgia")}
                onFocus={() => this.setState({ focusId: "thamgia" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>

            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "phonghopId" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Phòng họp
              </Label>

              <View style={{ width: '100%', flexDirection: 'row', justifyContent: "space-around" }}>
                <Button transparent style={{ width: phonghopId > 0 ? '100%' : '90%' }} onPress={() => this.onPickPhonghop()}>
                  {
                    !!phonghopName
                      ? <Text style={{ color: '#ccc' }}>Chọn phòngh họp</Text>
                      : <Text style={{ color: Colors.BLACK }}>{phonghopName}</Text>
                  }
                </Button>
                {
                  phonghopId > 0 && <Button transparent onPress={() => this.clearPhonghop()}>
                    <Icon name="ios-close-circle" style={{ marginTop: 0, alignSelf: 'center', color: Colors.RED_PANTONE_186C }} />
                  </Button>
                }
              </View>
            </Item>

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
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÊM MỚI LỊCH HỌP
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveLichhop()} style={headerSubmitButtonStyle} disabled={nothingChangeStatus}>
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