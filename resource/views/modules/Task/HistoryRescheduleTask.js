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
	RefreshControl, StyleSheet, Dimensions, Platform,
	TouchableOpacity
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
import * as navAction from '../../../redux/modules/Nav/Action';

//utilities
import { API_URL, HEADER_COLOR, LOADER_COLOR, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors } from '../../../common/SystemConstant';
import {
	asyncDelay, emptyDataPage, formatLongText, convertDateToString,
	appGetDataAndNavigate, backHandlerConfig, convertDateTimeToString
} from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { scale, verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';
import AlertMessage from '../../common/AlertMessage';
import AlertMessageStyle from '../../../assets/styles/AlertMessageStyle';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import GoBackButton from '../../common/GoBackButton';
import { MoreButton } from '../../common';

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
			pageSize: DEFAULT_PAGE_SIZE,

			listRowId: [],
		};

		this.myRef = [];
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
			this.refs.confirm.showModal();
		})
	}

	onApproveReschedule = async (isApprove, extendId, deadline) => {
		this.refs.confirm.closeModal();
		const screenName = isApprove ? 'ApproveRescheduleTaskScreen' : 'DenyRescheduleTaskScreen';
		const targetParams = {
			canApprove: this.state.canApprove,
			extendId,
			deadline
		};
		this.props.updateExtendsNavParams(targetParams);
		this.props.navigation.navigate(screenName);
	}

	renderItem = ({ item }) => {
		return (
			<SwipeRow
				// ref={ref => this.myRef[`rowId__${item.ID}`] = ref}
				// onRowOpen={()=>this.setState({listRowId: [...this.state.listRowId, `rowId__${item.ID}`]})}
				leftOpenValue={75}
				rightOpenValue={-75}
				disableLeftSwipe={!util.isNull(item.IS_APPROVED) || this.state.canApprove == false}
				left={
					<Button style={{ backgroundColor: '#d1d2d3' }} onPress={() => this.onShowRescheduleInfo(item)}>
						<RneIcon name='info' type='foundation' size={moderateScale(27, 0.79)} color={Colors.WHITE} />
					</Button>
				}
				body={
					<RnView>
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
						{
							item.IS_APPROVED &&
							<RnView style={[styles.rowContainer, { marginTop: 5 }]}>
								<RnText>
									<RnText style={styles.rowStatusLabel}>
										{`Đồng ý phê duyệt tới: `}
									</RnText>
									<RnText style={[styles.approveText, styles.rowStatus]}>
										{convertDateToString(item.HANKETTHUC_LANHDAODUYET)}
									</RnText>
								</RnText>
							</RnView>
						}
					</RnView>
				}

				right={
					<Button style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.onConfirmApproveReschedule(item)}>
						<RneIcon name='pencil' type='foundation' size={moderateScale(27, 0.79)} color={Colors.WHITE} />
					</Button>
				}
			/>
		)
	}

	componentDidMount = () => {
		// backHandlerConfig(true, this.navigateBackToList);
		this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
			if (this.props.extendsNavParams.hasOwnProperty("check")) {
				if (this.props.extendsNavParams.check === true) {
					this.setState({
						loading: true
					}, () => {
						this.fetchData();
					});
					this.updateExtendsNavParams({ check: false });
				}
			}
		});
	}

	componentWillUnmount = () => {
		// backHandlerConfig(false, this.navigateBackToList);
		this.willFocusListener.remove();
	}

	navigateBackToDetail = () => {
		this.props.navigation.goBack();
	}

	render() {
		return (
			<Container>
				<Header style={NativeBaseStyle.container}>
					<Left style={NativeBaseStyle.left}>
						<GoBackButton onPress={() => this.navigateBackToDetail()} />
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

								ListFooterComponent={() => (<MoreButton
									isLoading={this.state.loadingMore}
									isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
									loadmoreFunc={this.loadMore}
								/>)}
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

				<AlertMessage
					ref="confirm"
					title="PHẢN HỒI YÊU CẦU LÙI HẠN"
					bodyText={`Phản hồi yêu cầu lùi hạn của \n ${this.state.rescheduleInfo.FullName}`}
					exitText="THOÁT"
				>
					<RnView style={AlertMessageStyle.leftFooter}>
						<TouchableOpacity onPress={() => this.onApproveReschedule(true, this.state.rescheduleInfo.ID, this.state.rescheduleInfo.HANKETHUC)} style={AlertMessageStyle.footerButton}>
							<RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
								ĐỒNG Ý
							</RnText>
						</TouchableOpacity>
					</RnView>
					<RnView style={AlertMessageStyle.leftFooter}>
						<TouchableOpacity onPress={() => this.onApproveReschedule(false, this.state.rescheduleInfo.ID, this.state.rescheduleInfo.HANKETHUC)} style={AlertMessageStyle.footerButton}>
							<RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
								KHÔNG ĐỒNG Ý
							</RnText>
						</TouchableOpacity>
					</RnView>
				</AlertMessage>
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
	}, leftFooter: {
		flex: 1,
		borderRightWidth: scale(2),
		borderRightColor: '#ececec'
	}, rightFooter: {
		flex: 1,
	}, footerText: {
		color: '#000',
		flexWrap: 'wrap',
	}, footerButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const mapStateToProps = (state) => {
	return {
		userInfo: state.userState.userInfo,
		coreNavParams: state.navState.coreNavParams,
		extendsNavParams: state.navState.extendsNavParams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryRescheduleTask)