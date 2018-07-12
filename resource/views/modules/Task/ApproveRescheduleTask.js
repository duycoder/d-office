/**
 * @description: màn hình đồng ý gia hạn công việc
 * @author: duynn
 * @since: 12/06/2018
 */
'use strict'

import React, { Component } from 'react'

//redux
import { connect } from 'react-redux';

//lib
import {
    Container, Header, Left, Right, Title,Item, Toast,
    Button, Text, Body, Form, Label, Input, Textarea, Content
} from 'native-base';

import {
    Icon as RneIcon
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';
import * as util from 'lodash';

//utilities
import { executeLoading } from '../../../common/Effect';
import { API_URL, Colors, EMPTY_STRING } from '../../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { asyncDelay, convertDateToString, convertDateTimeToString } from '../../../common/Utilities';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

class ApproveRescheduleTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userInfo.ID,

            taskId: props.navigation.state.params.taskId,
            taskType: props.navigation.state.params.taskType,
            canApprove: props.navigation.state.params.canApprove,

            deadlineRequest: props.navigation.state.params.deadline,
            deadlineApprove: props.navigation.state.params.deadline,
            extendId: props.navigation.state.params.extendId,

            executing: false,
            message: EMPTY_STRING
        }
    }

    onSelectDate = (dateValue) => {
        if(!util.isNull(dateValue)){
            let split = dateValue.split('/');
            this.setState({
                deadlineApprove: new Date(split[2], split[1] - 1, split[0])
            });
        }
    }


    onApproveExtendTask = async () => {
        this.setState({
            executing: true
        });

        const url = `${API_URL}/api/HscvCongViec/ApproveExtendTask`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        });

        const body = JSON.stringify({
            id: this.state.extendId,
            userId: this.state.userId,
            extendDate: convertDateToString(this.state.deadlineApprove),
            message: this.state.message,
            status: 1
        });

        const result = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        const resultJson = await result.json();

        this.setState({
            executing: false
        })

        if (resultJson.Status == true && !util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
			const message = this.props.userInfo.Fullname + ' đã phê duyệt yêu cầu lùi hạn';
			const content = {
				title: 'PHÊ DUYỆT YÊU CẦU GIA HẠN CÔNG VIỆC',
				message,
				isTaskNotification: true,
				targetScreen: 'DetailTaskScreen',
				targetTaskId: this.state.taskId,
				targetTaskType: this.state.taskType
			}

			resultJson.GroupTokens.forEach(token => {
				pushFirebaseNotify(content, token, 'notification');
			})
		}

		Toast.show({
			text: resultJson.Status ? 'Phê duyệt thành công yêu cầu lùi hạn' : resultJson.Message,
			type: resultJson.Status ? 'success' : 'danger',
			buttonText: "OK",
			buttonStyle: { backgroundColor: Colors.WHITE },
			buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
			duration: 3000,
			onClose: () => {
				if (resultJson.Status) {
					this.navigateBack();
				}
			}
		});
    }

    navigateBack = () => {
        this.props.navigation.navigate('HistoryRescheduleTaskScreen', {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            canApprove: this.state.canApprove
        })
    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBack()}>
                            <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            ĐỒNG Ý GIA HẠN
                        </Title>
                    </Body>
                    <Right style={NativeBaseStyle.right}></Right>
                </Header>

                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Xin lùi tới ngày</Label>
                            <Input editable={false} value={convertDateToString(this.state.deadlineRequest)} />
                        </Item>

                        <Item stackedLabel style={{ height: verticalScale(100), alignItems: 'center', justifyContent: 'center' }}>
                            <Label>Ngày lãnh đạo đồng ý cho lùi hạn</Label>
                            <DatePicker
                                style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                                date={new Date(this.state.deadlineApprove)}
                                mode="date"
                                placeholder='Ngày lãnh đạo đồng ý cho lùi hạn'
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
                                        marginLeft: scale(36)
                                    }
                                }}
                                onDateChange={this.onSelectDate}
                            />
                        </Item>

                        <Item stackedLabel style={{ height: verticalScale(200), justifyContent: 'center'}}>
                            <Label>Phản hồi</Label>

                            <Textarea rowSpan={5} bordered style={{width: '100%'}}
                                value={this.state.message}
                                onChangeText={message => this.setState({ message })} />
                        </Item>
                    </Form>

                    <Button block danger
                        style={{ backgroundColor: Colors.RED_PANTONE_186C, marginTop: verticalScale(20) }}
                        onPress={() => this.onApproveExtendTask()}>
                        <Text>
                            PHÊ DUYỆT
                        </Text>
                    </Button>
                </Content>

                {
                    executeLoading(this.state.executing)
                }
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(ApproveRescheduleTask);



