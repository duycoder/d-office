import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { Icon } from 'react-native-elements';
import { SYSTEM_FUNCTION, Colors, SIDEBAR_CODES } from './SystemConstant';
import { SideBarStyle } from '../assets/styles/SideBarStyle';
import { moderateScale } from '../assets/styles/ScaleIndicator';

const { VanBanDenFunction, VanBanDiFunction, CongViecFunction, LichCongTacFunction, UyQuyenFunction } = SYSTEM_FUNCTION;
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconImages from '../common/Images';
const { vanbandenIcons, vanbandiIcons, congviecIcons, otherIcons, hotPickIcons } = IconImages;

export default class SideBarIcon extends Component {
  static defaultProps = {
    actionCode: VanBanDenFunction.code,
    status: false,
    isParent: false,
    iconSize: 35,
    iconColor: Colors.BLACK,
    customIconContainerStyle: {},
    customIconImageStyle: {},
    isHotPick: false
  }
  render() {
    const { actionCode, status, isParent, iconSize, customIconContainerStyle, customIconImageStyle, isHotPick } = this.props;
    let iconName = "file-download", iconColor = this.props.iconColor;

    if (isHotPick) {
      switch (actionCode) {
        case VanBanDenFunction.actionCodes[0]:
          iconName = hotPickIcons.van_ban_den;
          break;
        case VanBanDiFunction.actionCodes[0]:
          iconName = hotPickIcons.van_ban_di;
          break;
        case CongViecFunction.actionCodes[0]:
          iconName = hotPickIcons.cong_viec_ca_nhan;
          break;
        case LichCongTacFunction.actionCodes[0]:
          iconName = hotPickIcons.tien_ich;
          break;
      }
    }
    else {
      switch (actionCode) {
        //#region VanbanDen
        // case VanBanDenFunction.code:
        //   iconName = vanbanIcons;
        //   break;
        case VanBanDenFunction.actionCodes[0]:
          iconName = vanbandenIcons.chua_xuly;
          iconColor = "#5C6BC0";
          break;
        case VanBanDenFunction.actionCodes[1]:
          iconName = vanbandenIcons.noibo_chua_xuly;
          iconColor = "#3F51B5";
          break;
        case VanBanDenFunction.actionCodes[2]:
          iconName = vanbandenIcons.thamgia_xuly;
          iconColor = "#3949AB";
          break;
        case VanBanDenFunction.actionCodes[3]:
          iconName = vanbandenIcons.da_xuly;
          iconColor = "#303F9F";
          break;
        case VanBanDenFunction.actionCodes[4]:
          iconName = vanbandenIcons.noibo_da_xuly;
          iconColor = "#1A237E";
          break;
        //#endregion

        //#region VanbanDi
        // case VanBanDiFunction.code:
        //   iconName = "file-upload";
        //   break;
        case VanBanDiFunction.actionCodes[0]:
          iconName = vanbandiIcons.chua_xuly;
          iconColor = "#4FC3F7";
          break;
        case VanBanDiFunction.actionCodes[1]:
          iconName = vanbandiIcons.thamgia_xuly;
          iconColor = "#03A9F4";
          break;
        case VanBanDiFunction.actionCodes[2]:
          iconName = vanbandiIcons.da_xuly;
          iconColor = "#0288D1";
          break;
        case VanBanDiFunction.actionCodes[3]:
          iconName = vanbandiIcons.ban_hanh;
          iconColor = "#01579B";
          break;
        //#endregion

        //#region Congviec
        // case CongViecFunction.code:
        //   iconName = "account-tie";
        //   break;
        case CongViecFunction.actionCodes[0]:
          iconName = congviecIcons.ca_nhan;
          iconColor = "#4DB6AC";
          break;
        case CongViecFunction.actionCodes[1]:
          iconName = congviecIcons.duoc_giao;
          iconColor = "#009688";
          break;
        case CongViecFunction.actionCodes[2]:
          iconName = congviecIcons.phoi_hop_xu_ly;
          iconColor = "#00796B";
          break;
        case CongViecFunction.actionCodes[3]:
          iconName = congviecIcons.cho_xac_nhan;
          iconColor = "#004D40";
          break;
        //#endregion

        //#region Taikhoan
        case TAIKHOAN.code:
          iconName = "account-key";
          break;
        case TAIKHOAN.actionCodes[0]:
          iconName = "shield-account";
          break;
        case TAIKHOAN.actionCodes[1]:
          iconName = "shield-key";
          break;
        //#endregion

        //#region Lichcongtac
        case LichCongTacFunction.actionCodes[0]:
          iconName = otherIcons.lich_cong_tac;
          iconColor = "#64DD17";
          break;
        // case LichCongTacFunction.code:
        //   iconName = 'calendar'
        //   break;
        //#endregion

        //#region Uyquyen
        case UyQuyenFunction.actionCodes[0]:
          iconName = otherIcons.uy_quyen;
          iconColor = "#00C853";
          break;
        // case UyQuyenFunction.code:
        //   iconName = 'account-convert'
        //   break;
        //#endregion

        case THONGBAO.code:
          iconName = "message-alert";
          break;

        case DANGXUAT.code:
          iconName = "logout";
          break;

        default: break;
      }
    }

    if (status) {
      iconColor = Colors.WHITE;
    }

    return (
      <View style={[baseStyle.iconContainer, customIconContainerStyle]}>
        {
          // <Icon name={iconName} color={iconColor} type="material-community" size={moderateScale(iconSize, 0.9)} />
        }
        <Image source={iconName} style={[baseStyle.iconImage, customIconImageStyle]} />
      </View>
    )
  }
}

const baseStyle = StyleSheet.create({
  iconContainer: {
    // minWidth: moderateScale(45, 0.9),
    // maxHeight: moderateScale(35, 0.9)
    flex: 1,
    marginBottom: '10%'
  },
  iconImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'stretch',
  }
})