/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, Image,
  ImageBackground, Modal,
  TouchableOpacity, StatusBar, FlatList, RefreshControl, ActivityIndicator
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Agenda } from 'react-native-calendars';
import CalendarStrip from 'react-native-calendar-strip';
import 'moment/locale/vi';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../redux/modules/Nav/Action';
//native-base
import {
  Container, Header, Content,
  Left, Right, Body, Title, Footer, FooterTab, Badge, Button, Icon as NBIcon, Subtitle, Toast
} from 'native-base';

import { ListItem, Icon } from 'react-native-elements';
import renderIf from 'render-if';

import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import { NativeBaseStyle } from '../../assets/styles/NativeBaseStyle';

import * as SBIcons from '../../assets/styles/SideBarIcons';

import Panel from './Panel';
import GridPanel from './GridPanel';
import Confirm from './Confirm';
import { width, Colors, SIDEBAR_CODES, DM_FUNCTIONS, EMPTY_STRING, SYSTEM_FUNCTION, API_URL } from '../../common/SystemConstant';
import Images from '../../common/Images';
// import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale, indicatorResponsive } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
import { GridPanelStyle } from '../../assets/styles/GridPanelStyle';
import { convertDateTimeToTitle, emptyDataPage, convertDateToString, _readableFormat } from '../../common/Utilities';
import { ListNotificationStyle } from '../../assets/styles/ListNotificationStyle';
import { DashboardStyle } from '../../assets/styles/DashboardStyle';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN } = DM_FUNCTIONS;
const { LichCongTacFunction } = SYSTEM_FUNCTION;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userInfo: {},
      onFocusNow: '',
      notifyCount: 0,
      userFunctions: [],
      notiData: [],
      calendarData: [],
      calendarDate: "",
      calendarLoading: false,
    }
  }

  async componentWillMount() {
    const storageUserInfo = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(storageUserInfo);
    this.setState({
      userInfo,
      onFocusNow: userInfo.hasRoleAssignUnit ? VANBANDI._CHUAXULY : VANBANDEN._CHUAXULY,
      notifyCount: userInfo.numberUnReadMessage,
      userFunctions: userInfo.GroupUserFunctions
    }, () => {
      this.fetchRecentNoti();
      this.fetchCalendarData(new Date());
    });
  }

  fetchCalendarData = async (selectedDate) => {
    this.setState({
      calendarLoading: true
    });

    const date = convertDateToString(selectedDate);
    const day = date.split('/')[0];
    const month = date.split('/')[1];
    const year = date.split('/')[2];

    const url = `${API_URL}/api/LichCongTac/GetLichCongTacNgay/${this.state.userInfo.ID}/${month}/${year}/${day}`;

    const result = await fetch(url)
      .then((response) => response.json());
    this.setState({
      calendarLoading: false,
      calendarData: result
    });
  }
  onPressCalendar = (eventId = 0) => {
    if (eventId > 0) {
      this.props.navigation.navigate("DetailEventScreen", { id: eventId });
    }
    else {
      Toast.show({
        text: 'Không tìm thấy lịch công tác yêu cầu',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
  }

  fetchRecentNoti = async () => {
    const url = `${API_URL}/api/Account/GetMessagesOfUser/${this.state.userInfo.ID}/3/1/false?query=`;
    const resource = await fetch(url);
    const result = await resource.json();

    this.setState({
      notiData: result
    });
  }
  onPressNotificationItem = async (item) => {
    //update read state for unread noti
    if (!item.IS_READ) {
      const url = `${API_URL}/api/account/UpdateReadStateOfMessage`;
      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
      const body = JSON.stringify({
        item
      });
      const result = await fetch(url, {
        method: 'POST',
        headers,
        body
      });
    }

    //navigate to detail
    let screenName = EMPTY_STRING;
    let screenParam = {};

    let outOfSwitch = false;
    if (item.URL) {
      let urlArr = item.URL.split("/");
      const itemType = urlArr[2];
      const itemId = +urlArr[3].split("&").shift().match(/\d+/gm);
      switch (itemType) {
        case "HSVanBanDi":
          screenName = "VanBanDiDetailScreen";
          screenParam = {
            docId: itemId,
            docType: "1"
          };
          break;
        case "QuanLyCongViec":
          screenName = "DetailTaskScreen";
          screenParam = {
            taskId: urlArr[4],
            taskType: "1"
          };
          break;
        case "HSCV_VANBANDEN":
          screenName = "VanBanDenDetailScreen";
          screenParam = {
            docId: itemId,
            docType: "1"
          };
          break;
        case "QL_LICHHOP":
          screenName = "DetailMeetingDayScreen";
          screenParam = {
            lichhopId: itemId,
          };
          break;
        case "QL_DANGKY_XE":
          screenName = "DetailCarRegistrationScreen";
          screenParam = {
            registrationId: itemId,
          };
          break;
        case "QL_CHUYEN":
          screenName = "DetailTripScreen";
          screenParam = {
            tripId: itemId,
          };
          break;
        default:
          outOfSwitch = true;
          break;
      }
    }
    else {
      outOfSwitch = true;
    }

    if (outOfSwitch) {
      Toast.show({
        text: 'Bạn không có quyền truy cập vào thông tin này!',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    this.props.updateCoreNavParams(screenParam);
    this.props.navigation.navigate(screenName);
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  navigate(screenName) {
    this.props.navigation.push(screenName);
  }

  onLogOut() {
    this.refs.confirm.showModal();
  }

  setCurrentFocus(screenName, ref, actionCode = EMPTY_STRING) {
    this.setState({
      onFocusNow: ref,
      notifyCount: 0
    });
    // check authorize
    if (actionCode.includes("UYQUYEN")) {
      this.props.updateAuthorization(1);
    }
    else {
      this.props.updateAuthorization(0);
    }
    // Reset Route
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: screenName })] // navigate
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate(screenName);
  }

  generateTitle(maThaotac) {
    let tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
    switch (maThaotac) {
      case VANBANDEN._CHUAXULY.NAME:
        tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
        break;
      case VANBANDEN._DAXULY.NAME:
        tenThaotac = VANBANDEN._DAXULY.MOBILENAME;
        break;
      case VANBANDEN._NOIBO_CHUAXULY.NAME:
        tenThaotac = VANBANDEN._NOIBO_CHUAXULY.MOBILENAME;
        break;
      case VANBANDEN._NOIBO_DAXULY.NAME:
        tenThaotac = VANBANDEN._NOIBO_DAXULY.MOBILENAME;
        break;
      case VANBANDEN._THAMGIA_XULY.NAME:
        tenThaotac = VANBANDEN._THAMGIA_XULY.MOBILENAME;
        break;

      case VANBANDI._CHUAXULY.NAME:
        tenThaotac = VANBANDI._CHUAXULY.MOBILENAME;
        break;
      case VANBANDI._DAXULY.NAME:
        tenThaotac = VANBANDI._DAXULY.MOBILENAME;
        break;
      case VANBANDI._DA_BANHANH.NAME:
        tenThaotac = VANBANDI._DA_BANHANH.MOBILENAME;
        break;
      case VANBANDI._THAMGIA_XULY.NAME:
        tenThaotac = VANBANDI._THAMGIA_XULY.MOBILENAME;
        break;

      case CONGVIEC._CANHAN.NAME:
        tenThaotac = CONGVIEC._CANHAN.MOBILENAME;
        break;
      case CONGVIEC._DUOCGIAO.NAME:
        tenThaotac = CONGVIEC._DUOCGIAO.MOBILENAME;
        break;
      case CONGVIEC._PHOIHOPXULY.NAME:
        tenThaotac = CONGVIEC._PHOIHOPXULY.MOBILENAME;
        break;
      case CONGVIEC._PROCESSED_JOB.NAME:
        tenThaotac = CONGVIEC._PROCESSED_JOB.MOBILENAME;
        break;

      case LICHCONGTAC_LANHDAO._DANHSACH.NAME:
        tenThaotac = LICHCONGTAC_LANHDAO._DANHSACH.MOBILENAME;
        break;

      case QUANLY_UYQUYEN._DANHSACH.NAME:
        tenThaotac = QUANLY_UYQUYEN._DANHSACH.MOBILENAME;
        break;

      default:
        break;
    }
    return tenThaotac.charAt(0).toUpperCase() + tenThaotac.slice(1).toLowerCase();
  }

  render() {
    // console.tron.log(this.state.userInfo)
    const { notifyCount, userFunctions, onFocusNow } = this.state;
    const subItemIcon = <Image source={Images.subItemIconLink} />;
    const mainItemIcon = <Icon name='chevron-right' type='entypo' size={verticalScale(30)} color={Colors.GRAY} />
    let notificationIcon = <View></View>;
    
    if (notifyCount > 0 && notifyCount < 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={SideBarStyle.chatNotificationCircle}>
          <Text style={SideBarStyle.chatNotificationText}>
            {notifyCount}
          </Text>
        </View>
      </View>
    }
    if (notifyCount >= 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, { width: moderateScale(25), height: moderateScale(25), borderRadius: moderateScale(25 / 2) }]}>
          <Text style={SideBarStyle.chatNotificationText}>
            99+
                </Text>
        </View>
      </View>
    }

    return (
      <View style={SideBarStyle.container}>
        <StatusBar barStyle="light-content" />
        <Header style={{ backgroundColor: Colors.LITE_BLUE, borderBottomWidth: 0, height: 120, paddingTop: 35 }}>
          <Left style={{ flex: 5, paddingLeft: 20, alignSelf: "flex-start" }}>
            <Text style={{ color: Colors.WHITE }}>
              <Text style={{ fontStyle: "italic" }}>Xin chào,</Text> <Text style={{ fontWeight: "bold" }}>{this.state.userInfo.Fullname}</Text>
            </Text>
          </Left>
          <Body />
          <Right style={{ flex: 1, alignSelf: "flex-start" }}>
            <TouchableOpacity onPress={() => this.onLogOut()} style={{ marginRight: 20 }}>
              <Icon name="power" size={moderateScale(20, 1.2)} color={Colors.WHITE} type="material-community" />
            </TouchableOpacity>
          </Right>
          {
            // <Left style={[NativeBaseStyle.left, SideBarStyle.headerAvatarContainer, { flex: 1, paddingLeft: 0 }]}>
            //   <Image source={Images.logo} style={SideBarStyle.headerAvatar} />
            // </Left>

            // <Body style={[NativeBaseStyle.body, { flex: 4 }]}>
            //   <Title style={SideBarStyle.headerUserName}>
            //     {this.state.userInfo.Fullname}
            //   </Title>
            //   <Subtitle style={SideBarStyle.headerUserJob}>
            //     {this.state.userInfo.Position}
            //   </Subtitle>
            // </Body>
            // <Right style={NativeBaseStyle.right}>
            //   <TouchableOpacity onPress={() => this.onLogOut()} style={{ marginRight: 20 }}>
            //     <Icon name="power" size={moderateScale(20, 1.2)} color={Colors.WHITE} type="material-community" />
            //   </TouchableOpacity>
            // </Right>
          }
        </Header>

        <View
          style={{ flex: 1, backgroundColor: Colors.WHITE, borderRadius: 10, marginHorizontal: moderateScale(8, 1.2), marginTop: -50, borderColor: '#ccc', borderWidth: .7 }}
        // source={Images.banner_top} 
        // imageStyle={{ resizeMode: 'cover', opacity: 0.7 }}
        >
          <View style={SideBarStyle.shortcutBoxContainer}>
            <TouchableOpacity onPress={() => this.setCurrentFocus("VanBanDenIsNotProcessScreen")} style={[SideBarStyle.shortcutBoxStyle]}>
              <SideBarIcon
                actionCode={VANBANDEN._CHUAXULY.NAME}
                customIconContainerStyle={SideBarStyle.customIconContainerStyle}
                isHotPick
              // customIconImageStyle={{height: "50%"}}
              // customIconImageStyle={SideBarStyle.customIconImageStyle}
              />
              <Text style={SideBarStyle.shortcutBoxTextStyle}>Văn bản đến</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setCurrentFocus("VanBanDiIsNotProcessScreen")} style={[SideBarStyle.shortcutBoxStyle]}>
              <SideBarIcon
                actionCode={VANBANDI._CHUAXULY.NAME}
                customIconContainerStyle={SideBarStyle.customIconContainerStyle}
                isHotPick
              // customIconImageStyle={{height: "100%"}}
              />
              <Text style={SideBarStyle.shortcutBoxTextStyle}>Văn bản đi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setCurrentFocus("ListPersonalTaskScreen")} style={[SideBarStyle.shortcutBoxStyle]}>
              <SideBarIcon
                actionCode={CONGVIEC._CANHAN.NAME}
                customIconContainerStyle={SideBarStyle.customIconContainerStyle}
                isHotPick
              // customIconImageStyle={{height: "100%"}}
              // customIconImageStyle={SideBarStyle.customIconImageStyle}
              />
              <Text style={SideBarStyle.shortcutBoxTextStyle}>Công việc</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("KeyFunction")} style={[SideBarStyle.shortcutBoxStyle]}>
              <SideBarIcon
                actionCode={LICHCONGTAC_LANHDAO._DANHSACH.NAME}
                customIconContainerStyle={SideBarStyle.customIconContainerStyle}
                isHotPick
              // customIconImageStyle={{height: "100%"}}
              // customIconImageStyle={SideBarStyle.customIconImageStyle}
              />
              <Text style={SideBarStyle.shortcutBoxTextStyle}>Tiện ích</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[SideBarStyle.body, { paddingBottom: moderateScale(12, 1.2) }]}>
          <ScrollView
            contentContainerStyle={{ paddingTop: moderateScale(12, 1.2) }}
          >
            <View style={{ backgroundColor: Colors.WHITE, borderTopWidth: .7, borderTopColor: '#ccc' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ backgroundColor: Colors.NOT_READ, padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 15 }}>
                  <Text style={{ textAlign: "center", color: Colors.WHITE, fontWeight: "bold", fontSize: moderateScale(12, 1.16) }}>Thông báo</Text>
                </View>
              </View>
              {
                this.state.notiData.length > 0
                  ? this.state.notiData.map((item, index) => {
                    let thisBGColor = Colors.WHITE;
                    let itemType = item.URL.split('/')[2],
                      badgeBackgroundColor = Colors.GRAY,
                      leftTitle = "CV";
                    //TODO: Replace itemType with userRole (shortname)
                    switch (itemType) {
                      case "HSVanBanDi":
                        badgeBackgroundColor = '#4FC3F7';
                        leftTitle = "VBTK"
                        break;
                      case "QuanLyCongViec":
                        badgeBackgroundColor = '#4DB6AC';
                        leftTitle = "CV";
                        break;
                      case "HSCV_VANBANDEN":
                        badgeBackgroundColor = '#5C6BC0';
                        leftTitle = "VBĐ";
                        break;
                      case "QL_LICHHOP":
                        badgeBackgroundColor = Colors.RANDOM_COLOR_1;
                        leftTitle = "LH";
                        break;
                      case "QL_DANGKY_XE":
                        badgeBackgroundColor = Colors.RANDOM_COLOR_2;
                        leftTitle = "DKX";
                        break;
                      case "QL_CHUYEN":
                        badgeBackgroundColor = Colors.DANK_BLUE;
                        leftTitle = "CX";
                        break;
                    }

                    let noidungArchor = item.NOIDUNG.indexOf("đã"),
                      noidungSender = item.NOIDUNG.slice(0, noidungArchor - 1),
                      noidungMessage = item.NOIDUNG.slice(noidungArchor);

                    let checkReadFont = item.IS_READ ? 'normal' : 'bold',
                      checkReadColor = item.IS_READ ? Colors.HAS_DONE : Colors.NOT_READ;

                    if (index % 2 !== 0) {
                      thisBGColor = Colors.LIGHT_GRAY_PASTEL;
                    }
                    return (
                      <ListItem
                        key={index.toString()}
                        containerStyle={{ backgroundColor: thisBGColor, borderBottomColor: "#ccc" }}
                        leftIcon={
                          <View style={[ListNotificationStyle.leftTitleCircle, { backgroundColor: badgeBackgroundColor }]}>
                            <Text style={ListNotificationStyle.leftTitleText}>
                              {
                                // item.NOTIFY_ITEM_TYPE == THONGBAO_CONSTANT.CONGVIEC ? "CV" : "VB"
                                leftTitle
                              }
                            </Text>
                          </View>
                        }
                        hideChevron={true}
                        title={
                          <Text style={[ListNotificationStyle.title, { fontWeight: checkReadFont, color: checkReadColor }]}>
                            <Text style={{ fontWeight: 'bold', color: Colors.BLACK }}>{noidungSender}</Text> {noidungMessage}
                          </Text>
                        }
                        titleStyle={ListNotificationStyle.title}
                        titleContainerStyle={{
                          marginHorizontal: '3%',
                        }}
                        titleNumberOfLines={3}
                        rightTitle={convertDateTimeToTitle(item.NGAYTAO, true)}
                        rightTitleNumberOfLines={2}
                        rightTitleStyle={{
                          textAlign: 'center',
                          color: Colors.DARK_GRAY,
                          fontSize: moderateScale(12, 0.9),
                          fontStyle: 'italic',
                          fontWeight: checkReadFont,
                        }}
                        rightTitleContainerStyle={{
                          flex: 0
                        }}
                        // subtitle={convertDateTimeToTitle(item.NGAYTAO)}
                        onPress={() => this.onPressNotificationItem(item)}
                      />
                    );
                  })
                  : emptyDataPage()
              }

            </View>

            <View style={{ marginTop: moderateScale(10, 1.2), backgroundColor: Colors.WHITE, borderTopWidth: .7, borderTopColor: '#ccc' }}>
              <CalendarStrip
                // locale={{name: "vi"}}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                // daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                style={{ height: 100, paddingTop: 20, paddingBottom: 10, borderBottomColor: '#ccc', borderBottomWidth: 0.7 }}
                calendarHeaderStyle={{ color: Colors.DARK_GRAY, fontSize: moderateScale(12, 1.01) }}
                calendarColor={Colors.WHITE}
                dateNumberStyle={{ color: Colors.BLACK, fontSize: moderateScale(14, 1.2) }}
                dateNameStyle={{ color: Colors.BLACK, fontSize: moderateScale(13, 1.1) }}
                highlightDateNumberStyle={{ color: '#c21421', fontSize: moderateScale(14, 1.2) }}
                highlightDateNameStyle={{ color: '#c21421', fontSize: moderateScale(13, 1.1) }}
                // disabledDateNameStyle={{ color: 'grey' }}
                // disabledDateNumberStyle={{ color: 'grey' }}
                // datesWhitelist={datesWhitelist}
                // datesBlacklist={datesBlacklist}
                // iconLeft={require('./img/left-arrow.png')}
                // iconRight={require('./img/right-arrow.png')}
                iconContainer={{ flex: 0.1 }}
                // showDayNumber={false}
                onDateSelected={(date) => this.fetchCalendarData(date)}
                shouldAllowFontScaling={false}
              />
              {
                this.state.calendarData.length > 0
                  ? this.state.calendarData.map((item, index) => {
                    const {
                      ID, NOIDUNG, TEN_NGUOI_CHUTRI, TEN_VAITRO_CHUTRI, TEN_PHONGBAN_CHUTRI,
                      GIO_CONGTAC, PHUT_CONGTAC, DIADIEM
                    } = item;
                    let ChutriString = "", ChutriArr = [],
                      ThoigianDiadiemString = `${_readableFormat(GIO_CONGTAC)}h${_readableFormat(PHUT_CONGTAC)}${DIADIEM ? ` - ${DIADIEM}` : ""}`;
                    if (TEN_NGUOI_CHUTRI) {
                      ChutriArr.push(TEN_NGUOI_CHUTRI.split(" - ").reverse().join(" "));
                    }
                    if (TEN_VAITRO_CHUTRI) {
                      ChutriArr.push(TEN_VAITRO_CHUTRI);
                    }
                    if (TEN_PHONGBAN_CHUTRI) {
                      ChutriArr.push(TEN_PHONGBAN_CHUTRI);
                    }
                    if (ChutriArr.length > 0) {
                      ChutriString = ChutriArr.join(", ");
                    }

                    return (
                      <ListItem
                        key={index.toString()}
                        containerStyle={{ backgroundColor: Colors.WHITE, borderBottomColor: "#ccc", padding: moderateScale(8, 1.5) }}
                        hideChevron
                        title={
                          <Text style={[ListNotificationStyle.title]}>
                            <Text style={{ fontWeight: 'bold', color: Colors.GRAY }}>{ThoigianDiadiemString} / Chủ trì: {ChutriString}</Text>
                          </Text>
                        }
                        subtitle={
                          <Text style={[ListNotificationStyle.title, { marginTop: 8 }]}>
                            <Text>{NOIDUNG}</Text>
                          </Text>
                        }
                        onPress={() => this.onPressCalendar(ID)}
                      />
                    );
                  })
                  : emptyDataPage()
              }
              {
                this.state.calendarLoading && <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
              }
            </View>
          </ScrollView>
        </View>

        <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);