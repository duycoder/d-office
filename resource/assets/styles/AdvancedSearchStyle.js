import { StyleSheet } from 'react-native';
import { Colors, width, height } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const DefaultStyle = StyleSheet.create({
  container: {
    flex: 1,
  }, body: {
    width: width,
    flex: 1,
    // height: height,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingBottom: verticalScale(20),
  }, content: {
    // flex: 1,
    backgroundColor: Colors.WHITE,
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(10),
  },
  datepickerRoot: {
    flexDirection: 'row',
    // marginHorizontal: scale(16),
    justifyContent: 'space-around'
  }, datepickerWrapper: {
    height: verticalScale(100),
    alignItems: 'center',
    justifyContent: 'center'
  }, datepickerInput: {
    // width: scale(150),
    alignSelf: 'stretch',
    // marginTop: verticalScale(15)
  },
  submitButton: {
    alignSelf: 'stretch',
    marginTop: verticalScale(30),
    marginHorizontal: scale(10),
    justifyContent: 'center'
  }, submitButtonText: {
    fontWeight: 'bold',
    // fontSize: moderateScale(16, 1.3),
    color: Colors.WHITE
  },
  fieldRoot: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  }, fieldWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerWrapper: {
    backgroundColor: Colors.RED_PANTONE_186C
  }, headerItemWrapper: {
    backgroundColor: Colors.WHITE
  }
});

export const FormStyle = StyleSheet.create({
  formLabel: {
    marginVertical: verticalScale(5),
  }, formLabelText: {
    color: '#424243',
    fontWeight: 'bold',
    // paddingLeft: scale(3),
    fontSize: moderateScale(16)
  }, formInput: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: verticalScale(5)
  }, formInputText: {
    borderWidth: 1,
    borderColor: '#acb7b1',
    borderRadius: moderateScale(5),
    backgroundColor: '#f7f7f7',
    color: '#a7a7a7',
    height: moderateScale(45, 2),
    paddingLeft: scale(10),
    alignSelf: 'stretch'
  }, formInputPicker: {
    borderWidth: 1,
    borderColor: '#acb7b1',
    borderRadius: moderateScale(5),
    backgroundColor: '#f7f7f7',
    height: moderateScale(45, 2),
    paddingLeft: scale(10),
    alignSelf: 'stretch'
  }, formPickerItem: {
    paddingHorizontal: scale(10),
    marginLeft: 0
  }
});