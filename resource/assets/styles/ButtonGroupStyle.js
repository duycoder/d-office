import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

//constant
import { Colors } from '../../common/SystemConstant'
import { verticalScale , moderateScale} from './ScaleIndicator';

export const ButtonGroupStyle = StyleSheet.create({
    container: {
        height: verticalScale(50),
        alignItems: 'center',
        backgroundColor: Colors.LITE_BLUE,
    },
    button: {
        width: '100%',
        height: verticalScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.LITE_BLUE,
        padding: moderateScale(5),
        // borderRadius: 25
    },
    buttonText: {
        textAlign: 'center',
        color: Colors.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(13, 0.88),
    }
})