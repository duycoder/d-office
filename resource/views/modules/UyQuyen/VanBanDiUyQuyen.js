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

//lib
import { List, ListItem } from 'react-native-elements';
import {
    ListItem as NbListItem, Text as NbText,
    Right, Left, Title, Body, Radio, CheckBox, Toast
} from 'native-base';
import * as util from 'lodash';
import { Colors } from '../../../common/SystemConstant';

//reducer
import * as action from '../../../redux/modules/UyQuyen/Action';

class VanBanDiUyQuyen extends Component {
    constructor(props) {
        super(props);
        this.icon = require('../../../assets/images/arrow-white.png');
        this.state = {
            title: props.title,
            code: props.code,
            selected: props.selected,
            categories: props.categories,
            expanded: true,
            rowItemHeight: 60,
            heightAnimation: new Animated.Value(60 * (props.categories.length + 1)),
            rotateAnimation: new Animated.Value(0),
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    onCheck(itemId) {
        let value = util.toInteger(itemId);
        this.setState({
            selected: this.state.selected.indexOf(value) > -1 ?
                this.state.selected.filter(x => x != value) : this.state.selected.concat([value])
        }, () => {
            if (this.state.code === 'VANBANDI_DOUUTIEN') {
                this.props.selectVanBanDiDoUuTien(value);
            }
            else if (this.state.code === 'VANBANDI_DOQUANTRONG') {
                this.props.selectVanBanDiDoQuanTrong(value);
            }
            else if (this.state.code === 'VANBANDI_LINHVUCVANBAN') {
                this.props.selectVanBanDiLinhVucVanBan(value);
            }
            else {
                this.props.selectVanBanDiLoaiVanBan(value);
            }
        })
    }

    toggle = () => {
        const filterCategories = this.state.categories;
        const multiplier = filterCategories.length > 0 ? (filterCategories.length + 1) : 1;

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
                            hideChevron={this.state.categories.length <= 0}
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
                        this.state.categories.map((item, index) => (
                            <NbListItem key={item.Value} onPress={() => this.onCheck(item.Value)} style={{ height: this.state.rowItemHeight }}>
                                <Body>
                                    <NbText>
                                        {item.Text}
                                    </NbText>
                                </Body>

                                <Right>
                                    <CheckBox onPress={() => this.onCheck(item.Value)} checked={this.state.selected.indexOf(util.toInteger(item.Value)) > -1}/>
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
        groupVanBanDiDoQuanTrong: state.authorizeState.groupVanBanDiDoQuanTrong,
        groupVanBanDiDoUuTien: state.authorizeState.groupVanBanDiDoUuTien,
        groupVanBanDiLinhVucVanBan: state.authorizeState.groupVanBanDiLinhVucVanBan,
        groupVanBanDiLoaiVanBan: state.authorizeState.groupVanBanDiLoaiVanBan
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectVanBanDiDoUuTien: (itemId) => dispatch(action.selectVanBanDiDoUuTien(itemId)),
        selectVanBanDiDoQuanTrong: (itemId) => dispatch(action.selectVanBanDiDoQuanTrong(itemId)),
        selectVanBanDiLinhVucVanBan: (itemId) => dispatch(action.selectVanBanDiLinhVucVanBan(itemId)),
        selectVanBanDiLoaiVanBan: (itemId) => dispatch(action.selectVanBanDiLoaiVanBan(itemId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VanBanDiUyQuyen);

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
