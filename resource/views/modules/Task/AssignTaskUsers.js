/*
	@description: màn hình giao việc cho nhân viên trong phòng
	@author: duynn
	@since: 17/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { View } from 'react-native';

//native-base
import {
	Text as NBText, Title,
	Left, Right, CheckBox,
	List as NBList, ListItem as NBListItem, Radio
} from 'native-base';

//lib
import { connect } from 'react-redux';
import renderIf from 'render-if';

import * as taskAction from '../../../redux/modules/CongViec/Action';

class AssignTaskUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isMainProcess: props.isMainProcess,
			userId: this.props.userInfo.ID,
			listUsers: props.listUsers,
			mainProcessUser: this.props.mainProcessUser,
			joinProcessUsers: this.props.joinProcessUsers
		}
	}

	onSelectProcessor(userId, isMainProcess) {
		this.props.updateTaskProcessors(userId, isMainProcess);

		this.setState({
			mainProcessUser: this.props.mainProcessUser,
			joinProcessUsers: this.props.joinProcessUsers
		});
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<NBList>
					{
						this.state.listUsers.map((item, index) => (
							<NBListItem key={index} onPress={() => this.onSelectProcessor(item.ID, this.state.isMainProcess)}>
								<Left>
									<Title>
										<NBText>
											{item.HOTEN}
										</NBText>
									</Title>
								</Left>
								<Right>
									{
										renderIf(this.state.isMainProcess)(
											<Radio selected={this.props.mainProcessUser == item.ID}
												color={'#FF6600'}
												onPress={() => this.onSelectProcessor(item.ID, this.state.isMainProcess)} />
										)
									}

									{
										renderIf(!this.state.isMainProcess)(
											<CheckBox checked={this.state.joinProcessUsers.indexOf(item.ID) > - 1}
												color={'#FF6600'}
												onPress={() => this.onSelectProcessor(item.ID, this.state.isMainProcess)} />
										)
									}
								</Right>
							</NBListItem>
						))
					}
				</NBList>
			</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AssignTaskUsers)

