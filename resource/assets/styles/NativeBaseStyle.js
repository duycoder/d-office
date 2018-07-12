import React, { Component } from 'react-native';
import { StyleSheet } from 'react-native';

export const NativeBaseStyle = StyleSheet.create({
    left: {
        flex: 1
    }, body: {
        flex: 3, alignItems: 'center'
    }, bodyTitle: {
        color: '#fff',
        fontWeight: 'bold'
    }, right: {
        flex: 1
    }
})