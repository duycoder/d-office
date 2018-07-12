/**
 * @description: lớp lắng nghe các sự kiện từ firebase
 * @author: duynn
 * @since: 22/04/2018
 */
'use strict'
import { AsyncStorage, AppState } from 'react-native';
import _ from 'lodash';

//Firebase Cloud Messaging
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType,
    NotificationActionType, NotificationActionOption, NotificationCategoryOption
} from "react-native-fcm";


/**
 * @description: kết nối app để lắng nghe các sự kiện từ server
 * @param {} navigation: điều hướng khi người dùng click vào thông báo
 */

export function registerKilledListener() {
    FCM.on(FCMEvent.Notification, notif => {
        console.log('demo');
        console.log('purple');
        AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
    });
}

export function registerAppListener(navigation) {
    //khi thông báo được hiển thị
    FCM.on(FCMEvent.Notification, notif => {
        //bấm vào thông báo
        if (notif.opened_from_tray) {
            //điều hướng chi tiết công việc
            const notifScreenParam = null;

            if (notif.isTaskNotification == true) {
                notifScreenParam = {
                    taskId: notif.targetTaskId,
                    taskType: notif.targetTaskType
                }
            } else {
                notifScreenParam = {
                    docId: notif.targetDocId,
                    docType: notif.targetDocType
                }
            }
            navigation.push(notif.targetScreen, notifScreenParam);
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
