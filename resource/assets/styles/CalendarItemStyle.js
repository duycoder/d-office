import { StyleSheet } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

const CalendarItemStyle = StyleSheet.create({
  containerStyle: {
    backgroundColor: COMMON_COLOR.WHITE, 
    borderBottomColor: "#ccc", 
    padding: moderateScale(8, 1.5)
  },
  titleContainerStyle: {
    marginHorizontal: '3%',
  }, titleStyle: {
    color: COMMON_COLOR.BLACK,
    fontSize: moderateScale(12, 1.2),
    fontWeight: "bold",
  },
  subTitleStyle: {
    color: COMMON_COLOR.VERY_DANK_GRAY,
    fontSize: moderateScale(12, 1.2),
    marginTop: verticalScale(8),
  },
});

export {
  CalendarItemStyle,
};