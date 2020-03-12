/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  ActivityIndicator, View,
  Text as RnText, StyleSheet
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Body, Content, Left, Right, Title
} from 'native-base'
import renderIf from 'render-if';
import { ListItem } from 'react-native-elements';
import { Agenda } from 'react-native-calendars';

//utilities
import { convertDateToString, _readableFormat } from '../../../common/Utilities';
import { Colors } from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';


import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { reminderApi, lichtrucApi } from '../../../common/Api';
import { GoBackButton } from '../../common';

const TOTAL_TIME_OF_DAY = 86400000,
  SEARCH_TIME_SCOPE = 15 * TOTAL_TIME_OF_DAY;


class ListPersonalLichtruc extends Component {
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
            items: {}
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
    const { userId } = this.state;
    const resultJson = await lichtrucApi().getPersonalList({
      startDate,
      endDate,
      userId
    });

    setTimeout(() => {
      let tmpItems = {};
      for (let i = -15; i < 15; i++) {
        const time = chosenTimestamp + i * TOTAL_TIME_OF_DAY;
        const strTime = this.timeToString(time);

        // if (!this.state.items[strTime]) {
        tmpItems[strTime] = [];
        resultJson.map(x => {
          if (this.timeToString(x.date) == strTime) {
            tmpItems[strTime].push({
              id: x.ID,
              date: x.date,
              title: x.title,
              note: x.note
            });
          }
        });
        // }
      }
      const newItems = {};
      Object.keys(tmpItems).forEach(key => { newItems[key] = tmpItems[key]; });
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

  loadItems(day) {
    const startDate = convertDateToString(day.timestamp - SEARCH_TIME_SCOPE),
      endDate = convertDateToString(day.timestamp + SEARCH_TIME_SCOPE);
    this.fetchData(startDate, endDate, day.timestamp);
  }

  renderItem(item) {
    let colorFromNoti = (!!this.state.listIds && this.state.listIds.some(x => x == item.id)) ? Colors.OLD_LITE_BLUE : Colors.BLACK;

    return (
      <ListItem
        containerStyle={[styles.item, { borderBottomColor: Colors.GRAY, borderBottomWidth: 0, backgroundColor: Colors.WHITE }]}
        title={
          <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap", color: colorFromNoti }]}>
            {item.title}
          </RnText>
        }
        subtitle={
          <View style={{ marginTop: 8 }}>
            <RnText style={[{ fontSize: moderateScale(11, 1.1), flexWrap: "wrap", color: Colors.DANK_GRAY }]}>
              {item.note}
            </RnText>
          </View>
        }
        hideChevron
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
            <GoBackButton onPress={() => this.navigateBack()} buttonStyle='100%' />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 6 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>LỊCH TRỰC CÁ NHÂN</Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
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
          {
            renderIf(this.state.loadingData)(
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
              </View>
            )
          }
        </Content>
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

export default connect(mapStatetoProps, mapDispatchToProps)(ListPersonalLichtruc);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: moderateScale(10, 1.03),
    marginRight: moderateScale(10, 1.03),
    marginTop: moderateScale(16.35, 1.08)
  }
});