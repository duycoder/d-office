/**
 * @description: màn hình người tham gia xử lý
 * @author: duynn
 * @since: 29/05/2018
 */

'use strict'
import React, { Component } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/workflow/WorkflowAction';

//lib
import { List, ListItem } from 'react-native-elements';
import {
    ListItem as NbListItem, Text as NbText,
    Right, Left, Title, Body, Radio, CheckBox
} from 'native-base';
import * as util from 'lodash';
import { Colors } from '../../../common/SystemConstant';

class WorkflowStreamJoinProcessUsers extends Component {
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
            joinProcessUsers: this.props.joinProcessUsers
        }
    }

    onSelectUser(userId) {
        this.props.updateProcessUsers(userId, false);

        this.setState({
            joinProcessUsers: this.props.joinProcessUsers
        });
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
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.toggle()}>
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

                <View style={styles.body}>
                    {
                        this.state.users.map((item, index) => (
                            <NbListItem key={item.ID} onPress={() => this.onSelectUser(item.ID)}>
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
                                        color={Colors.RED_PANTONE_186C} />
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
        joinProcessUsers: state.workflowState.joinProcessUsers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProcessUsers: (userId, isMainProcess) => dispatch(workflowAction.updateProcessUsers(userId, isMainProcess))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowStreamJoinProcessUsers);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {

    },
    titleContainer: {
    },
    listItemContainer: {
        height: 60,
        backgroundColor: '#FF0033',
        justifyContent: 'center'
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#fff'
    },
    body: {

    }
});
