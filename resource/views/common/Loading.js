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
import { NavigationActions } from 'react-navigation';

//util
import { appNavigate, isObjectHasValue } from '../../common/Utilities';

//progress bar
import ProgressBar from './ProgressBar';

//const
const uriLogo = require('../../assets/images/logovnio.png')
const uriBackground = require('../../assets/images/background.png');

//redux
import { connect } from 'react-redux';
import * as userAction from '../../redux/modules/User/Action';
import * as navAction from '../../redux/modules/Nav/Action';

//firebase
// import FCM from 'react-native-fcm';
//import { registerAppListener, registerKilledListener } from '../../firebase/FireBaseListener';

//style
import { verticalScale } from '../../assets/styles/ScaleIndicator';
import { EMPTY_STRING, Colors, SEPERATOR_STRING, SEPERATOR_UNDERSCORE } from '../../common/SystemConstant';
import firebase, { Notification } from 'react-native-firebase';

// registerKilledListener();
class Loading extends Component {
    state = {
        progress: 0,
        timing: 300,
        duration: 1,
        notif: '',
    }

    progressing() {
        this.setState({
            progress: this.state.progress + 0.1
        });
    }

    //kiểm tra permission firebase
    async checkFirebasePermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getFirebaseToken();
        } else {
            this.requestFirebasePermission();
        }
    }

    //lấy token của firebase
    async getFirebaseToken() {
        let fcmToken = await AsyncStorage.getItem('deviceToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                // console.log('fcmToken:', fcmToken);
                await AsyncStorage.setItem('deviceToken', fcmToken);
            }
        }
        // console.log('fcmToken:', fcmToken);
    }

    //yêu cầu quyền từ firebase
    async requestFirebasePermission() {
        try {
            await firebase.messaging().requestPermission();
            // // User has authorised
            this.getFirebaseToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        this.notificationInitialization = firebase.notifications()
            .getInitialNotification().then((message) => {
            });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;

            // this.storeNotification(data);

            const localNotification = new firebase.notifications.Notification({
                sound: 'sampleaudio',
                show_in_foreground: true,
            })
                .setSound('sampleaudio.wav')
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
                //.android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
                .android.setColor('#00AEEF') // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        });

        const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
            .setDescription('Demo app description')
            .setSound('sampleaudio.wav');
        firebase.notifications().android.createChannel(channel);

        /*
        * If your app is in background or foreground, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body, data } = notificationOpen.notification;
            // console.tron.log("Listen, this is data when opened")
            // console.tron.log(notificationOpen.notification);
            if (data.targetScreen && data.objId) {
                let screenParam = {};
                if (data.isTaskNotification == "false") {
                    screenParam = {
                        docId: data.objId,
                        docType: "1"
                    }
                }
                else {
                    screenParam = {
                        taskId: data.objId,
                        taskType: "1"
                    }
                }
                this.props.updateCoreNavParams(screenParam);
                this.props.navigation.navigate(data.targetScreen);
            }
            else {
                appNavigate(this.props.navigation, 'ListNotificationScreen', null);
            }
            // console.log('onNotificationOpened:');
            // Alert.alert(title, body)
            // alert(title);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body, data } = notificationOpen.notification;
            const { objId, isTaskNotification, targetScreen } = data;
            // screenName = targetScreen;
            let screenParam = {};
            if (isTaskNotification == "false") {
                screenParam = {
                    docId: objId,
                    docType: "1"
                }
            }
            else {
                screenParam = {
                    taskId: objId,
                    taskType: "1"
                }
            }
            const storage = await AsyncStorage.getItem('userInfo').then((rs) => {
                return {
                    user: JSON.parse(rs),
                    // notification: JSON.parse(rs[1][1])
                }
            });
            this.props.setUserInfo(storage.user);
            this.props.updateCoreNavParams(screenParam);
            this.props.navigation.navigate(targetScreen);
            // await AsyncStorage.setItem('firebaseNotification', JSON.stringify(data));
            // await AsyncStorage.setItem('firebaseNotification', notificationOpen.notification);
            // console.log('getInitialNotification:');
            // appNavigate(this.props.navigation, "ListNotificationScreen", null);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            //console.log("JSON.stringify:", JSON.stringify(message));
            //alert('123');
        });
    }

    async storeNotification(title) {
        await AsyncStorage.setItem('firebaseNotification', JSON.stringify(title));
    }

    async componentDidMount() {
        let intervalId = setInterval(this.progressing.bind(this), this.state.timing);
        this.setState({
            intervalId
        });

        //kiểm tra permission
        await this.checkFirebasePermission();

        await this.createNotificationListeners();
        //registerAppListener(this.props.navigation);

        //request để nhận thông báo gửi từ server
        // try {
        //     const requestPermissionResult = await FCM.requestPermissions({
        //         badge: true,
        //         sound: true,
        //         alert: true
        //     });
        // } catch (err) {
        //     console.log('Request Permission Error', err);
        // }
    }

    async componentDidUpdate(preveProps, prevState) {
        if (this.state.progress >= 1) {
            clearInterval(this.state.intervalId);

            const storage = await AsyncStorage.getItem('userInfo').then((rs) => {
                return {
                    user: JSON.parse(rs),
                    // notification: JSON.parse(rs[1][1])
                }
            });

            // console.tron.log(storage)

            if (storage.user) {
                this.props.setUserInfo(storage.user);
                setTimeout(() => {
                    let screenName = EMPTY_STRING;
                    let screenParam = null;
                    // if (storage.notification) {
                        
                    // } else {
                    //     //VanBanDenIsProcessScreen VanBanDenIsNotProcessScreen ListPersonalTaskScreen TestScreen stack VanBanDiFlow ListNotificationScreen
                    // }
                    screenName = storage.user.hasRoleAssignUnit ? 'VanBanDiIsNotProcessScreen' : 'VanBanDenIsNotProcessScreen';
                    appNavigate(this.props.navigation, screenName, screenParam);
                    //screenName = storage.user.hasRoleAssignUnit ? 'VanBanDiIsNotProcessScreen' : 'VanBanDenIsNotProcessScreen';
                }, this.state.timing)
            } else {
                // this.props.navigation.dispatch(NavigationActions.reset({
                //     index: 0,
                //     actions: [NavigationActions.navigate({ routeName: 'Auth' })]
                // }))
                appNavigate(this.props.navigation, 'Auth');
            }
        }
    }

    componentWillUnmount = async () => {
        this.notificationListener;
        this.notificationOpenedListener;
        this.notificationInitialization;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.LITE_BLUE
            }}>
                <Image source={uriLogo} style={{
                    width: 150,
                    height: 150,
                    marginBottom: verticalScale(20)
                }} />
                <ProgressBar progress={this.state.progress} duration={this.state.timing} barColor={Colors.WHITE} />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        coreNavParams: state.navState.coreNavParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (data) => dispatch(userAction.setUserInfo(data)),
        updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);