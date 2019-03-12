import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
//lib
import {
    Container, Header, Item, Icon, Input, Body, Text,
    Content, Badge, Left, Right, Button, SwipeRow, Tabs, ScrollableTab,
    TabHeading, Title, Tab, Form, Label, Toast
} from 'native-base'
import { connect } from 'react-redux';
import { Icon as RneIcon } from 'react-native-elements'
import renderIf from 'render-if';
import DatePicker from 'react-native-datepicker';

//local util
import {
    API_URL, HEADER_COLOR, LOADER_COLOR, LOADMORE_COLOR, EMPTY_STRING,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, WORKFLOW_PROCESS_TYPE, Colors
} from '../../../common/SystemConstant';
import { moderateScale, indicatorResponsive, verticalScale, scale } from '../../../assets/styles/ScaleIndicator';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, convertDateToString, _readableFormat } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';

//views
import DeptUyQuyen from './DeptUyQuyen';

//reducer
import * as action from '../../../redux/modules/UyQuyen/Action';

class EditUyQuyen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorizedId: this.props.navigation.state.params.authorizedId,
            userId: this.props.userInfo.ID,
            currentTabIndex: 0,
            userFilter: '',
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: DEFAULT_PAGE_INDEX,
            loadingData: false,
            loadingMoreData: false,
            searchingUser: false,
            entity: {},
            users: [],
            executing: false
        }
    }

    navigateBackToList = () => {
        appGetDataAndNavigate(this.props.navigation, 'EditUyQuyenScreen');
        return true;
    }

    componentDidMount() {
        this.setState({
            loadingData: true
        }, () => {
            this.fetchData().then(() => this.props.selectUser(this.state.entity.NGUOIDUOCUYQUYEN_ID || 0));
        })
    }

    fetchData = async () => {
        const url = `${API_URL}/api/QuanLyUyQuyen/EditUyQuyen/${this.state.userId}/${this.state.authorizedId}`;

        const result = await fetch(url).then(response => response.json());
        this.setState({
            loadingData: false,
            entity: result.Entity,
            users: result.GroupUsers
        });
    }

    onFilter = async () => {
        this.setState({
            searchingUser: true,
            pageIndex: DEFAULT_PAGE_INDEX,
        });

        const url = `${API_URL}/api/QuanLyUyQuyen/SearchUyQuyen/${this.state.userId}/${this.state.authorizedId}/${DEFAULT_PAGE_INDEX}/${this.state.pageSize}?query=${this.state.userFilter}`;

        const result = await fetch(url).then(response => response.json());
        this.setState({
            searchingUser: false,
            users: result
        })
    }

    onClearFilter = () => {
        this.setState({
            userFilter: EMPTY_STRING
        }, () => this.onFilter());
    }

    onLoadingMore = async () => {
        this.setState({
            loadingMoreData: true,
            pageIndex: this.state.pageIndex + 1
        });

        const url = `${API_URL}/api/QuanLyUyQuyen/SearchUyQuyen/${this.state.userId}/${this.state.authorizedId}/${this.state.pageIndex + 1}/${this.state.pageSize}?query=${this.state.userFilter}`;

        const result = await fetch(url).then(response => response.json());
        this.setState({
            loadingMoreData: false,
            users: [...this.state.users, ...result]
        })
    }

    setDate = (newDate, isEnd) => {
        this.setState({
            entity: {
                ...this.state.entity,
                NGAY_BATDAU: isEnd ? this.state.entity.NGAY_BATDAU : newDate,
                NGAY_KETTHUC: isEnd ? newDate : this.state.entity.NGAY_KETTHUC
            }
        })
    }

    renderItem = ({ item }) => {
        return (
            <DeptUyQuyen title={item.PhongBan.NAME} users={item.LstNguoiDung} selected={this.props.selectedUser} />
        );
    }

    convertDate = (date) => {
        let deadline = new Date();
        if (date !== null && date !== '') {
            deadline = new Date(date);
            let deadlineStr = _readableFormat(deadline.getFullYear()) + '-' + _readableFormat(deadline.getMonth() + 1) + '-' + _readableFormat(deadline.getDate());
            return deadlineStr;
        }
        return null;
    }

    onSave = async () => {
        const selectedUser = this.props.selectedUser;
        const startDate = this.state.entity.NGAY_BATDAU;
        const endDate = this.state.entity.NGAY_KETTHUC;
        if (selectedUser == 0) {
            Toast.show({
                text: 'Vui lòng chọn người ủy quyền',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
            return;
        }

        if (!startDate) {
            Toast.show({
                text: 'Vui lòng chọn ngày bắt đầu',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
            return;
        }

        if (!endDate) {
            Toast.show({
                text: 'Vui lòng chọn ngày kết thúc',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
            return;
        }

        if (startDate > endDate) {
            Toast.show({
                text: 'Thời gian ủy quyền không hợp lệ',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
            return;
        }

        this.setState({
            executing: true
        });
        const url = `${API_URL}/api/QuanLyUyQuyen/SaveUyQuyen`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const body = JSON.stringify({
            ID: this.state.entity.ID,
            NGUOIUYQUYEN_ID: this.state.userId,
            NGUOIDUOCUYQUYEN_ID: this.props.selectedUser,
            NGAY_BATDAU: this.state.entity.NGAY_BATDAU,
            NGAY_KETTHUC: this.state.entity.NGAY_KETTHUC
        })

        const result = await fetch(url, {
            method: 'post',
            headers,
            body
        });

        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            executing: false
        });

        //hiển thị kết quả xử lý
        Toast.show({
            text: resultJson.Status ? 'Ủy quyền thành công' : 'Ủy quyền thất bại',
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (resultJson.Status) {
                    this.navigateBackToList();
                }
            }
        });
    }

    render() {
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
                            CẬP NHẬT ỦY QUYỀN
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right}>
                        <Button transparent onPress={() => this.onSave()}>
                            <RneIcon name='md-save' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Right>
                </Header>
                {
                    renderIf(this.state.loadingData)(
                        dataLoading(true)
                    )
                }

                {
                    renderIf(!this.state.loadingData)(
                        <Content>
                            <Tabs
                                renderTabBar={() => <ScrollableTab />}
                                initialPage={this.state.currentTabIndex}
                                tabBarUnderlineStyle={TabStyle.underLineStyle}
                                onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
                                <Tab heading={
                                    <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                                        <Icon name='ios-person' style={TabStyle.activeText} />
                                        <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                            NGƯỜI ỦY QUYỀN
                                        </Text>
                                    </TabHeading>
                                }>
                                    <Item>
                                        <Icon name='ios-search' />
                                        <Input placeholder='Họ tên'
                                            value={this.state.userFilter}
                                            onSubmitEditing={this.onFilter}
                                            onChangeText={(value) => this.setState({ userFilter: value })}
                                        />
                                        {
                                            this.state.userFilter != EMPTY_STRING ? <Icon name='ios-close-circle' onPress={this.onClearFilter} /> : null
                                        }
                                    </Item>
                                    <Content contentContainerStyle={{ flex: 1 }}>
                                        {
                                            renderIf(this.state.searchingUser)(
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                                                </View>
                                            )
                                        }

                                        {
                                            renderIf(!this.state.searchingUser)(
                                                <FlatList
                                                    keyExtractor={(item, index) => index.toString()}
                                                    data={this.state.users}
                                                    renderItem={this.renderItem}
                                                    ListEmptyComponent={
                                                        this.state.loadingData ? null : emptyDataPage()
                                                    }
                                                    ListFooterComponent={
                                                        this.state.loadingMoreData ?
                                                            <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                                                            (
                                                                this.state.users.length >= 2 ?
                                                                    <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={this.onLoadingMore}>
                                                                        <Text>
                                                                            TẢI THÊM
                                                                        </Text>
                                                                    </Button>
                                                                    : null
                                                            )
                                                    }
                                                />
                                            )
                                        }
                                    </Content>
                                </Tab>

                                <Tab heading={
                                    <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                                        <Icon name='ios-calendar' style={TabStyle.activeText} />
                                        <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
                                            THỜI GIAN
                                </Text>
                                    </TabHeading>
                                }>
                                    <View>
                                        <Form>
                                            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
                                                <Label>Ngày bắt đầu <Text style={{ color: 'red', fontWeight: 'bold' }}>*</Text></Label>
                                                <DatePicker
                                                    style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                                                    date={this.convertDate(this.state.entity.NGAY_BATDAU)}
                                                    mode="date"
                                                    placeholder='Ngày bắt đầu'
                                                    format='YYYY-MM-DD'
                                                    minDate={new Date()}
                                                    confirmBtnText='CHỌN'
                                                    cancelBtnText='BỎ'
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 4,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            marginLeft: scale(36)
                                                        }
                                                    }}
                                                    onDateChange={(value) => this.setDate(value, false)}
                                                />
                                            </Item>

                                            <Item stackedLabel style={{ height: verticalScale(100), justifyContent: 'center' }}>
                                                <Label>Ngày kết thúc <Text style={{ color: 'red', fontWeight: 'bold' }}>*</Text></Label>
                                                <DatePicker
                                                    style={{ width: scale(300), alignSelf: 'center', marginTop: verticalScale(30) }}
                                                    date={this.convertDate(this.state.entity.NGAY_KETTHUC)}
                                                    mode="date"
                                                    placeholder='Ngày kết thúc'
                                                    format='YYYY-MM-DD'
                                                    minDate={new Date()}
                                                    confirmBtnText='CHỌN'
                                                    cancelBtnText='BỎ'
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 4,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            marginLeft: scale(36)
                                                        }
                                                    }}
                                                    onDateChange={(value) => this.setDate(value, true)}
                                                />
                                            </Item>
                                        </Form>
                                    </View>

                                </Tab>
                            </Tabs>
                        </Content>
                    )
                }

                {
                    executeLoading(this.state.executing)
                }
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
        selectedUser: state.authorizeState.selectedUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectUser: (userId) => dispatch(action.selectUser(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUyQuyen);