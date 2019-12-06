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
import { API_URL, Colors, DATXE_CONSTANT, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
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
import { carApi, tripApi } from '../../../common/Api';

const CarApi = carApi(),
  TripApi = tripApi();

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
      tripId: 0,
    };

    this.onNavigate = this.onNavigate.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
    // this.fetchTripData();
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

    const {
      registrationId, userId
    } = this.state;

    const resultJson = await CarApi.getDetail([
      registrationId,
      userId
    ]);
    const tripResultJson = await TripApi.getDetailByRegistrationId([
      registrationId,
      userId
    ]);

    await asyncDelay();

    this.setState({
      loading: false,
      registrationInfo: resultJson.Status ? resultJson.Params : null,
      tripInfo: tripResultJson.Status ? tripResultJson.Params : null,
      tripId: tripResultJson.Status ? tripResultJson.Params.entity.ID : 0
    });
  }
  fetchTripData = async () => {
    this.setState({
      loading: true
    });

    const resultJson = await TripApi.getDetailByRegistrationId([
      registrationId,
      userId
    ]);

    await asyncDelay();

    this.setState({
      loading: false,
      tripInfo: resultJson.Status ? resultJson.Params : null,
    });
  }

  navigateBack = () => {
    if (this.state.registrationInfo && this.state.registrationInfo.hasOwnProperty("entity")) { // done loading
      // if (this.state.from === "list") {
      //   // this.props.updateExtendsNavParams({ check: this.state.check })
      // }
      // else {
      //   this.props.updateExtendsNavParams({ from: "detail" });
      // }
      if (this.state.from === "create") {
        this.props.updateExtendsNavParams({ check: true });
        this.props.navigation.pop(2);
      }
      else {
        this.props.updateExtendsNavParams({ check: this.state.check });
      }
      this.props.navigation.goBack();
    }
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

  onConfirmActionForRegistration = (actionId = 1) => {
    switch (actionId) {
      case 1:
        this.refs.confirmSendRegistration.showModal();
        break;
      case 2:
        this.refs.confirmCancelRegistration.showModal();
        break;
      case 3:
        this.refs.confirmCheckRegistration.showModal();
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

    const resultJson = await CarApi.sendRegistration({
      registrationId,
      currentUserId: userId
    });

    this.setState({
      executing: false
    })

    Toast.show({
      text: resultJson.Status ? 'Gửi yêu cầu đăng ký xe thành công' : 'Gửi yêu cầu đăng ký xe thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.setState({
            check: true
          }, () => this.fetchData());
        }
      }
    });
  }
  onCheckRegistration = async () => {
    this.refs.confirmCheckRegistration.closeModal();
    const {
      userId, registrationId
    } = this.state;

    this.setState({
      executing: true
    });

    const resultJson = await CarApi.checkRegistration({
      registrationId,
      userId
    });

    this.setState({
      executing: false
    })

    Toast.show({
      text: resultJson.Status ? 'Duyệt yêu cầu đăng ký xe thành công' : 'Duyệt yêu cầu đăng ký xe thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.setState({
            check: true
          }, () => this.fetchData());
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

    const resultJson = await CarApi.cancelRegistration({
      registrationId,
      currentUserId: userId
    });

    this.setState({
      executing: false
    })

    Toast.show({
      text: resultJson.Status ? 'Huỷ yêu cầu đăng ký xe thành công' : 'Huỷ yêu cầu đăng ký xe thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.setState({
            check: true
          }, () => this.fetchData());
        }
      }
    });
  }
  onCancelRegistration_New = () => {
    const targetScreenParam = {
      registrationId: this.state.registrationId,
    };
    this.onNavigate("CancelRegistrationScreen", targetScreenParam);
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

  //TODO: update tripID
  onConfirmActionForTrip = (actionId = 1) => {
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
      tripId, userId
    } = this.state;

    this.setState({
      executing: true
    });

    const resultJson = await TripApi.startTrip({
      tripId,
      userId
    });

    this.setState({
      executing: false
    })

    Toast.show({
      text: resultJson.Status ? 'Bắt đầu chạy xe thành công' : 'Bắt đầu chạy xe thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.setState({
            check: true
          }, () => this.fetchData());
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
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      //DONE: check trangthai_id to change bodyContent
      if (this.state.tripInfo) {
        const {
          entity, canChangeCarTripStatus
        } = this.state.tripInfo;
        if (canChangeCarTripStatus) {
          switch (entity.TRANGTHAI) {
            case DATXE_CONSTANT.CHUYEN_STATUS.MOI_TAO:
              workflowButtons.push({
                element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmActionForTrip(1)}><RNText style={ButtonGroupStyle.buttonText}>BẮT ĐẦU</RNText></RnButton>
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
        }
        bodyContent = (
          <DetailContent registrationInfo={this.state.registrationInfo} tripInfo={this.state.tripInfo} buttons={workflowButtons} navigateToEvent={this.navigateToEvent} />
        );
      }
      else if (this.state.registrationInfo) {
        const {
          canSendRegistration, canRecieveRegistratiion, canCheckRegistration, canCancelRegistration
        } = this.state.registrationInfo;

        if (canSendRegistration) {
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmActionForRegistration(1)}><RNText style={ButtonGroupStyle.buttonText}>GỬI YÊU CẦU</RNText></RnButton>
          });
        }
        else if (canCheckRegistration) {
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmActionForRegistration(3)}><RNText style={ButtonGroupStyle.buttonText}>DUYỆT XE</RNText></RnButton>
          });
        }
        else if (canRecieveRegistratiion) {
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onCreateTrip()}><RNText style={ButtonGroupStyle.buttonText}>TIẾP NHẬN</RNText></RnButton>
          });
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onCancelTrip()}><RNText style={ButtonGroupStyle.buttonText}>KHÔNG TIẾP NHẬN</RNText></RnButton>
          });
        }
        if (canCancelRegistration) {
          workflowButtons.push({
            // element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmActionForRegistration(2)}><RNText style={ButtonGroupStyle.buttonText}>HUỶ</RNText></RnButton>
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onCancelRegistration_New()}><RNText style={ButtonGroupStyle.buttonText}>HUỶ</RNText></RnButton>
          });
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
          ref="confirmCheckRegistration"
          title="XÁC NHẬN DUYỆT YÊU CẦU"
          bodyText="Bạn có chắc chắn muốn duyệt yêu cầu đăng ký xe này?"
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
      selectedTabIndex: 0,
      registrationInfo: props.registrationInfo,
      registrationId: props.registrationId,
      tripInfo: props.tripInfo || null
    }
  }

  render() {
    // console.tron.log(this.state)
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.tripInfo
            ? <Tabs
              initialPage={0}
              tabBarUnderlineStyle={TabStyle.underLineStyle}
              onChangeTab={({ selectedTabIndex }) => this.setState({ selectedTabIndex })}>
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
