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
        flex: 1,
    },
    header: {
        flex: 1,
    }, headerBackground: {
        flex: 1,
        borderBottomColor: '#d4d4d4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    }, headerAvatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: scale(20),
        marginBottom: verticalScale(10)
    }, headerUserInfoContainer: {
        justifyContent: 'center',
        paddingLeft: scale(20),
        alignItems: 'center',
        marginBottom: verticalScale(15)
    }, headerAvatar: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25), // to create cirlce, width == height && borderRadius == width/2
        resizeMode: 'stretch',
        backgroundColor: Colors.WHITE, // make sure your avatar not seen through
    }, headerUserName: {
        justifyContent: 'center',
        textAlign: 'left', // Change from 'center' to 'left'
        fontWeight: 'bold',
        color: Colors.BLACK,
        fontSize: moderateScale(15, 1.2)
    }, headerUserJob: {
        fontSize: moderateScale(11, 1.7),
        fontWeight: 'normal'
    }, headerSignoutIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        
        elevation: 10,
        marginBottom: verticalScale(10)
    },
    body: {
        flex: 4,
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
        // flexWrap: 'wrap',
        marginHorizontal: '2.5%',
    }, shortcutBoxStyle: {
        backgroundColor: Colors.LITE_BLUE,
        // borderWidth: 1,
        borderColor: Colors.DANK_BLUE,
        shadowColor: Colors.DANK_BLUE,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        padding: moderateScale(11),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        // flexBasis: '30%',
        // width: ''
    }, shortcutBoxTextStyle: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: moderateScale(13, 1.2),
        flexWrap: 'wrap'
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
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

        padding: moderateScale(11),
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexBasis: '30%',
        marginVertical: '2.5%'
    }, normalBoxTextStyle: {
        color: Colors.BLACK,
        textAlign: 'center',
        // fontWeight: 'bold',
        fontSize: moderateScale(12, 0.9),
        flex: 1,
    }

});