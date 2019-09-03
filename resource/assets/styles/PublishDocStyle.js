/**
 * @description: định dạng style văn bản phát hành
 * @author: duynn
 * @since: 05/05/2018
 */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant'
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListPublishDocStyle = StyleSheet.create({
    emtpyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyIcon: {
        width: moderateScale(100),
        height: moderateScale(100),
        resizeMode: 'contain'
    },
    emptyMessage: {
        color: '#ccc',
        fontSize: moderateScale(16, 1.6),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    leftSide: {
        width: scale(30)
    },
    rightSize: {
        width: scale(30)
    },
    leftIcon: {

    },
    abridgment: {
        fontSize: moderateScale(11, 1.1),
        flexWrap: 'wrap'
    }, abridgmentSub: {
        fontSize: moderateScale(10, 0.8)
    },
    textNormal: {
        color: '#000'
    },
    textRead: {
        color: '#888'
    }
});

export const DetailPublishDocStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        marginTop: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderBottomColor: '#cbd2d9'
    },
    listItemContainer: {
        paddingTop: verticalScale(10),
        paddingRight: scale(10),
        paddingBottom: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5'
    }, listItemTitleContainer: {
        fontWeight: 'bold',
        color: "#777",
        fontSize: moderateScale(11, 0.9)
    }, listItemSubTitleContainer: {
        fontSize: moderateScale(12, 1.3),
        color: 'black',
        fontWeight: 'normal'
    }, timelineContainer: {
        paddingTop: verticalScale(20),
        flex: 1,
    }, timeContainer: {

    }, time: {

    }, commentButtonContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    }, commentCircleContainer: {
        width: 20,
        height: 20,
        marginLeft: -15,
        backgroundColor: Colors.BLUE_PANTONE_640C,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }, commentCountText: {
        fontSize: 10,
        color: Colors.WHITE,
        fontWeight: 'bold'
    }
});