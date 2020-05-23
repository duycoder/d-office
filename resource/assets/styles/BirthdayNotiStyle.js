import { StyleSheet } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { scale, moderateScale } from './ScaleIndicator';

const BirthdayNotiStyles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#ffccd7",
    borderBottomColor: "#ccc",
  },
  leftIconContainer: {
    marginRight: scale(10),
    justifyContent: 'center',
  },
  titleContainerStyle: {
    marginHorizontal: '3%',
  }, titleStyle: {
    color: COMMON_COLOR.BLACK,
    fontSize: moderateScale(12, 1.2),
    fontWeight: "bold",
  },
  subTitleContainerStyle: {
    marginHorizontal: '3%'
  }, subTitleStyle: {
    color: COMMON_COLOR.BLACK,
    fontSize: moderateScale(10, 0.95),
  },
});

const iconSize = moderateScale(42, 1.2);
const iconColor = '#ff460f';

export {
  BirthdayNotiStyles,
  iconSize,
  iconColor,
};