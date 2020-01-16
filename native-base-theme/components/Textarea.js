// @flow

import variable from "./../variables/platform";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const textAreaTheme = {
    ".underline": {
      borderBottomWidth: variables.borderWidth,
      marginTop: moderateScale(4.98, 0.92),
      borderColor: variables.inputBorderColor
    },
    ".bordered": {
      borderWidth: 1,
      marginTop: moderateScale(4.98, 0.92),
      borderColor: variables.inputBorderColor
    },
    color: variables.textColor,
    paddingLeft: moderateScale(10, 0.95),
    paddingRight: moderateScale(5, 0.93),
    marginTop: moderateScale(18, 0.98),
    fontSize: variables.inputFontSize,
    textAlignVertical: "top"
  };

  return textAreaTheme;
};
