/**
 * @description: hiển thị chức năng thành dạng lưới
 * @author: annv
 * @since: /08/2019
 */
'use strict';
import React, { Component } from 'react';
import {
  View, Text
} from 'react-native';

//styles
import { GridPanelStyle } from '../../assets/styles/GridPanelStyle';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';

import * as util from 'lodash';

export default class GridPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title ? util.capitalize(props.title) : "",
    };
  }

  render() {
    return (
      <View style={GridPanelStyle.container}>
        <View style={GridPanelStyle.titleContainer}>
          <Text style={GridPanelStyle.listItemTitle}>{this.state.title}</Text>
        </View>
        <View style={SideBarStyle.normalBoxContainer}>
          {this.props.children}
        </View>
      </View>
    );
  }
}