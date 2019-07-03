/*
    @description: đánh giá công việc
    @author: duynn
    @since: 15/05/2018
*/

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
//lib
import {
    Container, Header, Left, Button, Icon,
    Body, Title, Right, Text, Content,
    Form, Item, Label, Picker, Toast
} from 'native-base';
import {
    Icon as RneIcon
} from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import renderIf from 'render-if';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//utilities
import { API_URL, EMPTY_STRING, HEADER_COLOR, Colors } from '../../../common/SystemConstant';
import { asyncDelay, backHandlerConfig, appGetDataAndNavigate,formatMessage, pickerFormat } from '../../../common/Utilities'
import { scale, verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading, dataLoading } from '../../../common/Effect';
import * as util from 'lodash';

//firebase
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';


class EvaluationTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,
            taskId: this.props.coreNavParams.taskId,
            taskType: this.props.coreNavParams.taskType,

            executing: false,
            loading: true,
            arrValue: [0, 1, 2, 3, 4, 5],
            TUCHU_CAO: 0,
            TRACHNHIEM_LON: 0,
            TUONGTAC_TOT: 0,
            TOCDO_NHANH: 0,
            TIENBO_NHIEU: 0,
            THANHTICH_VUOT: 0
        }
    }

    async componentWillMount() {
        this.setState({
            loading: true
        })

        const url = `${API_URL}/api/HscvCongViec/CalculateTaskPoint/${this.state.taskId}`;
        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(1000);

        this.setState({
            loading: false,
            TOCDO_NHANH: resultJson.pointTocDoNhanh.toString()
        });
    }

    onValueChange = (value, type) => {
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


    onEvaluateTask = async () => {
        this.setState({
            executing: true
        })

        const url = `${API_URL}/api/HscvCongViec/SaveEvaluationTask`;

        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const body = JSON.stringify({
            userId: this.state.userId,
            taskId: this.state.taskId,
            TDG_TUCHUCAO: this.state.TUCHU_CAO == EMPTY_STRING ? 0 : this.state.TUCHU_CAO,
            TDG_TRACHNHIEMLON: this.state.TRACHNHIEM_LON == EMPTY_STRING ? 0 : this.state.TRACHNHIEM_LON,
            TDG_TUONGTACTOT: this.state.TUONGTAC_TOT == EMPTY_STRING ? 0 : this.state.TUONGTAC_TOT,
            TDG_TOCDONHANH: this.state.TOCDO_NHANH == EMPTY_STRING ? 0 : this.state.TOCDO_NHANH,
            TDG_TIENBONHIEU: this.state.TIENBO_NHIEU == EMPTY_STRING ? 0 : this.state.TIENBO_NHIEU,
            TDG_THANHTICHVUOT: this.state.THANHTICH_VUOT == EMPTY_STRING ? 0 : this.state.THANHTICH_VUOT
        });

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

        Toast.show({
            text: resultJson.Status ? 'Tự đánh giá công việc thành công' : 'Tự đánh giá công việc không thành công',
            type: resultJson.Status ? 'success' : 'danger',
            buttonText: "OK",
            buttonStyle: { backgroundColor: Colors.WHITE },
            buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.LITE_BLUE },
            duration: 3000,
            onClose: () => {
                if (resultJson.Status) {
                    this.props.updateExtendsNavParams({ check: true });
                    this.navigateBackToDetail(true);
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
                            ĐÁNH GIÁ CÔNG VIỆC
                        </Title>
                    </Body>

                    <Right style={NativeBaseStyle.right} />
                </Header>

                <Content contentContainerStyle={this.state.loading ? { flex: 1 } : { display: 'flex' }}>
                    {
                        renderIf(this.state.loading)(
                            dataLoading(true)
                        )
                    }
                    {
                        renderIf(!this.state.loading)(
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
                                                Điểm số
                                    </Text>
                                        </Col>

                                        <Col style={styles.columnHeader}>
                                            <Text style={styles.columnHeaderText}>
                                                Trọng số
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Tự chủ cao
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.TUCHU_CAO}
                                                onValueChange={(value) => this.onValueChange(value, 'TUCHU_CAO')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'0' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                2
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Trách nhiệm lớn
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.TRACHNHIEM_LON}
                                                onValueChange={(value) => this.onValueChange(value, 'TRACHNHIEM_LON')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'1' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                2
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Tương tác tốt
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.TUONGTAC_TOT}
                                                onValueChange={(value) => this.onValueChange(value, 'TUONGTAC_TOT')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'2' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                1
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Tốc độ nhanh
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                enabled={false}
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.TOCDO_NHANH}
                                                onValueChange={(value) => this.onValueChange(value, 'TOCDO_NHANH')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'3' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                1
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Tiến bộ nhiều
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.TIENBO_NHIEU}
                                                onValueChange={(value) => this.onValueChange(value, 'TIENBO_NHIEU')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'4' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                1
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Text>
                                                Thành tích vượt
                                            </Text>
                                        </Col>

                                        <Col style={[styles.column, styles.wideColumn]}>
                                            <Picker
                                                iosHeader='Chọn điểm tự chủ cao'
                                                iosIcon={<Icon name='ios-arrow-down-outline' />}
                                                style={{ width: pickerFormat() }}
                                                selectedValue={this.state.THANHTICH_VUOT}
                                                onValueChange={(value) => this.onValueChange(value, 'THANHTICH_VUOT')}
                                                mode='dropdown'>
                                                {
                                                    this.state.arrValue.map((item, index) => (
                                                        <Picker.Item key={'5' + index.toString()} label={index.toString()} value={index.toString()} />
                                                    ))
                                                }
                                            </Picker>
                                        </Col>

                                        <Col style={styles.column}>
                                            <Text>
                                                3
                                            </Text>
                                        </Col>
                                    </Row>
                                </Grid>


                                <Button block danger
                                    style={{ backgroundColor: Colors.LITE_BLUE, marginTop: verticalScale(20) }}
                                    onPress={() => this.onEvaluateTask()}>
                                    <Text>
                                        GỬI ĐÁNH GIÁ CÔNG VIỆC
                                    </Text>
                                </Button>
                            </Form>
                        )
                    }

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
    columnHeaderText: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    },
    wideColumn: {
        flex: 2
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

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationTask);

