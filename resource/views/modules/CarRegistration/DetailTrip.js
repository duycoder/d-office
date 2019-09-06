/**
 * @description: màn hình chi tiết văn bản trình ký
 * @author: duynn
 * @since: 05/06/2018
 */
'use strict'
import React, { Component } from 'react';
import { View, Text as RNText, TouchableOpacity as RnButton } from 'react-native';
//redux
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

//utilities
import { API_URL, Colors, DATXE_CONSTANT } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate } from '../../../common/Utilities';
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
  Icon as RneIcon, ButtonGroup
} from 'react-native-elements';

import renderIf from 'render-if';

//views

import * as navAction from '../../../redux/modules/Nav/Action';
import GoBackButton from '../../common/GoBackButton';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { HeaderMenuStyle, AlertMessageStyle } from '../../../assets/styles';
import RegistrationInfo from './RegistrationInfo';
import AlertMessage from '../../common/AlertMessage';
import TripInfo from './TripInfo';

class DetailTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,
      loading: false,
      isUnAuthorize: false,
      tripInfo: {},
      tripId: this.props.coreNavParams.tripId,
      executing: false,

      check: false,
      from: props.coreNavParams.from || "list", // check if send from `list` or `detail`
    };

    this.onNavigate = this.onNavigate.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();

  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({ check: true }, () => this.fetchData());
          this.props.updateExtendsNavParams({ check: false });
        }
      }
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  async fetchData() {
    this.setState({
      loading: true
    });

    const url = `${API_URL}/api/CarTrip/DetailTrip/${this.state.tripId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      tripInfo: resultJson === null ? {} : resultJson,
    });
  }

  navigateBack = () => {
    if (this.state.tripInfo.hasOwnProperty("entity")) { // done loading
      if (this.state.from === "list") {
        this.props.updateExtendsNavParams({ check: this.state.check })
      }
      else {
        this.props.updateExtendsNavParams({ from: "detail" });
      }
    }
    this.props.navigation.goBack();
  }

  onConfirmAction = (actionId = 1) => {
    switch (actionId) {
      case 1:
        this.refs.confirm.showModal();
        break;
      default:
        break;
    }
  }
  onStartTrip = async () => {
    this.refs.confirm.closeModal();
    const {
      tripId
    } = this.state;

    this.setState({
      executing: true
    });

    const url = `${API_URL}/api/CarTrip/CheckStartTrip?tripId=${tripId}`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });
    const body = JSON.stringify({
      tripId
    });

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      executing: false
    })

    Toast.show({
      text: 'Bắt đầu chạy xe ' + resultJson.Status ? 'thành công' : 'thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: 3000,
      onClose: () => {
        if (resultJson.Status) {
          this.fetchData();
        }
      }
    });
  }
  onReturnTrip = () => {
    const targetScreenParam = {
      tripId: this.state.tripId,
    };
    this.onNavigate("ReturnTripScreen", targetScreenParam);
  }
  
  onNavigate(targetScreenName, targetScreenParam) {
    if (!util.isNull(targetScreenParam)) {
      this.props.updateExtendsNavParams(targetScreenParam);
    }
    this.props.navigation.navigate(targetScreenName);
  }

  render() {
    const {
      TRANGTHAI
    } = this.state.tripInfo;
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      switch (TRANGTHAI) {
        case DATXE_CONSTANT.CHUYEN_STATUS.MOI_TAO:
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmAction(1)}><RNText style={ButtonGroupStyle.buttonText}>BẮT ĐẦU</RNText></RnButton>
          });
          break;
        case DATXE_CONSTANT.CHUYEN_STATUS.DANG_CHAY:
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onReturnTrip()}><RNText style={ButtonGroupStyle.buttonText}>TRẢ XE</RNText></RnButton>
          });
          break;
        default:
          break;
      }
      bodyContent = <DetailContent tripInfo={this.state.tripInfo} buttons={workflowButtons} />
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÔNG TIN CHUYẾN
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>
        {
          bodyContent
        }
        {
          executeLoading(this.state.executing)
        }
        <AlertMessage
          ref="confirm"
          title="XÁC NHẬN BẮT ĐẦU CHẠY"
          bodyText="Bạn có chắc chắn muốn bắt đầu chạy xe này không?"
          exitText="Hủy bỏ"
        >
          <View style={AlertMessageStyle.leftFooter}>
            <RnButton onPress={() => this.onStartTrip()} style={AlertMessageStyle.footerButton}>
              <RNText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>Đồng ý</RNText>
            </RnButton>
          </View>
        </AlertMessage>

      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailTrip);

//THÔNG TIN VĂN BẢN
class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      tripInfo: props.tripInfo,
      tripId: props.tripId,
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          <TripInfo info={this.state.tripInfo} />
          //     <Tabs
          //       renderTabBar={() => <ScrollableTab />}
          //       initialPage={this.state.currentTabIndex}
          //       tabBarUnderlineStyle={TabStyle.underLineStyle}
          //       onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
          //       <Tab heading={
          //         <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
          //           <Icon name='ios-information-circle-outline' style={TabStyle.activeText} />
          //           <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
          //             THÔNG TIN
          //                           </Text>
          //         </TabHeading>
          //       }>
          //         <MainInfoPublishDoc info={this.state.tripInfo} hasAuthorization={this.state.hasAuthorization} navigateToEvent={this.props.navigateToEvent} />
          //       </Tab>

          //       <Tab heading={
          //         <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
          //           <Icon name='ios-attach' style={TabStyle.activeText} />
          //           <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
          //             ĐÍNH KÈM
          //                       </Text>
          //         </TabHeading>
          //       }>
          //         <AttachPublishDoc info={this.state.tripInfo.groupOfTaiLieuDinhKems} tripId={this.state.tripId} />
          //       </Tab>

          //       <Tab heading={
          //         <TabHeading style={(this.state.currentTabIndex == 3 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
          //           <RneIcon name='clock' color={Colors.DANK_BLUE} type='feather' />
          //           <Text style={(this.state.currentTabIndex == 3 ? TabStyle.activeText : TabStyle.inActiveText)}>
          //             LỊCH SỬ XỬ LÝ
          //                       </Text>
          //         </TabHeading>
          //       }>
          //         <TimelinePublishDoc info={this.state.tripInfo} />
          //       </Tab>
          //     </Tabs>

        }
        {
          !util.isEmpty(this.props.buttons) && <ButtonGroup
            containerStyle={ButtonGroupStyle.container}
            buttons={this.props.buttons}
          />
        }
      </View>
    );
  }
}
