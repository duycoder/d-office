import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../../assets/styles/ScaleIndicator';
import { EMPTY_STRING } from '../../common/SystemConstant';

class BubbleText extends React.Component {
  static defaultProps = {
    leftText: EMPTY_STRING,
    rightText: EMPTY_STRING,
    customTextStyle: {},
    isRender: true,
  }
  render() {
    const { leftText, rightText, customTextStyle, isRender } = this.props;
    if (isRender) {
      return (
        <View style={styles.container}>
          <Text style={[styles.textContainer, customTextStyle]}>
            <Text style={styles.leftTextStyle}>
              {`${leftText}:`}
            </Text>
            <Text>
              {` ${rightText}`}
            </Text>
          </Text>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    padding: 8,
    marginRight: 5
  },
  textContainer: {
    fontSize: moderateScale(10, 0.8)
  }, leftTextStyle: {
    fontWeight: 'bold'
  }
});

export default BubbleText;
