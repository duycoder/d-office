/**
 * @description: màn hình giao việc cho người xử lý chính
 * @author: duynn
 * @since: 31/05/2018
 */
import React, { Component } from 'react';
import {
    Animated, TouchableOpacity, View
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/CongViec/Action';

//utilities
import { Colors, customWorkflowListHeight } from '../../../common/SystemConstant';

//lib
import {
    ListItem as NbListItem,
    Left, Title, Text as NbText, Body, Right, CheckBox
} from 'native-base';
import {
    ListItem, Icon
} from 'react-native-elements';
import * as util from 'lodash';

//style
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { GroupListStyle } from '../../../assets/styles';

class AssignTaskMainProcessUsrs extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');

        this.state = {
            title: props.title,
            data: props.data,

            expanded: true,
            rowItemHeight: customWorkflowListHeight,
            heightAnimation: new Animated.Value(customWorkflowListHeight * (props.data.length > 0 ? (props.data.length + 1) : 1)),
            rotateAnimation: new Animated.Value(0),
            iconName: 'ios-arrow-up',
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

    onSelectUser(userId) {
        this.props.updateTaskProcessors(userId, true);
        if (this.props.joinProcessUsers.indexOf(userId) > -1) {
            this.props.updateTaskProcessors(userId, false);
        }
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


        return (
            <Animated.View style={[GroupListStyle.body, { height: this.state.heightAnimation }]}>
                <View style={GroupListStyle.titleContainer} >
                    <TouchableOpacity onPress={this.toggle} onLayout={this.setMinHeight}>
                        <ListItem
                            containerStyle={GroupListStyle.listItemContainer}
                            hideChevron={this.state.data.length <= 0}
                            title={util.toUpper(this.state.title)}
                            titleStyle={GroupListStyle.listItemTitle}
                            rightIcon={
                                <Icon name={this.state.iconName} type='ionicon' size={moderateScale(26, 0.73)} color='#fff' />
                            }
                        />
                    </TouchableOpacity>
                </View>

                <View style={GroupListStyle.container} onLayout={this.setMaxHeight}>
                    {
                        this.state.data.map((item) => (
                            <NbListItem
                                key={item.ID} style={{ height: this.state.rowItemHeight }}
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
                                    <CheckBox
                                        color={Colors.LITE_BLUE}
                                        checked={this.props.mainProcessUser == item.ID}
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
        mainProcessUser: state.taskState.mainProcessUser,
        joinProcessUsers: state.taskState.joinProcessUsers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTaskProcessors: (userId, isMainProcess) => dispatch(taskAction.updateTaskProcessors(userId, isMainProcess))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignTaskMainProcessUsrs);
