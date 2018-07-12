import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListChatterStyle = StyleSheet.create({
  containerStyle: {
    paddingTop: verticalScale(16), 
    paddingBottom: verticalScale(16)
  }, titleContainerStyle: {
    marginBottom: verticalScale(5)
  },
  chatterAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    resizeMode: 'stretch',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.WHITE,
    borderWidth: moderateScale(2),
  }, chatterAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: scale(20),
  }, onlineAvatarContainer: {
    backgroundColor: Colors.GREEN_PANTON_376C,
  }, offlineAvatarContainer: {

  }, chatterAvatarOverlay: {
    backgroundColor: 'transparent'
  },
  chatterMessageContainer: {
    justifyContent: 'center',
    flexDirection: 'row'
  }, chatterMessageIcon: {
    width: moderateScale(50), 
    height: moderateScale(50), 
    resizeMode: 'stretch'
  }, unreadMessage: {
    marginLeft: moderateScale(-35), 
    marginTop: moderateScale(10),
  }, largeUnreadMessage: {
    width: moderateScale(25), 
    height: moderateScale(25), 
    borderRadius: moderateScale(25 / 2)
  },
  chatterName: {
    fontWeight: 'bold',
    fontSize: moderateScale(16,1.2)
  }, chatterMessageContent: {
    fontWeight: 'bold',
    fontSize: moderateScale(14, 1.2)
  }, chatterEmail: {
    fontStyle: 'italic',
    fontSize: moderateScale(10,1.2)
  }
});

export const ChatterStyle = StyleSheet.create({
  timeCreatedText: {
    fontStyle: 'italic',
    fontSize: moderateScale(10, 1.1)
  }, chatterReadMessage: {
    fontSize: moderateScale(14, 1.2)
  }, chatterUnreadMessage: {
    fontWeight: 'bold',
    fontSize: moderateScale(14,1.2)
  }, chatterMessageContent: {
    marginBottom: verticalScale(10), 
    padding: moderateScale(10), 
    borderRadius: moderateScale(15)
  }, chatterMessageContainer: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: moderateScale(5),
    marginBottom: verticalScale(15),
  }
});

export const DetailChatterStyle = StyleSheet.create({

})