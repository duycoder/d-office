/**
 * @description: màn hình công việc
 * @author: duynn
 * @since: 29/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
    AsyncStorage, ActivityIndicator, View, Text as RnText,
    FlatList, RefreshControl, TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
    Container, Header, Left, Input,
    Item, Icon, Button, Text, Content, Fab
} from 'native-base';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';
import renderIf from 'render-if';

//constant
import {
    API_URL, HEADER_COLOR, EMPTY_STRING,
    LOADER_COLOR, CONGVIEC_CONSTANT,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
    Colors,
    DOKHAN_CONSTANT
} from '../../../common/SystemConstant';

//utilities
import { indicatorResponsive, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';
import { getColorCodeByProgressValue, convertDateToString, emptyDataPage, appStoreDataAndNavigate, asyncDelay } from '../../../common/Utilities';

//styles
import { ListTaskStyle, DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import GoBackButton from '../../common/GoBackButton';

class BaseTaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userInfo.ID,

            filterValue: EMPTY_STRING,
            data: [],

            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,

            executing: false,
            loadingData: false,
            refreshingData: false,
            searchingData: false,
            loadingMoreData: false,
            taskType: props.taskType || props.coreNavParams.taskType
        }
    }

    componentWillMount() {
        this.setState({
            loadingData: true
        }, () => {
            this.fetchData();
        })
    }

    componentDidMount = () => {
        const navObj = this.props.navigator || this.props.navigation;
        this.willFocusListener = navObj.addListener('didFocus', () => {
            if (this.props.extendsNavParams.hasOwnProperty("check")) {
                if (this.props.extendsNavParams.check === true) {
                    this.setState({
                        loadingData: true
                    }, () => {
                        this.fetchData();
                    });
                    this.props.updateExtendsNavParams({ check: false });
                }
            }
        });
    }

    componentWillUnmount = () => {
        this.willFocusListener.remove();
    }

    async fetchData() {
        const loadingMoreData = this.state.loadingMoreData;
        const refreshingData = this.state.refreshingData;
        const loadingData = this.state.loadingData;

        let apiUrlParam = 'PersonalWork';

        const { taskType } = this.state;
        if (taskType == CONGVIEC_CONSTANT.DUOC_GIAO) {
            apiUrlParam = 'AssignedWork';
        } else if (taskType == CONGVIEC_CONSTANT.PHOIHOP_XULY) {
            apiUrlParam = 'CombinationWork';
        } else if (taskType == CONGVIEC_CONSTANT.DAGIAO_XULY) {
            apiUrlParam = 'ProcessedJob';
        } else if (taskType == CONGVIEC_CONSTANT.CHO_XACNHAN) {
            apiUrlParam = 'PendingConfirmWork'
        }

        const url = `${API_URL}/api/HscvCongViec/${apiUrlParam}/${this.state.userId}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;
        const result = await fetch(url);
        const resultJson = await result.json();

        this.setState({
            loadingData: false,
            refreshingData: false,
            searchingData: false,
            loadingMoreData: false,
            data: (loadingData || refreshingData) ? resultJson.ListItem : [...this.state.data, ...resultJson.ListItem]
        });
    }

    onFilter() {
        this.setState({
            loadingData: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => {
            this.fetchData();
        })
    }

    onClearFilter = () => {
        this.setState({
            loadingData: true,
            pageIndex: DEFAULT_PAGE_INDEX,
            filterValue: EMPTY_STRING
        }, () => {
            this.fetchData()
        })
    }

    onLoadingMore() {
        this.setState({
            loadingMoreData: true,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            this.fetchData();
        })
    }

    handleRefresh = () => {
        this.setState({
            refreshingData: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => {
            this.fetchData();
        })
    }

    navigateToDetail = async (taskId) => {
        // let { navigation } = this.props;
        // let currentScreenName = "ListPersonalTaskScreen";

        // if (this.state.taskType == CONGVIEC_CONSTANT.DUOC_GIAO) {
        //     currentScreenName = "ListAssignedTaskScreen"
        // } else if (this.state.taskType == CONGVIEC_CONSTANT.PHOIHOP_XULY) {
        //     currentScreenName = "ListCombinationTaskScreen"
        // } else if (this.state.taskType == CONGVIEC_CONSTANT.DAGIAO_XULY) {
        //     currentScreenName = "ListProcessedTaskScreen"
        // }

        if (taskId > 0) {
            let targetScreenParam = {
                taskId,
                taskType: this.state.taskType
            }

            this.props.updateCoreNavParams(targetScreenParam);
            this.props.navigator.navigate("DetailTaskScreen");
        }
        else {
            let targetScreenParam = {
                fromScreen: "ListPersonalTaskScreen",

            }
            this.props.updateExtendsNavParams(targetScreenParam);
            this.props.navigator.navigate("CreateTaskScreen");
        }

    }

    async getListSubTasks(index, isExpand, taskId, parentIds) {
        if (isExpand == false) {
            this.setState({
                executing: true
            });

            const taskObj = {
                rootParentId: taskId,
                userId: this.state.userId,
                parentIds
            }

            const url = `${API_URL}/api/HscvCongViec/GetListSubTasks`;
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            });
            const body = JSON.stringify(taskObj);

            const result = await fetch(url, {
                method: 'post',
                headers,
                body
            });

            const resultJson = await result.json();

            //thêm đối tượng vào mảng
            this.state.data.splice((index + 1), 0, ...resultJson);

            //sửa hiển thị icon của công việc cha
            this.state.data = this.state.data.map((item) => {
                if (item.ID == taskId) {
                    return { ...item, isExpand: true };
                }
                return item;
            })

            await asyncDelay();

            this.setState({
                executing: false,
                data: this.state.data
            })
        } else {
            this.state.data = this.state.data.filter(item => (item.parentIds == null || item.parentIds.indexOf(taskId) < 0));
            //sửa hiển thị icon của công việc con
            this.state.data = this.state.data.map((item) => {
                if (item.ID == taskId) {
                    return { ...item, isExpand: false }
                }
                return item;
            })

            this.setState({
                data: this.state.data
            })
        }
    }

    renderItem = ({ item, index }) => {
        const readStateTextStyle = item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal,
            progressColor = getColorCodeByProgressValue(item.PHANTRAMHOANTHANH),
            progressText = `${item.PHANTRAMHOANTHANH || 0}%`;

        let progressBars = Math.floor(item.PHANTRAMHOANTHANH / 10),
            renderBars = new Array(10).fill(0);

        while (progressBars > -1) {
            renderBars[--progressBars] = 1;
        }

        const dokhanText = item.DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
            ? 'R.Q.TRỌNG'
            : ((item.DOKHAN == DOKHAN_CONSTANT.KHAN) ? 'Q.TRỌNG' : 'THƯỜNG'),
            dokhanBgColor = item.DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
                ? Colors.RED_PANTONE_186C
                : ((item.DOKHAN == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C);

        return (
            <View>
                <ListItem
                    // hideChevron={true}
                    containerStyle={{ borderBottomWidth: 0, paddingBottom: 0 }}
                    title={
                        <RnText style={[readStateTextStyle, { fontWeight: 'bold', fontSize: moderateScale(12, 1.2) }]}>
                            {item.TENCONGVIEC}
                        </RnText>
                    }

                    subtitle={
                        <View style={{ marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: "35%" }}>
                                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                                        Hạn xử lý:
                                    </RnText>
                                </View>
                                <View style={{ width: "65%" }}>
                                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                        {' ' + convertDateToString(item.NGAYHOANTHANH_THEOMONGMUON)}
                                    </RnText>
                                </View>
                            </View>
                            {
                                (item.NOIDUNGCONGVIEC && item.NOIDUNGCONGVIEC.length > 0) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: "35%" }}>
                                        <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                                            Nội dung:
                                        </RnText>
                                    </View>
                                    <View style={{ width: "65%" }}>
                                        {
                                            item.NOIDUNGCONGVIEC.indexOf("<p>") < 0
                                                ? <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                                    {' ' + item.NOIDUNGCONGVIEC}
                                                </RnText>
                                                : <HTMLView
                                                    value={item.NOIDUNGCONGVIEC}
                                                    stylesheet={{ p: [DetailTaskStyle.listItemSubTitleContainer, { fontSize: moderateScale(12, 1.1), marginHorizontal: 3 }] }}
                                                />
                                        }
                                    </View>
                                </View>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: "35%" }}>
                                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                                        Người xử lý chính:
                                    </RnText>
                                </View>
                                <View style={{ width: "65%" }}>
                                    {
                                        (item.TEN_NGUOIXULYCHINH && item.TEN_NGUOIXULYCHINH.length > 0)
                                            ? <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                                {' ' + item.TEN_NGUOIXULYCHINH}
                                            </RnText>
                                            : <RnText style={{ fontSize: moderateScale(12, 1.1), color: Colors.RED_PANTONE_186C }}>
                                                {' Chưa giao việc'}
                                            </RnText>
                                    }
                                </View>
                            </View>
                        </View>
                    }
                    rightIcon={
                        <View style={{ flexDirection: 'column' }}>
                            <RNEIcon name='flag' size={26} color={dokhanBgColor} type='material-community' />
                            {
                                item.HAS_FILE == true && <RNEIcon name='ios-attach' size={26} type='ionicon' />
                            }
                        </View>
                    }
                    onPress={() => this.navigateToDetail(item.ID)}
                />
                <View style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1), fontWeight: 'bold', textAlign: "right" }}>{progressText}</RnText>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        {
                            renderBars.map((item, index) => {
                                let bgColor = Colors.GRAY;
                                if (!!item) {
                                    bgColor = progressColor;
                                }
                                return (
                                    <View key={index.toString()} style={[ListTaskStyle.progressBars, { backgroundColor: bgColor }]}></View>
                                );
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={{ flex: 1 }}>
                        <GoBackButton onPress={() => this.props.navigator.goBack()} buttonStyle='100%' />
                    </Left>

                    <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Tên công việc'
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onFilter()}
                        />
                        {
                            this.state.filterValue !== EMPTY_STRING
                                ? <Icon name='ios-close-circle' onPress={this.onClearFilter} />
                                : null
                        }
                    </Item>
                </Header>

                <Content contentContainerStyle={{ flex: 1 }}>
                    {
                        renderIf(this.state.loadingData)(
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                            </View>
                        )
                    }

                    {
                        renderIf(!this.state.loadingData)(
                            <FlatList
                                data={this.state.data}
                                keyExtractor={(item, index) => item.ID.toString()}
                                renderItem={this.renderItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshingData}
                                        onRefresh={this.handleRefresh}
                                        title='Kéo để làm mới'
                                        colors={[Colors.BLUE_PANTONE_640C]}
                                        tintColor={[Colors.BLUE_PANTONE_640C]}
                                        titleColor={Colors.RED}
                                    />
                                }
                                ListFooterComponent={
                                    this.state.loadingMoreData ?
                                        <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                                        (
                                            this.state.data.length >= DEFAULT_PAGE_SIZE ?
                                                <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.onLoadingMore()}>
                                                    <Text>
                                                        TẢI THÊM
                                                        </Text>
                                                </Button>
                                                : null
                                        )
                                }

                                ListEmptyComponent={() => emptyDataPage()}
                            />
                        )
                    }

                    {
                        executeLoading(this.state.executing)
                    }

                </Content>
                {
                    this.state.taskType === CONGVIEC_CONSTANT.CA_NHAN &&
                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: Colors.MENU_BLUE }}
                        position="bottomRight"
                        onPress={() => this.navigateToDetail(0)}>
                        <Icon name="add" />
                    </Fab>
                }
            </Container>
        )
    }
}

const mapStatetoProps = (state) => {
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

export default connect(mapStatetoProps, mapDispatchToProps)(BaseTaskList);