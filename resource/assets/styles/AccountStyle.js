import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from './ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';

export default StyleSheet.create({
  mainContainer: {
    flex: 5,
    paddingHorizontal: moderateScale(14, 0.9),
    marginVertical: moderateScale(14, 0.9)
  },
  labelContainer: {
    borderBottomWidth: 0,
  }, labelTitle: {
    fontSize: moderateScale(12, 0.9)
  }, labelResult: {
    fontSize: moderateScale(14, 1.1),
    color: COMMON_COLOR.BLACK
  },
  submitButton: {
    backgroundColor: COMMON_COLOR.LITE_BLUE,
    marginTop: verticalScale(20),
    borderRadius: 4,
    marginHorizontal: verticalScale(18),
    // position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: moderateScale(35, 1.8),
    // borderRadius: moderateScale(5, 1.2),
    padding: moderateScale(10)
  }, submitButtonText: {
    color: COMMON_COLOR.WHITE,
    fontSize: moderateScale(16, 1.2),
    fontWeight: 'bold',
    // fontSize: moderateScale(18, 1.5),
    textAlign: 'center'
  }
});