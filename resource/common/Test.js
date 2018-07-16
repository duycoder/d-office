import React, { Component } from 'react'
import {
    View, AppState, AsyncStorage,
    Text, TouchableOpacity, TextInput, Picker
} from 'react-native'

import { SERVER_KEY } from '../firebase/FireBaseConstant';


export default class Test extends Component {
    state = {
        message: '',
        notif: '',
        appState: AppState.currentState,
        token: 'cm887HHvj1U:APA91bHMILayoeS9C1b3uDXLNJ0cLI6GxrL7VmkqL0IsKWUEmgQxAn3oPJpATAQ3Waz9h9J4SMKC_xDIvCG8aZjrm7oW80I82DCSgKqEVHAxXcbwmu7zmFzvW9_9BUr85vwvpAqMoKNxZ82miLklT8UjJUtNichdYA'
    }

    sendNotification = async () => {
        const body = JSON.stringify({
            to: this.state.token,
            data: {
                custom_notification: {
                    id: new Date().valueOf().toString(),
                    body: this.state.message,
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
            //alert('gửi thành công');
        } else {
            alert('gửi thất bại');
        }
    }

    // componentDidMount = () => {
    //     AppState.addEventListener('change', this.handleAppStateChange);
    // }

    // componentWillUnmount = () => {
    //     AppState.removeEventListener('change', this.handleAppStateChange);
    // }

    // handleAppStateChange = (nextAppState) => {
    //     if (this.state.currentState.match(/inactive|background/) && nextAppState == 'active') {
    //     }
    //     this.setState({ appState: nextAppState });
    // }

    // componentDidMount = () => {
    //     AppState.addEventListener('change', this.handleAppStateChange);
    // }

    // componentWillUnmount = () => {
    //     AppState.removeEventListener('change', this.handleAppStateChange);
    // }

    // handleAppStateChange = (appState) => {
    //     if (appState == 'background') {
    //         console.log('App is in background mode');
    //     }
    // }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* <Picker selectedValue={this.state.pickerValue} onValueChange={(pickerValue) => this.setState({ pickerValue })}
                    style={{
                        height: 50,
                        width: '100%',
                        borderRadius: 50,
                        backgroundColor: 'green'
                    }}>
                    <Picker.Item value={1} label={'1'} />
                    <Picker.Item value={2} label={'2'} />
                    <Picker.Item value={3} label={'3'} />
                </Picker> */}

                <Text style={{ color: '#000', fontSize: 20 }}>
                    {this.state.appState}
                </Text>
                <TextInput
                    numberOfLines={5}
                    multiline={true}
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
                    placeholder='Viết tin nhắn vào đây'
                    onChangeText={(message) => this.setState({ message })} numberOfLines={5}
                    style={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: '90%',
                        marginVertical: 10
                    }} />

                {/* <TextInput
                    value={this.state.notif}
                    numberOfLines={5}
                    multiline={true}
                    style={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: '90%',
                        marginVertical: 10
                    }} /> */}

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