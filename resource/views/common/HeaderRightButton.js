import React from 'react';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { moderateScale } from '../../assets/styles/ScaleIndicator';
import { COMMON_COLOR } from '../../common/SystemConstant';

class HeaderRightButton extends React.Component {
  static defaultProps = {
    iconName: 'md-send',
    iconType: 'ionicon',
    btnStyle: {},
    btnDisabled: false,
  }
  render() {
    const {
      iconName, iconType,
      onPress, btnStyle, btnDisabled
    } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={btnStyle} disabled={btnDisabled}>
        <Icon
          name={iconName} type={iconType}
          size={moderateScale(27, 0.79)}
          color={COMMON_COLOR.WHITE}
        />
      </TouchableOpacity>
    );
  }
}

export default HeaderRightButton;