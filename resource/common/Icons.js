import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { Icon } from 'react-native-elements';
import { SYSTEM_FUNCTION, Colors, SIDEBAR_CODES } from './SystemConstant';
import { SideBarStyle } from '../assets/styles/SideBarStyle';
import { moderateScale } from '../assets/styles/ScaleIndicator';

const { VanBanDenFunction, VanBanDiFunction, CongViecFunction, LichCongTacFunction, UyQuyenFunction } = SYSTEM_FUNCTION;
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;

export default class SideBarIcon extends Component {
  static defaultProps = {
    actionCode: VanBanDenFunction.code,
    status: false,
    isParent: false,
    iconSize: 35,
    iconColor: Colors.BLACK,
    customIconContainerStyle: {},
  }
  render() {
    const { actionCode, status, isParent, iconSize, customIconContainerStyle } = this.props;
    let iconName = "file-download", iconColor = this.props.iconColor;

    switch (actionCode) {
      //#region VanbanDen
      case VanBanDenFunction.code:
        iconName = "file-download";
        break;
      case VanBanDenFunction.actionCodes[0]:
        iconName = "close-circle-outline";
        iconColor = "#5C6BC0";
        break;
      case VanBanDenFunction.actionCodes[1]:
        iconName = "close-circle";
        iconColor = "#3F51B5";
        break;
      case VanBanDenFunction.actionCodes[2]:
        iconName = "account-group";
        iconColor = "#3949AB";
        break;
      case VanBanDenFunction.actionCodes[3]:
        iconName = "check-circle-outline";
        iconColor = "#303F9F";
        break;
      case VanBanDenFunction.actionCodes[4]:
        iconName = "check-circle";
        iconColor = "#1A237E";
        break;
      //#endregion

      //#region VanbanDi
      case VanBanDiFunction.code:
        iconName = "file-upload";
        break;
      case VanBanDiFunction.actionCodes[0]:
        iconName = "close-circle-outline";
        iconColor = "#4FC3F7";
        break;
      case VanBanDiFunction.actionCodes[1]:
        iconName = "account-group";
        iconColor = "#03A9F4";
        break;
      case VanBanDiFunction.actionCodes[2]:
        iconName = "check-circle-outline";
        iconColor = "#0288D1";
        break;
      case VanBanDiFunction.actionCodes[3]:
        iconName = "arrow-up-bold";
        iconColor = "#01579B";
        break;
      //#endregion

      //#region Congviec
      case CongViecFunction.code:
        iconName = "account-tie";
        break;
      case CongViecFunction.actionCodes[0]:
        iconName = "book";
        iconColor = "#4DB6AC";
        break;
      case CongViecFunction.actionCodes[1]:
        iconName = "briefcase";
        iconColor = "#009688";
        break;
      case CongViecFunction.actionCodes[2]:
        iconName = "briefcase-account"
        iconColor = "#00796B";
        break;
      case CongViecFunction.actionCodes[3]:
        iconName = "briefcase-edit";
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
        iconName = 'calendar'
        iconColor = "#64DD17";
        break;
      case LichCongTacFunction.code:
        iconName = 'calendar'
        break;
      //#endregion

      //#region Uyquyen
      case UyQuyenFunction.actionCodes[0]:
        iconName = 'account-convert'
        iconColor = "#00C853";
        break;
      case UyQuyenFunction.code:
        iconName = 'account-convert'
        break;
      //#endregion

      case THONGBAO.code:
        iconName = "message-alert";
        break;

      case DANGXUAT.code:
        iconName = "logout";
        break;

      default: break;
    }

    if (status) {
      iconColor = Colors.WHITE;
    }

    return (
      <View style={[baseStyle.iconContainer, customIconContainerStyle]}>
        <Icon name={iconName} color={iconColor} type="material-community" size={moderateScale(iconSize, 0.9)} />
      </View>
    )
  }
}

const baseStyle = StyleSheet.create({
  iconContainer: {
    minWidth: moderateScale(45, 0.9),
    maxHeight: moderateScale(35, 0.9)
  }
})