// @flow

import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import { moderateScale } from "../../resource/assets/styles/ScaleIndicator";
import { Colors } from "../../resource/common/SystemConstant";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

export default {
  platformStyle,
  platform,

  //Accordion
  headerStyle: "#edebed",
  iconStyle: "#000",
  contentStyle: "#f5f4f5",
  expandedIconStyle: "#000",
  accordionBorderColor: "#d3d3d3",

  // Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  btnUppercaseAndroidText: true,

  // Badge
  badgeBg: "#ED1727",
  badgeColor: "#fff",
  badgePadding: platform === "ios" ? 3 : 0,

  // Button
  btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
  btnDisabledBg: "#b5b5b5",
  buttonPadding: 6,
  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: "#fff",
  cardBorderColor: "#ccc",
  cardBorderRadius: 2,
  cardItemPadding: platform === "ios" ? moderateScale(9.96, 0.98) : moderateScale(11.94, 0.96),

  // CheckBox
  CheckboxRadius: platform === "ios" ? moderateScale(9, 1.08) : 0,
  CheckboxBorderWidth: platform === "ios" ? 1 : 2,
  CheckboxPaddingLeft: platform === "ios" ? moderateScale(3.85, 1.05) : moderateScale(1.95, 1.10),
  CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
  CheckboxIconSize: platform === "ios" ? moderateScale(20.7, 1.12) : moderateScale(15.5, 1.12),
  CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
  CheckboxFontSize: platform === "ios" ? moderateScale(22.8 / 0.9, 1.12) : moderateScale(15.82, 1.12),
  checkboxBgColor: Colors.LITE_BLUE, // "#039BE5",
  checkboxSize: moderateScale(18, 1.08),
  checkboxTickColor: "#fff",

  // Color
  brandPrimary: platform === "ios" ? "#007aff" : "#3F51B5",
  brandInfo: "#62B1F6",
  brandSuccess: "#5cb85c",
  brandDanger: "#d9534f",
  brandWarning: "#f0ad4e",
  brandDark: "#000",
  brandLight: "#f4f4f4",

  //Container
  containerBgColor: "#fff",

  //Date Picker
  datePickerTextColor: "#000",
  datePickerBg: "transparent",

  // Font
  DefaultFontSize: moderateScale(14.85, 1.19),
  fontFamily: platform === "ios" ? "System" : "Roboto",
  fontSizeBase: moderateScale(14.78, 1.17),
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  footerDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  tabBarTextSize: platform === "ios" ? moderateScale(13.35, 1.04) : moderateScale(10.84, 1.02),
  activeTab: platform === "ios" ? "#007aff" : "#fff",
  sTabBarActiveTextColor: "#007aff",
  tabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
  tabActiveBgColor: platform === "ios" ? "#cde1f9" : "#3F51B5",

  // Header
  toolbarBtnColor: platform === "ios" ? "#007aff" : "#fff",
  toolbarDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  toolbarHeight: platform === "ios" ? moderateScale(62) : moderateScale(54),
  toolbarSearchIconSize: platform === "ios" ? moderateScale(19, 0.89) : moderateScale(21, 0.94),
  toolbarInputColor: platform === "ios" ? "#CECDD2" : "#fff",
  searchBarHeight: platform === "ios" ? moderateScale(28, 0.88) : moderateScale(38, 0.88),
  searchBarInputHeight: platform === "ios" ? moderateScale(27, 0.82) : moderateScale(47, 0.82),
  toolbarBtnTextColor: platform === "ios" ? "#007aff" : "#fff",
  toolbarDefaultBorder: platform === "ios" ? "#a7a6ab" : "#3F51B5",
  iosStatusbar: platform === "ios" ? "dark-content" : "light-content",
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: platform === "ios" ? moderateScale(28, 0.74) : moderateScale(27, 0.72),
  iconHeaderSize: platform === "ios" ? moderateScale(31, 0.74) : moderateScale(23, 0.72),

  // InputGroup
  inputFontSize: moderateScale(15, 0.96),
  inputBorderColor: "#D9D5DC",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",
  inputHeightBase: moderateScale(46, 1.02),
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "#575757";
  },

  // Line Height
  btnLineHeight: moderateScale(18.35, 0.85),
  lineHeightH1: moderateScale(31.45, 0.87),
  lineHeightH2: moderateScale(26.45, 0.87),
  lineHeightH3: moderateScale(21.45, 0.87),
  lineHeight: platform === "ios" ? moderateScale(19.15, 0.86) : moderateScale(23.12, 0.85),
  listItemSelected: platform === "ios" ? "#007aff" : "#3F51B5",

  // List
  listBg: "transparent",
  listBorderColor: "#c9c9c9",
  listDividerBg: "#f4f4f4",
  listBtnUnderlayColor: "#DDD",
  listItemPadding: platform === "ios" ? moderateScale(9.95, 0.89) : moderateScale(11, 0.91),
  listNoteColor: "#808080",
  listNoteSize: 13,

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: platform === "ios" ? moderateScale(23, 1.02) : moderateScale(22.45, 1.02),
  radioSelectedColorAndroid: "#3F51B5",
  radioBtnLineHeight: platform === "ios" ? moderateScale(27, 0.98) : moderateScale(23, 1.01),
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  segmentActiveBackgroundColor: platform === "ios" ? "#007aff" : "#fff",
  segmentTextColor: platform === "ios" ? "#007aff" : "#fff",
  segmentActiveTextColor: platform === "ios" ? "#fff" : "#3F51B5",
  segmentBorderColor: platform === "ios" ? "#007aff" : "#fff",
  segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#3F51B5",

  // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: "#1A191B",

  // Tab
  tabDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  topTabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
  topTabBarBorderColor: platform === "ios" ? "#a7a6ab" : "#fff",
  topTabBarActiveBorderColor: platform === "ios" ? "#007aff" : "#fff",

  // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,

  // Text
  textColor: "#000",
  inverseTextColor: "#fff",
  noteFontSize: moderateScale(13.63, 0.83),
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
  titleFontSize: platform === "ios" ? moderateScale(16, 0.82) : moderateScale(18, 0.81),
  subTitleFontSize: platform === "ios" ? moderateScale(12, 0.76) : moderateScale(13, 0.75),
  subtitleColor: platform === "ios" ? "#8e8e93" : "#FFF",
  titleFontColor: platform === "ios" ? "#000" : "#FFF",

  // Other
  borderRadiusBase: platform === "ios" ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: moderateScale(9.98, 0.88),
  dropdownLinkColor: "#414142",
  inputLineHeight: moderateScale(15, 0.98),
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,
  labelFontSize: moderateScale(15, 0.86),

  //iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21
    }
  }
};
