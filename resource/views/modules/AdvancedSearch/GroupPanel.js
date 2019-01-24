/**
 * @description: rewrite panel dung` cho search
 * @author: ant
 * @since: 24/01/2019
 */
'use strict';
import React, { Component } from 'react';
import {
  Animated, View, Text, StyleSheet,
  TouchableOpacity, Image
} from 'react-native';

//lib
import { ListItem, Icon as RneIcon } from 'react-native-elements';
//styles
import { PanelStyle } from '../../../assets/styles/PanelStyle';
import { SideBarStyle } from '../../../assets/styles/SideBarStyle';
import { doc_Default, work_Default, account_Default } from '../../../assets/styles/SideBarIcons';
import { verticalScale, scale, moderateScale } from '../../../assets/styles/ScaleIndicator';

export default class Panel extends Component {
  constructor(props) {
    super(props);

    let { title, type, children } = this.props;
    let defaultHeightAnimation = type === 1 ? verticalScale(60 * (children.length + 1)) : verticalScale(60);

    this.state = {
      title: title.toUpperCase(),
      expanded: type === 1 ? true : false,
      heightAnimation: new Animated.Value(defaultHeightAnimation),
    };
    this.setMaxHeight = this.setMaxHeight.bind(this);
    this.setMinHeight = this.setMinHeight.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  setMaxHeight = (event) => {
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    });
  }

  setMinHeight = (event) => {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
  }

  toggle() {
    const initialHeightValue = this.state.expanded ? (this.state.minHeight + this.state.maxHeight) : this.state.minHeight;
    const finalHeightValue = this.state.expanded ? this.state.minHeight : (this.state.minHeight + this.state.maxHeight);
    this.state.heightAnimation.setValue(initialHeightValue);

    this.setState({
      expanded: !this.state.expanded
    });

    Animated.spring(this.state.heightAnimation, {
      toValue: finalHeightValue,
      duration: 2000
    }).start();
  }

  render() {
    let titleRightIcon = this.state.expanded
      ? <RneIcon name='minus' type='font-awesome' />
      : <RneIcon name='plus' type='font-awesome' />;

    let iconName = 'user';
    switch (this.props.type) {
      case 1:
        iconName = 'user';
        break;
      case 2:
        iconName = 'file-text';
        break;
      case 3:
        iconName = 'bookmark';
        break;
      case 4:
        iconName = 'calendar';
        break;
      default:
        iconName = 'user';
        break;
    }
    let titleLeftIcon =
      <View style={{marginRight: scale(10)}}>
        <RneIcon name={iconName} type='font-awesome' />
      </View>;

    let listitemContainerBorder = this.state.expanded ? {borderBottomWidth: 0} : {borderBottomWidth: 1};

    return (
      <Animated.View style={[PanelStyle.container, { height: this.state.heightAnimation }]}>
        <View style={PanelStyle.titleContainer} onLayout={this.setMinHeight}>
          <TouchableOpacity onPress={this.toggle}>
            <ListItem
              containerStyle={[SideBarStyle.listItemContainer, listitemContainerBorder]}
              hidechevron={true}
              title={this.state.title}
              titleStyle={[SideBarStyle.listItemTitle, {fontSize: moderateScale(18,2)}]}
              rightIcon={titleRightIcon}
              leftIcon={titleLeftIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={PanelStyle.body} onLayout={this.setMaxHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}
