import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListCommentStyle = StyleSheet.create({
  commentContainer: {
    padding: moderateScale(10),
    
  },
  userAvatar: {
  },
  commentAvatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  commentAvatar: {
    backgroundColor: Colors.BLUE_PANTONE_640C,
    borderRadius: 25,
    height: 50,
    width: '100%',
    justifyContent: 'center'
  },
  commentContentContainer: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  commentUserName: {
    fontSize: moderateScale(13, 1.2),
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: Colors.BLACK
  },
  commentContent: {
    fontSize: moderateScale(12, 1.2),
    color: Colors.BLACK
  },
  boldText: {
    fontSize: moderateScale(14, 1.2),
    fontWeight: 'bold',
  },
  commentTime: {
    alignItems: 'center',
    fontSize: moderateScale(10, .9), 
    color: Colors.DANK_GRAY
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  subInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }, replyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }, replyButtonText: {
    color: Colors.BLUE_PANTONE_640C
  }, replyCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  }, replyCommentText: {
    fontWeight: 'bold',
    color: Colors.BLACK
  }
});

export const ReplyCommentStyle = StyleSheet.create({
  replyCommentContainer: {
    padding: moderateScale(10),
    borderBottomWidth: .7,
    borderBottomColor: Colors.DANK_GRAY,  
  },
  replyObjectContainer: {
    marginBottom: moderateScale(10),
    paddingBottom: moderateScale(10),
  },
  replyObjectHeader: {
    height: verticalScale(60),
    flexDirection: 'row'
  },
  replyObjectAvatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  replyObjectAvatar: {
    backgroundColor: Colors.BLUE_PANTONE_640C,
    borderRadius: 5,
    height: verticalScale(60),
    width: '100%',
    justifyContent: 'center'
  },
  replyObjectUserContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
  },
  replyObjectContent: {
    marginTop: 3
  },
  replyObjectTime: {
    marginTop: moderateScale(10),
    justifyContent: 'flex-start'
  },
  replyObjectTimeText: {
    fontSize: moderateScale(11, 1.2),
  },
  replyObjectUserText: {
    flexWrap: 'wrap',
    fontWeight: 'bold',
    color: Colors.BLUE_PANTONE_640C,
    fontSize: moderateScale(16, 1.2),
  },
  replyObjectContentText: {
    fontSize: moderateScale(13, 1.2),
    color: Colors.BLACK
  },
  replyListContainer: {
    marginHorizontal: moderateScale(5),
    paddingTop: moderateScale(10),
    // borderTopColor: Colors.GRAY,
    // borderTopWidth: 1
  }
});

export const FooterCommentStyle = StyleSheet.create({
  footerComment: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    // flexWrap: 'wrap',
    paddingHorizontal: 10
  }, footerCommentContent: {
    // paddingLeft: moderateScale(10), 
    maxHeight: verticalScale(50),
  },
  footerUploader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  }, footerUploadWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  }, imageUpload: {
    height: moderateScale(200),
    width: moderateScale(200),
  }
});

export const AttachCommentStyle = StyleSheet.create({
  commentAttachInfo: {
    flexDirection:'row'
  },
  commentAttachContainer: {
    width: '100%',
    marginTop: moderateScale(10),
    padding: moderateScale(5),
    // borderColor: Colors.GRAY,
    // borderWidth: 1,
    backgroundColor: Colors.CLOUDS,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentAttachText: {
    color: Colors.BLUE_PANTONE_640C,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    fontSize: moderateScale(12, 1.1),
    marginLeft: 5
  },
  commetnAttachButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: Colors.GRAY,
    borderWidth: 1
  }
});