import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../../common/SystemConstant';

export default class GoBackButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={{ width: '50%' }}>
        <Icon name='ios-arrow-back' size={30} color={Colors.WHITE} type='ionicon' />
      </TouchableOpacity>
    );
  }
}