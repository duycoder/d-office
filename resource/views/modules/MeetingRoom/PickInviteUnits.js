/*
* @description: màn hình giao việc
* @author: duynn
* @since: 13/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
  ActivityIndicator, FlatList
} from 'react-native'
//lib
import {
  Container, Content, Segment, Button, Text, Icon, Item, Input,
  Header, Left, Body, Title, View, Tabs, Tab, TabHeading,
  Right, Toast, ListItem as NbListItem, Radio, CheckBox
} from 'native-base';
import {
  Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/CongViec/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//utilities
import {
  API_URL, HEADER_COLOR, DEFAULT_PAGE_INDEX,
  EMPTY_STRING, LOADER_COLOR, LOADMORE_COLOR,
  TASK_PROCESS_TYPE, Colors, DEFAULT_PAGE_SIZE
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage, showWarningToast } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import { meetingRoomApi } from '../../../common/Api';
import { MoreButton, HeaderRightButton, GoBackButton } from '../../common';
import BasePickInvite from './BasePickInvite';

class PickInviteUnits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      currentTabIndex: 0,
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onPickUnit = () => {
    const personUnit = this.refs.pickInvitePerson ? this.refs.pickInvitePerson.onPickUnit() : null,
      roleUnit = this.refs.pickInviteRole ? this.refs.pickInviteRole.onPickUnit() : null,
      deptUnit = this.refs.pickInviteDept ? this.refs.pickInviteDept.onPickUnit() : null;
    this.props.updateExtendsNavParams({ ...personUnit, ...roleUnit, ...deptUnit });
    this.navigateBack();
  }

  render() {
    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CHỌN THÀNH PHẦN THAM DỰ
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              onPress={() => this.onPickUnit()}
              iconName='md-checkmark' iconType='ionicon'
            />
          </Right>
        </Header>
        <Content contentContainerStyle={{ flex: 1 }}>
          <Tabs
            initialPage={this.state.currentTabIndex}
            tabBarUnderlineStyle={TabStyle.underLineStyle}
            tabContainerStyle={{ height: moderateScale(47, 0.97) }}
            onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
            <Tab heading={
              <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>CÁN BỘ</Text>
              </TabHeading>
            }>
              <BasePickInvite
                ref='pickInvitePerson'
                unitId_Text='joinNguoiId'
                unitName_Text='joinNguoiText'
                extendsNavParams={this.props.extendsNavParams}
                fetchTrigger={1}
              />
            </Tab>
            <Tab heading={
              <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>VAI TRÒ</Text>
              </TabHeading>
            }>
              <BasePickInvite
                ref='pickInviteRole'
                unitId_Text='joinVaitroId'
                unitName_Text='joinVaitroText'
                extendsNavParams={this.props.extendsNavParams}
                fetchTrigger={2}
              />
            </Tab>
            <Tab heading={
              <TabHeading style={(this.state.currentTabIndex == 2 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                <Text style={(this.state.currentTabIndex == 2 ? TabStyle.activeText : TabStyle.inActiveText)}>PHÒNG BAN</Text>
              </TabHeading>
            }>
              <BasePickInvite
                ref='pickInviteDept'
                unitId_Text='joinPhongId'
                unitName_Text='joinPhongText'
                extendsNavParams={this.props.extendsNavParams}
                fetchTrigger={3}
              />
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickInviteUnits);