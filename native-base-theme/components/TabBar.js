// @flow

import variable from "./../variables/platform";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const tabBarTheme = {
    ".tabIcon": {
      height: undefined
    },
    ".vertical": {
      height: moderateScale(58, 0.94)
    },
    "NativeBase.Button": {
      ".transparent": {
        "NativeBase.Text": {
          fontSize: variables.tabFontSize,
          color: variables.sTabBarActiveTextColor,
          fontWeight: "400"
        },
        "NativeBase.IconNB": {
          color: variables.sTabBarActiveTextColor
        }
      },
      "NativeBase.IconNB": {
        color: variables.sTabBarActiveTextColor
      },
      "NativeBase.Text": {
        fontSize: variables.tabFontSize,
        color: variables.sTabBarActiveTextColor,
        fontWeight: "400"
      },
      ".isTabActive": {
        "NativeBase.Text": {
          fontWeight: "900"
        }
      },
      flex: 1,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: null,
      borderBottomColor: "transparent",
      backgroundColor: variables.tabBgColor
    },
    height: moderateScale(43, 0.94),
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: "#ccc",
    backgroundColor: variables.tabBgColor
  };

  return tabBarTheme;
};
