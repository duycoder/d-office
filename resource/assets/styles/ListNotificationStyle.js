import { StyleSheet } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListNotificationStyle = StyleSheet.create({
  leftTitleCircle: {
    backgroundColor: COMMON_COLOR.GRAY,
    width: moderateScale(48, 1.13),
    height: moderateScale(48, 1.13),
    borderRadius: moderateScale(23, 1.13),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  leftTitleText: {
    fontWeight: 'bold',
    color: COMMON_COLOR.WHITE,
    fontSize: moderateScale(15, 1.1)
  },
  title: {
    color: COMMON_COLOR.VERY_DANK_GRAY,
    fontSize: moderateScale(12, 1.2)
  },
  rightTitleText: {
    textAlign: 'center',
    color: COMMON_COLOR.DANK_GRAY,
    fontSize: moderateScale(12, 0.9),
    fontStyle: 'italic',
  }
});