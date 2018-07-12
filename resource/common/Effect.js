/**
 * @description: các hàm tạo hiệu ứng
 * @author: duynn
 * @since: 04/05/2018
 */
import React, { Component } from 'react';
import { LOADER_COLOR } from '../common/SystemConstant';
import { Text, View, Modal, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import {indicatorResponsive, scale,moderateScale, verticalScale} from '../assets/styles/ScaleIndicator';

export function authenticateLoading(isVisible) {
    return (
        <Modal onRequestClose={() => { }}
            animationTyal='fade'
            transparent={true}
            visible={isVisible}>
            <View style={[styles.alContainer, { backgroundColor: 'rgba(52, 52, 52, 0.8)' }]}>
                <View style={[styles.alBorderBlock, alBorderBlockStyle]}>
                    <ActivityIndicator size={indicatorResponsive} color={'#fff'} />
                    <Text style={styles.alText}>
                        ...Đang xác thực
                    </Text>
                </View>
            </View>
        </Modal>
    )
}


export function executeLoading(isVisible) {
    return (
        <Modal onRequestClose={() => { }}
            animationTyal='fade'
            transparent={true}
            visible={isVisible}>
            <View style={[styles.alContainer, { backgroundColor: 'rgba(52, 52, 52, 0.8)' }]}>
                <View style={[styles.alExecuteBorderBlock, alBorderBlockStyle]}>
                    <ActivityIndicator size={indicatorResponsive} color={'#fff'} />
                    <Text style={styles.alExecuteText}>
                        ...Đang xử lý
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export function dataLoading(isVisible) {
    return (
        <View style={styles.alContainer}>
            <ActivityIndicator size={indicatorResponsive} color={LOADER_COLOR} />
        </View>
    )
}

const alBorderBlockStyle = (Platform.OS === 'ios') ? {backgroundColor: 'rgba(48, 40, 41, 0.8)', width: moderateScale(150, 1.5), height: moderateScale(150, 1.5), flexDirection:'column', borderWidth: 0.5, borderColor: 'black'} : {backgroundColor: '#da2032', width: scale(200), height: verticalScale(100), flexDirection:'row'} ;

const styles = StyleSheet.create({
    alContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
        // backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    alBorderBlock: {
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-around'
    }, alText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(14,1.3),
        color: '#fff'
    },alExecuteText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(14,1.3),
        color: '#fff'
    },alExecuteBorderBlock:{
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});