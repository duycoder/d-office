// @flow

import variable from "./../variables/platform";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const platform = variables.platform;

  const segmentTheme = {
    height: moderateScale(48, 1.12),
    borderColor: variables.segmentBorderColorMain,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: variables.segmentBackgroundColor,
    "NativeBase.Button": {
      alignSelf: "center",
      borderRadius: 0,
      paddingTop: 3,
      paddingBottom: 3,
      height: moderateScale(28, 1.16),
      backgroundColor: "transparent",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: variables.segmentBorderColor,
      elevation: 0,
      ".active": {
        backgroundColor: variables.segmentActiveBackgroundColor,
        "NativeBase.Text": {
          color: variables.segmentActiveTextColor
        },
        "NativeBase.Icon": {
          color: variables.segmentActiveTextColor
        }
      },
      ".first": {
        borderTopLeftRadius: platform === "ios" ? 5 : undefined,
        borderBottomLeftRadius: platform === "ios" ? 5 : undefined,
        borderLeftWidth: 1
      },
      ".last": {
        borderTopRightRadius: platform === "ios" ? 5 : undefined,
        borderBottomRightRadius: platform === "ios" ? 5 : undefined
      },
      "NativeBase.Text": {
        color: variables.segmentTextColor,
        fontSize: moderateScale(13, 1.26)
      },
      "NativeBase.Icon": {
        fontSize: 22,
        paddingTop: 0,
        color: variables.segmentTextColor
      }
    }
  };

  return segmentTheme;
};
