import { StyleSheet } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { scale, moderateScale } from './ScaleIndicator';

const AuthorizeNotiStyle = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#EBDEF0",
    borderBottomColor: "#ccc",
  },
  leftIconContainer: {
    marginRight: scale(10),
  },
  titleContainerStyle: {
    marginHorizontal: '3%',
  }, titleStyle: {
    color: COMMON_COLOR.BLACK,
    fontSize: moderateScale(12, 1.2),
    fontWeight: "bold",
  },
  rightTitleContainerStyle: {
    flex: 0,
  }, rightTitleStyle: {
    textAlign: 'center',
    color: COMMON_COLOR.DARK_GRAY,
    fontSize: moderateScale(12, 0.9),
    fontStyle: 'italic',
  },
});

const iconSize = moderateScale(45);
const iconColor = '#8E44AD';

export {
  AuthorizeNotiStyle,
  iconSize,
  iconColor,
};