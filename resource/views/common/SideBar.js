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
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userInfo: {

            },
            onFocusNow: '6',
            notifyCount: 0
        }
    }

    async componentWillMount() {
        const storageUserInfo = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(storageUserInfo);
        this.setState({
            userInfo,
            onFocusNow: userInfo.hasRoleAssignUnit ? '6' : '7',
            notifyCount: userInfo.numberUnReadMessage
        });
    }

    navigate(screenName) {
        this.props.navigation.push(screenName);
    }

    onLogOut() {
        this.refs.confirm.showModal();
    }

    async setCurrentFocus(screenName, ref) {
        const userInfo = this.state.userInfo;
        userInfo.numberUnReadMessage = 0;
        
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

        this.setState({
            onFocusNow: ref,
            notifyCount: 0
        });
        this.props.navigation.navigate(screenName);
    }

    render() {
        const { notifyCount } = this.state;
        const subItemIcon = <Image source={subItemIconLink} />;
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

        return (
            <View style={SideBarStyle.container}>
                <View style={SideBarStyle.header}>
                    <ImageBackground source={headerBackground} style={SideBarStyle.headerBackground}>
                        <View style={SideBarStyle.headerAvatarContainer}>
                            <Image source={userAvatar} style={SideBarStyle.headerAvatar} />
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

                        <Panel title='VĂN BẢN TRÌNH KÝ'>
                            <TouchableOpacity
                                onPress={() => this.setCurrentFocus('ListIsNotProcessedScreen', '1')}
                                style={this.state.onFocusNow === '1' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '1' ?
                                            <Image source={SBIcons.doc_NotCompleted_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.doc_NotCompleted_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '1' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Chưa xử lý'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '1' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    contentContainerStyle={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListIsProcessedScreen', '2')} style={this.state.onFocusNow === '2' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={this.state.onFocusNow !== '2' ?
                                        <Image source={SBIcons.doc_IsCompleted_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                        <Image source={SBIcons.doc_IsCompleted_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '2' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Đã xử lý'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '2' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    contentContainerStyle={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListIsNotReviewedScreen', '3')} style={this.state.onFocusNow === '3' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={this.state.onFocusNow !== '3' ?
                                        <Image source={SBIcons.doc_NotReviewed_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                        <Image source={SBIcons.doc_NotReviewed_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '3' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Cần review'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '3' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    contentContainerStyle={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListIsReviewedScreen', '4')} style={this.state.onFocusNow === '4' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={this.state.onFocusNow !== '4' ?
                                        <Image source={SBIcons.doc_IsReviewed_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                        <Image source={SBIcons.doc_IsReviewed_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '4' ? mainItemIcon : subItemIcon
                                    }
                                    title={'Đã review'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '4' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    contentContainerStyle={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>
                        </Panel>

                        <Panel title='CÔNG VIỆC'>
                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListPersonalTaskScreen', '6')} style={this.state.onFocusNow === '6' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '6' ?
                                            <Image source={SBIcons.works_Personal_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.works_Personal_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '6' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Cá nhân'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '6' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListAssignedTaskScreen', '7')} style={this.state.onFocusNow === '7' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={this.state.onFocusNow !== '7' ?
                                        <Image source={SBIcons.works_Quested_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                        <Image source={SBIcons.works_Quested_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '7' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Được giao'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '7' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListCombinationTaskScreen', '8')} style={this.state.onFocusNow === '8' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '8' ?
                                            <Image source={SBIcons.works_Groups_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.works_Groups_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '8' ? mainItemIcon : subItemIcon
                                    }
                                    containerStyle={SideBarStyle.subItemContainer}
                                    title={'Phối hợp xử lý'}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '8' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('ListProcessedTaskScreen', '9')} style={this.state.onFocusNow === '9' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        this.state.onFocusNow !== '9' ?
                                            <Image source={SBIcons.works_Completed_Neutral} style={SideBarStyle.listItemLeftIcon} /> :
                                            <Image source={SBIcons.works_Completed_Active} style={SideBarStyle.listItemLeftIcon} />
                                    }
                                    rightIcon={
                                        this.state.onFocusNow !== '9' ? mainItemIcon : subItemIcon
                                    }
                                    title={'Đã giao xử lý'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, this.state.onFocusNow === '9' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>
                        </Panel>

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
                                    title={'Thông tin tài khoản'}
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
                                    title={'Đổi mật khẩu'}
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