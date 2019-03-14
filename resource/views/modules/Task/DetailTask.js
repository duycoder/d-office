/**
 * @description: chi tiết công việc
 * @author: duynn
 * @since: 10/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { AsyncStorage, Alert, View as RnView, Text as RnText, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
//redux
import { connect } from 'react-redux';

//lib
// import {Menu, MenuTrigger, MenuOptions, MenuOption, } from 'react-native-popup-menu';
import {
    Container, Header, Left, Button, Body,
    Title, Right, Toast, Tabs, Tab, TabHeading, ScrollableTab,
    Icon as NbIcon, Text, SwipeRow, Item, Input,
    Content, Form,
} from 'native-base';
import { Icon } from 'react-native-elements';
import renderIf from 'render-if';
import * as util from 'lodash'

//utilities
import {
    API_URL, LOADER_COLOR, HEADER_COLOR, Colors,
    CONGVIEC_CONSTANT, PLANJOB_CONSTANT, EMPTY_DATA_ICON_URI, EMPTY_STRING, DEFAULT_PAGE_INDEX
} from '../../../common/SystemConstant';
import { asyncDelay, convertDateToString, formatLongText, appGetDataAndNavigate, backHandlerConfig, appStoreDataAndNavigate } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive, scale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading, dataLoading } from '../../../common/Effect';

//styles
import { MenuStyle, MenuOptionStyle, MenuOptionsCustomStyle } from '../../../assets/styles/MenuPopUpStyle';
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//comps
import TaskDescription from './TaskDescription';
import TaskAttachment from './TaskAttachment';
import GroupSubTask from './GroupSubTask';
import ResultEvaluationTask from './ResultEvaluationTask'
import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';

import * as navAction from '../../../redux/modules/Nav/Action';

class DetailTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,
            taskId: this.props.coreNavParams.taskId,
            taskType: this.props.coreNavParams.taskType,
            taskInfo: {},
            loading: false,
            executing: false,

            screenParam: {
                userId: this.props.userInfo.ID,
                taskId: this.props.coreNavParams.taskId,
                taskType: this.props.coreNavParams.taskType,
            },

            fromBrief: this.props.coreNavParams.fromBrief || false,
            check: false,
        };
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async () => {
        this.setState({
            loading: true
        });

        const url = `${API_URL}/api/HscvCongViec/JobDetail/${this.state.taskId}/${this.state.userId}`;
        const result = await fetch(url);
        const resultJson = await result.json();

        this.setState({
            loading: false,
            taskInfo: resultJson,
            subTaskData: resultJson.LstTask || []
        });
    }

    //xác nhận bắt đầu công việc
    onConfirmToStartTask = () => {
        Alert.alert(
            'XÁC NHẬN XỬ LÝ',
            'Bạn có chắc chắn muốn bắt đầu thực hiện công việc này?',
            [
                {
                    text: 'Đồng ý', onPress: () => { this.onStartTask() }
                },

                {
                    text: 'Hủy bỏ', onPress: () => { }
                }
            ]
        )
    }

    //bắt đầu công việc

    onStartTask = async () => {
        this.setState({
            executing: true
        });

        const url = `${API_URL}/api/HscvCongViec/BeginProcess`;

        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const body = JSON.stringify({
            userId: this.state.userId,
            taskId: this.state.taskId
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
            text: resultJson.Status ? 'Bắt đầu công việc thành công' : resultJson.Message,
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (resultJson.Status) {
                    this.fetchData();
                }
            }
        });
    }

    componentDidMount = () => {
        // backHandlerConfig(true, this.navigateBackToList);
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (this.props.extendsNavParams) {
                if (this.props.extendsNavParams.hasOwnProperty("from")) {
                    if (this.props.extendsNavParams.from === "detail") {
                        this.props.updateCoreNavParams({
                            taskId: this.state.taskId,
                            taskType: this.state.taskType
                        });
                    }
                }
                if (this.props.extendsNavParams.hasOwnProperty("check")) {
                    if (this.props.extendsNavParams.check === true) {
                        this.setState({ check: true }, () => this.fetchData())
                    }
                }
            }
        });
    }

    componentWillUnmount = () => {
        // backHandlerConfig(false, this.navigateBackToList);
        this.willFocusListener.remove();
    }

    navigateBackToList = () => {
        if (this.state.taskInfo.hasOwnProperty("CongViec")) {
            this.props.updateExtendsNavParams({ check: this.state.check });
            this.props.navigation.goBack();
        }
    }

    //mở cuộc hội thoại
    onOpenComment = () => {
        const targetScreenParam = {
            isTaskComment: true
        }
        this.onNavigate("ListCommentScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ListCommentScreen", targetScreenParam);
    }

    //cập nhật tiến độ
    onUpdateTaskProgress = () => {
        const targetScreenParam = {
            oldProgressValue: this.state.taskInfo.CongViec.PHANTRAMHOANTHANH || 0,
            progressValue: this.state.taskInfo.CongViec.PHANTRAMHOANTHANH || 0
        }
        this.onNavigate("UpdateProgressTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, 'UpdateProgressTaskScreen', targetScreenParam);
    }

    //lùi hạn công việc
    onRescheduleTask = () => {
        const targetScreenParam = {
            currentDeadline: this.state.taskInfo.CongViec.NGAYHOANTHANH_THEOMONGMUON
        }
        this.onNavigate("RescheduleTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "RescheduleTaskScreen", targetScreenParam);
    }

    //phản hồi công việc hoàn thành
    onApproveProgressTask = () => {
        this.props.navigation.navigate("ApproveProgressTaskScreen");
        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ApproveProgressTaskScreen", targetScreenParam);
    }

    //tạo công việc con
    onCreateSubTask = () => {
        const targetScreenParam = {
            listPriority: this.state.taskInfo.listDoKhan,
            listUrgency: this.state.taskInfo.listDoUuTien,
            priorityValue: this.state.taskInfo.listDoKhan[0].Value.toString(), //độ ưu tiên
            urgencyValue: this.state.taskInfo.listDoUuTien[0].Value.toString(), //đô khẩn
        }
        this.onNavigate("CreateSubTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "CreateSubTaskScreen", targetScreenParam);
    }

    //giao việc
    onAssignTask = () => {
        const targetScreenParam = {
            subTaskId: this.state.taskInfo.CongViec.SUBTASK_ID || 0
        }
        this.onNavigate("AssignTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "AssignTaskScreen", targetScreenParam);
    }

    //tự đánh giá công việc
    onEvaluationTask = () => {
        this.onNavigate("EvaluationTaskScreen");
        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "EvaluationTaskScreen", targetScreenParam);
    }

    //phê duyệt đánh giá công việc
    onApproveEvaluationTask = () => {
        const targetScreenParam = {
            PhieuDanhGia: this.state.taskInfo.PhieuDanhGia || {}
        }
        this.onNavigate("ApproveEvaluationTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ApproveEvaluationTaskScreen", targetScreenParam);
    }

    //danh sách công việc
    onGetGroupSubTask = () => {
        const targetScreenParam = {
            canFinishTask: (this.state.taskInfo.CongViec.DAGIAOVIEC != true
                && this.state.taskInfo.IsNguoiGiaoViec
                && this.state.taskInfo.CongViec.IS_SUBTASK != true) || this.state.taskInfo.IsNguoiThucHienChinh,

            canAssignTask: this.state.taskInfo.HasRoleAssignTask && (((this.state.taskInfo.CongViec.DAGIAOVIEC != true
                && this.state.taskInfo.IsNguoiGiaoViec
                && this.state.taskInfo.CongViec.IS_SUBTASK != true) || this.state.taskInfo.IsNguoiThucHienChinh))
        }
        this.onNavigate("GroupSubTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "GroupSubTaskScreen", targetScreenParam);
    }

    //lịch sử cập nhật tiến độ
    onGetProgressHistory = () => {
        this.onNavigate("HistoryProgressTaskScreen");

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryProgressTaskScreen", targetScreenParam);
    }

    //lịch sử lùi hạn
    onGetRescheduleHistory = () => {
        const targetScreenParam = {
            canApprove: this.state.taskInfo.IsNguoiGiaoViec
        }
        this.onNavigate("HistoryRescheduleTaskScreen", targetScreenParam);

        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryRescheduleTaskScreen", targetScreenParam);
    }

    //lịch sử đánh giá
    onGetEvaluationHistory = () => {
        this.onNavigate("HistoryEvaluateTaskScreen");
        // appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryEvaluateTaskScreen", targetScreenParam);
    }

    onNavigate(targetScreenName, targetScreenParam) {
        if (!util.isNull(targetScreenParam)) {
            this.props.updateExtendsNavParams(targetScreenParam);
        }
        this.props.navigation.navigate(targetScreenName);
    }

    navigateToDetailDoc = (screenName, targetScreenParams) => {
        this.props.updateCoreNavParams(targetScreenParams)
        this.props.navigation.navigate(screenName);
    }

    render() {
        const bodyContent = this.state.loading ? dataLoading(true) : <TaskContent userInfo={this.props.userInfo} info={this.state.taskInfo} navigateToDetailDoc={this.navigateToDetailDoc} fromBrief={this.state.fromBrief} />;
        const menuActions = [];
        if (!this.state.loading) {
            const task = this.state.taskInfo;
            if (task.CongViec.IS_BATDAU == true) {
                if (((task.CongViec.DAGIAOVIEC != true && task.IsNguoiGiaoViec == true && task.CongViec.IS_SUBTASK != true) || task.IsNguoiThucHienChinh) && (task.CongViec.PHANTRAMHOANTHANH < 100)) {
                    menuActions.push(
                        <InteractiveButton title={'Cập nhật tiến độ'} onPress={() => this.onUpdateTaskProgress()} key={1} />
                    )

                    if (task.CongViec.NGUOIXULYCHINH_ID != task.CongViec.NGUOIGIAOVIEC_ID) {
                        menuActions.push(
                            <InteractiveButton title={'Lùi hạn công việc'} onPress={() => this.onRescheduleTask()} key={2} />
                        )
                    }
                }

                if (task.IsNguoiGiaoViec && task.CongViec.PHANTRAMHOANTHANH == 100 && task.CongViec.NGUOIGIAOVIECDAPHANHOI == null) {
                    menuActions.push(
                        <InteractiveButton title={'Phản hồi công việc'} onPress={() => this.onApproveProgressTask()} key={3} />
                    )
                }

                if (((task.CongViec.DAGIAOVIEC != true && task.IsNguoiGiaoViec && task.CongViec.IS_SUBTASK != true)
                    || task.IsNguoiThucHienChinh)
                    && (task.CongViec.PHANTRAMHOANTHANH == null || task.CongViec.PHANTRAMHOANTHANH < 100)) {
                    menuActions.push(
                        <InteractiveButton title={'Tạo công việc con'} onPress={() => this.onCreateSubTask()} key={4} />
                    )
                }

                if (task.HasRoleAssignTask
                    && (task.CongViec.PHANTRAMHOANTHANH == 0 || task.CongViec.PHANTRAMHOANTHANH == null)
                    && task.CongViec.DAGIAOVIEC != true) {
                    menuActions.push(
                        <InteractiveButton title={'Giao việc'} onPress={() => this.onAssignTask()} key={5} />
                    )
                }

                // if (task.HasRoleAssignTask) {
                //     if (task.CongViec.NGUOIXULYCHINH_ID != task.CongViec.NGUOIGIAOVIEC_ID) {
                //         menuActions.push(
                //             <InteractiveButton title={'Theo dõi'} key={6} />
                //         )
                //     }
                // }

                if (task.CongViec.NGUOIGIAOVIECDAPHANHOI == true) {
                    if (task.IsNguoiGiaoViec == true
                        && task.CongViec.PHANTRAMHOANTHANH == 100
                        && task.CongViec.DATUDANHGIA == true
                        && task.CongViec.NGUOIGIAOVIECDANHGIA != true) {

                        menuActions.push(
                            <InteractiveButton title={'Duyệt đánh giá công việc'} onPress={() => this.onApproveEvaluationTask()} key={7} />
                        )
                    }

                    if (task.IsNguoiThucHienChinh && task.CongViec.PHANTRAMHOANTHANH == 100 && task.CongViec.DATUDANHGIA != true) {
                        menuActions.push(
                            <InteractiveButton title={'Tự đánh giá công việc'} onPress={() => this.onEvaluationTask()} key={8} />
                        )
                    }
                }
            } else {
                // Nếu công việc chưa bắt đầu
                if (task.CongViec.NGUOIXULYCHINH_ID == null) {
                    // Truong hop chua co nguoi xu ly la cong viec chua duoc giao
                    // Chưa được giao thì ko cần lập kế hoạch, tránh vừa đánh trống vừa thôi kèn
                    // Chỉ yêu cầu lập kế hoạch khi mà người xử lý chính và người giao việc khác nhau
                    if (task.HasRoleAssignTask
                        && (task.CongViec.PHANTRAMHOANTHANH == 0 || task.CongViec.PHANTRAMHOANTHANH == null)
                        && task.CongViec.DAGIAOVIEC != true) {

                        menuActions.push(
                            <InteractiveButton title={'GIAO VIỆC'} onPress={() => this.onAssignTask()} key={9} />
                        )

                        menuActions.push(
                            <InteractiveButton title={'BẮT ĐẦU XỬ LÝ'} onPress={() => this.onConfirmToStartTask()} key={10} />
                        )
                    }
                }
                else if (task.IsNguoiGiaoViec) {
                    // menuActions.push(
                    //     <InteractiveButton title={'THEO DÕI'} key={11} />
                    // )
                    // if (task.CongViec.IS_HASPLAN == true && task.TrangThaiKeHoach == PLANJOB_CONSTANT.DATRINHKEHOACH) {
                    //     menuActions.push(
                    //         <InteractiveButton title={'DUYỆT KẾ HOẠCH'} key={12} />
                    //     )
                    // }
                } else {
                    if (task.CongViec.IS_HASPLAN == true) {
                        // Nếu công việc yêu cầu lập kế hoạch trước khi bắt đầu thực hiện
                        // if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.CHUATRINHKEHOACH) {
                        //     // nếu chưa trình kế hoạch và là người xử lý chính thì
                        //     if (task.IsNguoiThucHienChinh) {
                        //         menuActions.push(
                        //             <InteractiveButton title={'TRÌNH KẾ HOẠCH'} key={13} />
                        //         )
                        //     }
                        // }
                        // else if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.CHUALAPKEHOACH || task.TrangThaiKeHoach == PLANJOB_CONSTANT.LAPLAIKEHOACH) {
                            // menuActions.push(
                            //     <InteractiveButton title={'LẬP KẾ HOẠCH'} key={14} />
                            // )
                        // }
                        if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.DAPHEDUYETKEHOACH) {
                            if (task.IsNguoiThucHienChinh) {
                                menuActions.push(
                                    <InteractiveButton title={'Bắt đầu xử lý'} onPress={() => this.onConfirmToStartTask()} key={15} />
                                )
                            }
                        }
                    } else {
                        //Bắt đầu xử lý
                        menuActions.push(
                            <InteractiveButton title={'Bắt đầu xử lý'} onPress={() => this.onConfirmToStartTask()} key={16} />
                        )
                    }
                }
            }
        }

        //menu thông tin về công việc

        menuActions.push(
            <InteractiveButton title={'Các công việc con'} onPress={() => this.onGetGroupSubTask()} key={17} />
        );

        menuActions.push(
            <InteractiveButton title={'Theo dõi tiến độ'} onPress={() => this.onGetProgressHistory()} key={18} />
        );

        menuActions.push(
            <InteractiveButton title={'Lịch sử lùi hạn'} onPress={() => this.onGetRescheduleHistory()} key={19} />
        );

        menuActions.push(
            <InteractiveButton title={'Lịch sử phản hồi'} onPress={() => this.onGetEvaluationHistory()} key={20} />
        );

        return (
            <Container>
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBackToList()}>
                            <Icon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            THÔNG TIN CÔNG VIỆC
                            </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right}>
                        <Button transparent onPress={this.onOpenComment}>
                            <Form style={DetailTaskStyle.commentButtonContainer}>
                                <NbIcon name='ios-chatbubbles-outline' style={{ color: Colors.WHITE }} />
                                {
                                    renderIf(this.state.taskInfo.COMMENT_COUNT > 0)(
                                        <Form style={DetailTaskStyle.commentCircleContainer}>
                                            <Text style={DetailTaskStyle.commentCountText}>
                                                {this.state.taskInfo.COMMENT_COUNT}
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

                {/* hiệu ứng xử lý */}
                {
                    menuActions.length > 0 &&
                    <RnView style={[ButtonGroupStyle.container, { margin: 10 }]}>
                        <ScrollView
                            horizontal
                        >
                            {menuActions}
                        </ScrollView>
                    </RnView>
                }
                {
                    executeLoading(this.state.executing)
                }
            </Container>
        );
    }
}


class TaskContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: props.userInfo,
            info: props.info,
            selectedTabIndex: 0,
            fromBrief: props.fromBrief
        }
    }

    render() {
        let bodyContent = null;
        if (this.state.info.PhieuDanhGia != null) {
            bodyContent = (
                <Tabs
                    initialPage={0}
                    tabBarUnderlineStyle={TabStyle.underLineStyle}
                    onChangeTab={(selectedTabIndex) => this.setState({ selectedTabIndex })}>
                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                            <NbIcon name='ios-information-circle-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.selectedTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                                MÔ TẢ
                            </Text>
                        </TabHeading>
                    }>
                        <TaskDescription info={this.props.info} navigateToDetailDoc={this.props.navigateToDetailDoc} userId={this.state.userInfo.ID} fromBrief={this.state.fromBrief} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                            <NbIcon name='ios-attach' style={TabStyle.activeText} />
                            <Text style={(this.state.selectedTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>
                                ĐÍNH KÈM
                            </Text>
                        </TabHeading>
                    }>
                        <TaskAttachment info={this.props.info} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 2) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                            <NbIcon name='ios-create-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.selectedTabIndex == 2) ? TabStyle.activeText : TabStyle.inActiveText}>
                                ĐÁNH GIÁ
                            </Text>
                        </TabHeading>
                    }>

                        <ResultEvaluationTask data={this.state.info} />
                    </Tab>
                </Tabs>
            )
        } else {
            bodyContent = (
                <Tabs
                    initialPage={0}
                    tabBarUnderlineStyle={TabStyle.underLineStyle}
                    onChangeTab={(selectedTabIndex) => this.setState({ selectedTabIndex })}>
                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                            <NbIcon name='ios-information-circle-outline' style={TabStyle.activeText} />
                            <Text style={(this.state.selectedTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>
                                MÔ TẢ
                            </Text>
                        </TabHeading>
                    }>
                        <TaskDescription info={this.props.info} navigateToDetailDoc={this.props.navigateToDetailDoc} userId={this.state.userInfo.ID} fromBrief={this.state.fromBrief} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
                            <NbIcon name='ios-attach' style={TabStyle.activeText} />
                            <Text style={(this.state.selectedTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>
                                ĐÍNH KÈM
                            </Text>
                        </TabHeading>
                    }>
                        <TaskAttachment info={this.props.info} />
                    </Tab>
                </Tabs>
            )
        }
        return (
            <RnView style={{ flex: 1 }}>
                {
                    bodyContent
                }
            </RnView>
        );
    }
}

class InteractiveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title
        }
    }
    render() {
        return (
            <RnView style={styles.slide}>
                <TouchableOpacity style={[ButtonGroupStyle.button, { paddingHorizontal: 10, borderWidth: 3, borderColor: Colors.WHITE }]} onPress={this.props.onPress}>
                    <Text style={ButtonGroupStyle.buttonText}>{util.toUpper(this.state.title)}</Text>
                </TouchableOpacity>
            </RnView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: moderateScale(30, 1.1),
        fontWeight: 'bold',
    }
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
        coreNavParams: state.navState.coreNavParams,
        extendsNavParams: state.navState.extendsNavParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
        updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailTask);