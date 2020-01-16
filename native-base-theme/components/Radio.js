// @flow

import { Platform } from "react-native";

import variable from "./../variables/platform";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const radioTheme = {
    ".selected": {
      "NativeBase.IconNB": {
        color: Platform.OS === "ios"
          ? variables.radioColor
          : variables.radioSelectedColorAndroid,
        lineHeight: Platform.OS === "ios" ? moderateScale(24, 1.15) : variables.radioBtnLineHeight,
        height: Platform.OS === "ios" ? moderateScale(18, 1.2) : undefined
      }
    },
    "NativeBase.IconNB": {
      color: Platform.OS === "ios" ? "transparent" : undefined,
      lineHeight: Platform.OS === "ios"
        ? undefined
        : variables.radioBtnLineHeight,
      fontSize: Platform.OS === "ios" ? undefined : variables.radioBtnSize
    }
  };

  return radioTheme;
};
