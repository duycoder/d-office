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