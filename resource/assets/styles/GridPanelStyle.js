/**
 * @description: style cho màn hình gridpanel
 * @author: annv
 * @since: 07/30/2019
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale, moderateScale } from './ScaleIndicator';
import { Colors } from '../../common/SystemConstant';


export const GridPanelStyle = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    overflow: 'scroll',
    marginHorizontal: moderateScale(12, 1.2),
    marginVertical: moderateScale(6, 1.2),
    borderRadius: 5,
    padding: moderateScale(12, 1.5)
  }, titleContainer: {
    marginBottom: moderateScale(10, 1.1)
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
    backgroundColor: Colors.LIGHT_GRAY_PASTEL
  }, listItemTitle: {
    fontWeight: 'bold',
    // color: '#595959'
  }
});