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
import InfoMeetingDay from './InfoMeetingDay';
import AlertMessage from '../../common/AlertMessage';

class DetailMeetingDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userInfo.ID,
      loading: false,
      lichhopInfo: {},
      lichhopId: this.props.coreNavParams.lichhopId,
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

    const url = `${API_URL}/api/MeetingRoom/DetailLichhop/${this.state.lichhopId}/${this.state.userId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    await asyncDelay(2000);

    this.setState({
      loading: false,
      lichhopInfo: resultJson === null ? {} : resultJson,
    });
  }

  navigateBack = () => {
    if (this.state.lichhopInfo.hasOwnProperty("entity")) { // done loading
      if (this.state.from === "list") {
        this.props.updateExtendsNavParams({ check: this.state.check })
      }
      else if (this.state.from === "createMeetingDay") {
        this.props.updateExtendsNavParams({ check: true });
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
        this.refs.confirmCancelRegistration.showModal();
        break;
      default:
        break;
    }
  }

  onSelectRoom = () => {
    const targetScreenParam = {
      lichhopId: this.state.lichhopId,
    };
    this.onNavigate("PickMeetingRoomScreen", targetScreenParam);
  }
  onCancelRoom = async () => {
    this.refs.confirmCancelRegistration.closeModal();
    const {
      userId, lichhopId
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
      lichhopId,
      userId
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
      text: 'Huỷ đặt phòng họp ' + resultJson.Status ? 'thành công' : 'thất bại',
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

  onNavigate(targetScreenName, targetScreenParam) {
    if (!util.isNull(targetScreenParam)) {
      this.props.updateExtendsNavParams(targetScreenParam);
    }
    this.props.navigation.navigate(targetScreenName);
  }

  render() {
    const {
      canBookingRoom, entity
    } = this.state.lichhopInfo;
    let bodyContent = null;
    let workflowButtons = [];
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      if (canBookingRoom) {
        if (entity.PHONGHOP_ID) {
          workflowButtons.push({
            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmAction(1)}><RNText style={ButtonGroupStyle.buttonText}>HUỶ ĐẶT PHÒNG</RNText></RnButton>
          })
        }
        // else{
        //   workflowButtons.push({
        //     element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onSelectRoom()}><RNText style={ButtonGroupStyle.buttonText}>ĐẶT PHÒNG</RNText></RnButton>
        //   })
        // }
      }

      bodyContent = <DetailContent lichhopInfo={this.state.lichhopInfo} buttons={workflowButtons} />
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              THÔNG TIN LỊCH HỌP
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
          ref="confirmCancelRegistration"
          title="XÁC NHẬN HUỶ ĐẶT PHÒNG"
          bodyText="Bạn có chắc chắn muốn hủy đặt phòng họp này?"
          exitText="Hủy bỏ"
        >
          <View style={AlertMessageStyle.leftFooter}>
            <RnButton onPress={() => this.onCancelRoom()} style={AlertMessageStyle.footerButton}>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailMeetingDay);

//THÔNG TIN VĂN BẢN
class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      lichhopInfo: props.lichhopInfo,
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          <InfoMeetingDay info={this.state.lichhopInfo} />
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
