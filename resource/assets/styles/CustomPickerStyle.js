import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from "./ScaleIndicator";
import { Colors } from '../../common/SystemConstant';

const CustomPickerStyle = StyleSheet.create({
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  placeholder: {
    fontSize: moderateScale(14.3, 0.86),
    color: '#ccc'
  },
  valueName: {
    fontSize: moderateScale(14.3, 0.86),
    color: Colors.BLACK
  },
  clearIcon: {
    marginTop: 0,
    alignSelf: 'center',
    color: Colors.RED_PANTONE_186C
  }
});

export {
  CustomPickerStyle,
}