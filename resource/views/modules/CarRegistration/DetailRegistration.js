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

class DetailRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,
      loading: false,
      isUnAuthorize: false,
      registrationInfo: null,
      registrationId: this.props.coreNavParams.registrationId,
      executing: false,

      check: false,
      hasAuthorization: props.hasAuthorization || 0,
      from: props.coreNavParams.from || "list", // check if send from `list` or `detail` or `create`
      selectedTabIndex: 0,
      tripInfo: null,
    };

    this.onNavigate = this.onNavigate.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
    this.fetchTripData();
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({ check: true }, () => this.fetchData());
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
      registrationInfo: resultJson.Status ? resultJson.Params : null,
    });
  }
  fetchTripData = async () => {
    this.setState({
      loading: true
    });

    const url = `${API_URL}/api/CarTrip/DetailTripByRegistrationId/${this.state.registrationId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      tripInfo: resultJson.Status ? resultJson.Params : null,
    });
  }

  navigateBack = () => {
    if (this.state.registrationInfo && this.state.registrationInfo.hasOwnProperty("entity")) { // done loading
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

  onConfirmAction = (actionId = 1) => {
    switch (actionId) {
      case 1:
        this.refs.confirmTrip.showModal();
        break;
      default:
        break;
    }
  }
  onStartTrip = async () => {
    this.refs.confirmTrip.closeModal();
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
    console.tron.log(this.state.registrationInfo)
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      //TODO: check trangthai_id to change bodyContent
      if (this.state.tripInfo) {
        const {
          TRANGTHAI
        } = this.state.tripInfo;
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
        bodyContent = (
          <DetailContent registrationInfo={this.state.registrationInfo} tripInfo={this.state.tripInfo} buttons={workflowButtons} navigateToEvent={this.navigateToEvent} />
        );
      }
      else if (this.state.registrationInfo) {
        const {
          canSendRegistration, canRecieveRegistratiion
        } = this.state.registrationInfo;

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
      else {
        bodyContent = null;
      }
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÔNG TIN LỊCH TRÌNH
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

        <AlertMessage
          ref="confirmTrip"
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
      tripInfo: props.tripInfo || null
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.tripInfo
            ? <Tabs
              initialPage={0}
              tabBarUnderlineStyle={TabStyle.underLineStyle}
              onChangeTab={(selectedTabIndex) => this.setState({ selectedTabIndex })}>
              <Tab heading={
                <TabHeading style={(this.state.selectedTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-information-circle-outline' style={TabStyle.activeText} />
                  <Text style={(this.state.selectedTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                    ĐĂNG KÝ XE
                          </Text>
                </TabHeading>
              }>
                <RegistrationInfo info={this.state.registrationInfo} navigateToEvent={this.props.navigateToEvent} />
              </Tab>

              <Tab heading={
                <TabHeading style={(this.state.selectedTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  <Icon name='ios-create' style={TabStyle.activeText} />
                  <Text style={(this.state.selectedTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>
                    CHUYẾN XE
                          </Text>
                </TabHeading>
              }>
                <TripInfo info={this.state.tripInfo} />
              </Tab>
            </Tabs>
            : <RegistrationInfo info={this.state.registrationInfo} navigateToEvent={this.props.navigateToEvent} />
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
