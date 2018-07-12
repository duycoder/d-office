/**
 * @description: màn hình giao việc cho người tham gia xử lý
 * @author: duynn
 * @since: 31/05/2018
 */
import React, { Component } from 'react';
import {
    Animated, TouchableOpacity, Image,
    View, Text as RnText, FlatList, StyleSheet,
    TouchableHighlight
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/task/TaskAction'

//lib
import {
    Container, Content, List as NbList, ListItem as NbListItem,
    Left, Title, Text as NbText, Body, Right, Radio,
    CheckBox
} from 'native-base';
import {
    ListItem
} from 'react-native-elements';
import * as util from 'lodash';

//utilities
import { Colors } from '../../../common/SystemConstant'

//style
import {verticalScale} from '../../../assets/styles/ScaleIndicator';

class AssignTaskJoinProcessUsers extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');

        this.state = {
            title: props.title,
            data: props.data,

            expanded: true,
            rowItemHeight: verticalScale(70),
            heightAnimation: new Animated.Value(verticalScale(70) * (props.data.length > 0 ? (props.data.length + 1) : 1)),
            rotateAnimation: new Animated.Value(0),

            joinProcessUsers: props.joinProcessUsers
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle = () => {
        const multiplier = this.state.data.length > 0 ? (this.state.data.length + 1) : 1;

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

    onSelectUser(userId) {
        this.props.updateTaskProcessors(userId, false);

        this.setState({
            joinProcessUsers: this.props.joinProcessUsers
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
                    <TouchableHighlight onPress={this.toggle}>
                        <ListItem
                            containerStyle={styles.listItemContainer}
                            hideChevron={this.state.data.length <= 0}
                            title={util.toUpper(this.state.title)}
                            titleStyle={styles.listItemTitle}
                            rightIcon={
                                <Animated.Image source={this.icon} style={iconRotationStyle} />
                            }
                        />
                    </TouchableHighlight>
                </View>

                <View style={styles.body}>
                    {
                        this.state.data.map((item, index) => (
                            <NbListItem
                                key={item.ID}
                                style={styles.listItemRow}
                                onPress={() => this.onSelectUser(item.ID)}>
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
                                    <CheckBox color={Colors.RED_PANTONE_186C}
                                        checked={this.state.joinProcessUsers.indexOf(item.ID) > -1}
                                        onPress={() => this.onSelectUser(item.ID)} />
                                </Right>
                            </NbListItem>
                        ))
                    }
                </View>
            </Animated.View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
        joinProcessUsers: state.taskState.joinProcessUsers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTaskProcessors: (userId, isMainProcess) => dispatch(taskAction.updateTaskProcessors(userId, isMainProcess))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignTaskJoinProcessUsers);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {

    },
    titleContainer: {
    },
    listItemRow: {
        height: verticalScale(70)
    },
    listItemContainer: {
        height: verticalScale(70),
        backgroundColor: '#FF0033',
        justifyContent: 'center'
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#fff'
    },
    body: {
        overflow: 'scroll'
    }
});