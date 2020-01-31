/**
 * @description: các hàm tạo hiệu ứng
 * @author: duynn
 * @since: 04/05/2018
 */
import React, { Component } from 'react';
import { LOADER_COLOR, Colors } from '../common/SystemConstant';
import { Text, View, Modal, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { indicatorResponsive, scale, moderateScale, verticalScale } from '../assets/styles/ScaleIndicator';
// import { isBuffer } from 'util';
import * as util from 'lodash';
import { Icon } from 'react-native-elements';

function authenticateLoading(isVisible) {
    return (
        <Modal
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => { }}
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


function executeLoading(isVisible) {
    return (
        <Modal
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => { }}
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

function dataLoading(isVisible) {
    if (isVisible) {
        return (
            <View style={styles.alContainer}>
                <ActivityIndicator size={indicatorResponsive} color={LOADER_COLOR} />
            </View>
        );
    }
    return null;
}

function getFileSize(fileSize) {
    if (fileSize && util.isNumber(fileSize)) {
        if (fileSize >= 1048576) {
            return `${util.round((fileSize / 1048576), 2)} MB`;
        } else if (fileSize >= 1024) {
            return `${util.round((fileSize / 1024), 2)} KB`;
        } else {
            return `${fileSize} KB`;
        }
    }
    return '0 KB';
}

function getFileExtensionLogo(extension) {
    const imageExtensions = ['image/jpg', 'image/jpeg', 'image/png', 'png', 'jpg', 'jpeg'];
    const docExtension = ['doc', 'docx'];
    const excelExtension = ['xls', 'xlsx'];
    const pdfExtension = ['pdf', 'application/pdf'];
    const txtExtesion = ['txt'];

    let backgroundColor = Colors.LITE_BLUE;
    let isIcon = false;
    let iconName = null;
    let extText = null;
    if (extension) {
        extension = extension.toLowerCase();
    }
    if (imageExtensions.includes(extension)) {
        isIcon = true;
        iconName = 'google-photos'
    } else if (docExtension.includes(extension)) {
        backgroundColor = '#0263A8';
        extText = "DOC"
    } else if (excelExtension.includes(extension)) {
        backgroundColor = '#0D7D23';
        extText = "XLS"
    } else if (pdfExtension.includes(extension)) {
        backgroundColor = '#FF0000';
        extText = "PDF";
    } else if (txtExtesion.includes(extension)) {
        backgroundColor = '#FE6500';
        extText = "PDF";
    } else {
        isIcon = true;
        iconName = 'file'
    }
    return <View style={{
        width: moderateScale(35, 1.2), height: moderateScale(35, 1.2),
        backgroundColor,
        padding: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        {
            isIcon ? <Icon name={iconName} color={Colors.WHITE} size={verticalScale(25)} type='material-community' /> :
                <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: moderateScale(14, 0.78) }}>{extText}</Text>
        }
    </View>
}

export {
    authenticateLoading,
    executeLoading,
    dataLoading,
    getFileSize,
    getFileExtensionLogo,
}


const alBorderBlockStyle = (Platform.OS === 'ios') ? { backgroundColor: 'rgba(48, 40, 41, 0.8)', width: moderateScale(150, 1.5), height: moderateScale(150, 1.5), flexDirection: 'column', borderWidth: 0.5, borderColor: 'black' } : { backgroundColor: Colors.LITE_BLUE, width: scale(200), height: verticalScale(100), flexDirection: 'row' };

const styles = StyleSheet.create({
    alContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    alBorderBlock: {
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-around'
    }, alText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(14, 1.3),
        color: '#fff'
    }, alExecuteText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(14, 1.3),
        color: '#fff'
    }, alExecuteBorderBlock: {
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});