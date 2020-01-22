/**
 * @description: hàm tiện ích
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict';
import React, { Component } from 'react';
import {
    Alert, AsyncStorage, View, Text,
    Image, BackHandler, Platform, PermissionsAndroid
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import OpenFile from 'react-native-doc-viewer';
import * as util from 'lodash';
//lib
import { Button, Icon, Text as NBText, Toast } from 'native-base'
import { SAD_FACE_ICON_URI, EMTPY_DATA_MESSAGE, EMPTY_DATA_ICON_URI, Colors, WEB_URL, ASYNC_DELAY_TIMEOUT, APPLICATION_SHORT_NAME } from './SystemConstant'
import AlertMessage from '../views/common/AlertMessage';
import AlertMessageStyle from '../assets/styles/AlertMessageStyle';

//style
import { verticalScale, moderateScale } from '../assets/styles/ScaleIndicator';

//rút gọn đoạn văn dài
export function formatLongText(text, size) {
    if (size > 1) {
        if (!text) {
            return "";
        }
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
        let deadlineStr = (_readableFormat(deadline.getUTCDate()) + '/' + _readableFormat(deadline.getMonth() + 1) + '/' + deadline.getFullYear());
        return deadlineStr;
    }
    return 'N/A';
}

//chuyển sang định dạng hh/mm/ss
export function convertTimeToString(date) {
    let deadline = new Date();
    if (date !== null && date !== '') {
        deadline = new Date(date);
        let result = _readableFormat(deadline.getUTCHours()) + ':' + _readableFormat(deadline.getUTCMinutes()) + ':' + _readableFormat(deadline.getUTCSeconds());
        return result;
    }
    return 'N/A';
}

//chuyển sang định dạng ngày/tháng/năm
export function convertDateTimeToString(date, isYearShorten = false) {

    if (date !== null && date !== '') {
        let deadline = new Date(date);
        let deadlineStr = _readableFormat(deadline.getUTCDate()) + '/' + _readableFormat(deadline.getMonth() + 1) + '/' + (isYearShorten ? deadline.getFullYear().toString().slice(2) : deadline.getFullYear());
        deadlineStr += ' ' + _readableFormat(deadline.getUTCHours()) + ':' + _readableFormat(deadline.getUTCMinutes()) + ':' + _readableFormat(deadline.getUTCSeconds());
        return deadlineStr;
    }
    return 'N/A';
}

export function convertDateTimeToTitle(date, isShort = false) {
    // if (isExperiment) {
    //     if (isObjectHasValue(date) && !util.isEmpty(date)) {
    //         let jsDateArr = date.split("T");
    //         let dateArr = jsDateArr[0].split("-"), 
    //             timeArr = jsDateArr[1].split(":");

    //         let datePart = dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0];
    //         let timePart = timeArr[0] + ':' + timeArr[1];

    //         return `${datePart} lúc ${timePart}`;
    //     }
    // }
    if (isObjectHasValue(date) && date !== '') {
        let jsDate = new Date(date);
        let result = '';

        let datePart = _readableFormat(jsDate.getUTCDate()) + '/' + _readableFormat(jsDate.getMonth() + 1) + '/' + jsDate.getFullYear().toString().slice(2);
        let timePart = _readableFormat(jsDate.getUTCHours()) + ':' + _readableFormat(jsDate.getUTCMinutes());

        result = isShort ? `${timePart}\n${datePart}` : `${datePart} lúc ${timePart}`;
        return result;
    }
    return 'N/A'
}

//Add Zero('0') before date/time
export function _readableFormat(value) {
    return (value < 10) ? '0' + value : value;
}

export const asyncDelay = (ms = ASYNC_DELAY_TIMEOUT) => {
    return new Promise(result => setTimeout(result, ms));
};

export function unAuthorizePage(navigation) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/images/error.png')} style={{ width: '30%', height: '30%', resizeMode: 'contain' }} />
            <Text style={{ color: Colors.DANK_BLUE, fontWeight: 'bold', fontSize: moderateScale(16, 1.2) }}>
                XIN LỖI!
            </Text>
            <Text style={{ color: Colors.DANK_BLUE, fontWeight: 'normal', marginBottom: verticalScale(20) }}>
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
export function appNavigate(navigation, screenName, screenParam) {
    if (navigation) {
        navigation.navigate(screenName, screenParam);
    }
}

/**
 * Lưu thông tin màn hình trước đó và di chuyển đến màn hình mới
 * @param {*} navigation 
 * @param {*} currentScreenName 
 * @param {*} currentScreenParam 
 * @param {*} targetScreenName 
 * @param {*} targetScreenParam 
 */
export async function appStoreDataAndNavigate(navigation, currentScreenName, currentScreenParam,
    targetScreenName, targetScreenParam) {
    await AsyncStorage.multiSet([
        [`${targetScreenName}-PreviousScreenName`, currentScreenName.toString()],
        [`${targetScreenName}-PreviousScreenParam`, JSON.stringify(currentScreenParam)]
    ]).then(() => {
        navigation.navigate(targetScreenName, targetScreenParam);
    })
}

//lấy dữ liệu của màn hình trước đó và trửa
export async function appGetDataAndNavigate(navigation, currentScreenName) {
    await AsyncStorage.multiGet([`${currentScreenName}-PreviousScreenName`, `${currentScreenName}-PreviousScreenParam`]).then((rs) => {
        const targetScreenName = rs[0][1];
        const targetScreenParam = JSON.parse(rs[1][1]);

        navigation.navigate(targetScreenName, targetScreenParam);
    });
}

