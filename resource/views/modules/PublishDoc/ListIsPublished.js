/**
 * @description: danh sách văn bản trình ký
 * @author: duynn
 * @since: 05/06/2018
 */
// 'use strict'
import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList, RefreshControl, View, TouchableOpacity
} from 'react-native';

//redux
import { connect } from 'react-redux';

//lib
import {
    Container, Header, Left, Right, Body, Button,
    Title, Text, Input, Icon, Item, Content
} from 'native-base';
import { ListItem } from 'react-native-elements';
import renderIf from 'render-if';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator'

//utilities
import {
    API_URL, DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE, EMPTY_STRING,
    Colors
} from '../../../common/SystemConstant';
import {
    DOKHAN_CONSTANT
} from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';
import { asyncDelay, formatLongText, emptyDataPage } from '../../../common/Utilities';

//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

class ListIsPublished extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,

            loading: false,
            loadingMore: false,
            refreshing: false,
            data: [],
            filterValue: EMPTY_STRING,
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: DEFAULT_PAGE_INDEX,
        };
    }

    componentWillMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchData();
        });
    }

    fetchData = async () => {
        const url = `${API_URL}/api/VanBanDen/${this.state.userId}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;

        const result = await fetch(url);
        const resultJson = await result.json();

        this.setState({
            loading: false,
            loadingMore: false,
            refreshing: false,
            data: this.state.loadingMore ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem
        });
    }

    onLoadingMore = () => {
        this.setState({
            loadingMore: true,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            this.fetchData();
        })
    }


    onFilter = () => {
        this.setState({
            loading: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => this.fetchData())
    }

    onHandleRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => {
            this.fetchData();
        })
    }

    onChangeFilterValue = (filterValue) => {
        this.setState({
            filterValue
        });
    }

    navigateToDetail = (id) => {
        this.props.navigation.navigate('DetailPublishDocScreen', {
            docId: id
        })
    }

    renderItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.navigateToDetail(item.ID)}>
                    <ListItem
                        hideChevron={true}
                        badge={{
                            value: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? 'T.KHẨN' : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? 'KHẨN' : 'THƯỜNG'),
                            textStyle: {
                                color: Colors.WHITE,
                                fontWeight: 'bold'
                            },
                            containerStyle: {
                                backgroundColor: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? Colors.RED_PANTONE_186C : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C),
                                borderRadius: 3
                            }
                        }}
                        leftIcon={
                            <View style={ListPublishDocStyle.leftSide}>
                                {
                                    renderIf(item.HAS_FILE)(
                                        <Icon name='ios-attach' />
                                    )
                                }
                            </View>
                        }

                        title={
                            <Text style={item.IS_READ === true ? ListPublishDocStyle.textRead : ListPublishDocStyle.textNormal}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Mã hiệu:
                                </Text>

                                <Text>
                                    {' ' + item.SOHIEU}
                                </Text>
                            </Text>
                        }

                        subtitle={
                            <Text style={[item.IS_READ === true ? ListPublishDocStyle.textRead : ListPublishDocStyle.textNormal, ListPublishDocStyle.abridgment]}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Trích yếu:
                              </Text>
                                <Text>
                                    {' ' + formatLongText(item.TRICHYEU, 50)}
                                </Text>
                            </Text>
                        }
                    />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
                    <Item  style={{ backgroundColor: Colors.WHITE }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Mã hiệu, trích yếu'
                            value={this.state.filterValue}
                            onSubmitEditing={this.onFilter}
                            onChangeText={this.onChangeFilterValue} />
                    </Item>
                </Header>

                <Content contentContainerStyle={{ flex: 1 }}>
                    {
                        renderIf(this.state.loading)(
                            dataLoading(true)
                        )
                    }

                    {
                        renderIf(!this.state.loading)(
                            <FlatList
                                data={this.state.data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                ListEmptyComponent={emptyDataPage()}
                                ListFooterComponent={
                                    this.state.loadingMore ?
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

                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onHandleRefresh}
                                        colors={[Colors.BLUE_PANTONE_640C]}
                                        tintColor={[Colors.BLUE_PANTONE_640C]}
                                        title='Kéo để làm mới'
                                        titleColor={Colors.RED}
                                    />
                                }
                            />
                        )
                    }
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(ListIsPublished);