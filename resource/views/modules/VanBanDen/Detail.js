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
import GoBackButton from '../../common/GoBackButton';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { HeaderMenuStyle } from '../../../assets/styles';
import { vanbandenApi } from '../../../common/Api';
const api = vanbandenApi();
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
            executing: false,

            check: false,
            hasAuthorization: props.hasAuthorization || 0,
            from: props.coreNavParams.from || "list", // check if send from `list` or `detail`
        };

        this.onNavigate = this.onNavigate.bind(this);
    }

    componentWillMount = () => {
        // backHandlerConfig(true, this.navigateBack);
        this.fetchData();

    }

    componentDidMount = () => {
        // console.tron.log(this.props.extendsNavParams)
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (this.props.extendsNavParams.hasOwnProperty("check")) {
                if (this.props.extendsNavParams.check === true) {
                    this.setState({ check: true }, () => this.fetchData());
                    this.props.updateExtendsNavParams({ check: false });
                }
            }
        })
    }

    componentWillUnmount = () => {
        this.willFocusListener.remove();
        // backHandlerConfig(false, this.navigateBack);
    }

    async fetchData() {
        this.setState({
            loading: true
        });

        const resultJson = await api.getDetail([
            this.state.docId,
            this.state.userId,
            this.state.hasAuthorization
        ]);

        this.setState({
            loading: false,
            docInfo: resultJson === null ? {} : resultJson,
            isUnAuthorize: util.isNull(resultJson)
        });
    }

    navigateBack = () => {
        if (this.state.docInfo.hasOwnProperty("entityVanBanDen")) { // done loading
            if (this.state.from === "list") {
                this.props.updateExtendsNavParams({ check: this.state.check })
            }
            else {
                this.props.updateExtendsNavParams({ from: "detail" });
            }
        }
        this.props.navigation.goBack();
    }

    navigateToBrief = () => {
        if (this.state.docInfo.hasOwnProperty("entityVanBanDen")) {
            this.props.navigation.navigate("VanBanDenBriefScreen");
        }
    }

    navigateToEvent = (eventId) => {
        if (eventId > 0) {
            this.props.navigation.navigate("DetailEventScreen", { id: eventId });
        }
        else {
            Toast.show({
                text: 'Không tìm thấy lịch công tác yêu cầu',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
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

        const result = await api.checkFlow([
            this.state.userId,
            this.state.docInfo.WorkFlow.Process.ID,
            item.ID
        ]);

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

    onCreateTask = () => {
        const targetScreenParam = {
            docId: this.state.docId,
            docType: this.state.docType,
        };
        this.onNavigate("CreateTaskScreen", targetScreenParam);
    }

    onSelectWorkFlowStep(item, isStepBack) {
        if (item.REQUIRED_REVIEW != true || this.state.docInfo.WorkFlow.Process.IS_PENDING == false) {
            this.onProcessDoc(item, isStepBack);
        } else {
            this.onReviewDoc(item);
        }
    }

    onSendCC() {
        const targetScreenParam = {
            // processId: this.state.docInfo.WorkFlow.Process.ID,
            // stepId: 0,
            idItem: this.state.docInfo.WorkFlow.Process.ITEM_ID,
            itemType: this.state.docInfo.WorkFlow.Process.ITEM_TYPE
        };
        this.onNavigate("WorkflowCCScreen", targetScreenParam);
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

            if (this.state.docInfo.canChuyenPhoihopXuly) {
                workflowButtons.push({
                    element: () => <RnButton style={ButtonGroupStyle.button} onPress={() => this.onSendCC()}><RNText style={ButtonGroupStyle.buttonText}>CHUYỂN XỬ LÝ</RNText></RnButton>
                });
            }

            bodyContent = <DetailContent docInfo={this.state.docInfo} docId={this.state.docId} buttons={workflowButtons} hasAuthorization={this.state.hasAuthorization} navigateToEvent={this.navigateToEvent} />
        }

        return (
            <MenuProvider backHandler>
                <Container>
                    <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
                        <Left style={NativeBaseStyle.left}>
                            <GoBackButton onPress={() => this.navigateBack()} />
                        </Left>

                        <Body style={NativeBaseStyle.body}>
                            <Title style={NativeBaseStyle.bodyTitle} >
                                THÔNG TIN VĂN BẢN
                    </Title>
                        </Body>

                        <Right style={NativeBaseStyle.right}>
                            <Menu>
                                <MenuTrigger children={<RneIcon name='ios-more' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />} />
                                <MenuOptions customStyles={HeaderMenuStyle.optionsStyles}>
                                    <MenuOption onSelect={() => this.navigateToBrief()} text="Hồ sơ văn bản" customStyles={HeaderMenuStyle.optionStyles} />
                                    <MenuOption onSelect={() => this.onCreateTask()} text="Tạo công việc" />
                                </MenuOptions>
                            </Menu>
                            {
                                // <Button transparent onPress={() => this.navigateToBrief()}>
                                //     <RneIcon name='ios-paper' size={moderateScale(35)} color={Colors.WHITE} type='ionicon' />
                                // </Button>
                            }
                        </Right>
                    </Header>
                    {
                        bodyContent
                    }
                    {
                        executeLoading(this.state.executing)
                    }
                </Container>
            </MenuProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
        coreNavParams: state.navState.coreNavParams,
        extendsNavParams: state.navState.extendsNavParams,
        hasAuthorization: state.navState.hasAuthorization
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
            docId: props.docId,
            hasAuthorization: props.hasAuthorization
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tabs
                    // renderTabBar={() => <ScrollableTab />}
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
                        <MainInfoPublishDoc info={this.state.docInfo} hasAuthorization={this.state.hasAuthorization} navigateToEvent={this.props.navigateToEvent} />
                    </Tab>

                    {
                        // <Tab heading={
                        //     <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                        //         <Icon name='ios-attach' style={TabStyle.activeText} />
                        //         <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
                        //             ĐÍNH KÈM
                        //     </Text>
                        //     </TabHeading>
                        // }>
                        //     <AttachPublishDoc info={this.state.docInfo.groupOfTaiLieuDinhKems} docId={this.state.docId} />
                        // </Tab>
                    }

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
