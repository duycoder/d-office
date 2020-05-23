import React, { Component } from 'react-native';
import { StyleSheet, Platform } from 'react-native';
import { moderateScale, verticalScale, scale } from './ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';

const NativeBaseStyle = StyleSheet.create({
    container: {
        // height: moderateScale(62),
        backgroundColor: COMMON_COLOR.LITE_BLUE,
    },
    left: {
        flex: 1,
    },
    body: {
        flex: 3,
        alignItems: 'center'
    }, bodyTitle: {
        color: COMMON_COLOR.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(15, 0.82),
    }, minorBodyTitle: {
        color: COMMON_COLOR.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(12, 0.76),
    },
    right: {
        flex: 1,
        alignItems: 'center'
    }
});

const AddButtonStyle = StyleSheet.create({
    container: {
        marginRight: 50,
    }, button: {
        width: moderateScale(48, 0.76),
        height: moderateScale(48, 0.76),
        borderRadius: moderateScale(24, 0.76),
        backgroundColor: COMMON_COLOR.MENU_BLUE,
    }
});
const addBtnIconSize = moderateScale(30, 1.2);

const MoreButtonStyle = StyleSheet.create({
    button: {
        backgroundColor: COMMON_COLOR.BLUE_PANTONE_640C,
        height: moderateScale(42, 1.03),
    }, buttonText: {
        color: COMMON_COLOR.WHITE,
        fontSize: moderateScale(13, 1.11),
    },
});

const SearchSectionStyle = StyleSheet.create({
    container: {
        backgroundColor: COMMON_COLOR.WHITE,
        flex: 10,
        height: moderateScale(28, 0.88),
    },
    leftIcon: {
        marginLeft: scale(8),
    },
    rightIcon: {
        marginRight: scale(8),
    },
});

export {
    NativeBaseStyle,
    AddButtonStyle,
    addBtnIconSize,
    MoreButtonStyle,
    SearchSectionStyle,
}