/**
 * @description: màn hình danh sách nội dung trao đổi
 * @author: annv
 * @since: 07/06/2018
 */
'use strict'
import React, { Component } from 'react';

//redux
import { connect } from 'react-redux';

//utilities
import {
  API_URL, WEB_URL, Colors, DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE, EMPTY_STRING
} from '../../../common/SystemConstant';
import {
  emptyDataPage, convertDateTimeToString,
  asyncDelay, formatLongText, isImage
} from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';

//lib
import renderIf from 'render-if';
import {
  Alert, ActivityIndicator, FlatList, View, Text,
  TouchableOpacity, Image, Keyboard, Platform,
  Animated,
} from 'react-native';
import {
  Container, Header, Left, Right, Body, Title, Input,
  Button, Content, Icon, Footer, Text as NbText,
  Item, Tabs, Tab, TabHeading, Col
} from 'native-base';
import { Icon as RneIcon, ListItem } from 'react-native-elements';
import * as util from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListCommentStyle, FooterCommentStyle, AttachCommentStyle } from '../../../assets/styles/CommentStyle';
import { scale, verticalScale, moderateScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { TabStyle } from '../../../assets/styles/TabStyle';
import { ListTaskStyle } from '../../../assets/styles/TaskStyle';
import { SideBarStyle } from '../../../assets/styles/SideBarStyle';
import { ListChatterStyle } from '../../../assets/styles/ChatStyle';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//default avatar
const default_Avatar = require('../../../assets/images/avatar.png');
//icons
import { chat_Single, chat_Couple } from '../../../assets/styles/SideBarIcons';

const android = RNFetchBlob.android;

class ListChatter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      data: [
        { id: 1, avatar: EMPTY_STRING, name: 'Vũ Xuân Hoàn', email: 'hoan.vuxuan@doji.vn', message: 'Lay anh tap tai lieu trong phong anh Duong roi mang xuong bai xe cho anh luon nha', status: true, numberOfMessages: 1, IS_READ: false, level: 'TRƯỞNG ĐƠN VỊ', phone: '0963564645' },
        { id: 2, avatar: EMPTY_STRING, name: 'Trưởng Phòng 1', email: 'truongphong1@gmail.com', message: 'Anh ký rồi đấy!', status: false, numberOfMessages: 100, IS_READ: false, level: 'TRƯỞNG PHÒNG', phone: '0998882882' },
        { id: 3, avatar: EMPTY_STRING, name: 'Trương Thị Quỳnh Mai', email: 'quynhmai.truongthi@doji.vn', message: 'Chị ơi tầng 15 lại bị dột rồi.', status: true, numberOfMessages: 0, IS_READ: true, level: 'LAO CÔNG', phone: '' },
      ],
      loading: false,
      searching: false,
      loadingMore: false,
    }
  }

  // loadingMore = () => {
  //   this.setState({
  //     loadingMore: true,
  //     pageIndex: this.state.pageIndex + 1
  //   }, () => this.fetchData())
  // }

  // fetchData = async () => {
  //   let url = `${API_URL}/api/VanBanDi/GetRootCommentsOfVanBan/${this.state.docId}/${this.state.pageIndex}/${this.state.pageSize}`;

  //   if (this.state.isTaskComment) {
  //     url = `${API_URL}/api/HscvCongViec/GetRootCommentsOfTask/${this.state.taskId}/${this.state.pageIndex}/${this.state.pageSize}`;
  //   }

  //   console.log('đường dẫn', url);

  //   const result = await fetch(url);
  //   const resultJson = await result.json();
  //   this.setState({
  //     loading: false,
  //     loadingMore: false,
  //     refreshing: false,
  //     data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson
  //   })
  // }

  // handleRefresh = () => {
  //   this.setState({
  //     pageIndex: DEFAULT_PAGE_SIZE
  //   }, () => this.fetchData())
  // }

  navigateToDetail = () => {
    this.props.navigation.navigate('ChatterScreen');
    //alert('touch');
  }

  componentWillMount = () => {
    this.setState({
      loading: false,
    })
    // this.setState({
    //   loading: true
    // }, () => this.fetchData());
  }

  renderAllItem = ({ item }) => {
    const {id, avatar, name, email, message, status, numberOfMessages, IS_READ, level, phone } = item;

    const avatarSource = (avatar !== EMPTY_STRING) ? avatar : default_Avatar;
    const avatarStatus = status ? ListChatterStyle.onlineAvatarContainer : ListChatterStyle.offlineAvatarContainer;

    let notificationIcon = <View></View>;
    if (numberOfMessages > 0 && numberOfMessages < 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, ListChatterStyle.unreadMessage]}>
          <Text style={SideBarStyle.chatNotificationText}>
            {numberOfMessages}
          </Text>
        </View>
      </View>
    }
    if (numberOfMessages >= 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, ListChatterStyle.unreadMessage, ListChatterStyle.largeUnreadMessage]}>
          <Text style={SideBarStyle.chatNotificationText}>
            99+
          </Text>
        </View>
      </View>
    }

    const messageNotRead = (numberOfMessages > 0 && !IS_READ)
      ? <View style={ListChatterStyle.chatterMessageContainer}>
        <Image source={chat_Couple} style={ListChatterStyle.chatterMessageIcon} />
        {notificationIcon}
      </View>
      : <View>
        <Image source={chat_Single} style={ListChatterStyle.chatterMessageIcon} />
      </View>

    return (
      <View>
        <ListItem
          avatar={
            avatarSource
          }
          avatarStyle={
            ListChatterStyle.chatterAvatar
          }
          avatarContainerStyle={[
            ListChatterStyle.chatterAvatarContainer,
            avatarStatus
          ]}
          avatarOverlayContainerStyle={
            ListChatterStyle.chatterAvatarOverlay
          }
          rightIcon={
            messageNotRead
          }
          title={
            <View>
              <Text style={ListChatterStyle.chatterName}>
                {name}
              </Text>
              <Text style={ListChatterStyle.chatterEmail}>
                {email}
              </Text>
            </View>
          }
          titleContainerStyle={ListChatterStyle.titleContainerStyle}
          subtitle={
            <Text style={[IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal, ListTaskStyle.abridgment]}>
              <Text style={ListChatterStyle.chatterMessageContent}>
                {formatLongText(item.message, 30)}
              </Text>
            </Text>
          }
          containerStyle={ListChatterStyle.containerStyle}
          onPress={
            ()=>this.props.navigation.navigate('ChatterScreen', {
              id: id,
              avatar: avatar,
              name: name,
              email: email,
              level: level,
              phone: phone
          })}
        />
      </View>
    )
  }

  renderOnlineItem = ({ item }) => {
    const { id, avatar, name, email, message, status, numberOfMessages, IS_READ, level, phone } = item;

    const avatarSource = (avatar !== EMPTY_STRING) ? avatar : default_Avatar;

    let notificationIcon = <View></View>;
    if (numberOfMessages > 0 && numberOfMessages < 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, ListChatterStyle.unreadMessage]}>
          <Text style={SideBarStyle.chatNotificationText}>
            {numberOfMessages}
          </Text>
        </View>
      </View>
    }
    if (numberOfMessages >= 100) {
      notificationIcon = <View style={SideBarStyle.chatNotificationContainer}>
        <View style={[SideBarStyle.chatNotificationCircle, ListChatterStyle.unreadMessage, ListChatterStyle.largeUnreadMessage]}>
          <Text style={SideBarStyle.chatNotificationText}>
            99+
          </Text>
        </View>
      </View>
    }

    const messageNotRead = (numberOfMessages > 0 && !IS_READ)
      ? <View style={ListChatterStyle.chatterMessageContainer}>
        <Image source={chat_Couple} style={ListChatterStyle.chatterMessageIcon} />
        {notificationIcon}
      </View>
      : <View>
        <Image source={chat_Single} style={ListChatterStyle.chatterMessageIcon} />
      </View>
    if (status) {
      return (
        <View>
          <ListItem
            avatar={
              avatarSource
            }
            avatarStyle={
              ListChatterStyle.chatterAvatar
            }
            avatarContainerStyle={[
              ListChatterStyle.chatterAvatarContainer,
              ListChatterStyle.onlineAvatarContainer
            ]}
            avatarOverlayContainerStyle={
              ListChatterStyle.chatterAvatarOverlay
            }
            rightIcon={
              messageNotRead
            }
            title={
              <View>
                <Text style={ListChatterStyle.chatterName}>
                  {name}
                </Text>
                <Text style={ListChatterStyle.chatterEmail}>
                  {email}
                </Text>
              </View>
            }
            titleContainerStyle={ListChatterStyle.titleContainerStyle}
            subtitle={
              <Text style={[IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal, ListTaskStyle.abridgment]}>
                <Text style={ListChatterStyle.chatterMessageContent}>
                  {formatLongText(item.message, 30)}
                </Text>
              </Text>
            }
            containerStyle={ListChatterStyle.containerStyle}
            onPress={
              ()=>this.props.navigation.navigate('ChatterScreen', {
                id: id,
                avatar: avatar,
                name: name,
                email: email,
                level: level,
                phone: phone
            })}
          />
        </View>
      )
    }
  }

  render() {
    // const footerFlexWhenImage = (this.state.avatarSource === EMPTY_STRING) ? this.state.footerFlex : 2;
    const commentChosenImageIcon = (this.state.isOpen) ? Colors.BLUE_PANTONE_640C : Colors.GRAY;
    const commentSendableIcon = (this.state.avatarSource !== EMPTY_STRING || this.state.commentContent !== EMPTY_STRING) ? Colors.BLUE_PANTONE_640C : Colors.GRAY;
    return (
      <Container>
        <Header hasTabs searchBar rounded style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
          <Item style={{ backgroundColor: Colors.WHITE }}>
            <Icon name='ios-search' />
            <Input placeholder='Tên công việc'
              value={this.state.filterValue}
              onChangeText={(filterValue) => this.setState({ filterValue })}
              onSubmitEditing={() => this.onFilter()}
            />
          </Item>
        </Header>

        {
          renderIf(!this.state.loading)(
            <Tabs initialPage={this.state.currentTabIndex}
              onChangeTab={({ currentTabIndex }) => this.setState({
                currentTabIndex
              })}
              tabBarUnderlineStyle={TabStyle.underLineStyle}>

              <Tab heading={
                <TabHeading style={this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  {/* <Icon name='ios-person-outline' style={TabStyle.activeText} /> */}
                  <Text style={this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText}>
                    TẤT CẢ
									</Text>
                </TabHeading>
              }>
                <Content>
                  {
                    // renderIf(this.state.searching)(
                    //   <View style={{ flex: 1, justifyContent: 'center' }}>
                    //     <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                    //   </View>
                    // )
                  }

                  {
                    renderIf(!this.state.searching)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}
                        renderItem={this.renderAllItem}
                      // ListEmptyComponent={
                      //   this.state.loading ? null : emptyDataPage()
                      // }
                      // ListFooterComponent={
                      //   this.state.loadingMore ?
                      //     <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                      //     (
                      //       this.state.data.length >= 5 ?
                      //         <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadMore()}>
                      //           <Text>
                      //             TẢI THÊM
                      // 					</Text>
                      //         </Button>
                      //         : null
                      //     )
                      // }
                      />
                    )
                  }
                </Content>
              </Tab>

              <Tab heading={
                <TabHeading style={this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab}>
                  {/* <Icon name='ios-person-outline' style={TabStyle.activeText} /> */}
                  <Text style={this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText}>
                    TRỰC TUYẾN
									</Text>
                </TabHeading>
              }>
                <Content>
                  {
                    // renderIf(this.state.searching)(
                    //   <View style={{ flex: 1, justifyContent: 'center' }}>
                    //     <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                    //   </View>
                    // )
                  }

                  {
                    renderIf(!this.state.searching)(
                      <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}
                        renderItem={this.renderOnlineItem}
                      // ListEmptyComponent={
                      //   this.state.loading ? null : emptyDataPage()
                      // }
                      // ListFooterComponent={
                      //   this.state.loadingMore ?
                      //     <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                      //     (
                      //       this.state.data.length >= 5 ?
                      //         <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadMore()}>
                      //           <Text>
                      //             TẢI THÊM
                      // 					</Text>
                      //         </Button>
                      //         : null
                      //     )
                      // }
                      />
                    )
                  }
                </Content>
              </Tab>
            </Tabs>
          )
        }

        {
          //executeLoading(this.state.executing)
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStateToProps)(ListChatter);