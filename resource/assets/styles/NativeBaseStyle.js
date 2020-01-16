import React, { Component } from 'react-native';
import { StyleSheet, Platform } from 'react-native';
import { moderateScale, verticalScale, scale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

const NativeBaseStyle = StyleSheet.create({
    container: {
        // height: moderateScale(62),
        backgroundColor: Colors.LITE_BLUE,
    },
    left: {
        flex: 1,
    },
    body: {
        flex: 3,
        alignItems: 'center'
    }, bodyTitle: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(15, 0.82),
    }, minorBodyTitle: {
        color: Colors.WHITE,
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
        backgroundColor: Colors.MENU_BLUE,
    }
});
const addBtnIconSize = moderateScale(30, 1.2);

const MoreButtonStyle = StyleSheet.create({
    button: {
        backgroundColor: Colors.BLUE_PANTONE_640C,
        height: moderateScale(42, 1.03),
    }, buttonText: {
        color: Colors.WHITE,
        fontSize: moderateScale(13, 1.11),
    },
});

const SearchSectionStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
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