/**
 * @description: lịch sử xử lý văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';

import { View, Text, RefreshControl, StyleSheet } from 'react-native';

//lib
import { Container, Content, Icon } from 'native-base';
import TimeLine from 'react-native-timeline-theme';
import * as util from 'lodash';
import renderIf from 'render-if';

//utilities
import { convertDateTimeToString, emptyDataPage, convertTimeToString, convertDateToString } from '../../../common/Utilities';
import { LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { verticalScale, moderateScale, scale } from '../../../assets/styles/ScaleIndicator';
import { HistoryStyle } from '../../../assets/styles/HistoryStyle';

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
        let data = [];
        console.tron.log(this.state.lstLog)

        if (!util.isNull(this.state.lstLog) && !util.isEmpty(this.state.lstLog)) {
            this.state.lstLog.forEach((item, index) => {
                if (!util.isNull(item.step)) {
                    data.push(
                        {
                            time: convertDateToString(item.create_at),
                            title: item.IS_RETURN ? 'Trả về' : 'Bước xử lý: ' + (item.step ? item.step.NAME : 'N/A'),
                            titleStyle: { color: 'rgba(0,0,0,95)', fontWeight: 'bold' },
                            description: `Người xử lý: ${item.TenNguoiXuLy}`,
                            renderIcon: () => <Icon name='ios-time-outline' />,
                            renderDetail: () => (
                                <View style={HistoryStyle.container}>
                                    <Text style={HistoryStyle.titleText}>
                                        {item.IS_RETURN ? 'Trả về' : 'Bước xử lý: ' + (item.step ? item.step.NAME : 'N/A')}
                                    </Text>

                                    <Text>
                                        <Text style={HistoryStyle.minorTitleText}>
                                            Thời gian:
                                    </Text>

                                        <Text style={HistoryStyle.normalText}>
                                            {' ' + convertTimeToString(item.create_at)}
                                        </Text>
                                    </Text>

                                    <Text>
                                        <Text style={HistoryStyle.minorTitleText}>
                                            Người nhận:
                                    </Text>
                                        <Text style={HistoryStyle.normalText}>
                                            {' ' + item.TenNguoiNhan}
                                        </Text>
                                        {
                                            item.IsDaNhan &&
                                            <Text style={[HistoryStyle.minorTitleText, { color: Colors.GREEN_PANTON_369C }]}>
                                                {' ' + "(Đã đọc)"}
                                            </Text>
                                        }
                                    </Text>
                                    {
                                        item.LstThamGia.length > 0 &&
                                            <Text>
                                                <Text style={HistoryStyle.minorTitleText}>
                                                    Người tham gia:
                                                </Text>
                                                <Text style={HistoryStyle.normalText}>
                                                    {' ' + (item.LstThamGia || []).toString()}
                                                </Text>
                                            </Text>
                                    }

                                    {
                                        !util.isEmpty(item.MESSAGE) &&
                                            <Text>
                                                <Text style={HistoryStyle.minorTitleText}>
                                                    Nội dung:
                                            </Text>
                                                <Text style={HistoryStyle.normalText}>
                                                    {' ' + item.MESSAGE}
                                                </Text>
                                            </Text>
                                    }

                                </View>
                            ),
                        },
                    );
                }
                else {
                    data.push(
                        {
                            time: convertDateToString(item.create_at),
                            title: "Khởi tạo",
                            titleStyle: { color: 'rgba(0,0,0,95)', fontWeight: 'bold' },
                            description: `Người xử lý: ${item.TenNguoiXuLy}`,
                            renderIcon: () => <Icon name='ios-time-outline' />,
                            renderDetail: () => (
                                <View style={HistoryStyle.container}>
                                    <Text style={HistoryStyle.titleText}>
                                        Khởi tạo
                                    </Text>
                                    <Text>
                                        <Text style={HistoryStyle.minorTitleText}>
                                            Thời gian:
                                        </Text>
                                        <Text style={HistoryStyle.normalText}>
                                            {' ' + convertTimeToString(item.create_at)}
                                        </Text>
                                    </Text>
                                    <Text>
                                        <Text style={HistoryStyle.minorTitleText}>
                                            Người xử lý:
                                        </Text>
                                        <Text style={HistoryStyle.normalText}>
                                            {' ' + item.TenNguoiXuLy}
                                        </Text>
                                    </Text>
                                </View>
                            ),
                        }
                    )
                }
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
                                    marginHorizontal: 5,
                                    borderColor: '#909090',
                                    marginBottom: 8
                                }}
                                lineWidth={1}
                                dashLine={true}
                                styleContainer={{ marginTop: verticalScale(10) }}
                                data={this.state.data}
                                // isRenderSeperator
                                columnFormat={'two-column'}

                            />
                        )
                    }
                </Content>
            </Container>
        );
    }
}