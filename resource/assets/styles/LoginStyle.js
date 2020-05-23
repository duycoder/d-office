/**
 * @description: style cho màn hình đăng nhập
 * @author: duynn
 * @since: 04/05/2018
 */

import { StyleSheet } from 'react-native';

import {
  scale,
  verticalScale,
  moderateScale
} from './ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';

export const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  }, formHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  }, formHeaderIcon: {
    height: moderateScale(36, 1.3),
    resizeMode: 'contain',
    marginTop: verticalScale(30)
  }, formHeaderCompanyTitle: {
    fontWeight: 'bold',
    color: '#221f1f'
  }, formHeaderSoftwareTitle: {
    fontWeight: 'bold',
    color: '#007cc2',
    fontSize: moderateScale(13, 1.05),
  }, formHeaderSoftwareName: {
    color: COMMON_COLOR.LITE_BLUE,
    fontWeight: 'bold',
    fontSize: moderateScale(25, 1.5)
  }, formHeaderNothing: {
    marginTop: verticalScale(30)
  },
  formFooter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COMMON_COLOR.LITE_BLUE,
  }, formContainer: {
    backgroundColor: '#fff',
    marginTop: verticalScale(35),
    marginHorizontal: scale(10),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(35),
  }, formContainerImageBackground: {
    flex: 6,
    width: '100%',
    height: '100%'
  }, formTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#cdd3d1',
    alignItems: 'center',
    paddingVertical: verticalScale(20)
  }, formTitleText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#221f1f'
  }, formInputs: {
    paddingHorizontal: scale(10)
  }, formLabel: {
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10)
  }, formLabelText: {
    color: '#424243',
    fontWeight: 'bold',
    paddingLeft: scale(3),
    fontSize: moderateScale(16)
  }, formInput: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  }, formInputText: {
    borderWidth: scale(1),
    borderColor: '#acb7b1',
    borderRadius: moderateScale(5),
    backgroundColor: '#f7f7f7',
    color: '#666666',
    height: moderateScale(36, 1.2),
    paddingLeft: scale(10),
    fontSize: moderateScale(14, 1.23),
    alignSelf: 'stretch'
  }, formPasswordVisibility: {
    position: 'absolute',
    right: scale(5)
  },

  formNotes: {
    alignItems: 'center',
    paddingVertical: verticalScale(10)
  }, formRemember: {
    flexDirection: 'row',
    flex: 1
  }, formRememberButton: {
    flexDirection: 'row',
  }, formRememberText: {
    marginLeft: scale(20),
    color: '#010101',
    fontSize: moderateScale(16)
  }, formForgot: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  }, formForgotButton: {
    paddingRight: scale(10)
  }, formForgotText: {
    color: '#da2032',
    fontWeight: 'bold',
    fontSize: moderateScale(16)
  }, formButton: {
    marginTop: verticalScale(5),
    marginBottom: verticalScale(10)
  }, formButtonLogin: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: moderateScale(34.5, 1.28),
    borderRadius: moderateScale(5, 1.2),
    padding: moderateScale(10)
  }, formButtonText: {
    fontWeight: 'bold',
    fontSize: moderateScale(17.5, 1.21),
    textAlign: 'center'
  }, formIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }, formText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    fontWeight: 'bold'
  },

  registerInputForm: {
    marginTop: verticalScale(8),
    marginLeft: scale(5),
    fontSize: moderateScale(14, 1.23),
    minHeight: moderateScale(28, 1.4),
  },
});