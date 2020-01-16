/**
 * @description: màn hình người xử lý chính
 * @author: duynn
 * @since: 29/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';

//lib
import { List, ListItem, Icon } from 'react-native-elements';
import {
    ListItem as NbListItem, Text as NbText,
    Left, Right, Title, Body, Radio, CheckBox
} from 'native-base';
import * as util from 'lodash';

//utilities
import { WORKFLOW_PROCESS_TYPE, Colors, customWorkflowListHeight } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { GroupListStyle } from '../../../assets/styles';

class WorkflowStreamMainProcessUsers extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');
        this.state = {
            title: props.title,
            users: props.users,
            flowData: props.flowData,

            expanded: true,
            rowItemHeight: customWorkflowListHeight,
            heightAnimation: new Animated.Value(customWorkflowListHeight * (props.users.length > 0 ? (props.users.length + 1) : 1)),
            rotateAnimation: new Animated.Value(0),
            iconName: 'ios-arrow-up',
        }
    }

    onSelectUser(userId) {
        this.props.updateProcessUsers(userId, true);
        // if has both main and join, change join
        if (this.state.flowData.HasUserExecute && this.state.flowData.HasUserJoinExecute) {
            if (this.props.joinProcessUsers.indexOf(userId) > -1) {
                this.props.updateProcessUsers(userId, false);
            }
        }
    }

    toggle = () => {
        const multiplier = this.state.users.length > 0 ? (this.state.users.length + 1) : 1;

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
                <View style={GroupListStyle.titleContainer} onLayout={this.setMinHeight}>
                    <TouchableOpacity onPress={this.toggle}>
                        <ListItem
                            containerStyle={GroupListStyle.listItemContainer}
                            hideChevron={this.state.users.length <= 0}
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
                        this.state.users.map((item, index) => (
                            <NbListItem key={item.ID} onPress={() => this.onSelectUser(item.ID)}
                                style={{ height: this.state.rowItemHeight }}>
                                <Left>
                                    <Title>
                                        <NbText>
                                            {item.HOTEN}
                                        </NbText>
                                    </Title>
                                </Left>

                                <Body>
                                    <Title>
                                        <NbText>
                                            {item.ChucVu}
                                        </NbText>
                                    </Title>
                                </Body>

                                <Right>
                                    <CheckBox
                                        onPress={() => this.onSelectUser(item.ID)}
                                        checked={(this.props.mainProcessUsers == item.ID)}
                                        style={{ alignSelf: "center" }}
                                    />
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
        mainProcessUsers: state.workflowState.mainProcessUser,
        joinProcessUsers: state.workflowState.joinProcessUsers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProcessUsers: (userId, isMainProcess) => dispatch(workflowAction.updateProcessUsers(userId, isMainProcess))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowStreamMainProcessUsers);
