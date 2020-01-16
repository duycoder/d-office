import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from "./ScaleIndicator";
import { Colors } from '../../common/SystemConstant';
import { pickerFormat } from '../../common/Utilities';

const DatePickerCustomStyle = StyleSheet.create({
  containerStyle: {
    width: '100%',
    alignSelf: 'center',
    marginTop: moderateScale(26, 0.87),
  },
});

const InputCreateStyle = StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(17.5, 0.85),
  },
  label: {
    fontSize: moderateScale(15, 0.86),
  }, labelMust: {
    color: Colors.RED,
  },
  input: {
    fontSize: moderateScale(15, 0.96),
    height: moderateScale(46, 1.02),
    lineHeight: moderateScale(15, 0.98),
    top: moderateScale(3),
  }, textarea: {
    width: '100%',
    marginTop: verticalScale(20),
  }
});

const PickerCreateStyle = StyleSheet.create({
  container: {
    marginRight: verticalScale(18)
  },
  picker: {
    width: pickerFormat(),
    justifyContent: 'space-around'
  },
});

const CustomStylesDatepicker = {
  dateIcon: {
    position: 'absolute',
    left: 0,
    top: 4,
    marginLeft: 0,
    width: moderateScale(29, 0.96),
    height: moderateScale(29, 0.96),
  },
  dateInput: {
    marginLeft: scale(36),
    height: moderateScale(37, 1.07),
  },
  dateTouchBody: {
    height: moderateScale(37, 1.07),
  },
  dateText: {
    fontSize: moderateScale(14, 1.22),
  },
  placeholderText: {
    fontSize: moderateScale(14, 1.22),
  },
  btnTextText: {
    fontSize: moderateScale(15.5, 0.78),
  },
};

export {
  DatePickerCustomStyle,
  InputCreateStyle,
  PickerCreateStyle,
  CustomStylesDatepicker,
};