/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View,
  FlatList, RefreshControl, TouchableOpacity, Text as RnText, StyleSheet
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Item, Icon, Input, Body, Text,
  Content, Badge, Left, Right, Button, Fab, Title, Subtitle, Toast
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';
import { Agenda } from 'react-native-calendars';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle, convertDateToString, _readableFormat, asyncDelay } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT, LICHTRUC_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import AlertMessage from '../../common/AlertMessage';
import { AlertMessageStyle } from '../../../assets/styles';
import { executeLoading } from '../../../common/Effect';

const TOTAL_TIME_OF_DAY = 86400000,
  SEARCH_TIME_SCOPE = 15 * TOTAL_TIME_OF_DAY;

class ListReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      loadingData: false,
      executingLoading: false,
      data: [],

      items: {},
      currentDay: new Date(),
      refreshAgenda: false,

      listIds: props.extendsNavParams.listIds || [],
      confirmTilte: EMPTY_STRING,
      confirmReminderId: 0,
    }
  }

  componentWillMount() {
    // this.setState({
    //   loadingData: true
    // }, () => {
    //   this.fetchData();
    // })
  }

  componentDidMount = () => {
    let currentNavObj = this.props.navigation || this.props.navigator;

    this.didFocusListener = currentNavObj.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({
            loadingData: true
          }, () => {
            let currentDate = new Date(),
              startDate = currentDate.getTime() - SEARCH_TIME_SCOPE,
              endDate = currentDate.getTime() + SEARCH_TIME_SCOPE;
            this.fetchData(convertDateToString(startDate), convertDateToString(endDate), currentDate.getTime());
          });
          this.props.updateExtendsNavParams({ check: false });
        }
      }
    });
  }

  componentWillUnmount = () => {
    this.didFocusListener.remove();
  }

  async fetchData(startDate, endDate, chosenTimestamp) {
    const url = `${API_URL}/api/Reminder/ListReminder/`
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });
    const body = JSON.stringify({
      startDate,
      endDate,
      userId: this.state.userId
    });
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    });
    const resultJson = await result.json();

    setTimeout(() => {
      for (let i = -15; i < 15; i++) {
        const time = chosenTimestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        // if (!this.state.items[strTime]) {
        this.state.items[strTime] = [];
        resultJson.map(x => {
          if (this.timeToString(x.NGAY) == strTime) {
            const thoidiem = `${_readableFormat(x.GIO)}h${_readableFormat(x.PHUT)}`,
              ngayNhac = convertDateToString(x.NGAY);
            this.state.items[strTime].push({
              thoidiem,
              ngayNhac,
              noidung: x.NOIDUNG,
              id: x.ID,
              reminderAfter: this.getReminderTimeStr(x.NHACVIEC_SAU_ID),
              isActive: x.IS_ACTIVE,
            });
          }
        });
        // }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems,
        loadingData: false
      });
    }, 1000);
  }

  navigateBack = () => {
    if (this.state.listIds.length > 0) {
      this.props.updateExtendsNavParams({ listIds: [] });
    }
    const navObj = this.props.navigation || this.props.navigator;
    navObj.goBack();
  }

  onToggleReminder = (reminderId, isActive) => {
    let tmpTilte = "";
    if (isActive) {
      tmpTilte = "tắt nhắc";
    }
    else {
      tmpTilte = "bật nhắc";
    }
    this.setState({
      confirmTilte: tmpTilte,
      confirmReminderId: reminderId
    }, () => {
      this.refs.confirm.showModal();
    })
  }
  toggleReminder = async () => {
    this.refs.confirm.closeModal();
    this.setState({
      executingLoading: true
    });
    const url = `${API_URL}/api/Reminder/ToggleReminder`;

    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });

    const body = JSON.stringify({
      userId: this.state.userId,
      reminderId: this.state.confirmReminderId,
    });

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      executingLoading: false
    });

    Toast.show({
      text: resultJson.Status ? "Thay đổi trạng thái nhắc nhở thành công" : "Thay đổi trạng thái nhắc nhở thất bại",
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: Colors.LITE_BLUE },
      duration: 3000,
      onClose: () => {
        if (resultJson.Status) {
          let curr = new Date(),
            startDate = curr.getTime() - SEARCH_TIME_SCOPE,
            endDate = curr.getTime() + SEARCH_TIME_SCOPE;
          this.fetchData(convertDateToString(startDate), convertDateToString(endDate), curr.getTime());
        }
      }
    });
  }

  createReminder = () => {
    const navObj = this.props.navigation || this.props.navigator;
    let targetScreenParam = {
      fromScreen: "ListReminderScreen",
    }
    this.props.updateExtendsNavParams(targetScreenParam);
    navObj.navigate("CreateReminderScreen");
  }

  // navigateToDetail = (lichhopId) => {
  //   const navObj = this.props.navigation || this.props.navigator;
  //   if (lichhopId > 0) {
  //     let targetScreenParam = {
  //       lichhopId
  //     }

  //     this.props.updateCoreNavParams(targetScreenParam);
  //     navObj.navigate("DetailMeetingDayScreen");
  //   }
  //   else {
  //     let targetScreenParam = {
  //       fromScreen: "ListReminderScreen",
  //     }
  //     this.props.updateExtendsNavParams(targetScreenParam);
  //     navObj.navigate("CreateReminderScreen");
  //   }
  // }

  loadItems(day) {
    const startDate = convertDateToString(day.timestamp - SEARCH_TIME_SCOPE),
      endDate = convertDateToString(day.timestamp + SEARCH_TIME_SCOPE);
    this.fetchData(startDate, endDate, day.timestamp);
  }

  getReminderTimeStr = (reminderTime) => {
    switch (reminderTime) {
      case 1:
        return "10 phút";
      case 2:
        return "30 phút";
      case 3:
        return "1 tiếng";
      default:
        break;
    }
    return "";
  }

  renderItem(item) {
    let colorFromNoti = this.state.listIds.some(x => x == item.id) ? Colors.OLD_LITE_BLUE : Colors.BLACK;
    let iconActive = item.isActive
      ? <RNEIcon name='bell-ring' size={26} color={Colors.BLACK} type='material-community' />
      : <RNEIcon name='bell-off' size={26} color={Colors.DANK_GRAY} type='material-community' />;

    return (
      <ListItem
        containerStyle={[styles.item, { borderBottomColor: Colors.GRAY, borderBottomWidth: 0, backgroundColor: Colors.WHITE }]}

        title={
          <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap", color: colorFromNoti }]}>
            {item.noidung}
          </RnText>
        }

        subtitle={
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: "35%" }}>
                <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                  Thời điểm:
                </RnText>
              </View>
              <View style={{ width: "65%" }}>
                <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                  {`${item.thoidiem}`}
                </RnText>
              </View>
            </View>
            {
              !!item.reminderAfter && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Nhắc việc sau:
                  </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {`${item.reminderAfter}`}
                  </RnText>
                </View>
              </View>
            }
          </View>
        }
        // hideChevron
        rightIcon={
          <View style={{ flexDirection: 'column' }}>
            {
              iconActive
            }
          </View>
        }
        onPress={() => this.onToggleReminder(item.id, item.isActive)}
      />
    );
  }

  renderEmptyDate() {
    return (
      <View />
      // <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  render() {
    // console.tron.log(this.state.items)
    return (
      <Container>
        <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <TouchableOpacity onPress={() => this.navigateBack()} style={{ width: '100%' }}>
              <RNEIcon name="ios-arrow-back" size={30} color={Colors.WHITE} type="ionicon" />
            </TouchableOpacity>
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 6 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>DANH SÁCH NHẮC NHỞ</Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            renderIf(this.state.loadingData)(
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
              </View>
            )
          }
          {
            this.state.executingLoading && executeLoading(this.state.executeLoading)
          }

          {
            <Agenda
              items={this.state.items}
              loadItemsForMonth={this.loadItems.bind(this)}
              selected={this.state.currentDay}
              renderItem={this.renderItem.bind(this)}
              renderEmptyDate={this.renderEmptyDate.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
            />
          }
        </Content>
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: Colors.MENU_BLUE }}
          position="bottomRight"
          onPress={() => this.createReminder(0)}>
          <Icon name="add" />
        </Fab>
        <AlertMessage
          ref="confirm"
          title={`XÁC NHẬN ${this.state.confirmTilte.toUpperCase()}`}
          bodyText={`Bạn có chắc chắn muốn ${this.state.confirmTilte} của nhắc nhở này không? Sau này bạn vẫn có thể bật lại được.`}
          exitText="HỦY BỎ"
        >
          <View style={AlertMessageStyle.leftFooter}>
            <TouchableOpacity onPress={() => this.toggleReminder()} style={AlertMessageStyle.footerButton}>
              <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                ĐỒNG Ý
              </RnText>
            </TouchableOpacity>
          </View>
        </AlertMessage>
      </Container>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(ListReminder);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});