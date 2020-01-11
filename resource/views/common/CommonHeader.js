import React from 'react';
import { Header, Left, Body, Right, Title, Subtitle } from 'native-base';
import { NativeBaseStyle } from '../../assets/styles';

class CommonHeader extends React.Component {
  static defaultProps = {
    hasHeader: false,
  }
  render() {
    const { hasHeader } = this.props;
    if (hasHeader) {

    }
    return null;
  }
}

export default CommonHeader;