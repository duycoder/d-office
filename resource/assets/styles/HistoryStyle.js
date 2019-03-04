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
    paddingTop: 20,
    paddingBottom: 20,
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
    flex: 2,
    alignItems: 'center',
  },
  iconCircle: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
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
    width: 5,
    position: 'absolute',
    top: 52,
    bottom: 0
  },
  infoSection: {
    flex: 6,
  },
  infoHeader: {
    height: 50,
    width: '100%',
    justifyContent: 'center'
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoDetail: {
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 7,
    padding: 5
  },
  infoDetailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
    width: '100%',
    minHeight: 40,
    paddingTop: 10,
    flexDirection: 'row'
  }, infoDetailLabel: {
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  infoDetailLabelText: {
    color: Colors.BLACK,
    fontWeight: 'bold'
  },
  infoDetailValue: {
    flex: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }, infoDetailValueText: {
    color: '#707070'
  },
  infoDetailValueNote: {
    fontSize: 10,
    color: '#0D7D23'
  }
})
