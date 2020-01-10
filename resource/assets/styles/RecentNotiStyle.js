import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, moderateScale } from './ScaleIndicator';

const BirthdayNotiStyles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#ffccd7",
    borderBottomColor: "#ccc",
  },
  leftIconContainer: {
    marginRight: scale(10),
  },
  titleContainerStyle: {
    marginHorizontal: '3%',
  }, titleStyle: {
    color: Colors.BLACK,
    fontSize: moderateScale(12, 1.2),
    fontWeight: "bold",
  },
  subTitleContainerStyle: {
    marginHorizontal: '3%'
  }, subTitleStyle: {
    color: Colors.BLACK
  },
});

const iconSize = moderateScale(45);
const iconColor = '#ff460f';

export {
  BirthdayNotiStyles,
  iconSize,
  iconColor,
};