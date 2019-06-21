import React, { Component } from 'react'
import {
    View, AppState, AsyncStorage, PermissionsAndroid,
    Text, TouchableOpacity, TextInput, Picker
} from 'react-native'

import { SERVER_KEY } from '../firebase/FireBaseConstant';

import RNFetchBlob from 'rn-fetch-blob'
import { Colors } from './SystemConstant';
class TestDownLoad extends Component {
    async download() {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                var date = new Date();
                var url = 'http://123.30.149.48:8353/Uploads/1/2150/2/249/baitap_c1_hpt.docx'
                var ext = this.extention(url);
                ext = "." + ext[0];
                const { config, fs } = RNFetchBlob
                let PictureDir = fs.dirs.PictureDir
                let options = {
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: PictureDir + "/image_" + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                        description: 'Image'
                    }
                }
                config(options).fetch('GET', url).then((res) => {
                    alert("Success Downloaded");
                });
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity style={{
                    backgroundColor: Colors.LITE_BLUE
                }} onPress={() => this.download()}>
                    <Text>
                        Download
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class TestFCM extends Component {
    state = {
        token: 'fgE9nLFmTYg:APA91bGpRTnlRbeFcQe4M-Zj7Ys-6-34UInJKZI-3h_zxyi5XF8kxqBhfXQkcvYcXPX2dn5YBhCIaZUe0jfUC4-InVlQQE-3Bs5nlqQ0EgX6zx2nF3CQ3AQebZ5VIRyLdlscZeXNNHB1'
    }

    sendNotification = async () => {
        const body = JSON.stringify({
            to: this.state.token,
            data: {
                custom_notification: {
                    id: new Date().valueOf().toString(),
                    body: '123',
                    title: "THÔNG BÁO"
                }
            },
            badge: 1,
            opened_from_tray: true,
            pickerValue: 1
        })

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key=" + SERVER_KEY
        });

        const fcmResult = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: 'POST',
            headers,
            body
        })

        const fcmResultJSON = await fcmResult.json();

        if (fcmResultJSON.success) {
            alert('gửi thành công');
        } else {
            alert('gửi thất bại');
        }
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.sendNotification} style={{
                    width: 100,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.LITE_BLUE,
                    borderRadius: 5
                }}>
                    <Text>
                        GỬI
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class TestNav extends Component {
    render() {
        // console.tron.log(this.props.navigation)
        return (
            <TouchableOpacity 
                style={{
                    width: 100,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.LITE_BLUE,
                    borderRadius: 5
                }}
                onPress={() => this.props.navigation.navigate("VanBanDenDetailScreen", {docId: 336, docType: 1})}>
                <Text>Navigate to Detail Task</Text>
            </TouchableOpacity>
        )
    }
}


export { TestFCM, TestDownLoad, TestNav }