import React from 'react';
import { View } from 'react-native';
import { Item, Label, Button, Text, Icon } from 'native-base';
import { CustomPickerStyle, InputCreateStyle } from '../../assets/styles';

class CustomPickerButton extends React.Component {
  static defaultProps = {
    isRender: true,
    labelText: '',
    valueId: 0,
    valueName: '',
    placeholderText: '',
  }
  render() {
    const {
      isRender, labelText, placeholderText,
      valueId, valueName,
      pickFunc, clearFunc
    } = this.props;

    const isValueNameValid = !!valueName;

    if (isRender) {
      return (
        <Item stackedLabel style={InputCreateStyle.container}>
          <Label style={InputCreateStyle.label}>{labelText}</Label>
          <View style={CustomPickerStyle.inputGroup}>
            <Button transparent style={{ width: isValueNameValid ? '100%' : '90%', flexShrink: 1 }} onPress={pickFunc}>
              {
                isValueNameValid
                  ? <Text style={CustomPickerStyle.valueName}>{valueName}</Text>
                  : <Text style={CustomPickerStyle.placeholder}>{placeholderText}</Text>
              }
            </Button>
            {
              isValueNameValid && <Button transparent onPress={clearFunc}>
                <Icon name="ios-close-circle" style={CustomPickerStyle.clearIcon} />
              </Button>
            }
          </View>
        </Item>
      );
    }
    return null;
  }
}

export default CustomPickerButton;