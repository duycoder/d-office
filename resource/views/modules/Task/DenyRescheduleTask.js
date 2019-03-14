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
    Container, Header, Left, Right, Title, Toast, Form,
    Button, Text, Body, Textarea, Item, Label, Content
} from 'native-base';

import {
    Icon as RneIcon
} from 'react-native-elements';
import * as util from 'lodash';

//utilities
import { executeLoading } from '../../../common/Effect';
import { API_URL, Colors, EMPTY_STRING } from '../../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

class DenyRescheduleTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userInfo.ID,

            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,
            // canApprove: props.navigation.state.params.canApprove,

            extendId: props.extendsNavParams.extendId,

            message: EMPTY_STRING,
            executing: false
        }
    }

    onDenyExtendTask = async () => {
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
            extendDate: null,
            message: this.state.message,
            status: 0
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
            });

            this.props.updateExtendsNavParams({ check: true });
        }

        Toast.show({
            text: resultJson.Status ? 'Phê duyệt thành công yêu cầu lùi hạn' : resultJson.Message,
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (resultJson.Status) {
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
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBack()}>
                            <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            TỪ CHỐI GIA HẠN
                        </Title>
                    </Body>
                    <Right style={NativeBaseStyle.right}></Right>
                </Header>

                <Content>
                    <Form>
                        <Item stackedLabel style={{ height: verticalScale(200), justifyContent: 'center' }}>
                            <Label>Lý do từ chối gia hạn</Label>

                            <Textarea rowSpan={5} bordered style={{ width: '100%' }}
                                value={this.state.message}
                                onChangeText={message => this.setState({ message })} />
                        </Item>
                    </Form>

                    <Button block danger
                        style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                        onPress={() => this.onDenyExtendTask()}>
                        <Text>
                            TỪ CHỐI
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

export default connect(mapStateToProps, mapDispatchToProps)(DenyRescheduleTask);



