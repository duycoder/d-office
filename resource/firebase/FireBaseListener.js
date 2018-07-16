/**
 * @description: lớp lắng nghe các sự kiện từ firebase
 * @author: duynn
 * @since: 22/04/2018
 */
'use strict'
import { AsyncStorage, AppState, Alert } from 'react-native';
import * as util from 'lodash';

//Firebase Cloud Messaging
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType,
    NotificationActionType, NotificationActionOption, NotificationCategoryOption
} from "react-native-fcm";
import { isObjectHasValue } from '../common/Utilities';
/**
 * @description: kết nối app để lắng nghe các sự kiện từ server
 * @param {} navigation: điều hướng khi người dùng click vào thông báo
 */

export function registerAppListener(navigation) {
    //khi thông báo được hiển thị
    FCM.on(FCMEvent.Notification, notif => {
        try {
            if (notif.opened_from_tray) {
                let screenParam = null;
                const notifId = notif.id;
                const screenName = notif.targetScreen;
                if (notif.isTaskNotification) {
                    screenParam = {
                        taskId: notif.targetTaskId,
                        taskType: notif.targetTaskType
                    }
                } else {
                    screenParam = {
                        docId: notif.targetDocId,
                        docType: notif.targetDocType
                    }
                }
                FCM.removeDeliveredNotification(notifId);
                navigation.navigate(screenName, screenParam);
            } else {
                AsyncStorage.setItem('firebaseNotification', JSON.stringify(notif));
                // const data = notif.custom_notification;
                // const rs = JSON.parse(data);

                // FCM.presentLocalNotification({
                //     id: new Date().valueOf().toString(),
                //     channel: 'default',
                //     title: rs.title,
                //     body: rs.body,
                //     priority: 'high',
                //     show_in_foreground: true,
                // });
            }
        } catch (err) {
            console.log('Firebase Notification Error', err);
        }
    });

    //refresh token lần đầu tải lên nếu bị null
    FCM.on(FCMEvent.RefreshToken, token => {
        AsyncStorage.setItem('DeviceFCMToken', token);
    });

    FCM.enableDirectChannel();

    FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
        console.log('Direct Channel Connection Changed', data);
    });

    FCM.isDirectChannelEstablished().then(result => {
        console.log('Is Direct Channel Established', result)
    });
}

export function registerKilledListener() {
    FCM.on(FCMEvent.Notification, notif => {
        AsyncStorage.setItem('firebaseNotification', JSON.stringify(notif));
    });
}
