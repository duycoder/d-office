// @flow

import variable from "./../variables/platform";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const platform = variables.platform;

  const toastTheme = {
    ".danger": {
      backgroundColor: variables.brandDanger
    },
    ".warning": {
      backgroundColor: variables.brandWarning
    },
    ".success": {
      backgroundColor: variables.brandSuccess
    },
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: platform === "ios" ? 5 : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(9.33, 1.12),
    minHeight: moderateScale(48.15, 1.26),
    "NativeBase.Text": {
      color: "#fff",
      flex: 1,
      fontSize: moderateScale(11.55, 1.15)
    },
    "NativeBase.Button": {
      backgroundColor: "transparent",
      height: moderateScale(28, 1.10),
      elevation: 0,
      "NativeBase.Text": {
        fontSize: moderateScale(11.75, 1.18)
      }
    }
  };

  return toastTheme;
};
