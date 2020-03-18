/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text as RnText, StyleSheet
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Body, Content, Left, Right, Title
} from 'native-base'
import { ListItem, Icon as RNEIcon } from 'react-native-elements';
import { Agenda } from 'react-native-calendars';

//utilities
import { convertDateToString, _readableFormat } from '../../../common/Utilities';
import {
  Colors
} from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { meetingRoomApi } from '../../../common/Api';
import { AddButton, ColumnedListItem, GoBackButton } from '../../common';

const TOTAL_TIME_OF_DAY = 86400000;

class MeetingDayList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      loadingData: false,
      data: [],

      items: {},
      currentDay: new Date(),
      refreshAgenda: false,

      listIds: props.extendsNavParams.listIds || (props.coreNavParams ? props.coreNavParams.listIds : []) || [],
    }
  }

  componentDidMount = () => {
    let currentNavObj = this.props.navigation || this.props.navigator;

    this.didFocusListener = currentNavObj.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({
            items: {},
          }, () => {
            let currentDate = new Date(),
              startDate = currentDate.getTime() - 15 * TOTAL_TIME_OF_DAY,
              endDate = currentDate.getTime() + 15 * TOTAL_TIME_OF_DAY;
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

  async fetchData(startDate, endDate, chosenTimeStamp) {
    const resultJson = await meetingRoomApi().getListCalendar({
      startDate,
      endDate
    })

    setTimeout(() => {
      for (let i = -15; i < 15; i++) {
        const time = chosenTimeStamp + i * TOTAL_TIME_OF_DAY;
        const strTime = this.timeToString(time);

        // if (!this.state.items[strTime]) {
        this.state.items[strTime] = [];
        resultJson.map(x => {
          if (this.timeToString(x.NGAY_HOP) == strTime) {
            const thoigianHop = `${_readableFormat(x.GIO_BATDAU)}h${_readableFormat(x.PHUT_BATDAU)} - ${_readableFormat(x.GIO_KETTHUC)}h${_readableFormat(x.PHUT_KETTHUC)}`,
              ngayHop = convertDateToString(x.NGAY_HOP);
            this.state.items[strTime].push({
              thoigianHop,
              ngayHop,
              mucdich: x.MUCDICH,
              thamdu: x.THANHPHAN_THAMDU,
              id: x.ID,
              tenPhong: x.TEN_PHONG,
              tenNguoiChutri: x.TEN_NGUOICHUTRI
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

  navigateToDetail = (lichhopId = 0) => {
    const navObj = this.props.navigation || this.props.navigator;
    if (lichhopId > 0) {
      let targetScreenParam = {
        lichhopId
      }

      this.props.updateCoreNavParams(targetScreenParam);
      navObj.navigate("DetailMeetingDayScreen");
    }
    else {
      let targetScreenParam = {
        fromScreen: "MeetingDayListScreen",
      }
      this.props.updateExtendsNavParams(targetScreenParam);
      navObj.navigate("CreateMeetingDayScreen");
    }
  }

  loadItems(day) {
    const startDate = convertDateToString(day.timestamp - 15 * TOTAL_TIME_OF_DAY),
      endDate = convertDateToString(day.timestamp + 15 * TOTAL_TIME_OF_DAY);

    this.fetchData(startDate, endDate, day.timestamp);
  }

  renderItem(item) {
    let isNotiAlertTextColor = this.state.listIds.some(x => x == item.id) ? Colors.OLD_LITE_BLUE : Colors.BLACK;

    return (
      <ListItem
        containerStyle={[styles.item, { borderBottomColor: Colors.GRAY, borderBottomWidth: 0, backgroundColor: Colors.WHITE }]}
        title={
          <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap", color: isNotiAlertTextColor }]}>
            {item.mucdich}
          </RnText>
        }
        subtitle={
          <View style={{ marginTop: 8 }}>
            <ColumnedListItem
              leftText='Thời gian họp:'
              rightText={item.thoigianHop}
              leftContainerWidth={35}
              rightContainerWidth={65}
            />
            <ColumnedListItem
              leftText='Phòng họp:'
              rightText={item.tenPhong || 'Chưa xếp phòng'}
              leftContainerWidth={35}
              rightContainerWidth={65}
              customRightText={!!item.tenPhong ? {} : { fontWeight: 'bold', color: Colors.RED_PANTONE_186C }}
            />
            <ColumnedListItem
              isRender={!!item.tenNguoiChutri}
              leftText='Người chủ trì:'
              rightText={item.tenNguoiChutri}
              leftContainerWidth={35}
              rightContainerWidth={65}
            />
          </View>
        }
        hideChevron
        // rightIcon={
        //   <View style={{ flexDirection: 'column' }}>
        //     <RNEIcon name='flag' size={26} color={item.MAU_TRANGTHAI} type='material-community' />
        //   </View>
        // }
        onPress={() => this.navigateToDetail(item.id)}
      />
    );
  }

  renderEmptyDate() {
    return (
      <View />
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
    return (
      <Container>
        <Header searchBar rounded style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 6 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>LỊCH HỌP</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <RNEIcon name='ios-more' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems.bind(this)}
            selected={this.state.currentDay}
            renderItem={this.renderItem.bind(this)}
            renderEmptyDate={this.renderEmptyDate.bind(this)}
            rowHasChanged={this.rowHasChanged.bind(this)}
          />
        </Content>
        <AddButton createFunc={this.navigateToDetail} />
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

export default connect(mapStatetoProps, mapDispatchToProps)(MeetingDayList);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: moderateScale(10, 1.03),
    marginRight: moderateScale(10, 1.03),
    marginTop: moderateScale(16.5, 1.05)
  },
  emptyDate: {
    height: moderateScale(14.35, 1.08),
    flex: 1,
    paddingTop: moderateScale(28.45, 1.06)
  }
});