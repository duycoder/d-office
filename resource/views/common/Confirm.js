/**
 * @description: modal confirm cho hệ thống
 * @author: duynn
 * @since: 05/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { AsyncStorage, Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { API_URL } from '../../common/SystemConstant'

//native
import { Header } from 'react-native-elements';
import { Footer } from 'native-base';

//style
import { scale, verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

export default class Confirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            title: props.title || ''
        }
    }

    onModalClose() {
        console.log('Confirm Action', 'Modal has closed.');
    }

    showModal() {
        this.setState({
            isVisible: true
        })
    }

    closeModal() {
        this.setState({
            isVisible: false
        })
    }

    async signOut() {
        //lấy thông tin người dùng từ storage
        const userInfoJSON = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoJSON);

        //vô hiệu hóa token hiện tại của thiết bị với người dùng hiện tại
        const deActiveTokenResult = await fetch(`${API_URL}/api/Account/DeActiveUserToken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }, body: JSON.stringify({
                userId: userInfo.ID,
                token: userInfo.Token
            })
        }).then(response => response.json())
            .then(responseJson => {
                return responseJson
            });


        //xóa dữ liệu storage of người dùng trên thiết bị
        AsyncStorage.removeItem('userInfo').then(() => {
            this.props.navigation.navigate('LoadingScreen');
        });
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={() => this.onModalClose()}>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Header 
                            outerContainerStyles={styles.headerOuter}
                            centerComponent={
                                <Text style={styles.headerCenterTitle}>
                                    {this.state.title}
                                </Text>
                            }
                        />
                        <View style={styles.content}>
                            <Text style={styles.contentText}>
                                Bạn có chắc chắn muốn thoát {'\n'} ứng dụng D-OFFICE?
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.leftFooter}>
                                <TouchableOpacity onPress={() => this.closeModal()} style={styles.footerButton}>
                                    <Text style={styles.footerText}>
                                        Không
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rightFooter}>
                                <TouchableOpacity onPress={() => this.signOut()} style={styles.footerButton}>
                                    <Text style={styles.footerText}>
                                        Có
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    }, body: {
        width: scale(300),
        height: verticalScale(200),
        borderRadius: 3,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ececec'
    }, headerCenterTitle: {
        color: '#2455A6',
        fontWeight: 'bold'
    }, headerOuter: {
        height: verticalScale(50),
        borderBottomColor: '#2455A6',
        borderBottomWidth: 3,
        backgroundColor: '#fff',
        paddingHorizontal:scale(10),
        paddingVertical:verticalScale(10)
    }, content: {
        height: verticalScale(100),
        justifyContent: 'center',
        alignItems: 'center',
    }, contentText: {
        color: '#000',
        fontSize: moderateScale(18, 1.3),
        textAlign: 'center'
    }, footer: {
        height: verticalScale(50),
        borderTopColor: '#ececec',
        borderTopWidth: verticalScale(2),
        flexDirection: 'row'
    }, leftFooter: {
        flex: 1,
        borderRightWidth: scale(2),
        borderRightColor: '#ececec'
    }, rightFooter: {
        flex: 1,
    }, footerText: {
        color: '#000'
    }, footerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

