import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { moderateScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';


export const HistoryStyle = StyleSheet.create({
  container: { backgroundColor: Colors.WHITE, borderRadius: 6, padding: 3 },
  titleText: { fontSize: moderateScale(16), fontWeight: 'bold' },
  minorTitleText: {
    fontSize: moderateScale(13), fontWeight: 'bold'
  },
  normalText: {
    fontSize: moderateScale(13)
  }
});


export const TimeLineStyle = StyleSheet.create({
  container: {
    width: '100%',
    // paddingTop: 20,
    // paddingBottom: 20,
    flexDirection: 'row',
    paddingRight: 5,
    paddingLeft: 5
  },
  timeSection: {
    flex: 2,
  },
  timeSectionDate: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'left',
    color: Colors.BLACK
  },
  timeSectionHour: {
    fontSize: 10,
    color: '#707070',
    textAlign: 'left'
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    // backgroundColor: Colors.OLD_LITE_BLUE
  }, innerIconCircle: {
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    // backgroundColor: Colors.MENU_BLUE
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
    width: 4,
    position: 'absolute',
    top: 38,
    bottom: 0,
    backgroundColor: '#eaeaea'
  },
  infoSection: {
    flex: 8,
    marginLeft: 10
  },
  infoHeader: {
    height: 50,
    width: '100%',
    justifyContent: 'center'
  },
  infoText: {
    fontSize: moderateScale(14, 1.1),
    fontWeight: 'bold',
    color: Colors.MENU_BLUE
  }, infoTimeline: {
    fontSize: moderateScale(12, 1.2),
    color: Colors.DANK_GRAY
  },
  infoDetail: {
    // borderWidth: 0.7,
    borderTopWidth: 0.7,
    borderRightWidth: 0.7,
    borderLeftWidth: 0.7,
    borderColor: '#707070',
    marginVertical: 15,
    // borderRadius: 7,
    // padding: 5
  },
  infoDetailRow: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#707070',
    width: '100%',
    minHeight: 40,
    // padding: 10,
    flexDirection: 'row'
  }, infoDetailLabel: {
    flex: 3,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  infoDetailLabelText: {
    color: Colors.DANK_GRAY,
    fontSize: moderateScale(11, 0.9),
    
    // fontWeight: 'bold'
  },
  infoDetailValue: {
    flex: 7,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor: '#707070',
    borderLeftWidth: 0.7,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row'
  }, infoDetailValueText: {
    color: Colors.BLACK,
    fontSize: moderateScale(12, 1.3)
  },
  infoDetailValueNote: {
    fontSize: 10,
    color: '#0D7D23'
  }
})
