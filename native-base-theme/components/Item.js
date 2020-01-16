// @flow

import { Platform } from "react-native";

import variable from "./../variables/platform";

import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";

export default (variables /*: * */ = variable) => {
  const itemTheme = {
    ".floatingLabel": {
      "NativeBase.Input": {
        height: variables.inputHeightBase,
        top: moderateScale(7.20, 0.65),
        paddingTop: moderateScale(2.85, 0.76),
        paddingBottom: moderateScale(6.90, 0.64),
        ".multiline": {
          minHeight: variables.inputHeightBase,
          paddingTop: Platform.OS === "ios" ? moderateScale(9.95, 0.87) : moderateScale(2.95, 0.88),
          paddingBottom: Platform.OS === "ios" ? moderateScale(13.87, 0.87) : moderateScale(9.91, 0.88)
        }
      },
      "NativeBase.Label": {
        paddingTop: moderateScale(4.85, 0.88)
      },
      "NativeBase.Icon": {
        top: moderateScale(5.87, 0.89),
        paddingTop: moderateScale(7.88, 0.89)
      },
      "NativeBase.IconNB": {
        top: moderateScale(5.87, 0.89),
        paddingTop: moderateScale(7.88, 0.89)
      }
    },
    ".fixedLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        flex: 1,
        height: null,
        width: null,
        fontSize: variables.inputFontSize
      },
      "NativeBase.Input": {
        flex: 2,
        fontSize: variables.inputFontSize
      }
    },
    ".stackedLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingTop: moderateScale(4.94, 0.83),
        alignSelf: "flex-start",
        fontSize: variables.inputFontSize - moderateScale(1.96, 0.96)
      },
      "NativeBase.Icon": {
        marginTop: moderateScale(33.97, 1.03)
      },
      "NativeBase.Input": {
        alignSelf: Platform.OS === "ios" ? "stretch" : "flex-start",
        flex: 1,
        width: Platform.OS === "ios" ? null : variables.deviceWidth - moderateScale(23.91, 0.67),
        fontSize: variables.inputFontSize,
        lineHeight: variables.inputLineHeight - moderateScale(5.22, 0.68),
        ".secureTextEntry": {
          fontSize: variables.inputFontSize - moderateScale(3.99, 0.63)
        },
        ".multiline": {
          paddingTop: Platform.OS === "ios" ? moderateScale(8.85) : undefined,
          paddingBottom: Platform.OS === "ios" ? moderateScale(8.85) : undefined
        }
      },
      flexDirection: null,
      minHeight: variables.inputHeightBase + moderateScale(13.41, 1.02)
    },
    ".inlineLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingRight: moderateScale(18, 0.83),
        height: null,
        width: null,
        fontSize: variables.inputFontSize
      },
      "NativeBase.Input": {
        paddingLeft: moderateScale(4.94, 0.83),
        fontSize: variables.inputFontSize
      },
      flexDirection: "row"
    },
    "NativeBase.Label": {
      fontSize: variables.inputFontSize,
      color: variables.inputColorPlaceholder,
      paddingRight: moderateScale(4.94, 0.83)
    },
    "NativeBase.Icon": {
      fontSize: variables.iconFontSize,
      paddingRight: moderateScale(7.88, 0.89)
    },
    "NativeBase.IconNB": {
      fontSize: variables.iconFontSize,
      paddingRight: moderateScale(7.88, 0.89)
    },
    "NativeBase.Input": {
      ".multiline": {
        height: null
      },
      height: variables.inputHeightBase,
      color: variables.inputColor,
      flex: 1,
      top: Platform.OS === "ios" ? moderateScale(1.5, 1.24) : undefined,
      fontSize: variables.inputFontSize
    },
    ".underline": {
      "NativeBase.Input": {
        paddingLeft: moderateScale(14, 1.12)
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderColor: variables.inputBorderColor
    },
    ".regular": {
      "NativeBase.Input": {
        paddingLeft: moderateScale(7.88, 0.89)
      },
      "NativeBase.Icon": {
        paddingLeft: moderateScale(10, 1.08)
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderColor: variables.inputBorderColor
    },
    ".rounded": {
      "NativeBase.Input": {
        paddingLeft: moderateScale(8, 1.05)
      },
      "NativeBase.Icon": {
        paddingLeft: moderateScale(10, 1.08)
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderRadius: 30,
      borderColor: variables.inputBorderColor
    },

    ".success": {
      "NativeBase.Icon": {
        color: variables.inputSuccessBorderColor
      },
      "NativeBase.IconNB": {
        color: variables.inputSuccessBorderColor
      },
      ".rounded": {
        borderRadius: 30,
        borderColor: variables.inputSuccessBorderColor
      },
      ".regular": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".underline": {
        borderWidth: variables.borderWidth * 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: variables.inputSuccessBorderColor
      },
      borderColor: variables.inputSuccessBorderColor
    },

    ".error": {
      "NativeBase.Icon": {
        color: variables.inputErrorBorderColor
      },
      "NativeBase.IconNB": {
        color: variables.inputErrorBorderColor
      },
      ".rounded": {
        borderRadius: 30,
        borderColor: variables.inputErrorBorderColor
      },
      ".regular": {
        borderColor: variables.inputErrorBorderColor
      },
      ".underline": {
        borderWidth: variables.borderWidth * 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: variables.inputErrorBorderColor
      },
      borderColor: variables.inputErrorBorderColor
    },
    ".disabled": {
      "NativeBase.Icon": {
        color: "#384850"
      },
      "NativeBase.IconNB": {
        color: "#384850"
      }
    },
    ".picker": {
      marginLeft: 0
    },

    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(2, 1.34)
  };

  return itemTheme;
};
