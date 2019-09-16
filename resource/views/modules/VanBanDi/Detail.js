/**
 * @description: chi tiết văn bản trình ký
 * @author: duynn
 * @since: 03/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { View, Text as RNText, TouchableOpacity as RNButton, Alert } from 'react-native';
//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//utilities
import { API_URL, Colors } from '../../../common/SystemConstant';
import { asyncDelay, unAuthorizePage, backHandlerConfig, appGetDataAndNavigate, appStoreDataAndNavigate } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
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
    Text, Right, Toast
} from 'native-base';
import { MenuProvider, MenuTrigger, Menu, MenuOption, MenuOptions } from 'react-native-popup-menu'
import {
    Icon as RneIcon, ButtonGroup
} from 'react-native-elements';
import renderIf from 'render-if';

//views
import MainInfoSignDoc from './Info';
import TimelineSignDoc from './History';
import AttachSignDoc from './Attachment';
import UnitSignDoc from './UnitSignDoc';

import AlertMessage from '../../common/AlertMessage';
import AlertMessageStyle from '../../../assets/styles/AlertMessageStyle';
import GoBackButton from '../../common/GoBackButton';
import { HeaderMenuStyle } from '../../../assets/styles';

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
                docType: this.props.coreNavParams.docType,
            },
            executing: false,
            hasAuthorization: props.hasAuthorization || 0,
            fromBrief: props.coreNavParams.fromBrief || false,
            check: false,
            from: props.from || "list"
        };
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    async fetchData() {
        this.setState({
            loading: true
        });

        const url = `${API_URL}/api/VanBanDi/GetDetail/${this.state.docId}/${this.state.userId}/${this.state.hasAuthorization}`;

        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            loading: false,
            docInfo: resultJson === null ? {} : resultJson,
            isUnAuthorize: util.isNull(resultJson)
        });
    }

    componentDidMount = () => {
        // backHandlerConfig(true, this.navigateBack);
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (this.props.extendsNavParams.hasOwnProperty("from")) {
                if (this.props.extendsNavParams.from === "detail") {
                    this.props.updateCoreNavParams({
                        docId: this.state.docId,
                        docType: this.state.docType
                    });
                }
            }
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

    navigateBack = () => {
        if (this.state.docInfo.hasOwnProperty("VanBanTrinhKy")) {
            if (this.state.from === "list") {
                this.props.updateExtendsNavParams({ check: this.state.check });
            }
            else {
                this.props.updateExtendsNavParams({ from: true });
            }
        }
        this.props.navigation.goBack();
    }

    navigateToDetailDoc = (screenName, targetScreenParams) => {
        this.props.updateCoreNavParams(targetScreenParams)
        this.props.navigation.navigate(screenName);
    }

    onReplyReview() {

        const targetScreenParam = {
            itemType: this.state.docInfo.Process.ITEM_TYPE
        }

        this.onNavigate("WorkflowReplyReviewScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowReplyReviewScreen", targetScreenParam);
    }

    onProcessDoc = (item, isStepBack) => {
        if (!isStepBack &&
            this.state.docInfo.WorkFlow.Function &&
            this.state.docInfo.WorkFlow.Function.FUNTION_NAME === "KYDUYETVANBAN") {
            Toast.show({
                text: 'Vui lòng ký duyệt văn bản',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
        }
        else {
            const targetScreenParam = {
                processId: this.state.docInfo.WorkFlow.Process.ID,
                stepId: item.ID,
                stepName: item.NAME,
                isStepBack,
                logId: (isStepBack == true) ? item.Log.ID : 0
            }

            this.onNavigate("WorkflowStreamProcessScreen", targetScreenParam);

            // appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowStreamProcessScreen", targetScreenParam);
        }
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
        // appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "WorkflowRequestReviewScreen", targetScreenParam);
    }

    onSelectWorkFlowStep(item, isStepBack) {
        if (item.REQUIRED_REVIEW != true || this.state.docInfo.WorkFlow.Process.IS_PENDING == false) {
            this.onProcessDoc(item, isStepBack);

        } else {
            this.onReviewDoc(item);
        }
    }

    onConfirmSignDoc = () => {
        this.refs.confirm.showModal();
        // Alert.alert(
        //     'XÁC NHẬN KÝ DUYỆT',
        //     'Bạn có chắc chắn ký duyệt văn bản',
        //     [
        //         {
        //             text: 'CÓ',
        //             onPress: async () => {
        //                 this.onSignDoc();
        //             }
        //         },
        //         {
        //             text: 'KHÔNG',
        //             onPress: () => { }
        //         }
        //     ]
        // )
    }

    onSignDoc = async () => {
        this.refs.confirm.closeModal();
        const url = `${API_URL}/api/WorkFlow/SaveSignDoc/`;
        this.setState({
            executing: true
        })

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                UserID: this.state.userId,
                ItemID: this.state.docId,
                IsUyQuyen: false
            })
        }).then(response => response.json());

        await asyncDelay(2000);
        
        this.setState({
            executing: false
        })

        Toast.show({
            text: result ? 'Ký duyệt văn bản thành công' : 'Ký duyệt văn bản không thành công',
            type: result ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: Colors.LITE_BLUE },
            onClose: () => {
                if (result) {
                    this.fetchData();
                }
            }
        });
    }


    onOpenComment = () => {
        const targetScreenParam = {
            isTaskComment: false,
            vanbandiData: this.state.docInfo.LstRootComment
        }
        this.onNavigate("ListCommentScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "VanBanDiDetailScreen", this.state.screenParam, "ListCommentScreen", targetScreenParam);
    }

    onCreateTask = () => {
        const targetScreenParam = {
            docId: this.state.docId,
            docType: 2
        }
        this.onNavigate("CreateTaskScreen", targetScreenParam);
    }

    onNavigate(targetScreenName, targetScreenParam) {
        if (!util.isNull(targetScreenParam)) {
            this.props.updateExtendsNavParams(targetScreenParam);
        }
        this.props.navigation.navigate(targetScreenName);
    }

    render() {
        // console.tron.log(this.state.docInfo)
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

            const docFunction = this.state.docInfo.WorkFlow.Function;

            if (docFunction && docFunction.FUNTION_NAME === "KYDUYETVANBAN") {
                workflowButtons.push({
                    element: () => <RNButton style={ButtonGroupStyle.button} onPress={() => this.onConfirmSignDoc()}><RNText style={ButtonGroupStyle.buttonText}>{util.toUpper(docFunction.FUNTION_TITLE)}</RNText></RNButton>
                })
            }

            bodyContent = <DetailContent docInfo={this.state.docInfo} docId={this.state.docId} buttons={workflowButtons} userId={this.state.userId} navigateToDetailDoc={this.navigateToDetailDoc} fromBrief={this.state.fromBrief} />
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
                                    <MenuOption onSelect={() => this.onOpenComment()} text="Bình luận" customStyles={HeaderMenuStyle.optionStyles} />
                                    <MenuOption onSelect={() => this.onCreateTask()} text="Tạo công việc" />
                                </MenuOptions>
                            </Menu>
                            {
                                // <Button transparent onPress={this.onOpenComment}>
                                //     <Form style={DetailSignDocStyle.commentButtonContainer}>
                                //         <Icon name='ios-chatboxes' style={{ color: Colors.WHITE }} />
                                //         {
                                //             renderIf(this.state.docInfo && this.state.docInfo.hasOwnProperty('CommentCount') && this.state.docInfo.CommentCount > 0)(
                                //                 <Form style={DetailSignDocStyle.commentCircleContainer}>
                                //                     <Text style={DetailSignDocStyle.commentCountText}>
                                //                         {this.state.docInfo.CommentCount}
                                //                     </Text>
                                //                 </Form>
                                //             )
                                //         }
                                //     </Form>
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

                    <AlertMessage
                        ref="confirm"
                        title="XÁC NHẬN KÝ DUYỆT"
                        bodyText="Bạn có chắc chắn ký duyệt văn bản"
                        exitText="KHÔNG"
                    >
                        <View style={AlertMessageStyle.leftFooter}>
                            <RNButton onPress={() => this.onSignDoc()} style={AlertMessageStyle.footerButton}>
                                <RNText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                    CÓ
                                </RNText>
                            </RNButton>
                        </View>
                    </AlertMessage>
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
        updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
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
            userId: props.userId,
            fromBrief: props.fromBrief
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
                        <MainInfoSignDoc info={this.state.docInfo} userId={this.state.userId} navigateToDetailDoc={this.props.navigateToDetailDoc} fromBrief={this.state.fromBrief} />
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
                        //     <AttachSignDoc info={this.state.docInfo.ListTaiLieu} docId={this.state.docId} />
                        // </Tab>
                    }

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
                            <RneIcon name='clock' color={Colors.DANK_BLUE} type='feather' />
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