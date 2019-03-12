/**
 * @description: màn hình chi tiết văn bản trình ký
 * @author: duynn
 * @since: 05/06/2018
 */
'use strict'
import React, { Component } from 'react';
import { View, Text as RNText, TouchableOpacity as RnButton } from 'react-native';
//redux
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

//utilities
import { API_URL, Colors } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import * as util from 'lodash';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';
//lib
import {
    Container, Header, Left, Button,
    Body, Icon, Title, Content, Form,
    Tabs, Tab, TabHeading, ScrollableTab,
    Text, Right, Toast
} from 'native-base';
import {
    Icon as RneIcon, ButtonGroup
} from 'react-native-elements';

import renderIf from 'render-if';

//views
import MainInfoPublishDoc from './Info';
import TimelinePublishDoc from './History';
import AttachPublishDoc from './Attachment';

import * as navAction from '../../../redux/modules/Nav/Action';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,
            loading: false,
            isUnAuthorize: false,
            docInfo: {},
            docId: this.props.coreNavParams.docId,
            docType: this.props.coreNavParams.docType,

            screenParam: {
                userId: this.props.userInfo.ID,
                docId: this.props.coreNavParams.docId,
                docType: this.props.coreNavParams.docType
            },
            executing: false
        };

        this.onNavigate = this.onNavigate.bind(this);
    }

    componentWillMount = () => {
        // backHandlerConfig(true, this.navigateBackToList);
        this.fetchData();

    }

    componentDidMount = () => {
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (this.props.extendsNavParams.hasOwnProperty("check")) {
                if (this.props.extendsNavParams.check === true) {
                    this.fetchData();
                }
            }
        })
    }

    componentWillUnmount = () => {
        this.willFocusListener.remove();
        // backHandlerConfig(false, this.navigateBackToList);
    }

    async fetchData() {
        this.setState({
            loading: true
        });

        const url = `${API_URL}/api/VanBanDen/GetDetail/${this.state.docId}/${this.state.userId}/0`;
        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            loading: false,
            docInfo: resultJson,
            isUnAuthorize: util.isNull(resultJson)
        });
    }

    navigateBackToList = () => {
        this.props.navigation.goBack();
    }

    navigateToBrief = () => {
        if (this.state.docInfo.hasOwnProperty("entityVanBanDen")) {
            this.props.navigation.navigate("VanBanDenBriefScreen");
            // appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "VanBanDenBriefScreen", targetScreenParam);
        }
    }

    onReplyReview() {
        const targetScreenParam = {
            itemType: this.state.docInfo.Process.ITEM_TYPE
        }

        this.onNavigate("WorkflowReplyReviewScreen", targetScreenParam)
        // appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowReplyReviewScreen", targetScreenParam);
    }

    onProcessDoc = async (item, isStepBack) => {
        let isProcessable = true;
        if (!isStepBack) {
            isProcessable = await this.onCheckFlow(item);
        }

        if (isProcessable == false) {
            Toast.show({
                text: 'Không thể kết thúc văn bản',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        } else {
            const targetScreenParam = {
                processId: this.state.docInfo.WorkFlow.Process.ID,
                stepId: item.ID,
                stepName: item.NAME,
                isStepBack,
                logId: (isStepBack == true) ? item.Log.ID : 0,
                apiUrlMiddle: 'VanBanDen'
            }
            this.onNavigate("WorkflowStreamProcessScreen", targetScreenParam);

            // appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowStreamProcessScreen", targetScreenParam);
        }
    }

    onCheckFlow = async (item) => {
        this.setState({ executing: true });

        const url = `${API_URL}/api/WorkFlow/CheckCanProcessFlow/${this.state.userId}/${this.state.docInfo.WorkFlow.Process.ID}/${item.ID}`;
        const result = await fetch(url).then(response => response.json());

        this.setState({ executing: false })

        if (result.IsNeedExecuteFunction) {
            return false;
        }

        return true;
    }

    onReviewDoc = (item) => {
        const targetScreenParam = {
            processId: this.state.docInfo.Process.ID,
            stepId: item.ID,
            isStepBack: false,
            stepName: 'GỬI REVIEW',
            logId: 0
        }
        this.onNavigate("WorkflowRequestReviewScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowRequestReviewScreen", targetScreenParam);
    }

    onSelectWorkFlowStep(item, isStepBack) {
        if (item.REQUIRED_REVIEW != true || this.state.docInfo.WorkFlow.Process.IS_PENDING == false) {
            this.onProcessDoc(item, isStepBack);
        } else {
            this.onReviewDoc(item);
        }
    }

    onNavigate(targetScreenName, targetScreenParam) {
        if (!util.isNull(targetScreenParam)) {
            this.props.updateExtendsNavParams(targetScreenParam);
        }
        this.props.navigation.navigate(targetScreenName);
    }

    render() {
        let bodyContent = null;
        let workflowButtons = [];
        if (this.state.loading) {
            bodyContent = dataLoading(true);
        }
        else if (this.state.isUnAuthorize) {
            bodyContent = unAuthorizePage(this.props.navigation);
        } else {
            if (this.state.docInfo.WorkFlow.REQUIRED_REVIEW) {
                workflowButtons.push({
                    element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onReplyReview()}><RNText style={ButtonGroupStyle.buttonText}>PHẢN HỒI</RNText></RnButton>
                })
            } else {
                if (!util.isNull(this.state.docInfo.WorkFlow.LstStepBack)) {
                    this.state.docInfo.WorkFlow.LstStepBack.forEach(item => {
                        workflowButtons.push({
                            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onSelectWorkFlowStep(item, true)}><RNText style={ButtonGroupStyle.buttonText}>{util.toUpper(item.NAME)}</RNText></RnButton>
                        })
                    })
                }

                if (!util.isNull(this.state.docInfo.WorkFlow.LstStep)) {
                    for (let i = 0; i < this.state.docInfo.WorkFlow.LstStep.length; i++) {
                        let item = this.state.docInfo.WorkFlow.LstStep[i];
                        if (item.REQUIRED_REVIEW == true) {
                            if (this.state.docInfo.WorkFlow.ReviewObj == null || this.state.docInfo.WorkFlow.ReviewObj.IS_FINISH != true || this.state.docInfo.ReviewObj.IS_REJECT == true) {
                                item.NAME = 'GỬI REVIEW';
                            }
                        }
                        workflowButtons.push({
                            element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onSelectWorkFlowStep(item, false)}><RNText style={ButtonGroupStyle.buttonText}>{util.toUpper(item.NAME)}</RNText></RnButton>
                        })
                    }
                }
            }
            bodyContent = <DetailContent docInfo={this.state.docInfo} docId={this.state.docId} buttons={workflowButtons} />
        }

        return (
            <Container>
                <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBackToList()}>
                            <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle} >
                            THÔNG TIN VĂN BẢN
                    </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right}>
                        <Button transparent onPress={() => this.navigateToBrief()}>
                            <RneIcon name='ios-paper' size={moderateScale(35)} color={Colors.WHITE} type='ionicon' />
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
        coreNavParams: state.navState.coreNavParams,
        extendsNavParams: state.navState.extendsNavParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

