/*
* @description: màn hình giao việc
* @author: duynn
* @since: 13/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
	ActivityIndicator, FlatList
} from 'react-native'
//lib
import {
	Container, Content, Segment, Button, Text, Icon, Item, Input,
	Header, Left, Body, Title, View, Tabs, Tab, TabHeading,
	Right, Toast
} from 'native-base';
import {
	Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/CongViec/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//utilities
import {
	API_URL, HEADER_COLOR, DEFAULT_PAGE_INDEX,
	EMPTY_STRING, LOADER_COLOR, LOADMORE_COLOR,
	TASK_PROCESS_TYPE, Colors
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import AssignTaskJoinProcessUsers from './AssignTaskJoinProcessUsers';
import AssignTaskMainProcessUsers from './AssignTaskMainProcessUsers';

class AssignTask extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,
			loading: false,
			taskId: props.coreNavParams.taskId,
			taskType: props.coreNavParams.taskType,
			subTaskId: props.extendsNavParams.subTaskId,
			executing: false,

			selectedSegmentIndex: 0,
			selectedTabIndex: 0,

			mainProcessPageIndex: DEFAULT_PAGE_INDEX,
			joinProcessPageIndex: DEFAULT_PAGE_INDEX,

			mainProcessFilterValue: EMPTY_STRING,
			joinProcessFilterValue: EMPTY_STRING,

			loadingMoreMainProcess: false,
			loadingMoreJoinProcess: false,
			searchingMainProcess: false,
			searchingJoinProcess: false,

			dataAssignTask: {},
			dataMainProcessUsers: [],
			dataJoinProcessUsers: [],
		}
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = async () => {
		this.setState({
			loading: true
		})

		const url = `${API_URL}/api/HscvCongViec/AssignTask/${this.state.taskId}/${this.state.subTaskId}/${this.state.userId}`;
		const result = await fetch(url);
		const resultJson = await result.json();

		console.log(url);

		this.setState({
			loading: false,
			dataAssignTask: resultJson,
			dataMainProcessUsers: resultJson.listEqualUsers || [],
			dataJoinProcessUsers: resultJson.listEqualUsers || []
		});
	}

	onChangeSegment(index) {
		this.setState({
			selectedSegmentIndex: index,
		});
		if (index == 0) {
			this.setState({
				dataMainProcessUsers: this.state.dataAssignTask.listEqualUsers || [],
				dataJoinProcessUsers: this.state.dataAssignTask.listEqualUsers || []
			})
		} else {
			this.setState({
				dataMainProcessUsers: this.state.dataAssignTask.listCrossUsers || [],
				dataJoinProcessUsers: this.state.dataAssignTask.listCrossUsers || []
			});
		}
	}


	onFilter = (isMainProcess) => {
		if (isMainProcess) {
			this.props.resetTaskProcessors(TASK_PROCESS_TYPE.MAIN_PROCESS);
		} else {
			this.props.resetTaskProcessors(TASK_PROCESS_TYPE.JOIN_PROCESS);
		}

		this.setState({
			searchingMainProcess: isMainProcess,
			mainProcessPageIndex: DEFAULT_PAGE_INDEX,
			searchingJoinProcess: !isMainProcess,
			joinProcessPageIndex: DEFAULT_PAGE_INDEX,
		}, () => this.filterData());
	}

	loadingMore = (isMainProcess) => {
		this.setState({
			loadingMoreMainProcess: isMainProcess,
			mainProcessPageIndex: (isMainProcess ? this.state.mainProcessPageIndex + 1 : this.state.mainProcessPageIndex),

			loadingMoreJoinProcess: !isMainProcess,
			joinProcessPageIndex: (!isMainProcess ? this.state.joinProcessPageIndex + 1 : this.state.joinProcessPageIndex)
		}, () => this.filterData());
	}

	filterData = async () => {
		const url = `${API_URL}/api/HscvCongViec/GetUserToAssignTask`;
		const headers = new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		});

		const body = JSON.stringify({
			userId: this.state.userId,
			isDeptAdd: (this.state.selectedSegmentIndex == 1),
			query: (this.state.searchingMainProcess || this.state.loadingMoreMainProcess) ? this.state.mainProcessFilterValue : this.state.joinProcessFilterValue,
			pageIndex: (this.state.searchingMainProcess || this.state.loadingMoreMainProcess) ? this.state.mainProcessPageIndex : this.state.joinProcessPageIndex
		});

		const result = await fetch(url, {
			method: 'POST',
			headers,
			body
		});

		const resultJson = await result.json();

		this.setState({
			dataMainProcessUsers: (this.state.searchingMainProcess) ? resultJson : (this.state.loadingMoreMainProcess ? [...this.state.dataMainProcessUsers, ...resultJson] : this.state.dataMainProcessUsers),
			dataJoinProcessUsers: (this.state.searchingJoinProcess) ? resultJson : (this.state.loadingMoreJoinProcess ? [...this.state.dataJoinProcessUsers, ...resultJson] : this.state.dataJoinProcessUsers),

			loadingMoreMainProcess: false,
			loadingMoreJoinProcess: false,
			searchingMainProcess: false,
			searchingJoinProcess: false
		})
	}


	componentDidMount = () => {
		// backHandlerConfig(true, this.navigateBackToDetail);
	}

	componentWillUnmount = () => {
		// backHandlerConfig(false, this.navigateBackToDetail);
	}

	navigateBackToDetail = () => {
		this.props.navigation.goBack();
	}

	renderMainProcessItem = ({ item }) => {
		return (
			<AssignTaskMainProcessUsers data={item.LstNguoiDung} title={item.PhongBan.NAME} />
		)
	}

	renderJoinProcessItem = ({ item }) => {
		return (
			<AssignTaskJoinProcessUsers data={item.LstNguoiDung} title={item.PhongBan.NAME} />
		)
	}

	onAssginTask = async () => {
		if (this.props.mainProcessUser == 0) {
			Toast.show({
				text: 'Vui lòng chọn người xử lý chính',
				type: 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: Colors.LITE_BLUE },
			});
		} else {
			this.setState({
				executing: true
			});

			const url = `${API_URL}/api/HscvCongViec/SaveAssignTask`;
			const headers = new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			});

			const body = JSON.stringify({
				userId: this.state.userId,
				AssignTaskId: this.state.taskId,
				AssignTaskSubId: this.state.subTaskId,
				XuLyChinhId: this.props.mainProcessUser,
				ThamGia: this.props.joinProcessUsers.toString()
			});

			const result = await fetch(url, {
				method: 'POST',
				headers,
				body
			});

			const resultJson = await result.json();

			await asyncDelay(2000);

			this.setState({
				executing: false
			});

			if (resultJson.Status == true && !util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
				const message = this.props.userInfo.Fullname + ' đã giao bạn xử lý một công việc';
				const content = {
					title: 'THÔNG BÁO GIAO VIỆC',
					message,
					isTaskNotification: true,
					targetScreen: 'DetailTaskScreen',
					targetTaskId: this.state.taskId,
					targetTaskType: this.state.taskType
				}

				resultJson.GroupTokens.forEach(token => {
					pushFirebaseNotify(content, token, 'notification');
				});
			}

			Toast.show({
				text: resultJson.Status ? 'Giao việc thành công' : 'Giao việc không thành công',
				type: resultJson.Status ? 'success' : 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
				duration: 3000,
				onClose: () => {
					this.props.resetTaskProcessors(TASK_PROCESS_TYPE.ALL_PROCESS);
					if (resultJson.Status) {
						this.props.updateExtendsNavParams({ check: true });
						this.navigateBackToDetail();
					}
				}
			});
		}
	}

	render() {
		let bodyContent = null;

		let segmentBody = null;

		if (this.state.loading) {
			bodyContent = dataLoading(true);
		}
		else {
			if (this.state.dataAssignTask.AllowAssignDiffDept) {
				segmentBody = (
					<Segment style={{ backgroundColor: Colors.LITE_BLUE }}>
						<Button first
							active={(this.state.selectedSegmentIndex == 0)}
							onPress={() => this.onChangeSegment(0)}>
							<Text style={{
								fontSize: moderateScale(13, 1.3),
								color: (this.state.selectedSegmentIndex == 0) ? Colors.LITE_BLUE : Colors.WHITE
							}}>
								{
									this.state.dataAssignTask.IsCapPhongBan ? 'CÁN BỘ TRONG PHÒNG' : 'PHÒNG BAN TRONG ĐƠN VỊ'
								}
							</Text>
						</Button>

						<Button last
							active={(this.state.selectedSegmentIndex == 1)}
							onPress={() => this.onChangeSegment(1)}>
							<Text style={{
								fontSize: moderateScale(13, 1.3),
								color: (this.state.selectedSegmentIndex == 1) ? Colors.LITE_BLUE : Colors.WHITE
							}}>
								CHÉO
							</Text>
						</Button>
					</Segment>
				);
			}

			bodyContent = (
				<Tabs initialPage={0}
					onChangeTab={(selectedTabIndex) => this.setState({ selectedTabIndex })}
					tabBarUnderlineStyle={TabStyle.underLineStyle}>
					<Tab heading={
						<TabHeading style={(this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
							<Icon name='ios-person' style={(this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)} />
							<Text style={[(this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)]}>
								XỬ LÝ CHÍNH
							</Text>
						</TabHeading>
					}>
						<Content contentContainerStyle={{ flex: 1 }}>
							<Item>
								<Icon name='ios-search' />
								<Input placeholder={'Họ tên'}
									onSubmitEditing={() => this.onFilter(true)}
									value={this.state.mainProcessFilterValue}
									onChangeText={(mainProcessFilterValue) => this.setState({ mainProcessFilterValue })} />
							</Item>

							{
								renderIf(this.state.searchingMainProcess)(
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
									</View>
								)
							}

							{
								renderIf(!this.state.searchingMainProcess)(
									<FlatList
										data={this.state.dataMainProcessUsers}
										keyExtractor={(item, index) => index.toString()}
										renderItem={this.renderMainProcessItem}
										ListEmptyComponent={emptyDataPage()}
										ListFooterComponent={
											this.state.loadingMoreMainProcess ?
												<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
												(
													this.state.dataMainProcessUsers.length >= 5 ?
														<Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore(true)}>
															<Text>
																TẢI THÊM
															</Text>
														</Button>
														: null
												)
										} />
								)
							}
						</Content>
					</Tab>

					<Tab heading={
						<TabHeading style={(this.state.selectedTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
							<Icon name='ios-people' style={(this.state.selectedTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)} />
							<Text style={[(this.state.selectedTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)]}>
								THAM GIA XỬ LÝ
							</Text>
						</TabHeading>
					}>
						<Content>
							<Item>
								<Icon name='ios-search' />
								<Input placeholder={'Họ tên'}
									onSubmitEditing={() => this.onFilter(false)}
									value={this.state.joinProcessFilterValue}
									onChangeText={(joinProcessFilterValue) => this.setState({ joinProcessFilterValue })} />
							</Item>

							{
								renderIf(this.state.searchingJoinProcess)(
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
									</View>
								)
							}

							{
								renderIf(!this.state.searchingJoinProcess)(
									<FlatList
										data={this.state.dataJoinProcessUsers}
										keyExtractor={(item, index) => index.toString()}
										renderItem={this.renderJoinProcessItem}
										ListEmptyComponent={emptyDataPage()}
										ListFooterComponent={
											this.state.loadingMoreJoinProcess ?
												<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
												(
													this.state.dataJoinProcessUsers.length >= 5 ?
														<Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore(false)}>
															<Text>
																TẢI THÊM
															</Text>
														</Button>
														: null
												)
										} />
								)
							}
						</Content>
					</Tab>
				</Tabs>
			);
		}

		return (
			<Container>
				<Header style={{ backgroundColor: Colors.LITE_BLUE }}>
					<Left style={NativeBaseStyle.left}>
						<Button transparent onPress={() => this.navigateBackToDetail()}>
							<RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
						</Button>
					</Left>

					<Body style={NativeBaseStyle.body}>
						<Title style={NativeBaseStyle.bodyTitle}>
							GIAO VIỆC
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right}>
						<Button transparent onPress={() => this.onAssginTask()}>
							<RneIcon name='md-send' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
						</Button>
					</Right>
				</Header>

				{
					segmentBody
				}

				{
					bodyContent
				}

				{
					executeLoading(this.state.executing)
				}
			</Container>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		userInfo: state.userState.userInfo,
		mainProcessUser: state.taskState.mainProcessUser,
		joinProcessUsers: state.taskState.joinProcessUsers,
		coreNavParams: state.navState.coreNavParams,
		extendsNavParams: state.navState.extendsNavParams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetTaskProcessors: (processType) => dispatch(taskAction.resetTaskProcessors(processType)),
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignTask);