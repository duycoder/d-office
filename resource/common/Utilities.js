/**
 * @description: hàm tiện ích
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict';
import React, { Component } from 'react';
import { AsyncStorage, View, Text, Image } from 'react-native';
import * as util from 'lodash';
//lib
import { Button, Icon, Text as NBText } from 'native-base'
import { SAD_FACE_ICON_URI, EMTPY_DATA_MESSAGE, EMPTY_DATA_ICON_URI } from './SystemConstant'

//style
import { verticalScale, moderateScale } from '../assets/styles/ScaleIndicator';

//rút gọn đoạn văn dài
export function formatLongText(text, size) {
    if (size > 1) {
        if (text.length > size) {
            text = text.substring(0, size - 1);
            text += '...';
        }
    }
    return text;
}

//chuyển định dạng ngày
export function convertDateToString(date) {
    let deadline = new Date();
    if (date !== null && date !== '') {
        deadline = new Date(date);
        let deadlineStr = (_readableFormat(deadline.getDate()) + '/' + _readableFormat(deadline.getMonth() + 1) + '/' + deadline.getFullYear());
        return deadlineStr;
    }
    return 'N/A';
}

//chuyển sang định dạng hh/mm/ss
export function convertTimeToString(date) {
    let deadline = new Date();
    if (date !== null && date !== '') {
        deadline = new Date(date);
        let result = deadline.getHours() + ':' + deadline.getMinutes() + ':' + deadline.getSeconds();
        return result;
    }
    return 'N/A';
}

//chuyển sang định dạng ngày/tháng/năm
export function convertDateTimeToString(date) {

    if (date !== null && date !== '') {
        let deadline = new Date(date);
        //const pad = val => val < 10 ? '0' + val : val; // Append '0' before alone dateTime

        let deadlineStr = _readableFormat(deadline.getDate()) + '/' + _readableFormat(deadline.getMonth() + 1) + '/' + deadline.getFullYear();

        deadlineStr += ' ' + _readableFormat(deadline.getHours()) + ':' + _readableFormat(deadline.getMinutes()) + ':' + _readableFormat(deadline.getSeconds());
        return deadlineStr;
    }
    return 'N/A';
}

export function convertDateTimeToTitle(date){
    if(isObjectHasValue(date) && date !== ''){
        let jsDate = new Date(date);
        let result = '';
        
        let datePart = _readableFormat(jsDate.getDate()) + '/' + _readableFormat(jsDate.getMonth() + 1) + '/' + jsDate.getFullYear();
        let timePart = _readableFormat(jsDate.getHours()) + ':' + _readableFormat(jsDate.getMinutes());

        result = `${datePart} lúc ${timePart}`;
        return result;
    }
    return 'N/A'
}

//Thêm '0' vào trước ngày tháng nếu chỉ có một chữ số
function _readableFormat(value) {
    return (value < 10) ? '0' + value : value;
}

export const asyncDelay = (ms) => {
    return new Promise(result => setTimeout(result, ms));
};

export function unAuthorizePage(navigation) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/images/error.png')} style={{ width: '30%', height: '30%', resizeMode: 'contain' }} />
            <Text style={{ color: '#FF0033', fontWeight: 'bold', fontSize: moderateScale(16, 1.2) }}>
                XIN LỖI!
            </Text>
            <Text style={{ color: '#FF0033', fontWeight: 'normal', marginBottom: verticalScale(20) }}>
                BẠN KHÔNG CÓ QUYỀN TRUY CẬP VĂN BẢN NÀY
            </Text>
        </View>
    )
}

export function emptyDataPage() {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image source={EMPTY_DATA_ICON_URI} style={{
                width: moderateScale(100),
                height: moderateScale(100),
                resizeMode: 'contain'
            }} />
            <Text style={{
                color: '#ccc',
                fontSize: moderateScale(16, 1.2),
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                {EMTPY_DATA_MESSAGE}
            </Text>
        </View>
    )
}


export function openSideBar(navigation) {
    navigation.navigate('DrawerOpen');
}

export function closeSideBar(navigation) {
    navigation.navigate('DrawerClose');
}

export async function getUserInfo() {
    const userInfo = await AsyncStorage.getItem('userInfo').then((result) => {
        return result;
    });
    return userInfo;
}

/**
 * @description: kiểm tra ảnh
 * @author: duynn
 * @param {*} mimetype 
 */
export function isImage(mimetype) {
    const imageMimeTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    const isImage = imageMimeTypes.indexOf(mimetype) !== -1;
    return isImage;
}

//lấy mã màu theo danh phần trăm hoàn thành
export function getColorCodeByProgressValue(progressValue) {
    let result = '#FF0033';
    progressValue = progressValue || 0;

    if (progressValue <= 0) {
        return result;
    } else if (progressValue > 0 && progressValue < 25) {
        result = '#FF6600';
    } else if (progressValue >= 25 && progressValue < 75) {
        result = '#F7B512';
    } else if (progressValue >= 75 && progressValue < 100) {
        result = '#A60066';
    } else {
        result = '#337321';
    }
    return result;
}


//điều hướng
export function appNavigate(navigation, screenName, screenParam){
    if(navigation){
        navigation.navigate(screenName, screenParam);
    }
}

export function isObjectHasValue(obj){
    return util.isUndefined(obj) == false && util.isNull(obj) == false;
}