/*
	@description: tạo công việc con
	@author: duynn
	@since: 19/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { Platform } from 'react-native';
//lib
import {
	Container, Header, Left, Body, Content,
	Right, Item, Title, Text, Icon, Input,
	Button, Form, Picker, Toast, Label
} from 'native-base'
import { Icon as RneIcon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

//utilities
import { API_URL, HEADER_COLOR, EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';
import { asyncDelay, convertDateToString, backHandlerConfig, appGetDataAndNavigate, pickerFormat } from '../../../common/Utilities';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//style
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';
import GoBackButton from '../../common/GoBackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { taskApi } from '../../../common/Api';
import { DatePickerCustomStyle } from '../../../assets/styles';

class CreateSubTask extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: props.userInfo.ID,

			taskId: props.coreNavParams.taskId,
			taskType: props.coreNavParams.taskType,

			deadline: EMPTY_STRING,
			content: EMPTY_STRING,
			listPriority: props.extendsNavParams.listPriority,
			listUrgency: props.extendsNavParams.listUrgency,
			priorityValue: props.extendsNavParams.priorityValue, //độ ưu tiên
			urgencyValue: props.extendsNavParams.urgencyValue, //đô khẩn
			planValue: '0', //lập kế hoạch 

			executing: false,
			chosenDate: null
		}
	}

	setDate = (newDate) => {
		this.setState({
			chosenDate: newDate,
		})
	}

	onPriorityValueChange(value) {
		this.setState({
			priorityValue: value
		})
	}

	onUrgencyValueChange(value) {
		this.setState({
			urgencyValue: value
		})
	}

	onPlanValueChange(value) {
		this.setState({
			planValue: value
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

	onCreateSubTask = async () => {
		const {
			taskId, content, priorityValue, urgencyValue, chosenDate, planValue
		} = this.state;

		if (util.isNull(content) || util.isEmpty(content)) {
			Toast.show({
				text: 'Vui lòng nhập nội dung',
				type: 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: Colors.LITE_BLUE },
			});
		} else if (util.isNull(chosenDate) || util.isEmpty(chosenDate)) {
			Toast.show({
				text: 'Vui lòng nhập thời hạn xử lý',
				type: 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: Colors.LITE_BLUE },
			});
		} else {
			this.setState({
				executing: true
			});
			
			const resultJson = await taskApi().saveSubTask({
				beginTaskId: taskId,
				taskContent: content,
				priority: priorityValue,
				urgency: urgencyValue,
				deadline: chosenDate,
				isHasPlan: planValue == '1'
			});

			this.setState({
				executing: false
			});

			Toast.show({
				text: resultJson.Status ? 'Tạo công việc con thành công' : 'Tạo công việc con không thành công',
				type: resultJson.Status ? 'success' : 'danger',
				buttonText: "OK",
				buttonStyle: { backgroundColor: Colors.WHITE },
				buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
				duration: TOAST_DURATION_TIMEOUT,
				onClose: () => {
					if (resultJson.Status) {
						this.props.updateExtendsNavParams({
							check: true,
							from: "createSubTask"
						});
						this.navigateBackToDetail();
					}
				}
			});
		}

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
							TẠO CÔNG VIỆC CON
						</Title>
					</Body>

					<Right style={NativeBaseStyle.right} />
				</Header>
				<KeyboardAwareScrollView contentContainerStyle={{ margin: 5, padding: 5 }}>
					<Form style={{ marginVertical: 10 }}>
						<Item stackedLabel>
							<Label>
								Nội dung công việc <Text style={{ color: '#f00' }}>*</Text>
							</Label>

							<Input value={this.state.content} onChangeText={(content) => this.setState({ content })} />
						</Item>

						<Item stackedLabel>
							<Label>Độ ưu tiên</Label>
							<Picker
								iosHeader='Chọn độ ưu tiên'
								mode='dropdown'
								iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
								style={{ width: pickerFormat() }}
								selectedValue={this.state.priorityValue} //sai chinh ta @@
								onValueChange={this.onPriorityValueChange.bind(this)}>
								{
									this.state.listPriority.map((item, index) => (
										<Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
									))
								}
							</Picker>
						</Item>

						<Item stackedLabel>
							<Label>Mức độ quan trọng</Label>
							<Picker
								iosHeader='Chọn mức quan trọng'
								mode='dropdown'
								iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
								style={{ width: pickerFormat() }}
								selectedValue={this.state.urgencyValue}
								onValueChange={this.onUrgencyValueChange.bind(this)}>
								{
									this.state.listUrgency.map((item, index) => (
										<Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
									))
								}
							</Picker>
						</Item>

						{
							// <Item stackedLabel>
							// 	<Label>Lập kế hoạch</Label>
							// 	<Picker
							// 		iosHeader='Chọn mức quan trọng'
							// 		mode='dropdown'
							// 		iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
							// 		style={{ width: pickerFormat() }}
							// 		selectedValue={this.state.planValue}
							// 		onValueChange={this.onPlanValueChange.bind(this)}>
							// 		<Picker.Item value="1" label="Có" />
							// 		<Picker.Item value="0" label="Không" />
							// 	</Picker>
							// </Item>
						}

						<Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
							<Label>Hạn hoàn thành <Text style={{ color: '#f00' }}>*</Text></Label>
							<DatePicker
								style={DatePickerCustomStyle.containerStyle}
								date={this.state.chosenDate}
								mode="date"
								placeholder='Hạn hoàn thành'
								format='DD/MM/YYYY'
								minDate={new Date()}
								confirmBtnText='CHỌN'
								cancelBtnText='BỎ'
								customStyles={{
									dateIcon: {
										position: 'absolute',
										left: 0,
										top: 4,
										marginLeft: 0
									},
									dateInput: {
										marginLeft: scale(36),
									}
								}}
								onDateChange={this.setDate}
							/>
						</Item>

						<Button block danger
							style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
							onPress={() => this.onCreateSubTask()}>
							<Text>
								TẠO CÔNG VIỆC CON
							</Text>
						</Button>
					</Form>
				</KeyboardAwareScrollView>
				{
					// <Content contentContainerStyle={AccountStyle.mainContainer}>
					// 	<Form style={{ marginVertical: 10 }}>
					// 		<Item stackedLabel>
					// 			<Label>
					// 				Nội dung công việc <Text style={{ color: '#f00' }}>*</Text>
					// 			</Label>

					// 			<Input value={this.state.content} onChangeText={(content) => this.setState({ content })} />
					// 		</Item>

					// 		<Item stackedLabel>
					// 			<Label>Độ ưu tiên</Label>
					// 			<Picker
					// 				iosHeader='Chọn độ ưu tiên'
					// 				mode='dropdown'
					// 				iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
					// 				style={{ width: pickerFormat() }}
					// 				selectedValue={this.state.priorityValue} //sai chinh ta @@
					// 				onValueChange={this.onPriorityValueChange.bind(this)}>
					// 				{
					// 					this.state.listPriority.map((item, index) => (
					// 						<Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
					// 					))
					// 				}
					// 			</Picker>
					// 		</Item>

					// 		<Item stackedLabel>
					// 			<Label>Mức độ quan trọng</Label>
					// 			<Picker
					// 				iosHeader='Chọn mức quan trọng'
					// 				mode='dropdown'
					// 				iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
					// 				style={{ width: pickerFormat() }}
					// 				selectedValue={this.state.urgencyValue}
					// 				onValueChange={this.onUrgencyValueChange.bind(this)}>
					// 				{
					// 					this.state.listUrgency.map((item, index) => (
					// 						<Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
					// 					))
					// 				}
					// 			</Picker>
					// 		</Item>

					// 		{
					// 			// <Item stackedLabel>
					// 			// 	<Label>Lập kế hoạch</Label>
					// 			// 	<Picker
					// 			// 		iosHeader='Chọn mức quan trọng'
					// 			// 		mode='dropdown'
					// 			// 		iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
					// 			// 		style={{ width: pickerFormat() }}
					// 			// 		selectedValue={this.state.planValue}
					// 			// 		onValueChange={this.onPlanValueChange.bind(this)}>
					// 			// 		<Picker.Item value="1" label="Có" />
					// 			// 		<Picker.Item value="0" label="Không" />
					// 			// 	</Picker>
					// 			// </Item>
					// 		}

					// 		<Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
					// 			<Label>Hạn hoàn thành <Text style={{ color: '#f00' }}>*</Text></Label>
					// 			<DatePicker
					// 				style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
					// 				date={this.state.chosenDate}
					// 				mode="date"
					// 				placeholder='Hạn hoàn thành'
					// 				format='DD/MM/YYYY'
					// 				minDate={new Date()}
					// 				confirmBtnText='CHỌN'
					// 				cancelBtnText='BỎ'
					// 				customStyles={{
					// 					dateIcon: {
					// 						position: 'absolute',
					// 						left: 0,
					// 						top: 4,
					// 						marginLeft: 0
					// 					},
					// 					dateInput: {
					// 						marginLeft: scale(36),
					// 					}
					// 				}}
					// 				onDateChange={this.setDate}
					// 			/>
					// 		</Item>

					// 		<Button block danger
					// 			style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
					// 			onPress={() => this.onCreateSubTask()}>
					// 			<Text>
					// 				TẠO CÔNG VIỆC CON
					// 		</Text>
					// 		</Button>
					// 	</Form>
					// </Content>
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
		coreNavParams: state.navState.coreNavParams,
		extendsNavParams: state.navState.extendsNavParams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubTask);