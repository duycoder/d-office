import React from 'react';
import {
  View, Text
} from 'react-native';
import { ColumnedItemStyle } from '../../assets/styles';

class ColumnedListItem extends React.Component {
  static defaultProps = {
    isRender: true,
    leftText: '',
    rightText: '',
    customContainer: {},
    customLeftContainer: {},
    customRightContainer: {},
    customLeftText: {},
    customRightText: {},
  }
  render() {
    const {
      isRender,
      leftText, rightText,
      customContainer, customLeftContainer, customLeftText, customRightContainer, customRightText,
    } = this.props;
    if (isRender) {
      return (
        <View style={[ColumnedItemStyle.container, customContainer]}>
          <View style={[ColumnedItemStyle.leftContainer, customLeftContainer]}>
            <Text style={[ColumnedItemStyle.leftText, customLeftText]}>{leftText}</Text>
          </View>
          <View style={[ColumnedItemStyle.rightContainer, customRightContainer]}>
            <Text style={[ColumnedItemStyle.rightText, customRightText]}>{rightText}</Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

export default ColumnedListItem;