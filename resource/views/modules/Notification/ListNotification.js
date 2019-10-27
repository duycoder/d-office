import React, { Component } from 'react'
import {
    View, Text as RNText, ActivityIndicator, StyleSheet,
    TouchableOpacity, FlatList, RefreshControl, AsyncStorage, StatusBar
} from 'react-native'

//constant
import {
    API_URL,
    EMPTY_STRING, THONGBAO_CONSTANT,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors
} from '../../../common/SystemConstant';
import { appNavigate, convertDateTimeToTitle, emptyDataPage, appStoreDataAndNavigate, convertDateToString } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//lib
import { ListItem, Icon as RNEIcon } from 'react-native-elements';
import {
    Container, Header, Title, Content,
    Left, Body, Right, Text, Button, Toast, Fab, Icon
} from 'native-base';
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';

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
            const url = `${API_URL}/api/account/UpdateReadStateOfMessage`;
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
            const body = JSON.stringify({
                item
            });
            const result = await fetch(url, {
                method: 'POST',
                headers,
                body
            });

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
                default:
                    outOfSwitch = true;
                    break;
            }
        }
        else {
            outOfSwitch = true;
        }

        if (outOfSwitch) {
            Toast.show({
                text: 'Bạn không có quyền truy cập vào thông tin này!',
                type: 'danger',
                buttonText: "OK",
                buttonStyle: { backgroundColor: Colors.WHITE },
                buttonTextStyle: { color: Colors.LITE_BLUE },
            });
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
            // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
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
        const url = `${API_URL}/api/Account/GetUyQuyenMessages/`;
        const resource = await fetch(url);
        const result = await resource.json();

        this.setState({
            loading: false,
            dataUyQuyen: result
        })
    }

    fetchData = async () => {
        const url = `${API_URL}/api/Account/GetMessagesOfUser/${this.state.userInfo.ID}/${this.state.pageSize}/${this.state.pageIndex}/true?query=`;
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
        let itemType = item.URL.split('/')[2],
            badgeBackgroundColor = Colors.GRAY,
            leftTitle = "CV";
        switch (itemType) {
            case "HSVanBanDi":
                badgeBackgroundColor = '#4FC3F7';
                leftTitle = "VBTK"
                break;
            case "QuanLyCongViec":
                badgeBackgroundColor = '#4DB6AC';
                leftTitle = "CV";
                break;
            case "HSCV_VANBANDEN":
                badgeBackgroundColor = '#5C6BC0';
                leftTitle = "VBĐ";
                break;
            case "QL_LICHHOP":
                badgeBackgroundColor = Colors.RANDOM_COLOR_1;
                leftTitle = "LH";
                break;
            case "QL_DANGKY_XE":
                badgeBackgroundColor = Colors.RANDOM_COLOR_2;
                leftTitle = "DKX";
                break;
            case "QL_CHUYEN":
                badgeBackgroundColor = Colors.DANK_BLUE;
                leftTitle = "CX";
                break;
        }

        let noidungArchor = item.NOIDUNG.indexOf("đã"),
            noidungSender = item.NOIDUNG.slice(0, noidungArchor - 1),
            noidungMessage = item.NOIDUNG.slice(noidungArchor);

        let checkReadFont = item.IS_READ ? 'normal' : 'bold',
            checkReadColor = item.IS_READ ? Colors.HAS_DONE : Colors.NOT_READ;

        return (
            <ListItem
                leftIcon={
                    <View style={[styles.leftTitleCircle, { backgroundColor: badgeBackgroundColor }]}>
                        <RNText style={styles.leftTitleText}>
                            {
                                leftTitle
                            }
                        </RNText>
                    </View>
                }
                hideChevron={true}
                title={
                    <RNText style={[styles.title, { fontWeight: checkReadFont, color: checkReadColor }]}>
                        <RNText style={{ fontWeight: 'bold', color: Colors.BLACK }}>{noidungSender}</RNText> {noidungMessage}
                    </RNText>
                }
                titleStyle={styles.title}
                titleContainerStyle={{
                    marginHorizontal: '3%',
                }}
                titleNumberOfLines={3}
                rightTitle={convertDateTimeToTitle(item.NGAYTAO, true)}
                rightTitleNumberOfLines={2}
                rightTitleStyle={{
                    textAlign: 'center',
                    color: Colors.DARK_GRAY,
                    fontSize: moderateScale(12, 0.9),
                    fontStyle: 'italic',
                    fontWeight: checkReadFont,
                }}
                rightTitleContainerStyle={{
                    flex: 0
                }}
                onPress={() => this.onPressNotificationItem(item)}
            />
        );
    }

    createNotiUyQuyen = () => {
        this.props.navigation.navigate("CreateNotiUyQuyenScreen");
    }

    render() {
        return (
            <Container>
                <StatusBar barStyle="light-content" />
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={{ flex: 1 }} />
                    <Body style={{ alignItems: 'center', flex: 8 }}>
                        <Title style={{ color: Colors.WHITE }}>
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
                                this.state.dataUyQuyen.map((item, index) => {
                                    return (
                                        <ListItem
                                            key={index.toString()}
                                            containerStyle={{ backgroundColor: "#EBDEF0", borderBottomColor: "#ccc" }}
                                            leftIcon={
                                                <RNEIcon name="transition-masked" type="material-community" color={"#8E44AD"} size={moderateScale(45)} />
                                            }
                                            hideChevron={true}
                                            title={
                                                <RNText style={[ListNotificationStyle.title, { fontWeight: "bold" }]}>
                                                    <RNText style={{ fontWeight: 'bold', color: Colors.BLACK }}>{`${item.TEN_NGUOIGUI} ${item.TIEUDE}`}</RNText>
                                                </RNText>
                                            }
                                            titleStyle={ListNotificationStyle.title}
                                            titleContainerStyle={{
                                                marginHorizontal: '3%',
                                            }}
                                            subtitle={
                                                <RNText style={{ color: Colors.BLACK }}>{`${item.NOIDUNG}, hạn tới ${convertDateToString(item.SHOW_UNTIL)}`}</RNText>
                                            }
                                            subtitleContainerStyle={{
                                                marginHorizontal: '3%'
                                            }}
                                            titleNumberOfLines={3}
                                        />
                                    );
                                })
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
                {
                    !!this.state.userInfo.CanUyQuyen && <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: Colors.MENU_BLUE }}
                        position="bottomRight"
                        onPress={() => this.createNotiUyQuyen()}>
                        <Icon name="add" />
                    </Fab>
                }
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
        marginRight: 10,
    },
    leftTitleText: {
        fontWeight: 'bold',
        color: Colors.WHITE
    },
    title: {
        color: Colors.BLACK,
        fontSize: moderateScale(12, 1.2)
    }
});

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