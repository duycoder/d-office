import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from "./ScaleIndicator";
import { Colors } from '../../common/SystemConstant';


const DatePickerCustomStyle = StyleSheet.create({
  containerStyle: {
    width: '100%',
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
});

export {
  DatePickerCustomStyle,
};