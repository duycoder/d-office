/**
 * @description: màn hình danh sách công việc con
 * @author: duynn
 * @since: 01/06/2018
 */

import React, { Component } from 'react';
import {
    ActivityIndicator, StyleSheet, RefreshControl,
    View, Text as RnText, FlatList, Platform,
    TouchableOpacity
} from 'react-native';

//redux
import { connect } from 'react-redux';

//lib
import {
    Container, Header, Item, Input, Icon, Title, Form,
    Content, Button, SwipeRow, Left, Body, Toast, Label, Right
} from 'native-base';
import { Icon as RneIcon } from 'react-native-elements';
import renderIf from 'render-if';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

//utilities
import {
    emptyDataPage, convertDateToString, asyncDelay
} from '../../../common/Utilities'
import { executeLoading } from '../../../common/Effect'
import {
    API_URL, DEFAULT_PAGE_INDEX,
    EMPTY_STRING, DEFAULT_PAGE_SIZE, Colors, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';

//styles
import { scale, verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

import AlertMessage from "../../common/AlertMessage";
import { AlertMessageStyle } from "../../../assets/styles/index";

import * as navAction from '../../../redux/modules/Nav/Action';
import { MoreButton, GoBackButton } from '../../common';
import { taskApi } from '../../../common/Api';

class GroupSubTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,
            taskId: props.coreNavParams.taskId,
            taskType: props.coreNavParams.taskType,
            data: [],
            dataItem: {},
            filterValue: EMPTY_STRING,
            pageIndex: DEFAULT_PAGE_INDEX,
            loadingMore: false,
            refreshing: false,
            searching: false,
            executing: false,

            canFinishTask: props.extendsNavParams.canFinishTask,
            canAssignTask: props.extendsNavParams.canAssignTask,

            editSubTaskType: 0,
            alertIdHolder: 0,
            check: false,
        }
    }

    componentWillMount() {
        this.searchData();
    }

    searchData = () => {
        this.setState({
            searching: true,
            pageIndex: DEFAULT_PAGE_INDEX
        }, () => this.fetchData())
    }

    loadMoreData = () => {
        this.setState({
            loadingMore: true,
            pageIndex: this.state.pageIndex + 1
        }, () => this.fetchData())
    }

    fetchData = async () => {
        const { taskId, pageIndex, filterValue } = this.state;
        const resultJson = await taskApi().getSubTask([
            taskId,
            `${pageIndex}?query=${filterValue}`
        ]);

        this.setState({
            data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
            loadingMore: false,
            searching: false,
            refreshing: false
        })
    }

    onShowSubTaskInfo = (item) => {
        this.setState({
            dataItem: item
        }, () => {
            this.popupDialog.show();
        });
    }

    onEditSubTask = (item) => {
        let canAssign = this.state.canAssignTask && item.DAGIAOVIEC != true;
        let canFinish = this.state.canFinishTask && item.DAGIAOVIEC != true;

        if (canAssign && canFinish) {
            this.setState({
                editSubTaskType: 1,
                alertIdHolder: item.ID
            }, () => {
                this.refs.confirm_1.showModal();
            });
        }
        else if (canAssign && !canFinish) {
            this.setState({
                editSubTaskType: 2,
                alertIdHolder: item.ID
            }, () => {
                this.refs.confirm_2.showModal();
            });
        } else {
            this.setState({
                editSubTaskType: 3,
                alertIdHolder: item.ID
            }, () => {
                this.refs.confirm_3.showModal();
            });
        }
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: DEFAULT_PAGE_INDEX,
        }, () => {
            this.fetchData()
        })
    }

    onNavigateToAssignTask(id) {
        switch (this.state.editSubTaskType) {
            case 1:
                this.refs.confirm_1.closeModal();
                break;
            case 3:
                this.refs.confirm_3.closeModal();
                break;
        }
        const targetScreenParam = {
            taskId: this.state.taskId,
            taskType: this.state.taskType,
            subTaskId: id
        }
        this.props.updateExtendsNavParams(targetScreenParam);
        this.props.navigation.navigate('AssignTaskScreen');
    }

    onConfirmCompleteTask(id) {
        switch (this.state.editSubTaskType) {
            case 1:
                this.refs.confirm_1.closeModal();
                break;
            case 2:
                this.refs.confirm_2.closeModal();
                break;
            case 3:
                this.refs.confirm_3.closeModal();
                break;
        }
        this.setState({
            editSubTaskType: 4,
            alertIdHolder: id
        }, () => {
            this.refs.confirm_4.showModal();
        });
    }

    onCompleteSubTask = async (id) => {
        this.refs.confirm_4.closeModal();
        this.setState({
            executing: true
        });

        const url = `${API_URL}/api/HscvCongViec/CompleteSubTask?id=${id}`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        });

        const result = await fetch(url, {
            method: 'post',
            headers
        });

        const resultJson = await result.json();

        await asyncDelay();

        this.setState({
            executing: false
        });

        Toast.show({
            text: 'Hoàn thành công việc ' + (resultJson.Status ? ' thành công' : ' không thành công'),
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: TOAST_DURATION_TIMEOUT,
            onClose: () => {
                if (resultJson.Status) {
                    this.searchData();
                }
            }
        });

    }

    renderItem = ({ item }) => {
        let canAssign = this.state.canAssignTask && item.DAGIAOVIEC != true;
        let canFinish = this.state.canFinishTask && item.DAGIAOVIEC != true;

        return (
            <SwipeRow
                leftOpenValue={75}
                rightOpenValue={-75}
                disableLeftSwipe={(!canAssign && !canFinish) || item.TRANGTHAI_ID > 0}
                left={
                    <Button style={{ backgroundColor: '#d1d2d3' }} onPress={() => this.onShowSubTaskInfo(item)}>
                        <RneIcon name='info' type='foundation' size={moderateScale(27, 0.79)} color={Colors.WHITE} />
                    </Button>
                }

                body={
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: "85%", paddingLeft: 10 }}>
                            <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2) }]}>
                                {item.NOIDUNG}
                            </RnText>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <View style={{ width: "45%" }}>
                                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                                        Hạn xử lý:
                                    </RnText>
                                </View>
                                <View style={{ width: "55%" }}>
                                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                        {' ' + convertDateToString(item.HANHOANTHANH)}
                                    </RnText>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: "45%" }}>
                                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                                        Người thực hiện:
                                    </RnText>
                                </View>
                                <View style={{ width: "55%" }}>
                                    {
                                        item.NGUOITHUCHIEN
                                            ? <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                                {' ' + item.NGUOITHUCHIEN}
                                            </RnText>
                                            : item.TRANGTHAI_ID > 0
                                                ? <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                                                    {' Tự thực hiện'}
                                                </RnText>
                                                : <RnText style={{ fontSize: moderateScale(12, 1.1), color: Colors.RED_PANTONE_186C }}>
                                                    {' Chưa giao việc'}
                                                </RnText>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{ width: "15%", justifyContent: 'center', alignItems: 'center' }}>
                            <RneIcon name={item.TRANGTHAI_ID > 0 ? "check" : "close"} size={26} color={item.TRANGTHAI_ID > 0 ? Colors.GREEN_PANTON_369C : Colors.RED_PANTONE_186C} type='material-community' />
                        </View>
                    </View>
                }

                right={
                    <Button style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.onEditSubTask(item)}>
                        <RneIcon name='pencil' type='foundation' size={verticalScale(30)} color={'#fff'} />
                    </Button>
                }
            />

        );
    }

    componentDidMount = () => {
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (this.props.extendsNavParams) {
                if (this.props.extendsNavParams.hasOwnProperty("check")) {
                    if (this.props.extendsNavParams.check === true) {
                        this.setState({ check: true }, () => this.searchData());
                        this.props.updateExtendsNavParams({ check: false });
                    }
                }
            }
        });
    }

    componentWillUnmount = () => {
        this.willFocusListener.remove();
    }

    navigateBackToDetail = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Container>
                <Header searchBar style={NativeBaseStyle.container}>
                    <Left style={NativeBaseStyle.left}>
                        <GoBackButton onPress={() => this.navigateBackToDetail()} />
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            CÔNG VIỆC CON
                        </Title>
                    </Body>
                    <Right style={NativeBaseStyle.right}></Right>
                </Header>

                <Content contentContainerStyle={{ flex: 1 }}>

                    <Item>
                        <Icon name='ios-search' />
                        <Input
                            placeholder={'Tên công việc'}
                            onSubmitEditing={() => this.searchData()}
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })} />
                    </Item>

                    {
                        renderIf(this.state.searching)(
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                            </View>
                        )
                    }

                    {
                        renderIf(!this.state.searching)(
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.data}
                                renderItem={this.renderItem}
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
                                ListEmptyComponent={() => emptyDataPage()}
                                ListFooterComponent={() => (<MoreButton
                                    isLoading={this.state.loadingMore}
                                    isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
                                    loadmoreFunc={this.loadMoreData}
                                />)}
                            />
                        )
                    }
                </Content>

                {
                    executeLoading(this.state.executing)
                }

                <PopupDialog
                    dialogTitle={<DialogTitle title={`THÔNG TIN CÔNG VIỆC #${this.state.dataItem.CONGVIEC_ID}`}
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
                                {'Người thực hiện: '}
                            </Label>

                            <Label style={styles.dialogText}>
                                {this.state.dataItem.NGUOITHUCHIEN}
                            </Label>
                        </Item>

                        <Item stackedLabel>
                            <Label style={styles.dialogLabel}>
                                {'Mức độ quan trọng: '}
                            </Label>

                            <Label style={styles.dialogText}>
                                {this.state.dataItem.DOKHAN_TEXT}
                            </Label>
                        </Item>

                        <Item stackedLabel>
                            <Label style={styles.dialogLabel}>
                                {'Độ ưu tiên: '}
                            </Label>

                            <Label style={styles.dialogText}>
                                {this.state.dataItem.DOUUTIEN_TEXT}
                            </Label>
                        </Item>

                        <Item stackedLabel>
                            <Label style={styles.dialogLabel}>
                                {'Nội dung: '}
                            </Label>

                            <Label style={styles.dialogText}>
                                {'#' + this.state.dataItem.NOIDUNG}
                            </Label>
                        </Item>

                        <Item stackedLabel>
                            <Label style={styles.dialogLabel}>
                                {'Ngày tạo - Ngày hoàn thành: '}
                            </Label>

                            <Label style={styles.dialogText}>
                                {convertDateToString(this.state.dataItem.NGAYTAO) + ' - ' + convertDateToString(this.state.dataItem.NGAYHOANTHANH)}
                            </Label>
                        </Item>
                    </Form>
                </PopupDialog>

                <AlertMessage
                    ref="confirm_1"
                    title="XỬ LÝ CÔNG VIỆC CON"
                    bodyText={`Xử lý công việc #${this.state.alertIdHolder}`}
                    exitText="THOÁT"
                >
                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onConfirmCompleteTask(this.state.alertIdHolder)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                HOÀN THÀNH
                            </RnText>
                        </TouchableOpacity>
                    </View>

                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onNavigateToAssignTask(this.state.alertIdHolder)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                GIAO VIỆC
                            </RnText>
                        </TouchableOpacity>
                    </View>
                </AlertMessage>

                <AlertMessage
                    ref="confirm_2"
                    title="XỬ LÝ CÔNG VIỆC CON"
                    bodyText={`Xử lý công việc #${this.state.alertIdHolder}`}
                    exitText="THOÁT"
                >
                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onNavigateToAssignTask(this.state.alertIdHolder)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                GIAO VIỆC
                            </RnText>
                        </TouchableOpacity>
                    </View>
                </AlertMessage>

                <AlertMessage
                    ref="confirm_3"
                    title="XỬ LÝ CÔNG VIỆC CON"
                    bodyText={`Xử lý công việc #${this.state.alertIdHolder}`}
                    exitText="THOÁT"
                >
                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onConfirmCompleteTask(this.state.alertIdHolder)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                HOÀN THÀNH
                            </RnText>
                        </TouchableOpacity>
                    </View>
                </AlertMessage>

                <AlertMessage
                    ref="confirm_4"
                    title="XÁC NHẬN HOÀN THÀNH"
                    bodyText="Bạn có chắc chắn đã hoàn thành công việc này?"
                    exitText="HUỶ BỎ"
                >
                    <View style={AlertMessageStyle.leftFooter}>
                        <TouchableOpacity onPress={() => this.onCompleteSubTask(this.state.alertIdHolder)} style={AlertMessageStyle.footerButton}>
                            <RnText style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                                ĐỒNG Ý
                            </RnText>
                        </TouchableOpacity>
                    </View>
                </AlertMessage>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    rowItem: {
        paddingLeft: scale(10)
    },
    rowItemLabel: {
        marginHorizontal: scale(10),
        fontWeight: 'bold',
        color: '#000'
    }, complete: {
        fontWeight: 'bold',
        color: '#337321'
    }, inComplete: {
        fontWeight: 'bold',
        color: '#ff0033'
    }, dialogLabel: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: moderateScale(14, 1.4)
    }
})


const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo,
        coreNavParams: state.navState.coreNavParams,
        extendsNavParams: state.navState.extendsNavParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupSubTask);