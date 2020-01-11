
/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, Image,
  ImageBackground, Modal,
  TouchableOpacity, StatusBar
} from 'react-native';
import { NavigationActions } from 'react-navigation';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../redux/modules/Nav/Action';
//native-base
import {
  Container, Header, Content,
  Left, Right, Body, Title, Footer, FooterTab, Badge, Button, Icon as NBIcon, Subtitle
} from 'native-base';

import { ListItem, Icon } from 'react-native-elements';
import renderIf from 'render-if';

import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import { NativeBaseStyle } from '../../assets/styles/NativeBaseStyle';

import * as SBIcons from '../../assets/styles/SideBarIcons';

import Panel from './Panel';
import GridPanel from './GridPanel';
import Confirm from './Confirm';
import { width, Colors, SIDEBAR_CODES, DM_FUNCTIONS, EMPTY_STRING, SYSTEM_FUNCTION, API_URL, generateTitle } from '../../common/SystemConstant';
import Images from '../../common/Images';
// import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
import GoBackButton from './GoBackButton';
import { accountApi } from '../../common/Api';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN, TIENICH } = DM_FUNCTIONS;
const { LichCongTacFunction, TienichFunction } = SYSTEM_FUNCTION;

const api = accountApi();

class ExtendKeyFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userInfo: {},
      onFocusNow: '',
      notifyCount: 0,
      userFunctions: [],

      notifyCount_Lichhop: 0,
      notifyCount_Datxe: 0,
      notifyCount_Chuyenxe: 0,
      notifyCount_Uyquyen: 0,
      notifyCount_Lichtruc: 0,
      notifyCount_Nhacviec: 0,
    }
  }

  fetchNotifyCount = async () => {
    const result = await api.getNotifyCount([
      this.state.userInfo.ID
    ]);
    this.setState({
      notifyCount_Lichhop: result.notifyCount_Lichhop || 0,
      notifyCount_Datxe: result.notifyCount_Datxe || 0,
      notifyCount_Chuyenxe: result.notifyCount_Chuyenxe || 0,
      notifyCount_Uyquyen: result.notifyCount_Uyquyen || 0,
      notifyCount_Lichtruc: result.notifyCount_Lichtruc || 0,
      notifyCount_Nhacviec: result.notifyCount_Nhacviec || 0,
    });
  }

  async componentWillMount() {
    const storageUserInfo = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(storageUserInfo);
    this.setState({
      userInfo,
      onFocusNow: userInfo.hasRoleAssignUnit ? VANBANDI._CHUAXULY : VANBANDEN._CHUAXULY,
      notifyCount: userInfo.numberUnReadMessage,
      userFunctions: userInfo.GroupUserFunctions
    });
    this.fetchNotifyCount();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
      this.fetchNotifyCount();
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  navigate(screenName) {
    this.props.navigation.push(screenName);
  }

  onLogOut() {
    this.refs.confirm.showModal();
  }

  setCurrentFocus(screenName, ref, actionCode = EMPTY_STRING) {
    this.setState({
      onFocusNow: ref,
      notifyCount: 0
    });
    // check authorize
    if (actionCode.includes("UYQUYEN")) {
      this.props.updateAuthorization(1);
    }
    else {
      this.props.updateAuthorization(0);
    }
    const webviewUrl = ref || "";
    this.props.updateExtendsNavParams({
      webviewUrl
    });
    // console.tron.log("WebviewUrl: " + webviewUrl)
    // console.tron.log("ScreenName: "+ screenName)
    this.props.navigation.navigate(screenName);
  }

  generateNotifyCount = (maThaotac) => {
    const {
      notifyCount_Lichhop, notifyCount_Chuyenxe, notifyCount_Datxe, notifyCount_Lichtruc, notifyCount_Uyquyen, notifyCount_Nhacviec,
    } = this.state;

    switch (maThaotac) {

      case TIENICH._DS_YEUCAU_XE.NAME:
        return notifyCount_Datxe;
      case TIENICH._DS_CHUYEN.NAME:
        return notifyCount_Chuyenxe;
      case TIENICH._DS_LICHHOP.NAME:
        return notifyCount_Lichhop;
      case TIENICH._DS_UYQUYEN.NAME:
        return notifyCount_Uyquyen;
      case TIENICH._DS_LICHTRUC.NAME:
        return notifyCount_Lichtruc;
      case TIENICH._DS_NHACNHO.NAME:
        return notifyCount_Nhacviec;
      default:
        break;
    }

    return 0;
  }

  moveToSpecialScreen = (webviewUrl = "", screenTitle = "", screenName = "WebViewerScreen") => {
    this.props.updateExtendsNavParams({
      webviewUrl,
      screenTitle
    });
    this.props.navigation.navigate(screenName);
  }

  render() {
    const { notifyCount, userFunctions, onFocusNow } = this.state;
    // console.tron.log(userFunctions)
    return (
      <View style={SideBarStyle.container}>
        <StatusBar barStyle="light-content" />
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.props.navigation.goBack()} buttonStyle='100%' />
          </Left>
          <Body style={{ alignItems: 'center', flex: 5 }}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TIỆN ÍCH
            </Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>

        <View style={[SideBarStyle.body]}>
          <ScrollView contentContainerStyle={{ paddingVertical: moderateScale(6, 1.2) }}>
            {
              userFunctions && userFunctions.map((item, index) => {
                if (item.MA_CHUCNANG.indexOf("HSCV_TIENICH") < 0) {
                  return null;
                }
                return <GridPanel
                  title={item.TEN_CHUCNANG.replace("Quản lý ", "")}
                  key={item.DM_CHUCNANG_ID.toString()}
                >
                  {
                    item.ListThaoTac.map((sItem, sIndex) => {
                      const renderCondition = sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE;
                      if (renderCondition) {
                        if (sItem.MA_THAOTAC.match(/^KHAC_/)) {
                          return <TouchableOpacity
                            style={SideBarStyle.normalBoxStyle}
                            key={sItem.DM_THAOTAC_ID.toString()}
                            onPress={() => this.moveToSpecialScreen(sItem.MENU_LINK, sItem.TEN_THAOTAC)}
                          >
                            <SideBarIcon
                              actionCode={TienichFunction.actionCodes[6]}
                            />
                            <Text style={SideBarStyle.normalBoxTextStyle}>{sItem.TEN_THAOTAC}</Text>
                          </TouchableOpacity>;
                        }

                        return <TouchableOpacity
                          style={SideBarStyle.normalBoxStyle}
                          key={sItem.DM_THAOTAC_ID.toString()}
                          onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.MENU_LINK, item.MA_CHUCNANG)}
                        >
                          <SideBarIcon
                            actionCode={sItem.MA_THAOTAC}
                            notifyCount={this.generateNotifyCount(sItem.MA_THAOTAC)}
                          />
                          <Text style={SideBarStyle.normalBoxTextStyle}>{sItem.TEN_THAOTAC_MOBILE || generateTitle(sItem.MA_THAOTAC)}</Text>
                        </TouchableOpacity>;
                      }
                      else {
                        return null;
                      }
                    })
                  }
                </GridPanel>
              })
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(null, mapDispatchToProps)(ExtendKeyFunction);