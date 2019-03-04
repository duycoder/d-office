/**
 * @description: chi tiết văn bản trình ký
 * @author: duynn
 * @since: 03/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { View, Text as RNText, TouchableOpacity as RNButton } from 'react-native';
//redux
import { connect } from 'react-redux';

//utilities
import { API_URL, Colors } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import * as util from 'lodash';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';

//lib
import {
    Container, Header, Left, Button,
    Body, Icon, Title, Content, Form,
    Tabs, Tab, TabHeading, ScrollableTab,
    Text, Right
} from 'native-base';
import { MenuProvider } from 'react-native-popup-menu'
import {
    Icon as RneIcon, ButtonGroup
} from 'react-native-elements';
import renderIf from 'render-if';

//views
import MainInfoSignDoc from './Info';
import TimelineSignDoc from './History';
import AttachSignDoc from './Attachment';
import UnitSignDoc from './UnitSignDoc';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,
            loading: false,
            isUnAuthorize: false,
            docInfo: {},
            docId: this.props.navigation.state.params.docId,
            docType: this.props.navigation.state.params.docType,

            screenParam: {
                userId: this.props.userInfo.ID,
                docId: this.props.navigation.state.params.docId,
                docType: this.props.navigation.state.params.docType,
            }
        }
    }

    componentWillMount() {
        this.fetchData()
    }

    async fetchData() {
        this.setState({
            loading: true
        });

        const url = `${API_URL}/api/VanBanDi/GetDetail/${this.state.docId}/${this.state.userId}`;
        console.log(url);
        const result = await fetch(url);
        const resultJson = await result.json();

        // await asyncDelay(2000);

        this.setState({
            loading: false,
            docInfo: resultJson,
            isUnAuthorize: util.isNull(resultJson)
        });
    }

    componentDidMount = () => {
        backHandlerConfig(true, this.navigateBackToList);
    }

    componentWillUnmount = () => {
        backHandlerConfig(false, this.navigateBackToList);
    }

    navigateBackToList = () => {
        appGetDataAndNavigate(this.props.navigation, 'VanBanDiDetailScreen');
        return true;
    }

    onReplyReview() {

        const targetScreenParam = {
            docId: this.state.docInfo.VanBanDi.ID,
            docType: this.state.docType,
            itemType: this.state.docInfo.Process.ITEM_TYPE
        }

        appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowReplyReviewScreen", targetScreenParam);
    }

    onProcessDoc = (item, isStepBack) => {
        const targetScreenParam = {
            docId: this.state.docInfo.VanBanTrinhKy.ID,
            docType: this.state.docType,
            processId: this.state.docInfo.WorkFlow.Process.ID,
            stepId: item.ID,
            stepName: item.NAME,
            isStepBack,
            logId: (isStepBack == true) ? item.Log.ID : 0,
            apiUrlMiddle: 'VanBanDi'
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowStreamProcessScreen", targetScreenParam);
    }

    onReviewDoc = (item) => {
        const targetScreenParam = {
            docId: this.state.docInfo.VanBanDi.ID,
            docType: this.state.docType,
            processId: this.state.docInfo.Process.ID,
            stepId: item.ID,
            isStepBack: false,
            stepName: 'GỬI REVIEW',
            logId: 0
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowRequestReviewScreen", targetScreenParam);
    }

    onSelectWorkFlowStep(item, isStepBack) {
        if (item.REQUIRED_REVIEW != true || this.state.docInfo.WorkFlow.Process.IS_PENDING == false) {
            this.onProcessDoc(item, isStepBack);

        } else {
            this.onReviewDoc(item);
        }
    }

    onOpenComment = () => {
        const targetScreenParam = {
            docId: this.state.docId,
            docType: this.state.docType,
            isTaskComment: false,
            vanbandiData: this.state.docInfo.LstRootComment
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "ListCommentScreen", targetScreenParam);
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
                    element: () => <RNButton style={ButtonGroupStyle.button} onPress={() => this.onReplyReview()}><RNText style={ButtonGroupStyle.buttonText}>PHẢN HỒI</RNText></RNButton>
                })
            } else {
                let workflowMenuOptions = [];
                if (!util.isNull(this.state.docInfo.WorkFlow.LstStepBack) && !util.isEmpty(this.state.docInfo.WorkFlow.LstStepBack)) {
                    this.state.docInfo.WorkFlow.LstStepBack.forEach(item => {
                        workflowButtons.push({
                            element: () => <RNButton style={ButtonGroupStyle.button} onPress={() => this.onSelectWorkFlowStep(item, true)}><RNText style={ButtonGroupStyle.buttonText}>{util.toUpper(item.NAME)}</RNText></RNButton>
                        })
                    })
                }

                if (!util.isNull(this.state.docInfo.WorkFlow.LstStep) && !util.isEmpty(this.state.docInfo.WorkFlow.LstStep)) {
                    this.state.docInfo.WorkFlow.LstStep.forEach(item => {
                        if (item.REQUIRED_REVIEW == true) {
                            if (this.state.docInfo.WorkFlow.ReviewObj == null || this.state.docInfo.WorkFlow.ReviewObj.IS_FINISH != true || this.state.docInfo.ReviewObj.IS_REJECT == true) {
                                item.NAME = 'GỬI REVIEW'
                            }
                        }
                        workflowButtons.push({
                            element: () => <RNButton style={ButtonGroupStyle.button} onPress={() => this.onSelectWorkFlowStep(item, false)}><RNText style={ButtonGroupStyle.buttonText}>{util.toUpper(item.NAME)}</RNText></RNButton>
                        })
                    });
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
                        <Button transparent onPress={this.onOpenComment}>
                            <Form style={DetailSignDocStyle.commentButtonContainer}>
                                <Icon name='ios-chatbubbles-outline' style={{ color: Colors.WHITE }} />
                                {
                                    renderIf(this.state.docInfo && this.state.docInfo.hasOwnProperty('COMMENT_COUNT') && this.state.docInfo.COMMENT_COUNT > 0)(
                                        <Form style={DetailSignDocStyle.commentCircleContainer}>
                                            <Text style={DetailSignDocStyle.commentCountText}>
                                                0
                                                    {/* {this.state.docInfo.COMMENT_COUNT} */}
                                            </Text>
                                        </Form>
                                    )
                                }
                            </Form>
                        </Button>
                    </Right>
                </Header>
                {
                    bodyContent
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
export default connect(mapStateToProps)(Detail);

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
                        <MainInfoSignDoc info={this.state.docInfo} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-attach-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                ĐÍNH KÈM
                            </Text>
                        </TabHeading>
                    }>
                        <AttachSignDoc info={this.state.docInfo.ListTaiLieu} docId={this.state.docId} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 2 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-git-network' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 2 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                ĐƠN VỊ NHẬN
                            </Text>
                        </TabHeading>
                    }>
                        <UnitSignDoc info={this.state.docInfo} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 3 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-time-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 3 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                LỊCH SỬ XỬ LÝ
                            </Text>
                        </TabHeading>
                    }>
                        <TimelineSignDoc info={this.state.docInfo} />
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