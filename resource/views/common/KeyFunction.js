
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
import { width, Colors, SIDEBAR_CODES, DM_FUNCTIONS, EMPTY_STRING, SYSTEM_FUNCTION, API_URL } from '../../common/SystemConstant';
import Images from '../../common/Images';
// import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
import GoBackButton from './GoBackButton';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN, TIENICH } = DM_FUNCTIONS;
const { LichCongTacFunction } = SYSTEM_FUNCTION;

class KeyFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userInfo: {},
      onFocusNow: '',
      notifyCount: 0,
      userFunctions: [],

      notifyCount_VBDen_Chuaxuly: 0,
      notifyCount_VBDen_Noibo_Chuaxuly: 0,
      notifyCount_VBDen_Thamgiaxuly: 0,

      notifyCount_VBDi_Chuaxuly: 0,
      notifyCount_VBDi_Thamgiaxuly: 0,
      notifyCount_VBDi_Dabanhanh: 0,

      notifyCount_CV_Canhan: 0,
      notifyCount_CV_Duocgiao: 0,
      notifyCount_CV_Choxacnhan: 0,
      notifyCount_CV_Phoihopxuly: 0,

      notifyCount_Lichhop: 0,
      notifyCount_Datxe: 0,
      notifyCount_Chuyenxe: 0,
      notifyCount_Uyquyen: 0,
      notifyCount_Lichtruc: 0,
    }
  }

  fetchNotifyCount = async () => {
    const url = `${API_URL}/api/Account/GetNumberOfMessagesOfUser/${this.state.userInfo.ID}`;
    const result = await fetch(url).then(response => response.json());
    this.setState({
      notifyCount_VBDen_Chuaxuly: result.notifyCount_VBDen_Chuaxuly || 0,
      notifyCount_VBDen_Noibo_Chuaxuly: result.notifyCount_VBDen_Noibo_Chuaxuly || 0,
      notifyCount_VBDen_Thamgiaxuly: result.notifyCount_VBDen_Thamgiaxuly || 0,

      notifyCount_VBDi_Chuaxuly: result.notifyCount_VBDi_Chuaxuly || 0,
      notifyCount_VBDi_Thamgiaxuly: result.notifyCount_VBDi_Thamgiaxuly || 0,
      notifyCount_VBDi_Dabanhanh: result.notifyCount_VBDi_Dabanhanh || 0,

      notifyCount_CV_Canhan: result.notifyCount_CV_Canhan || 0,
      notifyCount_CV_Duocgiao: result.notifyCount_CV_Duocgiao || 0,
      notifyCount_CV_Choxacnhan: result.notifyCount_CV_Choxacnhan || 0,
      notifyCount_CV_Phoihopxuly: result.notifyCount_CV_Phoihopxuly || 0,

      notifyCount_Lichhop: result.notifyCount_Lichhop || 0,
      notifyCount_Datxe: result.notifyCount_Datxe || 0,
      notifyCount_Chuyenxe: result.notifyCount_Chuyenxe || 0,
      notifyCount_Uyquyen: result.notifyCount_Uyquyen || 0,
      notifyCount_Lichtruc: result.notifyCount_Lichtruc || 0,
    });
  }

  async componentWillMount() {
    const storageUserInfo = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(storageUserInfo);
    this.setState({
      userInfo,
      // onFocusNow: userInfo.hasRoleAssignUnit ? VANBANDI._CHUAXULY : VANBANDEN._CHUAXULY,
      notifyCount: userInfo.numberUnReadMessage,
      userFunctions: userInfo.GroupUserFunctions
    });
    this.fetchNotifyCount();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      this.fetchNotifyCount();
      // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
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
      // onFocusNow: ref,
      notifyCount: 0
    });
    // check authorize
    if (actionCode.includes("UYQUYEN")) {
      this.props.updateAuthorization(1);
    }
    else {
      this.props.updateAuthorization(0);
    }
    // Reset Route
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: screenName })] // navigate
    // });
    // this.props.navigation.dispatch(resetAction);
    const webviewUrl = ref || "";
    this.props.extendsNavParams({
      webviewUrl
    });

    this.props.navigation.navigate(screenName);
  }

  generateNotifyCount = (maThaotac) => {
    const {
      notifyCount_VBDen_Chuaxuly, notifyCount_VBDen_Noibo_Chuaxuly, notifyCount_VBDen_Thamgiaxuly,
      notifyCount_VBDi_Chuaxuly, notifyCount_VBDi_Dabanhanh, notifyCount_VBDi_Thamgiaxuly,
      notifyCount_CV_Canhan, notifyCount_CV_Choxacnhan, notifyCount_CV_Duocgiao, notifyCount_CV_Phoihopxuly,
      notifyCount_Lichhop, notifyCount_Chuyenxe, notifyCount_Datxe, notifyCount_Lichtruc, notifyCount_Uyquyen
    } = this.state;

    switch (maThaotac) {
      case VANBANDEN._CHUAXULY.NAME:
        return notifyCount_VBDen_Chuaxuly;
      case VANBANDEN._NOIBO_CHUAXULY.NAME:
        return notifyCount_VBDen_Noibo_Chuaxuly;
      case VANBANDEN._THAMGIA_XULY.NAME:
        return notifyCount_VBDen_Thamgiaxuly;
        break;

      case VANBANDI._CHUAXULY.NAME:
        return notifyCount_VBDi_Chuaxuly;
      case VANBANDI._DA_BANHANH.NAME:
        return notifyCount_VBDi_Dabanhanh;
      case VANBANDI._THAMGIA_XULY.NAME:
        return notifyCount_VBDi_Thamgiaxuly;

      case CONGVIEC._CANHAN.NAME:
        return notifyCount_CV_Canhan;
      case CONGVIEC._DUOCGIAO.NAME:
        return notifyCount_CV_Duocgiao;
      case CONGVIEC._PHOIHOPXULY.NAME:
        return notifyCount_CV_Phoihopxuly;
      case CONGVIEC._PROCESSED_JOB.NAME:
        return notifyCount_CV_Choxacnhan;

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
      default:
        break;
    }

    return 0;
  }

  generateTitle(maThaotac) {
    let tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
    switch (maThaotac) {
      case VANBANDEN._CHUAXULY.NAME:
        tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
        break;
      case VANBANDEN._DAXULY.NAME:
        tenThaotac = VANBANDEN._DAXULY.MOBILENAME;
        break;
      case VANBANDEN._NOIBO_CHUAXULY.NAME:
        tenThaotac = VANBANDEN._NOIBO_CHUAXULY.MOBILENAME;
        break;
      case VANBANDEN._NOIBO_DAXULY.NAME:
        tenThaotac = VANBANDEN._NOIBO_DAXULY.MOBILENAME;
        break;
      case VANBANDEN._THAMGIA_XULY.NAME:
        tenThaotac = VANBANDEN._THAMGIA_XULY.MOBILENAME;
        break;

      case VANBANDI._CHUAXULY.NAME:
        tenThaotac = VANBANDI._CHUAXULY.MOBILENAME;
        break;
      case VANBANDI._DAXULY.NAME:
        tenThaotac = VANBANDI._DAXULY.MOBILENAME;
        break;
      case VANBANDI._DA_BANHANH.NAME:
        tenThaotac = VANBANDI._DA_BANHANH.MOBILENAME;
        break;
      case VANBANDI._THAMGIA_XULY.NAME:
        tenThaotac = VANBANDI._THAMGIA_XULY.MOBILENAME;
        break;

      case CONGVIEC._CANHAN.NAME:
        tenThaotac = CONGVIEC._CANHAN.MOBILENAME;
        break;
      case CONGVIEC._DUOCGIAO.NAME:
        tenThaotac = CONGVIEC._DUOCGIAO.MOBILENAME;
        break;
      case CONGVIEC._PHOIHOPXULY.NAME:
        tenThaotac = CONGVIEC._PHOIHOPXULY.MOBILENAME;
        break;
      case CONGVIEC._PROCESSED_JOB.NAME:
        tenThaotac = CONGVIEC._PROCESSED_JOB.MOBILENAME;
        break;

      case TIENICH._DS_YEUCAU_XE.NAME:
        tenThaotac = TIENICH._DS_YEUCAU_XE.MOBILENAME;
        break;
      case TIENICH._DS_CHUYEN.NAME:
        tenThaotac = TIENICH._DS_CHUYEN.MOBILENAME;
        break;
      case TIENICH._DS_LICHHOP.NAME:
        tenThaotac = TIENICH._DS_LICHHOP.MOBILENAME;
        break;
      case TIENICH._DS_UYQUYEN.NAME:
        tenThaotac = TIENICH._DS_UYQUYEN.MOBILENAME;
        break;
      case TIENICH._DS_LICHTRUC.NAME:
        tenThaotac = TIENICH._DS_LICHTRUC.MOBILENAME;
        break;
      case TIENICH._DS_NHACNHO.NAME:
        tenThaotac = TIENICH._DS_NHACNHO.MOBILENAME;
        break;
      case TIENICH._KHAC.NAME:
        tenThaotac = TIENICH._KHAC.MOBILENAME;
        break;
      // case LICHCONGTAC_LANHDAO._DANHSACH.NAME:
      //   tenThaotac = LICHCONGTAC_LANHDAO._DANHSACH.MOBILENAME;
      //   break;

      // case QUANLY_UYQUYEN._DANHSACH.NAME:
      //   tenThaotac = QUANLY_UYQUYEN._DANHSACH.MOBILENAME;
      //   break;

      default:
        break;
    }
    return tenThaotac.charAt(0).toUpperCase() + tenThaotac.slice(1).toLowerCase();
  }

  render() {
    const { notifyCount, userFunctions, onFocusNow } = this.state;
    const subItemIcon = <Image source={Images.subItemIconLink} />;
    const mainItemIcon = <Icon name='chevron-right' type='entypo' size={verticalScale(30)} color={Colors.GRAY} />
    let notificationIcon = <View></View>;
    if (notifyCount > 0 && notifyCount < 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={SideBarStyle.chatNotificationCircle}>
          <Text style={SideBarStyle.chatNotificationText}>
            {notifyCount}
          </Text>
        </View>
      </View>
    }
    if (notifyCount >= 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, { width: moderateScale(25), height: moderateScale(25), borderRadius: moderateScale(25 / 2) }]}>
          <Text style={SideBarStyle.chatNotificationText}>
            99+
                </Text>
        </View>
      </View>
    }
    // console.tron.log(userFunctions)
    return (
      <View style={SideBarStyle.container}>
        <StatusBar barStyle="light-content" />
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={{ flex: 1 }} />
          <Body style={{ alignItems: 'center', flex: 8 }}>
            <Title style={{ color: Colors.WHITE }}>
              CHỨC NĂNG CHÍNH
            </Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>

        <View style={[SideBarStyle.body]}>
          <ScrollView contentContainerStyle={{ paddingVertical: moderateScale(6, 1.2) }}>
            {
              // Lấy chức năng của người dùng
              userFunctions && userFunctions.map((item, index) => {
                // let count = 0;
                if (item.MA_CHUCNANG.indexOf("HSCV") < 0) {
                  return null;
                }
                return <GridPanel title={item.TEN_CHUCNANG.replace("Quản lý ", "")} key={item.DM_CHUCNANG_ID.toString()} actionCode={item.MA_CHUCNANG} isParent={true}>
                  {
                    item.ListThaoTac.map((sItem, sIndex) => {
                      const renderCondition = sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE;
                      let elementStyle = SideBarStyle.normalBoxStyle;
                      if (renderCondition) {
                        // if (count % 3 === 1) {
                        //   elementStyle = [SideBarStyle.normalBoxStyle, { marginHorizontal: '5%' }];
                        // }
                        // count++;
                        return <TouchableOpacity
                          style={elementStyle}
                          key={sItem.DM_THAOTAC_ID.toString()}
                          onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DUONG_DAN, item.MA_CHUCNANG)}
                        >
                          <SideBarIcon
                            actionCode={sItem.MA_THAOTAC}
                            notifyCount={this.generateNotifyCount(sItem.MA_THAOTAC)}
                          // customIconContainerStyle={{ flex: 1, marginBottom: '10%' }}
                          />
                          <Text style={SideBarStyle.normalBoxTextStyle}>{this.generateTitle(sItem.MA_THAOTAC)}</Text>
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

        <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
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

export default connect(null, mapDispatchToProps)(KeyFunction);