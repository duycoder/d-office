/**
 * @description: chi tiết công việc
 * @author: duynn
 * @since: 10/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { AsyncStorage, Alert, View as RnView, Text as RnText, FlatList } from 'react-native';
//redux
import { connect } from 'react-redux';

//lib
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption, } from 'react-native-popup-menu';
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

class DetailTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,
            taskId: this.props.navigation.state.params.taskId,
            taskType: this.props.navigation.state.params.taskType,
            taskInfo: {},
            loading: false,
            executing: false,

            screenParam: {
                userId: this.props.userInfo.ID,
                taskId: this.props.navigation.state.params.taskId,
                taskType: this.props.navigation.state.params.taskType,
            }
        }
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
        backHandlerConfig(true, this.navigateBackToList);
    }

    componentWillUnmount = () => {
        backHandlerConfig(false, this.navigateBackToList);
    }

    navigateBackToList = () => {
        appGetDataAndNavigate(this.props.navigation, 'DetailTaskScreen');
        return true;
    }

    //mở cuộc hội thoại
    onOpenComment = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            isTaskComment: true
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ListCommentScreen", targetScreenParam);
    }

    //cập nhật tiến độ
    onUpdateTaskProgress = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            oldProgressValue: this.state.taskInfo.CongViec.PHANTRAMHOANTHANH || 0,
            progressValue: this.state.taskInfo.CongViec.PHANTRAMHOANTHANH || 0
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, 'UpdateProgressTaskScreen', targetScreenParam);
    }

    //lùi hạn công việc
    onRescheduleTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            currentDeadline: this.state.taskInfo.CongViec.NGAYHOANTHANH_THEOMONGMUON
        }
        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "RescheduleTaskScreen", targetScreenParam);
    }

    //phản hồi công việc hoàn thành
    onApproveProgressTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType
        }
        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ApproveProgressTaskScreen", targetScreenParam);
    }

    //tạo công việc con
    onCreateSubTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            listPriority: this.state.taskInfo.listDoKhan,
            listUrgency: this.state.taskInfo.listDoUuTien,
            priorityValue: this.state.taskInfo.listDoKhan[0].Value.toString(), //độ ưu tiên
            urgencyValue: this.state.taskInfo.listDoUuTien[0].Value.toString(), //đô khẩn
        }
        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "CreateSubTaskScreen", targetScreenParam);
    }

    //giao việc
    onAssignTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            subTaskId: this.state.taskInfo.CongViec.SUBTASK_ID || 0
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "AssignTaskScreen", targetScreenParam);
    }

    //tự đánh giá công việc
    onEvaluationTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType
        }
        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "EvaluationTaskScreen", targetScreenParam);
    }

    //phê duyệt đánh giá công việc
    onApproveEvaluationTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            PhieuDanhGia: this.state.taskInfo.PhieuDanhGia || {}
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "ApproveEvaluationTaskScreen", targetScreenParam);
    }

    //danh sách công việc
    onGetGroupSubTask = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            canFinishTask: (this.state.taskInfo.CongViec.DAGIAOVIEC != true
                && this.state.taskInfo.IsNguoiGiaoViec
                && this.state.taskInfo.CongViec.IS_SUBTASK != true) || this.state.taskInfo.IsNguoiThucHienChinh,

            canAssignTask: this.state.taskInfo.HasRoleAssignTask && (((this.state.taskInfo.CongViec.DAGIAOVIEC != true
                && this.state.taskInfo.IsNguoiGiaoViec
                && this.state.taskInfo.CongViec.IS_SUBTASK != true) || this.state.taskInfo.IsNguoiThucHienChinh))
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "GroupSubTaskScreen", targetScreenParam);
    }

    //lịch sử cập nhật tiến độ
    onGetProgressHistory = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryProgressTaskScreen", targetScreenParam);
    }

    //lịch sử lùi hạn
    onGetRescheduleHistory = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            canApprove: this.state.taskInfo.IsNguoiGiaoViec
        }

        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryRescheduleTaskScreen", targetScreenParam);
    }

    //lịch sử đánh giá
    onGetEvaluationHistory = () => {
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType
        }
        appStoreDataAndNavigate(this.props.navigation, "DetailTaskScreen", this.state.screenParam, "HistoryEvaluateTaskScreen", targetScreenParam);
    }

    render() {
        // console.tron.log(this.state.taskInfo)
        const bodyContent = this.state.loading ? dataLoading(true) : <TaskContent userInfo={this.props.userInfo} info={this.state.taskInfo} />;
        const menuActions = [];
        if (!this.state.loading) {
            const task = this.state.taskInfo;
            if (task.CongViec.IS_BATDAU == true) {
                if (((task.CongViec.DAGIAOVIEC != true && task.IsNguoiGiaoViec == true && task.CongViec.IS_SUBTASK != true) || task.IsNguoiThucHienChinh) && (task.CongViec.PHANTRAMHOANTHANH < 100)) {
                    menuActions.push(
                        <MenuOption key={-1} onSelect={() => this.onUpdateTaskProgress()}
                            style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                            <Text style={MenuOptionStyle.text}>
                                Cập nhật tiến độ
                            </Text>
                        </MenuOption>
                    )

                    if (task.CongViec.NGUOIXULYCHINH_ID != task.CongViec.NGUOIGIAOVIEC_ID) {
                        menuActions.push(
                            <MenuOption key={-111} onSelect={() => this.onRescheduleTask()}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Lùi hạn công việc
                                </Text>
                            </MenuOption>
                        )
                    }
                }

                if (task.IsNguoiGiaoViec && task.CongViec.PHANTRAMHOANTHANH == 100 && task.CongViec.NGUOIGIAOVIECDAPHANHOI == null) {
                    menuActions.push(
                        <MenuOption key={-1} onSelect={() => this.onApproveProgressTask()}
                            style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                            <Text style={MenuOptionStyle.text}>
                                Phản hồi công việc
                            </Text>
                        </MenuOption>
                    )
                }

                if (((task.CongViec.DAGIAOVIEC != true && task.IsNguoiGiaoViec && task.CongViec.IS_SUBTASK != true)
                    || task.IsNguoiThucHienChinh)
                    && (task.CongViec.PHANTRAMHOANTHANH == null || task.CongViec.PHANTRAMHOANTHANH < 100)) {
                    menuActions.push(
                        <MenuOption key={0} onSelect={() => this.onCreateSubTask()}
                            style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                            <Text style={MenuOptionStyle.text}>
                                Tạo công việc con
                            </Text>
                        </MenuOption>
                    )
                }

                if (task.HasRoleAssignTask
                    && (task.CongViec.PHANTRAMHOANTHANH == 0 || task.CongViec.PHANTRAMHOANTHANH == null)
                    && task.CongViec.DAGIAOVIEC != true) {
                    menuActions.push(
                        <MenuOption onSelect={() => this.onAssignTask()}
                            key={1}
                            style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                            <Text style={MenuOptionStyle.text}>
                                Giao việc
                            </Text>
                        </MenuOption>
                    )
                }

                if (task.HasRoleAssignTask) {
                    if (task.CongViec.NGUOIXULYCHINH_ID != task.CongViec.NGUOIGIAOVIEC_ID) {
                        // menuActions.push(
                        //     <MenuOption key={2}
                        //         style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                        //         <Text style={MenuOptionStyle.text}>
                        //             Theo dõi
                        //         </Text>
                        //     </MenuOption>
                        // )
                    }
                }

                if (task.CongViec.NGUOIGIAOVIECDAPHANHOI == true) {
                    if (task.IsNguoiGiaoViec == true
                        && task.CongViec.PHANTRAMHOANTHANH == 100
                        && task.CongViec.DATUDANHGIA == true
                        && task.CongViec.NGUOIGIAOVIECDANHGIA != true) {

                        menuActions.push(
                            <MenuOption onSelect={() => this.onApproveEvaluationTask()}
                                key={3}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Duyệt đánh giá công việc
                                </Text>
                            </MenuOption>
                        )
                    }

                    if (task.IsNguoiThucHienChinh && task.CongViec.PHANTRAMHOANTHANH == 100 && task.CongViec.DATUDANHGIA != true) {
                        menuActions.push(
                            <MenuOption onSelect={() => this.onEvaluationTask()}
                                key={4}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Tự đánh giá công việc
                                </Text>
                            </MenuOption>
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
                            <MenuOption onSelect={() => this.onAssignTask()}
                                key={5}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Giao việc
                                </Text>
                            </MenuOption>
                        )

                        menuActions.push(
                            <MenuOption key={6} onSelect={() => this.onConfirmToStartTask()}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Bắt đầu xử lý
                                </Text>
                            </MenuOption>
                        )
                    }
                }
                else if (task.IsNguoiGiaoViec) {
                    menuActions.push(
                        <MenuOption key={7} style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                            <Text style={MenuOptionStyle.text}>
                                Theo dõi
                            </Text>
                        </MenuOption>
                    )
                    if (task.CongViec.IS_HASPLAN == true && task.TrangThaiKeHoach == PLANJOB_CONSTANT.DATRINHKEHOACH) {
                        menuActions.push(
                            <MenuOption key={8} style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    DUYỆT KẾ HOẠCH
                                </Text>
                            </MenuOption>
                        )
                    }
                } else {
                    if (task.CongViec.IS_HASPLAN == true) {
                        // Nếu công việc yêu cầu lập kế hoạch trước khi bắt đầu thực hiện
                        if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.CHUATRINHKEHOACH) {
                            // nếu chưa trình kế hoạch và là người xử lý chính thì
                            if (task.IsNguoiThucHienChinh) {
                                menuActions.push(
                                    <MenuOption key={9} style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                        <Text style={MenuOptionStyle.text}>
                                            TRÌNH KẾ HOẠCH
                                            </Text>
                                    </MenuOption>
                                )
                            }
                        }
                        else if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.CHUALAPKEHOACH || task.TrangThaiKeHoach == PLANJOB_CONSTANT.LAPLAIKEHOACH) {
                            menuActions.push(
                                <MenuOption key={10} style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                    <Text style={MenuOptionStyle.text}>
                                        LẬP KẾ HOẠCH
                                        </Text>
                                </MenuOption>
                            )
                        }
                        else if (task.TrangThaiKeHoach == PLANJOB_CONSTANT.DAPHEDUYETKEHOACH) {
                            if (task.IsNguoiThucHienChinh) {
                                menuActions.push(
                                    <MenuOption key={11}
                                        onSelect={() => this.onConfirmToStartTask()}
                                        style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                        <Text style={MenuOptionStyle.text}>
                                            Bắt đầu xử lý
                                        </Text>
                                    </MenuOption>
                                )
                            }
                        }
                    } else {
                        //Bắt đầu xử lý
                        menuActions.push(
                            <MenuOption key={12}
                                onSelect={() => this.onConfirmToStartTask()}
                                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                                <Text style={MenuOptionStyle.text}>
                                    Bắt đầu xử lý
                                </Text>
                            </MenuOption>
                        )
                    }
                }
            }
        }

        //menu thông tin về công việc

        menuActions.push(
            <MenuOption
                key='m1'
                onSelect={() => this.onGetGroupSubTask()}
                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                <Text style={MenuOptionStyle.text}>
                    Các công việc con
                </Text>
            </MenuOption>
        );

        menuActions.push(
            <MenuOption
                key='m2'
                onSelect={() => this.onGetProgressHistory()}
                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                <Text style={MenuOptionStyle.text}>
                    Theo dõi tiến độ
                </Text>
            </MenuOption>
        );

        menuActions.push(
            <MenuOption
                key='m3'
                onSelect={() => this.onGetRescheduleHistory()}
                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                <Text style={MenuOptionStyle.text}>
                    Lịch sử lùi hạn
                </Text>
            </MenuOption>
        );

        menuActions.push(
            <MenuOption
                key='m4'
                onSelect={() => this.onGetEvaluationHistory()}
                style={[MenuOptionStyle.wrapper, MenuOptionStyle.wrapperBorder]}>
                <Text style={MenuOptionStyle.text}>
                    Lịch sử phản hồi
                </Text>
            </MenuOption>
        );

        // console.tron.log(">>"+menuActions)

        return (
            <MenuProvider>
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

                            {
                                renderIf(menuActions.length > 0)(
                                    <Menu style={{ marginHorizontal: scale(5) }}>
                                        <MenuTrigger>
                                            <Icon name='dots-three-horizontal' color={Colors.WHITE} type='entypo' size={verticalScale(25)} />
                                        </MenuTrigger>

                                        <MenuOptions customStyles={MenuOptionsCustomStyle}>
                                            {
                                                menuActions
                                            }
                                        </MenuOptions>
                                    </Menu>
                                )
                            }
                        </Right>
                    </Header>

                    {
                        bodyContent
                    }

                    {/* hiệu ứng xử lý */}

                    {
                        executeLoading(this.state.executing)
                    }
                </Container>
            </MenuProvider>
        );
    }
}


class TaskContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: props.userInfo,
            info: props.info,
            selectedTabIndex: 0
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
                        <TaskDescription info={this.props.info} />
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
                        <TaskDescription info={this.props.info} />
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

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(DetailTask);