/**
 * @description: định nghĩa style cho tab
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';

export const TabStyle = StyleSheet.create({
    tabText: {
        fontSize: moderateScale(10, 0.9)
    },
    activeTab: {
        backgroundColor: COMMON_COLOR.WHITE,
        height: moderateScale(46, 1.07),
    }, activeText: {
        color: COMMON_COLOR.DANK_BLUE,
        fontWeight: 'bold',
        fontSize: moderateScale(14, 0.78),
    }, inActiveTab: {
        backgroundColor: COMMON_COLOR.WHITE,
        height: moderateScale(46, 0.89),
    }, inActiveText: {
        color: COMMON_COLOR.DANK_BLUE,
        fontSize: moderateScale(14, 0.78),
    }, underLineStyle: {
        borderBottomWidth: verticalScale(4),
        borderBottomColor: COMMON_COLOR.DANK_BLUE
    }, iconStyle: {
        fontSize: moderateScale(15, 1.02),
        color: COMMON_COLOR.DANK_BLUE,
    },
});