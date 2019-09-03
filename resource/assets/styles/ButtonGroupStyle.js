import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

//constant
import { Colors } from '../../common/SystemConstant'

export const ButtonGroupStyle = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        backgroundColor: Colors.LITE_BLUE,
    },
    button: {
        width:'100%',
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.LITE_BLUE,
        borderRadius: 25
    },
    buttonText: {
        textAlign: 'center',
        color: Colors.WHITE,
        fontWeight: 'bold',
    }
})