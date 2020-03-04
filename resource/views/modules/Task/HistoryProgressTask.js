/*
	@description: lịch sử cập nhật tiến độ công việc
	@author: duynn
	@since: 15/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
	ActivityIndicator, FlatList, StyleSheet, View as RnView, Text as RnText,
	RefreshControl, Platform
} from 'react-native';
//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
	Container, Header, Left, Content,
	Body, Title, Button, Text, SwipeRow,
	Right, Form, Item, Label,
} from 'native-base';
import {
	Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

//utilities
import {
	API_URL, LOADER_COLOR, HEADER_COLOR, EMPTY_STRING,
	DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors
} from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';
import {
	emptyDataPage, formatLongText, convertDateToString, convertDateTimeToString,
	backHandlerConfig, appGetDataAndNavigate
} from '../../../common/Utilities';

//styles
import { scale, verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { MoreButton, GoBackButton } from '../../common';
import { taskApi } from '../../../common/Api';

class HistoryProgressTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: props.userInfo.ID,
			taskId: props.coreNavParams.taskId,
			taskType: props.coreNavParams.taskType,

			data: [],
			dataItem: {},
			fitlerValue: EMPTY_STRING,
			pageIndex: DEFAULT_PAGE_INDEX,
			pageSize: DEFAULT_PAGE_SIZE,
			loading: false,
			loadingMore: false,
			refreshing: false,
		}
	}

	componentWillMount = () => {
		this.setState({
			loading: true
		}, () => this.fetchData())
	}


	loadMore = () => {
		this.setState({
			loadingMore: true,
			pageIndex: this.state.pageIndex + 1
		}, () => {
			this.fetchData();
		});
	}

	fetchData = async () => {
		const { taskId, pageIndex, pageSize, fitlerValue } = this.state;
		const resultJson = await taskApi().getListProgress([
			taskId,
			pageIndex,
			`${pageSize}?query=${filterValue}`
		]);

		this.setState({
			data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
			loading: false,
			loadingMore: false,
			refreshing: false,
		});
	}

	onShowProgressInfo = (item) => {
		this.setState({
			dataItem: item
		}, () => {
			this.popupDialog.show();
		})
	}

	renderItem = ({ item }) => {
		return (
			<SwipeRow
				leftOpenValue={75}
				rightOpenValue={-75}
				disableLeftSwipe={true}
				left={
					<Button style={{ backgroundColor: '#d1d2d3' }} onPress={() => this.onShowProgressInfo(item)}>
						<RneIcon name='info' type='foundation' size={moderateScale(27, 0.79)} color={Colors.WHITE} />
					</Button>
				}
				body={
					<RnView style={styles.rowContainer}>
						<RnText style={styles.rowInfo}>
							{item.TIENDOCONGVIEC + '%'}
						</RnText>

						<RnText style={styles.rowLabel}>
							<RnText>
								{' - Thời gian: '}
							</RnText>

							<RnText>
								{
									convertDateTimeToString(item.NGAYCAPNHATTIENDO)
								}
							</RnText>
						</RnText>
					</RnView>
				}
			/>
		);
	}

	navigateBackToDetail = () => {
		this.props.navigation.goBack();
	}

	handleRefresh = () => {
		this.setState({
			refreshing: true,
			pageIndex: DEFAULT_PAGE_INDEX,
		}, () => {
			this.fetchData()
		})
	}

	render() {
		let bodyContent = dataLoading(true);
		if (!this.state.loading) {
			bodyContent = (
				<FlatList
					data={this.state.data}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this.renderItem}
					ListEmptyComponent={() => emptyDataPage()}
					ListFooterComponent={() => (<MoreButton
						isLoading={this.state.loadingMore}
						isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
						loadmoreFunc={this.loadMore}
					/>)}
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
				/>
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
							LỊCH SỬ CẬP NHẬT TIẾN ĐỘ
						</Title>
					</Body>
					<Right style={NativeBaseStyle.right} />
				</Header>

				<Content contentContainerStyle={{ flex: 1 }}>
					{
						bodyContent
					}
				</Content>

				<PopupDialog
					dialogTitle={<DialogTitle
						title='THÔNG TIN CẬP NHẬT TIẾN ĐỘ'
						titleStyle={{
							...Platform.select({
								android: {
									height: verticalScale(50),
									justifyContent: 'center',
								}
							}),
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
								fontSize: moderateScale(14, 1.12),
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
								Tiến độ
							</Label>

							<Label style={styles.dialogText}>
								{this.state.dataItem.TIENDOCONGVIEC + '%'}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Người cập nhật
							</Label>

							<Label style={styles.dialogText}>
								{this.state.dataItem.NGUOITAO}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Thời gian
							</Label>

							<Label style={styles.dialogText}>
								{(convertDateTimeToString(this.state.dataItem.NGAYCAPNHATTIENDO))}
							</Label>
						</Item>

						<Item stackedLabel>
							<Label style={styles.dialogLabel}>
								Nội dung
							</Label>

							<Label style={styles.dialogText}>
								{(this.state.dataItem.NOIDUNG)}
							</Label>
						</Item>
					</Form>
				</PopupDialog>
			</Container>
		);
	}

}

const styles = StyleSheet.create({
	rowContainer: {
		width: '100%',
		paddingLeft: scale(10),
		flexDirection: 'row',
		alignItems: 'center',
	},
	rowLabel: {
		color: '#000',
		fontSize: moderateScale(16, 0.98),
	},
	rowInfo: {
		color: '#000',
		fontSize: moderateScale(25, 0.8),
		fontWeight: 'bold',
		textDecorationLine: 'none'
	},
	dialogLabel: {
		fontWeight: 'bold',
		color: '#000',
		fontSize: moderateScale(11, 1.02),
	},
	dialogText: {
		fontSize: moderateScale(12, 1.14),
	},
});

const mapStateToProps = (state) => {
	return {
		userInfo: state.userState.userInfo,
		coreNavParams: state.navState.coreNavParams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryProgressTask);