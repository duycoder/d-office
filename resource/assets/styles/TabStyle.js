/**
 * @description: định nghĩa style cho tab
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {scale, verticalScale, moderateScale} from './ScaleIndicator';

export const TabStyle = StyleSheet.create({
    tabText: {
        fontSize: moderateScale(10,0.9)
    },
    activeTab: {
        backgroundColor: '#fff'
    }, activeText: {
        color: '#FF0033',
        fontWeight: 'bold'
    }, inActiveTab: {
        backgroundColor: '#fff'
    }, inActiveText: {
        color: '#FF0033'
    }, underLineStyle: {
        borderBottomWidth: verticalScale(4),
        borderBottomColor: '#FF0033'
    }
});