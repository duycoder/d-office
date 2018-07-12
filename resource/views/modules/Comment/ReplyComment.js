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
  TouchableOpacity, ScrollView
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

import { scale, verticalScale, moderateScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { dataLoading, executeLoading } from '../../../common/Effect';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

const android = RNFetchBlob.android;

class ReplyComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      comment: props.navigation.state.params.comment,

      isTaskComment: props.navigation.state.params.isTaskComment,

      taskId: props.navigation.state.params.taskId,
      taskType: props.navigation.state.params.taskType,

      docId: props.navigation.state.params.docId,
      docType: props.navigation.state.params.docType,

      footerFlex: 0,
      commentContent: EMPTY_STRING,
      data: [],
      executing: false,
      loading: false,
      refreshing: false,
      loadingMore: false,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    }
  }

  componentWillMount = () => {
    this.setState({
      loading: true
    }, () => this.fetchData());
  }

  loadingMore = () => {
    this.setState({
      loadingMore: false,
      pageIndex: this.state.pageIndex + 1
    }, () => this.fetchData())
  }

  handleRefresh = () => {
    this.setState({
      pageIndex: DEFAULT_PAGE_SIZE
    }, () => this.fetchData())
  }

  fetchData = async () => {
    let url = `${API_URL}/api/VanBanDi/GetRepliesOfComment/${this.state.comment.ID}/${this.state.pageIndex}/${this.state.pageSize}`;
    
    if(this.state.isTaskComment){
      url = `${API_URL}/api/HscvCongViec/GetRepliesOfComment/${this.state.comment.ID}/${this.state.pageIndex}/${this.state.pageSize}`;
    }
    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      loading: false,
      loadingMore: false,
      refreshing: false,
      data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson
    })
  }

  navigateToListComment = () => {
    this.props.navigation.navigate('ListCommentScreen', {
      isTaskComment: this.state.isTaskComment,
      taskId: this.state.taskId,
      taskType: this.state.taskType,
      
      docId: this.state.docId,
      docType: this.state.docType
    });
  }

  sendComment = async () => {
    this.setState({
      executing: true
    });

    let url = `${API_URL}/api/VanBanDi/SaveComment`;
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    });

    let body = JSON.stringify({
      ID: 0,
      VANBANDI_ID: this.state.docId,
      PARENT_ID: this.state.comment.ID,
      NGUOITAO: this.state.userId,
      NOIDUNGTRAODOI: this.state.commentContent
    });

    if(this.state.isTaskComment){
      url = `${API_URL}/api/HscvCongViec/SaveComment`;
      headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      });

      body = JSON.stringify({
        ID: 0,
        CONGVIEC_ID: this.state.taskId,
        REPLY_ID: this.state.comment.ID,
        USER_ID: this.state.userId,
        NOIDUNG: this.state.commentContent,
        CREATED_BY: this.state.userId
      });
    }

    await asyncDelay(1000);

    const result = await fetch(url, {
      method: 'post',
      headers,
      body
    });

    const resultJson = await result.json();
    if (resultJson.Status == true && !util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
      const message = this.props.userInfo.Fullname + ' đã đăng trao đổi nội dung công việc #Công việc ' + this.state.taskId;
      const content = {
        title: 'TRAO ĐỔI CÔNG VIỆC',
        message,
        isTaskNotification: true,
        targetScreen: 'DetailTaskScreen',
        targetTaskId: this.state.taskId,
        targetTaskType: this.state.taskType
      }

      resultJson.GroupTokens.forEach(token => {
        pushFirebaseNotify(content, token, 'notification');
      })
    }

    this.setState({
      executing: false
    }, () => this.fetchData());
  }

  onDownloadFile(fileName, fileLink, fileExtension) {
    try {
      fileLink = WEB_URL + fileLink;
      fileLink = fileLink.replace('////', '/');
      if (Platform.OS == 'ios') {
        config = {
          fileCache: true
        };
        fileLink = encodeURI(fileLink);
      } else {
        fileLink = fileLink.replace(/ /g, "%20");
      }

      const config = {
        fileCache: true,
        // android only options, these options be a no-op on IOS
        addAndroidDownloads: {
          notification: true, // Show notification when response data transmitted
          title: fileName, // Title of download notification
          description: 'An image file.', // File description (not notification description)
          mime: fileExtension,
          mediaScannable: true, // Make the file scannable  by media scanner
        }
      }

      RNFetchBlob.config(config)
        .fetch('GET', fileLink)
        .then((response) => {
          //kiểm tra platform nếu là android và file là ảnh
          if (Platform.OS == 'android' && isImage(fileExtension)) {
            android.actionViewIntent(response.path(), fileExtension);
          }
          response.path();
        }).catch((err) => {
          Alert.alert(
            'THÔNG BÁO',
            'KHÔNG THỂ TẢI ĐƯỢC FILE',
            [
              {
                text: 'OK',
                onPress: () => { }
              }
            ]
          )
        });
    } catch (err) {
      Alert.alert({
        'title': 'THÔNG BÁO',
        'message': `Lỗi: ${err.toString()}`,
        buttons: [
          {
            text: 'OK',
            onPress: () => { }
          }
        ]
      })
    }
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', marginTop: verticalScale(10) }}>
          <View style={ListCommentStyle.commentAvatarContainer}>
            <View style={ListCommentStyle.commentAvatar}>
              <RneIcon size={moderateScale(50)} type='ionicon' name='ios-people' color={Colors.WHITE} />
            </View>
          </View>


          <View style={ListCommentStyle.commentContentContainer}>
            <Text style={ListCommentStyle.commentUserName}>{item.FullName}</Text>
            <Text style={ListCommentStyle.commentContent}>
              {item.NOIDUNG}
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={ListCommentStyle.commentTime}>
                {convertDateTimeToString(item.NGAYTAO)}
              </Text>
            </View>

            {
              renderIf(item.NUMBER_REPLY > 0)(
                <TouchableOpacity style={ListCommentStyle.replyCommentContainer} onPress={() => this.onReplyComment(item)}>
                  <Text style={ListCommentStyle.replyCommentText}>
                    {'Đã có ' + item.NUMBER_REPLY + ' phản hồi'}
                  </Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </View >
    )
  }

  render() {
    let attachmentContent = null;
    let attach = this.state.comment.ATTACH;
    if (attach != null) {
      attachmentContent = (
        <View style={AttachCommentStyle.commentAttachContainer}>
          <View style={AttachCommentStyle.commentAttachInfo}>
            <RneIcon name='ios-attach-outline' color={Colors.BLUE_PANTONE_640C} size={verticalScale(20)} type='ionicon' />
            <Text style={AttachCommentStyle.commentAttachText}>
              {formatLongText(this.state.comment.ATTACH.TENTAILIEU, 30)}
            </Text>
          </View>

          <TouchableOpacity style={AttachCommentStyle.commetnAttachButton} onPress={() => this.onDownloadFile(attach.TENTAILIEU, attach.DUONGDAN_FILE, attach.DINHDANG_FILE)}>
            <RneIcon name='download' color={Colors.BLUE_PANTONE_640C} size={verticalScale(15)} type='entypo' />
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={this.navigateToListComment}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TRẢ LỜI
          </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          <ScrollView>
            <View style={ReplyCommentStyle.replyCommentContainer}>
              <View style={ReplyCommentStyle.replyObjectContainer}>
                <View style={ReplyCommentStyle.replyObjectHeader}>

                  <View style={ReplyCommentStyle.replyObjectAvatarContainer}>
                    <View style={ReplyCommentStyle.replyObjectAvatar}>
                      <RneIcon size={moderateScale(50)} type='ionicon' name='ios-people' color={Colors.WHITE} />
                    </View>
                  </View>

                  <View style={ReplyCommentStyle.replyObjectUserContainer}>
                    <Text style={ReplyCommentStyle.replyObjectUserText}>
                      {this.state.comment.FullName}
                    </Text>
                  </View>
                </View>

                <View style={ReplyCommentStyle.replyObjectContent}>
                  <Text style={ReplyCommentStyle.replyObjectContentText}>
                    {this.state.comment.NOIDUNG}
                  </Text>
                </View>

                {
                  attachmentContent
                }

                <View style={ReplyCommentStyle.replyObjectTime}>
                  <Text style={ReplyCommentStyle.replyObjectTimeText}>
                    {convertDateTimeToString(this.state.comment.NGAYTAO)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={ReplyCommentStyle.replyListContainer}>
              {
                renderIf(this.state.loading)(
                  dataLoading(true)
                )
              }

              {
                renderIf(!this.state.loading)(
                  <FlatList
                    renderItem={this.renderItem}
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => this.state.loadingMore ?
                      <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                      (
                        this.state.data.length >= DEFAULT_PAGE_SIZE ?
                          <Button small full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                            <NbText>
                              TẢI THÊM BÌNH LUẬN
                          </NbText>
                          </Button>
                          : null
                      )
                    }
                  />
                )
              }
            </View>
          </ScrollView>
        </Content>

        <Footer style={[{ flex: this.state.footerFlex }, FooterCommentStyle.footerComment]}>
          <Input style={{ paddingLeft: moderateScale(10) }}
            placeholder='Nhập nội dung trao đổi'
            value={this.state.commentContent}
            onChangeText={(commentContent) => this.setState({ commentContent })} />
          <Button transparent onPress={this.sendComment}>
            <RneIcon name='md-send' size={moderateScale(40)} color={Colors.GRAY} type='ionicon' />
          </Button>
        </Footer>

        {
          executeLoading(this.state.executing)
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

export default connect(mapStatToProps)(ReplyComment);