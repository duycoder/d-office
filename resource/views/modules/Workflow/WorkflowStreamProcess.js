/**
 * @description: màn hình trình xử lý văn bản
 * @author: duynn
 * @since: 16/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, FlatList, TouchableOpacity } from 'react-native';

//utilites
import {
  EMPTY_STRING,
  DEFAULT_PAGE_INDEX, WORKFLOW_PROCESS_TYPE, COMMON_COLOR,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { emptyDataPage, showWarningToast } from '../../../common/Utilities';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import * as util from 'lodash';

//effect
import { dataLoading, executeLoading } from '../../../common/Effect';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Left, Content, Title,
  Tabs, Tab, TabHeading, Text, Icon,
  Form, Textarea, Body, Item, Input, Right, Toast,
  Label
} from 'native-base';
import renderIf from 'render-if';
import { Icon as RneIcon } from 'react-native-elements';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import WorkflowStreamMainProcessUsers from './WorkflowStreamMainProcessUsers';
import WorkflowStreamJoinProcessUsers from './WorkflowStreamJoinProcessUsers';
import { GoBackButton, MoreButton } from '../../common';
import { vanbandenApi } from '../../../common/Api';

const api = vanbandenApi();

class WorkflowStreamProcess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,

      docId: this.props.coreNavParams.docId,
      docType: this.props.coreNavParams.docType,
      processId: this.props.extendsNavParams.processId,
      stepId: this.props.extendsNavParams.stepId,
      stepName: util.toUpper(this.props.extendsNavParams.stepName),
      isStepBack: this.props.extendsNavParams.isStepBack,
      logId: this.props.extendsNavParams.logId,

      executing: false,
      loadingData: false,
      flowData: {},
      mainProcessUsers: [],
      joinProcessUsers: [],
      message: EMPTY_STRING,

      currentTabIndex: 0,
      mainProcessFilterValue: EMPTY_STRING,
      joinProcessFilterValue: EMPTY_STRING,

      joinProcessPageIndex: DEFAULT_PAGE_INDEX,
      mainProcessPageIndex: DEFAULT_PAGE_INDEX,

      //hiệu ứng
      searchingInMain: false,
      searchingInJoin: false,
      loadingMoreInMain: false,
      loadingMoreInJoin: false,

      hasAuthorization: props.hasAuthorization || 0
    }
  }

  componentDidMount = () => {
    // backHandlerConfig(true, this.navigateBackToDetail);
    this.fetchData();
  }

  componentWillUnmount = () => {
    // backHandlerConfig(false, this.navigateBackToDetail);
  }

  fetchData = async () => {
    this.setState({
      loadingData: true
    });

    const {
      userId, processId, stepId, isStepBack, logId, hasAuthorization
    } = this.state;

    const resultJson = await api.getFlow([
      userId,
      processId,
      stepId,
      isStepBack ? 1 : 0,
      logId,
      hasAuthorization
    ]);

    ;
    this.setState({
      loadingData: false,
      flowData: resultJson,
      mainProcessUsers: resultJson.dsNgNhanChinh || [],
      joinProcessUsers: resultJson.dsNgThamGia || []
    })
  }

  navigateBackToDetail = () => {
    this.props.navigation.goBack();
  }

  saveFlow = async () => {
    //validate
    if (this.state.mainProcessUsers.length > 0 && this.props.mainProcessUser == 0) {
      showWarningToast('Vui lòng chọn người xử lý chính');
    } else {
      this.setState({
        executing: true
      });

      const {
        userId, processId, stepId, message, isStepBack, logId
      } = this.state;

      const {
        mainProcessUser, joinProcessUsers
      } = this.props;

      const resultJson = await api.saveFlow({
        userId,
        processID: processId,
        stepID: stepId,
        mainUser: mainProcessUser,
        joinUser: joinProcessUsers.toString(),
        message,
        IsBack: isStepBack ? 1 : 0,
        LogID: logId,
      });

      this.setState({
        executing: false
      })

      Toast.show({
        text: this.state.stepName + (resultJson.Status ? ' thành công' : ' không thành công'),
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
        buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.RED_PANTONE_186C },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.ALL_PROCESS);
          if (resultJson.Status) {
            this.props.updateExtendsNavParams({ check: true });
            this.navigateBackToDetail();
          }
        }
      });
    }
  }

  filterData = async (isMainProcess) => {
    let pageIndex = DEFAULT_PAGE_INDEX;
    let query = EMPTY_STRING;
    if (isMainProcess) {
      query = this.state.mainProcessFilterValue;
      pageIndex = this.state.mainProcessPageIndex;
    } else {
      query = this.state.joinProcessFilterValue;
      pageIndex = this.state.joinProcessPageIndex;
    }

    const { userId, stepId } = this.state;

    const resultJson = await api.getUserInFlow([
      userId,
      stepId,
      `${pageIndex}?query=${query}`,
    ]);

    if (isMainProcess) {
      this.setState({
        searchingInMain: false,
        loadingMoreInMain: false,
        mainProcessUsers: this.state.searchingInMain ? (resultJson.dsNgNhanChinh || []) : [...this.state.mainProcessUsers, ...(resultJson.dsNgNhanChinh || [])]
      })
    } else {
      this.setState({
        searchingInJoin: false,
        loadingMoreInJoin: false,
        joinProcessUsers: this.state.searchingInJoin ? (resultJson.dsNgThamGia || []) : [...this.state.joinProcessUsers, ...(resultJson.dsNgThamGia || [])]
      })
    }
  }

  onFilter = (isMainProcess) => {
    if (isMainProcess) {
      this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.MAIN_PROCESS);
      this.setState({
        searchingInMain: true,
        mainProcessPageIndex: DEFAULT_PAGE_INDEX
      }, () => this.filterData(isMainProcess));
    } else {
      this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.JOIN_PROCESS);
      this.setState({
        searchingInJoin: true,
        joinProcessPageIndex: DEFAULT_PAGE_INDEX
      }, () => this.filterData(isMainProcess))
    }
  }

  onClearFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX,
      mainProcessFilterValue: EMPTY_STRING
    }, () => {
      this.fetchData()
    })
  }

  loadingMore = (isMainProcess = false) => {
    if (isMainProcess) {
      this.setState({
        loadingMoreInMain: true,
        mainProcessPageIndex: this.state.mainProcessPageIndex + 1
      }, () => this.filterData(isMainProcess));
    } else {
      this.setState({
        loadingMoreInJoin: true,
        joinProcessPageIndex: this.state.joinProcessPageIndex + 1
      }, () => this.filterData(isMainProcess))
    }
  }
  loadingMoreMain = () => this.loadingMore(true);
  loadingMoreJoin = () => this.loadingMore(false);

  renderMainProcessUsers = ({ item }) => {
    return (
      <WorkflowStreamMainProcessUsers title={item.PhongBan.NAME} users={item.LstNguoiDung} flowData={this.state.flowData} />
    );
  }

  renderJoinProcessUsers = ({ item }) => {
    return (
      <WorkflowStreamJoinProcessUsers title={item.PhongBan.NAME} users={item.LstNguoiDung} flowData={this.state.flowData} />
    );
  }

  render() {
    let bodyContent = null;

    if (!this.state.loadingData) {
      if (this.state.flowData.IsBack == true) {
        bodyContent = (
          <Tabs
            tabContainerStyle={{ height: moderateScale(47, 0.97) }}
            initialPage={this.state.currentTabIndex}
            onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
            tabBarUnderlineStyle={TabStyle.underLineStyle}>
            <Tab heading={
              <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                <Icon name='ios-chatboxes' style={TabStyle.activeText} />
                <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                  GHI CHÚ
                                </Text>
              </TabHeading>
            }>
              <Content>
                <Form>
                  <Item stackedLabel>
                    <Label>
                      <Text>
                        {'Trả về cho: '}
                      </Text>
                      <Text style={{ color: '#000', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        {this.state.flowData.Log.TenNguoiXuLy}
                      </Text>
                    </Label>
                  </Item>
                  <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
                </Form>
              </Content>
            </Tab>
          </Tabs>
        )
      } else {
        if (this.state.flowData.HasUserExecute && this.state.flowData.HasUserJoinExecute) {
          bodyContent = (
            <Tabs
              // renderTabBar={() => <ScrollableTab />}
              tabContainerStyle={{ height: moderateScale(47, 0.97) }}
              initialPage={this.state.currentTabIndex}
              onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
              tabBarUnderlineStyle={TabStyle.underLineStyle}>
              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-person' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                    CHÍNH
                                    </Text>
                </TabHeading>
              }>
                <Item>
                  <Icon name='ios-search' style={{ marginLeft: 5 }} />
                  <Input placeholder='Họ tên'
                    value={this.state.mainProcessFilterValue}
                    onSubmitEditing={() => this.onFilter(true)}
                    onChangeText={(mainProcessFilterValue) => this.setState({ mainProcessFilterValue })} />
                  {
                    (this.state.mainProcessFilterValue !== EMPTY_STRING)
                    && <Icon name='ios-close-circle' onPress={this.onClearFilter} />
                  }
                </Item>

                <Content contentContainerStyle={{ flex: 1 }}>
                  {
                    renderIf(this.state.searchingInMain)(
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
                      </View>
                    )
                  }

                  {
                    renderIf(!this.state.searchingInMain)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.mainProcessUsers}
                        renderItem={this.renderMainProcessUsers}
                        ListEmptyComponent={
                          this.state.loadingData ? null : emptyDataPage()
                        }
                        ListFooterComponent={() => (<MoreButton
                          isLoading={this.state.loadingMoreInMain}
                          isTrigger={this.state.mainProcessUsers.length >= 5}
                          loadmoreFunc={this.loadingMoreMain}
                        />)}
                      />
                    )
                  }
                </Content>
              </Tab>

              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-people' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>
                    PHỐI HỢP
                                    </Text>
                </TabHeading>
              }>
                <Item>
                  <Icon name='ios-search' style={{ marginLeft: 5 }} />
                  <Input placeholder='Họ tên'
                    value={this.state.joinProcessFilterValue}
                    onSubmitEditing={() => this.onFilter(false)}
                    onChangeText={(joinProcessFilterValue) => this.setState({ joinProcessFilterValue })} />
                </Item>

                <Content contentContainerStyle={{ flex: 1 }}>
                  {
                    renderIf(this.state.searchingInJoin)(
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
                      </View>
                    )
                  }
                  {
                    renderIf(!this.state.searchingInJoin)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.joinProcessUsers}
                        renderItem={this.renderJoinProcessUsers}
                        ListEmptyComponent={
                          this.state.loadingData ? null : emptyDataPage()
                        }
                        ListFooterComponent={() => (<MoreButton
                          isLoading={this.state.loadingMoreInJoin}
                          isTrigger={this.state.joinProcessUsers.length >= 5}
                          loadmoreFunc={this.loadingMoreJoin}
                        />)}
                      />
                    )
                  }
                </Content>
              </Tab>

              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 2) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-chatboxes' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 2) ? TabStyle.activeText : TabStyle.inActiveText}>
                    GHI CHÚ
                                    </Text>
                </TabHeading>
              }>
                <Content>
                  <Form>
                    <Textarea
                      rowSpan={5}
                      bordered
                      placeholder='Nội dung ghi chú'
                      onChangeText={(message) => this.setState({ message })}
                    />
                  </Form>
                </Content>
              </Tab>
            </Tabs>
          )
        } else if (this.state.flowData.HasUserExecute && this.state.flowData.HasUserJoinExecute == false) {
          bodyContent = (
            <Tabs
              initialPage={this.state.currentTabIndex}
              onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
              tabContainerStyle={{ height: moderateScale(47, 0.97) }}
              tabBarUnderlineStyle={TabStyle.underLineStyle}>
              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-person' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                    CHÍNH
                                </Text>
                </TabHeading>
              }>
                <Item>
                  <Icon name='ios-search' style={{ marginLeft: 5 }} />
                  <Input placeholder='Họ tên'
                    value={this.state.mainProcessFilterValue}
                    onSubmitEditing={() => this.onFilter(true)}
                    onChangeText={(mainProcessFilterValue) => this.setState({ mainProcessFilterValue })} />
                </Item>

                <Content contentContainerStyle={{ flex: 1 }}>
                  {
                    renderIf(this.state.searchingInMain)(
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
                      </View>
                    )
                  }

                  {
                    renderIf(!this.state.searchingInMain)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.mainProcessUsers}
                        renderItem={this.renderMainProcessUsers}
                        ListEmptyComponent={
                          this.state.loadingData ? null : emptyDataPage()
                        }
                        ListFooterComponent={() => (<MoreButton
                          isLoading={this.state.loadingMoreInMain}
                          isTrigger={this.state.mainProcessUsers.length >= 5}
                          loadmoreFunc={this.loadingMoreMain}
                        />)}
                      />
                    )
                  }
                </Content>
              </Tab>

              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-chatboxes' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>
                    GHI CHÚ
                                </Text>
                </TabHeading>
              }>
                <Content>
                  <Form>
                    <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
                  </Form>
                </Content>
              </Tab>
            </Tabs>
          )
        } else if (this.state.flowData.HasUserExecute == false && this.state.flowData.HasUserJoinExecute) {
          bodyContent = (
            <Tabs
              initialPage={this.state.currentTabIndex}
              onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
              tabContainerStyle={{ height: moderateScale(47, 0.97) }}
              tabBarUnderlineStyle={TabStyle.underLineStyle}>

              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-people' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                    PHỐI HỢP
                                </Text>
                </TabHeading>
              }>
                <Item>
                  <Icon name='ios-search' style={{ marginLeft: 5 }} />
                  <Input placeholder='Họ tên'
                    value={this.state.joinProcessFilterValue}
                    onSubmitEditing={() => this.onFilter(false)}
                    onChangeText={(joinProcessFilterValue) => this.setState({ joinProcessFilterValue })} />
                </Item>

                <Content contentContainerStyle={{ flex: 1 }}>
                  {
                    renderIf(this.state.searchingInJoin)(
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
                      </View>
                    )
                  }
                  {
                    renderIf(!this.state.searchingInJoin)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.joinProcessUsers}
                        renderItem={this.renderJoinProcessUsers}
                        ListEmptyComponent={
                          this.state.loadingData ? null : emptyDataPage()
                        }
                        ListFooterComponent={() => (<MoreButton
                          isLoading={this.state.loadingMoreInJoin}
                          isTrigger={this.state.joinProcessUsers.length >= 5}
                          loadmoreFunc={this.loadingMoreJoin}
                        />)}
                      />
                    )
                  }
                </Content>
              </Tab>

              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 2) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-chatboxes' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 2) ? TabStyle.activeText : TabStyle.inActiveText}>
                    GHI CHÚ
                                </Text>
                </TabHeading>
              }>
                <Content>
                  <Form>
                    <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
                  </Form>
                </Content>
              </Tab>
            </Tabs>
          )
        } else {
          bodyContent = (
            <Tabs
              initialPage={this.state.currentTabIndex}
              onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
              tabContainerStyle={{ height: moderateScale(47, 0.97) }}
              tabBarUnderlineStyle={TabStyle.underLineStyle}>
              <Tab heading={
                <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-chatboxes' style={TabStyle.activeText} />
                  <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                    GHI CHÚ
                                </Text>
                </TabHeading>
              }>
                <Content>
                  <Form>
                    <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
                  </Form>
                </Content>
              </Tab>
            </Tabs>
          )
        }
      }
    }

    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToDetail()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              {this.state.stepName}
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={() => this.saveFlow()}>
              <RneIcon name='md-send' size={moderateScale(27, 0.79)} color={COMMON_COLOR.WHITE} type='ionicon' />
            </TouchableOpacity>
          </Right>
        </Header>
        {
          renderIf(this.state.loadingData)(
            dataLoading(true)
          )
        }

        {
          renderIf(!this.state.loadingData)(
            bodyContent
          )
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
    mainProcessUser: state.workflowState.mainProcessUser,
    joinProcessUsers: state.workflowState.joinProcessUsers,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
    hasAuthorization: state.navState.hasAuthorization,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetProcessUsers: (workflowProcessType) => dispatch(workflowAction.resetProcessUsers(workflowProcessType)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkflowStreamProcess);
