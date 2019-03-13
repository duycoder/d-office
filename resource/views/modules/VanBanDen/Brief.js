'use strict'
import React, { Component } from 'react';
import { View, Text as RnText, TouchableOpacity, FlatList } from 'react-native';
//redux
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

//utilities
import { API_URL, Colors, BRIEF_CONSTANT, DOKHAN_CONSTANT } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate, emptyDataPage, getColorCodeByProgressValue, convertDateToString, formatLongText } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import * as util from 'lodash';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';
//lib
import {
  Container, Header, Left, Button,
  Body, Icon, Title, Content, Form,
  Tabs, Tab, TabHeading, ScrollableTab,
  Text, Right, Toast
} from 'native-base';
import {
  Icon as RneIcon, ButtonGroup, ListItem
} from 'react-native-elements';

import renderIf from 'render-if';

//views
import MainInfoPublishDoc from './Info';
import TimelinePublishDoc from './History';
import AttachPublishDoc from './Attachment';
import { ListSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { ListTaskStyle } from '../../../assets/styles/TaskStyle';

//redux
import * as navAction from '../../../redux/modules/Nav/Action';

class Brief extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,
      isUnAuthorize: false,

      docId: this.props.coreNavParams.docId,
      docType: this.props.coreNavParams.docType,
      docInfo: {},

      loading: false,
      executing: false
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  componentDidMount = () => {
    // backHandlerConfig(true, this.navigateBackToList);
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.fetchData();
        }
      }
    })
  }

  componentWillUnmount = () => {
    // backHandlerConfig(false, this.navigateBackToList);
    this.willFocusListener.remove();
  }

  navigateBackToDetailVanbanDen = () => {
    const pastNavParams = {
      docId: this.state.docId,
      docType: this.state.docType
    }
    this.props.updateCoreNavParams(pastNavParams);
    this.props.navigation.goBack();
  }
  /**
   * Hàm điều hướng vào chi tiết văn bản đi hoặc công việc liên quan
   */
  navigateToDetail = (itemId, isDoc = false) => {
    let targetScreenParam = {
      taskId: itemId,
      taskType: 0,
      fromBrief: true
    }
    if (isDoc) {
      targetScreenParam = {
        docId: itemId,
        docType: 0,
        fromBrief: true
      }
      this.props.updateCoreNavParams(targetScreenParam);
      this.props.navigation.navigate("VanBanDiDetailScreen");
    }
    else {
      this.props.updateCoreNavParams(targetScreenParam);
      this.props.navigation.navigate("DetailTaskScreen");
    }
  }

  async fetchData() {
    this.setState({
      loading: true
    });

    const url = `${API_URL}/api/VanBanDen/HoSoVanBan/${this.state.docId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      isUnAuthorize: util.isNull(resultJson),
      docInfo: resultJson
    });
  }

  render() {
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else if (this.state.isUnAuthorize) {
      bodyContent = unAuthorizePage(this.props.navigation);
    } else {
      bodyContent = <DetailContent docInfo={this.state.docInfo} navigateToDetail={this.navigateToDetail} />
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={() => this.navigateBackToDetailVanbanDen()}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle} >
              HỒ SƠ VĂN BẢN
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
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
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Brief);

//THÔNG TIN VĂN BẢN
class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      docInfo: props.docInfo
    }
  }

  render() {
    const { groupOfCongViecs, groupOfVanBanDis } = this.state.docInfo;

    return (
      <View style={{ flex: 1 }}>
        <Tabs
          renderTabBar={() => <ScrollableTab />}
          initialPage={this.state.currentTabIndex}
          tabBarUnderlineStyle={TabStyle.underLineStyle}
          onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
              <RneIcon name='file-account' iconStyle={TabStyle.activeText} type='material-community' />
              <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
                DANH SÁCH CÔNG VIỆC
              </Text>
            </TabHeading>
          }>
            <BriefTaskList info={groupOfCongViecs} navigateToDetail={this.props.navigateToDetail} />
          </Tab>

          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
              <RneIcon name='file-restore' iconStyle={TabStyle.activeText} type='material-community' />
              <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
                VĂN BẢN PHẢN HỒI
              </Text>
            </TabHeading>
          }>
            <BriefResponseList info={groupOfVanBanDis} navigateToDetail={this.props.navigateToDetail} />
          </Tab>
        </Tabs>
      </View>
    );
  }
}

class BriefTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.info || []
    }
  }

  async getListSubTasks(index, isExpand, taskId, parentIds) {
    if (isExpand == false) {
      this.setState({
        executing: true
      });

      const taskObj = {
        rootParentId: taskId,
        userId: this.state.userId,
        parentIds
      }

      const url = `${API_URL}/api/HscvCongViec/GetListSubTasks`;
      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      });
      const body = JSON.stringify(taskObj);

      const result = await fetch(url, {
        method: 'post',
        headers,
        body
      });

      const resultJson = await result.json();

      //thêm đối tượng vào mảng
      this.state.data.splice((index + 1), 0, ...resultJson);

      //sửa hiển thị icon của công việc cha
      this.state.data = this.state.data.map((item) => {
        if (item.ID == taskId) {
          return { ...item, isExpand: true };
        }
        return item;
      })

      this.setState({
        executing: false,
        data: this.state.data
      })
    } else {
      this.state.data = this.state.data.filter(item => (item.parentIds == null || item.parentIds.indexOf(taskId) < 0));
      //sửa hiển thị icon của công việc con
      this.state.data = this.state.data.map((item) => {
        if (item.ID == taskId) {
          return { ...item, isExpand: false }
        }
        return item;
      })

      this.setState({
        data: this.state.data
      })
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <View>
        <ListItem
          hideChevron={true}
          badge={{
            value: (item.PHANTRAMHOANTHANH || 0) + '%',
            textStyle: {
              color: Colors.WHITE,
              fontWeight: 'bold'
            },
            containerStyle: {
              backgroundColor: getColorCodeByProgressValue(item.PHANTRAMHOANTHANH),
              borderRadius: 3
            }
          }}

          leftIcon={
            <View style={ListTaskStyle.leftSide}>
              {
                renderIf(item.HasChild && item.isExpand == true)(
                  <TouchableOpacity onPress={
                    (idx, isExpand, taskId, parentIds) => this.getListSubTasks.bind(this)(index, item.isExpand, item.ID, item.parentIds)}>
                    <RneIcon name='folder-open-o' type='font-awesome' />
                  </TouchableOpacity>
                )
              }

              {
                renderIf(item.HasChild && item.isExpand == false)(
                  <TouchableOpacity onPress={
                    (idx, isExpand, taskId, parentIds) => this.getListSubTasks.bind(this)(index, item.isExpand, item.ID, item.parentIds)}>
                    <RneIcon name='folder-o' type='font-awesome' />
                  </TouchableOpacity>
                )
              }
            </View>
          }

          title={
            <RnText style={item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal}>
              <RnText style={{ fontWeight: 'bold' }}>
                Tên công việc:
                </RnText>
              <RnText>
                {' ' + item.TENCONGVIEC}
              </RnText>
            </RnText>
          }

          subtitle={
            <RnText style={[item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal, ListTaskStyle.abridgment]}>
              <RnText style={{ fontWeight: 'bold' }}>
                Hạn xử lý:
                            </RnText>
              <RnText>
                {' ' + convertDateToString(item.NGAYHOANTHANH_THEOMONGMUON)}
              </RnText>
            </RnText>
          }
          onPress={() => this.props.navigateToDetail(item.ID, false)}
        />

      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => item.ID.toString()}
          renderItem={this.renderItem}

          ListEmptyComponent={() => emptyDataPage()}
        />
      </View>
    );
  }
}

class BriefResponseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.info || []
    }
  }

  navigateToDocDetail = (docId) => {
    let currentScreenName = "VanBanDenBriefScreen";
    let targetScreenParam = {
      docId,
      docType: 0
    }

    appStoreDataAndNavigate(this.props.navigator, currentScreenName, new Object(), "VanBanDiDetailScreen", targetScreenParam);
  }

  getListSubTasks(index, childData) {
    this.state.data.splice((index + 1), 0, childData);
  }

  renderItem = ({ item, index }) => {
    let mahieu = (
      <RnText>
        {' ' + item.SOHIEU}
      </RnText>
    )
    if (item.SOHIEU === null || item.SOHIEU === "") {
      mahieu = (
        <RnText style={{ color: Colors.RED_PANTONE_186C }}> Không rõ</RnText>
      );
    }

    return (
      <View>
        <ListItem
          hideChevron={true}
          badge={{
            value: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? 'R.Q.TRỌNG' : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? 'Q.TRỌNG' : 'THƯỜNG'),
            textStyle: {
              color: Colors.WHITE,
              fontWeight: 'bold'
            },
            containerStyle: {
              backgroundColor: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? Colors.RED_PANTONE_186C : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C),
              borderRadius: 3
            }
          }}
          leftIcon={
            <View style={ListSignDocStyle.leftSide}>
              {
                renderIf(item.hasOwnProperty("groupOfCongViecs") && item.groupOfCongViecs.length > 0)(
                  <TouchableOpacity onPress={
                    (index, childData) => this.getListSubTasks.bind(this)(index, item.groupOfCongViecs)}>
                    <RneIcon name='folder-open-o' type='font-awesome' />
                  </TouchableOpacity>
                )
              }
            </View>
          }

          title={
            <RnText style={item.IS_READ === true ? ListSignDocStyle.textRead : ListSignDocStyle.textNormal}>
              <RnText style={{ fontWeight: 'bold' }}>
                Mã hiệu:
                </RnText>

              {mahieu}
            </RnText>
          }

          subtitle={
            <RnText style={[item.IS_READ === true ? ListSignDocStyle.textRead : ListSignDocStyle.textNormal, ListSignDocStyle.abridgment]}>
              <RnText style={{ fontWeight: 'bold' }}>
                Trích yếu:
                </RnText>
              <RnText>
                {' ' + formatLongText(item.TRICHYEU, 50)}
              </RnText>
            </RnText>
          }
          onPress={() => this.props.navigateToDetail(item.ID, true)}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => item.ID.toString()}
          renderItem={this.renderItem}

          ListEmptyComponent={() => emptyDataPage()}
        />
      </View>
    );
  }
}