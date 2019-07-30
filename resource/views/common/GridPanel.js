/**
 * @description: phần panel dropdown sử dụng animation
 * @author: duynn
 * @since: 05/05/2018
 */
'use strict';
import React, { Component } from 'react';
import {
  Animated, View, Text, StyleSheet,
  TouchableOpacity, Image
} from 'react-native';

//lib
import { ListItem } from 'react-native-elements';
//styles
import { GridPanelStyle } from '../../assets/styles/GridPanelStyle';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import { doc_Default, work_Default, account_Default } from '../../assets/styles/SideBarIcons';
import { verticalScale } from '../../assets/styles/ScaleIndicator';

import SideBar from './SideBar';
import SideBarIcon from '../../common/Icons';
import { Colors } from '../../common/SystemConstant';

export default class GridPanel extends Component {
  constructor(props) {
    super(props);
    this.icon = require('../../assets/images/arrow.png');

    this.state = {
      title: props.title ? props.title.toUpperCase() : "",
      expanded: props.title === 'CÔNG VIỆC' ? true : false,

      actionCode: props.actionCode,
      isParent: props.isParent
    };
  }

  render() {
    return (
      <View style={GridPanelStyle.container}>
        <View style={GridPanelStyle.titleContainer}>
          <ListItem
            containerStyle={GridPanelStyle.listItemContainer}
            hideChevron={true}
            title={this.state.title}
            titleStyle={GridPanelStyle.listItemTitle}
            leftIcon={
              <SideBarIcon actionCode={this.state.actionCode} isParent={this.state.isParent} iconSize={22} iconColor={Colors.GRAY} />
            }
          />
        </View>
        <View style={SideBarStyle.normalBoxContainer}>
          {this.props.children}
        </View>
      </View>
    );
  }
}