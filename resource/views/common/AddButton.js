import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { Fab } from 'native-base';
import { addBtnIconSize, AddButtonStyle } from '../../assets/styles/NativeBaseStyle';

class AddButton extends React.Component {
  static defaultProps = {
    hasPermission: true
  }
  render() {
    const { hasPermission, createFunc } = this.props;
    if (hasPermission) {
      return (
        <Fab
          active
          direction="up"
          containerStyle={{ marginRight: Platform.isPad ? 47 : 0 }}
          style={AddButtonStyle.button}
          position="bottomRight"
          onPress={() => createFunc()}>
          <Icon name="ios-add" type="ionicon" size={addBtnIconSize} color="#fff" />
        </Fab>
      );
    }
    return null;
  }
}

export default AddButton;