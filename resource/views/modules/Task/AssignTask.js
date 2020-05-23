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
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/CongViec/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//utilities
import {
	DEFAULT_PAGE_INDEX,
	EMPTY_STRING, TASK_PROCESS_TYPE, COMMON_COLOR, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { emptyDataPage, showWarningToast } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import AssignTaskJoinProcessUsers from './AssignTaskJoinProcessUsers';
import AssignTaskMainProcessUsers from './AssignTaskMainProcessUsers';
import { MoreButton, HeaderRightButton, GoBackButton } from '../../common';
import { taskApi } from '../../../common/Api';

const api = taskApi();

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
		});

		const {
			taskId, subTaskId, userId
		} = this.state;

		const resultJson = await api.getAssignHelper([
			taskId,
			subTaskId,
			userId
		]);

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
	onFilterMain = () => this.onFilter(true);
	onFilterJoin = () => this.onFilter(false);

	loadingMore = (isMainProcess) => {
		this.setState({
			loadingMoreMainProcess: isMainProcess,
			mainProcessPageIndex: (isMainProcess ? this.state.mainProcessPageIndex + 1 : this.state.mainProcessPageIndex),

			loadingMoreJoinProcess: !isMainProcess,
			joinProcessPageIndex: (!isMainProcess ? this.state.joinProcessPageIndex + 1 : this.state.joinProcessPageIndex)
		}, () => this.filterData());
	}
	loadingMoreMain = () => this.loadingMore(true);
	loadingMoreJoin = () => this.loadingMore(false);

	filterData = async () => {
		const {
			userId, selectedSegmentIndex,
			searchingJoinProcess, searchingMainProcess,
			loadingMoreJoinProcess, loadingMoreMainProcess,
			joinProcessFilterValue, mainProcessFilterValue,
			dataJoinProcessUsers, dataMainProcessUsers,
		} = this.state;

		const resultJson = await api.getAssignedUser({
			userId: userId,
			isDeptAdd: (selectedSegmentIndex == 1),
			query: (searchingMainProcess || loadingMoreMainProcess) ? mainProcessFilterValue : joinProcessFilterValue,
			pageIndex: (searchingMainProcess || loadingMoreMainProcess) ? mainProcessPageIndex : joinProcessPageIndex
		});

		this.setState({
			dataMainProcessUsers: (searchingMainProcess) ? resultJson : (loadingMoreMainProcess ? [...dataMainProcessUsers, ...resultJson] : dataMainProcessUsers),
			dataJoinProcessUsers: (searchingJoinProcess) ? resultJson : (loadingMoreJoinProcess ? [...dataJoinProcessUsers, ...resultJson] : dataJoinProcessUsers),

			loadingMoreMainProcess: false,
			loadingMoreJoinProcess: false,
			searchingMainProcess: false,
			searchingJoinProcess: false
		})
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
		const { mainProcessUser, joinProcessUsers } = this.props;
		const { userId, taskId, subTaskId } = this.state;

		if (this.props.mainProcessUser == 0) {
			showWarningToast('Vui lòng chọn người xử lý chính');
		} else {
			this.setState({
				executing: true
			});

			const resultJson = await api.saveAssignedUser({
				userId: userId,
				AssignTaskId: taskId,
				AssignTaskSubId: subTaskId,
				XuLyChinhId: mainProcessUser,
				ThamGia: joinProcessUsers.toString()
			});

			this.setState({
				executing: false
			});

			Toast.show({
				text: resultJson.Status ? 'Giao việc thành công' : 'Giao việc không thành công',
				type: resultJson.Status ? 'success' : 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
				buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.LITE_BLUE },
				duration: TOAST_DURATION_TIMEOUT,
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

	_handleFieldNameChange = fieldName => text => {
		this.setState({
			[fieldName]: text
		});
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
					<Segment style={{ backgroundColor: COMMON_COLOR.LITE_BLUE }}>
						<Button
							first
							active={(this.state.selectedSegmentIndex == 0)}
							onPress={() => this.onChangeSegment(0)}>
							<Text style={{
								color: (this.state.selectedSegmentIndex == 0) ? '#f2f2f2' : COMMON_COLOR.WHITE
							}}>
								{
									this.state.dataAssignTask.IsCapPhongBan ? 'TRONG PHÒNG' : 'TRONG ĐƠN VỊ'
								}
							</Text>
						</Button>

						<Button last
							active={(this.state.selectedSegmentIndex == 1)}
							onPress={() => this.onChangeSegment(1)}>
							<Text style={{
								color: (this.state.selectedSegmentIndex == 1) ? '#f2f2f2' : COMMON_COLOR.WHITE
							}}>
								TOÀN BỆNH VIỆN
							</Text>
						</Button>
					</Segment>
				);
			}

			bodyContent = (
				<Tabs initialPage={0}
					tabContainerStyle={{ height: moderateScale(47, 0.97) }}
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
										<ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
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
										ListFooterComponent={() => (<MoreButton
											isLoading={this.state.loadingMoreMainProcess}
											isTrigger={this.state.dataMainProcessUsers.length >= 5}
											loadmoreFunc={this.loadingMoreMain}
										/>)} />
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
										<ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
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
										ListFooterComponent={() => (<MoreButton
											isLoading={this.state.loadingMoreJoinProcess}
											isTrigger={this.state.dataJoinProcessUsers.length >= 5}
											loadmoreFunc={this.loadingMoreJoin}
										/>)} />
								)
							}
						</Content>
					</Tab>
				</Tabs>
			);
		}

		return (
			<Container>
				<Header style={NativeBaseStyle.container}>
					<Left style={NativeBaseStyle.left}>
						<GoBackButton onPress={() => this.navigateBackToDetail()} />
					</Left>

					<Body style={NativeBaseStyle.body}>
						<Title style={NativeBaseStyle.bodyTitle}>
							GIAO VIỆC
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right}>
						<HeaderRightButton onPress={() => this.onAssginTask()} />
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