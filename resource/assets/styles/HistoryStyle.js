import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from './ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';


export const HistoryStyle = StyleSheet.create({
  container: {
    backgroundColor: COMMON_COLOR.WHITE,
    borderRadius: 6,
    padding: scale(3)
  },
  titleText: {
    fontSize: moderateScale(15, 1.03),
    fontWeight: 'bold'
  },
  minorTitleText: {
    fontSize: moderateScale(12, 0.98),
    fontWeight: 'bold'
  },
  normalText: {
    fontSize: moderateScale(12, 0.98)
  }
});


export const TimeLineStyle = StyleSheet.create({
  container: {
    width: '100%',
    // paddingTop: 20,
    // paddingBottom: 20,
    flexDirection: 'row',
    // paddingRight: 5,
    // paddingLeft: 5,
    paddingHorizontal: scale(5),
  },
  timeSection: {
    flex: 2,
  },
  timeSectionDate: {
    fontWeight: 'bold',
    fontSize: moderateScale(12, 0.91),
    textAlign: 'left',
    color: COMMON_COLOR.BLACK
  },
  timeSectionHour: {
    fontSize: moderateScale(10, 0.85),
    color: '#707070',
    textAlign: 'left'
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    height: moderateScale(36, 1.18),
    width: moderateScale(36, 1.18),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(18, 1.18),
    // backgroundColor: COMMON_COLOR.OLD_LITE_BLUE
  }, innerIconCircle: {
    height: moderateScale(26, 1.14),
    width: moderateScale(26, 1.14),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(13, 1.14),
    // backgroundColor: COMMON_COLOR.MENU_BLUE
  },
  initState: {
    backgroundColor: '#0D7D23'
  },
  initStateText: {
    color: '#0D7D23'
  },
  fowardState: {
    backgroundColor: '#0263A8'
  },
  fowardStateText: {
    color: '#0263A8'
  },
  returnState: {
    backgroundColor: '#FF0000'
  },
  returnStateText: {
    color: '#FF0000'
  },
  iconLine: {
    width: scale(4),
    position: 'absolute',
    top: moderateScale(37, 1.13),
    bottom: 0,
    backgroundColor: '#eaeaea'
  },
  infoSection: {
    flex: 8,
    marginLeft: scale(10)
  },
  infoHeader: {
    height: moderateScale(45, 1.16),
    width: '100%',
    justifyContent: 'center'
  },
  infoText: {
    fontSize: moderateScale(14, 1.1),
    fontWeight: 'bold',
    color: COMMON_COLOR.MENU_BLUE
  }, infoTimeline: {
    fontSize: moderateScale(12, 1.2),
    color: COMMON_COLOR.DANK_GRAY
  },
  infoDetail: {
    // borderWidth: 0.7,
    borderTopWidth: 0.7,
    borderRightWidth: 0.7,
    borderLeftWidth: 0.7,
    borderColor: '#707070',
    marginVertical: verticalScale(15),
    // borderRadius: 7,
    // padding: 5
  },
  infoDetailRow: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#707070',
    width: '100%',
    minHeight: moderateScale(37, 1.02),
    // padding: 10,
    flexDirection: 'row'
  }, infoDetailLabel: {
    flex: 3,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: moderateScale(10, 0.59),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  infoDetailLabelText: {
    color: COMMON_COLOR.DANK_GRAY,
    fontSize: moderateScale(11, 0.9),

    // fontWeight: 'bold'
  },
  infoDetailValue: {
    flex: 7,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor: '#707070',
    borderLeftWidth: 0.7,
    padding: moderateScale(10, 0.54),
    // alignItems: 'center',
    // flexDirection: 'row',
    flexDirection: 'column',
    alignItems: 'flex-start',
  }, infoDetailValueText: {
    color: COMMON_COLOR.BLACK,
    fontSize: moderateScale(12, 1.25)
  },
  infoDetailValueNote: {
    fontSize: moderateScale(10, 0.83),
    color: '#0D7D23'
  },
  infoBtn: {
    backgroundColor: COMMON_COLOR.OLD_LITE_BLUE,
    borderRadius: 8,
    padding: moderateScale(8, 0.73),
  }, infoBtnText: {
    color: COMMON_COLOR.WHITE,
    fontSize: moderateScale(10, .8)
  }
})
