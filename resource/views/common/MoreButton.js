import React from 'react';
import { Button } from 'native-base';
import { Text, ActivityIndicator } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { indicatorResponsive } from '../../assets/styles/ScaleIndicator';
import { MoreButtonStyle } from '../../assets/styles';

class MoreButton extends React.Component {
  static defaultProps = {
    isLoading: false,
    isTrigger: false,
    title: 'TẢI THÊM',
  }
  render() {
    const {
      isLoading, isTrigger,
      loadmoreFunc, 
      title,
    } = this.props;
    let bodyContent = null;
    if (isLoading) {
      bodyContent = <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
    }
    else if (isTrigger) {
      bodyContent = (
        <Button full style={MoreButtonStyle.button} onPress={() => loadmoreFunc()}>
          <Text style={MoreButtonStyle.buttonText}>{title}</Text>
        </Button>
      );
    }
    return bodyContent;
  }
}

export default MoreButton;