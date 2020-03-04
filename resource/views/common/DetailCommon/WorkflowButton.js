import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ButtonGroupStyle } from '../../../assets/styles';

export default class WorkflowButton extends React.Component {
  static defaultProps = {
    btnText: '',
  }
  render() {
    const { btnText, onPress } = this.props;
    return (
      <TouchableOpacity style={ButtonGroupStyle.button} onPress={onPress}>
        <Text style={ButtonGroupStyle.buttonText}>{btnText}</Text>
      </TouchableOpacity>
    );
  }
}