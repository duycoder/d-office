import React, { Component } from 'react'
import {
    View, Text as RNText, ActivityIndicator, StyleSheet,
    TouchableOpacity, FlatList, RefreshControl, AsyncStorage
} from 'react-native'

//constant
import {
    API_URL,
    EMPTY_STRING, THONGBAO_CONSTANT,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors
} from '../../../common/SystemConstant';
import { appNavigate, convertDateTimeToTitle, emptyDataPage, appStoreDataAndNavigate } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import { indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

//lib
import { ListItem } from 'react-native-elements';
import {
    Container, Header, Title, Content,
    Left, Body, Right, Text, Button
} from 'native-base';
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
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
            pageSize: DEFAULT_PAGE_SIZE
        }
    }

    onPressNotificationItem = async (item) => {
        let screenName = EMPTY_STRING;
        let screenParam = {};
        // if (item.NOTIFY_ITEM_TYPE == THONGBAO_CONSTANT.CONGVIEC) {
        //     screenName = 'DetailTaskScreen';

        //     screenParam = {
        //         taskId: item.NOTIFY_ITEM_ID,
        //         taskType: item.targetTaskType || 'AssignedWork',
        //     }
        // } else {
        //     screenName = 'DetailSignDocScreen';
        //     screenParam = {
        //         docId: item.NOTIFY_ITEM_ID,
        //         docType: item.targetDocType || 'GetListProcessing',
        //     }
        // }

        let urlArr = item.URL.split("/");
        const itemType = urlArr[2];
        const itemId = +urlArr[3].split("&").shift().match(/\d+/gm);

        if (itemType === "HSVanBanDi") {
            screenName = "VanBanDiDetailScreen";
            screenParam = {
                docId: itemId,
                docType: "1"
            }
        }
        else {
            screenName = "VanBanDenDetailScreen";
            screenParam = {
                docId: itemId,
                docType: "1"
            }
        }

        appStoreDataAndNavigate(this.props.navigation, "ListNotificationScreen", new Object(), screenName, screenParam);
    }

    componentDidMount = async () => {
        const userInfo = this.state.userInfo;
        userInfo.numberUnReadMessage = 0;

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    componentWillMount = () => {
        this.setState({
            loading: true
        }, () => this.fetchData())
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

    fetchData = async () => {
        const url = `${API_URL}/api/Account/GetMessagesOfUser/${this.state.userInfo.ID}/${this.state.pageSize}/${this.state.pageIndex}?query=`;
        const resource = await fetch(url);
        const result = await resource.json();

        this.setState({
            loading: false,
            loadingMore: false,
            refreshing: false,
            data: this.state.loadingMore ? this.state.data.concat(result) : result
        })
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onPressNotificationItem(item)}>
                <ListItem
                    leftIcon={
                        <View style={styles.leftTitleCircle}>
                            <RNText style={styles.leftTitleText}>
                                {item.NOTIFY_ITEM_TYPE == THONGBAO_CONSTANT.CONGVIEC ? "CV" : "VB"}
                            </RNText>
                        </View>
                    }
                    hideChevron={true}
                    title={item.NOIDUNG}
                    titleStyle={styles.title}
                    titleNumberOfLines={3}
                    subtitle={convertDateTimeToTitle(item.NGAYTAO)} />
            </TouchableOpacity>
        );
    }

    render() {
        // console.tron.log(this.state.data)
        return (
            <Container>
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={{ flex: 1 }} />
                    <Body style={{ alignItems: 'center', flex: 8 }}>
                        <Title>
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
                                ListFooterComponent={() => this.state.loadingMore ?
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
                            />
                        )
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    leftTitleCircle: {
        backgroundColor: Colors.GRAY,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    leftTitleText: {
        fontWeight: 'bold',
        color: Colors.WHITE
    },
    title: {
        color: Colors.BLACK
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(ListNotification);