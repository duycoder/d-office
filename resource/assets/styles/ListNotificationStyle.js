import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListNotificationStyle = StyleSheet.create({
  leftTitleCircle: {
    backgroundColor: Colors.GRAY,
    width: moderateScale(48, 1.13),
    height: moderateScale(48, 1.13),
    borderRadius: moderateScale(23, 1.13),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  leftTitleText: {
    fontWeight: 'bold',
    color: Colors.WHITE,
    fontSize: moderateScale(15, 1.1)
  },
  title: {
    color: Colors.VERY_DANK_GRAY,
    fontSize: moderateScale(12, 1.2)
  },
  rightTitleText: {
    textAlign: 'center',
    color: Colors.DANK_GRAY,
    fontSize: moderateScale(12, 0.9),
    fontStyle: 'italic',
  }
});