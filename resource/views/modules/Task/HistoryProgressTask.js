/*
	@description: lịch sử cập nhật tiến độ công việc
	@author: duynn
	@since: 15/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
	FlatList, RefreshControl, View, Text
} from 'react-native';
//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
	Container, Header, Left, Content,
	Body, Title, Right,
} from 'native-base';
import {
	ListItem,
} from 'react-native-elements';

//utilities
import {
	EMPTY_STRING,
	DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, COMMON_COLOR
} from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';
import { emptyDataPage, convertDateTimeToString } from '../../../common/Utilities';

//styles
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { MoreButton, GoBackButton, ColumnedListItem } from '../../common';
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
			filterValue: EMPTY_STRING,
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
		const { taskId, pageIndex, pageSize, filterValue } = this.state;
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
			<ListItem
				containerStyle={{ borderBottomColor: COMMON_COLOR.GRAY, borderBottomWidth: .7 }}
				leftIcon={
					<View>
						<Text style={{ fontWeight: "bold", fontSize: moderateScale(23, 0.89) }}>{item.TIENDOCONGVIEC + '%'}</Text>
					</View>
				}
				subtitle={
					<View style={{ marginLeft: moderateScale(18, 1.04) }}>
						<ColumnedListItem
							leftText='Thời gian'
							rightText={convertDateTimeToString(item.NGAYCAPNHATTIENDO)}
							leftContainerWidth={25}
							rightContainerWidth={75}
						/>
						<ColumnedListItem
							isRender={!!item.NOIDUNG}
							leftText='Nội dung'
							rightText={item.NOIDUNG}
							leftContainerWidth={25}
							rightContainerWidth={75}
						/>
					</View>
				}
				hideChevron
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
							COMMON_COLOR={[COMMON_COLOR.BLUE_PANTONE_640C]}
							tintColor={[COMMON_COLOR.BLUE_PANTONE_640C]}
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
			</Container>
		);
	}
}

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