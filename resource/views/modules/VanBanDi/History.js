/**
 * @description: lịch sử xử lý văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';

import { View, Text, FlatList } from 'react-native';

//lib
import { Container, Content } from 'native-base';
import util from 'lodash';
import renderIf from 'render-if';

//utilities
import { emptyDataPage, convertTimeToString, convertDateToString } from '../../../common/Utilities';
import { Colors, EMPTY_STRING, HTML_STRIP_PATTERN } from '../../../common/SystemConstant';
import { TimeLineStyle } from '../../../assets/styles/HistoryStyle';

export default class TimelineSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: props.info.lstLog
        }
    }

    keyExtractor = (item) => item.ID.toString()

    renderItem = ({ item, index }) => {
        let stepName = 'KHỞI TẠO'
        let message = 'KHỞI TẠO'
        if (item.step != null) {
            message = item.MESSAGE;
            if (item.IS_RETURN) {
                stepName = 'TRẢ VỀ';
            } else {
                stepName = util.toUpper(item.step.NAME);
            }
        }
        else {
            if (!!item.MESSAGE) {
                const stripedMessage = item.MESSAGE.replace(HTML_STRIP_PATTERN, EMPTY_STRING);
                stepName = stripedMessage;
                message = stripedMessage;
            }
            else {
                stepName = EMPTY_STRING;
                message = EMPTY_STRING;
            }
        }
        const isStartNode = index === this.state.logs.length - 1,
            isEndNode = index === 0;
        let innerIconCircleColor = Colors.GRAY,
            outerIconCircleColor = "#eaeaea";
        if (isEndNode) {
            innerIconCircleColor = Colors.MENU_BLUE;
            outerIconCircleColor = Colors.OLD_LITE_BLUE;
        }

        let ListJoinStr = (item.LstThamGia && item.LstThamGia.length > 0) ? item.LstThamGia.map(name => `- ${name}`).join(`\n`) : "";

        return (
            <View style={TimeLineStyle.container}>
                <View style={TimeLineStyle.iconSection}>
                    <View style={[TimeLineStyle.iconCircle, { backgroundColor: outerIconCircleColor }]}>
                        {
                            // <RNEIcon name={iconName} color={Colors.WHITE} type="material-community" size={moderateScale(20, 0.9)} />
                        }
                        <View style={[TimeLineStyle.innerIconCircle, { backgroundColor: innerIconCircleColor }]} />
                    </View>
                    {
                        !isStartNode && <View style={[TimeLineStyle.iconLine]} />
                    }
                </View>

                <View style={TimeLineStyle.infoSection}>
                    <View style={TimeLineStyle.infoHeader}>
                        <Text style={TimeLineStyle.infoText}>
                            {util.capitalize(stepName)}
                        </Text>
                        <Text style={TimeLineStyle.infoTimeline}>
                            {`${convertDateToString(item.create_at)} ${convertTimeToString(item.create_at)}`}
                        </Text>
                    </View>
                    <View style={TimeLineStyle.infoDetail}>
                        <View style={TimeLineStyle.infoDetailRow}>
                            <View style={TimeLineStyle.infoDetailLabel}>
                                <Text style={TimeLineStyle.infoDetailLabelText}>
                                    Người xử lý
                                </Text>
                            </View>

                            <View style={TimeLineStyle.infoDetailValue}>
                                <Text style={TimeLineStyle.infoDetailValueText}>
                                    {item.TenNguoiXuLy}
                                </Text>
                            </View>
                        </View>

                        {
                            renderIf(item.step != null)(
                                <View>
                                    <View style={TimeLineStyle.infoDetailRow}>
                                        <View style={TimeLineStyle.infoDetailLabel}>
                                            <Text style={TimeLineStyle.infoDetailLabelText}>
                                                Người nhận
                                            </Text>
                                        </View>

                                        <View style={TimeLineStyle.infoDetailValue}>
                                            <Text style={TimeLineStyle.infoDetailValueText}>
                                                {item.TenNguoiNhan}
                                            </Text>
                                            {
                                                item.IsDaXuly
                                                    ? <View style={TimeLineStyle.infoBtn}>
                                                        <Text style={TimeLineStyle.infoBtnText}>Đã xử lý</Text>
                                                    </View>
                                                    : item.IsDaNhan
                                                        ? <View style={TimeLineStyle.infoBtn}>
                                                            <Text style={TimeLineStyle.infoBtnText}>Đã nhận</Text>
                                                        </View>
                                                        : null
                                            }
                                        </View>
                                    </View>

                                    <View style={TimeLineStyle.infoDetailRow}>
                                        <View style={TimeLineStyle.infoDetailLabel}>
                                            <Text style={TimeLineStyle.infoDetailLabelText}>
                                                Người tham gia
                                            </Text>
                                        </View>

                                        <View style={TimeLineStyle.infoDetailValue}>
                                            {
                                                <Text style={TimeLineStyle.infoDetailValueText}>
                                                    {ListJoinStr}
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        <View style={TimeLineStyle.infoDetailRow}>
                            <View style={TimeLineStyle.infoDetailLabel}>
                                <Text style={TimeLineStyle.infoDetailLabelText}>
                                    Nội dung
                                </Text>
                            </View>

                            <View style={TimeLineStyle.infoDetailValue}>
                                <Text style={TimeLineStyle.infoDetailValueText}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{ paddingVertical: 20 }}>
                    <FlatList
                        data={this.state.logs}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ListEmptyComponent={emptyDataPage}
                    />
                </Content>
            </Container>
        );
    }
}