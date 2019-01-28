/**
 * @description: định nghĩa style cho tab
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {scale, verticalScale, moderateScale} from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

export const TabStyle = StyleSheet.create({
    tabText: {
        fontSize: moderateScale(10,0.9)
    },
    activeTab: {
        backgroundColor: '#fff'
    }, activeText: {
        color: Colors.DANK_BLUE,
        fontWeight: 'bold'
    }, inActiveTab: {
        backgroundColor: '#fff'
    }, inActiveText: {
        color: Colors.DANK_BLUE,
    }, underLineStyle: {
        borderBottomWidth: verticalScale(4),
        borderBottomColor: Colors.DANK_BLUE
    }
});