/*
    @description: cập nhật tiến độ công việc
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
    Container, Header, Left, Text, Content, Label, Toast,
    Body, Right, Icon, Title, Button, Form, Item, Input
} from 'native-base';
import { Icon as RneIcon } from 'react-native-elements';
import Slider from 'react-native-slider';
import * as util from 'lodash';

//utilities
import {
    API_URL, HEADER_COLOR, EMPTY_STRING, LOADER_COLOR, Colors
} from '../../../common/SystemConstant';
import { asyncDelay, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { executeLoading } from '../../../common/Effect';
import { verticalScale, scale, moderateScale } from '../../../assets/styles/ScaleIndicator';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import GoBackButton from '../../common/GoBackButton';
import AccountStyle from '../../../assets/styles/AccountStyle';




class UpdateProgressTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,

            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,

            oldProgressValue: this.props.extendsNavParams.oldProgressValue,
            progressValue: this.props.extendsNavParams.progressValue,
            progressValueStr: this.props.extendsNavParams.progressValue.toString(),
            comment: EMPTY_STRING,

            executing: false,
        }
    }

    onUpdateProgressTask = async () => {
        if (util.isNull(this.state.progressValueStr) || util.isEmpty(this.state.progressValueStr)) {
            Toast.show({
                text: 'Vui lòng nhập phần trăm hoàn thành công việc',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        }
        else if (util.isNull(this.state.comment) || util.isEmpty(this.state.comment)) {
            Toast.show({
                text: 'Vui lòng nhập nội dung',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        } else {
            this.setState({
                executing: true
            })

            const url = `${API_URL}/api/HscvCongViec/UpdateProgressTask`;
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            });
            const body = JSON.stringify({
                userId: this.state.userId,
                taskId: this.state.taskId,
                percentComplete: this.state.progressValue,
                comment: this.state.comment
            });

            const result = await fetch(url, {
                method: 'POST',
                headers,
                body
            });

            const resultJson = await result.json();

            await asyncDelay(2000);

            this.setState({
                executing: false
            });

            Toast.show({
                text: resultJson.Status ? 'Cập nhật tiến độ công việc thành công' : resultJson.Message,
                type: resultJson.Status ? 'success' : 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
                duration: 3000,
                onClose: () => {
                    if (resultJson.Status) {
                        this.props.updateExtendsNavParams({ check: true });
                        this.navigateBackToDetail();
                    }
                }
            });
        }
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

    onSliderChange = (value) => {
        this.setState({
            progressValue: value,
            progressValueStr: value.toString()
        })
    }

    onInputChange = (value) => {
        this.setState({
            progressValueStr: value
        });

        if (!util.isNull(value) && !util.isEmpty(value) && !isNaN(value)) {
            let finalValue = parseInt(value);
            if (finalValue > 100) {
                finalValue = 100;
                this.setState({
                    progressValueStr: '100'
                });
            }

            this.setState({
                progressValue: finalValue
            })
        } else {
            this.setState({
                progressValue: 0
            })
        }
    }


    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <GoBackButton onPress={() => this.navigateBackToDetail()} />
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            CẬP NHẬT TIẾN ĐỘ
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right}>
                    </Right>
                </Header>

                <Content contentContainerStyle={AccountStyle.mainContainer}>
                    <Slider
                        step={1}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={Colors.LITE_BLUE}
                        maximumTrackTintColor={Colors.WHITE}
                        value={this.state.progressValue}
                        onValueChange={value => this.onSliderChange(value)}
                        thumbStyle={{
                            height: verticalScale(50),
                            width: scale(25),
                            backgroundColor: Colors.WHITE,
                            borderRadius: 4,
                            borderColor: Colors.GRAY,
                            borderWidth: 1
                        }}
                        trackStyle={{
                            height: verticalScale(30),
                            borderWidth: 1,
                            borderColor: Colors.GRAY
                        }}

                        style={{
                            borderRadius: 4,
                            marginHorizontal: scale(5),
                            marginVertical: verticalScale(50),
                            height: verticalScale(50),

                        }} />

                    <Form>
                        <Item stackedLabel>
                            <Label>Tiến độ hiện tại (%)</Label>
                            <Input value={this.state.oldProgressValue.toString()}
                                editable={false} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Tiến độ cập nhật (%)</Label>
                            <Input value={this.state.progressValueStr}
                                keyboardType='numeric' maxLength={3}
                                onChangeText={value => this.onInputChange(value)} />
                        </Item>

                        <Item stackedLabel>
                            <Label>Nội dung <Text style={{ color: '#f00' }}>*</Text></Label>
                            <Input value={this.state.comment} onChangeText={(comment) => this.setState({ comment })} />
                        </Item>

                        <Button block danger
                            style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                            onPress={() => this.onUpdateProgressTask()}>
                            <Text>
                                CẬP NHẬT
                            </Text>
                        </Button>
                    </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProgressTask);