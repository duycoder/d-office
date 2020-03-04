import React, { Component } from 'react'
import {
    FlatList, RefreshControl, AsyncStorage, StatusBar
} from 'react-native'

//constant
import {
    EMPTY_STRING, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors} from '../../../common/SystemConstant';
import { emptyDataPage, showWarningToast } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';

import {
    Container, Header, Title, Content,
    Left, Body, Right} from 'native-base';
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';
import { accountApi } from '../../../common/Api';
import { RecentNoti, AuthorizeNoti } from '../../common/DashboardCommon';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { AddButton, MoreButton } from '../../common';

const AccountApi = accountApi();

class ListNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: props.userInfo,
            loading: false,
            loadingMore: false,
            refreshing: false,
            data: [],
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,

            dataUyQuyen: [],
            isRefreshNotiList: false,
        }
    }

    onPressNotificationItem = async (item) => {
        //update read state for unread noti
        if (!item.IS_READ) {

            this.setState({
                isRefreshNotiList: true,
            });
        }

        //navigate to detail
        let screenName = EMPTY_STRING;
        let screenParam = {};

        let outOfSwitch = false;
        if (item.URL) {
            let urlArr = item.URL.split("/");
            const itemType = urlArr[2] || item.NOTIFY_ITEM_TYPE;
            const itemId = +urlArr[3].split("&").shift().match(/\d+/gm) || item.NOTIFY_ITEM_ID;
            switch (itemType) {
                case "HSVanBanDi":
                    screenName = "VanBanDiDetailScreen";
                    screenParam = {
                        docId: itemId,
                        docType: "1"
                    };
                    break;
                case "QuanLyCongViec":
                    screenName = "DetailTaskScreen";
                    screenParam = {
                        taskId: urlArr[4],
                        taskType: "1"
                    };
                    break;
                case "HSCV_VANBANDEN":
                    screenName = "VanBanDenDetailScreen";
                    screenParam = {
                        docId: itemId,
                        docType: "1"
                    };
                    break;
                case "QL_LICHHOP":
                    screenName = "DetailMeetingDayScreen";
                    screenParam = {
                        lichhopId: itemId,
                    };
                    break;
                case "QL_DANGKY_XE":
                    screenName = "DetailCarRegistrationScreen";
                    screenParam = {
                        registrationId: itemId,
                    };
                    break;
                case "QL_CHUYEN":
                    screenName = "DetailTripScreen";
                    screenParam = {
                        tripId: itemId,
                    };
                    break;
                case "KeHoachKhoa":
                    screenName = "ListLichtrucScreen";
                    screenParam = {
                        listIds: [itemId],
                    };
                    break;
                default:
                    outOfSwitch = true;
                    break;
            }
        }
        else {
            outOfSwitch = true;
        }

        if (outOfSwitch) {
            showWarningToast('Bạn không có quyền truy cập vào thông tin này!');
        }
        this.props.updateCoreNavParams(screenParam);
        this.props.navigation.navigate(screenName);
    }

    componentDidMount = async () => {
        const userInfo = this.state.userInfo;
        userInfo.numberUnReadMessage = 0;
        await AsyncStorage.removeItem('firebaseNotification');
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            if (this.state.isRefreshNotiList) {
                this.setState({
                    loading: true,
                    isRefreshNotiList: false
                }, () => this.fetchData());
            }
            if (this.props.extendsNavParams.hasOwnProperty("checkRefreshUyQuyenList")) {
                if (this.props.extendsNavParams.checkRefreshUyQuyenList === true) {
                    this.setState({
                        loading: true
                    }, () => this.fetchDataUyQuyen())
                }
                this.props.updateExtendsNavParams({ checkRefreshUyQuyenList: false });
            }
        });
    }

    componentWillMount = () => {
        this.setState({
            loading: true
        }, () => {
            this.fetchData();
            this.fetchDataUyQuyen();
        });
    }

    componentWillUnmount = () => {
        this._navListener.remove();
    }

    onLoadingMore = () => {
        this.setState({
            loadingMore: true,
            pageIndex: this.state.pageIndex + 1
        }, () => this.fetchData())
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => this.fetchData())
    }

    fetchDataUyQuyen = async () => {
        const result = await AccountApi.getListNotiUyquyen();

        this.setState({
            loading: false,
            dataUyQuyen: result
        })
    }

    fetchData = async () => {
        const {
            userInfo, pageSize, pageIndex
        } = this.state;
        const result = await AccountApi.getRecentNoti([
            userInfo.ID,
            pageSize,
            pageIndex,
            "true?query="
        ]);

        this.setState({
            loading: false,
            loadingMore: false,
            refreshing: false,
            data: this.state.loadingMore ? this.state.data.concat(result) : result
        })
    }
    renderItem = ({ item, index }) => (<RecentNoti item={item} index={index} key={index.toString()} onPressNotificationItem={this.onPressNotificationItem} />)

    createNotiUyQuyen = () => {
        this.props.navigation.navigate("CreateNotiUyQuyenScreen");
    }

    render() {
        return (
            <Container>
                <StatusBar barStyle="light-content" />
                <Header style={NativeBaseStyle.container}>
                    <Left style={{ flex: 1 }} />
                    <Body style={{ alignItems: 'center', flex: 8 }}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            THÔNG BÁO
                        </Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>

                <Content contentContainerStyle={{ flex: 1 }}>
                    {
                        renderIf(this.state.loading)(
                            dataLoading()
                        )
                    }

                    {
                        renderIf(!this.state.loading)(
                            renderIf(this.state.dataUyQuyen.length > 0)(
                                this.state.dataUyQuyen.map((item, index) => (<AuthorizeNoti key={index.toString()} item={item} index={index} />))
                            )
                        )
                    }

                    {
                        renderIf(!this.state.loading)(
                            <FlatList
                                data={this.state.data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.handleRefresh}
                                        colors={[Colors.BLUE_PANTONE_640C]}
                                        tintColor={[Colors.BLUE_PANTONE_640C]}
                                        title='Kéo để làm mới'
                                        titleColor={Colors.RED}
                                    />
                                }
                                ListEmptyComponent={() =>
                                    emptyDataPage()
                                }
                                ListFooterComponent={() => (<MoreButton
                                    isLoading={this.state.loadingMore}
                                    isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
                                    loadmoreFunc={this.onLoadingMore} />)}
                            />
                        )
                    }
                </Content>
                <AddButton
                    hasPermission={this.state.userInfo.CanUyQuyen}
                    createFunc={this.createNotiUyQuyen}
                />
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
        updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
        updateExtendsNavParams: (coreNavParams) => dispatch(navAction.updateExtendsNavParams(coreNavParams)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListNotification);