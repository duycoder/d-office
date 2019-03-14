/*
	@description: màn hình phản hồi văn bản cần review
	@author: duynn
	@since: 16/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
    Alert, ActivityIndicator, View, Text, Modal,
    FlatList, TouchableOpacity, Image,
    StyleSheet, DatePickerAndroid
} from 'react-native';

//constant
import {
    API_URL, HEADER_COLOR, EMPTY_STRING, Colors
} from '../../../common/SystemConstant';

//native-base
import {
    Form, Button, Icon as NBIcon, Text as NBText, Item, Input, Title, Picker, Toast,
    Container, Header, Content, Left, Right, Body, CheckBox, Label, Textarea,
    Tab, Tabs, TabHeading, ScrollableTab, List as NBList, ListItem as NBListItem, Radio
} from 'native-base';

//react-native-elements
import { ListItem, Icon, Slider } from 'react-native-elements';
//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { MenuStyle, MenuOptionStyle } from '../../../assets/styles/MenuPopUpStyle';
import { TabStyle } from '../../../assets/styles/TabStyle';

import { dataLoading, executeLoading } from '../../../common/Effect';
import { asyncDelay, backHandlerConfig, appGetDataAndNavigate, unAuthorizePage, openSideBar, convertDateToString } from '../../../common/Utilities';

//lib
import { connect } from 'react-redux';
import renderIf from 'render-if';
import * as util from 'lodash';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

import * as workflowAction from '../../../redux/modules/Workflow/Action';

import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

class WorkflowReplyReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,

            docId: this.coreNavParams.docId,
            docType: this.coreNavParams.docType,

            itemType: this.extendsNavParams.itemType,
            message: EMPTY_STRING,
            selected: 1,
            executing: false
        }
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    componentDidMount = () => {
        // backHandlerConfig(true, this.navigateBack);
    }

    componentWillUnmount = () => {
        // backHandlerConfig(false, this.navigateBack);
    }

    navigateBack = () => {
        this.props.navigation.goBack();
    }

    onConfirmReplyReview() {
        if (util.isNull(this.state.message) || util.isEmpty(this.state.message)) {
            Toast.show({
                text: 'Vui lòng nhập nội dung phản hồi',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        } else {
            Alert.alert(
                'XÁC NHẬN PHẢN HỒI',
                'Bạn có chắc chắn muốn thực hiện việc này?',
                [
                    {
                        text: 'Đồng ý', onPress: () => {
                            this.saveReplyReview();
                        }
                    },

                    {
                        text: 'Hủy bỏ', onPress: () => {

                        }
                    }
                ]
            )
        }
    }

    async saveReplyReview() {
        this.setState({
            executing: true
        });
        const url = `${API_URL}/api/VanBanDi/SaveReplyReview`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });
        const body = JSON.stringify({
            userID: this.state.userId,
            phanHoiVanBan: this.state.message,
            pheDuyetVanBan: this.state.selected,
            itemId: this.state.docId,
            itemType: this.state.itemType
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

        if (!util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
            const message = this.props.userInfo.Fullname + " đã trả lời yêu cầu review 1 văn bản";
            const content = {
                title: 'TRẢ LỜI REVIEW VĂN BẢN',
                message,
                isTaskNotification: false,
                targetScreen: 'VanBanDiDetailScreen',
                targetDocId: this.state.docId,
                targetDocType: this.state.docType
            }
            resultJson.GroupTokens.forEach(token => {
                pushFirebaseNotify(content, token, "notification");
            });

            this.props.updateExtendsNavParams({ check: true });
        }

        Toast.show({
            text: resultJson.Status ? 'Phản hồi yêu cầu review thành công' : 'Phản hồi yêu cầu review không thành công',
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 5000,
            onClose: () => {
                this.props.resetProcessUsers();
                if (resultJson.Status) {
                    this.navigateBack();
                }
            }
        });
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBack()}>
                            <Icon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type="ionicon" />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            REVIEW VĂN BẢN TRÌNH KÝ
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right}>
                        <Button transparent>
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Nội dung phản hồi</Label>
                            <Input onChangeText={(message) => this.setState({ message })} />
                        </Item>

                        <Item stackedLabel>
                            <Label>Đánh giá</Label>
                            <Picker mode='dropdown'
                                iosHeader='Chọn kết quả đánh giá'
                                iosIcon={<NBIcon name='ios-arrow-down-outline' />}
                                style={{ width: '100%' }}
                                selectedValue={this.state.selected}
                                onValueChange={this.onValueChange.bind(this)}>
                                <Picker.Item label='Đồng ý' value='1' />
                                <Picker.Item label='Trả lại' value='0' />
                            </Picker>
                        </Item>

                        <Button block style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }} onPress={() => this.onConfirmReplyReview()}>
                            <NBText>
                                PHẢN HỒI YÊU CẦU
                            </NBText>
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
        resetProcessUsers: () => dispatch(workflowAction.resetProcessUsers()),
        updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowReplyReview);