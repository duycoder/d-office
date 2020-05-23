import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { moderateScale } from '../../assets/styles/ScaleIndicator';

export default class GoBackButton extends Component {
  static defaultProps = {
    buttonStyle: '50%'
  }
  render() {
    const { buttonStyle, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={{ width: buttonStyle }}>
        <Icon name='ios-arrow-back' size={moderateScale(27, 0.79)} color={COMMON_COLOR.WHITE} type='ionicon' />
      </TouchableOpacity>
    );
  }
}