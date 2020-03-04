/**
 * @description: danh sách công việc đã được lọc
 * @author: duynn
 * @since: 15/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
    RefreshControl, ActivityIndicator, View, Text, FlatList, TouchableOpacity, Image
} from 'react-native';

//constant
import {
    API_URL, DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE, EMPTY_DATA_ICON_URI,
    EMPTY_STRING, EMTPY_DATA_MESSAGE,
    LOADER_COLOR,
    Colors
} from '../../../common/SystemConstant';

//native-base
import {
    Icon, Item, Input, Container, Header, Content
} from 'native-base';

//react-native-elements
import { ListItem } from 'react-native-elements';

//redux
import { connect } from 'react-redux';

//lib
import renderIf from 'render-if';

//styles
import { ListTaskStyle } from '../../../assets/styles/TaskStyle';
import { indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

//utilities
import { convertDateToString, showWarningToast } from '../../../common/Utilities';

import * as util from 'lodash';
import { NativeBaseStyle } from '../../../assets/styles';

class ListFilterTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userInfo.ID,
            loading: false,
            refreshing: false,
            data: [],
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
            filterValue: this.props.navigation.state.params.filterValue,
            filterType: this.props.navigation.state.params.filterType,
            showFilter: false
        };
        this.filterTypeConst = {
            CHUA_XULY: 1,
            DA_XULY: 2,
            CAN_REVIEW: 3,
            DA_REVIEW: 4,
        };
    }

    componentDidMount = () => {
        this.fetchData();
    }

    fetchData = async () => {
        const { filterType, refreshing, userId, pageSize, pageIndex, filterValue } = this.state;

        let apiUrlParam = 'PersonalWork';
        switch (+filterType) {
            case this.filterTypeConst.CHUA_XULY: apiUrlParam = 'PersonalWork';
                break;
            case this.filterTypeConst.DA_XULY: apiUrlParam = 'AssignedWork';
                break;
            case this.filterTypeConst.CAN_REVIEW: apiUrlParam = 'CombinationWork';
                break;
            case this.filterTypeConst.DA_REVIEW: apiUrlParam = 'ProcessedJob';
                break;
            default: apiUrlParam = 'PersonalWork';
                break;
        }

        this.setState({
            loading: !refreshing ? true : false,
        });

        const result = await taskApi().getListFilterTask([
            userId,
            pageSize,
            `%{pageIndex}?query=${filterValue}`
        ], apiUrlParam);

        this.setState({
            loading: false,
            refreshing: false,
            data: refreshing ? result : [...this.state.data, ...result]
        });
    }

    clearFilterValue = () => {
        this.setState({
            filterValue: EMPTY_STRING
        });
    }

    onFilter = () => {
        if (util.isNull(this.state.filterValue) || util.isEmpty(this.state.filterValue)) {
            showWarningToast('Vui lòng nhập tên công việc');
        } else {
            this.setState({
                data: [],
                pageIndex: DEFAULT_PAGE_INDEX,
                pageSize: DEFAULT_PAGE_SIZE
            }, () => {
                this.fetchData();
            })
        }
    }

    renderItem = ({ item }) => {
        let content = [];

        if (item == this.state.data[0]) {
            content.push(
                <ListItem key={-1}
                    leftIcon={
                        <Text style={{ color: '#9E9E9E' }}>
                            KẾT QUẢ
                        </Text>
                    }

                    rightIcon={
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>
                            {this.state.data.length}
                        </Text>
                    }
                    containerStyle={{ height: 40, backgroundColor: '#EEE', justifyContent: 'center' }}
                />
            )
        }

        content.push(
            <TouchableOpacity key={item.ID} onPress={() => this.props.navigation.navigate('DetailTaskScreen', {
                docId: item.ID
            })}>
                <ListItem
                    leftIcon={
                        <View style={ListTaskStyle.leftSide}>
                            {
                                renderIf(item.HAS_FILE)(
                                    <Icon name='ios-attach' />
                                )
                            }
                        </View>
                    }

                    title={
                        <Text style={item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal}>
                            {item.TENCONGVIEC}
                        </Text>
                    }

                    subtitle={
                        <Text style={[item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal, ListTaskStyle.abridgment]}>
                            {'Hạn xử lý: ' + convertDateToString(item.NGAYHOANTHANH_THEOMONGMUON)}
                        </Text>
                    }
                />
            </TouchableOpacity>
        )
        return (content);
    }

    handleEnd = () => {
        if (this.state.data.length >= DEFAULT_PAGE_SIZE) {
            this.setState(state => ({
                pageIndex: state.pageIndex + 1
            }), () => this.fetchData());
        }
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
        }, () => {
            this.fetchData();
        });
    }

    navigateToList() {
        let screenName = 'ListPersonalTaskScreen';

        if (this.state.filterType == 2) {
            screenName = 'ListAssignedTaskScreen'
        } else if (this.state.filterType == 3) {
            screenName = 'ListCombinationTaskScreen'
        } else if (this.state.filterType == 4) {
            screenName = 'ListProcessedTaskScreen'
        }
        this.props.navigation.navigate(screenName);
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded style={NativeBaseStyle.container}>
                    <Item style={{ backgroundColor: Colors.WHITE }}>
                        <Icon name="ios-arrow-round-back" onPress={() => this.navigateToList()} />
                        <Input placeholder="Tên công việc"
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onFilter()} />
                        <Icon name="ios-close" onPress={() => this.clearFilterValue()} />
                    </Item>
                </Header>
                <Content>
                    <FlatList
                        onEndReached={() => this.handleEnd()}
                        onEndReachedThreshold={0.1}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        ListFooterComponent={() => this.state.loading ? <ActivityIndicator size={indicatorResponsive} animating color={LOADER_COLOR} /> : null}
                        ListEmptyComponent={() =>
                            this.state.loading ? null : (
                                <View style={ListTaskStyle.emtpyContainer}>
                                    <Image source={EMPTY_DATA_ICON_URI} style={ListTaskStyle.emptyIcon} />
                                    <Text style={ListTaskStyle.emptyMessage}>
                                        {EMTPY_DATA_MESSAGE}
                                    </Text>
                                </View>
                            )
                        }

                        refreshControl={
                            <RefreshControl
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                colors={[LOADER_COLOR]}
                                title={'Kéo để làm mới'}
                            />
                        }
                    />
                </Content>
            </Container>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStatetoProps)(ListFilterTask);