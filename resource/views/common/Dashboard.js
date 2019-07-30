/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, Image,
  ImageBackground, Modal,
  TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../redux/modules/Nav/Action';
//native-base
import {
  Container, Header, Content,
  Left, Right, Body, Title, Footer, FooterTab, Badge, Button, Icon as NBIcon
} from 'native-base';

import { ListItem, Icon } from 'react-native-elements';
import renderIf from 'render-if';

import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import * as SBIcons from '../../assets/styles/SideBarIcons';

import Panel from './Panel';
import GridPanel from './GridPanel';
import Confirm from './Confirm';
import { width, Colors, SIDEBAR_CODES, DM_FUNCTIONS, EMPTY_STRING } from '../../common/SystemConstant';
import Images from '../../common/Images';
// import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN } = DM_FUNCTIONS;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userInfo: {},
      onFocusNow: '',
      notifyCount: 0,
      userFunctions: []
    }
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
    // Reset Route
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: screenName })] // navigate
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate(screenName);
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

      case LICHCONGTAC_LANHDAO._DANHSACH.NAME:
        tenThaotac = LICHCONGTAC_LANHDAO._DANHSACH.MOBILENAME;
        break;

      case QUANLY_UYQUYEN._DANHSACH.NAME:
        tenThaotac = QUANLY_UYQUYEN._DANHSACH.MOBILENAME;
        break;

      default:
        break;
    }
    return tenThaotac;
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

    return (
      <View style={SideBarStyle.container}>
        <View style={SideBarStyle.header}>
          <ImageBackground source={Images.background} style={SideBarStyle.headerBackground}>
            <View style={SideBarStyle.headerAvatarContainer}>
              <Image source={Images.userAvatar} style={SideBarStyle.headerAvatar} />
            </View>
            <View style={[SideBarStyle.headerUserInfoContainer, { flex: 1 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[SideBarStyle.headerUserName, { flex: 1, flexWrap: 'wrap' }]}>
                  {this.state.userInfo.Fullname}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={[SideBarStyle.headerUserJob, { flex: 1, flexWrap: 'wrap' }]}>
                  {this.state.userInfo.Position}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={SideBarStyle.shortcutBoxContainer}>
          <TouchableOpacity onPress={() => this.setCurrentFocus("VanBanDenIsNotProcessScreen")} style={SideBarStyle.shortcutBoxStyle}>
            <Text style={SideBarStyle.shortcutBoxTextStyle}>Văn bản đến chưa xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setCurrentFocus("VanBanDiIsNotProcessScreen")} style={SideBarStyle.shortcutBoxStyle}>
            <Text style={SideBarStyle.shortcutBoxTextStyle}>Văn bản đi chưa xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setCurrentFocus("ListAssignedTaskScreen")} style={SideBarStyle.shortcutBoxStyle}>
            <Text style={SideBarStyle.shortcutBoxTextStyle}>Công việc được giao</Text>
          </TouchableOpacity>
          {/*<View style={[SideBarStyle.shortcutBoxStyle, { marginLeft: 5, marginRight: 10 }]}>
                <TouchableOpacity onPress={() => this.setCurrentFocus("BaseCalendarScreen")}>
                  <Text style={SideBarStyle.shortcutBoxTextStyle}>Lịch công tác</Text>
                </TouchableOpacity>
    </View>*/}
        </View>

        <View style={SideBarStyle.body}>
          <ScrollView>
            {
              // Lấy chức năng của người dùng
              userFunctions && userFunctions.map((item, index) => {
                let count = 0;
                return <GridPanel title={item.TEN_CHUCNANG.replace("Quản lý ", "")} key={item.DM_CHUCNANG_ID.toString()} actionCode={item.MA_CHUCNANG} isParent={true}>
                  {
                    item.ListThaoTac.map((sItem, sIndex) => {
                      const renderCondition = sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE;
                      let elementStyle = SideBarStyle.normalBoxStyle;
                      if (renderCondition) {
                        if (count % 3 === 1) {
                          elementStyle = [SideBarStyle.normalBoxStyle, { marginHorizontal: '5%' }];
                        }
                        count++;
                        return <TouchableOpacity
                          style={elementStyle}
                          key={sItem.DM_THAOTAC_ID.toString()}
                          onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DM_THAOTAC_ID, item.MA_CHUCNANG)}
                        >
                          <SideBarIcon actionCode={sItem.MA_THAOTAC} />
                          <Text style={SideBarStyle.normalBoxTextStyle}>{this.generateTitle(sItem.MA_THAOTAC)}</Text>
                        </TouchableOpacity>;
                        // return <TouchableOpacity
                        //   key={sItem.DM_THAOTAC_ID.toString()}
                        //   onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DM_THAOTAC_ID, item.MA_CHUCNANG)}
                        //   style={onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemFocus}>
                        //   <ListItem
                        //     hideChevron={true}
                        //     leftIcon={
                        //       <SideBarIcon actionCode={sItem.MA_THAOTAC} status={onFocusNow === sItem.DM_THAOTAC_ID} />
                        //     }
                        //     containerStyle={[SideBarStyle.subItemContainer, { flexBasis: '33%' }]}
                        //     title={this.generateTitle(sItem.MA_THAOTAC)}
                        //     titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemSubTitleContainerFocus]}
                        //     contentContainerStyle={SideBarStyle.subItemContainer} />
                        // </TouchableOpacity>
                      }
                      else {
                        return null;
                      }
                    })
                  }
                </GridPanel>
              }
              )
            }
          </ScrollView>
        </View>

      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization))
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);