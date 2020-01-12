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
import * as taskAction from '../../../redux/modules/CongViec/Action';

//lib
import {
    Container, Content, List as NbList, ListItem as NbListItem,
    Left, Title, Text as NbText, Body, Right, Radio,
    CheckBox,
    Toast
} from 'native-base';
import {
    ListItem
} from 'react-native-elements';
import * as util from 'lodash';

//utilities
import { Colors } from '../../../common/SystemConstant'

//style
import { verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';

class AssignTaskJoinProcessUsers extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');

        this.state = {
            title: props.title,
            data: props.data,

            expanded: true,
            rowItemHeight: verticalScale(70),
            heightAnimation: new Animated.Value(verticalScale(70) * (props.data.filter(x => x.ID !== this.props.mainProcessUser).length > 0 ? (props.data.filter(x => x.ID !== this.props.mainProcessUser).length + 1) : 1)),
            rotateAnimation: new Animated.Value(0),

            joinProcessUsers: props.joinProcessUsers,
            mainProcessUser: props.mainProcessUser
        };

        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { mainProcessUser, joinProcessUsers, data } = this.state;

        if (nextProps.mainProcessUser !== mainProcessUser) {
            // for heightAnimation
            const newUsersLength = data.filter(x => x.ID !== nextProps.mainProcessUser).length;
            const heightFactor = newUsersLength > 0 ? newUsersLength + 1 : 1;
            // for joinUsers
            if (joinProcessUsers.indexOf(nextProps.mainProcessUser) > -1 && this.props.joinProcessUsers.indexOf(nextProps.mainProcessUser) > -1) {
                this.props.updateTaskProcessors(nextProps.mainProcessUser, false);
            }

            this.setState({
                mainProcessUser: nextProps.mainProcessUser,
                heightAnimation: new Animated.Value(verticalScale(70) * heightFactor),
                joinProcessUsers: this.props.joinProcessUsers
            });
        }
    }

    toggle = () => {
        const filterUsers = this.state.data.filter(x => x.ID !== this.state.mainProcessUser);
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

    onSelectUser(userId) {
        if (this.props.mainProcessUser === 0) {
            Toast.show({
                text: 'Vui lòng chọn người xử lý chính',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        }
        this.props.updateTaskProcessors(userId, false);

        this.setState({
            joinProcessUsers: this.props.joinProcessUsers
        });
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
                <View style={styles.titleContainer} onLayout={this.setMinHeight} >
                    <TouchableOpacity onPress={this.toggle}>
                        <ListItem
                            containerStyle={styles.listItemContainer}
                            hideChevron={this.state.data.filter(x => x.ID !== this.state.mainProcessUser).length <= 0}
                            title={util.toUpper(this.state.title)}
                            titleStyle={styles.listItemTitle}
                            rightIcon={
                                <Animated.Image source={this.icon} style={iconRotationStyle} />
                            }
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.body} onPress={this.setMaxHeight}>
                    {
                        this.state.data.filter(x => x.ID !== this.state.mainProcessUser).map((item, index) => (
                            <NbListItem
                                key={item.ID}
                                style={{ height: this.state.rowItemHeight }}
                                onPress={() => this.onSelectUser(item.ID)}>
                                <Left>
                                    <Title>
                                        <NbText style={styles.listItemMinorTitle}>
                                            {item.HOTEN}
                                        </NbText>
                                    </Title>
                                </Left>

                                <Body>
                                    <NbText style={styles.listItemMinorTitle}>
                                        {item.ChucVu}
                                    </NbText>
                                </Body>

                                <Right>
                                    <CheckBox
                                        style={styles.checkBoxStyle}
                                        color={Colors.LITE_BLUE}
                                        checked={this.state.joinProcessUsers.indexOf(item.ID) > -1}
                                        onPress={() => this.onSelectUser(item.ID)}
                                    />
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
        joinProcessUsers: state.taskState.joinProcessUsers,
        mainProcessUser: state.taskState.mainProcessUser,
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
        backgroundColor: Colors.LITE_BLUE,
        justifyContent: 'center'
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: moderateScale(15, 0.86),
    }, listItemMinorTitle: {
        fontSize: moderateScale(15, 0.82),
    }, checkBoxStyle: {
        width: moderateScale(18, 1.12),
        height: moderateScale(18, 1.12),
        borderRadius: moderateScale(9, 1.12),
    },
    body: {
        overflow: 'scroll'
    }
});