//THÔNG TIN VĂN BẢN
class DetailContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTabIndex: 0,
            docInfo: props.docInfo,
            docId: props.docId
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tabs
                    renderTabBar={() => <ScrollableTab />}
                    initialPage={this.state.currentTabIndex}
                    tabBarUnderlineStyle={TabStyle.underLineStyle}
                    onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-information-circle-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                THÔNG TIN
                                </Text>
                        </TabHeading>
                    }>
                        <MainInfoPublishDoc info={this.state.docInfo} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-attach-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                ĐÍNH KÈM
                            </Text>
                        </TabHeading>
                    }>
                        <AttachPublishDoc info={this.state.docInfo.groupOfTaiLieuDinhKems} docId={this.state.docId} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 3 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <RneIcon name='clock' color={Colors.DANK_BLUE} type='feather' />
                            <Text style={(this.state.currentTabIndex == 3 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                LỊCH SỬ XỬ LÝ
                            </Text>
                        </TabHeading>
                    }>
                        <TimelinePublishDoc info={this.state.docInfo} />
                    </Tab>
                </Tabs>

                {
                    renderIf(!util.isEmpty(this.props.buttons))(
                        <ButtonGroup
                            containerStyle={ButtonGroupStyle.container}
                            buttons={this.props.buttons}
                        />
                    )
                }
            </View>
        );
    }
}
