/**
 * @description: màn hình đồng ý gia hạn công việc
 * @author: duynn
 * @since: 12/06/2018
 */
'use strict'

import React, { Component } from 'react'

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
    Container, Header, Left, Right, Title, Item, Toast,
    Button, Text, Body, Form, Label, Input, Textarea, Content
} from 'native-base';

import {
    Icon as RneIcon
} from 'react-native-elements';

import DatePicker from 'react-native-datepicker';
import * as util from 'lodash';

//utilities
import { executeLoading } from '../../../common/Effect';
import { API_URL, Colors, EMPTY_STRING, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { asyncDelay, convertDateToString, convertDateTimeToString, formatMessage } from '../../../common/Utilities';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';
import GoBackButton from '../../common/GoBackButton';
import { DatePickerCustomStyle, CustomStylesDatepicker } from '../../../assets/styles';

class ApproveRescheduleTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userInfo.ID,

            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,

            // canApprove: props.extendsNavParams.canApprove,
            deadlineRequest: props.extendsNavParams.deadline,
            deadlineApprove: props.extendsNavParams.deadline,
            extendId: props.extendsNavParams.extendId,

            executing: false,
            message: EMPTY_STRING
        }
    }

    onSelectDate = (dateValue) => {
        if (!util.isNull(dateValue)) {
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

        await asyncDelay();

        this.setState({
            executing: false
        })

        Toast.show({
            text: resultJson.Status ? 'Phê duyệt thành công yêu cầu lùi hạn' : resultJson.Message,
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: TOAST_DURATION_TIMEOUT,
            onClose: () => {
                if (resultJson.Status) {
                    this.props.updateExtendsNavParams({ check: true });
                    this.navigateBack();
                }
            }
        });
    }

    navigateBack = () => {
        this.props.navigation.goBack();
    }
    render() {
        return (
            <Container>
                <Header style={NativeBaseStyle.container}>
                    <Left style={NativeBaseStyle.left}>
                        <GoBackButton onPress={() => this.navigateBack()}/>
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
                                style={DatePickerCustomStyle.containerStyle}
                                date={new Date(this.state.deadlineApprove)}
                                mode="date"
                                placeholder='Ngày lãnh đạo đồng ý cho lùi hạn'
                                format='DD/MM/YYYY'
                                minDate={new Date()}
                                confirmBtnText='CHỌN'
                                cancelBtnText='BỎ'
                                customStyles={CustomStylesDatepicker}
                                onDateChange={this.onSelectDate}
                            />
                        </Item>

                        <Item stackedLabel style={{ height: verticalScale(200), justifyContent: 'center' }}>
                            <Label>Phản hồi</Label>

                            <Textarea rowSpan={5} bordered style={{ width: '100%' }}
                                value={this.state.message}
                                onChangeText={message => this.setState({ message })} />
                        </Item>
                    </Form>

                    <Button block danger
                        style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ApproveRescheduleTask);
