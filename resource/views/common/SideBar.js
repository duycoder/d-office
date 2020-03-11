/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
  AsyncStorage, View, Text, ScrollView, Image,
  ImageBackground, TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../redux/modules/Nav/Action';

import { ListItem, Icon } from 'react-native-elements';

import { SideBarStyle } from '../../assets/styles/SideBarStyle';

import Panel from './Panel';
import Confirm from './Confirm';
import { Colors, SIDEBAR_CODES, DM_FUNCTIONS, EMPTY_STRING } from '../../common/SystemConstant';
import Images from '../../common/Images';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

import SideBarIcon from '../../common/Icons';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN } = DM_FUNCTIONS;

class SideBar extends Component {
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
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screenName })] // navigate
    });
    this.props.navigation.dispatch(resetAction);
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

        <View style={SideBarStyle.body}>
          <ScrollView>
            <TouchableOpacity
              onPress={() => this.setCurrentFocus('ListNotificationScreen', '0')}
              style={onFocusNow === '0' && SideBarStyle.listItemFocus}>
              <ListItem
                leftIcon={
                  <SideBarIcon actionCode={THONGBAO.code} status={onFocusNow === '0'} isParent={true} />
                }
                rightIcon={
                  notificationIcon
                }
                containerStyle={SideBarStyle.subItemContainer}
                title={'THÔNG BÁO'}
                titleStyle={onFocusNow === '0' ? SideBarStyle.listItemFocus : SideBarStyle.listItemTitle}
              />
            </TouchableOpacity>

            {
              // Lấy chức năng của người dùng
              userFunctions && userFunctions.map((item) =>
                <Panel title={item.TEN_CHUCNANG.replace("Quản lý ", "")} key={item.DM_CHUCNANG_ID.toString()} actionCode={item.MA_CHUCNANG} isParent={true}>
                  {
                    item.ListThaoTac.map((sItem) =>
                      sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE
                        ? <TouchableOpacity
                          key={sItem.DM_THAOTAC_ID.toString()}
                          onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DM_THAOTAC_ID, item.MA_CHUCNANG)}
                          style={onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemFocus}>
                          <ListItem
                            leftIcon={
                              <SideBarIcon actionCode={sItem.MA_THAOTAC} status={onFocusNow === sItem.DM_THAOTAC_ID} />
                            }
                            rightIcon={
                              onFocusNow !== sItem.DM_THAOTAC_ID ? mainItemIcon : subItemIcon
                            }
                            containerStyle={SideBarStyle.subItemContainer}
                            title={this.generateTitle(sItem.MA_THAOTAC)}
                            titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemSubTitleContainerFocus]}
                            contentContainerStyle={SideBarStyle.subItemContainer} />
                        </TouchableOpacity>
                        : null
                    )
                  }
                </Panel>
              )
            }

            {/*Truy vấn thông tin tài khoản người dùng*/}
            <Panel title='TÀI KHOẢN' actionCode={TAIKHOAN.code} isParent={true}>
              <TouchableOpacity onPress={() => this.setCurrentFocus('AccountInfoScreen', '10')} style={onFocusNow === '10' && SideBarStyle.listItemFocus}>
                <ListItem
                  leftIcon={
                    <SideBarIcon actionCode={TAIKHOAN.actionCodes[0]} status={onFocusNow === '10'} />
                  }
                  rightIcon={
                    onFocusNow !== '10' ? mainItemIcon : subItemIcon
                  }
                  title={'THÔNG TIN TÀI KHOẢN'}
                  containerStyle={SideBarStyle.subItemContainer}
                  titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === '10' && SideBarStyle.listItemSubTitleContainerFocus]}
                  style={SideBarStyle.subItemContainer} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setCurrentFocus('AccountChangePasswordScreen', '11')} style={onFocusNow === '11' && SideBarStyle.listItemFocus}>
                <ListItem
                  leftIcon={
                    <SideBarIcon actionCode={TAIKHOAN.actionCodes[1]} status={onFocusNow === '11'} />
                  }
                  rightIcon={
                    onFocusNow !== '11' ? mainItemIcon : subItemIcon
                  }
                  title={'ĐỔI MẬT KHẨU'}
                  containerStyle={SideBarStyle.subItemContainer}
                  titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === '11' && SideBarStyle.listItemSubTitleContainerFocus]}
                  style={SideBarStyle.subItemContainer} />
              </TouchableOpacity>
            </Panel>

            <TouchableOpacity onPress={() => this.onLogOut()}>
              <ListItem
                leftIcon={
                  <SideBarIcon actionCode={DANGXUAT.code} isParent={true} />
                }
                hideChevron={true}
                containerStyle={SideBarStyle.listItemContainer}
                title={'ĐĂNG XUẤT'}
                titleStyle={SideBarStyle.listItemTitle}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization))
  }
}

export default connect(null, mapDispatchToProps)(SideBar);