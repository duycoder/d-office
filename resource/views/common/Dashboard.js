/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, StatusBar, Linking, Dimensions,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import 'moment/locale/vi';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../redux/modules/Nav/Action';
//native-base
import { Header, Left, Right, Body } from 'native-base';
import { Icon } from 'react-native-elements';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';

import Confirm from './Confirm';
import { Colors, DM_FUNCTIONS, EMPTY_STRING } from '../../common/SystemConstant';
// import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

import { emptyDataPage, convertDateToString, _readableFormat, isArray, showWarningToast } from '../../common/Utilities';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { HeaderMenuStyle } from '../../assets/styles';
import { accountApi } from '../../common/Api';
import { HotPickButton, BirthdayNoti, AuthorizeNoti, CalendarItem, RecentNoti } from './DashboardCommon/index';
import { dataLoading } from '../../common/Effect';
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO } = DM_FUNCTIONS;

const api = accountApi();

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

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
      notiLoading: false,
      isRefreshNotiList: false,

      //notifyCount
      notifyCount_VBDen_Chuaxuly: 0,
      notifyCount_VBDi_Chuaxuly: 0,
      notifyCount_CV_Canhan: 0,

      notifyCount_Lichhop: 0,
      notifyCount_Datxe: 0,
      notifyCount_Chuyenxe: 0,
      notifyCount_Uyquyen: 0,
      notifyCount_Lichtruc: 0,
      notifyCount_Nhacviec: 0,

      birthdayData: null,
      dataUyQuyen: [],
      dataHotline: [],
      listIds: props.extendsNavParams.listIds || props.coreNavParams.listIds || [],
      orientation: isPortrait() ? 'portrait' : 'landscape',
    };

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
      });
    });
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
      this.fetchNotifyCount();
      this.fetchBirthdayData();
      this.fetchDataUyQuyen();
      this.fetchHotline();
    });
  }

  fetchHotline = async () => {
    const result = await api.getHotline();

    this.setState({
      dataHotline: result
    })
  }

  fetchDataUyQuyen = async () => {
    const result = await api.getDataUyQuyen();

    this.setState({
      dataUyQuyen: result
    })
  }

  fetchBirthdayData = async () => {
    const result = await api.getBirthdayData();

    this.setState({
      birthdayData: result.Params || null
    });
  }

  fetchNotifyCount = async () => {
    const result = await api.getNotifyCount([
      this.state.userInfo.ID
    ]);

    this.setState({
      notifyCount_VBDen_Chuaxuly: result.notifyCount_VBDen_Chuaxuly || 0,
      notifyCount_VBDi_Chuaxuly: result.notifyCount_VBDi_Chuaxuly || 0,
      notifyCount_CV_Canhan: result.notifyCount_CV_Canhan || 0,

      notifyCount_Lichhop: result.notifyCount_Lichhop || 0,
      notifyCount_Datxe: result.notifyCount_Datxe || 0,
      notifyCount_Chuyenxe: result.notifyCount_Chuyenxe || 0,
      notifyCount_Uyquyen: result.notifyCount_Uyquyen || 0,
      notifyCount_Lichtruc: result.notifyCount_Lichtruc || 0,
      notifyCount_Nhacviec: result.notifyCount_Nhacviec || 0,
    })
  }

  fetchCalendarData = async (selectedDate) => {
    this.setState({
      calendarLoading: true
    });

    const date = convertDateToString(selectedDate);
    const day = date.split('/')[0];
    const month = date.split('/')[1];
    const year = date.split('/')[2];

    const result = await api.getCalendarData([
      this.state.userInfo.ID,
      month,
      year,
      day
    ]);

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
      showWarningToast('Không tìm thấy lịch công tác yêu cầu');
    }
  }

  fetchRecentNoti = async () => {
    this.setState({
      notiLoading: true,
    });

    const result = await api.getRecentNoti([
      this.state.userInfo.ID,
      "3/1/true?query="
    ]);

    this.setState({
      notiLoading: false,
      notiData: result,
    });
  }

  onNavigateToScreen = (screenName = '', screenParam = {}) => {
    this.props.updateCoreNavParams(screenParam);
    this.props.navigation.navigate(screenName);
  }
  checkRefreshNotiList = () => {
    this.setState({
      isRefreshNotiList: true,
    });
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      this.fetchNotifyCount();
      if (this.state.isRefreshNotiList) {
        this.setState({
          isRefreshNotiList: false,
        }, () => this.fetchRecentNoti());
      }
      this.fetchDataUyQuyen();
      this.fetchBirthdayData();
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
    if (actionCode.includes("UYQUYEN")) {
      this.props.updateAuthorization(1);
    }
    else {
      this.props.updateAuthorization(0);
    }
    this.props.navigation.navigate(screenName);
  }

  render() {
    const {
      notifyCount_VBDen_Chuaxuly, notifyCount_VBDi_Chuaxuly, notifyCount_CV_Canhan,
      notifyCount_Chuyenxe, notifyCount_Datxe, notifyCount_Lichhop, notifyCount_Lichtruc, notifyCount_Uyquyen, notifyCount_Nhacviec,
      dataHotline
    } = this.state;

    let maxExtendKeyFunctionNotiCount = Math.max.apply(Math, [notifyCount_Chuyenxe, notifyCount_Datxe, notifyCount_Lichhop, notifyCount_Lichtruc, notifyCount_Uyquyen, notifyCount_Nhacviec]);

    return (
      <MenuProvider backHandler>
        <View style={SideBarStyle.container}>
          <StatusBar barStyle="light-content" />
          <Header style={SideBarStyle.dashboardHeader}>
            <Left style={SideBarStyle.dashboardHeaderLeft}>
              <Text style={{ color: Colors.WHITE, fontSize: moderateScale(12, 1.2) }}>
                <Text style={{ fontStyle: "italic" }}>Xin chào,</Text> <Text style={{ fontWeight: "bold" }}>{this.state.userInfo.Fullname}</Text>
              </Text>
            </Left>
            <Body />
            <Right style={SideBarStyle.dashboardHeaderRight}>
              {
                (isArray(dataHotline) && dataHotline.length > 0) && <Menu>
                  <MenuTrigger children={
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      <Icon name="phone-in-talk" color={Colors.WHITE} type="material-community" size={moderateScale(16, 1.3)} />
                      <Text style={{ fontWeight: "bold", color: Colors.WHITE, fontSize: moderateScale(12, 1.2) }}> Hotline </Text>
                      <Icon name="chevron-down" color={Colors.WHITE} type="material-community" size={moderateScale(16, 1.3)} />
                    </View>
                  } />
                  <MenuOptions customStyles={HeaderMenuStyle.optionsStyles}>
                    {
                      dataHotline.map((item, index) => {
                        return (
                          <MenuOption
                            key={index.toString()}
                            onSelect={() => Linking.openURL(`tel:${item.GHICHU}`)}
                            customStyles={HeaderMenuStyle.optionStyles}
                            style={{ flexDirection: "row" }}
                          >
                            <Icon name="phone-in-talk" color={Colors.BLACK} type="material-community" size={moderateScale(12, 1.2)} />
                            <Text style={{ fontSize: moderateScale(11, 0.95), flexWrap: 'nowrap' }}>
                              {'  ' + item.TEXT}
                            </Text>
                          </MenuOption>
                        );
                      })
                    }
                  </MenuOptions>
                </Menu>
              }
            </Right>
          </Header>

          <View
            style={[SideBarStyle.hotPickBoxContainer, { flex: this.state.orientation === 'portrait' ? 1 : 2 }]}
          >
            <View style={SideBarStyle.shortcutBoxContainer}>
              <HotPickButton
                notifyCount={notifyCount_VBDen_Chuaxuly}
                title='Văn bản đến'
                actionCode={VANBANDEN._CHUAXULY.NAME}
                changeScreen={() => this.setCurrentFocus("VanBanDenIsNotProcessScreen")}
              />
              <HotPickButton
                notifyCount={notifyCount_VBDi_Chuaxuly}
                title='Văn bản đi'
                actionCode={VANBANDI._CHUAXULY.NAME}
                changeScreen={() => this.setCurrentFocus("VanBanDiIsNotProcessScreen")}
              />
              <HotPickButton
                notifyCount={notifyCount_CV_Canhan}
                title='Công việc'
                actionCode={CONGVIEC._CANHAN.NAME}
                changeScreen={() => this.setCurrentFocus("ListPersonalTaskScreen")}
              />
              <HotPickButton
                notifyCount={maxExtendKeyFunctionNotiCount}
                title='Tiện ích'
                actionCode={LICHCONGTAC_LANHDAO._DANHSACH.NAME}
                changeScreen={() => this.setCurrentFocus("ExtendKeyFunctionScreen")}
              />
            </View>
          </View>

          <View style={[SideBarStyle.body, { paddingBottom: moderateScale(12, 1.2) }]}>
            <ScrollView
              contentContainerStyle={{ paddingTop: moderateScale(12, 1.2) }}
            >
              <View style={{ backgroundColor: Colors.WHITE, borderTopWidth: .7, borderTopColor: '#ccc' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ backgroundColor: Colors.NOT_READ, padding: moderateScale(10), borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: verticalScale(15) }}>
                    <Text style={{ textAlign: "center", color: Colors.WHITE, fontWeight: "bold", fontSize: moderateScale(12, 1.16) }}>Thông báo</Text>
                  </View>
                </View>
                {
                  this.state.dataUyQuyen.length > 0
                    ? this.state.dataUyQuyen.map((item, index) => (<AuthorizeNoti key={index.toString()} item={item} index={index} />))
                    : null
                }
                {
                  this.state.notiLoading
                    ? dataLoading(this.state.notiLoading)
                    : this.state.notiData.length > 0
                      ? this.state.notiData.map((item, index) => (<RecentNoti
                        item={item} index={index} key={index.toString()}
                        successFunc={this.onNavigateToScreen}
                        readFunc={this.checkRefreshNotiList}
                      />))
                      : emptyDataPage()
                }
                <BirthdayNoti birthdayData={this.state.birthdayData} />
              </View>

              <View style={{
                marginTop: moderateScale(10, 1.2),
                backgroundColor: Colors.WHITE,
                borderTopWidth: .7,
                borderTopColor: '#ccc'
              }}>
                <CalendarStrip
                  calendarAnimation={{ type: 'sequence', duration: 30 }}
                  style={{
                    height: verticalScale(100),
                    paddingTop: verticalScale(20),
                    paddingBottom: verticalScale(10),
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 0.7
                  }}
                  calendarHeaderStyle={{ color: '#2F2F2F', fontSize: moderateScale(12, 1.01) }}
                  calendarColor={Colors.WHITE}
                  dateNumberStyle={{ color: Colors.BLACK, fontSize: moderateScale(14, 1.2) }}
                  dateNameStyle={{ color: Colors.BLACK, fontSize: moderateScale(13, 1.1) }}
                  highlightDateNumberStyle={{ color: '#c21421', fontSize: moderateScale(14, 1.2) }}
                  highlightDateNameStyle={{ color: '#c21421', fontSize: moderateScale(13, 1.1) }}
                  iconContainer={{ flex: 0.1 }}
                  onDateSelected={(date) => this.fetchCalendarData(date)}
                  shouldAllowFontScaling={false}
                />
                {
                  this.state.calendarLoading
                    ? dataLoading(this.state.calendarLoading)
                    : this.state.calendarData.length > 0
                      ? this.state.calendarData.map((item, index) => (<CalendarItem
                        key={index.toString()} item={item} index={index}
                        onPressCalendar={this.onPressCalendar}
                        listIds={this.state.listIds}
                      />))
                      : emptyDataPage()
                }
              </View>
            </ScrollView>
          </View>

          <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
        </View>
      </MenuProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);