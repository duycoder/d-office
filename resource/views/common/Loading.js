/**
 * @description: duynn
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react'
import {
    AsyncStorage, View, Text, Image,
    ImageBackground
} from 'react-native'

//progress bar
import ProgressBar from './ProgressBar';

//const
const uriLogo = require('../../assets/images/doji-big-icon.png')
const uriBackground = require('../../assets/images/background.png');

//redux
import { connect } from 'react-redux';
import * as userAction from '../../redux/modules/user/UserAction';


//firebase
import FCM from 'react-native-fcm';
import { registerAppListener, registerKilledListener } from '../../firebase/FireBaseListener';

//style
import { verticalScale } from '../../assets/styles/ScaleIndicator';

class Loading extends Component {
    state = {
        progress: 0,
        timing: 1000
    }

    progressing() {
        this.setState({
            progress: this.state.progress + 0.25
        });
    }

    async componentDidMount() {
        let intervalId = setInterval(this.progressing.bind(this), this.state.timing);
        this.setState({
            intervalId
        });

        //cấu hình nhận thông báo gửi từ server
        registerAppListener(this.props.navigation);

        //request để nhận thông báo gửi từ server
        try {
            const requestPermissionResult = await FCM.requestPermissions({
                badge: true,
                sound: true,
                alert: true
            });
        } catch (err) {
            console.log('Request Permission Error', err);
        }
    }

    async componentDidUpdate(preveProps, prevState) {
        if (this.state.progress >= 1) {
            clearInterval(this.state.intervalId);

            const userInfoStorage = await AsyncStorage.getItem('userInfo').then((result) => {
                return JSON.parse(result);
            });

            if (userInfoStorage) {
                this.props.setUserInfo(userInfoStorage);
                setTimeout(() => {
                    if (userInfoStorage.hasRoleAssignUnit) {
                        this.props.navigation.navigate('ListPersonalTaskScreen');
                    } else {
                        this.props.navigation.navigate('ListAssignedTaskScreen');
                    }
                }, 1000)
            } else {
                this.props.navigation.navigate('Auth');
            }
        }
    }

    render() {
        return (
            <ImageBackground source={uriBackground} style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={uriLogo} style={{
                    marginBottom: verticalScale(20)
                }} />

                <ProgressBar progress={this.state.progress} duration={this.state.timing} />
            </ImageBackground>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (data) => dispatch(userAction.setUserInfo(data))
    }
}

export default connect(null, mapDispatchToProps)(Loading);