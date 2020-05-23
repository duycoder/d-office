import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

//constant
import { COMMON_COLOR } from '../../common/SystemConstant'
import { verticalScale , moderateScale} from './ScaleIndicator';

export const ButtonGroupStyle = StyleSheet.create({
    container: {
        height: verticalScale(50),
        alignItems: 'center',
        backgroundColor: COMMON_COLOR.LITE_BLUE,
    },
    button: {
        width: '100%',
        height: verticalScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COMMON_COLOR.LITE_BLUE,
        padding: moderateScale(5),
        // borderRadius: 25
    },
    buttonText: {
        textAlign: 'center',
        color: COMMON_COLOR.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(13, 0.88),
    }
})