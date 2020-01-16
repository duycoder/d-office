/**
 * @description: màn hình chuyển xử lý văn bản
 * @author: annv
 * @since: 11/12/2019
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, Text as RnText, FlatList } from 'react-native';

//utilites
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, LOADMORE_COLOR, EMPTY_STRING,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, WORKFLOW_PROCESS_TYPE, Colors,
  MODULE_CONSTANT,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import * as util from 'lodash';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//effect
import { dataLoading, executeLoading } from '../../../common/Effect';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Left, Button, Content, Title,
  Tabs, Tab, TabHeading, ScrollableTab, Text, Icon,
  Form, Textarea, Body, Item, Input, Right, Toast,
  Label, ListItem, CheckBox
} from 'native-base';
import renderIf from 'render-if';
import { Icon as RneIcon } from 'react-native-elements';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import GoBackButton from '../../common/GoBackButton';
import { vanbandenApi } from '../../../common/Api';
import { HeaderRightButton, MoreButton } from '../../common';

const api = vanbandenApi();

class WorkflowCC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      processId: props.extendsNavParams.processId || 0,
      idItem: props.extendsNavParams.idItem,
      itemType: props.extendsNavParams.itemType,
      stepId: props.extendsNavParams.stepId || 0,

      executing: false,
      loadingData: false,

      drivers: [],
      message: EMPTY_STRING,

      chosenDrivers: [],

      currentTabIndex: 0,
      driverFilterValue: EMPTY_STRING,

      driverPageIndex: DEFAULT_PAGE_INDEX,
      driverNumber: DEFAULT_PAGE_SIZE,

      //hiệu ứng
      searchingInDriver: false,
      loadingMoreInDriver: false,
    }
  }

  componentDidMount = () => {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      loadingData: true
    });

    const {
      userId, idItem, itemType
    } = this.state;

    const resultJson = await api.getFlowCCHelper([
      idItem,
      itemType,
      userId
    ]);

    this.setState({
      loadingData: false,
      drivers: resultJson.dsNgThamGia || [],
      processId: resultJson.processId || 0,
      stepId: resultJson.stepId || 0
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveTiepnhan = async () => {
    const {
      drivers, chosenDrivers,
      processId, message, userId, stepId
    } = this.state;

    if (drivers.length > 0) {
      if (chosenDrivers.length === 0) {
        Toast.show({
          text: 'Vui lòng chọn người tham gia xử lý',
          type: 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
        });
      }
      else {
        this.setState({
          executing: true
        });

        const resultJson = await api.saveFlowCC({
          processID: processId,
          stepID: stepId,
          joinUser: chosenDrivers.join(","),
          message,
          userId
        });

        this.setState({
          executing: false
        })

        Toast.show({
          text: resultJson.Status ? 'Chuyển xử lý thành công' : 'Chuyển xử lý thất bại',
          type: resultJson.Status ? 'success' : 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
          duration: TOAST_DURATION_TIMEOUT,
          onClose: () => {
            if (resultJson.Status) {
              this.props.updateExtendsNavParams({ check: true });
              this.navigateBack();
            }
          }
        });
      }
    }
  }

  filterDrivers = async () => {
    const {
      driverPageIndex, driverNumber, driverFilterValue, userId
    } = this.state;
    const resultJson = await api.filterFlowCCReceiver([
      driverPageIndex,
      driverNumber,
      `${userId}?query=${driverFilterValue}`
    ])

    this.setState({
      searchingInDriver: false,
      loadingMoreInDriver: false,
      drivers: this.state.searchingInDriver ? (resultJson || []) : [...this.state.drivers, ...(resultJson || [])]
    });
  }

  onFilter = () => {
    this.setState({
      chosenDrivers: [],
      searchingInDriver: true,
      driverPageIndex: DEFAULT_PAGE_INDEX
    }, () => this.filterDrivers());
  }
  onClearFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX,
      driverFilterValue: EMPTY_STRING
    }, () => {
      this.fetchData()
    });
  }

  loadingMore = () => {
    this.setState({
      loadingMoreInDriver: true,
      driverPageIndex: this.state.driverPageIndex + 1
    }, () => this.filterDrivers());
  }

  onSelectDrivers = (driverId) => {
    const tmpChosen = this.state.chosenDrivers,
      index = tmpChosen.indexOf(driverId);
    if (index > -1) {
      tmpChosen.splice(index, 1)
    }
    else {
      tmpChosen.push(driverId)
    }
    this.setState({ chosenDrivers: tmpChosen });
  }

  renderDrivers = ({ item }) => {
    return (
      <ListItem
        key={item.userId.toString()}
        onPress={() => this.onSelectDrivers(item.userId)}
        style={{ height: 60 }}>
        <Left>
          <Title>
            <Text>
              {item.fullname}
            </Text>
          </Title>
        </Left>

        <Body>
          <Text>
            {item.tenChucvu}
          </Text>
        </Body>

        <Right>
          <CheckBox
            onPress={() => this.onSelectDrivers(item.userId)}
            checked={(this.state.chosenDrivers.indexOf(item.userId) > -1)}
            style={{ alignSelf: "center" }}
          />
        </Right>
      </ListItem>
    );
  }

  render() {
    let bodyContent = null;

    if (!this.state.loadingData) {
      bodyContent = (
        <Tabs
          initialPage={this.state.currentTabIndex}
          onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
          tabContainerStyle={{ height: moderateScale(47, 0.97) }}
          tabBarUnderlineStyle={TabStyle.underLineStyle}>
          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
              <Icon name='ios-person' style={TabStyle.activeText} />
              <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>THAM GIA</Text>
            </TabHeading>
          }>
            <Item>
              <Icon name='ios-search' style={{ marginLeft: 5 }} />
              <Input placeholder='Tên người tham gia'
                value={this.state.driverFilterValue}
                onSubmitEditing={() => this.onFilter(true)}
                onChangeText={(driverFilterValue) => this.setState({ driverFilterValue })} />
              {
                (this.state.driverFilterValue !== EMPTY_STRING)
                && <Icon name='ios-close-circle' onPress={() => this.onClearFilter(true)} />
              }
            </Item>

            <Content contentContainerStyle={{ flex: 1 }}>
              {
                renderIf(this.state.searchingInDriver)(
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                  </View>
                )
              }

              {
                renderIf(!this.state.searchingInDriver)(
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.drivers}
                    renderItem={this.renderDrivers}
                    ListEmptyComponent={
                      this.state.loadingData ? null : emptyDataPage()
                    }
                    ListFooterComponent={() => (<MoreButton
                      isLoading={this.state.loadingMoreInDriver}
                      isTrigger={this.state.drivers.length >= 5}
                      loadmoreFunc={this.loadingMore}
                    />)}
                  />
                )
              }
            </Content>
          </Tab>

          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
              <Icon name='ios-chatboxes' style={TabStyle.activeText} />
              <Text style={(this.state.currentTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>GHI CHÚ</Text>
            </TabHeading>
          }>
            <Content contentContainerStyle={{ padding: 5 }}>
              <Form>
                <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
              </Form>
            </Content>
          </Tab>
        </Tabs>
      );
    }

    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CHUYỂN XỬ LÝ
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton onPress={() => this.saveTiepnhan()} />
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
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowCC);
