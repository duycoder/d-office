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

//util
import { appNavigate, isObjectHasValue } from '../../common/Utilities';

//progress bar
import ProgressBar from './ProgressBar';

//const
import Images from '../../common/Images';

//redux
import { connect } from 'react-redux';
import * as userAction from '../../redux/modules/User/Action';


//firebase
import FCM from 'react-native-fcm';
import { registerAppListener, registerKilledListener } from '../../firebase/FireBaseListener';

//style
import { verticalScale } from '../../assets/styles/ScaleIndicator';
import { EMPTY_STRING, Colors } from '../../common/SystemConstant';

registerKilledListener();
class Loading extends Component {
    state = {
        progress: 0,
        timing: 1,
        notif: ''
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

            const storage = await AsyncStorage.multiGet(['userInfo', 'firebaseNotification']).then((rs) => {
                return {
                    user: JSON.parse(rs[0][1]),
                    notification: JSON.parse(rs[1][1])
                }
            });

            if (storage.user) {
                this.props.setUserInfo(storage.user);
                setTimeout(() => {
                    let screenName = EMPTY_STRING;
                    let screenParam = null;

                    if (isObjectHasValue(storage.notification) && isObjectHasValue(storage.notification.custom_notification)) {
                        screenName = 'ListNotificationScreen'
                    } else {
                        //VanBanDenIsProcessScreen VanBanDenIsNotProcessScreen
                        screenName = storage.user.hasRoleAssignUnit ? 'VanBanDiIsNotProcessScreen' : 'VanBanDenIsProcessScreen';
                    }
                    appNavigate(this.props.navigation, screenName, screenParam);
                }, this.state.timing)
            } else {
                appNavigate(this.props.navigation, 'Auth');
            }
        }
    }

    componentWillUnmount = () => {
        AsyncStorage.removeItem('firebaseNotification');
    }

    render() {
        return (
            <ImageBackground source={Images.background} style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={Images.logo} style={{
                    marginBottom: verticalScale(20)
                }} />

                <ProgressBar progress={this.state.progress} duration={this.state.timing} barColor={Colors.LITE_BLUE} />
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