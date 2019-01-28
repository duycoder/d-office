/**
 * @description: danh sách trả lời comment
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
  DEFAULT_PAGE_SIZE, EMPTY_STRING,
} from '../../../common/SystemConstant';
import {
  emptyDataPage, convertDateTimeToString,
  asyncDelay, formatLongText, isImage
} from '../../../common/Utilities';

//lib
import {
  Alert, View, Text, FlatList, Platform,
  TouchableOpacity, ScrollView, Image
} from 'react-native';
import {
  Container, Header, Left, Right, Body, Title, Input,
  Button, Content, Icon, Footer, Text as NbText
} from 'native-base';
import renderIf from 'render-if';
import { Icon as RneIcon } from 'react-native-elements';
import * as util from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import {
  ListCommentStyle, ReplyCommentStyle,
  AttachCommentStyle, FooterCommentStyle
} from '../../../assets/styles/CommentStyle';
import { ChatterStyle } from '../../../assets/styles/ChatStyle';

import { scale, verticalScale, moderateScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { dataLoading, executeLoading } from '../../../common/Effect';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';
import { ListChatterStyle } from '../../../assets/styles/ChatStyle';

//default avatar
const default_Avatar = require('../../../assets/images/avatar.png');
const infoIcon = require('../../../assets/images/info.png');

const android = RNFetchBlob.android;

class Chatter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.navigation.state.params.id,
      avatar: props.navigation.state.params.avatar,
      name: props.navigation.state.params.name,
      email: props.navigation.state.params.email,
      level: props.navigation.state.params.level,
      phone: props.navigation.state.params.phone,
      yMessage: EMPTY_STRING,

      data: [
        { mid: 1, message: 'Anh ky roi day, tam 7h qua ma lay', dateCreated: '06:30 19/06/2018', IS_READ: true },
        { mid: 2, message: 'Vang a', dateCreated: '07:05 19/06/2018', IS_READ: true, yid: 0 }, // yid must change to userInfo when has API
        { mid: 3, message: 'Lay anh tap tai lieu trong phong anh Duong roi mang xuong bai xe cho anh luon nha', dateCreated: '16:30 19/06/2018', IS_READ: false }
      ],
      executing: false,
      loading: false,
      refreshing: false,
      loadingMore: false,
    }
  }

  // componentWillMount = () => {
  //   this.setState({
  //     loading: true
  //   }, () => this.fetchData());
  // }

  // loadingMore = () => {
  //   this.setState({
  //     loadingMore: false,
  //     pageIndex: this.state.pageIndex + 1
  //   }, () => this.fetchData())
  // }

  // handleRefresh = () => {
  //   this.setState({
  //     pageIndex: DEFAULT_PAGE_SIZE
  //   }, () => this.fetchData())
  // }

  // fetchData = async () => {
  //   let url = `${API_URL}/api/VanBanDi/GetRepliesOfComment/${this.state.comment.ID}/${this.state.pageIndex}/${this.state.pageSize}`;

  //   if(this.state.isTaskComment){
  //     url = `${API_URL}/api/HscvCongViec/GetRepliesOfComment/${this.state.comment.ID}/${this.state.pageIndex}/${this.state.pageSize}`;
  //   }
  //   const result = await fetch(url);
  //   const resultJson = await result.json();

  //   this.setState({
  //     loading: false,
  //     loadingMore: false,
  //     refreshing: false,
  //     data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson
  //   })
  // }

  navigateBackToListChatter = () => {
    this.props.navigation.navigate('ListChatterScreen');
  }
  navigateToDetailChatter = () => {
    this.props.navigation.navigate('DetailChatterScreen', {
      id: this.state.id,
      name: this.state.name,
      email: this.state.email,
      level: this.state.level,
      phone: this.state.phone,
    });
  }

  // sendComment = async () => {
  //   this.setState({
  //     executing: true
  //   });

  //   let url = `${API_URL}/api/VanBanDi/SaveComment`;
  //   let headers = new Headers({
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json;charset=utf-8'
  //   });

  //   let body = JSON.stringify({
  //     ID: 0,
  //     VANBANDI_ID: this.state.docId,
  //     PARENT_ID: this.state.comment.ID,
  //     NGUOITAO: this.state.userId,
  //     NOIDUNGTRAODOI: this.state.commentContent
  //   });

  //   if (this.state.isTaskComment) {
  //     url = `${API_URL}/api/HscvCongViec/SaveComment`;
  //     headers = new Headers({
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json;charset=utf-8'
  //     });

  //     body = JSON.stringify({
  //       ID: 0,
  //       CONGVIEC_ID: this.state.taskId,
  //       REPLY_ID: this.state.comment.ID,
  //       USER_ID: this.state.userId,
  //       NOIDUNG: this.state.commentContent,
  //       CREATED_BY: this.state.userId
  //     });
  //   }

  //   await asyncDelay(1000);

  //   const result = await fetch(url, {
  //     method: 'post',
  //     headers,
  //     body
  //   });

  //   const resultJson = await result.json();
  //   if (resultJson.Status == true && !util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
  //     const message = this.props.userInfo.Fullname + ' đã đăng trao đổi nội dung công việc #Công việc ' + this.state.taskId;
  //     const content = {
  //       title: 'TRAO ĐỔI CÔNG VIỆC',
  //       message,
  //       isTaskNotification: true,
  //       targetScreen: 'DetailTaskScreen',
  //       targetTaskId: this.state.taskId,
  //       targetTaskType: this.state.taskType
  //     }

  //     resultJson.GroupTokens.forEach(token => {
  //       pushFirebaseNotify(content, token, 'notification');
  //     })
  //   }

  //   this.setState({
  //     executing: false
  //   }, () => this.fetchData());
  // }

  // onDownloadFile(fileName, fileLink, fileExtension) {
  //   try {
  //     fileLink = WEB_URL + fileLink;
  //     fileLink = fileLink.replace('////', '/');
  //     if (Platform.OS == 'ios') {
  //       config = {
  //         fileCache: true
  //       };
  //       fileLink = encodeURI(fileLink);
  //     } else {
  //       fileLink = fileLink.replace(/ /g, "%20");
  //     }

  //     const config = {
  //       fileCache: true,
  //       // android only options, these options be a no-op on IOS
  //       addAndroidDownloads: {
  //         notification: true, // Show notification when response data transmitted
  //         title: fileName, // Title of download notification
  //         description: 'An image file.', // File description (not notification description)
  //         mime: fileExtension,
  //         mediaScannable: true, // Make the file scannable  by media scanner
  //       }
  //     }

  //     RNFetchBlob.config(config)
  //       .fetch('GET', fileLink)
  //       .then((response) => {
  //         //kiểm tra platform nếu là android và file là ảnh
  //         if (Platform.OS == 'android' && isImage(fileExtension)) {
  //           android.actionViewIntent(response.path(), fileExtension);
  //         }
  //         response.path();
  //       }).catch((err) => {
  //         Alert.alert(
  //           'THÔNG BÁO',
  //           'KHÔNG THỂ TẢI ĐƯỢC FILE',
  //           [
  //             {
  //               text: 'OK',
  //               onPress: () => { }
  //             }
  //           ]
  //         )
  //       });
  //   } catch (err) {
  //     Alert.alert({
  //       'title': 'THÔNG BÁO',
  //       'message': `Lỗi: ${err.toString()}`,
  //       buttons: [
  //         {
  //           text: 'OK',
  //           onPress: () => { }
  //         }
  //       ]
  //     })
  //   }
  // }

  sendMessage = () => {
    this.setState({
      data: this.state.data.concat({
        mid: this.state.data.length + 1,
        message: this.state.yMessage,
        dateCreated: convertDateTimeToString(new Date()),
        yid: 0
      }),
      yMessage: EMPTY_STRING,
    })
  }

  renderItem = ({ item }) => {
    const avatarSource = (this.state.avatar !== EMPTY_STRING) ? this.state.avatar : default_Avatar;
    if (!item.hasOwnProperty('yid')) {
      return (
        <View>
          <View style={{ flexDirection: 'row', marginTop: verticalScale(10) }}>
            <View style={[ListCommentStyle.commentAvatarContainer, {alignItems: 'flex-start'}]}>
              <Image source={avatarSource} style={ListChatterStyle.chatterAvatar} />
            </View>
            <View style={[ChatterStyle.chatterMessageContainer, {alignItems: 'flex-start'}]}>
              <View style={[ChatterStyle.chatterMessageContent, {backgroundColor: Colors.GRAY, justifyContent: 'flex-start', marginRight: scale(30)}]}>
                <Text style={item.IS_READ ? ChatterStyle.chatterReadMessage : ChatterStyle.chatterUnreadMessage}>
                  {item.message}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={ChatterStyle.timeCreatedText}>
                  {item.dateCreated}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={{ flexDirection: 'row', marginTop: verticalScale(10) }}>
            <View style={[ChatterStyle.chatterMessageContainer, {alignItems: 'flex-end'}]}>
              <View style={[ChatterStyle.chatterMessageContent, {backgroundColor: Colors.BLUE_PANTONE_640C, justifyContent: 'flex-end', marginLeft: scale(30)}]}>
                <Text style={[ChatterStyle.chatterReadMessage, {color: Colors.WHITE, textAlign:'right'}]}>
                  {item.message}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={ChatterStyle.timeCreatedText}>
                  {item.dateCreated}
                </Text>
              </View>
            </View>
            
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={this.navigateBackToListChatter}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              {this.state.name}
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <Button transparent onPress={this.navigateToDetailChatter}>
              <Image source={infoIcon} style={{ width: moderateScale(20), height: moderateScale(20) }} />
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          <ScrollView>
            <View style={ReplyCommentStyle.replyListContainer}>
              {
                // renderIf(this.state.loading)(
                //   dataLoading(true)
                // )
              }

              {
                renderIf(!this.state.loading)(
                  <FlatList
                    renderItem={this.renderItem}
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    
                  // ListFooterComponent={() => this.state.loadingMore ?
                  //   <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                  //   (
                  //     this.state.data.length >= DEFAULT_PAGE_SIZE ?
                  //       <Button small full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                  //         <NbText>
                  //           TẢI THÊM BÌNH LUẬN
                  //       </NbText>
                  //       </Button>
                  //       : null
                  //   )
                  // }
                  />
                )
              }
            </View>
          </ScrollView>
        </Content>

        <Footer style={[{ flex: this.state.footerFlex }, FooterCommentStyle.footerComment]}>
          <Input style={{ paddingLeft: moderateScale(10) }}
            placeholder='Nhập nội dung trả lời'
            value={this.state.yMessage}
            onChangeText={(yMessage) => this.setState({ yMessage })} />
          <Button transparent onPress={this.sendMessage}>
            <RneIcon name='md-send' size={moderateScale(40)} color={Colors.GRAY} type='ionicon' />
          </Button>
        </Footer>

        {
          //executeLoading(this.state.executing)
        }
      </Container>
    )
  }
}

const mapStatToProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStatToProps)(Chatter);