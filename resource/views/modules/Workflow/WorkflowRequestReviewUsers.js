/*
	@description: màn hình hiển thị danh sách người dùng cần review
	@author: duynn
	@since: 16/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
	Animated, View, Text, FlatList,
	TouchableOpacity, TouchableHighlight, StyleSheet, Image
} from 'react-native';

//native-base
import {
	Button, Icon as NBIcon, Text as NBText, Item, Input, Title,
	Container, Header, Content, Left, Right, Body, CheckBox,
	Tab, Tabs, TabHeading, ScrollableTab, ListItem as NBListItem
} from 'native-base';

import { List, ListItem, Icon } from 'react-native-elements';

//constant
import {
	API_URL, DEFAULT_PAGE_INDEX,
	DEFAULT_PAGE_SIZE, EMPTY_DATA_ICON_URI,
	EMPTY_STRING, EMTPY_DATA_MESSAGE,
	HEADER_COLOR, LOADER_COLOR, Colors
} from '../../../common/SystemConstant';

//effect
import { dataLoading, executeLoading } from '../../../common/Effect';

//util
import * as util from 'lodash';
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/workflow/WorkflowAction';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';

class WorkflowRequestReviewUsers extends Component {
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
			reviewUsers: this.props.reviewUsers,
		}
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		//số lượng người dùng trong 1 phòng ban
		//+1 bởi phải thêm chiều cao của tab phòng ban
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

	renderItem = ({ item }) => {
		return (
			<NBListItem onPress={() => this.onCheckUser(item.ID)} style={{ height: this.state.rowItemHeight }}>
				<Left>
					<Title>
						<NBText>
							{item.HOTEN}
						</NBText>
					</Title>
				</Left>

				<Body>
					<Title>
						<NBText>
							{item.ChucVu}
						</NBText>
					</Title>
				</Body>

				<Right>
					<CheckBox checked={this.state.reviewUsers.length > 0} color={Colors.RED_PANTONE_186C} />
				</Right>
			</NBListItem>
		);
	}

	onCheckUser(userId) {
		this.props.updateReviewUsers(userId);
		this.setState({
			reviewUsers: this.props.reviewUsers
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

		const listChildren = this.state.expanded ? <View style={styles.body}>
			{
				this.state.users.map((item, index) => (
					<NBListItem
						key={item.ID}
						onPress={() => this.onCheckUser(item.ID)} style={{ height: this.state.rowItemHeight }}>
						<Left>
							<Title>
								<NBText>
									{item.HOTEN}
								</NBText>
							</Title>
						</Left>

						<Body>
							<Title>
								<NBText>
									{item.ChucVu}
								</NBText>
							</Title>
						</Body>

						<Right>
							<CheckBox checked={(this.state.reviewUsers.indexOf(item.ID) > -1)} color={'#FF0033'} onPress={() => this.onCheckUser(item.ID)} />
						</Right>
					</NBListItem>
				))
			}
		</View> : null;

		return (
			<Animated.View style={[styles.container, { height: this.state.heightAnimation }]}>
				<View style={styles.titleContainer}>
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
				{listChildren}

			</Animated.View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		reviewUsers: state.workflowState.reviewUsers
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateReviewUsers: (userId) => dispatch(workflowAction.updateReviewUsers(userId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowRequestReviewUsers);


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
