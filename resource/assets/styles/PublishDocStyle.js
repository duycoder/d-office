/**
 * @description: định dạng style văn bản phát hành
 * @author: duynn
 * @since: 05/05/2018
 */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {scale, verticalScale, moderateScale} from './ScaleIndicator';

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
        fontSize: moderateScale(16,1.6),
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
        fontSize: moderateScale(12,1.2),
        flexWrap: 'wrap'
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
        color: 'black',
        fontSize: moderateScale(14, 1.4)
    }, listItemSubTitleContainer: {
        fontSize: moderateScale(13, 1.3),
        color: '#777',
        fontWeight: 'normal'
    }, timelineContainer: {
        paddingTop: verticalScale(20),
        flex: 1,
    }, timeContainer: {

    }, time: {
        
    }
});