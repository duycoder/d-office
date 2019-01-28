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
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate } from '../../../common/Utilities';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';
import {
	API_URL, EMPTY_STRING, HEADER_COLOR, LOADER_COLOR, Colors,
	LOADMORE_COLOR, DEFAULT_PAGE_INDEX, WORKFLOW_PROCESS_TYPE
} from '../../../common/SystemConstant';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//lib
import renderIf from 'render-if';
import * as util from 'lodash';
import {
	Container, Content, Header, Left, Text, Icon, Title, Textarea,
	Right, Body, Item, Button, Tabs, Tab, TabHeading, Form, Input, Toast, Col
}
	from 'native-base';
import { Icon as RneIcon } from 'react-native-elements';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import WorkflowRequestReviewUsers from './WorkflowRequestReviewUsers';

class WorkflowRequestReview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,

			docId: this.props.navigation.state.params.docId,
			docType: this.props.navigation.state.params.docType,
			processId: this.props.navigation.state.params.processId,
			stepId: this.props.navigation.state.params.stepId,
			isStepBack: this.props.navigation.state.params.isStepBack,
			stepName: util.toUpper(this.props.navigation.state.params.stepName),
			message: EMPTY_STRING,

			pageIndex: DEFAULT_PAGE_INDEX,
			groupMainProcessors: [],
			filterValue: EMPTY_STRING,
			currentTabIndex: 0,
			loading: false,
			searching: false,
			loadingMore: false,
			executing: false
		}
	}

	componentDidMount = () => {
        backHandlerConfig(true, this.navigateBackToDetail);
    }

    componentWillUnmount = () => {
        backHandlerConfig(false, this.navigateBackToDetail);
    }

	componentWillMount() {
		this.fetchData();
	}

	async fetchData() {
		this.setState({
			loading: true
		});

		const url = `${API_URL}/api/VanBanDi/GetFlow/${this.state.userId}/${this.state.processId}/${this.state.stepId}/${this.state.isStepBack ? 1 : 0}/0`;
		console.log('đường dẫn', url);
		
		const result = await fetch(url);
		const resultJson = await result.json();

		this.setState({
			loading: false,
			groupMainProcessors: resultJson.dsNgNhanChinh || []
		})
	}

	navigateBackToDetail = () => {
		appGetDataAndNavigate(this.props.navigation, "WorkflowRequestReviewScreen");
		return true;
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
		const url = `${API_URL}/api/VanBanDi/SearchUserReview/${this.state.userId}/${this.state.pageIndex}?query=${this.state.filterValue}`;

		const result = await fetch(url);
		const resultJson = await result.json();

		this.setState({
			loadingMore: false,
			loading: false,
			searching: false,
			groupMainProcessors: this.state.searching ? (resultJson.dsNgNhanChinh || []) : [...this.state.groupMainProcessors, ...(resultJson.dsNgNhanChinh || [])]
		})
	}

	saveRequestReview = async () => {

		if (this.props.reviewUsers.length <= 0) {
			Toast.show({
				text: 'Vui lòng chọn người cần gửi',
				type: 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: '#fff' },
				buttonTextStyle: { color: '#FF0033' },
			});
			return false
		} else {
			this.setState({
				executing: true
			});

			const url = `${API_URL}/api/VanBanDi/SaveReview`;
			const headers = new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			});
			const body = JSON.stringify({
				userId: this.state.userId,
				joinUser: this.props.reviewUsers.toString(),
				stepID: this.state.stepId,
				processID: this.state.processId,
				message: this.state.message
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

			//gửi thông báo đến cho người nhận review

			if (!util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
				const message = this.props.userInfo.Fullname + " đã gửi bạn review một văn bản mới";
				const content = {
					title: 'REVIEW VĂN BẢN TRÌNH KÝ',
					message,
					isTaskNotification: false,
					targetScreen: 'DetailSignDocScreen',
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
				buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
				duration: 5000,
				onClose: () => {
					this.props.resetProcessUsers(WORKFLOW_PROCESS_TYPE.ALL_PROCESS);
					if (resultJson.Status) {
						this.navigateBackToDetail();
					}
				}
			});
		}

	}

	render() {
		return (
			<Container>
				<Header hasTabs style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
					<Left style={NativeBaseStyle.left}>
						<Button transparent onPress={() => this.navigateBackToDetail()}>
							<RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
						</Button>
					</Left>

					<Body style={NativeBaseStyle.body}>
						<Title style={NativeBaseStyle.bodyTitle}>
							{this.state.stepName}
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right}>
						<Button transparent onPress={() => this.saveRequestReview()}>
							<RneIcon name='md-send' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
						</Button>
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
							onChangeTab={({ currentTabIndex }) => this.setState({
								currentTabIndex
							})}
							tabBarUnderlineStyle={TabStyle.underLineStyle}>

							<Tab heading={
								<TabHeading style={this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab}>
									<Icon name='ios-person-outline' style={TabStyle.activeText} />
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
												ListFooterComponent={
													this.state.loadingMore ?
														<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
														(
															this.state.groupMainProcessors.length >= 5 ?
																<Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadMore()}>
																	<Text>
																		TẢI THÊM
																	</Text>
																</Button>
																: null
														)
												}
											/>
										)
									}
								</Content>
							</Tab>

							<Tab heading={
								<TabHeading style={this.state.selectedTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab}>
									<Icon name='ios-chatbubbles-outline' style={TabStyle.activeText} />
									<Text style={this.state.selectedTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText}>
										TIN NHẮN
									</Text>
								</TabHeading>
							}>
								<Form>
									<Textarea rowSpan={5} bordered
										placeholder="Nội dung tin nhắn"
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
		reviewUsers: state.workflowState.reviewUsers
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		resetProcessUsers: (workflowProcessType) => (dispatch(workflowAction.resetProcessUsers(workflowProcessType)))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowRequestReview);