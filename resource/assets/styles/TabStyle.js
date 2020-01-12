/**
 * @description: định nghĩa style cho tab
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

export const TabStyle = StyleSheet.create({
    tabText: {
        fontSize: moderateScale(10, 0.9)
    },
    activeTab: {
        backgroundColor: Colors.WHITE,
        height: moderateScale(46, 1.07),
    }, activeText: {
        color: Colors.DANK_BLUE,
        fontWeight: 'bold',
        fontSize: moderateScale(14, 0.78),
    }, inActiveTab: {
        backgroundColor: Colors.WHITE,
        height: moderateScale(46, 0.89),
    }, inActiveText: {
        color: Colors.DANK_BLUE,
        fontSize: moderateScale(14, 0.78),
    }, underLineStyle: {
        borderBottomWidth: verticalScale(4),
        borderBottomColor: Colors.DANK_BLUE
    }, iconStyle: {
        fontSize: moderateScale(15, 1.02),
        color: Colors.DANK_BLUE,
    },
});