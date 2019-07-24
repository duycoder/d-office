import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

//constant
import { Colors } from '../../common/SystemConstant'
import { moderateScale } from './ScaleIndicator';

const optionsStyles = {
  optionsContainer: {
    // backgroundColor: 'green',
    // padding: 5,
    // marginTop: 15
  },
  optionsWrapper: {
    // backgroundColor: 'purple',
  },
  optionWrapper: {
    // backgroundColor: 'yellow',
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#6e6f70'
  },
  optionTouchable: {
    // underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    // color: 'brown',
    // fontSize: moderateScale(12, 1.2),
  },
};

const optionStyles = {
  // optionTouchable: {
  //   underlayColor: 'red',
  //   activeOpacity: 40,
  // },
  optionWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    padding: 15,
  },
  optionText: {
    // color: 'black',
    fontSize: moderateScale(12, 1.2),
  },
};

const menuProviderStyles ={
  menuProviderWrapper: {
    backgroundColor: 'black'
  }
}

export {
  optionsStyles,
  optionStyles,
  menuProviderStyles
}