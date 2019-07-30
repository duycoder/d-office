/**
 * @description: style cho màn hình gridpanel
 * @author: annv
 * @since: 07/30/2019
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';


export const GridPanelStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    overflow: 'scroll',
  }, titleContainer: {

  }, body: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    flexWrap: 'wrap',
    // flex: 1,
  },
  listItemContainer: {
    height: verticalScale(40),
    justifyContent: 'center',
    borderBottomColor: '#cccccc',
    backgroundColor: '#fff'
  }, listItemTitle: {
    fontWeight: 'bold',
    color: Colors.GRAY,
  }
});