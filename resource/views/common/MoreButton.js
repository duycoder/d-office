import React from 'react';
import { Button } from 'native-base';
import { Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { indicatorResponsive } from '../../assets/styles/ScaleIndicator';
import { MoreButtonStyle } from '../../assets/styles';

class MoreButton extends React.Component {
  static defaultProps = {
    isTrigger: false,
    isLoading: false,
  }
  render() {
    const { isTrigger, loadmoreFunc, isLoading } = this.props;
    let bodyContent = null;
    if (isLoading) {
      bodyContent = <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
    }
    else if (isTrigger) {
      bodyContent = (
        <Button full style={MoreButtonStyle.button} onPress={() => loadmoreFunc()}>
          <Text style={MoreButtonStyle.buttonText}>TẢI THÊM</Text>
        </Button>
      );
    }
    return bodyContent;
  }
}

export default MoreButton;