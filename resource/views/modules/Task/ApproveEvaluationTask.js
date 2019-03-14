/*
    @description: duyệt đánh giá công việc
    @author: duynn
    @since: 17/05/2018
*/
'use strict'
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
    Container, Header, Left, Body, Right, Button, Toast, Item,
    Icon, Content, Form, Picker, Text, Title, Label, Textarea
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {
    Icon as RneIcon
} from 'react-native-elements';
import * as util from 'lodash';

//utilities
import { API_URL, EMPTY_STRING, HEADER_COLOR, Colors } from '../../../common/SystemConstant';
import { executeLoading, } from '../../../common/Effect';
import { asyncDelay, backHandlerConfig, appGetDataAndNavigate } from '../../../common/Utilities';
import { scale, verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

class ApproveEvaluationTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: this.props.userInfo.ID,

            arrValue: [0, 1, 2, 3, 4, 5],
            taskId: this.props.coreNavParams.taskId,
            taskType: this.props.coreNavParams.taskType,
            comment: EMPTY_STRING,

            PhieuDanhGia: this.props.extendsNavParams.PhieuDanhGia,
            executing: false,

            TUCHU_CAO: 0,
            TRACHNHIEM_LON: 0,
            TUONGTAC_TOT: 0,
            TOCDO_NHANH: 0,
            TIENBO_NHIEU: 0,
            THANHTICH_VUOT: 0
        }
    }

    componentWillMount() {
        const phieuDanhGia = this.state.PhieuDanhGia;

        this.setState({
            TUCHU_CAO: phieuDanhGia.TDG_TUCHUCAO != null ? phieuDanhGia.TDG_TUCHUCAO.toString() : '0',
            TRACHNHIEM_LON: phieuDanhGia.TDG_TRACHNHIEMLON != null ? phieuDanhGia.TDG_TRACHNHIEMLON.toString() : '0',
            TUONGTAC_TOT: phieuDanhGia.TDG_TUONGTACTOT != null ? phieuDanhGia.TDG_TUONGTACTOT.toString() : '0',
            TOCDO_NHANH: phieuDanhGia.TDG_TOCDONHANH != null ? phieuDanhGia.TDG_TOCDONHANH.toString() : '0',
            TIENBO_NHIEU: phieuDanhGia.TDG_TIENBONHIEU != null ? phieuDanhGia.TDG_TIENBONHIEU.toString() : '0',
            THANHTICH_VUOT: phieuDanhGia.TDG_THANHTICHVUOT != null ? phieuDanhGia.TDG_THANHTICHVUOT.toString() : '0'
        });
    }

    onValueChange(value, type) {
        switch (type) {
            case 'TUCHU_CAO':
                this.setState({
                    TUCHU_CAO: value
                })
                break;

            case 'TRACHNHIEM_LON':
                this.setState({
                    TRACHNHIEM_LON: value
                })
                break;

            case 'TUONGTAC_TOT':
                this.setState({
                    TUONGTAC_TOT: value
                })
                break;

            case 'TOCDO_NHANH':
                this.setState({
                    TOCDO_NHANH: value
                })
                break;

            case 'TIENBO_NHIEU':
                this.setState({
                    TIENBO_NHIEU: value
                })
                break;

            default:
                this.setState({
                    THANHTICH_VUOT: value
                })
                break;
        }
    }

    onApproveEvaluateTask = async () => {
        this.setState({
            executing: true
        })
        const url = `${API_URL}/api/HscvCongViec/ApproveEvaluationTask`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        });

        const body = JSON.stringify({
            userId: this.state.userId,
            taskId: this.state.taskId,
            comment: this.state.comment,
            TDG_TUCHUCAO: this.state.TUCHU_CAO == EMPTY_STRING ? 0 : this.state.TUCHU_CAO,
            TDG_TRACHNHIEMLON: this.state.TRACHNHIEM_LON == EMPTY_STRING ? 0 : this.state.TRACHNHIEM_LON,
            TDG_TUONGTACTOT: this.state.TUONGTAC_TOT == EMPTY_STRING ? 0 : this.state.TUONGTAC_TOT,
            TDG_TOCDONHANH: this.state.TOCDO_NHANH == EMPTY_STRING ? 0 : this.state.TOCDO_NHANH,
            TDG_TIENBONHIEU: this.state.TIENBO_NHIEU == EMPTY_STRING ? 0 : this.state.TIENBO_NHIEU,
            TDG_THANHTICHVUOT: this.state.THANHTICH_VUOT == EMPTY_STRING ? 0 : this.state.THANHTICH_VUOT
        });

        const result = await fetch(url, {
            method: 'POST',
            headers,
            body
        });

        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            executing: false
        });

        if (resultJson.Status == true && !util.isNull(resultJson.GroupTokens) && !util.isEmpty(resultJson.GroupTokens)) {
            const message = this.props.userInfo.Fullname + ' đã phê duyệt bản đánh giá công việc';
            const content = {
                title: 'PHÊ DUYỆT ĐÁNH GIÁ CÔNG VIỆC',
                message,
                isTaskNotification: true,
                targetScreen: 'DetailTaskScreen',
                targetTaskId: this.state.taskId,
                targetTaskType: this.state.taskType
            }

            resultJson.GroupTokens.forEach(token => {
                pushFirebaseNotify(content, token, 'notification');
            })
            this.props.updateExtendsNavParams({check: true});
        }

        Toast.show({
            text: resultJson.Status ? 'Phê duyệt đánh giá công việc thành công' : 'Phê duyệt đánh giá công việc không thành công',
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (resultJson.Status) {
                    this.navigateBackToDetail();
                }
            }
        });
    }

    componentDidMount = () => {
        // backHandlerConfig(true, this.navigateBackToDetail);
    }

    componentWillUnmount = () => {
        // backHandlerConfig(false, this.navigateBackToDetail);
    }

    navigateBackToDetail = () => {
       this.props.navigation.goBack();
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
                            PHÊ DUYỆT ĐÁNH GIÁ CÔNG VIỆC
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right} />
                </Header>

                <Content>
                    <Form>
                        <Label style={styles.label}>Bảng điểm đánh giá:</Label>
                        <Grid>
                            <Row>
                                <Col style={[styles.columnHeader, styles.wideColumn]}>
                                    <Text style={styles.columnHeaderText}>
                                        Hạng mục
                                    </Text>
                                </Col>

                                <Col style={[styles.columnHeader, styles.wideColumn]}>
                                    <Text style={styles.columnHeaderText}>
                                        Đ.tự đánh giá
                                    </Text>
                                </Col>


                                <Col style={[styles.columnHeader, styles.wideColumn]}>
                                    <Text style={styles.columnHeaderText}>
                                        Đ.duyệt
                                    </Text>
                                </Col>

                                <Col style={styles.columnHeader}>
                                    <Text style={styles.columnHeaderText}>
                                        Trọng số
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Tự chủ cao
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_TUCHUCAO}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.TUCHU_CAO || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'TUCHU_CAO')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        2
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Trách nhiệm lớn
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_TRACHNHIEMLON}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.TRACHNHIEM_LON || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'TRACHNHIEM_LON')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        2
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Tương tác tốt
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_TUONGTACTOT}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.TUONGTAC_TOT || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'TUONGTAC_TOT')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        1
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Tốc độ nhanh
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_TOCDONHANH}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.TOCDO_NHANH || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'TOCDO_NHANH')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        1
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Tiến bộ nhiều
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_TIENBONHIEU}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.TIENBO_NHIEU || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'TIENBO_NHIEU')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        1
                                    </Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col style={[styles.column]}>
                                    <Text >
                                        Thành tích vượt
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        {this.state.PhieuDanhGia.TDG_THANHTICHVUOT}
                                    </Text>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Picker
                                        iosHeader='Chọn điểm tự chủ cao'
                                        iosIcon={<Icon name='ios-arrow-down-outline' />}
                                        style={{ width: '100%' }}
                                        selectedValue={(this.state.THANHTICH_VUOT || 0)}
                                        onValueChange={(value) => this.onValueChange(value, 'THANHTICH_VUOT')}
                                        mode='dropdown'>
                                        {
                                            this.state.arrValue.map((item, index) => (
                                                <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                            ))
                                        }
                                    </Picker>
                                </Col>

                                <Col style={[styles.column]}>
                                    <Text >
                                        1
                                    </Text>
                                </Col>
                            </Row>
                        </Grid>

                        <Label style={styles.label}>Nhận xét:</Label>
                        <Textarea rowSpan={5} bordered placeholder="Nội dung nhận xét"
                            value={this.state.comment}
                            onChangeText={(comment) => this.setState({ comment })} />

                        <Button block danger
                            style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                            onPress={() => this.onApproveEvaluateTask()}>
                            <Text>
                                PHÊ DUYỆT ĐÁNH GIÁ CÔNG VIỆC
                            </Text>
                        </Button>
                    </Form>
                </Content>
                {
                    executeLoading(this.state.executing)
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    columnHeader: {
        backgroundColor: '#f1f1f2',
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRightColor: '#fff',
        borderRightWidth: 1,
        paddingLeft: scale(10),
    },
    column: {
        backgroundColor: '#fff',
        height: verticalScale(60),
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: scale(10),
        borderRightColor: '#f1f1f2',
        borderRightWidth: 1,
        borderBottomColor: '#f1f1f2',
        borderBottomWidth: 1
    },
    wideColumn: {

    },
    columnHeaderText: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    },
    label: {
        marginLeft: scale(10),
        marginVertical: verticalScale(10),
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline'
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

export default connect(mapStateToProps, mapDispatchToProps)(ApproveEvaluationTask)