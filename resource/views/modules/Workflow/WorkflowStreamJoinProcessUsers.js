/**
 * @description: màn hình người tham gia xử lý
 * @author: duynn
 * @since: 29/05/2018
 */

'use strict'
import React, { Component } from 'react';
import { Animated, View, TouchableOpacity } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';

//lib
import { ListItem, Icon } from 'react-native-elements';
import {
  ListItem as NbListItem, Text as NbText,
  Right, Left, Title, Body, CheckBox
} from 'native-base';
import * as util from 'lodash';
import { Colors, customWorkflowListHeight } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { GroupListStyle } from '../../../assets/styles';
import { showWarningToast } from '../../../common/Utilities';

class WorkflowStreamJoinProcessUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      users: props.users,
      flowData: props.flowData,

      expanded: true,
      rowItemHeight: customWorkflowListHeight,
      heightAnimation: new Animated.Value(customWorkflowListHeight * (props.users.filter(x => x.ID !== this.props.mainProcessUser).length > 0 ? (props.users.filter(x => x.ID !== this.props.mainProcessUser).length + 1) : 1)),
      rotateAnimation: new Animated.Value(0),
      joinProcessUsers: this.props.joinProcessUsers,
      mainProcessUser: this.props.mainProcessUser,
      iconName: 'ios-arrow-up',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mainProcessUser, joinProcessUsers, users } = this.state;

    if (nextProps.mainProcessUser !== mainProcessUser) {
      // for heightAnimation
      const newUsersLength = users.filter(x => x.ID !== nextProps.mainProcessUser).length;
      const heightFactor = newUsersLength > 0 ? newUsersLength + 1 : 1;
      // for joinUsers
      if (joinProcessUsers.indexOf(nextProps.mainProcessUser) > -1 && this.props.joinProcessUsers.indexOf(nextProps.mainProcessUser) > -1) {
        this.props.updateProcessUsers(nextProps.mainProcessUser, false);
      }

      this.setState({
        mainProcessUser: nextProps.mainProcessUser,
        heightAnimation: new Animated.Value(customWorkflowListHeight * heightFactor),
        joinProcessUsers: this.props.joinProcessUsers
      });
    }
  }

  onSelectUser(userId) {
    const { HasUserExecute, HasUserJoinExecute } = this.state.flowData;

    if (HasUserExecute && HasUserJoinExecute && this.props.mainProcessUser === 0) {
      showWarningToast('Vui lòng chọn người xử lý chính');
    } else {
      this.props.updateProcessUsers(userId, false);

      this.setState({
        joinProcessUsers: this.props.joinProcessUsers
      });
    }
  }

  toggle = () => {
    const filterUsers = this.state.users.filter(x => x.ID !== this.state.mainProcessUser);
    const multiplier = filterUsers.length > 0 ? (filterUsers.length + 1) : 1;

    const initialHeight = this.state.expanded ? (this.state.rowItemHeight * multiplier) : this.state.rowItemHeight;
    const finalHeight = this.state.expanded ? this.state.rowItemHeight : (this.state.rowItemHeight * multiplier);


    const initialRotation = this.state.expanded ? 1 : 0;
    const finalRotation = this.state.expanded ? 0 : 1

    this.setState({
      expanded: !this.state.expanded,
      iconName: this.state.expanded ? 'ios-arrow-down' : 'ios-arrow-up',
    })

    this.state.heightAnimation.setValue(initialHeight);
    this.state.rotateAnimation.setValue(initialRotation);

    Animated.spring(this.state.heightAnimation, {
      duration: 1000,
      toValue: finalHeight
    }).start();

    Animated.spring(this.state.rotateAnimation, {
      duration: 2000,
      toValue: finalRotation
    })
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


  render() {
    const interpolateRotation = this.state.rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });

    const iconRotationStyle = {
      transform: [
        {
          rotate: interpolateRotation
        }
      ]
    }

    return (
      <Animated.View style={[GroupListStyle.container, { height: this.state.heightAnimation }]}>
        <View style={GroupListStyle.titleContainer}>
          <TouchableOpacity onPress={this.toggle} onLayout={this.setMinHeight}>
            <ListItem
              containerStyle={GroupListStyle.listItemContainer}
              hideChevron={this.state.users.filter(x => x.ID !== this.state.mainProcessUser).length <= 0}
              title={util.toUpper(this.state.title)}
              titleStyle={GroupListStyle.listItemTitle}
              rightIcon={
                <Icon name={this.state.iconName} type='ionicon' size={moderateScale(26, 0.73)} color='#fff' />
              }
            />
          </TouchableOpacity>
        </View>

        <View style={GroupListStyle.body} onLayout={this.setMaxHeight}>
          {
            this.state.users.filter(x => x.ID !== this.state.mainProcessUser).map((item, index) => (
              <NbListItem key={item.ID} onPress={() => this.onSelectUser(item.ID)} style={{ height: this.state.rowItemHeight }}>
                <Left>
                  <Title>
                    <NbText>
                      {item.HOTEN}
                    </NbText>
                  </Title>
                </Left>

                <Body>
                  <NbText>
                    {item.ChucVu}
                  </NbText>
                </Body>

                <Right>
                  <CheckBox onPress={() => this.onSelectUser(item.ID)}
                    checked={(this.state.joinProcessUsers.indexOf(item.ID) > -1)}
                    color={Colors.LITE_BLUE} />
                </Right>
              </NbListItem>
            ))
          }
        </View>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    joinProcessUsers: state.workflowState.joinProcessUsers,
    mainProcessUser: state.workflowState.mainProcessUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProcessUsers: (userId, isMainProcess) => dispatch(workflowAction.updateProcessUsers(userId, isMainProcess))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowStreamJoinProcessUsers);
