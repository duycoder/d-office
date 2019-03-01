/**
 * @description: màn hình chi tiết văn bản trình ký
 * @author: duynn
 * @since: 05/06/2018
 */
'use strict'
import React, { Component } from 'react';
import { View, Text as RnText } from 'react-native';
//redux
import { connect } from 'react-redux';

//utilities
import { API_URL, VANBANDEN_CONSTANT, HEADER_COLOR, Colors } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import * as util from 'lodash';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { MenuStyle, MenuOptionStyle, MenuOptionsCustomStyle, MenuOptionCustomStyle } from '../../../assets/styles/MenuPopUpStyle';

//lib
import {
    Container, Header, Left, Button,
    Body, Icon, Title, Content, Form,
    Tabs, Tab, TabHeading, ScrollableTab,
    Text, Right
} from 'native-base';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu'
import {
    Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';

//views
import MainInfoPublishDoc from './Info';
import TimelinePublishDoc  from './History';
import AttachPublishDoc from './Attachment';

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

        const url = `${API_URL}/api/VanBanDen/GetDetail/${this.state.docId}/${this.state.userId}`;
        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(2000);

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
        appGetDataAndNavigate(this.props.navigation, 'VanBanDenDetailScreen');
        return true;
    }

    onReplyReview() {

        const targetScreenParam = {
            docId: this.state.docInfo.entityVanBanDen.ID,
            docType: this.state.docType,
            itemType: this.state.docInfo.Process.ITEM_TYPE
        }

        appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowReplyReviewScreen", targetScreenParam);
    }

    onProcessDoc = (item, isStepBack) => {
        const targetScreenParam = {
            docId: this.state.docInfo.entityVanBanDen.ID,
            docType: this.state.docType,
            processId: this.state.docInfo.WorkFlow.Process.ID,
            stepId: item.ID,
            stepName: item.NAME,
            isStepBack,
            logId: (isStepBack == true) ? item.Log.ID : 0
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowStreamProcessScreen", targetScreenParam);
    }

    onReviewDoc = (item) => {
        const targetScreenParam = {
            docId: this.state.docInfo.entityVanBanDen.ID,
            docType: this.state.docType,
            processId: this.state.docInfo.Process.ID,
            stepId: item.ID,
            isStepBack: false,
            stepName: 'GỬI REVIEW',
            logId: 0
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "WorkflowRequestReviewScreen", targetScreenParam);
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
            isTaskComment: false
        }
        appStoreDataAndNavigate(this.props.navigation, "VanBanDenDetailScreen", this.state.screenParam, "ListCommentScreen", targetScreenParam);
    }

    render() {        
        // console.tron.log(this.state.docType)
        let bodyContent = null;
        let workflowMenu = null;

        if (this.state.loading) {
            bodyContent = dataLoading(true);
        }
        else if (this.state.isUnAuthorize) {
            bodyContent = unAuthorizePage(this.props.navigation);
        } else {
            bodyContent = <DetailContent docInfo={this.state.docInfo} docId={this.state.docId} />

            if (this.state.docInfo.WorkFlow.REQUIRED_REVIEW) {
                workflowMenu = (
                    <Menu>
                        <MenuTrigger>
                            <RneIcon name='dots-three-horizontal' color={Colors.WHITE} type='entypo' size={verticalScale(25)} />
                        </MenuTrigger>

                        <MenuOptions>
                            <MenuOption onSelect={() => this.onReplyReview()}>
                                <RnText style={MenuOptionStyle.text}>
                                    PHẢN HỒI
                                </RnText>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                )
            } else {
                let workflowMenuOptions = [];
                if (!util.isNull(this.state.docInfo.WorkFlow.LstStepBack) && !util.isEmpty(this.state.docInfo.WorkFlow.LstStepBack)) {
                    this.state.docInfo.WorkFlow.LstStepBack.forEach(item => {
                        workflowMenuOptions.push(
                            <MenuOption key={item.ID} onSelect={() => this.onSelectWorkFlowStep(item, true)}>
                                <RnText style={MenuOptionStyle.text}>
                                    {util.capitalize(item.NAME)}
                                </RnText>
                            </MenuOption>
                        )
                    })
                }

                if (!util.isNull(this.state.docInfo.WorkFlow.LstStep) && !util.isEmpty(this.state.docInfo.WorkFlow.LstStep)) {
                    this.state.docInfo.WorkFlow.LstStep.forEach(item => {
                        if (item.REQUIRED_REVIEW == true) {
                            if (this.state.docInfo.WorkFlow.ReviewObj != null && this.state.docInfo.WorkFlow.ReviewObj.IS_FINISH == true && this.state.docInfo.ReviewObj.IS_REJECT != true) {
                                workflowMenuOptions.push(
                                    <MenuOption key={item.ID} onSelect={() => this.onSelectWorkFlowStep(item, false)}>
                                        <RnText style={MenuOptionStyle.text}>
                                            {util.capitalize(item.NAME)}
                                        </RnText>
                                    </MenuOption>
                                )
                            } else {
                                workflowMenuOptions.push(
                                    <MenuOption key={item.ID} onSelect={() => this.onSelectWorkFlowStep(item, false)}>
                                        <RnText style={MenuOptionStyle.text}>
                                            Gửi review
                                        </RnText>
                                    </MenuOption>
                                )
                            }
                        } else {
                            workflowMenuOptions.push(
                                <MenuOption key={item.ID} onSelect={() => this.onSelectWorkFlowStep(item, false)}>
                                    <RnText style={MenuOptionStyle.text}>
                                        {util.capitalize(item.NAME)}
                                    </RnText>
                                </MenuOption>
                            )
                        }
                    });
                }

                if (workflowMenuOptions.length > 0) {
                    workflowMenu = (
                        <Menu>
                            <MenuTrigger>
                                <RneIcon name='dots-three-horizontal' color={Colors.WHITE} type='entypo' size={verticalScale(25)} />
                            </MenuTrigger>

                            <MenuOptions customStyles={MenuOptionsCustomStyle}>
                                {workflowMenuOptions}
                            </MenuOptions>
                        </Menu>
                    )
                } else {
                    workflowMenu = null;
                }
            }
        }

        return (
            <MenuProvider>
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
                                <Form style={DetailPublishDocStyle.commentButtonContainer}>
                                    <Icon name='ios-chatbubbles-outline' style={{ color: Colors.WHITE }} />
                                    {
                                        renderIf(this.state.docInfo && this.state.docInfo.hasOwnProperty('COMMENT_COUNT') && this.state.docInfo.COMMENT_COUNT > 0)(
                                            <Form style={DetailPublishDocStyle.commentCircleContainer}>
                                                <Text style={DetailPublishDocStyle.commentCountText}>
                                                    0
                                                    {/* {this.state.docInfo.COMMENT_COUNT} */}
                                                </Text>
                                            </Form>
                                        )
                                    }
                                </Form>
                            </Button>
                            {
                                workflowMenu
                            }
                        </Right>
                    </Header>
                    {
                        bodyContent
                    }
                </Container>
            </MenuProvider>
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
        // console.tron.log(this.state.docInfo); // Log Info Of Doc
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
                        <AttachPublishDoc info={this.state.docInfo.groupOfTaiLieuDinhKems} docId={this.state.docId}/>
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.currentTabIndex == 3 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <Icon name='ios-time-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.currentTabIndex == 3 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                LỊCH SỬ XỬ LÝ
                            </Text>
                        </TabHeading>
                    }>
                        <TimelinePublishDoc info={this.state.docInfo} />
                    </Tab>
                </Tabs>
            </View>
        );
    }
}