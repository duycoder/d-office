/*
    @description: phê duyệt tiến độ công việc
    @author: duynn
    @since: 15/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
    View as RnView, Text as RnText, TouchableOpacity
} from 'react-native'
//lib
import {
    Container, Header, Left, Body, Right,
    Icon, Title, Text, Form, Item, Label,
    Picker, Button, Toast, Content,
    Textarea
} from 'native-base';


//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//utilities
import { API_URL, EMPTY_STRING, Colors, TOAST_DURATION_TIMEOUT } from '../../../common/SystemConstant';
import { asyncDelay, pickerFormat, showWarningToast } from '../../../common/Utilities';
import { executeLoading } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import * as util from 'lodash';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { AlertMessage, GoBackButton } from '../../common';
import AlertMessageStyle from '../../../assets/styles/AlertMessageStyle';
import AccountStyle from '../../../assets/styles/AccountStyle';

class ApproveProgressTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,

            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,

            content: EMPTY_STRING,
            selectedValue: '1',

            executing: false,
            focusId: EMPTY_STRING,
        }
    }

    onValueChange(value) {
        this.setState({
            selectedValue: value
        })
    }

    navigateBackToDetail = () => {
        this.props.navigation.goBack();
    }

    //kiểm tra chắc chắn phê duyệt tiến độ công việc
    onConfirmApproveCompleteTask = () => {
        if (util.isNull(this.state.content) || util.isEmpty(this.state.content)) {
            showWarningToast('Vui lòng nhập nội dung phản hồi');
        } else {
            this.refs.confirm.showModal();
        }
    }

    //phản hồi tiến độ công việc
    onApproveCompleteTask = async () => {
        this.refs.confirm.closeModal();
        this.setState({
            executing: true
        })

        const url = `${API_URL}/api/HscvCongViec/SaveApproveCompleteTask`;

        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        });

        const body = JSON.stringify({
            userId: this.state.userId,
            taskId: this.state.taskId,
            approveCompleteResult: this.state.selectedValue,
            content: this.state.content
        })

        const result = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        const resultJson = await result.json();

        await asyncDelay();

        this.setState({
            executing: false
        });

        Toast.show({
            text: resultJson.Status ? 'Phản hồi tiến độ công việc thành công' : resultJson.Message,
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

    render() {

        return (
            <Container>
                <Header style={NativeBaseStyle.container}>
                    <Left style={NativeBaseStyle.left}>
                        <GoBackButton onPress={() => this.navigateBackToDetail()} />
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            PHẢN HỒI TIẾN ĐỘ CÔNG VIỆC
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right} />
                </Header>

                <Content contentContainerStyle={AccountStyle.mainContainer}>
                    <Form>
                        <Item stackedLabel style={{ marginHorizontal: verticalScale(18) }}>
                            <Label>Nội dung phản hồi <Text style={{ color: '#f00' }}>*</Text></Label>
                            <Textarea
                                rowSpan={5}
                                style={{ width: '100%', marginTop: 20 }}
                                value={this.state.content}
                                bordered
                                onChangeText={(content) => this.setState({ content })}
                                onFocus={() => this.setState({ focusId: "content" })}
                                onBlur={() => this.setState({ focusId: EMPTY_STRING })}
                            />
                        </Item>

                        <Item stackedLabel>
                            <Label>
                                Đánh giá kết quả
                            </Label>

                            <Picker
                                iosHeader='Chọn kết quả đánh giá'
                                iosIcon={<Icon name='ios-arrow-down' type="Ionicons" />}
                                style={{ width: pickerFormat() }}
                                selectedValue={this.state.selectedValue}
                                onValueChange={this.onValueChange.bind(this)}
                                mode='dropdown'>
                                <Picker.Item label='Duyệt' value='1' />
                                <Picker.Item label='Trả về' value='0' />
                            </Picker>
                        </Item>

                        <Button block danger
                            style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                            onPress={() => this.onConfirmApproveCompleteTask()}>
                            <Text>
                                PHẢN HỒI
                            </Text>
                        </Button>
                    </Form>
                </Content>

                <AlertMessage
                    ref="confirm"
                    title="XÁC NHẬN PHẢN HỒI"
                    bodyText="Bạn có chắc chắn muốn thực hiện việc này?"
                    exitText="HỦY BỎ"
                >
                    <RnView style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onApproveCompleteTask()} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                ĐỒNG Ý
                            </RnText>
                        </TouchableOpacity>
                    </RnView>
                </AlertMessage>

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
        coreNavParams: state.navState.coreNavParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveProgressTask);