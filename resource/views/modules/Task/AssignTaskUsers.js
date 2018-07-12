/*
	@description: màn hình giao việc cho nhân viên trong phòng
	@author: duynn
	@since: 17/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
    ActivityIndicator, View, Text, Modal,
    FlatList, TouchableOpacity, Image,
    StyleSheet
} from 'react-native';

//constant
import {
    API_URL, HEADER_COLOR
} from '../../../common/SystemConstant';

//native-base
import {
    Button, Icon as NBIcon, Text as NBText, Item, Input, Title,
    Container, Header, Content, Left, Right, Body, CheckBox,
    Tab, Tabs, TabHeading, ScrollableTab, List as NBList, ListItem as NBListItem, Radio
} from 'native-base';

//react-native-elements
import { ListItem, Icon } from 'react-native-elements';
//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { MenuStyle, MenuOptionStyle } from '../../../assets/styles/MenuPopUpStyle';
import { TabStyle } from '../../../assets/styles/TabStyle';

import { dataLoading } from '../../../common/Effect';
import { asyncDelay, unAuthorizePage, openSideBar } from '../../../common/Utilities';

//lib
import { connect } from 'react-redux';
import renderIf from 'render-if';
import * as util from 'lodash';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

import * as taskAction from '../../../redux/modules/task/TaskAction'

class AssignTaskUsers extends Component {
	constructor(props){
		super(props);
		this.state = {
			isMainProcess: props.isMainProcess,
			userId: this.props.userInfo.ID,
			listUsers: props.listUsers,
			mainProcessUser: this.props.mainProcessUser,
        	joinProcessUsers: this.props.joinProcessUsers
		}
	}
	
	onSelectProcessor(userId, isMainProcess){
		this.props.updateTaskProcessors(userId, isMainProcess);

		this.setState({
			mainProcessUser: this.props.mainProcessUser,
        	joinProcessUsers: this.props.joinProcessUsers
		});
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<NBList>
					{
					this.state.listUsers.map((item, index) => (
						<NBListItem key={index} onPress={ () => this.onSelectProcessor(item.ID, this.state.isMainProcess) }>
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
										onPress={() => this.onSelectProcessor(item.ID, this.state.isMainProcess)}/>
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

