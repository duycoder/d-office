/*
	@description: xin lùi hạn công việc
	@author: duynn
	@since: 15/05/2018
*/
'use strict'
import React, { Component } from 'react';
//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
    Container, Header, Left, Body, Right,
    Button, Title, Form, Item, Label,
    Input, Content, Text, Toast
} from 'native-base';
import * as util from 'lodash';
import DatePicker from 'react-native-datepicker';

//utilities
import { EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { asyncDelay, convertDateToString, showWarningToast } from '../../../common/Utilities';
import { executeLoading } from '../../../common/Effect';
import { scale, verticalScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { GoBackButton } from '../../common';
import AccountStyle from '../../../assets/styles/AccountStyle';
import { DatePickerCustomStyle } from '../../../assets/styles';
import { taskApi } from '../../../common/Api';


class RescheduleTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userInfo.ID,
            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,

            reason: EMPTY_STRING,
            currentDeadline: convertDateToString(props.extendsNavParams.currentDeadline),
            deadline: EMPTY_STRING,
            executing: false,
            chosenDate: null,
        }
    }

    setDate = (newDate) => {
        this.setState({
            chosenDate: newDate,
        })
    }

    navigateBackToDetail = () => {
        this.props.navigation.goBack();
    }

    onSaveExtendTask = async () => {
        if (util.isNull(this.state.chosenDate) || util.isEmpty(this.state.chosenDate)) {
            showWarningToast('Vui lòng nhập thời hạn xin lùi');
        } else if (util.isNull(this.state.reason) || util.isEmpty(this.state.reason)) {
            showWarningToast('Vui lòng nhập nguyên nhân xin lùi hạn');
        } else {
            this.setState({
                executing: true
            });

            const { taskId, userId, chosenDate, reason } = this.state;

            const resultJson = await taskApi().saveExtendTask({
                id: taskId,
                userId,
                extendDate: chosenDate,
                reason
            });

            await asyncDelay();

            this.setState({
                executing: false
            });

            //hiển thị kết quả xử lý
            Toast.show({
                text: resultJson.Status ? 'Gửi yêu cầu lùi hạn thành công' : resultJson.Message,
                type: resultJson.Status ? 'success' : 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
                duration: TOAST_DURATION_TIMEOUT,
                onClose: () => {
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
                <Header style={NativeBaseStyle.container} hasTabs>
                    <Left style={NativeBaseStyle.left}>
                        <GoBackButton onPress={() => this.navigateBackToDetail()} />
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            XIN LÙI HẠN
                        </Title>
                    </Body>
                    <Right style={NativeBaseStyle.right} />
                </Header>

                <Content contentContainerStyle={AccountStyle.mainContainer}>
                    <Form>
                        <Item stackedLabel>
                            <Label>Ngày hoàn thành mong muốn</Label>
                            <Input editable={false} value={this.state.currentDeadline} />
                        </Item>

                        <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
                            <Label>Xin lùi tới ngày <Text style={{ color: '#f00' }}>*</Text></Label>
                            <DatePicker
                                style={DatePickerCustomStyle.containerStyle}
                                date={this.state.chosenDate}
                                mode="date"
                                placeholder='Lùi tới ngày'
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
                                onDateChange={this.setDate}
                            />
                        </Item>

                        <Item stackedLabel>
                            <Label>Nguyên nhân xin lùi <Text style={{ color: '#f00' }}>*</Text></Label>
                            <Input value={this.state.reason}
                                onChangeText={(reason) => this.setState({ reason })} />
                        </Item>
                    </Form>

                    <Button block danger
                        style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                        onPress={() => this.onSaveExtendTask()}>
                        <Text>
                            LÙI HẠN CÔNG VIỆC
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

export default connect(mapStateToProps, mapDispatchToProps)(RescheduleTask);
