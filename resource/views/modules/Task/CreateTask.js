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

class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      // taskId: props.coreNavParams.taskId,
      // taskType: props.coreNavParams.taskType,

      docId: props.extendsNavParams.docId || 0,
      docType: props.extendsNavParams.docType || 0,

      title: EMPTY_STRING,
      deadline: null,
      content: EMPTY_STRING,
      startDate: null,
      purpose: EMPTY_STRING,
      listPriority: [],
      listUrgency: [],
      priorityValue: EMPTY_STRING, //độ ưu tiên
      urgencyValue: EMPTY_STRING, //đô khẩn
      planValue: '0', //lập kế hoạch 
      giaoviecId: 0,
      reminderDays: "1",

      executing: false,
      focusId: EMPTY_STRING,
      fromScreen: props.extendsNavParams.originScreen || EMPTY_STRING,
      loading: false,

      listRole: EMPTY_STRING,
      isGiamdoc: false,
      vanbanDenLienquan: {},
      vanbanDiLienquan: {},
      vanbanDiDokhan: EMPTY_STRING,
      vanbanDenId: 0,
      vanbanDiId: 0,
      giaoviecName: null,
    }
  }

  handleChange = fieldName => fieldValue => this.setState({ [fieldName]: fieldValue })

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("giaoviecId")) {
        if (this.props.extendsNavParams.giaoviecId > 0) {
          this.setState({
            giaoviecId: this.props.extendsNavParams.giaoviecId,
            giaoviecName: this.props.extendsNavParams.giaoviecName
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

  onPickTaskAssigner = async () => {
    const targetScreenParam = {
      listRole: this.state.listRole,
      giaoviecId: this.state.giaoviecId,
      giaoviecName: this.state.giaoviecName
    };

    this.onNavigate("PickTaskAssignerScreen", targetScreenParam);
  }

  clearTaskAssigner = () => {
    this.setState({
      giaoviecId: 0,
      giaoviecName: null
    });
  }

  // navigateToVanbanLienquan = (screenName = "") => {
  //   const targetScreenParam = {
  //     docId: this.state.docId,
  //     docType: this.state.docType
  //   };
  //   this.onNavigate(screenName, targetScreenParam);
  // }

  fetchData = async () => {
    this.setState({
      loading: true
    });

    const {
      userId, docId, docType
    } = this.state;

    const url = `${API_URL}/api/HscvCongViec/GetTaskCreationHelper/${userId}/${docType}/${docId}/`;

    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      listPriority: resultJson.ListDoUuTien,
      listUrgency: resultJson.ListDoKhan,
      priorityValue: resultJson.ListDoUuTien[0].Value,
      urgencyValue: resultJson.ListDoKhan[0].Value,
      isGiamdoc: resultJson.IsGiamdoc,
      listRole: resultJson.ListRole,
      vanbanDenLienquan: resultJson.VanbanDenLienquan,
      vanbanDiLienquan: resultJson.VanbanDiLienquan,
      vanbanDenId: resultJson.VanbanDenId,
      vanbanDiId: resultJson.VanbanDiId,
      vanbanDiDokhan: resultJson.VanbanDiDokhan,
    });
  }

  saveTask = async () => {
    const {
      title, deadline, content,
      purpose, priorityValue, urgencyValue, startDate,
      planValue, docId, docType, giaoviecId, userId, reminderDays,
      fromScreen
    } = this.state;

    if (util.isNull(title) || util.isEmpty(title)) {
      Toast.show({
        text: 'Vui lòng nhập nội dung công việc',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    else if (util.isNull(content) || util.isEmpty(content)) {
      Toast.show({
        text: 'Vui lòng nhập nội dung công việc',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else if (util.isNull(deadline) || util.isEmpty(deadline)) {
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

      const url = `${API_URL}/api/HscvCongViec/CreateTask`;

      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      });

      const body = JSON.stringify({
        title,
        purpose,
        content,
        deadline,
        startDate,
        priorityValue,
        urgencyValue,
        planValue: +planValue || 0,
        docId,
        docType,
        giaoviecId,
        userId,
        reminderDays: +reminderDays || 1,
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
            const screenParam = {
              taskId: resultJson.Param,
              taskType: "1"
            };

            this.props.updateCoreNavParams(screenParam);
            this.props.navigation.navigate("DetailTaskScreen");
            // if (fromScreen === "DashboardScreen") {
            //   // this.props.navigation.navigate("ListPersonalTaskScreen");
            //   this.navigateBack();
            // }
            // else {
            //   this.props.updateExtendsNavParams({ check: true });
            //   this.navigateBack();
            // }
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
        title, content, deadline,
        purpose, priorityValue, urgencyValue, startDate, reminderDays,
        vanbanDenId, vanbanDiId, fromScreen, loading, giaoviecName, giaoviecId,
        focusId, isGiamdoc
      } = this.state,
      nothingChangeStatus = !title || !content || !deadline,
      submitableButtonBackground = !nothingChangeStatus ? { backgroundColor: Colors.LITE_BLUE } : { backgroundColor: Colors.LIGHT_GRAY_PASTEL },
      submitableButtonTextColor = !nothingChangeStatus ? { color: Colors.WHITE } : { color: Colors.DARK_GRAY },
      headerSubmitButtonStyle = !nothingChangeStatus ? { opacity: 1 } : { opacity: 0.6 };

    let relateDoc = null;
    if (vanbanDenId > 0) {
      const {
        SOHIEU, TRICHYEU, NGUOIKY
      } = this.state.vanbanDenLienquan;
      relateDoc = (
        <ListItem
          style={DetailTaskStyle.listItemContainer}
          hideChevron={true}
          title={
            <Text style={DetailTaskStyle.listItemTitleContainer}>Văn bản đến liên quan</Text>
          }
          subtitle={
            <Text style={[DetailTaskStyle.listItemSubTitleContainer, { color: '#262626' }]}>
              <Text>{`Số hiệu: ${SOHIEU}` + "\n"}</Text>
              <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
              <Text>{`Người ký: ${NGUOIKY}`}</Text>
            </Text>
          }
          // onPress={() => this.navigateToVanbanLienquan("VanBanDenDetailScreen")}
          containerStyle={{ backgroundColor: 'rgba(189,198,207, 0.6)' }}
        />
      );
    }
    else if (vanbanDiId > 0) {
      const {
        TRICHYEU, TEN_NGUOIKY
      } = this.state.vanbanDiLienquan;
      relateDoc = (
        <ListItem
          style={DetailTaskStyle.listItemContainer}
          hideChevron={true}
          title={
            <Text style={DetailTaskStyle.listItemTitleContainer}>Văn bản đi liên quan</Text>
          }
          subtitle={
            <Text style={[DetailTaskStyle.listItemSubTitleContainer, { color: '#262626' }]}>
              <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
              <Text>{`Người ký: ${TEN_NGUOIKY}` + "\n"}</Text>
              <Text>{`Độ khẩn: ${this.state.vanbanDiDokhan}`}</Text>
            </Text>
          }
          // onPress={
          //   () => this.navigateToVanbanLienquan("VanBanDiDetailScreen")
          // }
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
        <ScrollView contentContainerStyle={[{ margin: 5, padding: 5 }]}>
          <Form>
            {
              (this.state.vanbanDenId > 0 || this.state.vanbanDiId > 0) && relateDoc
            }
            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "title" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Tên công việc <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Input
                value={title}
                onChangeText={this.handleChange("title")}
                onFocus={() => this.setState({ focusId: "title" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />
            </Item>
            {
              isGiamdoc === false && <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }]}>
                <Label>
                  Người giao việc
                </Label>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: "space-around" }}>
                  <Button transparent style={{ width: giaoviecId > 0 ? '100%' : '90%' }} onPress={() => this.onPickTaskAssigner()}>
                    {
                      !giaoviecName
                        ? <Text style={{ color: '#ccc' }}>Chọn người giao việc</Text>
                        : <Text style={{ color: Colors.BLACK }}>{giaoviecName}</Text>
                    }
                  </Button>
                  {
                    giaoviecId > 0 && <Button transparent onPress={() => this.clearTaskAssigner()}>
                      <Icon name="ios-close-circle" style={{ marginTop: 0, alignSelf: 'center', color: Colors.RED_PANTONE_186C }} />
                    </Button>
                  }
                </View>
              </Item>
            }

            <Item stackedLabel style={{ marginRight: verticalScale(18) }}>
              <Label>Độ ưu tiên</Label>
              <Picker
                iosHeader='Chọn độ ưu tiên'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat(), justifyContent: 'space-around' }}
                selectedValue={priorityValue} //sai chinh ta @@
                onValueChange={this.handleChange("priorityValue")}>
                {
                  this.state.listPriority.map((item, index) => (
                    <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                  ))
                }
              </Picker>
            </Item>

            <Item stackedLabel style={{ marginRight: verticalScale(18) }}>
              <Label>Mức độ quan trọng</Label>
              <Picker
                iosHeader='Chọn mức quan trọng'
                mode='dropdown'
                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                style={{ width: pickerFormat(), justifyContent: 'space-around' }}
                selectedValue={urgencyValue}
                onValueChange={this.handleChange("urgencyValue")}>
                {
                  this.state.listUrgency.map((item, index) => (
                    <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                  ))
                }
              </Picker>
            </Item>

            {
              //   <Item stackedLabel>
              //   <Label>Lập kế hoạch</Label>
              //   <Picker
              //     iosHeader='Chọn mức quan trọng'
              //     mode='dropdown'
              //     iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
              //     style={{ width: pickerFormat() }}
              //     // itemTextStyle={{marginHorizontal:20}}
              //     // itemStyle={{marginHorizontal:40}}
              //     selectedValue={this.state.planValue}
              //     onValueChange={this.handleChange("planValue")}>
              //     <Picker.Item value="1" label="Có" />
              //     <Picker.Item value="0" label="Không" />
              //   </Picker>
              // </Item>
            }

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Ngày nhận việc</Label>
              <DatePicker
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={startDate}
                mode="date"
                placeholder='Chọn ngày nhận việc'
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

            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center', marginHorizontal: verticalScale(18) }}>
              <Label>Hạn hoàn thành <Text style={{ color: '#f00' }}>*</Text></Label>
              <DatePicker
                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                date={deadline}
                mode="date"
                placeholder='Chọn hạn hoàn thành'
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
                onDateChange={this.handleChange("deadline")}
              />
            </Item>

            <Item stackedLabel style={[{ marginHorizontal: verticalScale(18) }, focusId === "reminderDays" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}>
              <Label>
                Nhắc việc trước (ngày)
              </Label>

              <Input
                style={{ textAlign: 'center' }}
                value={reminderDays}
                onChangeText={this.handleChange("reminderDays")}
                onFocus={() => this.setState({ focusId: "reminderDays" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                keyboardType="number-pad"
              />
            </Item>

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Nội dung <Text style={{ color: '#f00' }}>*</Text>
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={this.state.content}
                onChangeText={this.handleChange("content")}
                style={[{ width: '100%', marginTop: 20 }, focusId === "content" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "content" })}
                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
              />

            </Item>

            <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
              <Label>
                Mục tiêu
              </Label>

              <Textarea
                rowSpan={3}
                bordered
                value={purpose}
                onChangeText={this.handleChange("purpose")}
                style={[{ width: '100%', marginTop: 20 }, focusId === "purpose" ? focusTextboxBorderStyle : blurTextboxBorderStyle]}
                onFocus={() => this.setState({ focusId: "purpose" })}
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
        </ScrollView>
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
              THÊM MỚI CÔNG VIỆC
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveTask()} style={headerSubmitButtonStyle} disabled={nothingChangeStatus}>
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