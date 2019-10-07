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

class CreateRegistration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserId: props.userInfo.ID,

      canboId: 0,
      lichCongtacId: props.extendsNavParams.lichCongtacId || 0,
      mucdich: EMPTY_STRING,
      noidung: EMPTY_STRING,
      ngayXP: props.extendsNavParams.ngayXP || EMPTY_STRING,
      gioXP: 0,
      phutXP: 0,
      diemXP: EMPTY_STRING,
      diemKT: EMPTY_STRING,
      songuoi: "1",
      ghichu: EMPTY_STRING,

      canboName: EMPTY_STRING,
      executing: false,
      focusId: EMPTY_STRING,
      fromScreen: props.extendsNavParams.originScreen || EMPTY_STRING,
      loading: false,
      baseListCanbo: [],
      noidungLich: props.extendsNavParams.noidungLich || EMPTY_STRING,
      isVanthu: false,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("canboId")) {
        if (this.props.extendsNavParams.canboId > 0) {
          this.setState({
            canboId: this.props.extendsNavParams.canboId,
            canboName: this.props.extendsNavParams.canboName
          });
        }
      }
    });
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  fetchData = async () => {
    this.setState({
      loading: true
    });

    const url = `${API_URL}/api/CarRegistration/CreateCarRegistration/${this.state.currentUserId}`;

    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      loading: false,
      isVanthu: resultJson.Status || false
    });
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onPickCanbo = async () => {
    const targetScreenParam = {
      listCanbo: this.state.baseListCanbo,
      canboId: this.state.canboId,
      canboName: this.state.canboName
    };

    this.onNavigate("PickCanboScreen", targetScreenParam);
  }

  clearTaskAssigner = () => {
    this.setState({
      canboId: 0,
      canboName: null
    });
  }

  // navigateToVanbanLienquan = (screenName = "") => {
  //   const targetScreenParam = {
  //     docId: this.state.docId,
  //     docType: this.state.docType
  //   };
  //   this.onNavigate(screenName, targetScreenParam);
  // }

  saveRegistration = async () => {
    const {
      mucdich, noidung, canboId, ngayXP, diemKT, diemXP, songuoi, ghichu, currentUserId,
      lichCongtacId, isVanthu
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
    else if (!noidung) {
      Toast.show({
        text: 'Vui lòng nhập nội dung',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!ngayXP) {
      Toast.show({
        text: 'Vui lòng chọn thời gian xuất phát',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!diemXP) {
      Toast.show({
        text: 'Vui lòng chọn điểm xuất phát',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (!diemKT) {
      Toast.show({
        text: 'Vui lòng chọn điểm kết thúc',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else {
      this.setState({
        executing: true
      });

      const url = `${API_URL}/api/CarRegistration/SaveCarRegistration`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        mucdich,
        noidung,
        ngayXP: ngayXP.split(" ")[0],
        gioXP: ngayXP.split(" ")[1].split(":")[0],
        phutXP: ngayXP.split(" ")[1].split(":")[1],
        diemXP,
        diemKT,
        songuoi: +songuoi || 1,
        ghichu,
        canboId: isVanthu ? canboId : currentUserId,
        currentUserId,
        lichCongtacId
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
        text: resultJson.Status ? 'Đăng ký xe thành công' : 'Đăng ký xe thất bại',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
        duration: 3000,
        onClose: () => {
          if (resultJson.Status) {
            const screenParam = {
              registrationId: resultJson.Params
            };

            this.props.updateCoreNavParams(screenParam);
            this.props.navigation.navigate("DetailCarRegistrationScreen");
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
        mucdich, noidung, canboId, ngayXP, diemKT, diemXP, songuoi, ghichu,
        loading, focusId, canboName, lichCongtacId, noidungLich, isVanthu
      } = this.state,
      nothingChangeStatus = !mucdich || !noidung || !ngayXP || !diemKT || !diemXP,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY },
      headerSubmitButtonStyle = !nothingChangeStatus ? { opacity: 1 } : { opacity: 0.6 };

    let relateCalendar = null;
    if (lichCongtacId > 0) {
      relateCalendar = (
        <ListItem
          style={DetailTaskStyle.listItemContainer}
          hideChevron={true}
          title={
            <Text style={DetailTaskStyle.listItemTitleContainer}>Lịch công tác liên quan</Text>
          }
          subtitle={
            <Text style={[DetailTaskStyle.listItemSubTitleContainer, { color: '#262626', marginTop: 5 }]}>
              <Text>{`Ngày công tác: ${ngayXP}` + "\n"}</Text>
              <Text>{`Nội dung: ${formatLongText(noidungLich, 50)}`}</Text>
            </Text>
          }
          // onPress={() => this.navigateToVanbanLienquan("VanBanDenDetailScreen")}
          containerStyle={{ backgroundColor: 'rgba(189,198,207, 0.6)' }}
        />
      );
    }

    let bodyContent = null;
    if (loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <KeyboardAwareScrollView contentContainerStyle={{ margin: 5, padding: 5 }}>
          <Form style={{ marginVertical: 10 }}>
            {
              lichCongtacId > 0 && relateCalendar
            }
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "mucdich" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Mục đích <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={mucdich}
                onChangeText={this.handleChange("mucdich")}
                onFocus={() => this.setState({ focusId: "mucdich" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>
            {
              isVanthu && <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }]}>
                <Label>
                  Cán bộ đi
                </Label>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: "space-around" }}>
                  <Button transparent style={{ width: canboId > 0 ? '100%' : '90%' }} onPress={() => this.onPickCanbo()}>
                    {
                      !canboName
                        ? <Text style={{ color: '#ccc' }}>Chọn cán bộ</Text>
                        : <Text style={{ color: Colors.BLACK }}>{canboName}</Text>
                    }
                  </Button>
                  {
                    canboId > 0 && <Button transparent onPress={() => this.clearTaskAssigner()}>
                      <Icon name="ios-close-circle" style={{ marginTop: 0, alignSelf: 'center', color: Colors.RED_PANTONE_186C }} />
                    </Button>
                  }
                </View>
              </Item>
            }

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian xuất phát</Label>
              <DatePicker
                locale={"vi"}
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={ngayXP}
                mode="datetime"
                placeholder='Chọn ngày giờ xuất phát'
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
                onDateChange={this.handleChange("ngayXP")}
              />
            </Item>

            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "diemXP" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Điểm xuất phát <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                style={{ textAlign: 'center' }}
                value={diemXP}
                onChangeText={this.handleChange("diemXP")}
                onFocus={() => this.setState({ focusId: "diemXP" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "diemKT" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Điểm kết thúc <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                style={{ textAlign: 'center' }}
                value={diemKT}
                onChangeText={this.handleChange("diemKT")}
                onFocus={() => this.setState({ focusId: "diemKT" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "songuoi" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Số người <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                style={{ textAlign: 'center' }}
                value={songuoi}
                onChangeText={this.handleChange("songuoi")}
                onFocus={() => this.setState({ focusId: "songuoi" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                keyboardType={"number-pad"}
              />
            </Item>

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Nội dung <Text style={{ color: '#f00' }}>*</Text>
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

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Ghi chú
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={ghichu}
                onChangeText={this.handleChange("ghichu")}
                style={[{ width: '100%', marginTop: 20 }, focusId === "ghichu" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "ghichu" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />

            </Item>

            <TouchableOpacity
              onPress={() => this.saveRegistration()}
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
              THÊM MỚI ĐĂNG KÝ XE
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveRegistration()} style={headerSubmitButtonStyle} disabled={nothingChangeStatus}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegistration);

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