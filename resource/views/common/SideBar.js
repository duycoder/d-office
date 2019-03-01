/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
import React, { Component } from 'react';
import {
    AsyncStorage, View, Text, ScrollView, Image,
    ImageBackground, Modal,
    TouchableOpacity
} from 'react-native';

//native-base
import {
    Container, Header, Content,
    Left, Right, Body, Title, Footer
} from 'native-base';

import { ListItem, Icon } from 'react-native-elements';
import renderIf from 'render-if';

import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import * as SBIcons from '../../assets/styles/SideBarIcons';

import Panel from './Panel';
import Confirm from './Confirm';
import { width, Colors } from '../../common/SystemConstant';
import Images from '../../common/Images';
import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

// import SideBarIcon from '../../common/Icons';

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userInfo: {

            },
            onFocusNow: '',
            notifyCount: 0,
            userFunctions: []
        }
    }

    async componentWillMount() {
        const storageUserInfo = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(storageUserInfo);
        this.setState({
            userInfo,
            onFocusNow: userInfo.hasRoleAssignUnit ? '6' : '7',
            notifyCount: userInfo.numberUnReadMessage,
            userFunctions: userInfo.GroupUserFunctions
        });
    }

    navigate(screenName) {
        this.props.navigation.push(screenName);
    }

    onLogOut() {
        this.refs.confirm.showModal();
    }

    async setCurrentFocus(screenName, ref) {
        this.setState({
            onFocusNow: ref,
            notifyCount: 0
        });
        this.props.navigation.navigate(screenName);
    }

    render() {
        const { notifyCount, userFunctions } = this.state;
        const subItemIcon = <Image source={Images.subItemIconLink} />;
        const mainItemIcon = <Icon name='chevron-right' type='entypo' size={verticalScale(30)} color={Colors.GRAY} />
        let notificationIcon = <View></View>;
        if (notifyCount > 0 && notifyCount < 100) {
            notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
                <View style={SideBarStyle.chatNotificationCircle}>
                    <Text style={SideBarStyle.chatNotificationText}>
                        {notifyCount}
                    </Text>
                </View>
            </View>
        }
        if (notifyCount >= 100) {
            notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
                <View style={[SideBarStyle.chatNotificationCircle, { width: moderateScale(25), height: moderateScale(25), borderRadius: moderateScale(25 / 2) }]}>
                    <Text style={SideBarStyle.chatNotificationText}>
                        99+
                </Text>
                </View>
            </View>
        }

        // console.log(userFunctions);

        return (
            <View style={SideBarStyle.container}>
                <View style={SideBarStyle.header}>
                    <ImageBackground source={Images.background} style={SideBarStyle.headerBackground}>
                        <View style={SideBarStyle.headerAvatarContainer}>
                            <Image source={Images.userAvatar} style={SideBarStyle.headerAvatar} />
                        </View>
                        <View style={[SideBarStyle.headerUserInfoContainer, { flex: 1 }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[SideBarStyle.headerUserName, { flex: 1, flexWrap: 'wrap' }]}>
                                    {this.state.userInfo.Fullname}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[SideBarStyle.headerUserJob, { flex: 1, flexWrap: 'wrap' }]}>
                                    {this.state.userInfo.Position}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={SideBarStyle.body}>
                    <ScrollView>
                        <TouchableOpacity
                            onPress={() => this.setCurrentFocus('ListNotificationScreen', '0')}
                            style={this.state.onFocusNow === '0' && SideBarStyle.listItemFocus}>
                            <ListItem
                                leftIcon={
                                    this.state.onFocusNow !== '0' ?
                                        <Image source={SBIcons.chat_Neutral} style={[SideBarStyle.listItemLeftIcon, { marginLeft: 0 }]} /> :
                                        <Image source={SBIcons.chat_Active} style={[SideBarStyle.listItemLeftIcon, { marginLeft: 0 }]} />
                                }
                                rightIcon={
                                    notificationIcon
                                }
                                containerStyle={SideBarStyle.subItemContainer}
                                title={'THÔNG BÁO'}
                                titleStyle={[SideBarStyle.listItemTitle, { marginLeft: 5 }]}
                            />
                        </TouchableOpacity>

                        {
                            // Lấy chức năng của người dùng
                            userFunctions && userFunctions.map((item, index) =>
                                <Panel title={item.TEN_CHUCNANG.replace("Quản lý ", "")} key={item.DM_CHUCNANG_ID.toString()}>
                                    {
                                        item.ListThaoTac.map((sItem, sIndex) =>
                                            sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE 
                                            ? <TouchableOpacity
                                                key={sItem.DM_THAOTAC_ID.toString()}
                                                onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DM_THAOTAC_ID)}
                                                style={this.state.onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemFocus}>
                                                <ListItem
                                                    leftIcon={
                                                        this.state.onFocusNow !== sItem.DM_THAOTAC_ID ?
                                                            <Image source={SBIcons.doc_NotCompleted_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                                            <Image source={SBIcons.doc_NotCompleted_Active} style={SideBarStyle.listItemLeftIcon} />
                                                    }
                                                    rightIcon={
                                                        this.state.onFocusNow !== sItem.DM_THAOTAC_ID ? mainItemIcon : subItemIcon
                                                    }
                                                    containerStyle={SideBarStyle.subItemContainer}
                                                    title={sItem.TEN_THAOTAC.indexOf("Danh sách văn bản ") > -1 ? sItem.TEN_THAOTAC.replace("Danh sách văn bản ", "").toUpperCase() : sItem.TEN_THAOTAC.toUpperCase()}
                                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemSubTitleContainerFocus]}
                                                    contentContainerStyle={SideBarStyle.subItemContainer} />
                                            </TouchableOpacity>
                                            : null
                                        )
                                    }
                                </Panel>
                            )
                        }

                        {/*Truy vấn thông tin tài khoản người dùng*/}
                        <Panel title='TÀI KHOẢN'>
                            <TouchableOpacity onPress={() => this.setCurrentFocus('AccountInfoScreen', '10')} style={this.state.onFocusNow === '10' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '10' ?
                                            <Image source={SBIcons.accountInfo_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.accountInfo_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '10' ? mainItemIcon : subItemIcon
                                    }
                                    title={'THÔNG TIN TÀI KHOẢN'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '10' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('AccountChangePasswordScreen', '11')} style={this.state.onFocusNow === '11' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '11' ?
                                            <Image source={SBIcons.password_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.password_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '11' ? mainItemIcon : subItemIcon
                                    }
                                    title={'ĐỔI MẬT KHẨU'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '11' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>
                        </Panel>

                        <TouchableOpacity onPress={() => this.onLogOut()}>
                            <ListItem
                                leftIcon={
                                    <Image source={SBIcons.signout_Turnoff} style={[SideBarStyle.listItemLeftIcon, { marginLeft: 0 }]} />
                                }
                                hideChevron={true}
                                containerStyle={SideBarStyle.listItemContainer}
                                title={'ĐĂNG XUẤT'}
                                titleStyle={SideBarStyle.listItemTitle}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <Confirm ref='confirm' title={'XÁC NHẬN THOÁT'} navigation={this.props.navigation} userInfo={this.state.userInfo} />
            </View>
        );
    }
}