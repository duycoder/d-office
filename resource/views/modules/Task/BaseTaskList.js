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

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
    Container, Header, Left, Input,
    Item, Icon, Button, Text, Content
} from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import renderIf from 'render-if';

//constant
import {
    API_URL, HEADER_COLOR, EMPTY_STRING,
    LOADER_COLOR, CONGVIEC_CONSTANT,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
    Colors
} from '../../../common/SystemConstant';

//utilities
import { indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';
import { getColorCodeByProgressValue, convertDateToString, emptyDataPage, appStoreDataAndNavigate } from '../../../common/Utilities';

//styles
import { ListTaskStyle } from '../../../assets/styles/TaskStyle';

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

    omponentDidMount = () => {
        this.willFocusListener = this.props.navigator.addListener('didFocus', () => {
          if (this.props.extendsNavParams.hasOwnProperty("check")) {
            if (this.props.extendsNavParams.check === true) {
              this.fetchData();
              this.props.updateExtendsNavParams({ check: false });
            }
          }
        })
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
        let { navigation } = this.props;
        let currentScreenName = "ListPersonalTaskScreen";

        if (this.state.taskType == CONGVIEC_CONSTANT.DUOC_GIAO) {
            currentScreenName = "ListAssignedTaskScreen"
        } else if (this.state.taskType == CONGVIEC_CONSTANT.PHOIHOP_XULY) {
            currentScreenName = "ListCombinationTaskScreen"
        } else if (this.state.taskType == CONGVIEC_CONSTANT.DAGIAO_XULY) {
            currentScreenName = "ListProcessedTaskScreen"
        }

        let targetScreenParam = {
            taskId,
            taskType: this.state.taskType,
            screenName: "DetailTaskScreen",
            rootScreenName: currentScreenName
        }

        this.props.updateCoreNavParams(targetScreenParam);
        this.props.navigator.navigate("DetailTaskScreen");

        // appStoreDataAndNavigate(this.props.navigator, currentScreenName, new Object(), "DetailTaskScreen", targetScreenParam);
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
        return (
            <View>
                <ListItem
                    hideChevron={true}
                    badge={{
                        value: (item.PHANTRAMHOANTHANH || 0) + '%',
                        textStyle: {
                            color: Colors.WHITE,
                            fontWeight: 'bold'
                        },
                        containerStyle: {
                            backgroundColor: getColorCodeByProgressValue(item.PHANTRAMHOANTHANH),
                            borderRadius: 3
                        }
                    }}

                    leftIcon={
                        <View style={ListTaskStyle.leftSide}>
                            {
                                renderIf(item.HasChild && item.isExpand == true)(
                                    <TouchableOpacity onPress={
                                        (idx, isExpand, taskId, parentIds) => this.getListSubTasks.bind(this)(index, item.isExpand, item.ID, item.parentIds)}>
                                        <RneIcon name='folder-open-o' type='font-awesome' />
                                    </TouchableOpacity>
                                )
                            }

                            {
                                renderIf(item.HasChild && item.isExpand == false)(
                                    <TouchableOpacity onPress={
                                        (idx, isExpand, taskId, parentIds) => this.getListSubTasks.bind(this)(index, item.isExpand, item.ID, item.parentIds)}>
                                        <RneIcon name='folder-o' type='font-awesome' />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    }

                    title={
                        <TouchableOpacity onPress={() => this.navigateToDetail(item.ID)}>
                            <RnText style={item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal}>
                                <RnText style={{ fontWeight: 'bold' }}>
                                    Tên công việc:
                                </RnText>
                                <RnText>
                                    {' ' + item.TENCONGVIEC}
                                </RnText>
                            </RnText>
                        </TouchableOpacity>
                    }

                    subtitle={
                        <TouchableOpacity onPress={() => this.navigateToDetail(item.ID)}>
                            <RnText style={[item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal, ListTaskStyle.abridgment]}>
                                <RnText style={{ fontWeight: 'bold' }}>
                                    Hạn xử lý:
                                </RnText>
                                <RnText>
                                    {' ' + convertDateToString(item.NGAYHOANTHANH_THEOMONGMUON)}
                                </RnText>
                            </RnText>
                        </TouchableOpacity>
                    }
                />

            </View>
        );
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Item style={{ backgroundColor: Colors.WHITE }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Tên công việc'
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onFilter()}
                        />
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