import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { SideBarStyle } from '../../../assets/styles/SideBarStyle';
import SideBarIcon from '../../../common/Icons';

class HotPickButton extends React.Component {
  static defaultProps = {
    notifyCount: 0,
    title: '',
    actionCode: '',
  }

  render() {
    const { notifyCount, title, changeScreen, actionCode } = this.props;
    return (
      <TouchableOpacity onPress={changeScreen} style={SideBarStyle.shortcutBoxStyle}>
        <SideBarIcon
          actionCode={actionCode}
          customIconContainerStyle={SideBarStyle.customIconContainerStyle}
          isHotPick
          notifyCount={notifyCount}
        />
        <Text style={SideBarStyle.shortcutBoxTextStyle}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

export default HotPickButton;