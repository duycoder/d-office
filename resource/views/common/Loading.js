/**
 * @description: duynn
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react'
import {
    AsyncStorage, View, Text, Image,
    ImageBackground, StatusBar
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
        timing: 300,//300
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
        // this.notificationInitialization = firebase.notifications()
        //     .getInitialNotification().then((message) => {
        //     });

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
                .catch(err => console.log(err));
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
            if (data.targetScreen) {
                if (data.objId && data.objId > 0) {
                    // nếu là chi tiết
                    this.props.updateCoreNavParams(this.generateScreenParams(data.url, data.objId));
                }
                else if (data.isReminder) {
                    // nếu là nhắc việc thì gửi vào đây
                    this.props.updateCoreNavParams({
                        taskType: 1,
                        docType: 1
                    });
                }
                // else if (data.isBirthday) {
                //     this.props.updateCoreNavParams({
                //         birthdayData: {
                //             title,
                //             body
                //         }
                //     });
                // }
                else {
                    appNavigate(this.props.navigation, 'ListNotificationScreen', null);
                }
                // let screenParam = {};
                // if (data.isTaskNotification == "false") {
                //     screenParam = {
                //         docId: data.objId,
                //         docType: "1"
                //     }
                // }
                // else {
                //     screenParam = {
                //         taskId: data.objId,
                //         taskType: "1"
                //     }
                // }
                // this.props.updateCoreNavParams(this.generateScreenParams(data.url, data.objId));
                this.props.navigation.navigate(data.targetScreen);
                // this.props.navigation.navigate("DashboardScreen");
            }
            else {
                appNavigate(this.props.navigation, 'ListNotificationScreen', null);
                // this.props.navigation.navigate("DashboardScreen");
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
            const { objId, isTaskNotification, targetScreen, url, isReminder, isBirthday } = data;
            // screenName = targetScreen;
            // let screenParam = {};
            // if (isTaskNotification == "false") {
            //     screenParam = {
            //         docId: objId,
            //         docType: "1"
            //     }
            // }
            // else {
            //     screenParam = {
            //         taskId: objId,
            //         taskType: "1"
            //     }
            // }
            const storage = await AsyncStorage.getItem('userInfo').then((rs) => {
                return {
                    user: JSON.parse(rs),
                    // notification: JSON.parse(rs[1][1])
                }
            });
            this.props.setUserInfo(storage.user);

            if (targetScreen) {
                this.props.updateCoreNavParams(this.generateScreenParams(url, objId));
            }
            else if (isReminder) {
                this.props.updateCoreNavParams({
                    taskType: 1,
                    docType: 1
                });
            }
            // else if (isBirthday) {
            //     this.props.updateCoreNavParams({
            //         birthdayData: {
            //             title,
            //             body
            //         }
            //     });
            // }
            else {
                targetScreen = "ListNotificationScreen";
            }
            this.props.navigation.navigate(targetScreen);
            // this.props.navigation.navigate("DashboardScreen");

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
                    // screenName = storage.user.hasRoleAssignUnit ? 'VanBanDiIsNotProcessScreen' : 'VanBanDenIsNotProcessScreen';
                    // appNavigate(this.props.navigation, screenName, screenParam);VanBanDiIsNotProcessScreen
                    // ListCarRegistrationScreen  ListTripScreen ListLichtrucScreen
                    this.props.navigation.navigate("DashboardScreen");//AccountInfoScreen DashboardScreen KeyFunctionScreen ListPersonalTaskScreen VanBanDenIsNotProcessScreen ListCarRegistrationScreen
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
        // this.notificationInitialization;
    }

    generateScreenParams = (itemUrl, itemId) => {
        let screenParam = {};
        const itemType = itemUrl.split("/")[2];
        switch (itemType) {
            case "HSVanBanDi":
                screenParam = {
                    docId: itemId,
                    docType: "1"
                };
                break;
            case "QuanLyCongViec":
                screenParam = {
                    taskId: itemId,
                    taskType: "1"
                };
                break;
            case "HSCV_VANBANDEN":
                screenParam = {
                    docId: itemId,
                    docType: "1"
                };
                break;
            case "QL_LICHHOP":
                screenParam = {
                    lichhopId: itemId,
                };
                break;
            case "QL_DANGKY_XE":
                screenParam = {
                    registrationId: itemId,
                };
                break;
            case "QL_CHUYEN":
                screenParam = {
                    tripId: itemId,
                };
                break;
            default:
                break;
        }
        return screenParam;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.LITE_BLUE
            }}>
                <StatusBar barStyle={"light-content"} />
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