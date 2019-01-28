/*
	@description: lịch sử đánh giá tiến độ công việc
	@author: duynn
	@since: 19/05/2018
*/
'use strict'
import React, { Component } from 'react';

import {
    ActivityIndicator, FlatList, StyleSheet, View as RnView, Text as RnText,
    RefreshControl, Dimensions, Platform
} from 'react-native';
//redux
import { connect } from 'react-redux';

//lib
import {
    Container, Header, Left, Content,
    Body, Title, Button, Text, SwipeRow,
    Right, Form, Item, Label,
} from 'native-base';
import {
    Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

//utilities
import {
    API_URL, LOADER_COLOR, HEADER_COLOR, EMPTY_STRING,
    DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors
} from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';
import {
    emptyDataPage, formatLongText, convertDateToString, convertDateTimeToString,
    backHandlerConfig, appGetDataAndNavigate
} from '../../../common/Utilities';
import { scale, verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

class HistoryEvaluateTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.userInfo.ID,
            taskId: this.props.navigation.state.params.taskId,
            taskType: this.props.navigation.state.params.taskType,

            filterValue: EMPTY_STRING,
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
            data: [],
            dataItem: {},
            loading: false,
            loadingMore: false,
            refreshing: false
        }
    }


    componentWillMount = () => {
        this.setState({
            loading: true
        }, () => this.fetchData())
    }


    loadMore = () => {
        this.setState({
            loadingMore: true,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            this.fetchData();
        });
    }

    fetchData = async () => {
        const url = `${API_URL}/api/HscvCongViec/GetListSubmit/${this.state.taskId}/${this.state.pageIndex}/${this.state.pageSize}?query=${this.state.filterValue}`
        const result = await fetch(url);
        const resultJson = await result.json();

        this.setState({
            data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
            loading: false,
            loadingMore: false,
            refreshing: false,
        });
    }

    onShowEvaluateInfo = (item) => {
        this.setState({
            dataItem: item
        }, () => {
            this.popupDialog.show();
        })
    }


    renderItem = ({ item }) => {
        const statusResponsive = (deviceWidth < 340) ? 'Trạng thái: ' : ' - Trạng thái: ';
        return (
            <SwipeRow
                leftOpenValue={75}
                rightOpenValue={-75}
                disableLeftSwipe={true}
                left={
                    <Button style={{ backgroundColor: '#d1d2d3' }} onPress={() => this.onShowEvaluateInfo(item)}>
                        <RneIcon name='info' type='foundation' size={verticalScale(30)} color={Colors.WHITE} />
                    </Button>
                }
                body={
                    <RnView style={styles.rowContainer}>
                        <RnText style={styles.rowLabel}>
                            <RnText>
                                {'Thời gian: '}
                            </RnText>

                            <RnText style={styles.rowInfo}>
                                {
                                    convertDateTimeToString(item.NGAYPHANHOI)
                                }
                            </RnText>
                        </RnText>

                        <RnText style={styles.rowLabel}>
                            <RnText>
                                {statusResponsive}
                            </RnText>

                            <RnText style={(item.PHEDUYETKETQUA == true) ? styles.approveText : styles.denyText}>
                                {item.PHEDUYETKETQUA == true ? ' (Đã phê duyệt)' : ' (Đã trả lại)'}
                            </RnText>
                        </RnText>

                    </RnView>

                }
            />
        );
    }

    componentDidMount = () => {
        backHandlerConfig(true, this.navigateBackToDetail);
    }

    componentWillUnmount = () => {
        backHandlerConfig(false, this.navigateBackToDetail);
    }

    navigateBackToDetail = () => {
        appGetDataAndNavigate(this.props.navigation, 'HistoryEvaluateTaskScreen');
        return true;
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: DEFAULT_PAGE_INDEX,
        }, () => {
            this.fetchData()
        })
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={() => this.navigateBackToDetail()}>
                            <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>
                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            LỊCH SỬ PHÊ DUYỆT TIẾN ĐỘ
						</Title>
                    </Body>
                    <Right style={NativeBaseStyle.right} />
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
                                ListEmptyComponent={() => emptyDataPage()}
                                ListFooterComponent={() =>
                                    this.state.loadingMore ?
                                        <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                                        :
                                        (
                                            this.state.data.length >= DEFAULT_PAGE_SIZE ?
                                                <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadMore()}>
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
                                        onRefresh={this.handleRefresh}
                                        title='Kéo để làm mới'
                                        colors={[Colors.BLUE_PANTONE_640C]}
                                        tintColor={[Colors.BLUE_PANTONE_640C]}
                                        titleColor='red'
                                    />
                                }
                            />
                        )
                    }


                    <PopupDialog
                        dialogTitle={<DialogTitle title='THÔNG TIN CẬP NHẬT TIẾN ĐỘ'
                            titleStyle={{
                                ...Platform.select({
                                    android: {
                                        height: verticalScale(50),
                                        justifyContent: 'center',
                                    }
                                })
                            }} />}
                        ref={(popupDialog) => { this.popupDialog = popupDialog }}
                        width={0.8}
                        height={'auto'}
                        actions={[
                            <DialogButton
                                align={'center'}
                                buttonStyle={{
                                    backgroundColor: Colors.GREEN_PANTON_369C,
                                    alignSelf: 'stretch',
                                    alignItems: 'center',
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8,
                                    ...Platform.select({
                                        ios: {
                                            justifyContent: 'flex-end',
                                        },
                                        android: {
                                            height: verticalScale(50),
                                            justifyContent: 'center',
                                        },
                                    })
                                }}
                                text="ĐÓNG"
                                textStyle={{
                                    fontSize: moderateScale(14, 1.5),
                                    color: '#fff',
                                    textAlign: 'center'
                                }}
                                onPress={() => {
                                    this.popupDialog.dismiss();
                                }}
                                key="button-0"
                            />,
                        ]}>
                        <Form>
                            <Item stackedLabel>
                                <Label style={styles.dialogLabel}>
                                    Ngày trình duyệt kết quả công việc
							</Label>

                                <Label style={styles.dialogText}>
                                    {convertDateTimeToString(this.state.dataItem.CREATED_AT)}
                                </Label>
                            </Item>

                            <Item stackedLabel>
                                <Label style={styles.dialogLabel}>
                                    Ngày có phản hồi của cấp trên
							</Label>

                                <Label style={styles.dialogText}>
                                    {convertDateTimeToString(this.state.dataItem.NGAYPHANHOI)}
                                </Label>
                            </Item>

                            <Item stackedLabel>
                                <Label style={styles.dialogLabel}>
                                    Số ngày chờ phản hồi:
							</Label>

                                <Label style={styles.dialogText}>
                                    {this.state.dataItem.SONGAYCHOPHANHOI}
                                </Label>
                            </Item>

                            <Item stackedLabel>
                                <Label style={styles.dialogLabel}>
                                    Nội dung phản hồi
							</Label>

                                <Label style={styles.dialogText}>
                                    {(this.state.dataItem.KETQUATRINHDUYET)}
                                </Label>
                            </Item>
                        </Form>
                    </PopupDialog>
                </Content>
            </Container>
        );
    }
}

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        paddingLeft: scale(10),
        flexDirection: (deviceWidth >= 340) ? 'row' : 'column',
        alignItems: (deviceWidth >= 340) ? 'center' : 'flex-start',
    },
    rowLabel: {
        color: '#000',
    },
    rowInfo: {
        color: '#000',
        // fontSize: verticalScale(25),
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    dialogLabel: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: moderateScale(14, 1.4)
    },
    approveText: {
        color: '#337321',
        fontWeight: 'bold'
    }, denyText: {
        color: '#FF0033',
        fontWeight: 'bold'
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(HistoryEvaluateTask);