//cấu hình nút go back trên android
export function backHandlerConfig(isAddEventListener, callback) {
    if (isAddEventListener) {
        BackHandler.addEventListener('hardwareBackPress', callback);
    } else {
        BackHandler.removeEventListener('hardwareBackPress', callback);
    }
}

export function isObjectHasValue(obj) {
    return util.isUndefined(obj) == false && util.isNull(obj) == false;
}

//get file extension
export const extention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

export const onDownloadFile = async (fileName, fileLink, fileExtension) => {
    //config save path
    fileLink = fileLink.replace(/\\/, '');
    fileLink = fileLink.replace(/\\/g, '/');
    let date = new Date();
    let url = `${WEB_URL}/Uploads/${fileLink}`;
    if (fileLink.toString().toLowerCase().indexOf("upload") > -1) {
        url = `${WEB_URL}/${fileLink}`;
    }
    // url = url.replace('\\', '/');
    // url = url.replace(/\\/g, '/');
    url = url.replace(/ /g, "%20");

    let regExtension = extention(url);
    let extension = "." + regExtension[0];
    const { config, fs } = RNFetchBlob;
    let { PictureDir, DocumentDir } = fs.dirs;

    let savePath = (Platform.OS === 'android' ? PictureDir : DocumentDir) + "/vnio_" + Math.floor(date.getTime() + date.getSeconds() / 2) + extension;

    let options = {};
    let isAllowDownload = true;
    if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'CẤP QUYỀN TRUY CẬP CHO ỨNG DỤNG',
                message: `${APPLICATION_SHORT_NAME} muốn truy cập vào tài liệu của bạn`,
                buttonNeutral: 'Để sau',
                buttonNegative: 'Thoát',
                buttonPositive: 'OK',
            },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: savePath,
                    description: 'VNIO FILE'
                }
            }
        } else {
            isAllowDownload = false;
        }
    } else {
        options = {
            fileCache: true,
            path: savePath
        }
    }

    if (isAllowDownload) {
        config(options).fetch('GET', url).then((res) => {
            if (res.respInfo.status === 404) {
                Alert.alert(
                    'THÔNG BÁO',
                    'KHÔNG TÌM THẤY TÀI LIỆU',
                    [
                        {
                            text: "ĐÓNG",
                            onPress: () => { }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'THÔNG BÁO',
                    `DOWN LOAD THÀNH CÔNG`,
                    [
                        {
                            text: 'MỞ FILE',
                            onPress: () => {
                                let openDocConfig = {};

                                if (Platform.OS == 'android') {
                                    openDocConfig = {
                                        url: `file://${res.path()}`,
                                        fileName: fileName,
                                        cache: false,
                                        fileType: util.toLower(regExtension[0])
                                    }
                                } else {
                                    openDocConfig = {
                                        url: savePath,
                                        fileNameOptional: fileName
                                    }
                                }

                                OpenFile.openDoc([openDocConfig], (error, url) => {
                                    if (error) {
                                        Alert.alert(
                                            'THÔNG BÁO',
                                            error.toString(),
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => { }
                                                }
                                            ]
                                        )
                                    } else {
                                        console.log(url)
                                    }
                                })
                            }
                        },
                        {
                            text: 'ĐÓNG',
                            onPress: () => { }
                        }
                    ]
                );
            }
        }).catch((err) => {
            Alert.alert(
                'THÔNG BÁO',
                'DOWNLOAD THẤT BẠI',
                [
                    {
                        text: err.toString(),
                        onPress: () => { }
                    }
                ]
            )
        })
    }
}

export function formatMessage(message, screenName, isTaskNotification, itemType, itemId) {
    if (util.isNull(message)) {
        message = "";
    }
    message += "-HINETVNIO-";
    message += "-" + screenName;
    message += "-" + (isTaskNotification) ? "1" : "0";
    message += "-" + (isTaskNotification) ? "0" : itemId.toString();
    message += "-" + (isTaskNotification) ? "0" : itemType.toString();
    message += "-" + (isTaskNotification) ? itemId.toString() : "0";
    return message;

}
/**
 * Style width cho Picker, mặc định: 
 * - `undefined` cho ios
 * - `100%` cho android
 */
export function pickerFormat() {
    return Platform.OS === "ios" ? undefined : '100%'
}
/**
 * Chuyển dạng DD/MM/YYYY thành YYYY/MM/DD
 * @param {string} dateString 
 */
export function convertStringToDate(dateString) {
    return dateString.split("/").reverse().join("-");
}
/**
 * Kiểm tra xem object truyền vào có phải Mảng (Array) không
 * @param {any} needCheckObj object cần kiểm tra
 */
export function isArray(needCheckObj) {
    return !!needCheckObj && needCheckObj.constructor === Array;
}
/**
 * Kiểm tra xem object truyền vào có phải Đối tượng (Object) không
 * @param {any} needCheckObj object cần kiểm tra
 */
export function isObject(needCheckObj) {
    return !!needCheckObj && needCheckObj.constructor === Object;
}
/**
 * Kiểm tra xem object truyền vào có rỗng không
 * @param {*} obj 
 */
export function isObjectEmpty(obj = {}) {
    return Object.keys(obj).length < 1;
}

export function showWarningToast(title = '') {
    Toast.show({
        text: title,
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
    });
}