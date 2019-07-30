/**
* @description: thanh điều hướng của toàn ứng dụng
* @author: duynn
* @since: 03/05/2018
*/
'use strict'
import React from 'react';
import { SwitchNavigator, TabBarBottom, TabNavigator } from 'react-navigation';

import { Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../../common/SystemConstant';

import Loading from '../common/Loading';

// các stack điều hướng
import { accountStack, notificationStack, dashboardStack, authStack } from "./ModuleNav";

const appStack = TabNavigator(
    {
        Dashboard: {
            screen: dashboardStack
        },
        Notification: {
            screen: notificationStack
        },
        Account: {
            screen: accountStack
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'Dashboard': iconName = `home${focused ? '' : '-outline'}`; break;
                    case 'Notification': iconName = `bell${focused ? '' : '-outline'}`; break;
                    case 'Account': iconName = `shield-account${focused ? '' : '-outline'}`; break;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Icon name={iconName} size={25} color={tintColor} type="material-community" />;
            },
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let routeLabel = "MH Chính";
                switch (routeName) {
                    case 'Dashboard': routeLabel = "MH Chính"; break;
                    case 'Notification': routeLabel = "Thông báo"; break;
                    case 'Account': routeLabel = "Tài khoản"; break;
                }
                return <Text style={{ color: tintColor }}>{routeLabel}</Text>;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: Colors.WHITE,
            inactiveTintColor: Colors.DANK_BLUE,
            allowFontScaling: false,
            activeBackgroundColor: Colors.DANK_BLUE,
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
);

export const CommonDrawerNavigator = SwitchNavigator(
    {
        // TestScreen: {
        //     screen: Test
        // },
        LoadingScreen: {
            screen: Loading
        },
        Auth: authStack,
        App: appStack
    },
    {
        initialRouteName: 'LoadingScreen',
        backBehavior: 'intialRoute'
    }
);