/**
 * @description: định dạng style cho sidebar
 * @author: duynn
 * @since: 05/05/2018
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';

import { scale, verticalScale, moderateScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

export const SideBarStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.LIGHT_GRAY_PASTEL
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
        // marginBottom: verticalScale(10)
    }, headerUserInfoContainer: {
        justifyContent: 'center',
        paddingLeft: scale(20),
        alignItems: 'center',
        // marginBottom: verticalScale(15)
    }, headerAvatar: {
        width: moderateScale(30),
        height: moderateScale(30),
        // borderRadius: moderateScale(25), // to create cirlce, width == height && borderRadius == width/2
        resizeMode: 'stretch',
        // backgroundColor: Colors.WHITE, // make sure your avatar not seen through
    }, headerUserName: {
        justifyContent: 'center',
        textAlign: 'left', // Change from 'center' to 'left'
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: moderateScale(14, 1.2)
    }, headerUserJob: {
        fontSize: moderateScale(11, 1.3),
        fontStyle: 'italic',
        color: Colors.WHITE
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
        flex: 5,
        backgroundColor: "#f1f1f1", //Colors.LIGHT_GRAY_PASTEL
    }, listItemTitle: {
        fontWeight: 'bold',
        color: 'black',
        // fontSize: moderateScale(16,1.2),
    }, listItemContainer: {
        height: verticalScale(60),
        justifyContent: 'center',
        borderBottomColor: '#cccccc',
        backgroundColor: Colors.LIGHT_GRAY_PASTEL
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
        // justifyContent: 'space-between',
        // marginVertical: verticalScale(13),
        // flexWrap: 'wrap',
        // marginHorizontal: '0.5%',
    }, shortcutBoxStyle: {
        // backgroundColor: Colors.LITE_BLUE,
        // borderWidth: 1,
        borderColor: Colors.DANK_BLUE,
        // shadowColor: Colors.DANK_BLUE,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,
        paddingVertical: moderateScale(12, 0.8),
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginHorizontal: '1%',
        // minHeight:
        // flexBasis: '30%',
        // width: ''
    }, shortcutBoxTextStyle: {
        color: Colors.BLACK,
        textAlign: 'center',
        // fontWeight: 'bold',
        fontSize: moderateScale(10, 0.8),
        // flexWrap: 'wrap',
        // flex: 1,
    }, customIconContainerStyle: {
        // padding: moderateScale(10),
        flex: 0,
        backgroundColor: '#fff',
        // borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%'
    }, customIconImageStyle: {
        width: moderateScale(30),
        height: moderateScale(30)
    },
    normalBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '0.5%',
        // marginVertical: verticalScale(4),
    }, normalBoxStyle: {
        backgroundColor: Colors.WHITE,
        // borderWidth: 1,
        // borderRadius: 5,
        // borderColor: Colors.BLACK,
        // shadowColor: Colors.BLACK,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,

        padding: moderateScale(11),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '33.3%',
        // flexBasis: '30%',
        // marginVertical: '2.5%'
    }, normalBoxTextStyle: {
        color: Colors.BLACK,
        textAlign: 'center',
        // fontWeight: 'bold',
        fontSize: moderateScale(12, 0.8),
        flex: 1,
    },

});