/*
	@description: danh sách xin lùi hạn của công việc
	@author: duynn
	@since: 15/05/2018
*/
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
	FlatList, RefreshControl, StyleSheet
} from 'react-native';
//lib
import {
	Container, Header, Left, Body, Right,
	Title, Content
} from 'native-base';
import util from 'lodash';
import {
	ListItem, Icon
} from 'react-native-elements';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//utilities
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, COMMON_COLOR } from '../../../common/SystemConstant';
import { emptyDataPage, convertDateToString } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { MoreButton, GoBackButton, ColumnedListItem } from '../../common';
import { taskApi } from '../../../common/Api';

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
	}

	componentWillMount() {
		this.setState({
			loading: true
		}, () => {
			this.fetchData();
		});
	}

	fetchData = async () => {
		const { taskId, pageIndex, pageSize } = this.state;
		const resultJson = await taskApi().getListReschedule([
			taskId,
			pageIndex,
			`${pageSize}?query=`
		]);

		this.setState({
			data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
			loading: false,
			loadingMore: false,
			refreshing: false,
		});
	}

	loadMore = () => {
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
		});
	}

	onApproveReschedule = (isApprove, extendId, deadline) => {
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
		let statusText = 'Chưa phê duyệt',
			statusStyle = styles.notConfirmText;
		if (item.IS_APPROVED) {
			statusText = 'Đồng ý';
			statusStyle = styles.approveText;
		}
		else if (item.IS_APPROVED == false) {
			statusText = 'Từ chối';
			statusStyle = styles.denyText;
		}

		let rightIcon = null;
		if (this.state.canApprove && util.isNull(item.IS_APPROVED)) {
			rightIcon = (
				<View style={{ flexDirection: 'column' }}>
					<Icon name='check' onPress={() => this.onApproveReschedule(true, item.ID, item.HANKETHUC)} size={moderateScale(35, 1.04)} color={COMMON_COLOR.GREEN_PANTON_376C} type='material-community' />
					<Icon name='close' onPress={() => this.onApproveReschedule(false, item.ID, item.HANKETHUC)} size={moderateScale(35, 1.04)} color={COMMON_COLOR.RED_PANTONE_186C} type='material-community' />
				</View>
			);
		}

		return (
			<ListItem
				containerStyle={{ borderBottomColor: COMMON_COLOR.GRAY, borderBottomWidth: .7 }}
				subtitle={
					<View style={{ marginLeft: scale(8) }}>
						<ColumnedListItem
							leftText='Xin lùi đến ngày'
							rightText={convertDateToString(item.HANKETHUC)}
						/>
						<ColumnedListItem
							isRender={item.IS_APPROVED}
							leftText='Đồng ý tới ngày'
							rightText={convertDateToString(item.HANKETTHUC_LANHDAODUYET)}
						/>
						<ColumnedListItem
							isRender={!!item.NOIDUNG}
							leftText='Lý do'
							rightText={item.NOIDUNG}
						/>
						<ColumnedListItem
							isRender={!!item.BUTPHELANHDAO}
							leftText='Nội dung phê duyệt'
							rightText={item.BUTPHELANHDAO}
						/>
						<ColumnedListItem
							leftText='Trạng thái'
							rightText={statusText}
							customRightText={statusStyle}
						/>
					</View>
				}
				hideChevron={rightIcon == null}
				rightIcon={rightIcon}
			/>
		)
	}

	componentDidMount = () => {
		this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
			if (this.props.extendsNavParams.hasOwnProperty("check")) {
				if (this.props.extendsNavParams.check === true) {
					this.setState({
						loading: true
					}, () => {
						this.fetchData();
					});
					this.props.updateExtendsNavParams({ check: false });
				}
			}
		});
	}

	componentWillUnmount = () => {
		this.willFocusListener.remove();
	}

	navigateBackToDetail = () => {
		this.props.navigation.goBack();
	}

	render() {
		let bodyContent = null;
		const { loading, data, refreshing, loadingMore } = this.state;
		if (loading) {
			bodyContent = dataLoading(true);
		} else {
			bodyContent = (
				<FlatList
					data={data}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this.renderItem}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={this.handleRefresh}
							title='Kéo để làm mới'
							COMMON_COLOR={[COMMON_COLOR.BLUE_PANTONE_640C]}
							tintColor={[COMMON_COLOR.BLUE_PANTONE_640C]}
							titleColor='red'
						/>
					}
					ListEmptyComponent={() => emptyDataPage()}
					ListFooterComponent={() => (<MoreButton
						isLoading={loadingMore}
						isTrigger={data.length >= DEFAULT_PAGE_SIZE}
						loadmoreFunc={this.loadMore}
					/>)}
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
							LỊCH SỬ LÙI HẠN
						</Title>
					</Body>
					<Right style={NativeBaseStyle.right}></Right>
				</Header>

				<Content contentContainerStyle={{ flex: 1 }}>
					{
						bodyContent
					}
				</Content>
				{
					executeLoading(this.state.executing)
				}
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	notConfirmText: {
		color: '#FF6600'
	}, approveText: {
		color: '#337321'
	}, denyText: {
		color: '#FF0033'
	},
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