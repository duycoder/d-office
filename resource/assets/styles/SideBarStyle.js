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
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(60 / 2), // to create cirlce, width == height && borderRadius == width/2
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
        flex: 5,
        backgroundColor: '#fff'
    }, listItemTitle: {
        fontWeight: 'bold',
        color: 'black',
        // fontSize: moderateScale(16,1.2),
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
        marginLeft: moderateScale(8, .8)
    }, listItemFocus: {
        backgroundColor: '#cccccc',
    }, listItemSubTitleContainerFocus: {
        color: '#fff',
        fontWeight: 'bold',
    }, listItemLeftIcon: {
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        // marginLeft: scale(10)
    },
    chatNotificationContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    }, chatNotificationCircle: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginLeft: moderateScale(-15),
        backgroundColor: Colors.LITE_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(10)
    }, chatNotificationText: {
        fontSize: moderateScale(10),
        color: Colors.WHITE,
        fontWeight: 'bold'
    },
    shortcutBoxContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: verticalScale(13),
        flexWrap: 'wrap',
        marginHorizontal: '5%',
    }, shortcutBoxStyle: {
        backgroundColor: Colors.LITE_BLUE,
        // borderWidth: 1,
        borderColor: Colors.DANK_BLUE,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 3,
            height: 3
        },
        padding: moderateScale(11),
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: '30%',
        // width: ''
    }, shortcutBoxTextStyle: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: moderateScale(13, 1.2),
    },
    normalBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: '5%',
        marginVertical: verticalScale(4)
    }, normalBoxStyle: {
        backgroundColor: Colors.WHITE,
        // borderWidth: 1,
        // borderRadius: 5,
        borderColor: Colors.BLACK,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 3,
            height: 3
        },
        padding: moderateScale(11),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexBasis: '30%',
        marginVertical: verticalScale(4)
    }, normalBoxTextStyle: {
        color: Colors.BLACK,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: moderateScale(13, 1.2),
    }

});