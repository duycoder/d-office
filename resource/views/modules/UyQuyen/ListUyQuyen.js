/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
    AsyncStorage, ActivityIndicator, View,
    FlatList, RefreshControl, TouchableOpacity,
    Text as RnText, Alert
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as vanbandiAction from '../../../redux/modules/VanBanDi/Action';
//lib
import {
    Container, Header, Item, Icon, Input, Body, Text,
    Content, Badge, Left, Right, Button, SwipeRow,
    Fab, Toast, ListItem as NbListItem
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToString, convertDateToString } from '../../../common/Utilities';
import {
    API_URL, HEADER_COLOR, LOADER_COLOR, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
    Colors,
} from '../../../common/SystemConstant';
import { indicatorResponsive, verticalScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';

import AlertMessage from '../../common/AlertMessage';
import AlertMessageStyle from '../../../assets/styles/AlertMessageStyle';

class ListUyQuyen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterValue: '',
            userId: this.props.userInfo.ID,
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
            loadingData: false,
            loadingMoreData: false,
            refreshingData: false,
            executing: false,
            data: [],

            tmpItemId: '',
        }
    }

    componentWillMount() {
        this.setState({
            loadingData: true
        }, () => {
            this.fetchData();
        })
    }

    async fetchData() {
        const url = `${API_URL}/api/QuanLyUyQuyen/DanhSachUyQuyen/${this.state.userId}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;
        const result = await fetch(url);

        const resultJson = await result.json();

        this.setState({
            data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
            loadingData: false,
            loadingMoreData: false,
            refreshingData: false,
            executing: false,
        });
    }

    navigateToDetail = (authorizedId) => {
        let currentScreenName = "ListUyQuyenScreen";
        let targetScreenParam = {
            authorizedId,
        }
        appStoreDataAndNavigate(this.props.navigation, currentScreenName, new Object(), "EditUyQuyenScreen", targetScreenParam);
    }

    onFilter = () => {
        this.setState({
            loadingData: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => {
            this.fetchData()
        })
    }

    loadingMore() {
        this.setState({
            loadingMoreData: true,
            pageIndex: this.state.pageIndex + 1,
        }, () => {
            this.fetchData()
        })
    }

    handleRefresh = () => {
        this.setState({
            refreshingData: true,
            pageIndex: DEFAULT_PAGE_INDEX,
        }, () => {
            this.fetchData()
        })
    }

    onConfirmDelete = (itemId) => {
        this.setState({
            tmpItemId: itemId
        }, () => {
            this.refs.confirm.showModal();
        })

        // Alert.alert(
        //     'XÓA ỦY QUYỀN',
        //     'Bạn có chắc chắn xóa bản ghi này',
        //     [
        //         {
        //             text: 'CÓ',
        //             onPress: () => this.onDelete(itemId)
        //         },
        //         {
        //             text: 'KHÔNG',
        //             onPress: () => { }
        //         }
        //     ]
        // )
    }

    onDelete = async (itemId) => {
        this.refs.confirm.closeModal();
        this.setState({
            executing: true
        })
        const url = `${API_URL}/api/QuanLyUyQuyen/${itemId}`
        const result = await fetch(url, {
            method: 'delete',
        }).then(response => response.json());
        this.setState({
            executing: false
        })
        Toast.show({
            text: result.Status ? 'Xóa ủy quyền thành công' : 'Xóa ủy quyền thất bại',
            type: result.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: result.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (result.Status) {
                    this.fetchData();
                }
            }
        });
    }

    renderItem = ({ item, index }) => {
        return (
            <SwipeRow
                leftOpenValue={75}
                rightOpenValue={-75}
                left={
                    <Button style={{ backgroundColor: Colors.LITE_BLUE }} onPress={() => this.navigateToDetail(item.ID)}>
                        <RneIcon name='pencil' type='material-community' size={verticalScale(30)} color={Colors.WHITE} />
                    </Button>
                }
                body={
                    <View>
                        <Body>
                            <Text>{item.TenNguoiDuocUyQuyen}</Text>
                            <Text note>
                                {convertDateToString(item.NGAY_BATDAU) + " - " + convertDateToString(item.NGAY_KETTHUC)}
                            </Text>
                        </Body>
                    </View>
                }

                right={
                    <Button style={{ backgroundColor: Colors.RED }} onPress={() => this.onConfirmDelete(item.ID)}>
                        <RneIcon name='trash-can' type='material-community' size={verticalScale(30)} color={'#fff'} />
                    </Button>
                }
            />
        );
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <RneIcon name="arrow-left" size={25} color={Colors.WHITE} type="material-community" />
                        </TouchableOpacity>
                    </Left>
                    <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Tên người được ủy quyền'
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onFilter()} />
                        <Icon name='ios-document' />
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
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshingData}
                                            onRefresh={this.handleRefresh}
                                            colors={[Colors.BLUE_PANTONE_640C]}
                                            tintColor={[Colors.BLUE_PANTONE_640C]}
                                            title='Kéo để làm mới'
                                            titleColor={Colors.RED}
                                        />
                                    }
                                    ListEmptyComponent={() =>
                                        this.state.loadingData ? null : emptyDataPage()
                                    }
                                    ListFooterComponent={() => this.state.loadingMoreData ?
                                        <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                                        (
                                            this.state.data && this.state.data.length >= DEFAULT_PAGE_SIZE ?
                                                <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                                                    <Text>
                                                        TẢI THÊM
                                                </Text>
                                                </Button>
                                                : null
                                        )
                                    }
                                />

                                <Fab
                                    active={true}
                                    direction="up"
                                    containerStyle={{}}
                                    style={{ backgroundColor: Colors.LITE_BLUE }}
                                    position="bottomRight"
                                    onPress={() => this.navigateToDetail(0)}>
                                    <Icon name="add" />
                                </Fab>
                            </View>
                        )
                    }

                    {
                        executeLoading(this.state.executing)
                    }
                </Content>

                <AlertMessage
                    ref="confirm"
                    title="XÓA ỦY QUYỀN"
                    bodyText="Bạn có chắc chắn xóa bản ghi này"
                    exitText="KHÔNG"
                >
                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onDelete(this.state.tmpItemId)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                CÓ
                            </RnText>
                        </TouchableOpacity>
                    </View>
                </AlertMessage>
            </Container>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
    }
}

export default connect(mapStatetoProps)(ListUyQuyen);