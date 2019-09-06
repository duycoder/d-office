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

class DetailRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,
      loading: false,
      isUnAuthorize: false,
      registrationInfo: {},
      registrationId: this.props.coreNavParams.registrationId,
      executing: false,

      check: false,
      hasAuthorization: props.hasAuthorization || 0,
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

    const url = `${API_URL}/api/CarRegistration/DetailCarRegistration/${this.state.registrationId}/${this.state.userId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      registrationInfo: resultJson === null ? {} : resultJson.Params,
    });
  }

  navigateBack = () => {
    if (this.state.registrationInfo.hasOwnProperty("entity")) { // done loading
      if (this.state.from === "list") {
        this.props.updateExtendsNavParams({ check: this.state.check })
      }
      else {
        this.props.updateExtendsNavParams({ from: "detail" });
      }
    }
    this.props.navigation.goBack();
  }

  navigateToEvent = (eventId) => {
    if (eventId > 0) {
      this.props.navigation.navigate("DetailEventScreen", { id: eventId });
    }
    else {
      Toast.show({
        text: 'Không tìm thấy lịch công tác yêu cầu',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
  }

  onConfirmAction = (actionId = 1) => {
    switch (actionId) {
      case 1:
        this.refs.confirmSendRegistration.showModal();
        break;
      case 2:
        this.refs.confirmCancelRegistration.showModal();
        break;
      default:
        break;
    }
  }
  onSendRegistration = async () => {
    this.refs.confirmSendRegistration.closeModal();
    const {
      userId, registrationId
    } = this.state;

    this.setState({
      executing: true
    });

    const url = `${API_URL}/api/CarRegistration/SendCarRegistration`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });
    const body = JSON.stringify({
      registrationId,
      currentUserId: userId
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
      text: 'Gửi yêu cầu đăng ký xe ' + resultJson.Status ? 'thành công' : 'thất bại',
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
  onCancleRegistration = async () => {
    this.refs.confirmCancelRegistration.closeModal();
    const {
      userId, registrationId
    } = this.state;

    this.setState({
      executing: true
    });

    const url = `${API_URL}/api/CarRegistration/CancelRegistration`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });
    const body = JSON.stringify({
      registrationId,
      currentUserId: userId
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
      text: 'Huỷ yêu cầu đăng ký xe ' + resultJson.Status ? 'thành công' : 'thất bại',
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
  onCreateTrip = () => {
    const targetScreenParam = {
      registrationId: this.state.registrationId,
    };
    this.onNavigate("CreateTripScreen", targetScreenParam);
  }
  onCancelTrip = () => {
    const targetScreenParam = {
      registrationId: this.state.registrationId,
    };
    this.onNavigate("RejectTripScreen", targetScreenParam);
  }



  onNavigate(targetScreenName, targetScreenParam) {
    if (!util.isNull(targetScreenParam)) {
      this.props.updateExtendsNavParams(targetScreenParam);
    }
    this.props.navigation.navigate(targetScreenName);
  }

  render() {
    const {
      canSendRegistration, canRecieveRegistratiion
    } = this.state.registrationInfo;
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      if (canSendRegistration) {
        workflowButtons.push({
          element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmAction(1)}><RNText style={ButtonGroupStyle.buttonText}>GỬI YÊU CẦU</RNText></RnButton>
        })
      }
      else if (canRecieveRegistratiion) {
        workflowButtons.push({
          element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onCreateTrip()}><RNText style={ButtonGroupStyle.buttonText}>TIẾP NHẬN</RNText></RnButton>
        })
        workflowButtons.push({
          element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onCancelTrip()}><RNText style={ButtonGroupStyle.buttonText}>KHÔNG TIẾP NHẬN</RNText></RnButton>
        })
      }
      if (this.state.registrationInfo.entity.NGUOITAO === this.state.userId && this.state.registrationInfo.entity.TRANGTHAI != DATXE_CONSTANT.DATXE_STATUS.DA_HUY && this.state.registrationInfo.entity.TRANGTHAI < DATXE_CONSTANT.DATXE_STATUS.DANG_THUC_HIEN) {
        workflowButtons.push({
          element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmAction(2)}><RNText style={ButtonGroupStyle.buttonText}>HUỶ</RNText></RnButton>
        })
      }
      bodyContent = <DetailContent registrationInfo={this.state.registrationInfo} buttons={workflowButtons} navigateToEvent={this.navigateToEvent} />
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÔNG TIN ĐĂNG KÝ XE
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
          ref="confirmSendRegistration"
          title="XÁC NHẬN GỬI YÊU CẦU"
          bodyText="Bạn có chắc chắn muốn gửi yêu cầu đăng ký xe này?"
          exitText="Hủy bỏ"
        >
          <View style={AlertMessageStyle.leftFooter}>
            <RnButton onPress={() => this.onSendRegistration()} style={AlertMessageStyle.footerButton}>
              <RNText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>Đồng ý</RNText>
            </RnButton>
          </View>
        </AlertMessage>

        <AlertMessage
          ref="confirmCancelRegistration"
          title="XÁC NHẬN HUỶ YÊU CẦU"
          bodyText="Bạn có chắc chắn muốn huỷ yêu cầu đăng ký xe này?"
          exitText="Hủy bỏ"
        >
          <View style={AlertMessageStyle.leftFooter}>
            <RnButton onPress={() => this.onCancleRegistration()} style={AlertMessageStyle.footerButton}>
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
    hasAuthorization: state.navState.hasAuthorization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailRegistration);

//THÔNG TIN VĂN BẢN
class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      registrationInfo: props.registrationInfo,
      registrationId: props.registrationId,
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          // this.state.registrationInfo.TRANGTHAI >= DATXE_CONSTANT.DATXE_STATUS.DANG_THUC_HIEN
          // ? null
          <RegistrationInfo info={this.state.registrationInfo} navigateToEvent={this.props.navigateToEvent} />
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
          //         <MainInfoPublishDoc info={this.state.registrationInfo} hasAuthorization={this.state.hasAuthorization} navigateToEvent={this.props.navigateToEvent} />
          //       </Tab>

          //       <Tab heading={
          //         <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
          //           <Icon name='ios-attach' style={TabStyle.activeText} />
          //           <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
          //             ĐÍNH KÈM
          //                       </Text>
          //         </TabHeading>
          //       }>
          //         <AttachPublishDoc info={this.state.registrationInfo.groupOfTaiLieuDinhKems} registrationId={this.state.registrationId} />
          //       </Tab>

          //       <Tab heading={
          //         <TabHeading style={(this.state.currentTabIndex == 3 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
          //           <RneIcon name='clock' color={Colors.DANK_BLUE} type='feather' />
          //           <Text style={(this.state.currentTabIndex == 3 ? TabStyle.activeText : TabStyle.inActiveText)}>
          //             LỊCH SỬ XỬ LÝ
          //                       </Text>
          //         </TabHeading>
          //       }>
          //         <TimelinePublishDoc info={this.state.registrationInfo} />
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
