import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

//constant
import { Colors } from '../../common/SystemConstant'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  }, body: {
    width: scale(300),
    height: verticalScale(200),
    borderRadius: 3,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ececec'
  }, headerCenterTitle: {
    color: Colors.LITE_BLUE,
    fontWeight: 'bold'
  }, headerOuter: {
    height: verticalScale(50),
    borderBottomColor: Colors.LITE_BLUE,
    borderBottomWidth: 3,
    backgroundColor: '#fff',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10)
  }, content: {
    height: verticalScale(100),
    justifyContent: 'center',
    alignItems: 'center',
  }, contentText: {
    color: '#000',
    fontSize: moderateScale(18, 1.3),
    textAlign: 'center'
  }, footer: {
    height: verticalScale(50),
    borderTopColor: '#ececec',
    borderTopWidth: verticalScale(2),
    flexDirection: 'row'
  }, leftFooter: {
    flex: 1,
    borderRightWidth: scale(2),
    borderRightColor: '#ececec'
  }, rightFooter: {
    flex: 1,
  }, footerText: {
    color: '#000'
  }, footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})