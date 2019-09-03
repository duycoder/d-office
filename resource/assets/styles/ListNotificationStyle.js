import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const ListNotificationStyle = StyleSheet.create({
  leftTitleCircle: {
    backgroundColor: Colors.GRAY,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  leftTitleText: {
    fontWeight: 'bold',
    color: Colors.WHITE
  },
  title: {
    color: Colors.BLACK,
    fontSize: moderateScale(12, 1.2)
  },
  rightTitleText: {
    textAlign: 'center',
    color: Colors.DANK_GRAY,
    fontSize: moderateScale(12, 0.9),
    fontStyle: 'italic',
  }
});