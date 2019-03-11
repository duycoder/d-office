/*
	@description: danh sách xin lùi hạn của công việc
	@author: duynn
	@since: 15/05/2018
*/
'use strict';
import React, { Component } from 'react';
import { View as RnView, Text as RnText } from 'react-native';
import {
	ActivityIndicator, Alert, FlatList,
	RefreshControl, StyleSheet, Dimensions, Platform
} from 'react-native';
//lib
import {
	SwipeRow, Button, View, Text, Icon, Item,
	Label, Container, Header, Left, Body, Right,
	Title, Content, Form, Toast
} from 'native-base';
import renderIf from 'render-if';
import * as util from 'lodash';
import {
	Icon as RneIcon
} from 'react-native-elements';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

//redux
import { connect } from 'react-redux';

//utilities
import { API_URL, HEADER_COLOR, LOADER_COLOR, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors } from '../../../common/SystemConstant';
import {
	asyncDelay, emptyDataPage, formatLongText, convertDateToString,
	appGetDataAndNavigate, backHandlerConfig
} from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { scale, verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

class HistoryRescheduleTask extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,

			taskId: props.coreNavParams.taskId,
			taskType: props.coreNavParams.taskType,
			canApprove: props.extendsNavParams.canApprove,
			data: [],
			loading: false,
			loadingMore: false,
			refreshing: false,
			executing: false,
			rescheduleId: 0,
			rescheduleInfo: {},

			pageIndex: DEFAULT_PAGE_INDEX,
			pageSize: DEFAULT_PAGE_SIZE
		}
	}

	componentWillMount() {
		this.setState({
			loading: true
		}, () => {
			this.fetchData();
		});
	}

	fetchData = async () => {
		const url = `${API_URL}/api/HscvCongViec/GetListRescheduleTask/${this.state.taskId}/${this.state.pageIndex}/${this.state.pageSize}?query=`;

		const result = await fetch(url);
		const resultJson = await result.json();

		this.setState({
			data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
			loading: false,
			loadingMore: false,
			refreshing: false,
		});
	}

	loadMore() {
		this.setState({
			loadingMore: true,
			pageIndex: this.state.pageIndex + 1
		}, () => this.fetchData())
	}

	handleRefresh = () => {
		this.setState({
			refreshing: true,
			pageIndex: DEFAULT_PAGE_INDEX
		}, () => {
			this.fetchData()
		})
	}

	onShowRescheduleInfo = (item) => {
		this.setState({
			rescheduleInfo: item
		}, () => {
			this.popupDialog.show();
		})
	}

	onConfirmApproveReschedule = (item) => {
		this.setState({
			rescheduleInfo: item
		}, () => {
			Alert.alert(
				'PHẢN HỒI YÊU CẦU LÙI HẠN',
				'Phản hồi yêu cầu lùi hạn của \n' + item.FullName,
				[
					{
						'text': 'ĐỒNG Ý', onPress: () => { this.onApproveReschedule(true, item.ID, item.HANKETHUC) }
					}, {
						'text': 'KHÔNG ĐỒNG Ý', onPress: () => { this.onApproveReschedule(false, item.ID, item.HANKETHUC) }
					}, {
						'text': 'THOÁT', onPress: () => { }
					}
				]
			)
		})
	}

	onApproveReschedule = async (isApprove, extendId, deadline) => {
		const screenName = isApprove ? 'ApproveRescheduleTaskScreen' : 'DenyRescheduleTaskScreen';
		this.props.navigation.navigate(screenName, {
			taskId: this.state.taskId,
			taskType: this.state.taskType,
			canApprove: this.state.canApprove,

			extendId,
			deadline
		})
	}

	renderItem = ({ item }) => {
		return (
			<SwipeRow
				leftOpenValue={75}
				rightOpenValue={-75}
				disableLeftSwipe={!util.isNull(item.IS_APPROVED) || this.state.canApprove == false}
				left={
					<Button style={{ backgroundColor: '#d1d2d3' }} onPress={() => this.onShowRescheduleInfo(item)}>
						<RneIcon name='info' type='foundation' size={verticalScale(30)} color={Colors.WHITE} />
					</Button>
				}
				body={
					<RnView style={styles.rowContainer}>
						<RnText style={styles.rowDateContainer}>
							<RnText>
								{'Xin lùi đến: '}
							</RnText>

							<RnText style={styles.rowDate}>
								{convertDateToString(item.HANKETHUC) + ' '}
							</RnText>
						</RnText>
						<RnText>
							<RnText style={styles.rowStatusLabel}>
								{'Trạng thái: '}
							</RnText>
							{
								util.isNull(item.IS_APPROVED) ?
									<RnText style={[styles.notConfirmText, styles.rowStatus]}>
										Chưa phê duyệt
								</RnText> :
									(
										item.IS_APPROVED ?
											<RnText style={[styles.approveText, styles.rowStatus]}>
												Đã phê duyệt
										</RnText>
											: <RnText style={[styles.denyText, styles.rowStatus]}>
												Không phê duyệt
										</RnText>
									)
							}
						</RnText>

					</RnView>
				}

				right={
					<Button style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.onConfirmApproveReschedule(item)}>
						<RneIcon name='pencil' type='foundation' size={verticalScale(30)} color={Colors.WHITE} />
					</Button>
				}
			/>
		)
	}

	componentDidMount = () => {
        backHandlerConfig(true, this.navigateBackToDetail);
    }

    componentWillUnmount = () => {
        backHandlerConfig(false, this.navigateBackToDetail);
    }

    navigateBackToDetail = () => {
			    this.props.navigation.navigate(this.props.coreNavParams.screenName);
        // appGetDataAndNavigate(this.props.navigation, 'HistoryRescheduleTaskScreen');
        // return true;
    }

	render() {
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
							LỊCH SỬ LÙI HẠN
						</Title>
					</Body>
					<Right style={NativeBaseStyle.right}></Right>
				</Header>

				<Content contentContainerStyle={{ flex: 1 }}>
					{
						renderIf(this.state.loading)(
							dataLoading(true)
						)
					}

					{
						renderIf(!this.state.loading)(
							<FlatList
								data={this.state.data}
								keyExtractor={(item, index) => index.toString()}
								renderItem={this.renderItem}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this.handleRefresh}
										title='Kéo để làm mới'
										colors={[Colors.BLUE_PANTONE_640C]}
										tintColor={[Colors.BLUE_PANTONE_640C]}
										titleColor='red'
									/>
								}
								ListEmptyComponent={() => emptyDataPage()}

								ListFooterComponent={() => this.state.loadingMore ?
									<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
									(
										this.state.data.length >= DEFAULT_PAGE_SIZE ?
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

				{
					executeLoading(this.state.executing)
				}

				{/* hiển thị thông tin lùi hạn công việc */}

				<PopupDialog
					dialogTitle={<DialogTitle title='THÔNG TIN LÙI HẠN'
						titleStyle={{
							...Platform.select({
								android: {
									height: verticalScale(50),
									justifyContent: 'center',
								}
							})
						}} />}
					ref={(popupDialog) => { this.popupDialog = popupDialog }}
					width={0.8}
					height={'auto'}
					actions={[
						<DialogButton
							align={'center'}
							buttonStyle={{
								backgroundColor: Colors.GREEN_PANTON_369C,
								alignSelf: 'stretch',
								alignItems: 'center',
								borderBottomLeftRadius: 8,
								borderBottomRightRadius: 8,
								...Platform.select({
									ios: {
										justifyContent: 'flex-end',
									},
									android: {
										height: verticalScale(50),
										justifyContent: 'center',
									},
								})
							}}
							text="ĐÓNG"
							textStyle={{
								fontSize: moderateScale(14, 1.5),
								color: '#fff',
								textAlign: 'center'
							}}
							onPress={() => {
								this.popupDialog.dismiss();
							}}
							key="button-0"
						/>,
					]}>
					<Form>
						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Người xin lùi hạn
							</Label>

							<Label style={styles.dialogText}>
								{this.state.rescheduleInfo.FullName}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Xin lùi tới ngày
							</Label>

							<Label style={styles.dialogText}>
								{convertDateToString(this.state.rescheduleInfo.HANKETHUC)}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Đồng ý lùi tới ngày
							</Label>

							<Label style={styles.dialogText}>
								{convertDateToString(this.state.rescheduleInfo.HANKETTHUC_LANHDAODUYET)}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Lý do xin lùi hạn
							</Label>

							<Label style={styles.dialogText}>
								{(this.state.rescheduleInfo.NOIDUNG)}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Nội dung phê duyệt
							</Label>

							<Label style={styles.dialogText}>
								{(this.state.rescheduleInfo.BUTPHELANHDAO)}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Trạng thái phê duyệt
							</Label>

							{
								util.isNull(this.state.rescheduleInfo.IS_APPROVED) ?
									<Label style={[styles.notConfirmText]}>
										Chưa phê duyệt
								</Label> :
									(
										this.state.rescheduleInfo.IS_APPROVED ?
											<Label style={[styles.approveText]}>
												Đã phê duyệt
											</Label>
											: <Label style={[styles.denyText]}>
												Không phê duyệt
											</Label>
									)
							}
						</Item>
					</Form>
				</PopupDialog>
			</Container>
		);
	}
}

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	rowContainer: {
		width: '100%',
		paddingLeft: scale(10),
		flexDirection: (deviceWidth >= 340) ? 'row' : 'column',
		alignItems: (deviceWidth >= 340) ? 'center' : 'flex-start',
	},
	rowDateContainer: {
		color: '#000',
	},
	rowDate: {
		color: '#000',
		fontWeight: 'bold',
		paddingLeft: scale(10),
		textDecorationLine: 'underline'
	},
	rowStatusLabel: {
		color: '#000',
		marginLeft: scale(10)
	},
	rowStatus: {
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	}, notConfirmText: {
		color: '#FF6600'
	}, approveText: {
		color: '#337321'
	}, denyText: {
		color: '#FF0033'
	}, dialogLabel: {
		fontWeight: 'bold',
		color: '#000',
		fontSize: moderateScale(14, 1.3)
	}
});

const mapStateToProps = (state) => {
	return {
		userInfo: state.userState.userInfo,
		    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
	}
}

export default connect(mapStateToProps)(HistoryRescheduleTask)