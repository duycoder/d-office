/**
* @description: thanh điều hướng của toàn ứng dụng
* @author: duynn
* @since: 03/05/2018
*/
'use strict'
import React from 'react';
import { SwitchNavigator, TabBarBottom, TabNavigator } from 'react-navigation';

import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../../common/SystemConstant';

import Loading from '../common/Loading';

// các stack điều hướng
import { accountStack, notificationStack, dashboardStack, keyFunctionStack, authStack } from "./ModuleNav";
import { moderateScale } from '../../assets/styles/ScaleIndicator';
import NotiTabBarIcon from './NotiTabBarIcon';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';

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
        },
        KeyFunction: {
            screen: keyFunctionStack
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName = "home";
                switch (routeName) {
                    case 'Dashboard':
                        // iconName = `home${focused ? '' : '-outline'}`;
                        iconName = "home";
                        break;
                    case 'Notification':
                        // iconName = `bell${focused ? '' : '-outline'}`;
                        iconName = "bell";
                        break;
                    case 'Account':
                        // iconName = `shield-account${focused ? '' : '-outline'}`;
                        iconName = "shield-account";
                        break;
                    case 'KeyFunction':
                        iconName = 'menu';
                        break;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <View>
                    <Icon name={iconName} size={moderateScale(25, 1.3)} color={tintColor} type="material-community" />
                    {
                        routeName === "Notification" && <NotiTabBarIcon customStyle={{right: -10}} />
                    }
                </View>;
            },
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let routeLabel = "MH Chính";
                switch (routeName) {
                    case 'Dashboard': routeLabel = "MH Chính"; break;
                    case 'Notification': routeLabel = "Thông báo"; break;
                    case 'Account': routeLabel = "Tài khoản"; break;
                    case 'KeyFunction': routeLabel = "Chức năng"; break;
                }
                return focused
                    ? <Text style={{ color: tintColor, fontSize: moderateScale(12, 0.8), textAlign: 'center' }}>{routeLabel}</Text>
                    : null;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            // activeTintColor: Colors.WHITE,
            // inactiveTintColor: Colors.DANK_BLUE,
            // activeBackgroundColor: Colors.DANK_BLUE,
            allowFontScaling: false,
            showLabel: false,
            activeTintColor: Colors.MENU_BLUE,
            inactiveTintColor: Colors.DARK_GRAY,
            style: {
                backgroundColor: Colors.WHITE
            }
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