/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, Image,
  ImageBackground, Modal,
  TouchableOpacity, StatusBar
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Agenda } from 'react-native-calendars';

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
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
import { GridPanelStyle } from '../../assets/styles/GridPanelStyle';
import { convertDateTimeToTitle } from '../../common/Utilities';
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
    }, () => this.fetchRecentNoti());
  }

  fetchRecentNoti = async () => {
    const url = `${API_URL}/api/Account/GetMessagesOfUser/${this.state.userInfo.ID}/3/1?query=`;
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

    let urlArr = item.URL.split("/");
    const itemType = urlArr[2];
    const itemId = +urlArr[3].split("&").shift().match(/\d+/gm);
    if (itemType === "HSVanBanDi") {
      screenName = "VanBanDiDetailScreen";
      screenParam = {
        docId: itemId,
        docType: "1"
      }
    }
    else if (itemType === "QuanLyCongViec") {
      screenName = "DetailTaskScreen";
      screenParam = {
        taskId: urlArr[4],
        taskType: "1"
      }
    }
    else if (itemType === "HSCV_VANBANDEN") {
      screenName = "VanBanDenDetailScreen";
      screenParam = {
        docId: itemId,
        docType: "1"
      }
    }
    else {
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

  // componentDidMount() {
  //   this._navListener = this.props.navigation.addListener('didFocus', () => {
  //     StatusBar.setBarStyle('dark-content');
  //     // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
  //   });
  // }

  // componentWillUnmount() {
  //   this._navListener.remove();
  // }

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

        <ImageBackground
          style={{ flex: 1, backgroundColor: Colors.WHITE, borderRadius: 10, marginHorizontal: moderateScale(8, 1.2), marginTop: -50 }}
          // source={Images.banner_top} 
          imageStyle={{ resizeMode: 'cover', opacity: 0.7 }}
        >
          <View style={SideBarStyle.shortcutBoxContainer}>
            <TouchableOpacity onPress={() => this.setCurrentFocus("VanBanDenIsNotProcessScreen")} style={[SideBarStyle.shortcutBoxStyle]}>
              <SideBarIcon
                actionCode={VANBANDEN._CHUAXULY.NAME}
                customIconContainerStyle={SideBarStyle.customIconContainerStyle}
                isHotPick
              // customIconImageStyle={{height: "100%"}}
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
            <TouchableOpacity onPress={() => this.setCurrentFocus("BaseCalendarScreen")} style={[SideBarStyle.shortcutBoxStyle]}>
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
        </ImageBackground>

        <View style={SideBarStyle.body}>
          <ScrollView contentContainerStyle={{ paddingVertical: moderateScale(12, 1.2) }}>
            <View style={{ backgroundColor: Colors.WHITE }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ backgroundColor: Colors.LITE_BLUE, padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 15 }}>
                  <Text style={{ textAlign: "center", color: Colors.WHITE, fontWeight: "bold" }}>Thông báo</Text>
                </View>
              </View>
              {
                this.state.notiData.length > 0 && this.state.notiData.map((item, index) => {
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
                  }

                  let noidungArchor = item.NOIDUNG.indexOf("đã"),
                    noidungSender = item.NOIDUNG.slice(0, noidungArchor - 1),
                    noidungMessage = item.NOIDUNG.slice(noidungArchor);

                  let checkReadFont = item.IS_READ ? 'normal' : 'bold';
                  if (index % 2 !== 0) {
                    thisBGColor = Colors.LIGHT_GRAY_PASTEL;
                  }
                  return (
                    <ListItem
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
                        <Text style={[ListNotificationStyle.title, { fontWeight: checkReadFont }]}>
                          <Text style={{ fontWeight: 'bold' }}>{noidungSender}</Text> {noidungMessage}
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
              }

            </View>

            
          </ScrollView>
        </View>

        <View style={{flex:3}}>
              <Agenda
                items={{
                  '2019-08-26': [{ text: 'item 1 - any js object' }],
                  '2019-08-27': [{ text: 'item 2 - any js object' }],
                  '2019-08-28': [],
                  '2019-08-29': [{ text: 'item 3 - any js object' }, { text: 'any js object' }]
                }}
                // loadItemsForMonth={this.loadItems.bind(this)}
                selected={'2019-08-28'}
                renderItem={(item, firstItemInDay) => {return (<View />);}}
                renderEmptyDate={() => {return (<View />);}}

                // renderItem={(item) => <View style={[DashboardStyle.item, { height: item.height }]}><Text>{item.name}</Text></View>}
                // renderEmptyDate={() => <View style={DashboardStyle.emptyDate}><Text>This is empty date!</Text></View>}
                rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
              />
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