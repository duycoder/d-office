/**
 * @description: màn hình danh sách nội dung trao đổi
 * @author: annv
 * @since: 07/06/2018
 */
'use strict'
import React, { Component } from 'react';
import { PermissionsAndroid, RefreshControl } from 'react-native';
//redux
import { connect } from 'react-redux';

//utilities
import {
  API_URL, WEB_URL, Colors, DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE, EMPTY_STRING
} from '../../../common/SystemConstant';
import {
  emptyDataPage, convertDateTimeToString,
  asyncDelay, formatLongText, isImage, backHandlerConfig, appGetDataAndNavigate, convertDateToString
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
  Button, Content, Icon, Footer, Text as NbText, Toast
} from 'native-base';
import { Icon as RneIcon, ListItem } from 'react-native-elements';
import * as util from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
//import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
// import ImagePicker from 'react-native-image-picker';
import Images from '../../../common/Images';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListCommentStyle, FooterCommentStyle, AttachCommentStyle } from '../../../assets/styles/CommentStyle';
import { scale, verticalScale, moderateScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//redux
import * as navAction from '../../../redux/modules/Nav/Action';
import GoBackButton from '../../common/GoBackButton';
import { MoreButton } from '../../common';

const android = RNFetchBlob.android;

class ListComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      isTaskComment: props.extendsNavParams.isTaskComment,
      taskId: props.coreNavParams.taskId,
      taskType: props.coreNavParams.taskType,

      docId: props.coreNavParams.docId,
      docType: props.coreNavParams.docType,
      footerFlex: 0,
      loading: false,
      loadingMore: false,
      refreshing: false,
      executing: false,
      data: [],
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      commentContent: EMPTY_STRING,
      refreshingData: false,
      avatarSource: EMPTY_STRING,
      avatarSourceURI: EMPTY_STRING,
      isOpen: false,
      heightAnimation: verticalScale(50),
    }
  }

  componentWillMount = () => {
    this.setState({
      loading: true
    }, () => this.fetchData());
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  loadingMore = () => {
    this.setState({
      loadingMore: true,
      pageIndex: this.state.pageIndex + 1
    }, () => this.fetchData())
  }

  fetchData = async () => {
    let url = `${API_URL}/api/VanBanDi/GetRootCommentsOfVanBan/${this.state.docId}/${this.state.pageIndex}/${this.state.pageSize}`;
    const { isTaskComment } = this.state;

    if (isTaskComment) {
      url = `${API_URL}/api/HscvCongViec/GetRootCommentsOfTask/${this.state.taskId}/${this.state.pageIndex}/${this.state.pageSize}`;
    }

    let result = await fetch(url).then((response) => response.json());

    this.setState({
      loading: false,
      loadingMore: false,
      refreshing: false,
      data: this.state.loadingMore ? [...this.state.data, ...result] : result
    })
  }

  handleRefresh = () => {
    this.setState({
      pageIndex: DEFAULT_PAGE_SIZE
    }, () => this.fetchData())
  }

  componentDidMount = () => {
    // backHandlerConfig(true, this.navigateToDetail)
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    // backHandlerConfig(false, this.navigateToDetail);
  }

  navigateToDetail = () => {
    // this.props.navigation.navigate(this.props.coreNavParams.screenName);
    this.props.navigation.goBack();
    // if (this.state.isTaskComment) {
    //   this.props.navigation.navigate('DetailTaskScreen'); // might change to goBack() soon
    // } else {
    //   this.props.navigation.navigate('VanBanDiDetailScreen')
    // }
  }

  keyboardWillShow = (event) => {
    this.setState({
      footerFlex: 1
    })
  };

  keyboardWillHide = (event) => {
    this.setState({
      footerFlex: 0
    })
  };

  onReplyComment = (item) => {
    const targetScreenParams = {
      comment: item,
      isTaskComment: this.state.isTaskComment
    };

    this.props.updateExtendsNavParams(targetScreenParams);
    this.props.navigation.navigate('ReplyCommentScreen');
  }

  sendComment = async () => {
    if (util.isEmpty(this.state.commentContent) || util.isNull(this.state.commentContent)) {
      Toast.show({
        text: 'Vui lòng nhập nội dung bình luận',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    }
    else {
      const data = new FormData();
      data.append('UPloadedImage', {
        uri: this.state.avatarSourceURI,
        type: 'image/jpeg',
        name: convertDateTimeToString(new Date())
      });


      this.setState({
        executing: true
      });

      //phần thông tin cho văn bản 
      let url = `${API_URL}/api/VanBanDi/SaveComment`;

      let headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      });

      let body = JSON.stringify({
        ID: 0,
        VANBANDI_ID: this.state.docId,
        PARENT_ID: null,
        NGUOITAO: this.state.userId,
        NOIDUNGTRAODOI: this.state.commentContent
      });

      //phần thông tin cho công việc
      if (this.state.isTaskComment) {
        url = `${API_URL}/api/HscvCongViec/SaveComment`;
        headers = new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        });

        body = JSON.stringify({
          ID: 0,
          CONGVIEC_ID: this.state.taskId,
          REPLY_ID: null,
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
      if (this.state.isTaskComment) {
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
      }

      this.setState({
        executing: false,
        commentContent: EMPTY_STRING
      }, () => this.fetchData());
    }
  }

  async onDownloadFile(fileName, fileLink, fileExtension) {
    //config save path
    fileLink = fileLink.replace(/\\/, '');
    fileLink = fileLink.replace(/\\/g, '/');
    let date = new Date();
    let url = `${WEB_URL}/Uploads/${fileLink}`;
    // url = url.replace('\\', '/');
    // url = url.replace(/\\/g, '/');
    url = url.replace(/ /g, "%20");
    let regExtension = this.extention(url);
    let extension = "." + regExtension[0];
    const { config, fs } = RNFetchBlob;
    let { PictureDir, DocumentDir } = fs.dirs;

    let savePath = (Platform.OS === 'android' ? PictureDir : DocumentDir) + "/vnio_" + Math.floor(date.getTime() + date.getSeconds() / 2) + extension;

    let options = {};
    let isAllowDownload = true;
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'CẤP QUYỀN TRUY CẬP CHO ỨNG DỤNG',
          message:
            'EofficeVNEH muốn truy cập vào tài liệu của bạn',
          buttonNeutral: 'Để sau',
          buttonNegative: 'Thoát',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: savePath,
            description: 'VNIO FILE'
          }
        }
      } else {
        isAllowDownload = false;
      }
    } else {
      options = {
        fileCache: true,
        path: savePath
      }
    }

    if (isAllowDownload) {
      config(options).fetch('GET', url).then((res) => {
        if (res.respInfo.status === 404) {
          Alert.alert(
            'THÔNG BÁO',
            'KHÔNG TÌM THẤY TÀI LIỆU',
            [
              {
                text: "ĐÓNG",
                onPress: () => { }
              }
            ]
          );
        } else {
          Alert.alert(
            'THÔNG BÁO',
            `DOWN LOAD THÀNH CÔNG`,
            [
              {
                text: 'MỞ FILE',
                onPress: () => {
                  let openDocConfig = {};

                  if (Platform.OS == 'android') {
                    openDocConfig = {
                      url: `file://${res.path()}`,
                      fileName: fileName,
                      cache: false,
                      fileType: regExtension[0]
                    }
                  } else {
                    openDocConfig = {
                      url: savePath,
                      fileNameOptional: fileName
                    }
                  }

                  OpenFile.openDoc([openDocConfig], (error, url) => {
                    if (error) {
                      Alert.alert(
                        'THÔNG BÁO',
                        error.toString(),
                        [
                          {
                            text: 'OK',
                            onPress: () => { }
                          }
                        ]
                      )
                    } else {
                      console.log(url)
                    }
                  })
                }
              },
              {
                text: 'ĐÓNG',
                onPress: () => { }
              }
            ]
          );
        }
      }).catch((err) => {
        Alert.alert(
          'THÔNG BÁO',
          'DOWNLOAD THẤT BẠI',
          [
            {
              text: err.toString(),
              onPress: () => { }
            }
          ]
        )
      })
    }
  }

  extention(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      pageIndex: DEFAULT_PAGE_INDEX,
    }, () => {
      this.fetchData()
    })
  }

  renderItem = ({ item, index }) => {
    let attachmentContent = null;
    if (item.ATTACH != null) {
      attachmentContent = (
        <View style={AttachCommentStyle.commentAttachContainer}>
          <View style={AttachCommentStyle.commentAttachInfo}>
            <RneIcon name='ios-attach' color={Colors.BLUE_PANTONE_640C} size={verticalScale(20)} type='ionicon' />
            <Text style={AttachCommentStyle.commentAttachText}>
              {formatLongText(item.ATTACH.TENTAILIEU, 30)}
            </Text>
          </View>

          <TouchableOpacity style={AttachCommentStyle.commetnAttachButton} onPress={() => this.onDownloadFile(item.ATTACH.TENTAILIEU, item.ATTACH.DUONGDAN_FILE, item.ATTACH.DINHDANG_FILE)}>
            <RneIcon name='download' color={Colors.BLUE_PANTONE_640C} size={verticalScale(15)} type='entypo' />
          </TouchableOpacity>
        </View>
      )
    }
    // let currentBorderBottomWidth = .7;
    // if (--this.state.data.length === index) {
    //   currentBorderBottomWidth = 0;
    // }
    return (
      <ListItem
        roundAvatar
        hideChevron
        avatar={Images.userAvatar}
        avatarContainerStyle={{ alignSelf: "flex-start" }}
        avatarStyle={{ width: 40, height: 40, borderRadius: 20 }}
        title={
          <View style={{ marginHorizontal: 10, flexDirection: "column" }}>
            <Text style={{ fontSize: moderateScale(14, 1.2), fontWeight: "bold", color: Colors.OLD_LITE_BLUE }}>{item.FullName}</Text>
            <Text style={{ fontSize: moderateScale(11, 1.1), color: Colors.DANK_GRAY }}>{convertDateTimeToString(item.NGAYTAO, true)}</Text>
          </View>
        }
        subtitle={
          <View style={{ marginTop: 8, marginHorizontal: 10, flexDirection: "column" }}>
            <Text style={{ fontSize: moderateScale(12, 1.2) }}>{item.NOIDUNG}</Text>

            <View style={[ListCommentStyle.subInfoContainer, { marginTop: 8 }]}>
              {
                item.NUMBER_REPLY > 0
                  ? <TouchableOpacity style={ListCommentStyle.replyCommentContainer} onPress={() => this.onReplyComment(item)}>
                    <Text style={ListCommentStyle.replyButtonText}>
                      {'Xem tất cả ' + item.NUMBER_REPLY + ' phản hồi'}
                    </Text>
                  </TouchableOpacity>
                  : <TouchableOpacity style={ListCommentStyle.replyButtonContainer} onPress={() => this.onReplyComment(item)}>
                    {
                      // <RneIcon type='entypo' name='reply' size={moderateScale(30)} color={Colors.BLUE_PANTONE_640C} />
                    }
                    <Text style={ListCommentStyle.replyButtonText}>Trả lời</Text>
                  </TouchableOpacity>
              }

            </View>
          </View>
        }
        containerStyle={{
          marginBottom: 10,
          borderBottomWidth: .7,
          marginHorizontal: 7,
        }}
      />
      // <View style={ListCommentStyle.commentContainer}>
      //   <View style={{ flexDirection: 'row' }}>
      //     <View style={ListCommentStyle.commentAvatarContainer}>
      //       <View style={ListCommentStyle.commentAvatar}>
      //         <RneIcon size={moderateScale(30)} type='ionicon' name='ios-people' color={Colors.WHITE} />
      //       </View>
      //     </View>
      //     <View style={ListCommentStyle.commentContentContainer}>
      //       <Text style={ListCommentStyle.commentUserName}>
      //         {item.FullName}
      //       </Text>
      //       <Text style={ListCommentStyle.commentContent}>
      //         {item.NOIDUNG}
      //       </Text>

      //       {
      //         attachmentContent
      //       }

      //       <View style={ListCommentStyle.subInfoContainer}>
      //         <TouchableOpacity style={ListCommentStyle.replyButtonContainer} onPress={() => this.onReplyComment(item)}>
      //           <RneIcon type='entypo' name='reply' size={moderateScale(30)} color={Colors.BLUE_PANTONE_640C} />
      //           <Text style={ListCommentStyle.replyButtonText}>
      //             Trả lời
      //         </Text>
      //         </TouchableOpacity>

      //         <Text style={ListCommentStyle.commentTime}>
      //           {convertDateTimeToString(item.NGAYTAO)}
      //         </Text>
      //       </View>

      //       {
      //         renderIf(item.NUMBER_REPLY > 0)(
      //           <TouchableOpacity style={ListCommentStyle.replyCommentContainer} onPress={() => this.onReplyComment(item)}>
      //             <Text style={ListCommentStyle.replyCommentText}>
      //               {'Đã có ' + item.NUMBER_REPLY + ' phản hồi'}
      //             </Text>
      //           </TouchableOpacity>
      //         )
      //       }
      //     </View>
      //   </View>
      // </View>
    )
  }

  render() {
    const commentSendableIcon = (this.state.commentContent !== EMPTY_STRING) ? Colors.BLUE_PANTONE_640C : Colors.GRAY;
    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateToDetail()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              BÌNH LUẬN
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
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
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshingData}
                    onRefresh={this.handleRefresh}
                    colors={[Colors.BLUE_PANTONE_640C]}
                    tintColor={[Colors.BLUE_PANTONE_640C]}
                    title='Kéo để làm mới'
                    titleColor={Colors.RED}
                  />
                }
                ListEmptyComponent={() =>
                  this.state.loading ? null : emptyDataPage()
                }
                ListFooterComponent={() => (<MoreButton
                  isLoading={this.state.loadingMore}
                  isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
                  loadmoreFunc={this.loadingMore}
                />)}
              />
            )
          }
        </Content>

        <View style={{ height: verticalScale(50), flex: this.state.footerFlex, backgroundColor: Colors.WHITE }}>
          <View style={[FooterCommentStyle.footerComment]}>
            <Input
              // style={FooterCommentStyle.footerCommentContent}
              placeholder='Nhập nội dung trao đổi'
              value={this.state.commentContent}
              onChangeText={(commentContent) => this.setState({ commentContent })}
              multiline={true}
            />
            <TouchableOpacity
              transparent
              onPress={this.sendComment}
              disabled={this.state.commentContent.trim() === EMPTY_STRING}
              style={{ marginVertical: 10 }}
            >
              <Text style={{ fontSize: moderateScale(20), color: commentSendableIcon }}>GỬI</Text>
              {
                // <RneIcon name='md-send' size={moderateScale(40)} color={commentSendableIcon} type='ionicon' />
              }
            </TouchableOpacity>
          </View>
        </View>

        {
          executeLoading(this.state.executing)
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListComment);