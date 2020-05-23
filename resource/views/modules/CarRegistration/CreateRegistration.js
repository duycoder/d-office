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
import { ListItem } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import 'moment/locale/vi';

//utilities
import { EMPTY_STRING, COMMON_COLOR, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading, dataLoading } from '../../../common/Effect';
import { formatLongText, showWarningToast } from '../../../common/Utilities';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import GoBackButton from '../../common/GoBackButton';
import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { carApi } from '../../../common/Api';
import { DatePickerCustomStyle, CustomStylesDatepicker } from '../../../assets/styles';
import { HeaderRightButton, CustomPickerButton } from '../../common';

const api = carApi();

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

      isSaveBtnPressed: true,
      isSaveIcoPressed: true,
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

    const resultJson = await api.getCreateHelper([
      this.state.currentUserId
    ]);

    this.setState({
      loading: false,
      isVanthu: resultJson.Status || false
    });
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onPickCanbo = () => {
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
    this.setState({
      isSaveBtnPressed: false,
      isSaveIcoPressed: false
    });

    const {
      mucdich, noidung, canboId, ngayXP, diemKT, diemXP, songuoi, ghichu, currentUserId,
      lichCongtacId, isVanthu
    } = this.state;

    if (!mucdich) {
      showWarningToast('Vui lòng nhập mục đích', this._toggleSaveState);
    } else if (!noidung) {
      showWarningToast('Vui lòng nhập nội dung', this._toggleSaveState);
    } else if (!ngayXP) {
      showWarningToast('Vui lòng chọn thời gian xuất phát', this._toggleSaveState);
    } else if (!diemXP) {
      showWarningToast('Vui lòng chọn điểm xuất phát', this._toggleSaveState);
    } else if (!diemKT) {
      showWarningToast('Vui lòng chọn điểm kết thúc', this._toggleSaveState);
    } else {
      this.setState({
        executing: true
      });

      const resultJson = await api.saveRegistration({
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

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? 'Đăng ký xe thành công' : 'Đăng ký xe thất bại',
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
        buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            const screenParam = {
              registrationId: resultJson.Params,
              from: "create"
            };

            this.props.updateCoreNavParams(screenParam);
            this.props.navigation.navigate("DetailCarRegistrationScreen");
          }
          else {
            this._toggleSaveState();
          }
        }
      });
    }
  }

  onNavigate = (screenName, targetScreenParam) => {
    this.props.updateExtendsNavParams(targetScreenParam);
    this.props.navigation.navigate(screenName);
  }

  _toggleSaveState() {
    this.setState({
      isSaveBtnPressed: true,
      isSaveIcoPressed: true,
    });
  }

  render() {
    const focusTextboxBorderStyle = { borderColor: COMMON_COLOR.LITE_BLUE, borderBottomWidth: 2 },
      blurTextboxBorderStyle = { borderColor: '#ccc', borderBottomWidth: 2 / 3 },
      {
        mucdich, noidung, canboId, ngayXP, diemKT, diemXP, songuoi, ghichu,
        loading, focusId, canboName, lichCongtacId, noidungLich, isVanthu,
        isSaveBtnPressed, isSaveIcoPressed
      } = this.state,
      nothingChangeStatus = !mucdich || !noidung || !ngayXP || !diemKT || !diemXP || !isSaveBtnPressed || !isSaveIcoPressed,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: COMMON_COLOR.LITE_BLUE } : { backgroundColor: COMMON_COLOR.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: COMMON_COLOR.WHITE } : { color: COMMON_COLOR.DARK_GRAY },
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

            <CustomPickerButton
              isRender={isVanthu}
              labelText='Cán bộ đi'
              placeholderText='Chọn cán bộ'
              valueId={canboId}
              valueName={canboName}
              pickFunc={() => this.onPickCanbo()}
              clearFunc={() => this.clearTaskAssigner()}
            />

            <Item stackedLabel style={{ justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Thời gian xuất phát</Label>
              <DatePicker
                locale={"vi"}
                style={DatePickerCustomStyle.containerStyle}
                date={ngayXP}
                mode="datetime"
                placeholder='Chọn ngày giờ xuất phát'
                format='DD/MM/YYYY HH:mm'
                // minDate={new Date()}
                confirmBtnText='CHỌN'
                cancelBtnText='BỎ'
                customStyles={CustomStylesDatepicker}
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
                rowSpan={5}
                bordered
                value={noidung}
                onChangeText={this.handleChange("noidung")}
                style={[{ width: '100%' }, focusId === "noidung" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "noidung" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />

            </Item>

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Ghi chú
              </Label>

              <Textarea
                rowSpan={5}
                bordered
                value={ghichu}
                onChangeText={this.handleChange("ghichu")}
                style={[{ width: '100%' }, focusId === "ghichu" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
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
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÊM MỚI ĐĂNG KÝ XE
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              onPress={() => this.saveRegistration()}
              iconName='save' iconType='material'
              btnStyle={headerSubmitButtonStyle} btnDisabled={nothingChangeStatus}
            />
          </Right>
        </Header>
        {
          bodyContent
        }
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
