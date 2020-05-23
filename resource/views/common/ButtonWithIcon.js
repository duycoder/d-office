import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { moderateScale } from '../../assets/styles/ScaleIndicator';

export default class ButtonWithIcon extends React.Component {
  static defaultProps = {
    btnStyle: {},
    btnText: '',
    btnTextStyle: {},
    iconName: '',
    iconColor: COMMON_COLOR.WHITE,
    iconSize: moderateScale(12, 1.2),
  }
  
  render() {
    const { 
      btnText, btnStyle, btnTextStyle,
      iconName, iconSize, iconColor,
      onPress
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, btnStyle]}
      >
        <Icon name={iconName} color={iconColor} size={iconSize} type='material-community' />
        <Text style={[styles.buttonText, btnTextStyle]}>{btnText}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(5),
    backgroundColor: COMMON_COLOR.GREEN_PANTONE_364C,
  }, buttonText: {
    fontSize: moderateScale(10, 0.8),
    color: COMMON_COLOR.WHITE
  }
});
