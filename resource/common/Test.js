import React, { Component } from 'react'
import {
    View, AppState,
    Text, TouchableOpacity, TextInput
} from 'react-native'

import { SERVER_KEY } from '../firebase/FireBaseConstant';

export default class Test extends Component {

    state = {
        message: '',
        appState: AppState.currentState,
        token: 'cZ8j-eq3x6o:APA91bE8w3Kf38_cHVhusN4XW6S5pyLev5FJaltBQqw2u5iLonnWoyZc4bGDI6xhtnBW5Wi7dtsjYyzWeFstR2OQze-2tqsUnSoH6fZURHBAW2_7wfzQJjBrg4RrvLFxUMXhX98lPBYC1G_-HiRUjacawRdrVxHXRA'
    }

    sendNotification = async () => {
        const body = JSON.stringify({
            to: this.state.token,
            data: {
                custom_notification: {
                    body: this.state.message,
                    title: "THÔNG BÁO"
                }
            },
            badge: 1,
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

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount = () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }


    handleAppStateChange = (nextAppState) => {
        if (this.state.currentState.match(/inactive|background/) && nextAppState == 'active') {
        }
        this.setState({ appState: nextAppState });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 20 }}>
                    {this.state.appState}
                </Text>
                <TextInput
                    value={this.state.token}
                    editable={false}
                    style={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: '90%',
                        marginVertical: 10
                    }} />

                <TextInput
                    value={this.state.message}
                    onChangeText={(message) => this.setState({ message })} numberOfLines={5}
                    style={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: '90%',
                        marginVertical: 10
                    }} />

                <TouchableOpacity
                    onPress={this.sendNotification}
                    style={{
                        backgroundColor: 'blue',
                        width: 100,
                        height: 50,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                        GỬI TIN NHẮN
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}