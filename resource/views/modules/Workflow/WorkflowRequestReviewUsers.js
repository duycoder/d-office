/*
	@description: màn hình hiển thị danh sách người dùng cần review
	@author: duynn
	@since: 16/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { Animated, View, TouchableOpacity, StyleSheet } from 'react-native';

//native-base
import {
	Text as NBText, Title,
	Left, Right, Body, CheckBox,
	ListItem as NBListItem
} from 'native-base';

import { ListItem, Icon } from 'react-native-elements';

//constant
import { Colors } from '../../../common/SystemConstant';

//util
import util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';

import { moderateScale } from '../../../assets/styles/ScaleIndicator';

class WorkflowRequestReviewUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			users: props.users,
			expanded: true,
			rowItemHeight: 60,
			heightAnimation: new Animated.Value(60 * (props.users.length > 0 ? (props.users.length + 1) : 1)),
			rotateAnimation: new Animated.Value(0),
			reviewUsers: this.props.reviewUsers,
			iconName: 'ios-arrow-up',
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
			expanded: !this.state.expanded,
			iconName: this.state.expanded ? 'ios-arrow-down' : 'ios-arrow-up',
		});

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
					<CheckBox checked={this.state.reviewUsers.length > 0} color={Colors.LITE_BLUE} />
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
		const listChildren = this.state.expanded ? <View style={styles.body}>
			{
				this.state.users.map((item) => (
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
								<Icon name={this.state.iconName} type='ionicon' size={moderateScale(26, 0.73)} color='#fff' />
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
