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
import { width, Colors, SIDEBAR_CODES } from '../../common/SystemConstant';
import Images from '../../common/Images';
import { genIcon } from '../../common/Icons';
import { verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

const headerBackground = require('../../assets/images/background.png');
const userAvatar = require('../../assets/images/avatar.png');
const subItemIconLink = require('../../assets/images/arrow-white-right.png');

import SideBarIcon from '../../common/Icons';
const { TAIKHOAN, THONGBAO, DANGXUAT } = SIDEBAR_CODES;

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
        const { notifyCount, userFunctions, onFocusNow } = this.state;
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

        // console.tron.log(onFocusNow);

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
                            style={onFocusNow === '0' && SideBarStyle.listItemFocus}>
                            <ListItem
                                leftIcon={
                                    <SideBarIcon actionCode={THONGBAO.code} status={onFocusNow === '0'} isParent={true}/>
                                }
                                rightIcon={
                                    notificationIcon
                                }
                                containerStyle={SideBarStyle.subItemContainer}
                                title={'THÔNG BÁO'}
                                titleStyle={onFocusNow === '0' ? SideBarStyle.listItemFocus : SideBarStyle.listItemTitle}
                            />
                        </TouchableOpacity>

                        {
                            // Lấy chức năng của người dùng
                            userFunctions && userFunctions.map((item, index) =>
                                <Panel title={item.TEN_CHUCNANG.replace("Quản lý ", "")} key={item.DM_CHUCNANG_ID.toString()} actionCode={item.MA_CHUCNANG} isParent={true}>
                                    {
                                        item.ListThaoTac.map((sItem, sIndex) =>
                                            sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE
                                                ? <TouchableOpacity
                                                    key={sItem.DM_THAOTAC_ID.toString()}
                                                    onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.DM_THAOTAC_ID)}
                                                    style={onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemFocus}>
                                                    <ListItem
                                                        leftIcon={
                                                            <SideBarIcon actionCode={sItem.MA_THAOTAC} status={onFocusNow === sItem.DM_THAOTAC_ID} />
                                                        }
                                                        rightIcon={
                                                            onFocusNow !== sItem.DM_THAOTAC_ID ? mainItemIcon : subItemIcon
                                                        }
                                                        containerStyle={SideBarStyle.subItemContainer}
                                                        title={sItem.TEN_THAOTAC.indexOf("Danh sách văn bản ") > -1 ? sItem.TEN_THAOTAC.replace("Danh sách văn bản ", "").toUpperCase() : sItem.TEN_THAOTAC.toUpperCase()}
                                                        titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === sItem.DM_THAOTAC_ID && SideBarStyle.listItemSubTitleContainerFocus]}
                                                        contentContainerStyle={SideBarStyle.subItemContainer} />
                                                </TouchableOpacity>
                                                : null
                                        )
                                    }
                                </Panel>
                            )
                        }

                        {/*Truy vấn thông tin tài khoản người dùng*/}
                        <Panel title='TÀI KHOẢN' actionCode={TAIKHOAN.code} isParent={true}>
                            <TouchableOpacity onPress={() => this.setCurrentFocus('AccountInfoScreen', '10')} style={onFocusNow === '10' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        <SideBarIcon actionCode={TAIKHOAN.actionCodes[0]} status={onFocusNow === '10'} />
                                    }
                                    rightIcon={
                                        onFocusNow !== '10' ? mainItemIcon : subItemIcon
                                    }
                                    title={'THÔNG TIN TÀI KHOẢN'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === '10' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setCurrentFocus('AccountChangePasswordScreen', '11')} style={onFocusNow === '11' && SideBarStyle.listItemFocus}>
                                <ListItem
                                    leftIcon={
                                        <SideBarIcon actionCode={TAIKHOAN.actionCodes[1]} status={onFocusNow === '11'} />
                                    }
                                    rightIcon={
                                        onFocusNow !== '11' ? mainItemIcon : subItemIcon
                                    }
                                    title={'ĐỔI MẬT KHẨU'}
                                    containerStyle={SideBarStyle.subItemContainer}
                                    titleStyle={[SideBarStyle.listItemSubTitleContainer, onFocusNow === '11' && SideBarStyle.listItemSubTitleContainerFocus]}
                                    style={SideBarStyle.subItemContainer} />
                            </TouchableOpacity>
                        </Panel>

                        <TouchableOpacity onPress={() => this.onLogOut()}>
                            <ListItem
                                leftIcon={
                                    <SideBarIcon actionCode={DANGXUAT.code} isParent={true}/>
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