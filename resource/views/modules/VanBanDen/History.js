/**
 * @description: lịch sử xử lý văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';

import { View, Text, RefreshControl } from 'react-native';

//lib
import { Container, Header, Content, Icon } from 'native-base';
import TimeLine from 'react-native-timeline-theme';
import * as util from 'lodash';
import renderIf from 'render-if';

//utilities
import { convertDateTimeToString, emptyDataPage, convertTimeToString, convertDateToString } from '../../../common/Utilities';
import { LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { verticalScale, moderateScale, scale } from '../../../assets/styles/ScaleIndicator';

export default class TimelinePublishDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstLog: props.info.lstLog,
            data: [],

            refreshingData: false,

            initState: props.info.WorkFlow.StartState,
        }
    }

    handleRefresh = () => {

    }

    componentWillMount = () => {
        // console.tron.log(this.props.info.WorkFlow)
        const { initState } = this.state;
        let data = [];
        // console.tron.log(initState)
        data.push(
            {
                time: convertDateTimeToString(initState.create_at),
                title: initState.STATE_NAME,
                titleStyle: { color: 'rgba(0,0,0,95)', fontWeight: 'bold' },
                description: `Người xử lý: ${initState.TenNguoiXuLy}`,
                renderIcon: () => <Icon name='ios-time-outline' />,
                renderTimeBottom: () => (
                    <View style={{ alignItems: 'flex-start', backgroundColor: Colors.WHITE, borderRadius: 6, padding: 3 }}>
                        <Text>
                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                Thời gian:
                                    </Text>

                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                {' ' + convertTimeToString(initState.create_at)}
                            </Text>
                        </Text>

                        <Text>
                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                Người nhận:
                                    </Text>
                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                {' ' + initState.TenNguoiNhan}
                            </Text>
                        </Text>

                        <Text>
                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                Người tham gia:
                                    </Text>
                            <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                {' ' + (initState.LstThamGia || []).toString()}
                            </Text>
                        </Text>
                    </View>
                ),
            }
        )
        //console.tron.log(this.state.lstLog)
        if (!util.isNull(this.state.lstLog) && !util.isEmpty(this.state.lstLog)) {
            this.state.lstLog.forEach((item, index) => {
                data.push(
                    {
                        time: convertDateToString(item.create_at),
                        title: item.IS_RETURN ? 'Trả về' : 'Bước xử lý: ' + (item.step ? item.step.NAME : 'N/A'),
                        titleStyle: { color: 'rgba(0,0,0,95)', fontWeight: 'bold' },
                        description: `Người xử lý: ${item.TenNguoiXuLy}`,
                        renderIcon: () => <Icon name='ios-time-outline' />,
                        renderTimeBottom: () => (
                            <View style={{ alignItems: (index % 2 == 0) ? 'flex-end' : 'flex-start', backgroundColor: Colors.WHITE, borderRadius: 6, padding: 3 }}>
                                <Text>
                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                        Thời gian:
                                    </Text>

                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                        {' ' + convertTimeToString(item.create_at)}
                                    </Text>
                                </Text>

                                <Text>
                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                        Người nhận:
                                    </Text>
                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                        {' ' + item.TenNguoiNhan}
                                    </Text>
                                </Text>

                                <Text>
                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold' }}>
                                        Người tham gia:
                                    </Text>
                                    <Text style={{ fontSize: verticalScale(11), fontWeight: 'bold', color: '#b40000' }}>
                                        {' ' + (item.LstThamGia || []).toString()}
                                    </Text>
                                </Text>
                            </View>
                        ),
                    },
                );
            });

            this.setState({
                data
            }, () => console.log(">>>this is data: " + data));
        }

        this.setState({
            data
        }, () => console.log(">>>this is data: " + data));
    }

    render() {
        // console.tron.log(this.props.info)
        // console.tron.log(this.state.initState)
        // console.tron.log(this.state.data)
        return (
            <Container>
                <Content>
                    {
                        renderIf(util.isNull(this.state.data) || util.isEmpty(this.state.data))(
                            emptyDataPage()
                        )
                    }

                    {
                        renderIf(!util.isNull(this.state.data) && !util.isEmpty(this.state.data))(
                            <TimeLine
                                timeStyle={{
                                    fontWeight: 'normal',
                                    color: Colors.BLACK
                                }}
                                detailContainerStyle={{
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    padding: moderateScale(5),
                                    marginHorizontal: scale(5),
                                    borderColor: '#909090'
                                }}
                                lineWidth={1}
                                dashLine={true}
                                styleContainer={{ marginTop: verticalScale(10) }}
                                data={this.state.data}
                                isRenderSeperator
                                columnFormat={'single-column-left'}
                                timeContainerStyle={{minWidth: 72}}
                            />
                        )
                    }
                </Content>
            </Container>
        );
    }
}