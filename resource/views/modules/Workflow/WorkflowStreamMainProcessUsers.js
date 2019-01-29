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
import { List, ListItem } from 'react-native-elements';
import {
    ListItem as NbListItem, Text as NbText,
    Left, Right, Title, Body, Radio, CheckBox
} from 'native-base';
import * as util from 'lodash';

//utilities
import { WORKFLOW_PROCESS_TYPE, Colors } from '../../../common/SystemConstant';

class WorkflowStreamMainProcessUsers extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');
        this.state = {
            title: props.title,
            users: props.users,

            expanded: true,
            rowItemHeight: 60,
            heightAnimation: new Animated.Value(60 * (props.users.length > 0 ? (props.users.length + 1) : 1)),
            rotateAnimation: new Animated.Value(0),
        }
    }

    onSelectUser(userId) {
        this.props.updateProcessUsers(userId, true);
    }

    toggle = () => {
        const multiplier = this.state.users.length > 0 ? (this.state.users.length + 1) : 1;

        const initialHeight = this.state.expanded ? (this.state.rowItemHeight * multiplier) : this.state.rowItemHeight;
        const finalHeight = this.state.expanded ? this.state.rowItemHeight : (this.state.rowItemHeight * multiplier);


        const initialRotation = this.state.expanded ? 1 : 0;
        const finalRotation = this.state.expanded ? 0 : 1

        this.setState({
            expanded: !this.state.expanded
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
            <Animated.View style={[styles.container, { height: this.state.heightAnimation }]}>
                <View style={styles.titleContainer} onLayout={this.setMinHeight}>
                    <TouchableOpacity onPress={this.toggle}>
                        <ListItem
                            containerStyle={styles.listItemContainer}
                            hideChevron={this.state.users.length <= 0}
                            title={util.toUpper(this.state.title)}
                            titleStyle={styles.listItemTitle}
                            rightIcon={
                                <Animated.Image source={this.icon} style={iconRotationStyle} />
                            }
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.body} onLayout={this.setMaxHeight}>
                    {
                        this.state.users.map((item, index) => (
                            <NbListItem key={item.ID} onPress={() => this.onSelectUser(item.ID)} 
                                style={{height: this.state.rowItemHeight}}>
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
                                    <Radio onPress={() => this.onSelectUser(item.ID)} 
                                            selected={(this.props.mainProcessUsers == item.ID)} />
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
        mainProcessUsers: state.workflowState.mainProcessUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProcessUsers: (userId, isMainProcess) => dispatch(workflowAction.updateProcessUsers(userId, isMainProcess))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowStreamMainProcessUsers);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        overflow: 'scroll',
    },
    titleContainer: {
    },
    listItemContainer: {
        height: 60,
        backgroundColor: Colors.LITE_BLUE,
        justifyContent: 'center'
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#fff'
    },
    body: {

    }
});
