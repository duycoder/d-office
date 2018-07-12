/**
 * @description: định dạng style cho sidebar
 * @author: duynn
 * @since: 05/05/2018
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { scale, verticalScale, moderateScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

export const SideBarStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
    }, headerBackground: {
        flex: 1,
        borderBottomColor: '#d4d4d4',
        borderBottomWidth: 1,
        flexDirection: 'row',
    }, headerAvatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: scale(20),
    }, headerUserInfoContainer: {
        justifyContent: 'center',
        paddingLeft: scale(20),
        alignItems: 'flex-start'
    }, headerAvatar: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(80 / 2), // to create cirlce, width == height && borderRadius == width/2
        resizeMode: 'stretch',
        backgroundColor: Colors.WHITE, // make sure your avatar not seen through
    }, headerUserName: {
        justifyContent: 'center',
        textAlign: 'left', // Change from 'center' to 'left'
        fontWeight: 'bold',
        color: '#000',
        fontSize: moderateScale(16, 1.2)
    }, headerUserJob: {
        fontSize: moderateScale(11, 1.7),
        fontWeight: 'normal'
    },
    body: {
        flex: 3,
        backgroundColor: '#fff'
    }, listItemTitle: {
        fontWeight: 'bold',
        color: 'black'
    }, listItemContainer: {
        height: verticalScale(60),
        justifyContent: 'center',
        borderBottomColor: '#cccccc',
        backgroundColor: '#fff'
    }, subItemContainer: {
        height: verticalScale(60),
        justifyContent: 'center',
        borderBottomColor: '#cccccc'
    }, listItemSubTitleContainer: {
        color: '#000',
        marginLeft: scale(40)
    }, listItemFocus: {
        backgroundColor: '#cccccc',
    }, listItemSubTitleContainerFocus: {
        color: '#fff',
        fontWeight: 'bold',
    }, listItemLeftIcon: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },
    chatNotificationContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    }, chatNotificationCircle: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginLeft: moderateScale(-15),
        backgroundColor: Colors.RED_PANTONE_186C,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(10)
    }, chatNotificationText: {
        fontSize: moderateScale(10),
        color: Colors.WHITE,
        fontWeight: 'bold'
    }
});