/**
 * @description: thành phần loading tiến độ
 * @author: duynn
 * @since: 06/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

import { scale, verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';
import { Colors } from '../../common/SystemConstant';

export default class ProgressBar extends Component {

  state = {
    widthAnimation: new Animated.Value(this.props.progress)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.progress != this.props.progress) {
      Animated.timing(this.state.widthAnimation, {
        toValue: this.props.progress,
        duration: this.props.duration
      }).start();
    }
  }

  render() {
    const widthInterpolate = this.state.widthAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    })

    const {
      height,
      borderWidth,
      borderColor,
      borderRadius,
      fillColor,
      barColor
    } = this.props;

    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.progressFrame, {
          borderColor,
          borderWidth,
          borderRadius
        }]}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: fillColor }]}>
            <Animated.View
              style={{
                width: widthInterpolate,
                height,
                backgroundColor: barColor,

              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: scale(20)
  }, progressFrame: {
    flex: 1,
    overflow: 'hidden'
  }
});

/**
 * @description: định nghĩa các thuộc tính mặc định
 */
ProgressBar.defaultProps = {
  height: verticalScale(20),
  borderRadius: 50,
  borderColor: Colors.LITE_BLUE,
  borderWidth: 1,
  fillColor: 'transparent',
  barColor: Colors.LITE_BLUE,
  duration: 3000
}