import React, { Component } from 'react';
import { View } from 'react-native';

import { Icon } from 'react-native-elements';
import { SYSTEM_FUNCTION, Colors, SIDEBAR_CODES } from './SystemConstant';
import { SideBarStyle } from '../assets/styles/SideBarStyle';
import {moderateScale} from '../assets/styles/ScaleIndicator';

const { VanBanDenFunction, VanBanDiFunction, CongViecFunction } = SYSTEM_FUNCTION;
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;

export default class SideBarIcon extends Component {
  // static propTypes = {

  // }
  static defaultProps = {
    actionCode: VanBanDenFunction.code,
    status: false,
    isParent: false,
  }
  render() {
    const { actionCode, status, isParent } = this.props;
    let iconName = "file-download", iconColor = Colors.BLACK,
      iconMarginLeft = 10;

    switch (actionCode) {
      case VanBanDenFunction.code:
        iconName = "file-download";
        break;
      case VanBanDenFunction.actionCodes[0]:
        iconName = "close-circle-outline";
        break;
      case VanBanDenFunction.actionCodes[1]:
        iconName = "close-circle";
        break;
      case VanBanDenFunction.actionCodes[2]:
        iconName = "account-group";
        break;
      case VanBanDenFunction.actionCodes[3]:
        iconName = "check-circle-outline";
        break;
      case VanBanDenFunction.actionCodes[4]:
        iconName = "check-circle";
        break;

      case VanBanDiFunction.code:
        iconName = "file-upload";
        break;
      case VanBanDiFunction.actionCodes[0]:
        iconName = "close-circle-outline";
        break;
      case VanBanDiFunction.actionCodes[1]:
        iconName = "account-group";
        break;
      case VanBanDiFunction.actionCodes[2]:
        iconName = "check-circle-outline";
        break;
      case VanBanDiFunction.actionCodes[3]:
        iconName = "arrow-up-bold";
        break;

      case CongViecFunction.code:
        iconName = "account-tie";
        break;
      case CongViecFunction.actionCodes[0]:
        iconName = "book";
        break;
      case CongViecFunction.actionCodes[1]:
        iconName = "briefcase";
        break;
      case CongViecFunction.actionCodes[2]:
        iconName = "briefcase-account"
        break;
      case CongViecFunction.actionCodes[3]:
        iconName = "briefcase-edit";
        break;

      case TAIKHOAN.code:
        iconName = "account-key";
        break;
      case TAIKHOAN.actionCodes[0]:
        iconName = "shield-account";
        break;
      case TAIKHOAN.actionCodes[1]:
        iconName = "shield-key";
        break;

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

    if (isParent) {
      iconMarginLeft = 0;

    }

    return (
      <View style={{ marginLeft: iconMarginLeft, minWidth: moderateScale(45, 0.9) }}>
        <Icon name={iconName} color={iconColor} type="material-community" size={moderateScale(35, 0.9)} />
      </View>
    )
  }
}