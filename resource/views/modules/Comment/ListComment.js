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
  asyncDelay, formatLongText, isImage, backHandlerConfig, appGetDataAndNavigate
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
  Button, Content, Icon, Footer, Text as NbText
} from 'native-base';
import { Icon as RneIcon } from 'react-native-elements';
import * as util from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListCommentStyle, FooterCommentStyle, AttachCommentStyle } from '../../../assets/styles/CommentStyle';
import { scale, verticalScale, moderateScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

const android = RNFetchBlob.android;

class ListComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      isTaskComment: props.navigation.state.params.isTaskComment,
      taskId: props.navigation.state.params.taskId,
      taskType: props.navigation.state.params.taskType,

      docId: props.navigation.state.params.docId,
      docType: props.navigation.state.params.docType,
      footerFlex: 0,
      loading: false,
      loadingMore: false,
      refreshing: false,
      executing: false,
      data: props.navigation.state.params.vanbandiData || [],
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      commentContent: EMPTY_STRING,

      avatarSource: EMPTY_STRING,
      avatarSourceURI: EMPTY_STRING,
      isOpen: false,
      heightAnimation: verticalScale(50),
    }
  }

  componentWillMount = () => {
    this.state.data.length < 0 &&
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

  fetchData = async (isTaskComment = this.state.isTaskComment) => {
    // let url = `${API_URL}/api/VanBanDi/GetRootCommentsOfVanBan/${this.state.docId}/${this.state.pageIndex}/${this.state.pageSize}`;
    let url = `${API_URL}/api/VanBanDi/GetDetail/${this.state.docId}/${this.state.userId}`;
    if (isTaskComment) {
      url = `${API_URL}/api/HscvCongViec/GetRootCommentsOfTask/${this.state.taskId}/${this.state.pageIndex}/${this.state.pageSize}`;
    }

    const result = await fetch(url);
    let resultJson = await result.json();
    if (!isTaskComment) {
      resultJson = resultJson.LstRootComment
    }

    this.setState({
      loading: false,
      loadingMore: false,
      refreshing: false,
      data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson
    })
  }

  handleRefresh = () => {
    this.setState({
      pageIndex: DEFAULT_PAGE_SIZE
    }, () => this.fetchData())
  }

  componentDidMount = () => {
    backHandlerConfig(true, this.navigateToDetail)
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    backHandlerConfig(false, this.navigateToDetail);
  }

  navigateToDetail = () => {
    // console.tron.log(this.props.navigation)
    appGetDataAndNavigate(this.props.navigation, 'ListCommentScreen');
    return true;
    // if (this.state.isTaskComment) {
    //   this.props.navigation.navigate('DetailTaskScreen', {
    //     taskId: this.state.taskId,
    //     taskType: this.state.taskType
    //   });
    // } else {
    //   this.props.navigation.navigate('DetailSignDocScreen', {
    //     docId: this.state.docId,
    //     docType: this.state.docType
    //   })
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
    this.props.navigation.navigate('ReplyCommentScreen', {
      comment: item,
      isTaskComment: this.state.isTaskComment,
      taskId: this.state.taskId,
      taskType: this.state.taskType,

      docId: this.state.docId,
      docType: this.state.docType
    });
  }

  sendComment = async () => {
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
    let attachmentContent = null;
    if (item.ATTACH != null) {
      attachmentContent = (
        <View style={AttachCommentStyle.commentAttachContainer}>
          <View style={AttachCommentStyle.commentAttachInfo}>
            <RneIcon name='ios-attach-outline' color={Colors.BLUE_PANTONE_640C} size={verticalScale(20)} type='ionicon' />
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
    return (
      <View style={ListCommentStyle.commentContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View style={ListCommentStyle.commentAvatarContainer}>
            <View style={ListCommentStyle.commentAvatar}>
              <RneIcon size={moderateScale(50)} type='ionicon' name='ios-people' color={Colors.WHITE} />
            </View>
          </View>
          <View style={ListCommentStyle.commentContentContainer}>
            <Text style={ListCommentStyle.commentUserName}>
              {item.FullName}
            </Text>
            <Text style={ListCommentStyle.commentContent}>
              {item.NOIDUNG}
            </Text>

            {
              attachmentContent
            }

            <View style={ListCommentStyle.subInfoContainer}>
              <TouchableOpacity style={ListCommentStyle.replyButtonContainer} onPress={() => this.onReplyComment(item)}>
                <RneIcon type='entypo' name='reply' size={moderateScale(30)} color={Colors.BLUE_PANTONE_640C} />
                <Text style={ListCommentStyle.replyButtonText}>
                  Trả lời
              </Text>
              </TouchableOpacity>

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
      </View>
    )
  }

  onOpenSendFile = async () => {
    // DocumentPicker.show({
    //   filetype: [DocumentPickerUtil.allFiles()],
    // },(error,res) => {
    //   // Android
    //   console.log(
    //      res.uri,
    //      res.type, // mime type
    //      res.fileName,
    //      res.fileSize
    //   );
    // });
    if (this.state.isOpen === true) {
      this.setState({
        avatarSource: EMPTY_STRING,
        avatarSourceURI: EMPTY_STRING,
        isOpen: false,
        footerFlex: 0,
        heightAnimation: verticalScale(50)
      });
      return;
    }
    else {
      this.setState({
        executing: true,
        isOpen: true,
      });
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        },
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
      };

      /**
       * The first arg is the options object for customization (it can also be null or omitted for default options),
       * The second arg is the callback which sends object: response (more info below in README)
       */
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        console.log('Response.URI = ', response.uri);
        console.log('Response Data = ', response.data);
        console.log('Response Size = ', response.fileSize);
        if (response.didCancel) {
          console.log('User cancelled image picker');
          this.setState({
            isOpen: false,
            footerFlex: 0
          });
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          Alert.alert(
            'THÔNG BÁO',
            'KIỂM TRA LẠI MÁY ẢNH CỦA BẠN',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.setState({
                    isOpen: false,
                    footerFlex: 0
                  });
                }
              }
            ]
          );
        }
        else {
          let source = { uri: response.uri };
          console.log('Source = ', source);
          console.log('Source URI = ', source.uri);
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

          this.setState({
            avatarSource: source,
            avatarSourceURI: source.uri,
            executing: false,
            footerFlex: 1,
            heightAnimation: verticalScale(250),
          });
        }
      });
    }
  }

  render() {
    // const footerFlexWhenImage = (this.state.avatarSource === EMPTY_STRING) ? this.state.footerFlex : 2;
    const commentChosenImageIcon = (this.state.isOpen) ? Colors.BLUE_PANTONE_640C : Colors.GRAY;
    const commentSendableIcon = (this.state.avatarSource !== EMPTY_STRING || this.state.commentContent !== EMPTY_STRING) ? Colors.BLUE_PANTONE_640C : Colors.GRAY;
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={() => this.navigateToDetail()}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
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
        </Content>

        <Footer style={[FooterCommentStyle.footerUploader, { height: this.state.heightAnimation }]}>
          <View style={[FooterCommentStyle.footerComment]}>
            {/* <Button transparent onPress={this.onOpenSendFile}>
              <RneIcon name='md-images' size={moderateScale(40)} color={commentChosenImageIcon} type='ionicon' />
            </Button> */}
            <Input
              style={FooterCommentStyle.footerCommentContent}
              placeholder='Nhập nội dung trao đổi'
              value={this.state.commentContent}
              onChangeText={(commentContent) => this.setState({ commentContent })}
              multiline={true}
            />
            <Button transparent onPress={this.sendComment}>
              <RneIcon name='md-send' size={moderateScale(40)} color={commentSendableIcon} type='ionicon' />
            </Button>
          </View>
          {
            renderIf(this.state.avatarSource !== EMPTY_STRING)(
              <View style={FooterCommentStyle.footerUploadWrapper}>
                <Image source={this.state.avatarSource} style={FooterCommentStyle.imageUpload} />
              </View>
            )
          }
        </Footer>

        {
          executeLoading(this.state.executing)
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

export default connect(mapStateToProps)(ListComment);