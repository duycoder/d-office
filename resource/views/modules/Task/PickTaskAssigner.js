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
	Right, Toast, ListItem as NbListItem, Radio, CheckBox
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
	TASK_PROCESS_TYPE, Colors, DEFAULT_PAGE_SIZE
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import AssignTaskJoinProcessUsers from './AssignTaskJoinProcessUsers';
import AssignTaskMainProcessUsers from './AssignTaskMainProcessUsers';
import GoBackButton from '../../common/GoBackButton';
import { taskApi } from '../../../common/Api';

const api = taskApi();

class PickTaskAssigner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,
			listRole: props.extendsNavParams.listRole,

			executing: false,
			loading: false,

			pageIndex: DEFAULT_PAGE_INDEX,
			pageSize: 10,
			isLoadmore: false,
			isSearch: false,

			data: [],
			giaoviecId: props.extendsNavParams.giaoviecId || 0,
			giaoviecName: props.extendsNavParams.giaoviecName || null,
			keyword: null,
		}
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = async (isLoadmore = false) => {
		this.setState({
			loading: isLoadmore ? false : true
		});

		const {
			userId, listRole,
			keyword, pageIndex, pageSize
		} = this.state;

		const resultJson = await api.getTaskAssigner({
			userId,
			listRole,
			keyword: keyword ? keyword.trim().toLowerCase() : EMPTY_STRING,
			pageIndex,
			pageSize,
		});

		this.setState({
			data: isLoadmore ? [...this.state.data, ...resultJson] : resultJson,
			loading: false,
			isLoadmore: isLoadmore && false
		})
	}

	navigateBack = () => {
		this.props.navigation.goBack();
	}

	onPickAssigner = () => {
		if (this.state.giaoviecId === 0) {
			Toast.show({
				text: 'Vui lòng chọn người giao việc',
				type: 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: Colors.LITE_BLUE },
			});
		} else {
			this.props.updateExtendsNavParams({ giaoviecId: this.state.giaoviecId, giaoviecName: this.state.giaoviecName });
			this.navigateBack();
		}
	}

	selectUser = (item) => {
		this.setState({
			giaoviecId: item.ID,
			giaoviecName: item.HOTEN
		});
	}

	renderMainAssigner = ({ item }) => {
		return (
			<NbListItem
				key={item.ID}
				onPress={() => this.selectUser(item)}
				style={{ height: verticalScale(70) }}
			>
				<Left>
					<Title>
						<Text>
							{item.HOTEN}
						</Text>
					</Title>
				</Left>

				<Body>
					<Text>
						{item.ChucVu}
					</Text>
				</Body>

				<Right>
					<CheckBox
						color={Colors.LITE_BLUE}
						checked={this.state.giaoviecId == item.ID}
						onPress={() => this.selectUser(item)}
					/>
				</Right>
			</NbListItem>
		);
	}

	onFilter = () => {
		this.setState({
			isSearch: true,
			pageIndex: DEFAULT_PAGE_INDEX
		}, () => this.fetchData());
	}
	clearFilter = () => {
		this.setState({
			isSearch: false,
			keyword: null,
		}, () => this.fetchData())
	}
	loadingMore = () => {
		this.setState({
			pageIndex: this.state.pageIndex + 1,
			isLoadmore: true
		}, () => this.fetchData(true));
	}

	render() {
		let unsubmitableCondition = this.state.giaoviecId === 0,
			checkButtonStyle = unsubmitableCondition ? { opacity: 0.6 } : { opacity: 1 };

		let bodyContent = null;

		if (this.state.loading) {
			bodyContent = dataLoading(true);
		}
		else {
			bodyContent = (
				<Content contentContainerStyle={{ flex: 1 }}>
					<Item>
						<Icon name='ios-search' />
						<Input placeholder={'Họ tên'}
							onSubmitEditing={() => this.onFilter(true)}
							value={this.state.keyword}
							onChangeText={(value) => this.setState({ keyword: value })}
						/>
						{
							this.state.keyword
								? <Icon name='ios-close-circle' onPress={() => this.clearFilter()} />
								: null
						}
					</Item>

					{

					}

					<FlatList
						data={this.state.data}
						keyExtractor={(item, index) => index.toString()}
						renderItem={this.renderMainAssigner}
						ListEmptyComponent={emptyDataPage()}
						ListFooterComponent={
							this.state.isLoadmore ?
								<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
								(
									this.state.data.length >= 5 ?
										<Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
											<Text>TẢI THÊM</Text>
										</Button>
										: null
								)
						}
					/>
				</Content>
			);
		}

		return (
			<Container>
				<Header style={NativeBaseStyle.container}>
					<Left style={NativeBaseStyle.left}>
						<GoBackButton onPress={() => this.navigateBack()} />
					</Left>

					<Body style={NativeBaseStyle.body}>
						<Title style={NativeBaseStyle.bodyTitle}>
							CHỌN NGƯỜI GIAO VIỆC
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right}>
						<Button transparent onPress={() => this.onPickAssigner()} style={checkButtonStyle} disabled={unsubmitableCondition}>
							<RneIcon name='md-checkmark' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
						</Button>
					</Right>
				</Header>
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
		extendsNavParams: state.navState.extendsNavParams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PickTaskAssigner);