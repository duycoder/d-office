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
import * as workflowAction from '../../../redux/modules/Workflow/Action';

//lib
import { List, ListItem } from 'react-native-elements';
import {
    ListItem as NbListItem, Text as NbText,
    Right, Left, Title, Body, Radio, CheckBox, Toast
} from 'native-base';
import * as util from 'lodash';
import { COMMON_COLOR } from '../../../common/SystemConstant';

//reducer
import * as action from '../../../redux/modules/UyQuyen/Action';

class DeptUyQuyen extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');
        this.state = {
            title: props.title,
            users: props.users,
            expanded: true,
            rowItemHeight: 60,
            heightAnimation: new Animated.Value(60 * (props.users.length + 1)),
            rotateAnimation: new Animated.Value(0),
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    onSelectUser(userId) {
        this.props.selectUser(userId);
    }

    toggle = () => {
        const filterUsers = this.state.users;
        const multiplier = filterUsers.length > 0 ? (filterUsers.length + 1) : 1;

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
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={this.toggle} onLayout={this.setMinHeight}>
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
                                    <Radio onPress={() => this.onSelectUser(item.ID)} selected={(item.ID == this.props.selectedUser)} />
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
        selectedUser: state.authorizeState.selectedUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectUser: (userId) => dispatch(action.selectUser(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeptUyQuyen);

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
        backgroundColor: COMMON_COLOR.LITE_BLUE,
        justifyContent: 'center'
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#fff'
    },
    body: {

    }
});
