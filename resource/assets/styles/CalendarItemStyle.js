import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

const CalendarItemStyle = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.WHITE, 
    borderBottomColor: "#ccc", 
    padding: moderateScale(8, 1.5)
  },
  titleContainerStyle: {
    marginHorizontal: '3%',
  }, titleStyle: {
    color: Colors.BLACK,
    fontSize: moderateScale(12, 1.2),
    fontWeight: "bold",
  },
  subTitleStyle: {
    color: Colors.VERY_DANK_GRAY,
    fontSize: moderateScale(12, 1.2),
    marginTop: verticalScale(8),
  },
});

export {
  CalendarItemStyle,
};