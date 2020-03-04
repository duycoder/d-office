/*
	@description: màn hình yêu cầu văn bản cần review
	@author: duynn
	@since: 16/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, FlatList } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action'

//utilities
import { emptyDataPage, showWarningToast } from '../../../common/Utilities';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';
import {
	EMPTY_STRING, Colors,
	DEFAULT_PAGE_INDEX, WORKFLOW_PROCESS_TYPE, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//lib
import renderIf from 'render-if';
import * as util from 'lodash';
import {
	Container, Content, Header, Left, Text, Icon, Title, Textarea,
	Right, Body, Item, Tabs, Tab, TabHeading, Form, Input, Toast}
	from 'native-base';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import WorkflowRequestReviewUsers from './WorkflowRequestReviewUsers';
import { HeaderRightButton, GoBackButton } from '../../common';
import { vanbandiApi } from '../../../common/Api';

class WorkflowRequestReview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,

			docId: this.coreNavParams.docId,
			docType: this.coreNavParams.docType,
			processId: this.extendsNavParams.processId,
			stepId: this.extendsNavParams.stepId,
			isStepBack: this.extendsNavParams.isStepBack,
			stepName: util.toUpper(this.extendsNavParams.stepName),
			message: EMPTY_STRING,

			pageIndex: DEFAULT_PAGE_INDEX,
			groupMainProcessors: [],
			filterValue: EMPTY_STRING,
			currentTabIndex: 0,
			loading: false,
			searching: false,
			loadingMore: false,
			executing: false,
			hasAuthorization: props.hasAuthorization || 0
		};

		this.VanbanDiApi = vanbandiApi();
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = async () => {
		this.setState({
			loading: true
		});

		const { userId, processId, stepId, isStepBack, hasAuthorization } = this.state;
		const resultJson = await this.VanbanDiApi.getFlow([
			userId,
			processId,
			stepId,
			isStepBack ? 1 : 0,
			hasAuthorization
		]);

		this.setState({
			loading: false,
			groupMainProcessors: resultJson.dsNgNhanChinh || []
		})
	}

	navigateBackToDetail = () => {
		this.props.navigation.goBack();
	}

	renderItem = ({ item }) => {
		return (
			<WorkflowRequestReviewUsers title={item.PhongBan.NAME} users={item.LstNguoiDung} />
		);
	}

	searchData() {
		this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.ALL_PROCESS);
		this.setState({
			searching: true,
			pageIndex: DEFAULT_PAGE_INDEX
		}, () => this.filterData())
	}

	loadMore = () => {
		this.setState({
			loadingMore: true,
			pageIndex: this.state.pageIndex + 1,
		}, () => this.filterData())
	}

	filterData = async () => {
		const { userId, pageIndex, filterValue } = this.state;
		const resultJson = await this.VanbanDiApi.getUserReview([
			userId,
			`${pageIndex}?query=${filterValue}`
		]);

		this.setState({
			loadingMore: false,
			loading: false,
			searching: false,
			groupMainProcessors: this.state.searching ? (resultJson.dsNgNhanChinh || []) : [...this.state.groupMainProcessors, ...(resultJson.dsNgNhanChinh || [])]
		})
	}

	saveRequestReview = async () => {
		if (this.props.reviewUsers.length <= 0) {
			showWarningToast('Vui lòng chọn người cần gửi');
		} else {
			this.setState({
				executing: true
			});

			const resultJson = await this.VanbanDiApi.saveReview({
				userId: this.state.userId,
				joinUser: this.props.reviewUsers.toString(),
				stepID: this.state.stepId,
				processID: this.state.processId,
				message: this.state.message
			})

			this.setState({
				executing: false
			});

			//gửi thông báo đến cho người nhận review
			if (!util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
				const message = this.props.userInfo.Fullname + " đã gửi bạn review một văn bản mới";
				const content = {
					title: 'REVIEW VĂN BẢN TRÌNH KÝ',
					message,
					isTaskNotification: false,
					targetScreen: 'VanBanDiDetailScreen',
					targetDocId: this.state.docId,
					targetDocType: this.state.docType
				}
				resultJson.GroupTokens.forEach(token => {
					pushFirebaseNotify(content, token, "notification");
				});
			}

			Toast.show({
				text: resultJson.Status ? 'Lưu yêu cầu review thành công' : 'Lưu yêu cầu review không thành công',
				type: resultJson.Status ? 'success' : 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
				duration: TOAST_DURATION_TIMEOUT,
				onClose: () => {
					this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.ALL_PROCESS);
					if (resultJson.Status) {
						this.props.updateExtendsNavParams({ check: true });
						this.navigateBackToDetail();
					}
				}
			});
		}
	}

	render() {
		return (
			<Container>
				<Header hasTabs style={NativeBaseStyle.container}>
					<Left style={NativeBaseStyle.left}>
						<GoBackButton onPress={() => this.navigateBackToDetail()} />
					</Left>

					<Body style={NativeBaseStyle.body}>
						<Title style={NativeBaseStyle.bodyTitle}>
							{this.state.stepName}
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right}>
						<HeaderRightButton onPress={() => this.saveRequestReview()} />
					</Right>
				</Header>

				{
					renderIf(this.state.loading)(
						dataLoading(true)
					)
				}

				{
					renderIf(!this.state.loading)(
						<Tabs initialPage={this.state.currentTabIndex}
							tabContainerStyle={{ height: moderateScale(47, 0.97) }}
							onChangeTab={({ currentTabIndex }) => this.setState({
								currentTabIndex
							})}
							tabBarUnderlineStyle={TabStyle.underLineStyle}>

							<Tab heading={
								<TabHeading style={this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab}>
									<Icon name='ios-person' style={TabStyle.activeText} />
									<Text style={this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText}>
										NGƯỜI NHẬN
									</Text>
								</TabHeading>
							}>
								<Item>
									<Icon name='ios-search' />
									<Input placeholder='Họ tên'
										value={this.state.filterValue}
										onSubmitEditing={() => this.searchData()}
										onChangeText={(filterValue) => this.setState({ filterValue })} />
								</Item>
								<Content>
									{
										renderIf(this.state.searching)(
											<View style={{ flex: 1, justifyContent: 'center' }}>
												<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
											</View>
										)
									}

									{
										renderIf(!this.state.searching)(
											<FlatList
												keyExtractor={(item, index) => index.toString()}
												data={this.state.groupMainProcessors}
												renderItem={this.renderItem}
												ListEmptyComponent={
													this.state.loading ? null : emptyDataPage()
												}
												ListFooterComponent={() => (<MoreButton
													isLoading={this.state.loadingMore}
													isTrigger={this.state.groupMainProcessors.length >= 5}
													loadmoreFunc={this.loadMore}
												/>)}
											/>
										)
									}
								</Content>
							</Tab>

							<Tab heading={
								<TabHeading style={this.state.selectedTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab}>
									<Icon name='ios-chatboxes' style={TabStyle.activeText} />
									<Text style={this.state.selectedTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText}>
										GHI CHÚ
									</Text>
								</TabHeading>
							}>
								<Form>
									<Textarea rowSpan={5} bordered
										placeholder="Nội dung ghi chú"
										value={this.state.message}
										onChangeText={(message) => this.setState({ message })} />
								</Form>
							</Tab>
						</Tabs>
					)
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
		reviewUsers: state.workflowState.reviewUsers,
		coreNavParams: state.navState.coreNavParams,
		extendsNavParams: state.navState.extendsNavParams,
		hasAuthorization: state.navState.hasAuthorization
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetProcessUsers: (workflowProcessType) => (dispatch(workflowAction.resetProcessUsers(workflowProcessType))),
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowRequestReview);